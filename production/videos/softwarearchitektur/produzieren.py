"""Erzeugt Architekturfolgen mit Untertiteln, Kapiteln und Titelbild."""

import argparse
import os
from pathlib import Path

import episode
from google_tts import synthesize
from render_season import production, render, subtitle_cues
import bild
import bild_qualitaetsziele
import qualitaetsziele

SOURCE = Path(__file__).resolve().parent
EPISODES = {"1": (episode, bild), "2": (qualitaetsziele, bild_qualitaetsziele)}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--folge", choices=EPISODES, default="1")
    actions = parser.add_subparsers(dest="action", required=True)
    voice = actions.add_parser("aufnahme")
    voice.add_argument("arbeit", type=Path)
    align = actions.add_parser("schnitt")
    align.add_argument("arbeit", type=Path)
    align.add_argument("modell", type=Path)
    export = actions.add_parser("film")
    export.add_argument("ausgabe", type=Path)
    export.add_argument("--arbeit", type=Path, help="Neue Aufnahme und Zeitmarken übernehmen")
    args = parser.parse_args()
    storyboard, drawing = EPISODES[args.folge]
    film = storyboard.FILM

    if args.action == "aufnahme":
        synthesize(os.environ["GEMINI_API_KEY"], args.arbeit / "aufnahme", film)
    elif args.action == "schnitt":
        from faster_whisper import WhisperModel
        from split_narration import split

        model = WhisperModel(str(args.modell), device="cpu", compute_type="int8", cpu_threads=4)
        split(model, film, args.arbeit / "aufnahme", args.arbeit / "clips", args.arbeit / "timing")
    else:
        args.ausgabe.mkdir(exist_ok=True, parents=True)
        starts, end = render(
            film,
            args.ausgabe,
            args.arbeit / "clips" if args.arbeit else None,
            SOURCE / "ton",
            args.arbeit / "timing" if args.arbeit else None,
            draw_scene=drawing.frame,
            draw_poster=drawing.poster,
            split_caption=subtitle_cues,
        )
        cuts = [starts[action] for action, _ in storyboard.CHAPTERS] + [end]
        cues = [
            f"{production.timecode(start)} --> {production.timecode(stop)}\n{title}"
            for (_, title), start, stop in zip(storyboard.CHAPTERS, cuts, cuts[1:])
        ]
        chapter_file = args.ausgabe / f"{film.stem}.kapitel.vtt"
        chapter_file.write_text("WEBVTT\n\n" + "\n\n".join(cues) + "\n", encoding="utf-8", newline="\n")


if __name__ == "__main__":
    main()
