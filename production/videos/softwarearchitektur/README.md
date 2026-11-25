# BitQuest-Videos zur Softwarearchitektur

Die Reihe verwendet die Abfahrtstafel aus der BitQuest-Quest „Qualitätsziele in Entwürfe übersetzen“.

- **Folge 1 · Was ist Softwarearchitektur?** vergleicht zwei Entwürfe bei Netzausfall. Der Sprechtext steht in `episode.py`, die Szenen in `bild.py`. Gemini TTS verwendet `en-us-kira`.
- **Folge 2 · Qualitätsziele messbar machen** formuliert ein Qualitätsszenario und wertet drei Störungstests aus. Der Sprechtext steht in `qualitaetsziele.py`, die Szenen in `bild_qualitaetsziele.py`. Gemini TTS verwendet `Charon`.

## Erneut rendern

Die Tonarchive enthalten die deutschen Aufnahmen und die Zeitmarken. Der Export benötigt Python, Pillow, FFmpeg mit libx264 und die Windows-Schrift Segoe UI. Der Befehl erzeugt MP4, Titelbild, deutsche Untertitel und Kapitel. Ohne `--folge` rendert er Folge 1.

```powershell
python -B production/videos/softwarearchitektur/produzieren.py --folge 2 film pfad/zur/ausgabe
```

Für einen geänderten Sprechtext einen neuen Arbeitsordner verwenden. Die Aufnahme verwendet `GEMINI_API_KEY`. Der Schnitt braucht Faster-Whisper und ein lokales mehrsprachiges Modell. Der Export mit `--arbeit` aktualisiert das Tonarchiv.

```powershell
python -B production/videos/softwarearchitektur/produzieren.py --folge 2 aufnahme pfad/zur/arbeit
python -B production/videos/softwarearchitektur/produzieren.py --folge 2 schnitt pfad/zur/arbeit pfad/zum/whisper-modell
python -B production/videos/softwarearchitektur/produzieren.py --folge 2 film pfad/zur/ausgabe --arbeit pfad/zur/arbeit
```
