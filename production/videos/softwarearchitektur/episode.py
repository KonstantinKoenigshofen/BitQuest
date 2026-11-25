"""Sprechtext und Kapitel für den Auftakt zur Softwarearchitektur."""

from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1] / "staffel1"))
from season_storyboard import Film, shot


FILM = Film(
    "auftakt",
    "softwarearchitektur-was-passiert-wenn-das-netz-ausfaellt",
    "Was ist Softwarearchitektur?",
    ("Was ist", "Softwarearchitektur?"),
    "qualitaet-entwerfen",
    "Qualitätsziele in Entwürfe übersetzen",
    (
        shot(
            "bahnhof",
            "Acht Uhr zwölf am Bahnhof. Die Abfahrtstafel zeigt den nächsten Zug nach Bonn.",
            "Vier Minuten später fällt die Netzwerkverbindung aus.",
            "Was sollte die Tafel jetzt anzeigen?",
            hold=1.0,
        ),
        shot(
            "aufbau",
            "Schauen wir hinter die Tafel. Ein Fahrplanserver liefert die Daten. Über das Netz kommen sie zur Anzeige am Gleis.",
            "Welche Teile ein System hat, wo sie laufen und wie sie zusammenarbeiten, gehört zu seiner Softwarearchitektur.",
            "Am Ausfall sehen wir, warum dieser Aufbau das Verhalten des ganzen Systems prägt.",
        ),
        shot(
            "live",
            "Im ersten Entwurf zeigt die Tafel nur Daten aus der laufenden Verbindung.",
            "Beim Ausfall bekommt sie keine neuen Daten und hat keinen gespeicherten Stand.",
            "Sie kann nur melden, dass die Abfahrten unbekannt sind.",
        ),
        shot(
            "speicher",
            "Im zweiten Entwurf speichert die Tafel den letzten gültigen Stand direkt am Gleis, zusammen mit der Empfangszeit.",
            "Fällt das Netz aus, kann sie diesen Stand lokal lesen und anzeigen.",
            "Ein sichtbarer Zeitstempel verrät den Reisenden, wie alt er ist.",
        ),
        shot(
            "abwagen",
            "Mit dem lokalen Speicher bleibt die Information bei einem kurzen Ausfall verfügbar.",
            "Aber wenn sich inzwischen das Abfahrtsgleis ändert, erfährt die Tafel davon erst, wenn die Verbindung zurück ist.",
            "Damit stehen zwei Ziele im Konflikt: Verfügbarkeit und Aktualität.",
        ),
        shot(
            "ziel",
            "Machen wir daraus ein überprüfbares Ziel. Bei Netzausfall soll die Tafel innerhalb von zwei Sekunden reagieren.",
            "Sie zeigt den letzten Stand mit Uhrzeit, solange er jünger als fünf Minuten ist.",
            "Sobald der Stand fünf Minuten alt ist, wechselt sie zum Störungshinweis.",
        ),
        shot(
            "think",
            "Jetzt du. Die letzten Daten kamen um acht Uhr zwölf. Das Netz fällt erst um acht Uhr sechzehn aus.",
            "Bis zu welcher Uhrzeit darf die Tafel den gespeicherten Stand zeigen?",
            hold=4.0,
        ),
        shot(
            "antwort",
            "Bis kurz vor acht Uhr siebzehn. Beim Ausfall sind die Daten schon vier Minuten alt.",
            "Die fünf Minuten zählen ab dem Empfang. Um acht Uhr siebzehn erscheint der Störungshinweis.",
        ),
        shot(
            "pruefen",
            "Ob unser Entwurf das Ziel erfüllt, zeigt ein Test. Wir trennen die Verbindung und starten eine Stoppuhr.",
            "Wir prüfen, wann der Zeitstempel erscheint und ob die Tafel bei exakt fünf Minuten Datenalter umschaltet.",
            "Für diese Entscheidung braucht die Tafel Regeln für den Speicher, das Datenalter und die Rückkehr der Verbindung.",
        ),
        shot(
            "ausblick",
            "Wenn du eine Architekturentscheidung triffst, frag dich: Was muss das System in einer konkreten Lage leisten? Welche Struktur hilft dabei? Und welche Folgen hat die Wahl?",
            "In der nächsten Folge geht es darum, solche Qualitätsziele so zu formulieren, dass dein Team sie testen kann.",
            hold=2.0,
        ),
    ),
)

CHAPTERS = (
    ("bahnhof", "Eine Tafel verliert die Verbindung"),
    ("aufbau", "Was gehört zur Softwarearchitektur?"),
    ("live", "Zwei Entwürfe im Vergleich"),
    ("ziel", "Zwei messbare Grenzen"),
    ("think", "Denkaufgabe und Auflösung"),
    ("pruefen", "Den Entwurf testen"),
    ("ausblick", "Drei Fragen und Ausblick"),
)
