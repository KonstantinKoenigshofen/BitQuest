"""Zeichnungen und Bewegung für „Vom Verhalten zur Struktur“, 1280 × 720."""

from functools import lru_cache
from math import cos, floor, pi, sin
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

PAPER = "#f4f0e4"
INK = "#14392f"
MINT = "#a9ebbd"
CORAL = "#f6ad85"
WHITE = "#fffcf1"
EDGE = "#8ca99b"
DARK = "#0e2923"
LCD = "#193e32"


@lru_cache
def face(size, kind):
    names = {"bold": "segoeuib.ttf", "regular": "segoeui.ttf", "mono": "consolab.ttf"}
    return ImageFont.truetype(str(Path(os.environ["WINDIR"]) / "Fonts" / names[kind]), size)


def txt(d, xy, s, size=36, color=INK, kind="bold", anchor="lm", width=None):
    f = face(size, kind)
    if width and f.getlength(s) > width:
        f = face(int(size * width / f.getlength(s)), kind)
    d.text(xy, s, fill=color, font=f, anchor=anchor)


def box(d, bounds, fill, r=14, edge=None, thick=2):
    d.rounded_rectangle(bounds, radius=r, fill=fill, outline=edge, width=thick)


def disc(d, x, y, r, fill, edge=None, thick=2):
    d.ellipse((x - r, y - r, x + r, y + r), fill=fill, outline=edge, width=thick)


@lru_cache
def paper(dark):
    bg = Image.new("RGB", (1280, 720), DARK if dark else PAPER)
    d = ImageDraw.Draw(bg)
    for x in range(30, 1280, 28):
        for y in range(161, 610, 28):
            d.point((x, y), fill="#437060" if dark else "#b3b3a4")
    return bg


def mast(d, dark, chapter):
    ink = WHITE if dark else INK
    for a, b in ((0, 0), (1, 0), (0, 1), (1, 1)):
        x, y = 60 + 16 * a, 46 + 16 * b
        box(d, (x, y, x + 11, y + 11), (MINT if dark else "#18835e") if a == b else ink, 2)
    txt(d, (107, 60), "BitQuest Videos", 25, ink)
    txt(d, (1220, 60), chapter, 24, MINT if dark else "#3e6657", "regular", "rm")
    d.line((60, 95, 1220, 95), fill="#42665a" if dark else "#bdc6b6", width=2)


def heading(d, title, dark=False):
    txt(d, (60, 150), title, 57, WHITE if dark else INK, width=1160)


def dial(d, x, y, r, value, color=MINT, number=True):
    disc(d, x, y, r, "#112c25", "#789685", 3)
    for i in range(36):
        a = -pi / 2 + 2 * pi * i / 36
        length = 10 if i % 3 == 0 else 5
        d.line(
            (
                x + (r - 8) * cos(a),
                y + (r - 8) * sin(a),
                x + (r - 8 - length) * cos(a),
                y + (r - 8 - length) * sin(a),
            ),
            fill="#709284",
            width=3 if i % 3 == 0 else 2,
        )
    inner = r - 24
    d.arc((x - inner, y - inner, x + inner, y + inner), -90, 270, fill="#395849", width=7)
    if value > 0:
        d.arc(
            (x - inner, y - inner, x + inner, y + inner),
            -90,
            -90 + 360 * min(1, value / 3),
            fill=color,
            width=8,
        )
    if number:
        txt(d, (x, y), str(round(value)), int(r * 0.80), WHITE, "mono", "mm")


def instrument(d, x, y, w, value, *, muted=False, ring=False, trim=MINT):
    """Frontansicht beider Timer. Gehäuse und Position bleiben beim Bildwechsel erhalten."""
    h = round(w * 0.46)
    left, top = x - w // 2, y - h // 2
    right, bottom = left + w, top + h
    box(d, (left + 7, top + 12, right + 7, bottom + 12), "#638074", 29)
    box(d, (left, top, right, bottom), "#d6dfc9", 29, INK, 4)
    for xx in (left + 22, right - 22):
        for yy in (top + 21, bottom - 21):
            disc(d, xx, yy, 5, "#68907c")
            d.line((xx - 2, yy + 2, xx + 2, yy - 2), fill=INK, width=1)
    glass = (left + 29, top + 28, right - 30, bottom - 29)
    box(d, glass, LCD, 18, "#628471", 3)
    if muted:
        d.line((x - 24, y, x + 24, y), fill="#668375", width=3)
        return
    if ring:
        dial(d, x, y, int(h * 0.37), value, trim)
        return
    txt(d, (x, y - 6), f"0:0{int(value)}", round(h * 0.51), WHITE, "mono", "mm")
    line_y = bottom - 49
    for i in range(12):
        xx = left + 59 + i * (w - 118) / 12
        d.line(
            (xx, line_y, xx + (w - 118) / 12 - 5, line_y),
            fill=trim if i < value * 4 else "#416252",
            width=5,
        )


def track(d, x, y, end, elapsed, *, dark=False):
    ink = WHITE if dark else INK
    edge = EDGE if dark else "#789181"
    d.line((x, y, end, y), fill=edge, width=4)
    for i in range(4):
        dx = x + (end - x) * i / 3
        d.line((dx, y - 9, dx, y + 10), fill=edge, width=3)
        txt(d, (dx, y + 35), f"{i} s", 29, ink, "mono", "mm")
    px = x + (end - x) * elapsed / 3
    disc(d, px, y, 10, MINT if dark else INK)


def arrow(d, x, y, end, color, progress=1):
    stop = x + (end - x) * progress
    d.line((x, y, stop, y), fill=color, width=5)
    if progress > 0.02:
        d.polygon([(stop, y), (stop - 14, y - 9), (stop - 14, y + 9)], fill=color)


def panel(d, bounds, tint=WHITE):
    l, t, r, b = bounds
    box(d, (l + 4, t + 7, r + 4, b + 7), "#93a698", 18)
    box(d, bounds, tint, 18, INK, 3)


def linear(clock, cue, length, offset=0):
    return min(1, max(0, (clock.seconds - clock.cues[cue] - offset) / length))


def pair(d, action, c):
    dark = action in ("think", "reveal")
    ink = WHITE if dark else INK
    names = ("Anzeige zählt", "Uhr misst") if dark else ("Entwurf A", "Entwurf B")
    if action == "opening":
        value = max(0, 3 - floor(3 * linear(c, 0, 3, 2.45)))
        values = (value, value)
    elif action == "think":
        values = (3, 3)
    else:
        values = (3, 1)
    for i, x in enumerate((344, 936)):
        off = (action == "think" and c.seconds > c.cues[0] + 1.45) or (
            action == "reveal" and i == 1 and c.seconds < c.cues[1]
        )
        instrument(d, x, 359, 440, values[i], muted=off, trim=CORAL if i == 0 else MINT)
        txt(d, (x, 506), names[i], 39, ink, anchor="mm")
    if action == "think":
        track(d, 323, 558, 957, 2 * linear(c, 1, 2), dark=True)
    if action == "reveal" and c.seconds >= c.cues[1]:
        txt(d, (640, 575), "3 s − 2 s = 1 s", 49, MINT, "mono", "mm")


def design(d, c):
    instrument(d, 311, 370, 445, 3)
    for i, (name, description) in enumerate(
        (
            ("Aufgabe", "Was entscheidet ein Teil?"),
            ("Abhängigkeit", "Wen braucht er dafür?"),
            ("Schnittstelle", "Was erfährt die andere Seite?"),
        )
    ):
        yy = 255 + 116 * i
        active = c.seconds >= c.cues[1] + (0, 2.0, 3.8)[i]
        d.line([(535, 370), (567, 370), (567, yy), (622, yy)], fill="#68917d", width=3)
        disc(d, 624, yy, 6, INK)
        txt(d, (647, yy), name, 44, INK if active else "#63756b")
        if active:
            txt(d, (648, yy + 47), description, 32, "#375849", "regular")


def timing(d, action, c):
    if action == "ticks":
        p = linear(c, 1, 3, 0.8)
        n = min(3, floor(3 * p))
        instrument(d, 312, 370, 430, 3 - n, trim=CORAL)
        for i in range(4):
            x = 657 + i * 133
            box(d, (x - 48, 315, x + 49, 418), INK if i == n else "#d6ddcd", 12)
            txt(d, (x, 362), str(3 - i), 58, WHITE if i == n else INK, "mono", "mm")
            txt(d, (x, 457), f"Bild {i+1}", 26, INK, anchor="mm")
        txt(d, (848, 249), "Bei jedem Bild: −1 s", 40, INK, anchor="mm")
        return
    guarantee = action == "promise"
    left, right = 155, 1120
    t = 3 * linear(c, 0, 3, 1.2) if guarantee else linear(c, 1, 1.1)
    chart_y = 425
    for x, caption in [(left, "Start"), (right, "Endzeit")]:
        d.line((x, 320, x, chart_y - 15), fill=EDGE, width=3)
        txt(d, (x, 281), caption, 40, INK, anchor="mm")
    track(d, left, chart_y, right, t)
    width = (right - left) * t / 3
    if width > 1:
        d.line((left, chart_y - 2, left + width, chart_y - 2), fill="#29845e", width=7)
    if guarantee:
        txt(d, (640, 542), "Nach 3 Sekunden abgelaufen", 45, INK, anchor="mm")
    else:
        txt(d, (640, 548), "Restzeit = Endzeit − aktuelle Zeit", 47, INK, anchor="mm")


def module(d, x, name, detail, color, motif):
    panel(d, (x - 192, 244, x + 192, 525), color)
    if motif == "measure":
        dial(d, x, 328, 55, 2, number=False)
        d.line((x, 328, x + 20, 307), fill=WHITE, width=5)
        disc(d, x, 328, 5, WHITE)
    else:
        box(d, (x - 70, 288, x + 70, 362), LCD, 10)
        txt(d, (x, 324), "0:01", 45, MINT, "mono", "mm")
    txt(d, (x, 416), name, 46, INK, anchor="mm")
    txt(d, (x, 475), detail, 29, INK, "regular", "mm", width=350)


def boundary(d, action, c):
    if action == "coupling" and c.seconds < c.cues[1]:
        module(d, 286, "Anzeige", "Bild zeichnen", PAPER, "display")
        module(d, 995, "Zähler", "Restzeit verringern", CORAL, "measure")
        arrow(d, 488, 380, 787, CORAL, c.move(0, 0.85))
        txt(d, (640, 328), "Bildwechsel", 35, CORAL, anchor="mm")
        txt(d, (640, 575), "Ohne Bildwechsel bleibt der Zähler stehen.", 37, WHITE, anchor="mm")
        return
    module(d, 286, "Zeitrechnung", "Restzeit bestimmen", MINT, "measure")
    module(d, 995, "Anzeige", "Restzeit darstellen", PAPER, "display")
    p = c.move(1, 0.85) if action == "coupling" else c.move(0, 0.9)
    arrow(d, 488, 380, 787, MINT, p)
    if p > 0.8:
        txt(d, (640, 338), "1 Sekunde", 38, WHITE, anchor="mm")
    if action == "responsibility":
        if c.seconds >= c.cues[2]:
            txt(d, (640, 575), "Kohäsion · innerer Zusammenhalt", 39, MINT, anchor="mm")
    elif c.seconds >= c.cues[2]:
        txt(d, (640, 575), "Kopplung · Was muss ein Teil wissen?", 39, MINT, anchor="mm")


def change(d, c):
    instrument(d, 320, 370, 430, 2)
    arrow(d, 555, 371, 718, INK, c.move(0, 0.9))
    instrument(d, 955, 370, 430, 2, ring=True)
    txt(d, (320, 516), "Ziffern", 39, anchor="mm")
    txt(d, (955, 516), "Ring", 39, anchor="mm")
    if c.seconds >= c.cues[1]:
        txt(d, (640, 581), "Pausenregel → Zeitrechnung", 40, INK, anchor="mm")


def tradeoff(d, c):
    for x, head, foot in (
        (334, "Eine Animation", "Bildwechsel zählen"),
        (947, "Ein Timer", "Zeit unabhängig messen"),
    ):
        if x == 334:
            for i in range(3):
                xx = x - 89 + 17 * i
                yy = 302 - 14 * i
                box(d, (xx, yy, xx + 148, yy + 96), PAPER, 12, INK, 3)
            d.polygon([(x + 3, 286), (x + 3, 338), (x + 43, 313)], fill=INK)
        else:
            dial(d, x, 326, 63, 1, CORAL)
        txt(d, (x, 429), head, 51, anchor="mm")
        txt(d, (x, 502), foot, 33, INK, "regular", "mm")
    d.line((640, 260, 640, 526), fill=EDGE, width=2)
    if c.seconds >= c.cues[2]:
        txt(d, (640, 585), "Welche Zusage muss der Aufbau tragen?", 39, INK, anchor="mm")


def weather(d, action, c):
    x = 210
    box(d, (x - 17, 259, x + 17, 447), WHITE, 16, INK, 4)
    disc(d, x, 453, 35, CORAL, INK, 4)
    box(d, (x - 8, 319, x + 8, 456), CORAL, 7)
    for i in range(7):
        y = 270 + i * 23
        d.line((x + 25, y, x + 41 + (i % 2) * 9, y), fill=INK, width=3)
    txt(d, (342, 362), "20 °C", 58, INK, "mono", "mm")
    txt(d, (260, 528), "Sensor", 38, anchor="mm")
    arrow(d, 479, 368, 708, INK)
    panel(d, (744, 273, 1159, 475), MINT)
    switched = action == "answer" and c.seconds >= c.cues[0] + 1.1
    value = "68 °F" if switched else "? °F"
    txt(d, (951, 367), value, 82, INK, "mono", "mm")
    txt(d, (951, 528), "Anzeige", 38, anchor="mm")
    if switched:
        txt(d, (640, 584), "20 × 9/5 + 32 = 68", 38, INK, "mono", "mm")


def finish(d, c):
    for i, (h, b) in enumerate(
        (
            ("Verhalten", "Was verspreche ich?"),
            ("Verantwortung", "Wer entscheidet?"),
            ("Schnittstelle", "Was muss über die Grenze?"),
        )
    ):
        y = 249 + i * 115
        d.line((86, 249, 86, y), fill=MINT, width=3)
        disc(d, 86, y, 10, MINT, INK)
        txt(d, (121, y), h, 40, MINT)
        if c.seconds >= c.cues[0] + (3.1, 5.3, 7.2)[i]:
            txt(d, (556, y), b, 42, WHITE)
    if c.seconds >= c.cues[1]:
        d.line((60, 543, 1220, 543), fill=EDGE, width=2)
        txt(d, (60, 583), "Als Nächstes", 30, MINT, "regular")
        txt(d, (323, 583), "Was verspricht eine Schnittstelle?", 42, WHITE)


SHOTS = {
    "opening": ("Was ist Softwaredesign?", "Softwaredesign · Folge 1"),
    "design": ("Hinter der Anzeige", "Der Entwurf"),
    "promise": ("Zuerst das Verhalten", "Die Zusage"),
    "ticks": ("A  /  Die Anzeige zählt", "Zwei Entwürfe"),
    "deadline": ("B  /  Die Uhr misst", "Zwei Entwürfe"),
    "think": ("Zwei Sekunden ohne Bild", "Gedankenexperiment"),
    "reveal": ("Ein Unterschied wird sichtbar", "Gedankenexperiment"),
    "responsibility": ("Wer entscheidet was?", "Verantwortung"),
    "coupling": ("Was muss über die Grenze?", "Abhängigkeiten"),
    "change": ("Zwei verschiedene Änderungen", "Änderbarkeit"),
    "cost": ("Wann lohnt sich die Trennung?", "Abwägen"),
    "transfer": ("Ein anderer Fall", "Transfer"),
    "answer": ("Ein Messwert, zwei Einheiten", "Transfer"),
    "finish": ("Drei Fragen für deinen Entwurf", "Softwaredesign · Folge 1"),
}


def frame(key, action, clock):
    dark = action in ("think", "reveal", "responsibility", "coupling", "finish")
    image = paper(dark).copy()
    d = ImageDraw.Draw(image)
    title, chapter = SHOTS[action]
    mast(d, dark, chapter)
    heading(d, title, dark)
    if action in ("opening", "think", "reveal"):
        pair(d, action, clock)
    elif action == "design":
        design(d, clock)
    elif action in ("promise", "ticks", "deadline"):
        timing(d, action, clock)
    elif action in ("responsibility", "coupling"):
        boundary(d, action, clock)
    elif action == "change":
        change(d, clock)
    elif action == "cost":
        tradeoff(d, clock)
    elif action in ("transfer", "answer"):
        weather(d, action, clock)
    elif action == "finish":
        finish(d, clock)
    return image


def poster(film):
    image = paper(True).copy()
    d = ImageDraw.Draw(image)
    mast(d, True, "Grundlagen · Folge 1")
    txt(d, (64, 248), "Was ist", 94, WHITE)
    txt(d, (57, 348), "Softwaredesign?", 89, MINT, width=687)
    txt(d, (66, 475), "Vom Verhalten zur Struktur", 43, WHITE, "regular", width=683)
    # Explosionszeichnung: Anzeige und Zeitbasis auf zwei verbundenen Ebenen.
    box(d, (858, 388, 1202, 536), "#245944", 25, EDGE, 3)
    dial(d, 1030, 466, 58, 2, CORAL, False)
    for x in (876, 1164):
        d.line((x, 327, x + 13, 408), fill=MINT, width=4)
    instrument(d, 995, 299, 414, 3)
    return image
