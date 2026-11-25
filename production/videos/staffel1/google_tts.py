"""Erzeugt zusammenhängende Erzählspuren mit Gemini TTS und speichert sie als WAV."""

import argparse
from base64 import b64decode
from concurrent.futures import ThreadPoolExecutor
from hashlib import sha256
from io import BytesIO
import json
import os
from pathlib import Path
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
import wave

from season_storyboard import FILMS

MODEL = "gemini-3.8-flash-lite-tts"
VOICE = "en-us-kira"
STYLE = "Friendly. Warm, neugierig und ruhig erzählen. Hochdeutsche Aussprache mit natürlichen Satzpausen."
URL = "https://generativelanguage.googleapis.com/v1beta/interactions"


def request_audio(key, transcript, voice=VOICE):
    payload = {
        "model": MODEL,
        "input": [{"type": "user_input", "content": [{
            "type": "text", "text": transcript,
            "annotations": [{"type": "speech_metadata", "style": STYLE}],
        }]}],
        "response_format": {"type": "audio"},
        "generation_config": {"speech_config": [{"voice": voice}]},
    }
    request = Request(URL, json.dumps(payload).encode(), {
        "x-goog-api-key": key, "Content-Type": "application/json",
    })
    delays = (0, 5, 14, 35, 60)
    for attempt, delay in enumerate(delays):
        time.sleep(delay)
        try:
            with urlopen(request, timeout=110) as response:
                result = json.load(response)
            break
        except HTTPError as error:
            detail = json.loads(error.read()).get("error", {}).get("message", "")
            if error.code not in (429, 500, 502, 503, 504) or "per day" in detail or attempt == len(delays) - 1:
                raise RuntimeError(f"Gemini TTS meldet HTTP {error.code}: {detail}") from None
        except (URLError, TimeoutError):
            if attempt == len(delays) - 1:
                raise
    audio = [part["data"] for step in result["steps"] if step["type"] == "model_output"
             for part in step.get("content", []) if part["type"] == "audio" and part.get("data")]
    if not audio:
        raise ValueError("Gemini TTS hat keine Audiodaten geliefert.")
    wav = b64decode(audio[-1], validate=True)
    with wave.open(BytesIO(wav), "rb") as speech:
        if (speech.getframerate(), speech.getsampwidth(), speech.getnchannels()) != (24000, 2, 1):
            raise ValueError("Gemini TTS hat ein unerwartetes Audioformat geliefert.")
    return wav


def cache_path(folder, film, shot):
    transcript = " ".join(shot.lines)
    voice = getattr(film, "voice", None) or VOICE
    digest = sha256("\0".join((MODEL, voice, STYLE, transcript)).encode()).hexdigest()[:12]
    return folder / film.key / f"{shot.action}-{digest}.wav"


def synthesize(key, folder, film):
    path = folder / f"{film.key}.wav"
    if not path.is_file():
        transcript = " <short pause> ".join(" ".join(shot.lines) for shot in film.shots)
        raw = request_audio(key, transcript, getattr(film, "voice", None) or VOICE)
        path.parent.mkdir(parents=True, exist_ok=True)
        partial = path.with_suffix(".tmp")
        partial.write_bytes(raw)
        partial.replace(path)
        print(film.key, flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cache", type=Path, required=True)
    parser.add_argument("--workers", type=int, default=2)
    parser.add_argument("--film", choices=[film.key for film in FILMS])
    args = parser.parse_args()
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        parser.error("GEMINI_API_KEY fehlt.")
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        work = [executor.submit(synthesize, key, args.cache, film)
                for film in FILMS if args.film in (None, film.key)]
        for future in work:
            future.result()


if __name__ == "__main__":
    main()
