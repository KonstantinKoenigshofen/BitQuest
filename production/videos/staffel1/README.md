# BitQuest Videos · Staffel 1

`season_storyboard.py` enthält den Sprechtext, die Bildschritte, die Denkpausen und die Zuordnung zu den Quests. In `scenes.py` und `visuals.py` liegen die bearbeitbaren Animationen und Vorschaubilder. Der Export nutzt den vorhandenen Pillow- und FFmpeg-Renderer.

Die WAV-Einsätze unter `ton/` stammen aus Google Gemini 3.8 Flash-Lite TTS mit der Katalogstimme `en-us-kira` und der Stilvorgabe „Friendly“. Jedes Archiv enthält auch die Satzanfänge für Animation und WebVTT. Die Animationen lassen sich mit den archivierten Aufnahmen ohne API-Zugriff erneut exportieren.

## Export

Voraussetzungen sind Python mit Pillow, FFmpeg mit libx264 und die Windows-Schrift Segoe UI. Führe den Export aus dem Stammordner in einen Vorschauordner aus.

```powershell
python -B production/videos/staffel1/render_season.py --output pfad/zur/vorschau
```

Mit `--film` kannst du einen einzelnen Film rendern. Nach der Prüfung kommen MP4, JPG und WebVTT nach `docs/videos/`. Aktualisiere bei Änderungen an der Laufzeit auch das jeweilige `time`-Element in der Videoseite. Der Dateiname des Bibliotheksfilms ist zugleich seine bisherige Video-Adresse.

## Aufnahme ändern

Lies die Stimme bei einer neuen Aufnahme aus der Google-Stimmenbibliothek und nutze den lokalen `GEMINI_API_KEY`. Für den zweiten Schritt ist Faster-Whisper mit einem lokalen mehrsprachigen Modell erforderlich.

```powershell
python -B production/videos/staffel1/google_tts.py --cache pfad/zur/aufnahme
python -B production/videos/staffel1/split_narration.py --source pfad/zur/aufnahme --cache pfad/zu/wav-einsaetzen --timing pfad/zu/zeitmarken --model pfad/zum/whisper-modell
python -B production/videos/staffel1/render_season.py --cache pfad/zu/wav-einsaetzen --timing pfad/zu/zeitmarken --output pfad/zur/vorschau
```

Prüfe die erkannte Transkription und die Schnitte, bevor du neue Aufnahmen übernimmst. Der Export aktualisiert die Tonarchive, wenn `--cache` gesetzt ist.
