# BitQuest

BitQuest ist eine deutschsprachige Lernwebsite. Die [Startseite](docs/index.html) führt zu neun Quests in Softwaredesign und drei in Softwarearchitektur. Jede Quest enthält vier aufeinander aufbauende Lektionen und ein abschließendes interaktives Praxisbeispiel.

## Themen und Quests

| Thema | Quest | Praxisbeispiel |
| --- | --- | --- |
| Softwaredesign | Module mit klarer Verantwortung entwerfen | Mahnregeln einer Stadtbibliothek kapseln und einen Anbieterwechsel vorbereiten |
| Softwaredesign | Verlässliche Schnittstellen entwerfen | Den Vertrag für eine Paketfach-Reservierung bei einem Timeout prüfen |
| Softwaredesign | Abhängigkeiten austauschbar machen | In einer Wander-App verschiedene Wetteranbieter und einen Test-Stub einsetzen |
| Softwaredesign | Verhalten mit Entwurfsmustern variieren | Einen Fahrradkurier als neue Versandstrategie ergänzen |
| Softwaredesign | Bestehenden Code refaktorieren | Eine Warenkorb-Preisberechnung mit Tests absichern und zerlegen |
| Softwaredesign | Fachliche Zustände modellieren | Die erlaubten Übergänge einer Rücksendung prüfen |
| Softwaredesign | Abstrakte Datentypen entwerfen | Eine Beratungswarteliste über einen Ringpuffer betreiben |
| Softwaredesign | Schnittstellen kompatibel weiterentwickeln | Einen Filter für neue Bibliotheks-Apps ergänzen und alte Aufrufe absichern |
| Softwaredesign | Fachliche Begriffe im Code modellieren | Bestellungen, Geldbeträge und Lieferadressen passend modellieren |
| Softwarearchitektur | Qualitätsziele in Entwürfe übersetzen | Abfahrtstafeln bei einem Netzausfall betreiben |
| Softwarearchitektur | Architekturentscheidungen dokumentieren | Die Architektur eines Redaktionssystems an den Betrieb übergeben |
| Softwarearchitektur | Einen Architekturstil auswählen | Für eine kleine Bestellplattform Schichten und Auslieferungsgrenzen wählen |

Die Themenwahl orientiert sich am Wissensbereich Software Engineering in CS2023 und an den Kapiteln zu Software Architecture und Software Design im SWEBOK. Jede Lektion verlinkt ihre Fachquelle. Die Praxisfälle verwenden fiktive, realitätsnahe Situationen. [CS2023 von ACM, IEEE Computer Society und AAAI](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm) · [IEEE SWEBOK v4.0a](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf)

Die Website liegt in `docs/` und verwendet HTML, CSS und JavaScript. `docs/softwaredesign.js` enthält die Softwaredesign-Quests. `docs/inhalt.js` definiert die Themen und die Quests zur Softwarearchitektur. Jeder Quest-Abschluss wird im jeweiligen Browser gespeichert.

## Lokal starten

Öffne `docs/index.html` im Browser. Für eine Vorschau über HTTP kannst du bei installiertem Python im Repository-Ordner diesen Befehl ausführen:

```powershell
python -m http.server 8000 --bind 127.0.0.1 --directory docs
```

Öffne anschließend [die lokale Vorschau](http://127.0.0.1:8000/). Die Vorschau und die veröffentlichte Website haben jeweils ihren eigenen Fortschritt.

## Auf GitHub Pages veröffentlichen

1. Committe die Dateien und pushe sie in den Branch `main` des GitHub-Repositorys.
2. Wähle auf GitHub unter **Settings → Pages → Build and deployment** die Quelle **Deploy from a branch**.
3. Wähle den Branch **main** und den Ordner **/docs** und speichere die Einstellung. GitHub zeigt die Website-Adresse an, sobald das Deployment verfügbar ist.

[GitHub-Dokumentation zu Veröffentlichungsquellen](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
