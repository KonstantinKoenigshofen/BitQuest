"""Sprechtext und Bildwechsel für das BitQuest-Video über Module."""

from dataclasses import dataclass


@dataclass(frozen=True)
class Beat:
    text: str
    pause: float = 0.26
    spoken: str = ""


# Jeder Eintrag löst einen Bildschritt aus. Ein Umbruch dient den Untertiteln.
STORY = {
    "conflict": (
        Beat("Ein Buch der Stadtbibliothek\nist 8 Tage überfällig.",
             spoken="Ein Buch der Stadtbibliothek ist acht Tage überfällig."),
        Beat("Nach der neuen Regel wird erst ab\n10 Tagen gemahnt.",
             spoken="Nach der neuen Regel wird erst ab zehn Tagen gemahnt."),
        Beat("Am Bildschirm steht: Noch keine Mahnung."),
        Beat("Im selben Moment bekommt die Leserin\neine Mahnmail."),
        Beat("Wie kann beides gleichzeitig passieren?", pause=4.6),
    ),
    "split": (
        Beat("Schau dir die beiden Wege an,\ndie dieselbe Ausleihe im Programm nimmt."),
        Beat("Für die Anzeige wurde die Frist\nvon 7 auf 10 Tage geändert.",
             spoken="Für die Anzeige wurde die Frist von sieben auf zehn Tage geändert."),
        Beat("8 ist kleiner als 10.\nDer Bildschirm meldet: Noch keine Mahnung.",
             spoken="Acht ist kleiner als zehn. Der Bildschirm meldet: Noch keine Mahnung."),
        Beat("Beim nächtlichen Mailversand ist\ndie alte 7-Tage-Regel geblieben.",
             spoken="Beim nächtlichen Mailversand ist dagegen die alte Sieben-Tage-Regel geblieben."),
        Beat("8 ist mindestens 7.\nDieser Teil löst eine Mahnmail aus.",
             spoken="Acht ist mindestens sieben. Dieser Teil löst eine Mahnmail aus."),
        Beat("Dieselbe Ausleihe liefert\nzwei verschiedene Antworten.", pause=0.9),
    ),
    "merge": (
        Beat("Wir bauen das Programm um.\nDie Frist bekommt einen festen Platz."),
        Beat("Beide Wege fragen jetzt das Mahnmodul.\nDort gilt die 10-Tage-Regel.",
             spoken="Beide Wege fragen jetzt das Mahnmodul. Dort gilt die Zehn-Tage-Regel."),
        Beat("Bei 8 Tagen bekommen beide\ndieselbe Antwort: Noch keine Mahnung.", pause=1.1,
             spoken="Bei acht Tagen bekommen beide dieselbe Antwort: Noch keine Mahnung."),
    ),
    "send": (
        Beat("Die Leserin behält das Buch\nnoch 4 Tage. Jetzt sind es 12.",
             spoken="Die Leserin behält das Buch noch vier Tage. Jetzt sind es zwölf."),
        Beat("12 ist mindestens 10.\nDas Mahnmodul sagt: Mahnung fällig.",
             spoken="Zwölf ist mindestens zehn. Das Mahnmodul sagt: Mahnung fällig."),
        Beat("Der nächtliche Lauf gibt einen Auftrag\nmit Empfängerin und Nachricht weiter."),
        Beat("Das Versandmodul bekommt den Auftrag\nund stellt die Mahnmail zu.", pause=0.9),
    ),
    "define": (
        Beat("Ein Modul ist ein Teil des Programms\nmit einer klaren Aufgabe."),
        Beat("Das Mahnmodul entscheidet,\nwann gemahnt wird."),
        Beat("Das Versandmodul kümmert sich\num die Zustellung."),
        Beat("Ändert sich die Frist,\npasst du sie an einer Stelle an."),
        Beat("Anzeige und Mahnlauf verwenden\ndieselbe Entscheidung.", pause=0.8),
    ),
    "question": (
        Beat("Morgen wechselt die Bibliothek\nihren Mailanbieter."),
        Beat("Welcher Teil des Programms\nmuss sich ändern?", pause=5.7),
    ),
    "solution": (
        Beat("Das Versandmodul wechselt\nzum neuen Anbieter."),
        Beat("Es bekommt weiterhin denselben Auftrag."),
        Beat("Bei 12 Tagen entscheidet das Mahnmodul\nweiterhin: Mahnung fällig.",
             spoken="Bei zwölf Tagen entscheidet das Mahnmodul weiterhin: Mahnung fällig."),
        Beat("Die Nachricht erreicht die Leserin\njetzt über den neuen Anbieter.", pause=0.8),
    ),
    "takeaway": (
        Beat("Frag dich bei einer geplanten Änderung:"),
        Beat("Welche Aufgaben ändern sich\naus demselben Grund?"),
        Beat("Diese Aufgaben gehören oft\nin dasselbe Modul.", pause=2.3),
    ),
}
