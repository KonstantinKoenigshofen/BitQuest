"""Sprechtext und Bildregie für die fünf Filme der ersten BitQuest-Staffel."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Shot:
    action: str
    lines: tuple[str, ...]
    hold: float


def shot(action, *lines, hold=.55):
    return Shot(action, lines, hold)


@dataclass(frozen=True)
class Film:
    key: str
    stem: str
    title: str
    poster_title: tuple[str, str]
    quest: str
    quest_title: str
    shots: tuple[Shot, ...]


FILMS = (
    Film(
        "library", "warum-software-in-module-aufteilen",
        "Ein Buch, zwei Mahnfristen – warum Module helfen",
        ("Ein Buch,", "zwei Mahnfristen"),
        "module-entwerfen", "Module mit klarer Verantwortung entwerfen",
        (
            shot("screen", "Auf dem Bildschirm der Stadtbibliothek steht: Keine Mahnung fällig."),
            shot("mail", "Im selben Moment bekommt Lea eine Mahnmail.", "Sie nennt genau das Buch, das die Bibliothek gerade geprüft hat.", "Wie kann das sein?"),
            shot("rewind", "Spulen wir zurück.", "Bei Leas Buch ist die Rückgabe seit acht Tagen überfällig.", "Heute wandert dieselbe Ausleihe durch zwei Teile der Software."),
            shot("split", "Der obere Weg endet auf dem Bildschirm am Bibliothekstresen.", "Der untere steuert den Mailversand.", "Beide bekommen dieselbe Zahl: acht Tage."),
            shot("ten", "Die Anzeige arbeitet schon mit der neuen Frist von zehn Tagen.", "Acht ist kleiner als zehn.", "Darum steht auf dem Bildschirm: Keine Mahnung fällig."),
            shot("seven", "Der Versand rechnet noch mit der alten Frist von sieben Tagen.", "Acht ist mindestens sieben.", "Also erhält der Mailversand einen Auftrag."),
            shot("think", "Wo würdest du die Zehn-Tage-Regel unterbringen, damit der nächste Fristwechsel beide Wege erreicht?", hold=4.1),
            shot("merge", "Wir führen die beiden Prüfungen in einem Mahnmodul zusammen.", "Das bekommt die Zahl der überfälligen Tage und gibt zurück, ob eine Mahnung fällig ist."),
            shot("replay", "Noch einmal derselbe Tag, dasselbe Buch, dieselben acht Tage.", "Das Modul entscheidet: noch keine Mahnung.", "Beide Wege fragen jetzt dieselbe Regel ab."),
            shot("quiet", "Die Anzeige schreibt weiterhin: Keine Mahnung fällig.", "Diesmal bekommt auch der Versand keinen Auftrag.", "Leas Handy bleibt still."),
            shot("twelve", "Jetzt prüfen wir ein anderes Buch.", "Es ist zwölf Tage überfällig.", "Zwölf erreicht die Zehn-Tage-Frist, also meldet das Modul eine fällige Mahnung."),
            shot("send", "Jetzt erhält der Versand einen Auftrag und löst die Mail aus.", "Am Tresen erscheint für diese Ausleihe ebenfalls: Mahnung fällig."),
            shot("boundary", "Wir können die Frist jetzt unabhängig von Bildschirm und Mail prüfen.", "Bei neun überfälligen Tagen erwarten wir noch keine Mahnung.", "Bei genau zehn Tagen erwarten wir schon eine. So halten wir fest, was die neue Frist bedeutet."),
            shot("lesson", "Die Anzeige formuliert den Status. Der Versand verschickt die Mail.", "Das Mahnmodul beantwortet die Frage nach der Frist.", "Beim nächsten Fristwechsel ändern wir die Regel an genau einer Stelle.", hold=2),
        ),
    ),
    Film(
        "locker", "raetsel-der-doppelten-reservierung",
        "Ein Klick zu viel? Das Rätsel der doppelten Reservierung",
        ("Ein Klick", "zu viel?"),
        "schnittstellen-entwerfen", "Verlässliche Schnittstellen entwerfen",
        (
            shot("start", "Mila will ein Fach am Paketautomaten reservieren.", "Links siehst du ihr Handy, rechts den Automaten.", "Alle Fächer sind frei."),
            shot("request", "Beim Tippen schickt das Handy den Auftrag mit dem Schlüssel A eins los.", "Der Schlüssel steht für diesen einen Auftrag."),
            shot("booked", "Der Automat reserviert das erste Fach und speichert die Reservierungsnummer einhundertein zu A eins.", "Auf dem Rückweg ist die Bestätigung schon unterwegs."),
            shot("lost", "Die Antwort geht verloren."),
            shot("freeze", "Das Handy meldet eine Zeitüberschreitung. Das Fach ist belegt.", "Wenn ich jetzt noch einmal tippe, wie viele Fächer sind danach belegt?", hold=4.3),
            shot("same", "Variante eins. Das Handy sendet denselben Auftrag noch einmal mit dem Schlüssel A eins.", "Der Automat schaut nach, ob er diesen Auftrag schon ausgeführt hat."),
            shot("same_result", "Er findet die gespeicherte Reservierung und antwortet wieder mit der Nummer einhundertein.", "Schau auf die Türen. Es bleibt bei einem belegten Fach."),
            shot("reset", "Zurück zum Moment nach der verlorenen Antwort.", "Ein Fach ist belegt, und das Handy hat noch immer keine Bestätigung."),
            shot("new", "Variante zwei. Beim zweiten Tippen schickt das Handy den neuen Schlüssel B zwei.", "Für den Automaten sieht das wie ein neuer Auftrag aus."),
            shot("new_result", "Er reserviert das nächste Fach und meldet die Nummer einhundertzwei zurück.", "Jetzt sind zwei Fächer belegt. Eines gehört zu jeder Reservierungsnummer."),
            shot("compare", "Die beiden Varianten starten gleich. Der Unterschied steckt im Auftragsschlüssel.", "A eins wiederholt eine bestehende Reservierung. B zwei eröffnet eine weitere."),
            shot("memory", "Dafür muss sich der Automat merken, welche Reservierung zu welchem Schlüssel gehört.", "Sonst könnte er nach einer verlorenen Antwort wieder ein Fach belegen.", "Die App behält den Schlüssel bei, solange Mila dieselbe Reservierung erneut anfragt."),
            shot("lesson", "Das nennt man Idempotenz. Derselbe Auftrag kann mehrmals eintreffen und hat dieselbe Wirkung auf die Belegung wie beim ersten Mal.", "Für einen bewusst neuen Auftrag verwendet die App einen eigenen Schlüssel.", hold=2),
        ),
    ),
    Film(
        "weather", "warum-null-komma-sechs-fuenf-die-regenwarnung-verschluckt",
        "Warum 0,65 eine Regenwarnung verschwinden lässt",
        ("Wo steckt die", "Regenwarnung?"),
        "abhaengigkeiten-austauschen", "Abhängigkeiten austauschbar machen",
        (
            shot("start", "Die Wander-App soll ab sechzig Prozent Regenwahrscheinlichkeit warnen.", "Morgen sieht es nach Regen aus, aber die App zeigt keinen Regenhinweis."),
            shot("provider", "Seit heute bezieht die App ihre Vorhersage von einem anderen Wetterdienst.", "Der Dienst schickt null Komma sechs fünf als Antwort."),
            shot("raw", "Verfolgen wir die Zahl bis zum Display.", "Null Komma sechs fünf verlässt den Wetterdienst, wandert durch die App und kommt direkt bei der Warnregel an."),
            shot("wrong", "Die Warnregel erwartet eine Zahl in Prozent.", "Sie sieht null Komma sechs fünf und vergleicht den Wert mit sechzig.", "Er ist kleiner. Die Warnung bleibt aus."),
            shot("think", "Null Komma sechs fünf und fünfundsechzig Prozent meinen dieselbe Wahrscheinlichkeit.", "Welche Stelle soll die Einheit übersetzen?", hold=4.2),
            shot("adapter", "Wir setzen einen Adapter zwischen Wetterdienst und App.", "Er kennt das Format des Dienstes und liefert der App immer die vereinbarte Einheit: Prozent."),
            shot("convert", "Im Adapter wird aus null Komma sechs fünf durch Multiplikation mit hundert der Wert fünfundsechzig.", "Den reicht der Adapter in Prozent weiter."),
            shot("warn", "Jetzt vergleicht die App fünfundsechzig mit sechzig und blendet die Regenwarnung ein.", "Ihre fachliche Regel ist dieselbe geblieben."),
            shot("swap", "Wie testen wir genau die Schwelle?", "Wir ziehen die echte Wetterquelle ab und stecken eine feste Testquelle in dieselbe Schnittstelle."),
            shot("sixty", "Die Testquelle liefert genau sechzig Prozent.", "Das ist der erste Wert, bei dem laut Anforderung eine Warnung erscheinen muss."),
            shot("test", "Die Warnung erscheint. Unser Test ist grün.", "Wir können diese Prüfung morgen wiederholen, ganz egal, wie das Wetter dann aussieht."),
            shot("border", "Mit derselben Testquelle können wir auch neunundfünfzig Prozent liefern.", "Die App soll dann keinen Regenhinweis zeigen.", "Zusammen prüfen die beiden Antworten, dass die Warnung genau bei sechzig Prozent beginnt."),
            shot("paths", "Den Adapter prüfen wir separat mit der Antwort des Wetterdienstes.", "So lässt sich beim nächsten Fehler schnell herausfinden, ob die Umrechnung oder die Warnregel an der falschen Stelle abbiegt."),
            shot("lesson", "Beide Quellen liefern Prozent über dieselbe Schnittstelle.", "So lässt sich der Anbieter wechseln und die Warnregel gezielt testen.", "Die Umrechnung bleibt Aufgabe des Adapters.", hold=2),
        ),
    ),
    Film(
        "shipping", "express-gewaehlt-standard-bezahlt",
        "Express gewählt, Standard bezahlt – wie Strategien funktionieren",
        ("Express gewählt,", "Standard bezahlt"),
        "strategien-variieren", "Verhalten mit Entwurfsmustern variieren",
        (
            shot("start", "Nora braucht ihr Paket schnell und wählt Expressversand.", "Der Warenkorb zeigt vier Euro neunzig Versandkosten. Für Express sollten es neun Euro neunzig sein."),
            shot("trace", "Wir folgen der Auswahl bis zur Berechnung.", "Der Shop bekommt die Lieferart Express und die Versanddaten: zwei Kilo, Lieferzone Innenstadt."),
            shot("formula", "Probieren wir die Expressregel direkt mit diesen Daten aus.", "Sie liefert neunhundertneunzig Cent.", "Einzeln gerechnet stimmt der Preis."),
            shot("think", "Der Warenkorb zeigt trotzdem den Standardpreis.", "An welcher Stelle würdest du als Nächstes nachsehen?", hold=4.2),
            shot("miswire", "Hier in der Zuordnung steckt der Fehler.", "Die Leitung vom Menüpunkt Express endet bei der Standardregel.", "Die liefert für dieses Paket vierhundertneunzig Cent."),
            shot("rewire", "Wir lösen diese Verbindung und stecken sie bei der Expressregel ein.", "Jetzt erreicht dieselbe Auswahl die passende Berechnung."),
            shot("price", "Der Warenkorb bekommt neunhundertneunzig Cent zurück und zeigt neun Euro neunzig.", "Damit ist die Auswahl von Express bis zur Anzeige geprüft."),
            shot("contract", "Standard und Express sind zwei Versandstrategien.", "Jede übernimmt die Versanddaten und liefert einen Betrag in Cent.", "Darum kann der Warenkorb beide auf dieselbe Weise aufrufen."),
            shot("bike", "Jetzt kommt ein Fahrradkurier dazu.", "Wir schreiben eine dritte Strategie und verbinden die neue Lieferart mit ihr."),
            shot("bike_price", "Für zwei Kilo in die Innenstadt liefert der Fahrradkurier sechshundertneunzig Cent.", "Die vorhandene Preisvorschau macht daraus sechs Euro neunzig."),
            shot("options", "Wählt Nora stattdessen Standard, fordert der Warenkorb seinen Preis von der Standardstrategie an.", "Auch hier gehen die Versanddaten hinein und ein Betrag in Cent kommt heraus.", "Der Warenkorb kann jede Lieferart mit demselben Ablauf ausführen."),
            shot("tests", "Zwei Prüfungen hätten den Fehler schneller eingegrenzt.", "Die erste fragt die Expressstrategie direkt nach ihrem Preis.", "Die zweite wählt Express im Shop und prüft, welcher Betrag wirklich im Warenkorb landet."),
            shot("lesson", "Die Zuordnung bestimmt, welche Strategie zum Zug kommt.", "Die Strategie berechnet den Betrag.", "Der Warenkorb ruft weiterhin dieselbe Operation auf und formatiert jedes Ergebnis auf dieselbe Weise.", hold=2),
        ),
    ),
    Film(
        "register", "der-test-der-einen-cent-unterschied-findet",
        "Der Test, der einen Cent Unterschied findet",
        ("Ein Cent", "als Spur"),
        "code-refaktorieren", "Bestehenden Code refaktorieren",
        (
            shot("start", "Zwei Kassen, ein Fall für dich.", "Die linke Kasse läuft seit Jahren. Die rechte wurde im Code umgebaut.", "Beide sollen ab hundert Euro Rabatt geben."),
            shot("below", "Wir schicken denselben Warenkorb für neunundneunzig Euro neunundneunzig durch beide Kassen.", "Die Ausdrucke stimmen überein. Auf beiden steht: kein Rabatt."),
            shot("above", "Nächste Spur. Der Warenkorb kostet hundert Euro und einen Cent.", "Die alte und die neue Kasse zeigen beide: Rabatt."),
            shot("think", "Knapp unter der Grenze stimmt alles. Knapp darüber auch.", "Welchen Betrag würdest du als Nächstes durch die beiden Kassen schicken?", hold=4.4),
            shot("exact", "Genau hundert Euro. Jetzt liegen zwei verschiedene Belege vor.", "Links gibt es Rabatt. Rechts bleibt er aus."),
            shot("rules", "Ein Blick in die Regeln erklärt den Unterschied.", "Links steht größer oder gleich hundert. Rechts steht größer als hundert.", "Bei genau hundert entscheidet das Gleichheitszeichen."),
            shot("assert", "Aus dem Fund machen wir einen Regressionstest.", "Wir legen den Eingabewert auf genau hundert Euro fest.", "Der Test erwartet, dass die Kasse Rabatt gibt."),
            shot("control", "Zuerst lassen wir den Test gegen die alte Kasse laufen.", "Sie gibt den erwarteten Rabatt, der Test ist grün.", "Jetzt behalten wir denselben Warenkorb und dieselbe Erwartung für die umgebaute Kasse bei."),
            shot("fail", "Der Test läuft gegen die umgebaute Kasse und schlägt fehl.", "So zeigt er, dass das vereinbarte Verhalten beim Umbau verloren gegangen ist."),
            shot("fix", "Wir ergänzen das Gleichheitszeichen in der neuen Regel.", "Der Test läuft noch einmal mit demselben Warenkorb und ist jetzt grün."),
            shot("suite", "Wir behalten alle drei Beträge als Tests.", "Bei neunundneunzig Euro neunundneunzig erwarten wir keinen Rabatt.", "Bei hundert Euro und bei hundert Euro und einem Cent erwarten wir Rabatt."),
            shot("cent", "Warum gerade ein Cent Abstand?", "Für einen Betrag mit zwei Nachkommastellen ist das der kleinstmögliche Schritt.", "Wir prüfen genau den Beginn des Rabatts und die unmittelbar benachbarten Beträge."),
            shot("lesson", "Beim nächsten Umbau laufen die Tests wieder.", "Sie prüfen dieselbe fachliche Zusage mit drei Beispielen rund um die Grenze.", "Der wichtigste Hinweis war der Betrag genau dazwischen.", hold=2),
        ),
    ),
)
