"""Erste Folge der konzeptorientierten Reihe. Jeder Absatz hat einen eigenen Bildeinsatz."""

from dataclasses import dataclass
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parents[1] / "staffel1"))
from season_storyboard import Shot, shot


@dataclass(frozen=True)
class Episode:
    key: str
    stem: str
    title: str
    shots: tuple[Shot, ...]


FILM = Episode(
    "entwurf",
    "softwaredesign-vom-verhalten-zur-struktur",
    "Was ist Softwaredesign? Vom Verhalten zur Struktur",
    (
        shot(
            "opening",
            "Zwei Programme sehen gleich aus. Du drückst auf Start, drei Sekunden verstreichen, beide zeigen null.",
            "Wenn beide heute dasselbe tun, woran erkennst du dann einen guten Entwurf?",
        ),
        shot(
            "design",
            "Softwaredesign beginnt mit einer Entscheidung über den inneren Aufbau eines Programms.",
            "Welche Aufgabe gehört wohin? Welche Teile brauchen einander? Und was muss ein Teil über den anderen wissen?",
            "Schauen wir hinter die beiden Anzeigen.",
        ),
        shot(
            "promise",
            "Am Anfang steht das Verhalten, das wir versprechen. Unser Timer soll nach drei Sekunden abgelaufen sein.",
            "Ob jemand in dieser Zeit auf das Display schaut, soll dabei keine Rolle spielen.",
            "Diese Anforderung können wir prüfen, bevor wir uns auf einen Aufbau festlegen.",
        ),
        shot(
            "ticks",
            "Im ersten Entwurf übernimmt die Anzeige zwei Aufgaben.",
            "Einmal pro Sekunde zeichnet sie eine Zahl. Bei jedem neuen Bild zieht sie außerdem eine Sekunde von der Restzeit ab.",
            "Solange die Anzeige regelmäßig läuft, sieht das richtig aus.",
        ),
        shot(
            "deadline",
            "Der zweite Entwurf merkt sich beim Start den Zeitpunkt, an dem die drei Sekunden vorbei sind.",
            "Wenn die Anzeige eine Zahl braucht, fragt sie nach der Restzeit. Die Zeitrechnung verwendet dafür eine gleichmäßig laufende Uhr.",
        ),
        shot(
            "think",
            "Jetzt starten wir beide Timer neu und blenden die Anzeigen für zwei Sekunden aus.",
            "Die Uhr läuft weiter. Die Anzeigen zeichnen in dieser Zeit kein Bild.",
            "Welche Restzeit liefert jeder Entwurf, wenn wir ihn jetzt abfragen?",
            hold=3.8,
        ),
        shot(
            "reveal",
            "Links stehen noch drei Sekunden im Speicher. Ohne neues Bild hat niemand den Zähler verändert.",
            "Rechts ergibt die Rechnung eine Sekunde Restzeit. Zwei der drei Sekunden sind vergangen.",
            "Erst diese kleine Änderung der Umgebung macht den Unterschied sichtbar.",
        ),
        shot(
            "responsibility",
            "Der Entwurf rechts trennt zwei Verantwortlichkeiten. Die Zeitrechnung entscheidet, wie viel Zeit bleibt. Die Anzeige entscheidet, wie das aussieht.",
            "Eine Verantwortung ist eine Entscheidung, für die ein Teil zuständig ist.",
            "Zusammengehörige Regeln bleiben so an einer Stelle.",
        ),
        shot(
            "coupling",
            "Links hängt das Ergebnis davon ab, wann die Anzeige zeichnet. Das ist eine Abhängigkeit zwischen Darstellung und Zeitmessung.",
            "Rechts braucht die Anzeige nur einen Wert in Sekunden. Ob die Zeitrechnung sich intern einen Endzeitpunkt merkt, kann ihr egal sein.",
            "Wie stark Teile voneinander abhängen, beschreibt ihre Kopplung.",
        ),
        shot(
            "change",
            "Morgen soll ein Ring die verbleibende Zeit darstellen. Dazu ändern wir die Darstellung.",
            "Später soll der Timer auch angehalten werden können. Was Pausieren für die Restzeit bedeutet, entscheidet die Zeitrechnung.",
            "Eine gute Grenze erkennst du daran, dass du bei einer Änderung sagen kannst, welche Entscheidung du anfassen musst.",
        ),
        shot(
            "cost",
            "Jede Grenze kostet auch etwas. Wer zwei Teile trennt, muss klären, wie sie zusammenarbeiten.",
            "Für eine einmalige Animation kann ein Ablauf genügen. Für eine Uhr, die auch im Hintergrund richtig gehen soll, lohnt sich eine eigene Zeitrechnung.",
            "Welche Lösung passt, hängt von der Zusage ab, die dein Programm einhalten soll.",
        ),
        shot(
            "transfer",
            "Probier die Idee an einem anderen Beispiel aus. Eine Wetteranzeige soll von Grad Celsius auf Fahrenheit wechseln.",
            "Was ändert sich am Messwert des Sensors?",
            hold=2.7,
        ),
        shot(
            "answer",
            "Der Sensor kann weiter in Celsius messen. Geändert wird, wie die Anzeige den Messwert umrechnet und beschriftet.",
            "Damit das klappt, müssen beide Seiten wissen, in welcher Einheit der Wert ankommt.",
        ),
        shot(
            "finish",
            "Damit hast du drei Fragen für deinen nächsten Entwurf. Welches Verhalten verspreche ich? Wer trifft welche Entscheidung? Welche Information muss über die Grenze?",
            "Die letzte Frage führt zu Schnittstellen. Sie halten fest, worauf sich zwei Teile verlassen können, wenn sie zusammenarbeiten.",
            hold=1.8,
        ),
    ),
)
