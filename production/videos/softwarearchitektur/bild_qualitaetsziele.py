"""Szenen zu Qualitätszielen, unabhängig gemessenen Zeiten und Störungstests."""

from PIL import ImageDraw

from animation import card, ease, text
from bild import AMBER, BLUE, EDGE, MINT, MUTED, NIGHT, PANEL, RED, WHITE
from bild import arrow, backdrop, label, mast, platform, station, title
from visuals import dot, line


def panel(d, bounds, accent=EDGE):
    card(d, bounds, PANEL, accent, 18)


def auftrag(d, clock):
    mast(d, "Softwarearchitektur · Folge 2")
    title(d, "Qualitätsziele messbar machen")
    card(d, (64, 243, 622, 463), NIGHT, EDGE, 20)
    text(d, 91, 305, "„Die Tafel soll", 45, WHITE, True)
    text(d, 91, 364, "zuverlässig sein.“", 45, WHITE, True)
    text(d, 92, 419, "Was würdest du messen?", 29, MINT)
    later = clock.move(1, .22) > .1
    station(d, 672, 246, 544, "08:16", 2, "Stand 08:12 · offline" if later else "Live", AMBER if later else MINT)


def lage(d, clock):
    mast(d, "Qualitätsszenario")
    title(d, "Der Ausfall im Berufsverkehr")
    panel(d, (64, 230, 1216, 532))
    text(d, 97, 273, "Abfahrtstafel am Gleis", 30, WHITE, True)
    line(d, [(166, 397), (1110, 397)], EDGE, 5)
    dot(d, 229, 397, 11, BLUE)
    label(d, 229, 356, "08:12", BLUE, 44)
    label(d, 229, 449, "Gültiger Stand empfangen", MUTED, 25)
    if clock.move(1, .2) > .1:
        arrow(d, (240, 397), (1039, 397), BLUE, clock.move(1, 1.5))
        dot(d, 1039, 397, 11, RED)
        label(d, 1039, 356, "08:16:30", RED, 44)
        label(d, 1039, 449, "Verbindung bricht ab", MUTED, 25)


def reaktion(d, clock):
    mast(d, "Messung 1")
    title(d, "Wie schnell reagiert die Tafel?")
    station(d, 64, 243, 562, "08:16", 2, "Stand 08:12 · offline", AMBER)
    panel(d, (666, 243, 1216, 457), BLUE)
    text(d, 695, 294, "Bis der Zeitstempel sichtbar ist", 28, BLUE, True)
    if clock.move(1, .22) > .1:
        text(d, 695, 359, "≤ 2 Sekunden", 57, WHITE, True)
        text(d, 695, 419, "Stoppuhr startet beim Ausfall", 27, MUTED)


def datenalter(d, clock):
    mast(d, "Messung 2")
    title(d, "Wie alt darf der Stand sein?")
    line(d, [(137, 388), (1138, 388)], EDGE, 6)
    arrow(d, (137, 388), (1038, 388), BLUE, clock.move(0, 1.8))
    dot(d, 137, 388, 10, BLUE)
    dot(d, 1038, 388, 10, RED)
    label(d, 137, 345, "08:12", BLUE, 35)
    label(d, 137, 431, "Empfang", MUTED, 24)
    text(d, 1038, 345, "08:16:30", 35, RED, True, "rm")
    text(d, 1038, 431, "Ausfall", 24, MUTED, True, "rm")
    label(d, 570, 338, "4 Minuten 30 Sekunden", BLUE, 29)
    if clock.move(2, .22) > .1:
        arrow(d, (1048, 388), (1138, 388), AMBER, clock.move(2, 1.1))
        dot(d, 1138, 388, 10, AMBER)
        label(d, 1138, 345, "08:17", AMBER, 35)
        label(d, 1138, 431, "Störungshinweis", AMBER, 24)
        label(d, 1082, 488, "30 Sekunden übrig", AMBER, 25)
    elif clock.move(1, .22) > .1:
        label(d, 640, 504, "Letzten Stand nur unter 5 Minuten Datenalter zeigen", AMBER, 30)


def szenario(d, clock):
    mast(d, "Qualitätsszenario")
    title(d, "Sechs Angaben für denselben Test")
    fields = (
        ("Quelle", "Netzverbindung", BLUE),
        ("Auslöser", "Verbindung bricht ab", RED),
        ("Umgebung", "Berufsverkehr", BLUE),
        ("Systemteil", "Tafel am Gleis", BLUE),
        ("Reaktion", "Letzter Stand mit Uhrzeit", MINT),
        ("Messgrößen", "Reaktionszeit und Datenalter", AMBER),
    )
    for index, (name, value, accent) in enumerate(fields):
        if clock.move(index // 2, .23, (index % 2) * .7) < .1:
            continue
        x = 64 + (index % 3) * 385
        y = 220 + (index // 3) * 150
        panel(d, (x, y, x + 368, y + 129))
        text(d, x + 18, y + 36, name, 25, accent, True)
        text(d, x + 18, y + 87, value, 24, WHITE, True)


def aufbau(d, clock):
    mast(d, "Störungstest")
    title(d, "Eine reproduzierbare Prüfung")
    steps = (
        ("Stand einspielen", "Empfang um 08:12", BLUE),
        ("Netz unterbrechen", "Ausfall um 08:16:30", RED),
        ("Anzeige beobachten", "Beide Zeiten notieren", MINT),
    )
    for index, (name, value, accent) in enumerate(steps):
        x = 64 + index * 405
        if clock.move(min(index, 1), .25, 1.55 if index == 2 else .08) < .1:
            continue
        panel(d, (x, 263, x + 342, 477), accent)
        text(d, x + 20, 324, name, 29, WHITE, True)
        text(d, x + 20, 400, value, 25, accent)
        if index:
            arrow(d, (x - 54, 374), (x - 10, 374), accent, clock.move(1, .75))


RESULTS = (
    ("A", "1,4 s", "5:00 min", "Bestanden", MINT, MINT),
    ("B", "0,8 s", "5:14 min", "Daten zu alt", MINT, RED),
    ("C", "2,4 s", "5:00 min", "Reaktion zu spät", RED, MINT),
)


def messungen(d, clock, reveal):
    mast(d, "Auflösung" if reveal else "Denkaufgabe")
    title(d, "Welcher Versuch besteht?")
    panel(d, (64, 210, 1216, 541))
    text(d, 93, 253, "Versuch", 25, MUTED, True)
    text(d, 284, 247, "Reaktionszeit", 27, BLUE, True)
    text(d, 284, 282, "höchstens 2 s", 22, MUTED)
    text(d, 579, 247, "Datenalter beim Wechsel", 27, AMBER, True)
    text(d, 579, 282, "genau 5:00 min", 22, MUTED)
    text(d, 951, 253, "Ergebnis", 25, MUTED, True)
    for index, (name, reaction, age, result, reaction_color, age_color) in enumerate(RESULTS):
        y = 326 + index * 75
        line(d, [(91, y - 21), (1189, y - 21)], EDGE, 2)
        marked = reveal and clock.move(index, .25) > .1
        text(d, 93, y + 16, name, 32, WHITE, True)
        text(d, 284, y + 16, reaction, 32, reaction_color if marked else WHITE, True)
        text(d, 579, y + 16, age, 32, age_color if marked else WHITE, True)
        if marked:
            text(d, 951, y + 16, result, 28, MINT if index == 0 else RED, True)
    if not reveal and clock.seconds >= clock.spoken:
        progress = ease(clock.seconds, clock.end - clock.spoken, clock.spoken)
        line(d, [(404, 579), (876, 579)], EDGE, 6)
        line(d, [(404, 579), (405 + 471 * progress, 579)], AMBER, 6)


def grenzen(d, clock):
    mast(d, "Weitere Ausgangslage")
    title(d, "Neustart mit leerem Speicher")
    text(d, 64, 246, "Ohne Netz und ohne gültigen Stand", 28, RED, True)
    station(d, 64, 282, 553, "08:16", None, "Störung · kein Datenstand", RED)
    if clock.move(1, .25, 2.45) > .1:
        text(d, 663, 246, "Neuer gültiger Stand empfangen", 28, MINT, True)
        station(d, 663, 282, 553, "08:18", 2, "Live", MINT)


def naechste(d, clock):
    mast(d, "Qualitätsziele")
    title(d, "Vom Wunsch zum überprüfbaren Ziel")
    for index, (name, detail, accent) in enumerate((
        ("Konkrete Lage", "Netz fällt im Berufsverkehr aus", BLUE),
        ("Erwartete Reaktion", "Tafel zeigt den letzten Stand mit Uhrzeit", MINT),
        ("Messgröße", "Zeit bis zur Reaktion und Alter der Daten", AMBER),
    )):
        y = 222 + 94 * index
        if clock.move(0, .24, index * 1.8) > .1:
            panel(d, (64, y, 1216, y + 72))
            text(d, 89, y + 36, name, 29, accent, True)
            text(d, 434, y + 36, detail, 30, WHITE, True)
    if clock.move(1, .24) > .1:
        text(d, 64, 544, "Nächste Folge · Architekturentscheidungen dokumentieren", 27, MINT, True)


DRAWERS = {
    "auftrag": auftrag,
    "lage": lage,
    "reaktion": reaktion,
    "datenalter": datenalter,
    "szenario": szenario,
    "aufbau": aufbau,
    "grenzen": grenzen,
    "naechste": naechste,
}


def frame(_key, action, clock):
    image = (platform() if action == "auftrag" else backdrop()).copy()
    d = ImageDraw.Draw(image)
    if action in ("think", "loesung"):
        messungen(d, clock, action == "loesung")
    else:
        DRAWERS[action](d, clock)
    return image


def poster(film):
    image = platform().copy()
    d = ImageDraw.Draw(image)
    mast(d, "Folge 2 · Qualitätsziele")
    card(d, (64, 140, 727, 547), NIGHT, radius=24)
    text(d, 95, 221, film.poster_title[0], 74, WHITE, True)
    text(d, 95, 315, film.poster_title[1], 70, WHITE, True)
    line(d, [(96, 390), (201, 390)], MINT, 6)
    text(d, 95, 453, "Zwei Messungen am Bahnsteig", 33, MINT, True)
    panel(d, (758, 235, 1216, 366), BLUE)
    text(d, 787, 279, "Reaktionszeit", 26, BLUE, True)
    text(d, 787, 334, "≤ 2 Sekunden", 42, WHITE, True)
    panel(d, (758, 385, 1216, 516), AMBER)
    text(d, 787, 429, "Datenalter", 26, AMBER, True)
    text(d, 787, 484, "< 5 Minuten", 42, WHITE, True)
    return image
