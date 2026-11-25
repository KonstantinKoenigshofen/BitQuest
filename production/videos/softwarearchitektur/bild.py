"""Animierte Tafeln, Datenflüsse und Zeitachsen für den Architekturauftakt."""

from functools import lru_cache
from math import atan2, cos, sin

from PIL import Image, ImageDraw

from animation import HEIGHT, WIDTH, card, ease, text
from visuals import dot, line

NIGHT = "#101723"
PANEL = "#1b293b"
EDGE = "#3b506a"
MUTED = "#b3c3d7"
WHITE = "#f5f8fe"
BLUE = "#9ed6f8"
MINT = "#9ee8d3"
AMBER = "#ffd686"
RED = "#ffb09d"


@lru_cache
def backdrop():
    image = Image.new("RGB", (WIDTH, HEIGHT), NIGHT)
    d = ImageDraw.Draw(image)
    for y in range(112, 600, 24):
        for x in range(24, WIDTH, 24):
            dot(d, x, y, 1, "#243248")
    return image


def mast(d, section):
    for index, fill in enumerate((MINT, BLUE, BLUE, MINT)):
        x, y = 64 + 15 * (index % 2), 40 + 15 * (index // 2)
        card(d, (x, y, x + 10, y + 10), fill, radius=2)
    text(d, 103, 52, "BitQuest Videos", 23, WHITE, True)
    text(d, 1216, 52, section, 22, MUTED, anchor="rm")
    line(d, [(64, 83), (1216, 83)], EDGE, 2)


def title(d, value):
    text(d, 64, 145, value, 54, WHITE, True)


def label(d, x, y, value, color=WHITE, size=28):
    text(d, x, y, value, size, color, True, "mm")


def arrow(d, start, end, color, progress=1):
    x, y = end
    angle = atan2(y - start[1], x - start[0])
    line(d, [start, end], color, 4)
    d.polygon([(x, y), (x - 17 * cos(angle - .55), y - 17 * sin(angle - .55)),
               (x - 17 * cos(angle + .55), y - 17 * sin(angle + .55))], fill=color)
    if 0 < progress < 1:
        px = start[0] + (x - start[0]) * progress
        py = start[1] + (y - start[1]) * progress
        dot(d, px, py, 9, WHITE)


def station(d, x, y, width, time, track, status, accent):
    """Gleiche Tafel für Live-Daten, letzten Stand und Störung."""
    right = x + width
    card(d, (x, y, right, y + 214), "#101925", EDGE, 20)
    card(d, (x + 8, y + 8, right - 8, y + 62), PANEL, radius=13)
    dot(d, x + 29, y + 35, 5, accent)
    text(d, x + 46, y + 35, "ABFAHRTEN", 19, WHITE, True)
    text(d, right - 24, y + 35, time, 21, WHITE, True, "rm")
    line(d, [(x + 24, y + 147), (right - 24, y + 147)], EDGE, 2)
    if track:
        text(d, x + 24, y + 108, "08:21  Bonn Hbf", 38, AMBER, True)
        text(d, right - 24, y + 108, f"Gleis {track}", 28, AMBER, True, "rm")
    else:
        text(d, x + 24, y + 108, "Abfahrten unbekannt", 36, AMBER, True)
    text(d, x + 24, y + 178, status, 25, accent, True)


@lru_cache
def platform():
    image = backdrop().copy()
    d = ImageDraw.Draw(image)
    d.polygon([(0, 206), (1280, 397), (1280, 445), (0, 320)], fill="#26374e")
    d.polygon([(0, 206), (1280, 397), (1280, 406), (0, 226)], fill="#435671")
    for x, y, width in ((134, 320, 22), (300, 345, 18), (1018, 415, 12), (1135, 430, 8)):
        d.rectangle((x, y, x + width, 592 - x * .052), fill="#324662")
    d.polygon([(0, 602), (1280, 516), (1280, 579), (0, 720)], fill="#1a2940")
    line(d, [(0, 602), (1280, 516)], "#596077", 6)
    for y in (656, 704):
        line(d, [(0, y), (1280, 529)], "#394d69", 4)
    return image


def bahnhof(d, clock):
    mast(d, "Softwarearchitektur · Folge 1")
    title(d, "Was ist Softwarearchitektur?")
    for x in (352, 904):
        line(d, [(x, 255), (x, 302)], EDGE, 7)
    lost = clock.move(1, .2) > .1
    current_time = "08:16" if lost else "08:12"
    station(d, 220, 297, 840, current_time, 2, "Verbindung unterbrochen" if lost else "Live", RED if lost else MINT)
    if clock.move(2, .2) > .1:
        label(d, 640, 550, "Was sollte die Tafel jetzt anzeigen?", AMBER, 33)


def node(d, x, y, width, name, location, accent):
    card(d, (x, y, x + width, y + 116), PANEL, accent, 16)
    text(d, x + 21, y + 39, name, 32, WHITE, True)
    text(d, x + 21, y + 80, location, 23, accent)


def diagram(d, clock, action):
    headers = {
        "aufbau": ("Systemaufbau", "Hinter der Abfahrtstafel"),
        "live": ("Entwurf A", "Nur Live-Daten"),
        "speicher": ("Entwurf B", "Mit lokalem Speicher"),
    }
    section, heading = headers[action]
    mast(d, section)
    title(d, heading)
    lost = action != "aufbau" and clock.move(1, .2) > .1
    local = action == "speicher" and clock.move(0, .24) > .1
    card(d, (783, 195, 1216, 570), "#152334", EDGE, 20)
    text(d, 807, 219, "AM GLEIS", 19, BLUE, True)
    node(d, 65, 250, 280, "Fahrplanserver", "Rechenzentrum", BLUE)
    if lost:
        line(d, [(345, 307), (558, 307)], EDGE)
        line(d, [(620, 307), (808, 307)], EDGE)
        dot(d, 589, 307, 23, "#462f38")
        line(d, [(581, 299), (597, 315)], RED)
        line(d, [(581, 315), (597, 299)], RED)
        label(d, 589, 255, "Netz unterbrochen", RED, 22)
    else:
        arrow(d, (345, 307), (808, 307), BLUE, clock.move(0, 2.2))
        label(d, 565, 265, "Fahrplandaten übers Netz", BLUE, 24)
    status, accent = "Nächste Abfahrten", MINT
    if lost:
        status, accent = ("Stand 08:12", AMBER) if local else ("Keine Daten", RED)
    node(d, 808, 250, 382, "Abfahrtstafel", status, accent)
    if local:
        node(d, 808, 430, 382, "Letzter gültiger Stand", "Empfangen um 08:12", AMBER)
        if lost:
            arrow(d, (1000, 430), (1000, 368), AMBER, clock.move(1, 1.1))
            text(d, 1023, 400, "lesen", 22, AMBER)
        else:
            arrow(d, (1000, 367), (1000, 429), MINT, clock.move(0, 2.6, .5))
            text(d, 1023, 400, "speichern", 22, MINT)
    if action == "aufbau" and clock.move(1, .2) > .1:
        for y, question in ((435, "Welche Teile gibt es?"), (485, "Wo laufen sie?"), (535, "Wie arbeiten sie zusammen?")):
            dot(d, 76, y, 5, BLUE)
            text(d, 96, y, question, 28, WHITE, True)
    if action == "live" and clock.move(2, .2) > .1:
        label(d, 999, 479, "Abfahrten unbekannt", RED, 29)


def abwagen(d, clock):
    mast(d, "Zielkonflikt")
    title(d, "Verfügbarkeit und Aktualität")
    switched = clock.move(1, .25) > .1
    text(d, 64, 243, "Neuer Stand am Server", 26, BLUE, True)
    text(d, 662, 243, "Tafel ohne Netz", 26, AMBER, True)
    station(d, 64, 277, 555, "08:16", 4 if switched else 2, "Neues Abfahrtsgleis" if switched else "Live", BLUE)
    station(d, 662, 277, 554, "08:16", 2, "Stand 08:12 · offline", AMBER)
    if clock.move(2, .2) > .1:
        text(d, 64, 537, "Die Änderung bleibt am Server.", 26, BLUE)
        text(d, 662, 537, "Die Tafel zeigt einen älteren Stand.", 26, AMBER)


def metric(d, x, caption, value, reading, accent):
    card(d, (x, 242, x + 547, 528), PANEL, EDGE, 20)
    text(d, x + 29, 289, caption, 25, accent, True)
    text(d, x + 29, 374, value, 69, WHITE, True)
    text(d, x + 29, 469, reading, 27, MUTED)


def ziel(d, clock):
    mast(d, "Qualitätsziel")
    title(d, "Zwei Zeiten. Zwei Startpunkte.")
    metric(d, 64, "Reaktion auf Netzausfall", "≤ 2 Sekunden", "Gemessen ab dem Ausfall", BLUE)
    if clock.move(1, .25) > .1:
        reading = "Danach erscheint der Störungshinweis" if clock.move(2, .25) > .1 else "Gemessen ab dem Datenempfang"
        metric(d, 668, "Alter des angezeigten Stands", "< 5 Minuten", reading, AMBER)


def timeline(d, clock, answer):
    mast(d, "Auflösung" if answer else "Denkaufgabe")
    title(d, "Wann läuft der Stand ab?")
    x0, x1, y = 145, 1115, 359
    age = x0 + (x1 - x0) * 4 / 5
    if answer:
        line(d, [(x0, y), (age, y)], BLUE, 8)
        line(d, [(age, y), (age + (x1 - age) * clock.move(0, 1.0), y)], AMBER, 8)
    else:
        line(d, [(x0, y), (age, y)], EDGE, 5)
        for x in range(round(age), x1, 21):
            line(d, [(x, y), (x + 9, y)], EDGE, 5)
    for i in range(6):
        x = x0 + (x1 - x0) * i / 5
        dot(d, x, y, 10 if i in (0, 4, 5) else 4, BLUE if i in (0, 4) else AMBER if i == 5 else MUTED)
    label(d, x0, 303, "08:12", BLUE, 40)
    label(d, age, 303, "08:16", BLUE, 40)
    label(d, x1, 303, "08:17" if answer else "?", AMBER, 40)
    label(d, x0, 404, "Daten empfangen", MUTED, 24)
    label(d, age, 404, "Netzausfall", MUTED, 24)
    if answer:
        label(d, x1, 404, "Störungshinweis", AMBER, 23)
        label(d, (x0 + age) / 2, 486, "4 Minuten alt beim Ausfall", BLUE, 28)
        label(d, (age + x1) / 2, 486, "1 Minute übrig", AMBER, 23)
    elif clock.seconds >= clock.spoken:
        progress = ease(clock.seconds, clock.end - clock.spoken, clock.spoken)
        line(d, [(415, 513), (865, 513)], EDGE, 6)
        line(d, [(415, 513), (416 + 449 * progress, 513)], AMBER, 6)


def pruefen(d, clock):
    mast(d, "Störungstest")
    title(d, "Den Entwurf am Ausfall prüfen")
    card(d, (64, 225, 1216, 540), PANEL, EDGE, 24)
    text(d, 96, 277, "Versuch: Netzverbindung unterbrechen", 34, WHITE, True)
    line(d, [(96, 322), (1184, 322)], EDGE, 2)
    if clock.move(1, .25) > .1:
        for y, color, action, target in (
            (370, BLUE, "Zeitstempel erscheint", "≤ 2 Sekunden nach Ausfall"),
            (436, AMBER, "Störungshinweis erscheint", "Bei 5 Minuten Datenalter"),
        ):
            dot(d, 106, y, 6, color)
            text(d, 132, y, action, 28, WHITE, True)
            text(d, 1184, y, target, 27, color, True, "rm")
    if clock.move(2, .25) > .1:
        text(d, 96, 501, "Weitere Testfälle: leerer Speicher und Wiederverbindung", 23, MUTED)


def ausblick(d, clock):
    mast(d, "Architekturentscheidungen")
    title(d, "Drei Fragen für deinen Entwurf")
    for index, (name, prompt, accent) in enumerate((
        ("Ziel", "Was muss das System leisten?", BLUE),
        ("Aufbau", "Welche Struktur hilft dabei?", MINT),
        ("Folgen", "Was ändert sich durch die Wahl?", AMBER),
    )):
        y = 216 + index * 93
        if clock.move(0, .25, index * 2.1) > .1:
            card(d, (64, y, 1216, y + 73), PANEL, EDGE, 15)
            text(d, 90, y + 36, name, 28, accent, True)
            text(d, 300, y + 36, prompt, 32, WHITE, True)
    if clock.move(1, .25) > .1:
        text(d, 64, 541, "Nächste Folge · Qualitätsziele messbar machen", 27, BLUE, True)


def frame(_key, action, clock):
    image = (platform() if action == "bahnhof" else backdrop()).copy()
    d = ImageDraw.Draw(image)
    if action in ("aufbau", "live", "speicher"):
        diagram(d, clock, action)
    elif action in ("think", "antwort"):
        timeline(d, clock, action == "antwort")
    else:
        drawers = {"bahnhof": bahnhof, "abwagen": abwagen, "ziel": ziel, "pruefen": pruefen, "ausblick": ausblick}
        drawers[action](d, clock)
    return image


def poster(film):
    image = platform().copy()
    d = ImageDraw.Draw(image)
    mast(d, "Folge 1 · Grundlagen")
    card(d, (63, 139, 746, 553), NIGHT, radius=26)
    text(d, 95, 210, film.poster_title[0], 79, WHITE, True)
    text(d, 95, 303, film.poster_title[1], 65, WHITE, True)
    line(d, [(96, 384), (193, 384)], AMBER, 6)
    text(d, 95, 445, "Wenn am Bahnhof das Netz ausfällt", 33, AMBER, True)
    station(d, 773, 289, 443, "08:16", 2, "Stand 08:12 · offline", AMBER)
    return image
