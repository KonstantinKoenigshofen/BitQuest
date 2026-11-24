"""Produktion des ersten konzeptorientierten Softwaredesign-Films."""

import argparse
import os
from pathlib import Path

from episode import FILM
import bild
from google_tts import synthesize
from render_season import production, render

CHAPTERS = (
    ("opening", "Was ist Softwaredesign?"),
    ("ticks", "Zwei mögliche Entwürfe"),
    ("think", "Zwei Sekunden ohne Bild"),
    ("responsibility", "Verantwortung und Kopplung"),
    ("change", "Eine Entwurfsgrenze abwägen"),
    ("transfer", "Transfer und Ausblick auf Schnittstellen"),
)

SOURCE = Path(__file__).resolve().parent


def subtitle_cues(sentence):
    """Teile an Sprechgruppen, ohne einzelne Restwörter aufblitzen zu lassen."""
    if len(sentence) <= 41:
        return [sentence]
    words = sentence.split()
    cuts = [(" ".join(words[:i]), " ".join(words[i:])) for i in range(1, len(words))]
    if not cuts:
        return [sentence]

    def cost(cut):
        a, b = cut
        punctuation = 26 if a.endswith((".", "?", "!")) else 12 if a.endswith(",") else 0
        return abs(len(a) - len(b)) - punctuation

    lines = [cut for cut in cuts if max(map(len, cut)) <= 41]
    if lines:
        return ["\n".join(min(lines, key=cost))]
    left, right = min(cuts, key=cost)
    return subtitle_cues(left) + subtitle_cues(right)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    voice = sub.add_parser("aufnahme")
    voice.add_argument("arbeit", type=Path)
    align = sub.add_parser("schnitt")
    align.add_argument("arbeit", type=Path)
    align.add_argument("modell", type=Path)
    export = sub.add_parser("film")
    export.add_argument("ausgabe", type=Path)
    export.add_argument("--arbeit", type=Path, help="Neue Aufnahme samt Schnittmarken übernehmen")
    args = parser.parse_args()

    if args.action == "aufnahme":
        synthesize(os.environ["GEMINI_API_KEY"], args.arbeit / "aufnahme", FILM)
    elif args.action == "schnitt":
        from faster_whisper import WhisperModel
        from split_narration import split

        model = WhisperModel(str(args.modell), device="cpu", compute_type="int8", cpu_threads=4)
        split(model, FILM, args.arbeit / "aufnahme", args.arbeit / "clips", args.arbeit / "timing")
    else:
        args.ausgabe.mkdir(exist_ok=True, parents=True)
        cache = args.arbeit / "clips" if args.arbeit else None
        timing = args.arbeit / "timing" if args.arbeit else None
        starts, end = render(
            FILM,
            args.ausgabe,
            cache,
            SOURCE / "ton",
            timing,
            draw_scene=bild.frame,
            draw_poster=bild.poster,
            split_caption=subtitle_cues,
        )
        cuts = [starts[scene] for scene, _ in CHAPTERS] + [end]
        cues = [
            f"{production.timecode(start)} --> {production.timecode(stop)}\n{title}"
            for (_, title), start, stop in zip(CHAPTERS, cuts, cuts[1:])
        ]
        chapters = args.ausgabe / f"{FILM.stem}.kapitel.vtt"
        chapters.write_text("WEBVTT\n\n" + "\n\n".join(cues) + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
