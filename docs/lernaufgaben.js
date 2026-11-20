"use strict";

// Die Reihenfolge der Einstiege entspricht den bestehenden Lektionslinks.
const learningActivities = {
  "module-entwerfen": {
    experiments: { 2: "trace" },
    openings: [
      "In der Stadtbibliothek bekommt ein überfälliges Buch beim Verlängern und beim Mahnlauf zwei verschiedene Fristen. Wo würdest du die Regel unterbringen, damit beide Abläufe dieselbe Frist verwenden?",
      "Die Bibliothek pflegt ihre Fristen heute in einer Tabelle und morgen in einer Datei. Welche Aufrufer sollten sich beim Wechsel ändern müssen?",
      "Der Mahnlauf hat ein Buch und die Zahl der überfälligen Tage. Überlege, welche Antwort er braucht, um die passende Nachricht zu versenden.",
      "Morgen übernimmt ein neuer Mailanbieter den Versand. Überlege, welche Teile des Mahnlaufs du vor und nach dem Wechsel vergleichen würdest.",
    ],
    entry: {
      prompt: "Wo setzt du die gemeinsame Fristregel um?",
      options: ["In jedem Bildschirm einzeln.", "An einer Stelle, die beide Abläufe aufrufen."],
      answer: 1, clue: "Bei einer Änderung müsste die Bibliothek beide Bildschirmregeln gleichzeitig korrigieren.",
      explanation: "Beide Abläufe können dieselbe Regel aufrufen. Dann gibt es für dieselbe Eingabe nur eine Stelle, die die Frist bestimmt.",
    },
    transfer: {
      prompt: "Ein Kino berechnet in der App und an der Kasse einen Jugendrabatt. Nächsten Monat ändert sich die Altersgrenze. Wie schneidest du das Modul zu?",
      options: ["Ein Tarifmodul berechnet den Rabatt für beide Verkaufswege.", "App und Kasse pflegen je eine eigene Kopie der Rabattregel."],
      answer: 0, clue: "Spiele die Altersänderung durch. Wie viele Stellen müssten in deiner Lösung gleichzeitig geändert werden?",
      explanation: "Ein gemeinsames Tarifmodul bündelt die Regel. App und Kasse können ihre eigene Bedienoberfläche behalten.",
    },
  },
  "schnittstellen-entwerfen": {
    openings: [
      "Du fragst am Automaten ein Fach der Größe M an. Alle M-Fächer sind belegt. Was soll dein Handy erfahren, und was soll sich am Automaten ändern?",
      "Du reservierst ein Paketfach. Auf dem Handy erscheint eine Zeitüberschreitung. Bevor du erneut sendest, prüfe, was beim Automaten angekommen ist.",
      "Zwei Zusteller tippen fast gleichzeitig auf Reservieren. Es gibt nur noch ein passendes Fach. Welche Ergebnisse dürfen sie zusammen sehen?",
      "Dein Test meldet zweimal Erfolg. Beim Nachsehen sind aber zwei Fächer belegt. Welche Prüfung hätte den Fehler schon beim Test sichtbar gemacht?",
    ],
    experiments: { 2: "reservation" },
    entry: {
      prompt: "Die Größe M ist gültig. Wie soll die volle Station reagieren?",
      options: ["Sie meldet „belegt“ und belässt alle Reservierungen.", "Sie meldet „ungültige Größe“ und gibt ein bestehendes Fach frei."],
      answer: 0, clue: "Prüfe, welcher Teil der Eingabe gültig ist und welcher Teil vom aktuellen Bestand abhängt.",
      explanation: "Die gültige Größe bleibt gültig. Der Bestand erklärt die Ablehnung und bleibt dabei unverändert.",
    },
    transfer: {
      prompt: "Eine Fahrradbox zeigt vor dem Versuch drei belegte Plätze. Der erste Auftrag wird gespeichert, die Antwort fehlt. Welche Beobachtung entlarvt beim erneuten Senden desselben Schlüssels einen Fehler?",
      options: ["Vier Plätze sind belegt und die ursprüngliche Nummer wird bestätigt.", "Fünf Plätze sind belegt oder die erneute Antwort enthält eine andere Nummer."],
      answer: 1, clue: "Rechne ab drei belegten Plätzen. Wie viele neue Plätze darf derselbe Auftrag über beide Aufrufe hinweg belegen?",
      explanation: "Der erste Aufruf darf den Bestand auf vier erhöhen. Der zweite soll denselben Beleg bestätigen und keine weitere Belegung erzeugen.",
    },
  },
  "abhaengigkeiten-austauschen": {
    experiments: { 2: "trace" },
    openings: [
      "Deine Wander-App rät ab 60 Prozent Regenwahrscheinlichkeit von einer Tour ab. Ein neuer Dienst liefert 0,65 statt 65. Wo würdest du die Umrechnung unterbringen?",
      "Zwei Wetterdienste melden denselben Regenwert in unterschiedlichen Formaten. Entscheide, welchen Wert die Tourenlogik von beiden sehen soll.",
      "Im Test soll die Wander-App ohne Internet laufen. Überlege, an welcher Stelle du die echte Wetterquelle gegen eine feste Antwort austauschen kannst.",
      "Bei exakt 60 Prozent soll die Warnung erscheinen. Wie bringst du deine App dazu, für diesen Test immer genau diesen Wert zu erhalten?",
    ],
    entry: {
      prompt: "Welcher Teil sollte das Format des neuen Dienstes kennen?",
      options: ["Die Warnregel der Wander-App.", "Eine Übersetzung zwischen Wetterdienst und Warnregel."],
      answer: 1, clue: "Überlege, welche Änderung du wiederholen müsstest, wenn ein dritter Anbieter erneut ein anderes Format hat.",
      explanation: "Die Übersetzung liefert 65 Prozent. Die Warnregel kann weiter mit ihrer gemeinsamen Einheit rechnen.",
    },
    transfer: {
      prompt: "Ein zweiter Kartenanbieter liefert neue Entfernungen in Metern. Die Wanderregel erwartet Kilometer. Wie prüfst du die Umstellung?",
      options: ["Den Adapter mit 1 500 m → 1,5 km testen und die Wanderregel separat mit festen Kilometern.", "Die Wanderregel im Test das Anbieterformat erraten lassen."],
      answer: 0, clue: "Wenn der Grenzwert falsch reagiert, möchtest du Übersetzungsfehler von Regelfehlern unterscheiden.",
      explanation: "Der Adapter testet die Einheit. Ein Ersatz für die Datenquelle gibt der Wanderregel genau die Werte, die sie prüfen soll.",
    },
  },
  "strategien-variieren": {
    experiments: { 3: "trace" },
    openings: [
      "Ein Shop ergänzt einen Fahrradkurier. Vorschau und Bestellabschluss sollen beide 690 Cent anzeigen. Wo würdest du die neue Berechnung ergänzen?",
      "Abholung kostet 0 Cent, Express 990 Cent. Überlege, welche gemeinsame Zusage beide Berechnungen an den Warenkorb machen können.",
      "Die Expressberechnung liefert 990 Cent. Nach Auswahl von Express zeigt der Warenkorb trotzdem 490 Cent. Entscheide, welche Verbindung du zuerst prüfst.",
    ],
    entry: {
      prompt: "Welche Änderung hält Vorschau und Bestellabschluss beim Kurier zusammen?",
      options: ["Beide rufen dieselbe auswählbare Kurierregel auf.", "Beide erhalten unabhängig eine neue Kurierformel."],
      answer: 0, clue: "Stell dir vor, der Preis steigt später von 690 auf 750 Cent. Wo musst du ihn korrigieren?",
      explanation: "Eine gemeinsame Kurierregel hält die Berechnung an einer Stelle. Die beiden Bestellschritte nutzen ihr Ergebnis.",
    },
    transfer: {
      prompt: "Ein Ticketshop ergänzt einen Gruppentarif. Vorschau und Rechnung verwenden danach dieselbe Tarifregel. Welche zwei Prüfungen trennen Berechnung und Auswahl?",
      options: ["Nur prüfen, ob „Gruppe“ in der Tarifliste steht.", "Den Gruppenpreis isoliert berechnen lassen und im Bestellablauf prüfen, ob „Gruppe“ diese Regel auswählt."],
      answer: 1, clue: "Eine richtige Formel kann hinter einer falschen Zuordnung stecken.",
      explanation: "Der isolierte Test prüft den Preis. Der zweite Test prüft, welche Berechnung die Auswahl tatsächlich auslöst.",
    },
  },
  "code-refaktorieren": {
    experiments: { 2: "discount" },
    openings: [
      "Du willst eine unübersichtliche Warenkorbfunktion zerlegen. Genau bei 100 Euro gibt sie Rabatt. Würdest du beim Umbau gleichzeitig die Grenze auf 90 Euro ändern?",
      "Seit einem Umbau behandeln die alte und die neue Kasse den Rabatt unterschiedlich. Finde mit möglichst wenigen Testkäufen einen Betrag, der den Fehler beweist.",
      "Nach dem Auslagern der Rabattrechnung ändert sich der Gesamtpreis um einen Cent. Überlege, wie du den verantwortlichen Schritt findest.",
      "Der alte Preis stimmt nach dem Umbau wieder in allen Tests. Der Shop möchte jetzt eine andere Rabattgrenze. Was gehört in den nächsten Schritt?",
    ],
    entry: {
      prompt: "Was vergleichst du zuerst?",
      options: ["Vorher und nachher bei denselben Warenkörben und unveränderter Preisregel.", "Den alten Warenkorb mit der neuen Rabattregel bei anderen Preisen."],
      answer: 0, clue: "Bei mehreren Änderungen lässt sich eine Preisabweichung schwer einer Ursache zuordnen.",
      explanation: "Hältst du die Preisregel fest, kann jede Abweichung auf den Umbau zurückgeführt und untersucht werden.",
    },
    transfer: {
      prompt: "Ein Parkhaus rundet jede begonnene Stunde auf. Du zerlegst den Tarifcode. Welches Testpaar deckt einen Rundungsfehler an der Grenze am besten auf?",
      options: ["Je ein Fahrzeug mit drei und sechs vollen Stunden.", "Ein Fahrzeug mit genau 60 Minuten und eines mit 61 Minuten."],
      answer: 1, clue: "Die Tarifstufe wechselt direkt nach der vollen Stunde.",
      explanation: "Genau 60 Minuten ergeben eine Stunde. 61 Minuten ergeben zwei. Derselbe Vergleich vor und nach dem Umbau macht eine Änderung sichtbar.",
    },
  },
  "zustaende-modellieren": {
    experiments: { 3: "trace" },
    openings: [
      "Eine Rücksendung wartet im Lager. Eine Mitarbeiterin bestätigt die Prüfung. Welcher Teil beschreibt die Lage, und welcher löst ihre Änderung aus?",
      "Du klickst bei zwei Rücksendungen auf Freigeben. Eine wurde geprüft, die andere ist noch unterwegs. Soll derselbe Klick beide weiterbringen?",
      "Der Abschlussknopf wurde zweimal gedrückt. In der Liste steht weiterhin „abgeschlossen“. Überlege, welche andere Wirkung du überprüfen musst.",
      "Eine Rücksendung lässt sich über den normalen Ablauf abschließen. Wähle zusätzlich einen Versuch, der eine Abkürzung testen würde.",
    ],
    entry: {
      prompt: "Was ändert sich bei der Bestätigung?",
      options: ["Die Rücksendung wechselt von „in Prüfung“ zu „geprüft“.", "Die Rücksendung bleibt in jedem Fall „in Prüfung“ und „bestätigt“ beschreibt nur die Anzeige."],
      answer: 0, clue: "Trenne die Handlung der Mitarbeiterin von der Lage direkt danach.",
      explanation: "Die Bestätigung ist das auslösende Ereignis. „Geprüft“ ist die neue Lage, anhand derer das System weitere Aktionen beurteilt.",
    },
    transfer: {
      prompt: "Ein Konzertticket wird am Eingang gescannt und öffnet das Drehkreuz. Du scannst dasselbe bereits verwendete Ticket erneut. Was prüfst du?",
      options: ["Nur, ob das Display weiterhin „verwendet“ zeigt.", "Ob das Ticket verwendet bleibt und kein zweiter Öffnungsimpuls entsteht."],
      answer: 1, clue: "Ein gleichbleibender Zustand verrät dir nichts über eine erneut ausgeführte Wirkung.",
      explanation: "Der zweite Scan soll das Drehkreuz nicht öffnen. Prüfe die Ausgabe und zähle deshalb auch die Öffnungsimpulse.",
    },
  },
  "datentypen-entwerfen": {
    experiments: { 5: "ring" },
    openings: [
      "Im Wartezimmer stehen zuerst A und dann B auf der Liste. Der Bildschirm aktualisiert sich. Was soll er zeigen, und wer soll danach noch warten?",
      "Ein Mitarbeitender ruft A wirklich auf. Der Bildschirm hatte A vorher schon angezeigt. Welche der beiden Aktionen darf A aus der Liste entfernen?",
      "Die Wartetickets stehen intern in vier nummerierten Plätzen. Zwei Tickets liegen über das Ende verteilt. Überlege, was die Anzeige über diese Plätze wissen muss.",
      "Eine neue Speicherung zeigt noch dieselbe Warteliste. Wie würdest du prüfen, dass nach mehreren Aufrufen weiterhin die richtige Person zuerst drankommt?",
      "Am Schalter warten A und B. Im Speicher liegt A auf Platz 3 und B auf Platz 0. Wer kommt zuerst dran?",
    ],
    entry: {
      prompt: "Was soll beim bloßen Aktualisieren passieren?",
      options: ["A anzeigen und A sowie B weiter warten lassen.", "A anzeigen und sofort entfernen."],
      answer: 0, clue: "Eine automatische Aktualisierung kann mehrfach laufen, bevor jemand aufgerufen wird.",
      explanation: "Die Anzeige liest das erste Ticket. Nur der Aufruf am Schalter nimmt es aus der Warteliste.",
    },
    transfer: {
      prompt: "Ein Drucker reiht A, B und C ein. Ein Statusfenster liest zweimal das erste Dokument. Danach verarbeitet der Drucker eines. Welche Restliste erwartest du?",
      options: ["C.", "B, C.", "A, B, C."],
      answer: 1, clue: "Gehe die beiden Lesevorgänge und den einen verändernden Vorgang einzeln durch.",
      explanation: "Die Leseschritte lassen die Reihe unverändert. Die Verarbeitung entfernt A, damit warten B und C.",
    },
  },
  "schnittstellen-weiterentwickeln": {
    experiments: { 2: "trace" },
    openings: [
      "Eine alte Bibliotheks-App lädt eine Liste mit allen Büchern. Nach einem Update fehlen ausgeliehene Titel, obwohl der Aufruf erfolgreich ist. Hat sich etwas für die App geändert?",
      "Eine neue App will nur verfügbare Bücher anzeigen. Die alte App sendet keinen Filter. Lege fest, welche Ergebnisse beide Aufrufe mit demselben Bestand erhalten.",
      "Die Bibliothek will einen geänderten Standard veröffentlichen. Einige Geräte bleiben mehrere Monate auf der alten App. Überlege, wie beide Aufrufe unterscheidbar bleiben.",
      "Dein Testbestand enthält nur verfügbare Titel. Welche zusätzliche Eingabe brauchst du, damit ein falsch gesetzter Standard im Testergebnis sichtbar wird?",
    ],
    entry: {
      prompt: "Wie kann die Schnittstelle den Wunsch der neuen App erfüllen?",
      options: ["Verfügbare Bücher immer als neuen Standard liefern.", "Den Filter nur anwenden, wenn die App ihn ausdrücklich setzt."],
      answer: 1, clue: "Vergleiche die Ergebnislisten für einen alten Aufruf mit und ohne ausgeliehene Bücher.",
      explanation: "Die alte App behält die bisherige Liste. Die neue App aktiviert den Filter gezielt.",
    },
    transfer: {
      prompt: "Eine Kalender-API liefert bisher auch abgesagte Termine. Eine neue App will diese ausblenden. Welche Testdaten und Aufrufe decken eine versehentliche Standardänderung auf?",
      options: ["Nur aktive Termine und nur ein Aufruf mit Filter.", "Einen aktiven und einen abgesagten Termin sowie Aufrufe mit und ohne ausdrücklichen Filter."],
      answer: 1, clue: "Bei ausschließlich aktiven Terminen können beide Antworten zufällig gleich aussehen.",
      explanation: "Der abgesagte Termin macht den Unterschied sichtbar. Er muss ohne Filter enthalten und mit Filter ausgeblendet sein.",
    },
  },
  "fachbegriffe-modellieren": {
    experiments: { 4: "trace" },
    openings: [
      "Der Shop bestätigt eine leere Bestellung. Überlege, wo du die Regel festhältst, die dafür mindestens eine Position verlangt.",
      "Zwei getrennte Bestellungen enthalten dieselbe Ware. Entscheide, woran der Shop erkennt, welche davon gerade bezahlt wurde.",
      "Im Warenkorb stehen 500 Cent und 4 US-Dollar. Was müsstest du klären, bevor du einen Gesamtbetrag ausgibst?",
      "Eine Kundin zieht nach der Bestellung um. Überlege, welche Adresse auf dem bereits angekündigten Paket stehen soll.",
    ],
    entry: {
      prompt: "Wo muss „mindestens eine Position“ gelten?",
      options: ["Beim Bestätigen der Bestellung, egal von welcher Oberfläche der Aufruf kommt.", "Nur beim Anzeigen der Schaltfläche in der App."],
      answer: 0, clue: "Der Shop kann Bestellungen später auch über einen anderen Kanal annehmen.",
      explanation: "Die Bestellung trägt die Regel für ihre Bestätigung. Dadurch gilt sie für jeden Pfad zum selben Zustandswechsel.",
    },
    transfer: {
      prompt: "Eine Reisende ändert ihre Kontaktadresse. Ein ausgestellter Fahrschein enthält die beim Kauf vereinbarten Rechnungsdaten. Wie modellierst du diese beiden Teile?",
      options: ["Der Fahrschein behält seine Nummer und speichert die vereinbarten Rechnungsdaten als eigenen Wert.", "Der Fahrschein liest seine Rechnungsdaten bei jedem Abruf aus dem aktuellen Profil."],
      answer: 0, clue: "Spiele einen späteren Profilwechsel durch. Welche Daten sollen auf einem bereits ausgestellten Beleg stehen?",
      explanation: "Die Nummer identifiziert denselben Fahrschein. Ein gespeicherter Wert hält die damaligen Rechnungsdaten fest.",
    },
  },
  "qualitaet-entwerfen": {
    openings: [
      "Am Bahnhof fällt mitten im Berufsverkehr die Fahrplanverbindung aus. Vor der Tafel warten Menschen. Welche sichtbare Reaktion könntest du nach spätestens zwei Sekunden prüfen?",
      "Die Tafel kann eine alte Abfahrt anzeigen oder sofort auf die Störung hinweisen. Prüfe, was Fahrgäste aus beiden Anzeigen ableiten können.",
      "Der Bus soll um 08:17 Uhr abfahren. Um 08:12 Uhr reißt die Verbindung ab. Was sollen Fahrgäste vier und genau fünf Minuten später lesen?",
      "Beim Test erscheint die erste Reaktion nach 1,5 Sekunden, der alte Fahrplan bleibt aber sechs Minuten sichtbar. Prüfe beide Zeitgrenzen getrennt.",
    ],
    experiments: { 1: "departure", 3: "departure" },
    transfer: {
      prompt: "Eine freie Fahrradbox wird um 10:00 Uhr gemeldet. Das Display darf die letzte Meldung bei Ausfall weniger als zwei Minuten lang anzeigen. Was erwartest du um genau 10:02 Uhr?",
      options: ["„Eine Box frei“ bis zum Ende der Minute.", "„Aktuelle Belegung unbekannt“."], answer: 1,
      clue: "Die Grenze gilt ab dem Empfang. „Weniger als zwei“ schließt genau zwei Minuten aus.",
      explanation: "Ab 10:02 Uhr fehlt ein verwendbarer Stand. Daraus lässt sich weder „frei“ noch „alles belegt“ folgern.",
    },
  },
  "architektur-dokumentieren": {
    experiments: { 2: "trace" },
    openings: [
      "Am Montag fragt ein neues Teammitglied, warum der Bildimport in einer Warteschlange landet. Welche Information würdest du zur Entscheidung dazuschreiben?",
      "Die Redaktion sieht „angenommen“, aber noch kein Vorschaubild. Das Betriebsteam will gleichzeitig wissen, wo es mehr Worker starten kann. Welche Zeichnung hilft wem?",
      "Artikel speichern in 0,7 Sekunden, doch Bildvorschauen brauchen vier Minuten. Lege fest, welche Beobachtung du mit welchem Ziel vergleichst.",
    ],
    entry: { prompt: "Welche Notiz hilft bei einer späteren Neubewertung?", options: ["„Wir nehmen eine Warteschlange.“", "„Uploads bremsen das Speichern. Die Warteschlange trennt diese Arbeit, bringt aber Wartezeit.“"], answer: 1, clue: "Die spätere Leserin kennt das damalige Problem womöglich nicht.", explanation: "Mit Anlass und Folge lässt sich prüfen, ob die Entscheidung noch zum aktuellen Betrieb passt." },
    transfer: { prompt: "Eine Schulwebsite speichert Zeugnisse im Hintergrund. Die IT muss wissen, auf welchem Rechner zusätzliche Prozesse starten können. Was zeichnest du?", options: ["Die Zuordnung der laufenden Prozesse zu ihrer Infrastruktur.", "Nur die Reihenfolge der Bildschirmmeldungen."], answer: 0, clue: "Die Frage betrifft den Ort des Betriebs.", explanation: "Die Verteilungssicht zeigt, wo die Prozesse laufen und wo zusätzliche Instanzen gestartet werden können." },
  },
  "architekturstil-auswaehlen": {
    openings: [
      "Eine Bestellung ist bereits zum Versand freigegeben. Die Kundin drückt trotzdem auf Stornieren. Wo muss die Ablehnung gelten, damit auch ein anderer Aufrufweg dieselbe Regel einhält?",
      "Das Lagerteam und das Versandteam ändern verschiedene Regeln, veröffentlichen aber gemeinsam. Überlege, welche Grenzen du im Code auch bei einem gemeinsamen Paket ziehen kannst.",
      "Der Versand soll morgen allein ein Update bekommen. Beim Start erwartet er eine andere Tabellenspalte als der Bestelldienst. Wo liegt die Abhängigkeit?",
      "Der Versand bekommt ein eigenes Team und muss häufiger ausliefern. Vergleiche, was ein eigener Dienst erleichtert und was er zusätzlich kostet.",
    ],
    experiments: { 4: "tradeoffs" },
    entry: { prompt: "Wo gehört die Stornierungsregel hin?", options: ["In die Bestelllogik, die alle Aufrufwege verwenden.", "Nur hinter den Knopf im Browser."], answer: 0, clue: "Auch ein Aufruf über den Kundendienst muss die Regel durchlaufen.", explanation: "Die fachliche Regel gilt beim tatsächlichen Stornieren, unabhängig von der Oberfläche." },
    transfer: { prompt: "Ein kleines Kursportal liefert Anmeldung und E-Mail gemeinsam aus. Ein späteres Team muss E-Mail unabhängig veröffentlichen. Welcher Grund passt zur Prüfung einer Ausgliederung?", options: ["Unabhängige Releases lösen jetzt ein konkretes Teamproblem.", "Zwei Module müssen immer zwei Anwendungen sein."], answer: 0, clue: "Welche Fähigkeit braucht das neue Team im Betrieb tatsächlich?", explanation: "Unabhängige Auslieferung kann den Mehraufwand eines Dienstes begründen. Fachmodule allein erfordern keine getrennten Releases." },
  },
  "teilausfaelle-beherrschen": {
    openings: [
      "Ein Shop hat die Bestellung angenommen. Der Versanddienst antwortet nicht. Überlege, was nach einem Neustart erhalten bleiben muss.",
      "Der Versanddienst antwortet nach zwei Sekunden immer noch nicht. Kann das Paketlabel trotzdem bereits erstellt sein?",
      "Der Versanddienst hat zehn Minuten lang nicht geantwortet. Die ersten Anfragen nach seiner Rückkehr können ihn erneut belasten. Überlege, ob du alles auf einmal sendest oder erst mit wenigen Anfragen prüfst, ob er wieder erreichbar ist.",
      "Die Bestellseite antwortet wieder schnell. Zehn Sendungen wurden seit einer Stunde nicht vorbereitet. Welche Zahl sollte der Betrieb jetzt ansehen?",
    ],
    experiments: { 1: "tradeoffs", 3: "trace" },
    entry: { prompt: "Was hältst du vor der Erfolgsanzeige dauerhaft fest?", options: ["Nur die Farbe des Statussymbols.", "Die Bestellung und die noch ausstehende Arbeit."], answer: 1, clue: "Stell dir direkt danach einen Neustart vor.", explanation: "Die offene Versandaufgabe bleibt auffindbar. Der Shop kann die Annahme von der späteren Versandbestätigung trennen." },
    transfer: { prompt: "Eine Fotodruck-App bestätigt den Auftrag, obwohl der Etikettendienst offline ist. Nach dem Neustart steht das noch offene Etikett im Auftrag. Welche Anzeige beschreibt die Lage?", options: ["„Druckauftrag angenommen, Etikett steht aus.“", "„Etikett gedruckt.“"], answer: 0, clue: "Linke und rechte Seite des Ablaufs haben verschiedene Fortschritte.", explanation: "Die Bestätigung des Auftrags ist gesichert. Der Etikettenschritt ist noch offen und wird später fortgesetzt." },
  },
  "architekturvarianten-bewerten": {
    openings: [
      "Zwei Ticketshops antworten im Schnitt schnell. Einer lehnt dabei viele Reservierungen sofort ab. Welche Zahl fehlt dir für den Vergleich?",
      "Eine Variante ist billiger im Betrieb, vergibt aber denselben Sitz gelegentlich zweimal. Entscheide vor der Bewertung, was überhaupt verhandelbar ist.",
      "Ein Lasttest verteilt Käufe über alle Blöcke. Beim echten Vorverkauf wollen fast alle denselben Block. Wie würdest du den Test ändern?",
      "Zwei Entwürfe bestehen den Lasttest. Wähle ein Ziel, das im nächsten Quartal am wichtigsten ist, und prüfe, welchen Betriebspreis die Wahl hat.",
    ],
    experiments: { 4: "tradeoffs" },
    entry: { prompt: "Worauf würdest du neben der Antwortzeit schauen?", options: ["Auf den Anteil erfolgreich abgeschlossener Reservierungen.", "Nur auf die kürzeste gemessene Antwortzeit."], answer: 0, clue: "Auch eine sofortige Fehlermeldung senkt die gemessene Antwortzeit.", explanation: "Antwortzeit und fachlicher Erfolg beantworten verschiedene Fragen. Vergleiche beide unter derselben Last." },
    transfer: { prompt: "Bei einer Kursanmeldung erledigen beide Entwürfe 98 von 100 Anfragen. Variante A ist günstiger. B hat mehr Kapazitätsreserve für den Semesterstart. Welche Aussage trägt eine Entscheidung?", options: ["A ist immer richtig, weil sie günstiger ist.", "A passt bei knappen Betriebsmitteln, B bei priorisierter Lastreserve. Die 98 Erfolge allein entscheiden nicht."], answer: 1, clue: "Beide erfüllen denselben gemessenen Erfolg. Was unterscheidet sie für den anstehenden Einsatz?", explanation: "Die Wahl hängt davon ab, welches Ziel den Ausschlag gibt und welchen Nachteil das Team akzeptiert." },
  },
  "systeme-ueber-ereignisse-verbinden": {
    experiments: { 3: "trace" },
    openings: [
      "Eine Bestellung ist bestätigt. Das Lager soll sie sehen, bevor jemand den Versand plant. Welche Nachricht beschreibt etwas, das tatsächlich schon passiert ist?",
      "Lager und Versandplanung brauchen dieselbe Bestätigung. Was passiert, wenn sich beide um genau einen Eintrag in derselben Arbeitsliste streiten?",
      "Das Lager speichert die Pickliste und stürzt ab, bevor es „erledigt“ meldet. Die Nachricht kommt wieder. Spiele durch, wie du eine zweite Liste verhinderst.",
      "Die Bestellung ist gespeichert. Genau vor dem Senden schaltet sich der Rechner aus. Welche Information muss beim Neustart noch da sein?",
      "Die Versandplanung hat bereits den Status „storniert“ aus Version 5. Danach kommt Version 4 an. Welche Zahl sollte entscheiden, welcher Stand gilt?",
    ],
    entry: { prompt: "Welche Meldung kann der Bestelldienst nach dem Speichern senden?", options: ["„Bestellung bestätigt.“", "„Bitte bestätige die Bestellung.“"], answer: 0, clue: "Hier soll ein bereits eingetretener Zustand an andere Dienste weitergegeben werden.", explanation: "Die Bestätigung berichtet einen Fakt. Die zweite Meldung fordert einen Empfänger erst zur Arbeit auf." },
    transfer: { prompt: "Ein Lernportal meldet „Kurs gebucht“ an Rechnungsstellung und Kalender. Der Kalender war kurz offline. Wie sollen die beiden Empfänger die Nachricht bekommen?", options: ["Beide lesen unabhängig dieselbe Meldung aus je einem Abonnement.", "Nur der jeweils schnellste Empfänger darf sie einmal aus einer gemeinsamen Arbeitsliste holen."], answer: 0, clue: "Überlege, ob hier eine Aufgabe zu verteilen ist oder zwei Stellen jeweils eine Aufgabe haben.", explanation: "Beide brauchen die Meldung für ihren eigenen Zweck. Getrennte Abonnements erlauben unabhängige Verarbeitung." },
  },
  "verteilte-daten-konsistent-halten": {
    experiments: { 5: "trace" },
    openings: [
      "Zwei Personen wollen das letzte Fahrrad. Beide sehen „noch eins“. Welche Stelle darf verbindlich entscheiden, wer es bekommt?",
      "Das Fahrrad ist zurückgelegt, die Zahlung läuft noch. Was darf die Bestellseite in diesem Zwischenstand versprechen?",
      "Die Zahlung scheitert. Seit deiner Reservierung kam eine andere Bestellung hinzu. Überlege, warum ein alter Gesamtbestand gefährlich wäre.",
      "Lager, Shop und Zahlung melden unabhängig voneinander ihren Stand. Wer könnte im Fehlerfall wissen, welche Schritte noch rückgängig gemacht werden müssen?",
      "Zwei Anfragen haben beide den Bestand 1 gelesen. Entscheide, bei welchem Schritt die zweite Anfrage erkennen muss, dass das Fahrrad vergeben ist.",
    ],
    entry: { prompt: "Wo wird über beide Reservierungen entschieden?", options: ["Beim einzelnen Browser, der die Zahl zuerst gezeigt hat.", "Bei der bestandsführenden Stelle während des gemeinsamen Prüf- und Schreibschritts."], answer: 1, clue: "Beide Browser können dieselbe alte Zahl sehen.", explanation: "Die zentrale Bestandsänderung macht die Bedingung „noch eins frei“ zum Teil derselben Entscheidung." },
    transfer: { prompt: "Ein Reiseportal hält einen Sitz frei. Die Zahlung wird endgültig abgelehnt. Inzwischen wurden weitere Sitze vergeben. Was soll der Rückweg ändern?", options: ["Genau die ursprüngliche Sitzreservierung freigeben.", "Den gesamten Saal auf die Belegung vom Beginn des Kaufs zurücksetzen."], answer: 0, clue: "Welche Änderung gehört zu genau diesem Kundenauftrag?", explanation: "Die gezielte Freigabe gibt diesen Sitz zurück. Andere Buchungen behalten ihre Wirkung." },
  },
  "engpaesse-finden-und-skalieren": {
    openings: [
      "Ein Foto erscheint sofort als „hochgeladen“, das Vorschaubild kommt fünf Minuten später. Welche Zeit würdest du für die Warteerfahrung messen?",
      "Pro Minute kommen 120 Bilder hinzu. Die Verarbeitung schafft zunächst 90. Lass zwei Minuten vergehen und finde heraus, mit welcher Kapazität die Warteschlange wieder leer wird.",
      "Alle Worker warten auf dieselbe Datenbank. Du kannst weitere Worker starten oder die Abfragen entlasten. Welche Wirkung erwartest du bei gleicher Last?",
      "Nach einem Update ist die Warteschlange kürzer, zugleich gab es weniger Aufträge. Wie erfährst du, ob wirklich die Maßnahme geholfen hat?",
    ],
    experiments: { 2: "queue" },
    entry: { prompt: "Welche Messung beschreibt das Warten auf die Vorschau?", options: ["Zeit vom Upload bis zur fertigen Vorschau.", "Nur die Antwortzeit für „Upload angenommen“."], answer: 0, clue: "Die Nutzeraufgabe ist erst mit sichtbarer Vorschau erledigt.", explanation: "Die gesamte Zeit umfasst die Wartezeit in der Schlange und die Verarbeitung." },
    transfer: { prompt: "Eine Druckerei hat 24 offene Aufträge. Pro Minute kommen 10 hinzu und 14 werden fertig. Wie viele bleiben nach drei Minuten?", options: ["12.", "24.", "36."], answer: 0, clue: "Ziehe pro Minute die vier zusätzlich abgearbeiteten Aufträge vom Rückstand ab.", explanation: "Der Rückstand sinkt von 24 über 20 und 16 auf 12." },
  },
  "sicherheitsgrenzen-entwerfen": {
    experiments: { 2: "trace" },
    openings: [
      "Eine Rechnung wandert vom Abrechnungssystem ins Kundenportal. Wo muss geprüft werden, ob dieses Dokument an das anfragende Konto gehen darf?",
      "Zwei angemeldete Personen haben beide die Rolle „Kunde“. Was muss das System zusätzlich wissen, damit jede ihre eigene Rechnung erhält?",
      "Der PDF-Knopf ist ausgeblendet. Überlege, welche Prüfung trotzdem beim Aushändigen der Datei stattfinden muss.",
      "Der Support darf den Status einer Rechnung sehen, solange der Fall aktiv zugeordnet ist. Wähle einen erlaubten und einen verweigerten Fall, die diese Grenze sichtbar machen.",
    ],
    entry: { prompt: "Wonach entscheidet das Portal über die Herausgabe?", options: ["Ob das Logo der richtigen Abteilung sichtbar ist.", "Ob das Konto für diese konkrete Rechnung und Aktion berechtigt ist."], answer: 1, clue: "Eine gültige Anmeldung sagt nur etwas über die Identität aus.", explanation: "Die Autorisierung entscheidet zusätzlich über Objekt und Aktion." },
    transfer: { prompt: "Eine Schule erlaubt Betreuungskräften, bei aktiver Zuteilung die Anwesenheit zu lesen. Die Zuteilung endet. Welche zwei Fälle prüfst du?", options: ["Dieselbe Anfrage kurz vor und kurz nach Ablauf der Zuteilung.", "Dieselbe erlaubte Anfrage zweimal während der aktiven Zuteilung."], answer: 0, clue: "Beide Versuche unterscheiden sich am besten genau in dem Grund der Erlaubnis.", explanation: "Der erste Fall muss Zugriff geben, der zweite muss ihn verweigern. So wird die Regelgrenze geprüft." },
  },
  "architektur-schrittweise-migrieren": {
    openings: [
      "Ein alter Shop erzeugt Rechnungen zuverlässig, sein Download ist schwer zu warten. Welchen Teil würdest du zuerst umziehen, wenn die Erstellung weiterlaufen soll?",
      "Alte und neue App laufen einen Monat parallel. Die neue App braucht zusätzlich eine Eingabe. Überlege, wann der alte Aufruf entfallen darf.",
      "Die neue Ausgabe ist schnell und meldet Erfolg. Einzelne PDFs haben aber falsche Beträge. Wähle eine Messung, die so einen Fehler beim ersten kleinen Rollout erkennt.",
      "Vor der Rückkehr zur alten Version wurden fünf Rechnungen ausschließlich im neuen System geschrieben. Was muss vor dem Umschalten passieren?",
    ],
    experiments: { 4: "tradeoffs" },
    entry: { prompt: "Welcher erste Schnitt berührt die Rechnungserstellung am wenigsten?", options: ["Das Erstellen und Speichern im selben Schritt komplett ersetzen.", "Den Download fertiger Rechnungen separat übernehmen."], answer: 1, clue: "Welche Aufgabe liest bereits vorhandene Daten?", explanation: "Der Download kann mit kleinen Gruppen erprobt werden, während die zuständige Stelle weiter Rechnungen schreibt." },
    transfer: { prompt: "Ein Verein migriert Adressen. Sechs Änderungen wurden schon ausschließlich im neuen System gespeichert. Was brauchst du für eine Rückkehr zur alten Schreibstelle?", options: ["Eine Umschaltung ohne Datenabgleich.", "Eine Übernahme der sechs Änderungen und eine klare Umschaltung der Schreibverantwortung."], answer: 1, clue: "Die alte Version kann technisch laufen und trotzdem einen veralteten Stand besitzen.", explanation: "Der Abgleich erhält die Änderungen. Die Umschaltung verhindert, dass beide Systeme unabhängig weiter in denselben Bestand schreiben." },
  },
  "lernaufgabe-formulieren": {
    openings: ["Beim Stadtlauf soll ein Programm handgeschriebene Startnummern erfassen. Das ausgeschnittene Bild zeigt eine 7. Welche Ausgabe würdest du als Ergebnis speichern?", "Du hast viele Fotos, aber keine Ziffern daruntergeschrieben. Welche kleine Aufgabe kannst du trotzdem direkt aus den Bildern erzeugen?", "Vier von acht Übungsbildern zeigen eine 1. Überlege, wie oft ein Programm richtig liegt, das immer 1 sagt."],
    experiments: { 3: "dataset" },
    predictions: { 3: { prompt: "Wie viele der acht Übungsbilder trifft die Regel „immer 1“?", options: ["Zwei.", "Vier.", "Acht."], answer: 1, clue: "Zähle im Labor die richtigen Treffer über alle Bilder. Die Regel trifft nur bei Label 1.", explanation: "Vier Bilder haben das Label 1. Die anderen vier werden falsch zugeordnet." } },
    entry: { prompt: "Was ist bei einem Ausschnitt mit genau einer Ziffer das Ziel?", options: ["Eine Ziffernklasse aus 0 bis 9.", "Ein Mittelwert wie 7,4."], answer: 0, clue: "Der Verein braucht einen einzelnen Eintrag für dieses Zeichen.", explanation: "Das Ziel ist die Klasse des abgebildeten Zeichens. Die Beispiele können beim Training jeweils mit der richtigen Klasse beschriftet werden." },
    transfer: { prompt: "Für 20 neue Trainingsfotos gibt es 14-mal das Label „Helm“ und 6-mal „kein Helm“. Welche feste Startregel setzt du für einen späteren Vergleich fest?", options: ["Immer „Helm“ ausgeben.", "Immer „kein Helm“ ausgeben."], answer: 0, clue: "Suche die häufigste Klasse der Trainingsbilder.", explanation: "Die Regel gibt immer die Mehrheit aus. Ihre Treffer auf einem getrennten Testbestand werden später mit dem Modell verglichen." },
  },
  "mathematik-fuer-netze": {
    predictions: { 2: { prompt: "Was passiert mit der Summe, wenn du nur Pixel x₂ heller machst?", options: ["Sie steigt.", "Sie sinkt."], answer: 1, clue: "Das Labor multipliziert den zweiten Pixelwert mit −1. Berechne seinen Beitrag für 0 und für 1.", explanation: "x₂ trägt dann eine stärker negative Zahl bei. Die Summe sinkt." } },
    openings: ["Du legst drei Pixelbilder mit fünf Zeilen und fünf Spalten nebeneinander für das Training bereit. Entscheide, wie viele Werte jedes Bild und wie viele die Sammlung enthält.", "Ein heller Pixel soll das Signal stark erhöhen, ein zweiter soll es verringern. Verschiebe beide Pixelwerte und beobachte die Summe.", "Das Modell verteilt seine gesamte Wahrscheinlichkeit auf 1, 4 und 7. Für 1 zeigt es 0,3, für 4 zeigt es 0,2. Schätze den fehlenden Anteil.", "Beim Gewicht −1 hat dein Modell den Fehler w². Entscheide, ob du das Gewicht ein kleines Stück erhöhen oder senken würdest."],
    entry: { prompt: "Wie viele Zahlen haben die drei Bilder zusammen?", options: ["15.", "75."], answer: 1, clue: "Zähle zuerst die Felder eines Bildes und dann die Bilder.", explanation: "Jedes Bild enthält 5 × 5 = 25 Zahlen. Drei Bilder enthalten 75." },
    transfer: { prompt: "Ein Sensor liefert [1; 0,5]. Die Gewichte sind [−1; 4] und der Bias ist 0,5. Welches Signal kommt heraus?", options: ["1,5.", "3,5.", "−1,5."], answer: 0, clue: "Rechne die Beiträge einzeln: 1 × (−1) und 0,5 × 4. Addiere dann 0,5.", explanation: "−1 + 2 + 0,5 ergibt 1,5." },
  },
  "neuronales-netz-aufbauen": {
    openings: ["Zwei Pixel liefern zusammen den Wert −1. Du erhöhst den Zusatzwert um 2. Welcher Wert erreicht jetzt die nächste Rechenstufe?", "Das Bild einer 7 ist als Pixel gespeichert. Verfolge, welche Zwischenwerte zuerst berechnet werden und wann die Entscheidung für eine Ziffer fällt.", "Ein Neuron liefert den Zwischenwert −3. Probiere aus, was die nächste Stufe sieht, wenn sie negative Zahlen auf null setzt.", "Zwei unterschiedlich gezeichnete Ziffern ergeben dieselben zwei gemessenen Merkmale. Überlege, ob dein Netz daraus verschiedene Klassen berechnen kann.", "Vier Punkte liegen an den Ecken eines Quadrats. Diagonal gegenüberliegende Punkte haben dieselbe Klasse. Schaffst du es, beide Klassen mit einer Geraden zu trennen?"],
    experiments: { 2: "forward" },
    predictions: { 3: { prompt: "Wähle die breite 7 und setze ihr Gewicht auf 0. Was zeigt das Labor für ihren Score nach ReLU?", options: ["−2.", "0.", "2."], answer: 1, clue: "Vor der Aktivierung liegt der Score der 7 bei −2. Schalte zwischen Identität und ReLU um.", explanation: "Die Identität reicht −2 weiter. ReLU ersetzt den negativen Wert durch 0." } },
    entry: { prompt: "Was kommt nach dem Zusatz von 2 bei der nächsten Rechenstufe an?", options: ["−3.", "1."], answer: 1, clue: "Addiere 2 zum vorhandenen Wert −1, bevor eine Aktivierungsfunktion greift.", explanation: "Der neue Zwischenwert ist 1. Der Zusatz ist der Bias." },
    transfer: { prompt: "Ein Warnlicht soll an sein, wenn genau einer von zwei Sensoren 1 meldet. Was hat das Netz aus der XOR-Lektion dafür gelernt?", options: ["Eine lineare Grenze reicht für alle vier Sensorzustände.", "Zwei ReLU-Beiträge können die beiden Fälle mit unterschiedlichen Eingaben erfassen."], answer: 1, clue: "Die beiden Warnfälle liegen diagonal gegenüber. Welches Neuron reagiert jeweils?", explanation: "Ein Neuron reagiert auf 1,0 und das andere auf 0,1. Bei gleichen Eingaben bleiben beide null." },
  },
  "verlust-und-gradienten": {
    openings: ["Zwei Modelle tippen beide richtig auf 7. Eines gibt der 7 eine Wahrscheinlichkeit von 0,9, das andere 0,5. Welches soll beim Training den größeren Fehlerwert bekommen?", "Für eine echte 7 sinkt der Anteil von 0,5 auf 0,1. Sage voraus, in welche Richtung sich die Strafe bewegt.", "Zwei Klassen starten mit gleichen Scores. Wechsle das richtige Label von 7 auf 1. Überlege zuerst, in welche Richtung sich das Gewicht danach bewegen sollte.", "Beide Ausgaben eines Netzes hängen vom selben frühen Zwischenwert ab. Welche Rückmeldungen musst du für diesen Wert zusammenführen?"],
    experiments: { 2: "loss" },
    predictions: { 3: { prompt: "Setze w auf 0 und wechsle das richtige Label auf 1. In welche Richtung müsste ein kleiner Schritt w ändern?", options: ["Nach unten.", "Nach oben."], answer: 0, clue: "Den Score der 7 berechnet das Labor als 2 × w. Für Label 1 soll die 7 weniger Gewicht erhalten.", explanation: "Der Gradient für Label 1 ist hier +1. Der Abstieg zieht einen positiven Betrag vom Gewicht ab." } },
    entry: { prompt: "Welche Vorhersage sollte für dieselbe richtige Klasse stärker bestraft werden?", options: ["Die mit 0,5 für die richtige Klasse.", "Die mit 0,9 für die richtige Klasse."], answer: 0, clue: "Beide treffen die Entscheidung. Welches Modell gibt der richtigen Klasse weniger Gewicht?", explanation: "Die Kreuzentropie fällt, je mehr Wahrscheinlichkeit bei der richtigen Klasse liegt." },
    transfer: { prompt: "Bei einer echten 4 steigt ihre Wahrscheinlichkeit im zweiten Versuch von 0,2 auf 0,8. Was passiert mit der Kreuzentropie für dieses Bild?", options: ["Sie sinkt.", "Sie steigt.", "Sie bleibt gleich, weil das Label gleich bleibt."], answer: 0, clue: "Vergleiche −ln(0,2) mit −ln(0,8).", explanation: "Der Verlust fällt von ungefähr 1,609 auf 0,223. Das Modell gibt dem richtigen Label hier mehr Gewicht." },
  },
  "ein-netz-trainieren": {
    openings: ["Dein Gewicht steht bei −2, der kleinste Fehler liegt bei 2. Sage voraus, wo das Gewicht nach dem ersten Update landet.", "Beim Zifferntraining warten 80 Bilder. Das Programm verarbeitet je zehn gemeinsam und ändert dann die Gewichte. Wie oft geschieht das pro Durchlauf?", "Mit einer kleinen Änderung kommt das Gewicht dem Ziel näher. Starte neu und wähle eine deutlich größere Änderung. Überlege, ob der Fehler dadurch weiter sinkt.", "Zwei Neuronen starten gleich, lesen dieselben Eingaben und bekommen stets dieselbe Rückmeldung. Sage voraus, ob sie nach dem ersten Update verschieden sind.", "Zwei Optimierer erzielen nach zehn und hundert Updates verschiedene Verluste. Entscheide, wie du ihnen für einen Vergleich dieselben Bedingungen gibst."],
    experiments: { 1: "training", 3: "training" },
    transfer: { prompt: "Ein anderes Gewicht startet bei 0 und hat den Verlust L = (w − 3)² / 2. Ein Schritt mit Lernrate 2,5 landet bei 7,5. Wie ändert sich der Fehler?", options: ["Er sinkt, weil sich das Gewicht nach rechts bewegt.", "Er steigt, weil der Abstand zum Ziel von 3 auf 4,5 wächst."], answer: 1, clue: "Miss die Entfernung zu 3 auf beiden Seiten. Das Vorzeichen des Abstands ist für das Quadrat unwichtig.", explanation: "L steigt von 4,5 auf 10,125. Der Schritt geht über die Stelle des kleinsten Fehlers hinaus und landet weiter davon entfernt." },
  },
  "ueberanpassung-begrenzen": {
    openings: ["Ein Modell wird in acht Runden gespeichert. Du brauchst einen Satz Bilder für die Wahl einer Runde und einen für die letzte Prüfung. Wann verwendest du welchen?", "Eine gedrehte Kopie liegt im Test, das Original im Training. Überlege, was ein Treffer über ganz neue Handschriften verrät.", "Der Fehler auf bekannten Bildern sinkt, auf neuen Bildern steigt er ab Runde vier. Suche den Stand, den du mitnehmen würdest.", "Du drehst eine 6 so weit, dass sie wie eine 9 aussieht. Prüfe, ob du beim neuen Bild dasselbe Label behalten kannst.", "Nach Runde vier wird der Fehler auf neuen Bildern dreimal schlechter. Wähle, welche gespeicherte Runde du für einen späteren Test laden würdest."],
    experiments: { 3: "overfit" },
    predictions: { 3: { prompt: "Gehe im Lauf ohne zusätzliche Regularisierung von Epoche 4 auf Epoche 8. Was erwartest du bei den zwei Verlusten?", options: ["Beide sinken.", "Training sinkt und Validierung steigt.", "Beide steigen."], answer: 1, clue: "Vergleiche die Trainings- und Validierungsbalken getrennt. In Epoche 8 liegen sie weiter auseinander.", explanation: "Der Trainingsverlust fällt von 0,32 auf 0,09. Die Validierung verschlechtert sich zugleich von 0,51 auf 0,81." } },
    entry: { prompt: "Welche Bilder verwendest du zur Wahl der Trainingsrunde?", options: ["Die Validierungsbilder. Die Testbilder bleiben für die letzte Prüfung zurück.", "Die Testbilder nach jeder Runde."], answer: 0, clue: "Auch die Wahl eines Modellstands ist Teil der Entwicklung.", explanation: "Die Validierung steuert die Auswahl. Ein getrennter Test beurteilt danach den gewählten Stand." },
    transfer: { prompt: "Ein Sortiermodell erreicht nach den Runden 1, 2 und 3 Validierungsverluste von 0,8, 0,4 und 0,6. Der Trainingsverlust sinkt weiter. Welchen Stand prüfst du am Ende?", options: ["Runde 3.", "Runde 2.", "Runde 1."], answer: 1, clue: "Die beste Runde im Training kann auf getrennten Bildern schlechter sein.", explanation: "Der kleinste Validierungsverlust ist 0,4 in Runde 2. Die endgültigen Testdaten bleiben bis zur Endprüfung getrennt." },
  },
  "modelle-bewerten": {
    openings: ["Eine echte 7 wurde als 1 erkannt. Entscheide, in welcher Zeile und welcher Spalte du den Fehler zählen würdest.", "Von 20 echten Siebenen findet das Modell zwölf. Insgesamt hat es 15 Bilder als 7 markiert. Welche Division beantwortet „Wie viele echte Siebenen finde ich?“", "Der Verein möchte möglichst wenige Siebenen verpassen. Sage voraus, was ein niedrigerer Auswahlwert mit den Treffern und Fehlalarmen macht.", "Bei sechs echten Siebenen einer neuen Handschrift findet das Modell nur zwei. Überlege, was du neben dem Prozentwert angeben würdest."],
    experiments: { 1: "metrics" },
    predictions: { 3: { prompt: "Was erwartest du beim Wechsel von 0,7 auf 0,4 für alle Bilder?", options: ["Mehr erkannte Siebenen und mehr falsche Alarme.", "Weniger erkannte Siebenen und gleich viele falsche Alarme."], answer: 0, clue: "Lies bei beiden Einstellungen die Spalte für die Vorhersage 7. Vergleiche echte Siebenen und andere Bilder getrennt.", explanation: "Die echten Treffer steigen von 12 auf 17. Die falsch positiven Meldungen steigen von 3 auf 9." } },
    transfer: { prompt: "Bei einer Qualitätsprüfung findet das Modell 6 von 10 beschädigten Teilen und meldet insgesamt 12 als beschädigt. Wie groß sind Recall und Precision?", options: ["Recall 60 Prozent, Precision 50 Prozent.", "Recall 50 Prozent, Precision 60 Prozent."], answer: 0, clue: "Teile die sechs Treffer einmal durch alle tatsächlich beschädigten Teile und einmal durch alle Meldungen.", explanation: "Recall ist 6/10. Precision ist 6/12. Beide Blickwinkel verwenden denselben Zähler und verschiedene Nenner." },
  },
  "ziffernerkenner-trainieren": {
    openings: ["Du willst 18 Trainingsbilder und getrennte Prüfbilder für dein Ziffernnetz vorbereiten. Wie viele Pixel pro Bild bekommt die erste Schicht?", "Du hast den ersten Stapel mit sechs Bildern verarbeitet. Finde heraus, wie viele Updates die aktuelle Epoche noch braucht.", "Zwei Läufe haben verschiedene Verluste auf den Validierungsbildern. Wähle einen und entscheide, welche Bilder du für den abschließenden Vergleich freigibst."],
    experiments: { 2: "digits" },
    predictions: { 2: { prompt: "Wie viele zusätzliche Updates macht „Epoche abschließen“ nach einem einzelnen Update?", options: ["Eines.", "Zwei.", "Drei."], answer: 1, clue: "Schau auf den Zähler vor und nach dem Knopf. Ein Stapel der ersten Epoche ist bereits verarbeitet.", explanation: "Der Zähler steigt von 1 auf 3. Zwei der drei Stapel waren noch offen." } },
    entry: { prompt: "Welche Eingabe erhält das Netz pro Ziffer?", options: ["Eine Liste mit 25 Pixelwerten.", "Das richtige Label als zusätzlichen Pixel."], answer: 0, clue: "Das Modell soll das richtige Label auch für unbekannte Bilder vorhersagen.", explanation: "Beim Vorhersagen reichen die Pixel. Das Label dient beim Training als Ziel für den Verlust." },
    transfer: { prompt: "Du wechselst von 5-mal-5- auf 6-mal-6-Bilder. Die Klassen bleiben 1, 4 und 7. Was änderst du am Modell?", options: ["Die Eingabe wächst auf 36 Werte, die Ausgabe behält drei Scores.", "Die Eingabe behält 25 Werte, die Ausgabe wächst auf 36 Scores."], answer: 0, clue: "Zähle Pixel und Klassen getrennt.", explanation: "Die Bildgröße bestimmt die Eingabe. Drei Ziffernklassen brauchen weiterhin drei Ausgabescores." },
  },
  "bilder-mit-cnns-erkennen": {
    openings: ["Eine 7 hat oben einen dicken Querstrich. Bewege einen kleinen Filter über das Bild und finde die Stellen, an denen er den Strich am stärksten misst.", "In einem 5-mal-5-Bild soll ein 3-mal-3-Fenster auch nahe den Ecken messen. Probiere aus, wie Rand und Schrittweite die Zahl der Messstellen ändern.", "Vier Filterwerte lauten 0, 1, 3 und 2. Du hast nur Platz für einen Wert und willst die stärkste Antwort behalten. Welcher bleibt?", "Zwei Modelle sehen dieselben Pixelbilder und trainieren gleich lange. Wähle aus, was dir ihre Treffer über diesen Lauf und künftige Bilder sagen."],
    experiments: { 1: "convolution" },
    predictions: { 2: { prompt: "Welche Karte entsteht bei Padding 1 und Schrittweite 2?", options: ["2 mal 2.", "3 mal 3.", "5 mal 5."], answer: 1, clue: "Der gepolsterte Rand ergibt sieben Felder pro Achse. Zähle die Startpositionen 0, 2 und 4.", explanation: "Drei Startpositionen pro Achse ergeben eine 3-mal-3-Karte." } },
    transfer: { prompt: "Ein 7-mal-7-Bild wird ohne Rand mit einem 3-mal-3-Filter bei Schrittweite 2 berechnet. Wie groß ist die Merkmalskarte?", options: ["2 mal 2.", "3 mal 3.", "5 mal 5."], answer: 1, clue: "Zähle die erlaubten Startstellen: 0, 2 und …", explanation: "Die Startpositionen sind 0, 2 und 4 pro Achse. Das ergibt neun Werte." },
  },
  "tokens-und-embeddings": {
    openings: ["Du gibst „modellbild“ ein. Das Wort stand so in keinem Trainingssatz. Probiere aus, wie der Text trotzdem in bekannte Stücke zerlegt werden kann.", "Im Korpus taucht dasselbe Buchstabenpaar oft nebeneinander auf. Sage voraus, was sich bei der nächsten Zusammenführung ändert.", "„bild“ hat ID 2, „zug“ ID 3 und „bilder“ ID 19. Vergleiche, welche beiden Wörter im Zahlenraum der Vektoren näher beieinander liegen."],
    experiments: { 1: "tokens", 3: "embeddings" },
    predictions: { 3: { prompt: "Welches Token hat im Labor den ähnlicheren Vektor zu „bild“?", options: ["„zug“ mit ID 3.", "„bilder“ mit ID 19."], answer: 1, clue: "Schalte zwischen den beiden zweiten Tokens um und vergleiche die Kosinuswerte.", explanation: "„bilder“ liegt in einer ähnlichen Vektorrichtung. Die Zahlen 2, 3 und 19 dienen lediglich zum Nachschlagen." } },
    transfer: { prompt: "Ein Tokenizer liefert für einen Satz sechs IDs. Das neue Modell nutzt Vektoren mit zwölf Zahlen pro Token. Welche Form erhält seine erste Schicht?", options: ["Sechs Vektoren mit zwölf Werten.", "Zwölf neue Token-IDs.", "Einen Vektor mit sechs Werten."], answer: 0, clue: "Pro ID wird genau eine Zeile der Einbettungstabelle gelesen.", explanation: "Es bleiben sechs Positionen. Jede enthält die zwölf Werte der zugehörigen Einbettungszeile." },
  },
  "attention-und-transformer": {
    openings: ["In „das Team prüft Bilder“ soll an der zweiten Position etwas aus den gelesenen Wörtern zusammengetragen werden. Welche Positionen können dafür Gewicht bekommen?", "Das Modell soll an dieser Stelle das nächste Wort vorhersagen. Welche Wörter darf es dafür schon sehen?", "Die beiden Sätze „das Team prüft das Modell“ und „das Modell prüft das Team“ enthalten dieselben Wörter. Überlege, welche zusätzliche Information beim Lesen etwas ändert.", "In zwei Folgen endet der Text mit „prüft“. Ersetze davor „Team“ durch „Modell“ und verfolge, bei welcher Rechnung sich die Ausgabe verändert."],
    experiments: { 1: "attention", 2: "discover-mask" },
    transfer: { prompt: "Für die dritte Stelle in einem Satz mit fünf Tokens wird das vierte Token vorhergesagt. Welche Stellen darf die kausale Attention an Stelle drei lesen?", options: ["Nur die ersten drei Stellen.", "Die ersten vier Stellen.", "Alle fünf Stellen."], answer: 0, clue: "Die bekannte Lösung in der vierten Stelle liegt im Trainingssatz rechts von der Query.", explanation: "Stelle drei sieht sich selbst und ihre Vorgänger. Die beiden späteren Stellen werden ausgeblendet." },
  },
  "sprachmodell-trainieren-und-generieren": {
    openings: ["Du liest „das Team“ in einem Trainingssatz und verdeckst den Rest. Tipp auf das nächste Wort und prüfe es gegen den Satz.", "Nach „Team“ folgen im Korpus sowohl „prüft“ als auch „trainiert“. Trainiere das Modell und beobachte, welchem Wort es mehr Gewicht gibt.", "Bei demselben Starttext willst du mal die wahrscheinlichste, mal eine gewürfelte Fortsetzung. Welche Einstellung führt bei wiederholten Versuchen zu verschiedenen Texten?"],
    experiments: { 2: "language" },
    entry: { prompt: "Was ist im Satz „das Team prüft die Bilder“ das nächste Wort nach „das Team“?", options: ["„prüft“.", "„Bilder“."], answer: 0, clue: "Decke die Wörter nach „Team“ einzeln von links nach rechts auf.", explanation: "Das erste verdeckte Wort ist „prüft“. Der Text selbst liefert das richtige Ziel." },
    transfer: { prompt: "Nach „Kurs beginnt“ liegt „heute“ bei 0,6 und „morgen“ bei 0,4. Was kann bei einem einzelnen Generierungsschritt passieren?", options: ["Greedy wählt „heute“. Sampling kann auch „morgen“ ziehen.", "Beide Verfahren wählen zwingend „morgen“."], answer: 0, clue: "Die höchste Wahrscheinlichkeit und eine gewichtete Zufallsauswahl erfüllen verschiedene Regeln.", explanation: "Greedy nimmt den größten Wert. Beim Sampling hat „morgen“ weiterhin 40 Prozent Gewicht." },
  },
};

const learningTraces = {
  "module-entwerfen": {
    title: "Eine Regel ohne Änderung am Mahnlauf verschieben",
    setup: "Zwei Bücher sind drei und acht Tage überfällig. Ab sieben Tagen wird eine zweite Mahnung erzeugt. Spiele durch, wer die Daten der Regel kennen muss.",
    variants: [
      { label: "Die Regeldatei ersetzt die Tabelle bei gleichem Vertrag", options: ["Der Mahnlauf braucht eine Datei-Anpassung.", "Der Mahnlauf kann unverändert bleiben."], answer: 1,
        steps: [["Aufruf", "Der Mahnlauf gibt dem Fristenmodul für jedes Buch die überfälligen Tage."], ["Speicherwechsel", "Das Modul liest die Schwelle 7 aus der Datei. Für drei Tage meldet es Stufe 1, für acht Tage Stufe 2."], ["Ergebnis beim Aufrufer", "Der Mahnlauf erhält dieselben beiden Stufen wie zuvor. Er sendet die passenden Nachrichten über dieselbe Schnittstelle."]],
        hint: "Vergleiche die Antwort an den Mahnlauf vor und nach dem Speicherwechsel." },
      { label: "Der Mahnlauf liest selbst aus der Tabelle", options: ["Der Aufrufer muss für die Datei angepasst werden.", "Der Aufrufer merkt den Wechsel automatisch."], answer: 0,
        steps: [["Aufruf", "Der Mahnlauf fragt die Spalte grenze direkt aus der Tabelle ab."], ["Speicherwechsel", "Die Regel steht jetzt in einer Datei. Die Spalte ist für den Mahnlauf nicht mehr verfügbar."], ["Aufruf scheitert", "Die Bibliothek muss die Art des Lesens auch im Mahnlauf ändern."]],
        hint: "Suche den Aufrufer, der das alte Format direkt kennt." },
    ],
  },
  "abhaengigkeiten-austauschen": {
    title: "Eine Wetterantwort bis zur Tourenwarnung verfolgen",
    setup: "Die App warnt ab 60 Prozent Regenwahrscheinlichkeit. Wähle eine Antwort des Anbieters und sag voraus, was in der App steht.",
    variants: [
      { label: "Anbieter liefert den Anteil 0,65", options: ["Regenwarnung.", "Keine Warnung."], answer: 0,
        steps: [["Anbieterformat", "Der Dienst sendet den Anteil 0,65."], ["Übersetzung", "Der Adapter multipliziert mit 100 und liefert 65 Prozent."], ["Warnregel", "65 erfüllt die Bedingung ab 60 Prozent. Die App warnt."]], hint: "Vergleiche Prozent mit Prozent. Die 0,65 ist ein Anteil." },
      { label: "Anbieter antwortet nicht", options: ["0 Prozent Regen.", "Wetterdaten fehlen."], answer: 1,
        steps: [["Anfrage", "Der Dienst liefert bis zur Frist keine Antwort."], ["Übersetzung", "Der Adapter meldet „nicht verfügbar“ ohne Zahlenwert."], ["Anzeige", "Die App zeigt „Wetterdaten fehlen“."]], hint: "Suche den gültigen Zahlenwert. In diesem Pfad kommt keiner an." },
    ],
  },
  "strategien-variieren": {
    title: "Den Preisweg vom Menü bis zur Anzeige verfolgen",
    setup: "Ein gleich schweres Paket kostet mit Standard 490 und mit Express 990 Cent. In beiden Fällen wählt die Kundin Express.",
    variants: [
      { label: "Express ist richtig zugeordnet", options: ["490 Cent.", "990 Cent."], answer: 1, steps: [["Auswahl", "Die App liest „Express“."], ["Zuordnung", "Express verweist auf die Expressberechnung."], ["Preis", "Die Berechnung liefert 990 Cent."]], hint: "Verfolge das Ergebnis der ausgewählten Regel." },
      { label: "Express verweist versehentlich auf Standard", options: ["490 Cent.", "990 Cent."], answer: 0, steps: [["Auswahl", "Die App liest „Express“."], ["Zuordnung", "Der Eintrag für Express verweist auf die Standardberechnung."], ["Preis", "Die Standardberechnung liefert korrekt 490 Cent für ihre eigene Aufgabe."]], hint: "Prüfe die Zuordnung. Die sichtbare Lieferart garantiert keine passende Berechnung." },
    ],
  },
  "zustaende-modellieren": {
    title: "Zustand und Auszahlung getrennt verfolgen",
    setup: "Die geprüfte Rücksendung wird abgeschlossen. Wähle, was bei einem zweiten Klick passieren soll, und vergleiche Zustandsanzeige und erzeugte Bestätigungen.",
    variants: [
      { label: "Der Handler prüft den aktuellen Zustand", options: ["Die Rücksendung bleibt abgeschlossen und eine Bestätigung wurde erzeugt.", "Die Rücksendung bleibt abgeschlossen und zwei Bestätigungen wurden erzeugt."], answer: 0, steps: [["Erster Klick", "Der Zustand wechselt zu abgeschlossen. Eine Bestätigung wird erzeugt."], ["Zweiter Klick", "Die Prüfung findet keinen weiteren erlaubten Übergang."], ["Auswirkungen", "Die Anzeige bleibt abgeschlossen. Es gibt weiterhin nur eine Bestätigung."]], hint: "Beachte, ob der zweite Klick die Bedingung für den Übergang erfüllt." },
      { label: "Der Handler schreibt bei jedem Klick abgeschlossen", options: ["Die Rücksendung bleibt abgeschlossen und eine Bestätigung wurde erzeugt.", "Die Rücksendung bleibt abgeschlossen und zwei Bestätigungen wurden erzeugt."], answer: 1, steps: [["Erster Klick", "Die Anzeige wechselt zu abgeschlossen. Eine Bestätigung wird erzeugt."], ["Zweiter Klick", "Der Handler setzt denselben Zustand und erzeugt eine weitere Bestätigung."], ["Auswirkungen", "Die Anzeige sieht gleich aus. Es gibt jetzt zwei Bestätigungen."]], hint: "Zähle die Bestätigungen getrennt von den Beschriftungen." },
    ],
  },
  "schnittstellen-weiterentwickeln": {
    title: "Die alte und neue App gegen denselben Bestand testen",
    setup: "Ein Roman ist verfügbar, ein Atlas ist ausgeliehen. Die alte App kannte bisher keinen Parameter.",
    variants: [
      { label: "Alte App ohne Filter", options: ["Roman und Atlas.", "Nur Roman."], answer: 0, steps: [["Anfrage", "Die App lässt den Parameter weg."], ["Standard", "Der Server verwendet die bisherige Regel: alle Bücher."], ["Antwort", "Roman und Atlas sind in der Liste."]], hint: "Prüfe, welchen Standard die alte App kennt." },
      { label: "Neue App setzt „nur verfügbar“", options: ["Roman und Atlas.", "Nur Roman."], answer: 1, steps: [["Anfrage", "Die App setzt den Filter ausdrücklich."], ["Auswahl", "Der Server prüft die Verfügbarkeit beider Bücher."], ["Antwort", "Nur der Roman bleibt."]], hint: "Der ausgeliehene Atlas erfüllt den ausdrücklich gewählten Filter nicht." },
    ],
  },
  "fachbegriffe-modellieren": {
    title: "Eine Adressänderung nach der Bestellung testen",
    setup: "Die Bestellung B-17 wurde für die Lindenstraße 4 bestätigt. Danach ändert die Kundin ihr Profil auf Bahnhofstraße 2.",
    variants: [
      { label: "Bestellung speichert die vereinbarte Adresse", options: ["Lindenstraße 4.", "Bahnhofstraße 2."], answer: 0, steps: [["Bestätigen", "B-17 speichert Lindenstraße 4 als Lieferadresse."], ["Profil ändern", "Die neue Adresse gilt für das Profil und mögliche spätere Bestellungen."], ["Versand", "Für B-17 liest der Versand Lindenstraße 4."]], hint: "Suche den gespeicherten Wert zum Zeitpunkt der Bestätigung." },
      { label: "Bestellung liest immer das aktuelle Profil", options: ["Lindenstraße 4.", "Bahnhofstraße 2."], answer: 1, steps: [["Bestätigen", "B-17 speichert nur den Verweis auf das Profil."], ["Profil ändern", "Unter diesem Verweis steht jetzt Bahnhofstraße 2."], ["Versand", "Die Lieferung würde zur neuen Adresse gehen."]], hint: "Der Verweis behält seine Identität, sein gelesener Inhalt ändert sich." },
    ],
  },
  "architektur-dokumentieren": {
    title: "Die passende Zeichnung zur Betriebsfrage wählen",
    setup: "Ein Bildimport besteht aus Webanwendung, Warteschlange und Worker. Im Betrieb tauchen zwei verschiedene Fragen auf.",
    variants: [
      { label: "Warum ist „angenommen“ sichtbar, während das Bild fehlt?", options: ["Laufzeitsicht.", "Verteilungssicht."], answer: 0, steps: [["Annahme", "Die Webanwendung speichert den Auftrag und bestätigt seinen Eingang."], ["Wartezeit", "Der Auftrag wartet, bis ein Worker frei ist."], ["Zeitliche Beziehung", "Erst danach entsteht die Vorschau. Eine Laufzeitsicht zeigt diese Reihenfolge."]], hint: "Hier erklärt die Reihenfolge der Ereignisse den sichtbaren Zwischenstand." },
      { label: "Wo lässt sich ein zusätzlicher Worker starten?", options: ["Laufzeitsicht.", "Verteilungssicht."], answer: 1, steps: [["Komponenten", "Webanwendung und Worker sind getrennte Prozesse."], ["Infrastruktur", "Die Worker laufen in einer eigenen Gruppe neben der Webanwendung."], ["Ort der Änderung", "Eine Verteilungssicht zeigt die Worker-Gruppe, in der eine Instanz hinzukommt."]], hint: "Die Frage betrifft den Ort, an dem ein Prozess läuft." },
    ],
  },
  "teilausfaelle-beherrschen": {
    title: "Den Versanddienst mit wenigen Aufrufen testen",
    setup: "50 Versandaufträge warten. Der Dienst hat zehn Minuten nicht geantwortet und schafft nach der Rückkehr höchstens fünf gleichzeitige Anfragen.",
    variants: [
      { label: "Alle 50 Aufträge gleichzeitig senden", options: ["Alle Aufträge bekommen sofort eine Antwort.", "Ein Teil der Aufträge muss weiter warten."], answer: 1, steps: [["Wiederanlauf", "Die Versandsteuerung startet gleichzeitig 50 Aufrufe."], ["Kapazität", "Der Versanddienst kann höchstens fünf zugleich bearbeiten."], ["Rückstand", "Die übrigen Aufrufe kommen zu früh. Sie müssen bei der Versandsteuerung für spätere Versuche erhalten bleiben."]], hint: "Vergleiche die Zahl gleichzeitiger Aufrufe mit der Kapazitätsgrenze." },
      { label: "Zwei Aufträge als Probe senden", options: ["Nach einer erfolgreichen Probe können kleine Gruppen folgen.", "Die Probe verarbeitet direkt alle 50 Aufträge."], answer: 0, steps: [["Wiederanlauf", "Zwei Aufträge werden an den Dienst gesendet. 48 bleiben gespeichert."], ["Rückmeldung", "Die beiden Probeaufrufe liefern erfolgreich ihre Sendungsnummer."], ["Kapazität nutzen", "Jetzt dürfen weitere Aufträge in kleinen Gruppen folgen. Die maximale Belastung bleibt planbar."]], hint: "Zähle, welche der 50 Aufträge in der Probe tatsächlich gesendet wurden." },
    ],
  },
  "systeme-ueber-ereignisse-verbinden": {
    title: "Dieselbe Bestellmeldung nach einem Absturz erneut bearbeiten",
    setup: "Das Lager legt zu Ereignis E42 eine Pickliste an. Der Prozess stürzt vor der Quittung ab. Sage voraus, wie viele Listen nach der Neuzustellung existieren.",
    variants: [
      { label: "Pickliste und E42 gemeinsam speichern", options: ["Eine Liste.", "Zwei Listen."], answer: 0, steps: [["Speichern", "Liste und verarbeitete ID E42 werden gemeinsam festgeschrieben."], ["Absturz", "Der Broker hat keine Quittung und sendet E42 erneut."], ["Wiederanlauf", "Der Worker findet E42 in der Datenbank und quittiert ohne neue Liste."]], hint: "Prüfe, welche Information den Neustart überlebt." },
      { label: "Die ID nur im Arbeitsspeicher merken", options: ["Eine Liste.", "Zwei Listen."], answer: 1, steps: [["Speichern", "Nur die erste Pickliste wird dauerhaft angelegt."], ["Absturz", "Der Worker verliert die gemerkte ID. Der Broker sendet erneut."], ["Wiederanlauf", "Die Verarbeitungsprüfung findet E42 nicht und legt eine zweite Liste an."]], hint: "Die Liste ist gespeichert, ihre Zuordnung zur bereits verarbeiteten Nachricht fehlt." },
    ],
  },
  "verteilte-daten-konsistent-halten": {
    title: "Zwei Anfragen um dasselbe Fahrrad verfolgen",
    setup: "Es gibt ein Fahrrad. A und B haben im Shop beide den Bestand 1 gesehen. Was kann der Lagerdienst jeweils zusagen?",
    variants: [
      { label: "Bestand bei jedem Abzug gemeinsam prüfen und ändern", options: ["A und B erhalten beide eine Zusage.", "Nur A wird reserviert."], answer: 1, steps: [["A schreibt", "Bestand ist größer als 0. A reserviert das Fahrrad, der Bestand sinkt auf 0."], ["B schreibt", "Beim Versuch von B ist die Bedingung Bestand größer als 0 falsch."], ["Zusagen", "A erhält die Reservierung, B erfährt, dass kein Stück verfügbar ist."]], hint: "Lies den Bestand an der Stelle, an der B tatsächlich reservieren will." },
      { label: "Beide verlassen sich auf den früheren Lesezugriff", options: ["A und B erhalten beide eine Zusage.", "Nur A wird reserviert."], answer: 0, steps: [["Beide lesen", "Beide sehen Bestand 1 und merken sich ihre Zusage."], ["A schreibt", "A schreibt Bestand 0 und speichert seine Reservierung."], ["B überschreibt", "Auch B schreibt ausgehend von der alten 1 den Wert 0 und speichert eine Reservierung. Zwei Zusagen betreffen ein Fahrrad."]], hint: "Eine Zeile mit Bestand 0 erzählt dir allein nichts über die Zahl gespeicherter Reservierungen." },
    ],
  },
  "sicherheitsgrenzen-entwerfen": {
    title: "Die Zutrittsregel mit zwei Rechnungen vergleichen",
    setup: "Konto A ist angemeldet und gehört zur Rolle Kunde. Die Rechnung A-17 gehört zu Konto A, Rechnung B-12 zu Konto B. Wie entscheidet der Server?",
    variants: [
      { label: "Konto A fragt die eigene Rechnung A-17 an", options: ["Der Server erlaubt den Zugriff.", "Der Server verweigert den Zugriff."], answer: 0, steps: [["Identität", "Die Anmeldung gehört zu Konto A."], ["Aktion", "Kunden dürfen eigene Rechnungen lesen."], ["Objekt", "A-17 gehört zu Konto A. Der Server gibt die Rechnung frei."]], hint: "Vergleiche angemeldetes Konto und Eigentümer des gewählten Dokuments." },
      { label: "Konto A fragt Rechnung B-12 an", options: ["Der Server erlaubt den Zugriff.", "Der Server verweigert den Zugriff."], answer: 1, steps: [["Identität", "Die Anmeldung gehört zu Konto A."], ["Aktion", "Die Rolle Kunde darf Rechnungen grundsätzlich lesen."], ["Objekt", "B-12 gehört zu Konto B. Der Server verweigert die Ausgabe."]], hint: "Die Rolle beantwortet noch nicht, ob dieses konkrete Objekt zum Konto gehört." },
    ],
  },
};
