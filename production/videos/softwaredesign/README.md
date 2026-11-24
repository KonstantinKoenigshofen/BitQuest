# Was ist Softwaredesign? Vom Verhalten zur Struktur

Der Auftakt führt von einer Verhaltenszusage über Verantwortlichkeiten und Abhängigkeiten zur Frage, was eine Schnittstelle verspricht. Die Timer und die Wetteranzeige sind eigenständige Beispiele für denselben Gedankengang.

In `episode.py` stehen Sprechtext und Denkpausen, in `bild.py` die Zeichnungen und Bewegungen. Das Tonarchiv enthält die deutschen Aufnahmen mit Google Gemini TTS, Stimme `en-us-kira`, Stil „Friendly“, sowie die Zeitmarken. Die Produktion verwendet den vorhandenen BitQuest-Renderer.

## Erneut rendern

Vom Projektstamm aus erzeugt dieser Befehl MP4, WebVTT und Titelbild. Der Export mit der archivierten Aufnahme benötigt Python, Pillow, FFmpeg mit libx264 sowie die Windows-Schriften Segoe UI und Consolas.

```powershell
python -B production/videos/softwaredesign/produzieren.py film pfad/zur/vorschau
```

Für geänderten Sprechtext einen neuen Arbeitsordner verwenden. Der erste Schritt liest den Schlüssel aus `GEMINI_API_KEY`. Der zweite benötigt Faster-Whisper und ein lokales mehrsprachiges Modell. Der dritte übernimmt die geschnittene Aufnahme in das Tonarchiv.

```powershell
python -B production/videos/softwaredesign/produzieren.py aufnahme pfad/zur/arbeit
python -B production/videos/softwaredesign/produzieren.py schnitt pfad/zur/arbeit pfad/zum/whisper-modell
python -B production/videos/softwaredesign/produzieren.py film pfad/zur/vorschau --arbeit pfad/zur/arbeit
```
