"""Rendert Video, deutsche WebVTT-Untertitel und Poster für BitQuest Videos."""

import argparse
from array import array
from dataclasses import dataclass
from hashlib import sha256
from html import escape
import json
from math import ceil
from pathlib import Path
import shutil
import subprocess
import tempfile
import wave

from animation import FPS, HEIGHT, WIDTH, frame, poster
from storyboard import STORY

SOURCE = Path(__file__).resolve().parent
WEB = SOURCE.parents[2] / "docs" / "videos"
STEM = "warum-software-in-module-aufteilen"
# Sobald die Bewegung endet, bleibt das letzte Bild dieses Schritts stehen.
MOTION = {
    ("conflict", 0): .6,
    ("split", 1): 1.60, ("split", 2): .95, ("split", 3): 1.60, ("split", 4): .95,
    ("merge", 0): 1.85, ("merge", 2): 1.23,
    ("send", 1): .8, ("send", 2): 1.65, ("send", 3): 1.7,
    ("solution", 3): 1.7,
}


@dataclass(frozen=True)
class Segment:
    scene: str
    step: int
    caption: str
    samples: bytes
    first_frame: int
    frames: int
    speech_duration: float
    motion_frames: int


def speak(folder, piper_model):
    lines = [
        {"id": f"{scene}-{step}", "spoken": beat.spoken or beat.text.replace("\n", " ")}
        for scene, beats in STORY.items()
        for step, beat in enumerate(beats)
    ]
    if piper_model is not None:
        from piper import PiperVoice, SynthesisConfig

        voice = PiperVoice.load(str(piper_model))
        settings = SynthesisConfig(length_scale=1.04)
        print(f"Piper · {piper_model.stem}", flush=True)
        for line in lines:
            path = folder / f"{line['id']}.wav"
            with wave.open(str(path), "wb") as speech:
                voice.synthesize_wav(line["spoken"], speech, syn_config=settings)
        return voice.config.sample_rate

    manifest = folder / "speech.json"
    manifest.write_text(json.dumps(lines, ensure_ascii=False), encoding="utf-8")
    windows_powershell = shutil.which("powershell.exe")
    if not windows_powershell:
        raise RuntimeError("Windows PowerShell wird für die lokale deutsche Stimme benötigt.")
    subprocess.run([
        windows_powershell, "-NoProfile", "-File", str(SOURCE / "synthesize.ps1"),
        "-Manifest", str(manifest), "-OutputDirectory", str(folder),
    ], check=True)
    return 16000


def import_narration(folder, audio_path, timings_path):
    timings = json.loads(timings_path.read_text(encoding="utf-8"))
    if sha256(audio_path.read_bytes()).hexdigest() != timings["audio_sha256"]:
        raise ValueError("Die Zeitmarken gehören zu einer anderen Audioaufnahme.")
    expected = [(scene, step) for scene, beats in STORY.items() for step in range(len(beats))]
    if [(entry["scene"], entry["step"]) for entry in timings["beats"]] != expected:
        raise ValueError("Die Zeitmarken passen nicht zu den Schritten im Storyboard.")
    with wave.open(str(audio_path), "rb") as recording:
        sample_rate = recording.getframerate()
        if (recording.getsampwidth(), recording.getnchannels(), recording.getcomptype()) != (2, 1, "NONE"):
            raise ValueError("Die Aufnahme muss eine unkomprimierte Mono-WAV mit 16 Bit sein.")
        samples = recording.readframes(recording.getnframes())
    duration = len(samples) / (2 * sample_rate)
    previous_end = 0
    for entry in timings["beats"]:
        start, end = entry["start"], entry["end"]
        if start < previous_end or end <= start or end > duration:
            raise ValueError(f"Ungültiger Audioabschnitt für {entry['scene']} / {entry['step']}.")
        first, last = round(start * sample_rate), round(end * sample_rate)
        path = folder / f"{entry['scene']}-{entry['step']}.wav"
        with wave.open(str(path), "wb") as speech:
            speech.setparams((1, 2, sample_rate, 0, "NONE", "not compressed"))
            speech.writeframes(samples[2 * first:2 * last])
        previous_end = end
    print(f"Importierte Tonspur · {audio_path.name}", flush=True)
    return sample_rate


def spoken_audio(path, sample_rate):
    with wave.open(str(path), "rb") as speech:
        if (speech.getframerate(), speech.getsampwidth(), speech.getnchannels()) != (sample_rate, 2, 1):
            raise ValueError(f"Unerwartetes WAV-Format in {path.name}")
        pcm = array("h", speech.readframes(speech.getnframes()))
    chunk = sample_rate // 100
    audible = [i for i in range(0, len(pcm), chunk) if any(abs(s) >= 160 for s in pcm[i:i + chunk])]
    if not audible:
        raise ValueError(f"Leere Sprachaufnahme in {path.name}")
    return pcm[max(0, audible[0] - 5 * chunk):audible[-1] + 10 * chunk].tobytes()


def timeline(folder, sample_rate):
    segments = []
    cursor = 0
    for scene, beats in STORY.items():
        for step, beat in enumerate(beats):
            samples = spoken_audio(folder / f"{scene}-{step}.wav", sample_rate)
            speech = len(samples) / (2 * sample_rate)
            reserve = .12 if not cursor else .04
            motion = MOTION.get((scene, step), 0)
            frames = ceil(max(reserve + speech + beat.pause, motion + .7) * FPS)
            motion_frames = frames if (scene, step) == ("question", 1) else ceil(motion * FPS)
            segments.append(Segment(scene, step, beat.text, samples, cursor, frames, speech + reserve, motion_frames))
            cursor += frames
    return segments


def audio_track(path, segments, sample_rate, initial_lead=.12, lead=.04):
    with wave.open(str(path), "wb") as speech:
        speech.setparams((1, 2, sample_rate, 0, "NONE", "not compressed"))
        for segment in segments:
            first_sample = round(segment.first_frame * sample_rate / FPS)
            last_sample = round((segment.first_frame + segment.frames) * sample_rate / FPS)
            padding = round((initial_lead if first_sample == 0 else lead) * sample_rate) * 2
            trailing = 2 * (last_sample - first_sample) - len(segment.samples) - padding
            speech.writeframesraw(bytes(padding) + segment.samples + bytes(trailing))


def timecode(seconds):
    millis = round(seconds * 1000)
    minutes, millis = divmod(millis, 60000)
    hours, minutes = divmod(minutes, 60)
    seconds, millis = divmod(millis, 1000)
    return f"{hours:02}:{minutes:02}:{seconds:02}.{millis:03}"


def captions(path, segments):
    cues = []
    for segment in segments:
        start = segment.first_frame / FPS
        end = (segment.first_frame + segment.frames) / FPS
        cues.append(f"{timecode(start)} --> {timecode(end)}\n{escape(segment.caption, quote=False)}")
    path.write_text("WEBVTT\n\n" + "\n\n".join(cues) + "\n", encoding="utf-8", newline="\n")


def encode(path, audio, segments, draw_frame=frame):
    duration = sum(segment.frames for segment in segments) / FPS
    ffmpeg = [
        "ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
        "-f", "rawvideo", "-pixel_format", "rgb24", "-video_size", f"{WIDTH}x{HEIGHT}",
        "-framerate", str(FPS), "-i", "pipe:0", "-i", str(audio), "-map", "0:v", "-map", "1:a",
        "-vf", "scale=out_color_matrix=bt709,setsar=1", "-c:v", "libx264", "-threads", "4",
        "-preset", "veryfast", "-crf", "20", "-profile:v", "high", "-pix_fmt", "yuv420p",
        "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
        "-af", f"loudnorm=I=-17:TP=-1.5:LRA=7,atrim=end={duration:.8f}", "-ar", "48000", "-c:a", "aac", "-b:a", "96k",
        "-metadata:s:a:0", "language=deu", "-movflags", "+faststart", str(path),
    ]
    with subprocess.Popen(ffmpeg, stdin=subprocess.PIPE) as encoder:
        if encoder.stdin is None:
            raise RuntimeError("FFmpeg kann keine Bilder empfangen.")
        for segment in segments:
            previous = -1
            for index in range(segment.frames):
                instant = min(index, segment.motion_frames)
                if instant != previous:
                    pixels = draw_frame(segment.scene, segment.step, instant / FPS,
                                        segment.speech_duration, segment.frames / FPS).tobytes()
                    previous = instant
                encoder.stdin.write(pixels)
            if segment.step == 0:
                print(f"{timecode(segment.first_frame / FPS)}  {segment.scene}", flush=True)
        encoder.stdin.close()
        if encoder.wait():
            raise RuntimeError("FFmpeg konnte das Video nicht erzeugen.")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=WEB, help="Zielordner für MP4, WebVTT und JPG")
    parser.add_argument("--piper-model", type=Path, help="Pfad zum lokalen ONNX-Modell einer Piper-Stimme")
    parser.add_argument("--narration", type=Path, help="Importierte WAV-Tonspur")
    parser.add_argument("--timings", type=Path, help="JSON mit den Bildschritten und ihren Audioabschnitten")
    args = parser.parse_args()
    if bool(args.narration) != bool(args.timings):
        parser.error("--narration und --timings müssen gemeinsam angegeben werden.")
    if args.narration and args.piper_model:
        parser.error("Wähle eine importierte Tonspur oder ein Piper-Modell.")
    output = args.output
    with tempfile.TemporaryDirectory(prefix="bitquest-video-") as directory:
        folder = Path(directory)
        if args.narration:
            sample_rate = import_narration(folder, args.narration, args.timings)
        else:
            sample_rate = speak(folder, args.piper_model)
        segments = timeline(folder, sample_rate)
        total = (segments[-1].first_frame + segments[-1].frames) / FPS
        audio = folder / "narration.wav"
        audio_track(audio, segments, sample_rate)
        captions(folder / f"{STEM}.de.vtt", segments)
        poster().save(folder / f"{STEM}.jpg", quality=91, optimize=True)
        print(f"Laufzeit {timecode(total)}", flush=True)
        encode(folder / f"{STEM}.mp4", audio, segments)
        output.mkdir(parents=True, exist_ok=True)
        for ext in ("mp4", "de.vtt", "jpg"):
            name = f"{STEM}.{ext}"
            shutil.copyfile(folder / name, output / name)
            print(output / name)


if __name__ == "__main__":
    main()
