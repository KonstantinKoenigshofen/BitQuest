# BitQuest

BitQuest ist eine deutschsprachige Lernwebsite. Die [Startseite](docs/index.html) führt zu Softwaredesign, Softwarearchitektur und Deep Learning. Die Zahl der Lektionen richtet sich nach dem Inhalt der Quest. Jede Quest endet mit einem interaktiven Praxisbeispiel.

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
| Softwarearchitektur | Teilausfälle beherrschen | Einen Shop bei Ausfall des Versanddienstes weiter betreiben |
| Softwarearchitektur | Architekturvarianten bewerten | Zwei Entwürfe für einen Festival-Ticketverkauf anhand von Lasttestdaten vergleichen |
| Softwarearchitektur | Systeme über Ereignisse verbinden | Bestellereignisse an Lager und Versandplanung verteilen und Mehrfachzustellung behandeln |
| Softwarearchitektur | Verteilte Daten konsistent halten | Das letzte Fahrrad reservieren und Fehler bei der Zahlungsprüfung behandeln |
| Softwarearchitektur | Engpässe finden und gezielt skalieren | Eine überlastete Bildverarbeitung mithilfe simulierter Lastdaten verbessern |
| Softwarearchitektur | Sicherheitsgrenzen entwerfen | Den Zugriff auf Rechnungen im Kundenportal anhand von Rollen und Objektbezug prüfen |
| Softwarearchitektur | Architektur schrittweise migrieren | Einen Rechnungsdownload gestaffelt umstellen und den Rückweg planen |
| Deep Learning | Eine Lernaufgabe formulieren | Pixelbilder prüfen und konstante Vorhersageregeln vergleichen |
| Deep Learning | Die nötige Mathematik anwenden | Die Beiträge zweier Pixel zur Modellausgabe berechnen |
| Deep Learning | Ein neuronales Netz aufbauen | Mit einem kleinen Netz die Vorhersage einer 7 nachvollziehen |
| Deep Learning | Fehler messen und zurückverfolgen | Score, Kreuzentropie und Gradient durch Gewichtsänderungen vergleichen |
| Deep Learning | Ein Netz trainieren und das Training verstehen | Die Lernrate anhand berechneter Verlustverläufe beurteilen |
| Deep Learning | Überanpassung erkennen und begrenzen | Einen Modellstand anhand simulierter Validierungsdaten auswählen |
| Deep Learning | Ein Modell bewerten und Fehler untersuchen | Konfusionsmatrizen bei verschiedenen Schwellen und für eine Teilgruppe lesen |
| Deep Learning | Einen kleinen Ziffernerkenner selbst trainieren | Zwei Lernraten in einem Mehrschichtnetz vergleichen und eine eigene Pixelziffer prüfen |
| Deep Learning | Bilder mit CNNs erkennen | Räumliche Filter ausprobieren und zwei trainierte Modelle auf denselben Ziffernbildern vergleichen |
| Deep Learning | Text in Tokens und Embeddings übersetzen | BPE-Regeln auf eigenen Text anwenden und Einbettungsvektoren vergleichen |
| Deep Learning | Attention und Transformer verstehen | Attention-Gewichte und Kontextvektoren mit oder ohne kausale Maske berechnen |
| Deep Learning | Das nächste Token lernen und Text erzeugen | Ein Bigramm-Modell trainieren und seine Fortsetzungen mit Greedy und Sampling erzeugen |
| Deep Learning | Lieferzeiten mit Regression schätzen | Fehlergeraden mit und ohne Ausreißer vergleichen |
| Deep Learning | Ein Ziffernnetz auf Buchstaben übertragen | Drei Trainingsstrategien mit denselben Beispielen testen |
| Deep Learning | Tiefe Netze stabil trainieren | Schichtfaktor, Restpfad und Normalisierung einzeln ändern |
| Deep Learning | Sicherheit und Treffer von Vorhersagen vergleichen | Kalibrierung bei unterschiedlicher Helligkeit und Neigung prüfen |
| Deep Learning | Einen kleinen Transformer trainieren | Bigramm und Transformer live auf denselben Texten trainieren |
| Deep Learning | Vom Textbestand zur Antwort auf eine Anweisung | Daten bereinigen und die Lernsignale eines Sprachassistenten vergleichen |
| Deep Learning | Zeitreihen mit einem Gedächtnis vorhersagen | Messfolgen schrittweise lesen und die Tore von LSTM und GRU ändern |
| Deep Learning | Ziffern im Bild erkennen und ihre Pixel markieren | Labels, Objektrahmen und Pixelmasken am selben Bild vergleichen |
| Deep Learning | Bilder rekonstruieren und neue erzeugen | Autoencoder, VAE, GAN und Diffusion in Pixel-Simulationen erkunden |
| Deep Learning | Aus Bildpaaren lernen und Texte zuordnen | Bildpaare und Bild-Text-Paare im Merkmalsraum verschieben |
| Deep Learning | Einem Agenten mit Belohnungen einen Weg beibringen | Spielen, die Türbelohnung ändern und eine neue Strategie lernen lassen |
| Deep Learning | Modelle kleiner machen und weiter prüfen | Gewichte runden und Speicher, gemessene Zeit und Treffer vergleichen |

Die Themenwahl für Softwaredesign und Softwarearchitektur orientiert sich am Wissensbereich Software Engineering in CS2023 und am SWEBOK. Deep Learning führt vom Ziffernerkenner zu CNNs und anschließend in den Lernpfad für Sprachmodelle und LLMs. Jede Lektion verlinkt ihre Fachquelle. [CS2023](https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm) · [IEEE SWEBOK v4.0a](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf) · [Dive into Deep Learning](https://d2l.ai/) · [Stanford CS336](https://cs336.stanford.edu/)

Die Website liegt in `docs/` und verwendet HTML, CSS und JavaScript. `docs/inhalt.js` definiert die Themen und führt die Questlisten zusammen. `docs/lernaufgaben.js` enthält die problemorientierten Einstiege und Transferfälle. Die Lernexperimente laufen im Browser. Jeder Quest-Abschluss wird im jeweiligen Browser gespeichert.

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
