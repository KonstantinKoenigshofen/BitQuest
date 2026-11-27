# BitQuest

BitQuest ist eine statische Lernwebsite für Informatik. Die [Startseite](docs/index.html) führt zu den Themenbereichen [Softwarearchitektur](docs/lernen/softwarearchitektur/index.html), [Deep Learning](docs/lernen/deep-learning/index.html) und [Datenbanktechnologien](docs/lernen/datenbanktechnologien/index.html). Die leere [Videoseite](docs/videos/index.html) ist über ihre direkte Adresse erreichbar. Das BitQuest-Logo führt zur Startseite.

Die Website liegt in `docs/`. Ehemalige Themen-, Quest- und Lektionsadressen führen zur Startseite. Die Quellen für die Videoproduktion liegen separat in `production/videos/`.

## Lokal starten

Starte im Repository-Ordner einen lokalen Webserver mit Python.

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Öffne dann die [lokale Vorschau](http://127.0.0.1:8000/).

## Auf GitHub Pages veröffentlichen

Verwende den Ordner `/docs` im Branch `main` als Veröffentlichungsquelle.
