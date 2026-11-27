# Warum Software in Module aufteilen? · frühere Fassung

Die erste Fassung verwendet die vom Nutzer bereitgestellte Google-AI-Studio-Aufnahme in `narration-google.wav`. `narration-google.json` enthält die Prüfsumme und die Audioabschnitte für die einzelnen Bildschritte. Die Schnitte liegen in Sprechpausen. Die Denkpausen aus dem Storyboard werden beim Rendern ergänzt.

Für eine Vorschau dieser früheren Fassung führe vom Stammordner des Projekts aus `python -B production/videos/module/render.py --output pfad/zur/vorschau --narration production/videos/module/narration-google.wav --timings production/videos/module/narration-google.json` aus. Der Renderer benötigt Pillow, FFmpeg mit libx264 und die Windows-Schrift Segoe UI.

Für eine lokal erzeugte Tonspur unterstützt der Renderer weiterhin [Piper](https://github.com/OHF-Voice/piper1-gpl) über `--piper-model "PFAD/de_DE-thorsten-medium.onnx"`. Dafür werden `piper-tts==1.8.0` und die Dateien `de_DE-thorsten-medium.onnx` sowie `de_DE-thorsten-medium.onnx.json` aus dem [Modellordner in Revision cf910fb](https://huggingface.co/rhasspy/piper-voices/tree/cf910fb/de/de_DE/thorsten/medium) benötigt. Ohne Audio- oder Modellargumente verwendet er die lokale Windows-Sprachsynthese.

`storyboard.py` enthält Sprechtext, Untertitel und Denkpausen. Ein Eintrag entspricht einem Bildschritt in `animation.py`. Dort liegen auch Zeichenfunktionen und Vorschaubild. `render.py` richtet die Bildwechsel und die WebVTT-Zeitmarken an der tatsächlichen Dauer der Sprachaufnahmen aus.

MP4, WebVTT und JPG landen im angegebenen Vorschauordner.
