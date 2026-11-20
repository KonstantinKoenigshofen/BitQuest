"""Misst Satzanfänge in den Google-Aufnahmen und schneidet die Bildschritte."""

import argparse
from array import array
from difflib import SequenceMatcher
import json
from pathlib import Path
import re
import wave

from google_tts import cache_path
from render_season import LEAD, NEXT_LEAD, RATE
from season_storyboard import FILMS


def tokens(value):
    return re.findall(r"[a-zäöüß]+|[0-9]+", value.lower().replace("ß", "ss"))


def locate(film, words):
    expected, heard, heard_times = [], [], []
    shot_offsets, line_offsets = [], []
    for shot in film.shots:
        shot_offsets.append(len(expected))
        offsets = []
        for line in shot.lines:
            offsets.append(len(expected))
            expected.extend(tokens(line))
        line_offsets.append(offsets)
    for word in words:
        for token in tokens(word.word):
            heard.append(token)
            heard_times.append((word.start, word.end))
    comparison = SequenceMatcher(a=expected, b=heard, autojunk=False)
    edges = {}
    for a, b, size in comparison.get_matching_blocks():
        for shift in range(size):
            edges[a + shift] = b + shift
    if len(edges) < .72 * len(expected):
        raise ValueError(f"Nur {len(edges)} von {len(expected)} Sprechtextwörtern erkannt.")

    def nearby(index, side):
        found = index
        while found not in edges and 0 <= found < len(expected):
            found += side
        return edges.get(found)

    def bounds(index):
        before, after = nearby(index - 1, -1), nearby(index, 1)
        start = heard_times[after][0] if after is not None else heard_times[-1][1]
        end = heard_times[before][1] if before is not None else 0
        # Zwischen zwei Ankern können Zahlen als Ziffern transkribiert sein.
        if index not in edges and before is not None and after is not None and after > before + 1:
            start = heard_times[before + 1][0]
        return end, start

    clip_edges = [0]
    for offset in shot_offsets[1:]:
        before, after = bounds(offset)
        clip_edges.append((before + after) / 2)
    clip_edges.append(float("inf"))
    line_starts = [[bounds(offset)[1] for offset in offsets] for offsets in line_offsets]
    return clip_edges, line_starts


def split(model, film, source, cache, timing_dir):
    wav = source / f"{film.key}.wav"
    recognized, _ = model.transcribe(str(wav), language="de", word_timestamps=True, beam_size=4)
    segments = list(recognized)
    words = [word for segment in segments for word in segment.words]
    print(f"{film.key}: {''.join(word.word for word in words)}", flush=True)
    edges, line_starts = locate(film, words)
    with wave.open(str(wav), "rb") as narration:
        samples = array("h", narration.readframes(narration.getnframes()))
    timing = {}
    for step, shot in enumerate(film.shots):
        start = round(edges[step] * RATE)
        end = len(samples) if step == len(film.shots) - 1 else round(edges[step + 1] * RATE)
        if end <= start:
            raise ValueError(f"Ungültige Schnittpunkte für {film.key}/{shot.action}.")
        clip = samples[start:end]
        block = RATE // 100
        audible = next(i for i in range(0, len(clip), block)
                       if any(abs(sample) >= 160 for sample in clip[i:i + block]))
        trim = max(0, audible - 5 * block) / RATE
        lead = LEAD if step == 0 else NEXT_LEAD
        timing[shot.action] = [
            round(lead + max(0, instant - start / RATE - trim), 3)
            for instant in line_starts[step]
        ]
        path = cache_path(cache, film, shot)
        path.parent.mkdir(parents=True, exist_ok=True)
        with wave.open(str(path), "wb") as speech:
            speech.setparams((1, 2, RATE, 0, "NONE", "not compressed"))
            speech.writeframes(clip.tobytes())
    timing_dir.mkdir(parents=True, exist_ok=True)
    (timing_dir / f"{film.key}.json").write_text(json.dumps(timing, indent=2), encoding="utf-8")


def main():
    from faster_whisper import WhisperModel

    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--source", type=Path, required=True)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--timing", type=Path, required=True)
    parser.add_argument("--model", required=True, help="Lokales mehrsprachiges Faster-Whisper-Modell")
    parser.add_argument("--film", choices=[film.key for film in FILMS])
    args = parser.parse_args()
    model = WhisperModel(args.model, device="cpu", compute_type="int8", cpu_threads=4)
    for film in FILMS:
        if args.film in (None, film.key):
            split(model, film, args.source, args.cache, args.timing)


if __name__ == "__main__":
    main()
