"""Rendert die erste BitQuest-Staffel mit der vorhandenen Pillow/FFmpeg-Produktion."""

import argparse
from array import array
from html import escape
import json
from math import ceil
from pathlib import Path
import sys
import tempfile
import textwrap
from zipfile import ZIP_DEFLATED, ZipFile

from google_tts import cache_path
from season_storyboard import FILMS

SOURCE = Path(__file__).resolve().parent
sys.path.append(str(SOURCE.parent / "module"))

from animation import FPS
from scenes import Clock, frame, poster
import render as production

RATE = 24000
LEAD = .14
NEXT_LEAD = .06


def cue_starts(samples, lines):
    """Suche die Satzpausen im tatsächlichen Signal, gewichtet nach Textlänge."""
    if len(lines) == 1:
        return (0.0,)
    pcm = array("h", samples)
    block = RATE // 100
    duration = len(pcm) / RATE
    envelope = [sum(abs(sample) for sample in pcm[i:i + block]) / block
                for i in range(0, len(pcm), block)]
    total = sum(len(line) for line in lines)
    starts = [0.0]
    chars = 0
    scale = max(envelope)
    for line in lines[:-1]:
        chars += len(line)
        guess = chars / total * duration
        center = round(guess * 100)
        lo = max(4, round(starts[-1] * 100) + 55, center - 115)
        hi = min(len(envelope) - 10, center + 115)
        if lo >= hi:
            starts.append(max(starts[-1] + .2, guess))
            continue
        silence = min(range(lo, hi), key=lambda i:
                      sum(envelope[i - 3:i + 3]) / (6 * scale) + .035 * abs(i / 100 - guess))
        starts.append(silence / 100)
    return tuple(starts)


def slices(caption):
    lines = textwrap.wrap(caption, width=41, break_long_words=False, break_on_hyphens=False)
    for start in range(0, len(lines), 2):
        yield "\n".join(lines[start:start + 2])


def write_captions(path, film, segments, timing, split_caption=slices):
    cues = []
    for shot, segment in zip(film.shots, segments):
        origin = segment.first_frame / FPS
        lead = LEAD if segment.first_frame == 0 else NEXT_LEAD
        starts = timing[shot.action]
        ends = (*starts[1:], segment.speech_duration)
        for line_text, start, end in zip(shot.lines, starts, ends):
            chunks = list(split_caption(line_text))
            chars = sum(len(chunk) for chunk in chunks)
            cursor = max(start, lead)
            for chunk in chunks:
                until = min(end, cursor + (end - max(start, lead)) * len(chunk) / chars)
                cues.append(f"{production.timecode(origin + cursor)} --> {production.timecode(origin + until)}\n"
                            f"{escape(chunk, quote=False)}")
                cursor = until
    path.write_text("WEBVTT\n\n" + "\n\n".join(cues) + "\n", encoding="utf-8", newline="\n")


def load_segments(film, cache, timing):
    total_frames = 0
    segments = []
    for step, shot in enumerate(film.shots):
        path = cache_path(cache, film, shot)
        samples = production.spoken_audio(path, RATE)
        lead = LEAD if step == 0 else NEXT_LEAD
        spoken = lead + len(samples) / (2 * RATE)
        if shot.action not in timing:
            timing[shot.action] = [lead + start for start in cue_starts(samples, shot.lines)]
        cues = timing[shot.action]
        if len(cues) != len(shot.lines) or sorted(set(cues)) != cues or not 0 <= cues[0] <= cues[-1] < spoken:
            raise ValueError(f"Ungültige Spracheinsätze in {film.key}/{shot.action}.")
        frames = ceil((spoken + shot.hold) * FPS)
        animated = frames if shot.action in ("think", "freeze") else min(frames, ceil((cues[-1] + 2.55) * FPS))
        segments.append(production.Segment(shot.action, step, "", samples, total_frames, frames, spoken, animated))
        total_frames += frames
    if total_frames / FPS > 300:
        raise ValueError(f"{film.title} würde das Laufzeitlimit überschreiten.")
    return segments


def render(film, output, cache, archive_dir, timing_dir, *, draw_scene=frame, draw_poster=poster,
           split_caption=slices):
    with tempfile.TemporaryDirectory(prefix="bitquest-staffel-") as temp:
        work = Path(temp)
        archive = archive_dir / f"{film.key}.zip"
        if cache is None:
            with ZipFile(archive) as voice:
                for shot in film.shots:
                    path = cache_path(work, film, shot)
                    path.parent.mkdir(parents=True, exist_ok=True)
                    path.write_bytes(voice.read(path.name))
                timing = json.loads(voice.read("timing.json"))
            voice_cache = work
        else:
            markers = timing_dir / f"{film.key}.json" if timing_dir else None
            timing = json.loads(markers.read_text(encoding="utf-8")) if markers and markers.exists() else {}
            voice_cache = cache
        segments = load_segments(film, voice_cache, timing)
        duration = (segments[-1].first_frame + segments[-1].frames) / FPS
        print(f"{film.title} · {production.timecode(duration)}", flush=True)

        def draw(action, step, seconds, spoken, end):
            return draw_scene(film.key, action, Clock(seconds, tuple(timing[action]), spoken, end))

        audio = work / "narration.wav"
        production.audio_track(audio, segments, RATE, initial_lead=LEAD, lead=NEXT_LEAD)
        write_captions(output / f"{film.stem}.de.vtt", film, segments, timing, split_caption)
        draw_poster(film).save(output / f"{film.stem}.jpg", quality=92, optimize=True)
        production.encode(output / f"{film.stem}.mp4", audio, segments, draw_frame=draw)

        if cache is not None:
            archive_dir.mkdir(parents=True, exist_ok=True)
            temp_archive = archive.with_suffix(".tmp")
            with ZipFile(temp_archive, "w", ZIP_DEFLATED, compresslevel=7) as voice:
                voice.writestr("timing.json", json.dumps(timing, ensure_ascii=False, indent=2))
                for shot in film.shots:
                    path = cache_path(cache, film, shot)
                    voice.write(path, path.name)
            temp_archive.replace(archive)
        return {segment.scene: segment.first_frame / FPS for segment in segments}, duration


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--cache", type=Path, help="WAV-Dateien aus google_tts.py")
    parser.add_argument("--timing", type=Path, help="Ordner mit geprüften, optionalen Spracheinsätzen je Film")
    parser.add_argument("--audio", type=Path, default=SOURCE / "ton", help="Archivordner für die Originalaufnahmen")
    parser.add_argument("--film", choices=[film.key for film in FILMS])
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    for film in FILMS:
        if args.film in (None, film.key):
            render(film, args.output, args.cache, args.audio, args.timing)


if __name__ == "__main__":
    main()
