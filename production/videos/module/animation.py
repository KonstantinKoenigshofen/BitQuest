"""Bildsprache und Szenen für „Warum Software in Module aufteilen?“."""

import os
from functools import lru_cache
from math import hypot
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

WIDTH, HEIGHT = 1280, 720
FPS = 24
INK = "#152821"
MUTED = "#4b6259"
PAPER = "#ecf8f1"
BRIGHT = "#f4fff9"
MINT = "#a2e9c4"
MID = "#70d8ab"
PANE = "#20483b"
LINE = "#588776"
AMBER = "#ffdf9d"
AMBER_INK = "#633b19"
WINDIR = Path(os.environ.get("WINDIR", r"C:\Windows"))


@lru_cache
def font(size, bold):
    name = "segoeuib.ttf" if bold else "segoeui.ttf"
    return ImageFont.truetype(str(WINDIR / "Fonts" / name), size)


@lru_cache
def background():
    gradient = Image.new("RGB", (80, 45))
    start, end = (19, 47, 40), (29, 81, 63)
    gradient.putdata([
        tuple(round(a + (b - a) * max(0, 1 - hypot((x - 76) / 77, (y - 36) / 43)))
              for a, b in zip(start, end))
        for y in range(45)
        for x in range(80)
    ])
    bg = gradient.resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)
    draw = ImageDraw.Draw(bg)
    for y in range(176, 618, 25):
        for x in range(12, WIDTH, 25):
            draw.ellipse((x, y, x + 1, y + 1), fill="#527264")
    return bg


def text(d, x, y, content, size=39, fill=BRIGHT, bold=False, anchor="lm"):
    d.text((x, y), content, font=font(size, bold), fill=fill, anchor=anchor)


def card(d, box, fill=PAPER, edge=None, radius=22):
    d.rounded_rectangle(box, radius=radius, fill=fill, outline=edge, width=3)


def brand(d):
    card(d, (78, 38, 124, 84), "#235745", radius=11)
    for x, y, color in [(88, 48, MINT), (103, 48, MID), (88, 63, MID), (103, 63, MINT)]:
        card(d, (x, y, x + 10, y + 10), color, radius=2)
    text(d, 138, 61, "BitQuest Videos", 31, MINT, True)
    d.line((78, 100, 1202, 100), fill=LINE, width=1)


def heading(d, title, size=62):
    text(d, 78, 143, title, size, BRIGHT, True)


def icon(d, style, x, y, size, color):
    def box(rect):
        return tuple(round(offset + size * rel) for offset, rel in zip((x, y, x, y), rect))

    def stroke(points):
        pixels = [(round(x + size * dx), round(y + size * dy)) for dx, dy in points]
        d.line(pixels, fill=color, width=max(3, round(size / 12)), joint="curve")

    if style == "book":
        d.rounded_rectangle(box((.11, .07, .89, .92)), radius=round(size * .12),
                            outline=color, width=max(3, round(size / 13)))
        stroke([(.29, .1), (.29, .88)])
        stroke([(.44, .36), (.72, .36)])
        stroke([(.44, .54), (.65, .54)])
    elif style == "mail":
        d.rounded_rectangle(box((.07, .19, .93, .82)), radius=round(size * .11),
                            outline=color, width=max(3, round(size / 13)))
        stroke([(.12, .28), (.50, .56), (.88, .28)])
    elif style == "screen":
        d.rounded_rectangle(box((.07, .10, .93, .70)), radius=round(size * .10),
                            outline=color, width=max(3, round(size / 13)))
        stroke([(.50, .72), (.50, .90)])
        stroke([(.31, .90), (.69, .90)])
    elif style == "clock":
        d.ellipse(box((.10, .10, .90, .90)), outline=color, width=max(3, round(size / 13)))
        stroke([(.50, .25), (.50, .51), (.65, .61)])
    else:
        stroke([(.13, .50), (.40, .76), (.87, .24)])


def loan(d, x, y, days, width=435):
    card(d, (x, y, x + width, y + 103), PAPER, MID)
    card(d, (x + 20, y + 19, x + 83, y + 84), "#c9ebda", radius=15)
    icon(d, "book", x + 29, y + 28, 45, "#17664e")
    text(d, x + 101, y + 29, "Ausleihe 24", 30, MUTED, True)
    text(d, x + 101, y + 71, f"{days} Tage überfällig", 40, INK, True)


def response(d, x, y, width, title, status, style, warning=False):
    fill, ink = (AMBER, AMBER_INK) if warning else (PAPER, INK)
    card(d, (x, y, x + width, y + 146), fill)
    icon(d, style, x + 23, y + 22, 53, ink)
    text(d, x + 92, y + 46, title, 42, ink, True)
    text(d, x + 23, y + 109, status, 40, ink, True)


def route(d, points, color=LINE):
    d.line(points, fill=color, width=5, joint="curve")
    x, y = points[-1]
    before_x, before_y = points[-2]
    length = hypot(x - before_x, y - before_y)
    ux, uy = (x - before_x) / length, (y - before_y) / length
    d.polygon([(x, y), (x - 13 * ux + 8 * uy, y - 13 * uy - 8 * ux),
               (x - 13 * ux - 8 * uy, y - 13 * uy + 8 * ux)], fill=color)


def ease(seconds, duration, delay=0):
    ratio = min(1, max(0, (seconds - delay) / duration))
    return ratio * ratio * (3 - 2 * ratio)


def position(points, ratio):
    segments = list(zip(points, points[1:]))
    lengths = [hypot(x1 - x0, y1 - y0) for (x0, y0), (x1, y1) in segments]
    covered = sum(lengths) * ratio
    for ((x0, y0), (x1, y1)), length in zip(segments, lengths):
        if covered <= length:
            return round(x0 + (x1 - x0) * covered / length), round(y0 + (y1 - y0) * covered / length)
        covered -= length
    return points[-1]


def packet(d, points, ratio, style="book", fill=MINT):
    if 0 < ratio < 1:
        x, y = position(points, ratio)
        card(d, (x - 28, y - 28, x + 28, y + 28), fill, radius=13)
        icon(d, style, x - 20, y - 20, 40, INK)


def conflict(d, step, elapsed):
    heading(d, "Wie kann beides gleichzeitig passieren?" if step == 4 else "Ein Buch, zwei Antworten",
            55 if step == 4 else 62)
    loan(d, 422, 201, 8)
    if step >= 1:
        text(d, 640, 343, "Neue Bibliotheksregel: Mahnung ab 10 Tagen", 44, MINT, True, "mm")
    if step != 0 or elapsed >= .18:
        y = 402 if step != 0 else round(422 - 20 * ease(elapsed, .42, .18))
        response(d, 78, y, 544, "Bildschirm", "Noch keine Mahnung", "screen")
        response(d, 658, y, 544, "Posteingang", "Neue Mahnmail", "mail", True)


def split(d, step, elapsed):
    heading(d, "Dieselbe Ausleihe, zwei Wege")
    loan(d, 423, 184, 8)
    for index, (x, title, style) in enumerate([
        (78, "Bildschirmanzeige", "screen"), (658, "Mahnlauf nachts", "clock")
    ]):
        first = index == 0
        center = x + 272
        active = step >= (1 if first else 3)
        outcome = step > (2 if first else 4) or step == (2 if first else 4) and elapsed >= .95
        path = [(640, 287), (640, 322), (center, 322), (center, 356)]
        accent = MINT if first else AMBER
        route(d, path, accent if active else LINE)
        if step == (1 if first else 3):
            packet(d, path, ease(elapsed, 1.60), fill=accent)
        card(d, (x, 356, x + 544, 565), PAPER if active else PANE)
        ink = INK if active else BRIGHT
        icon(d, style, x + 20, 375, 49, ink)
        text(d, x + 85, 401, title, 44, ink, True)
        if active:
            if step == 1:
                rule = "7 Tage → 10 Tage" if first else ""
            elif first:
                rule = "8 < 10 Tage"
            elif step == 3:
                rule = "Ab 7 Tagen"
            else:
                rule = "8 ≥ 7 Tage"
            text(d, x + 22, 466, rule, 53, ink, True)
        if outcome:
            card(d, (x + 19, 506, x + 525, 551), "#cfebdc" if first else AMBER, radius=11)
            text(d, x + 33, 527, "Noch keine Mahnung" if first else "Mahnmail wird ausgelöst",
                 36, INK if first else AMBER_INK, True)


def merge(d, step, elapsed):
    heading(d, "Eine gemeinsame Frist")
    if step == 0:
        y = 306
        progress = ease(elapsed, 1.4, .45)
        card(d, (401, 235, 879, 385), PANE, LINE)
        text(d, 640, 264, "Mahnmodul", 43, BRIGHT, True, "mm")
        if progress < .98:
            if progress < .68:
                center = round(1000 - 360 * progress)
                card(d, (center - 91, y - 27, center + 91, y + 36), AMBER, radius=14)
                text(d, center, y + 3, "7 Tage", 38, INK, True, "mm")
            center = round(280 + 360 * progress)
            card(d, (center - 91, y - 27, center + 91, y + 36), MINT, radius=14)
            text(d, center, y + 3, "10 Tage", 38, INK, True, "mm")
            text(d, 245, 432, "Bildschirmanzeige", 37, BRIGHT, True, "mm")
            text(d, 1030, 432, "Nächtlicher Mahnlauf", 37, BRIGHT, True, "mm")
        else:
            text(d, 640, 329, "Ab 10 Tagen", 58, MINT, True, "mm")
        return
    loan(d, 422, 183, 8)
    down = [(640, 286), (640, 309)]
    route(d, down, MINT)
    card(d, (407, 309, 873, 420), PAPER, MID)
    text(d, 640, 337, "Mahnmodul", 39, INK, True, "mm")
    text(d, 640, 387, "Ab 10 Tagen", 53, INK, True, "mm")
    for x, title in [(78, "Bildschirmanzeige"), (658, "Nächtlicher Mahnlauf")]:
        center = x + 272
        path = [(640, 420), (640, 451), (center, 451), (center, 481)]
        route(d, path, MINT if step == 2 else LINE)
        if step == 2:
            packet(d, path, ease(elapsed, 1.23), "check")
        card(d, (x, 481, x + 544, 574), PANE, LINE)
        text(d, x + 22, 506, title, 34, BRIGHT, True)
        if step == 2 and elapsed >= .8:
            text(d, x + 22, 547, "Noch keine Mahnung", 40, MINT, True)


def shipping(d, step, elapsed, new_provider=False):
    heading(d, "Der Versand wechselt" if new_provider else "Was passiert bei 12 Tagen?")
    loan(d, 78, 195, 12, width=454)
    upper = [(532, 247), (594, 247)]
    rule_active = new_provider or step >= 1
    route(d, upper, MINT if rule_active else LINE)
    if step == 1 and not new_provider:
        packet(d, upper, ease(elapsed, .8))
    card(d, (594, 185, 1202, 308), PAPER if rule_active else PANE, MID if rule_active else LINE)
    text(d, 618, 220, "Mahnmodul", 42, INK if rule_active else BRIGHT, True)
    if rule_active:
        text(d, 618, 278, "12 ≥ 10 · Mahnung fällig", 48, INK, True)
    if step < 2 and not new_provider:
        return
    down = [(876, 308), (876, 350), (237, 350), (237, 403)]
    route(d, down, MINT)
    if step == 2 and not new_provider:
        packet(d, down, ease(elapsed, 1.65), "mail")
    x_boxes = (78, 476, 874)
    dispatched = step == 3 and elapsed >= 1.7
    for index, (x, title, status, style) in enumerate(zip(x_boxes,
            ("Versandauftrag", "Versandmodul", "Mahnmail"),
            ("Empfängerin + Text", "Neuer Anbieter" if new_provider else "Mailanbieter", "Zugestellt"),
            ("mail", "mail", "check"))):
        highlighted = index == 1 and (step >= 3 or new_provider)
        d_fill = AMBER if new_provider and index == 1 else PAPER if highlighted or index == 2 and dispatched else PANE
        ink = INK if d_fill != PANE else BRIGHT
        card(d, (x, 403, x + 328, 557), d_fill, AMBER if highlighted else LINE)
        icon(d, style, x + 18, 426, 43, ink)
        text(d, x + 77, 448, title, 32, ink, True)
        if index != 2 or dispatched:
            text(d, x + 19, 514, status, 34, ink)
    left = [(406, 479), (476, 479)]
    right = [(804, 479), (874, 479)]
    route(d, left, MINT)
    route(d, right, MINT if step >= 3 else LINE)
    if step == 3:
        packet(d, left, ease(elapsed, .72), "mail")
        packet(d, right, ease(elapsed, .78, .92), "mail", AMBER if new_provider else MINT)


def define(d, step, _elapsed):
    heading(d, "Was ist ein Modul?")
    text(d, 78, 224, "Ein Teil des Programms mit einer klaren Aufgabe.", 46, BRIGHT, True)
    for index, (x, title, top, bottom, style) in enumerate([
        (78, "Mahnmodul", "Entscheidet,", "wann gemahnt wird", "clock"),
        (658, "Versandmodul", "Liefert die Mahnmail", "", "mail"),
    ]):
        active = step >= (1 if index == 0 else 2)
        ink = INK if active else BRIGHT
        card(d, (x, 290, x + 544, 508), PAPER if active else PANE, MID if active else LINE)
        text(d, x + 91, 343, title, 49, ink, True)
        icon(d, style, x + 24, 314, 52, ink)
        if active:
            text(d, x + 25, 420, top, 42, ink, True)
            if bottom:
                text(d, x + 25, 471, bottom, 42, ink, True)
    if step >= 3:
        note = "Neue Frist? Im Mahnmodul ändern." if step == 3 else "Anzeige und Mahnlauf fragen dieselbe Stelle."
        text(d, 640, 561, note, 40, MINT, True, "mm")


def question(d, step, elapsed, speech_duration, total):
    heading(d, "Morgen wechselt der Mailanbieter", 56)
    if step == 0:
        icon(d, "mail", 553, 258, 174, MINT)
        return
    text(d, 640, 251, "Welcher Teil muss sich ändern?", 56, BRIGHT, True, "mm")
    for x, label, style in [(78, "Mahnmodul", "clock"), (658, "Versandmodul", "mail")]:
        card(d, (x, 327, x + 544, 462), PANE, MID)
        icon(d, style, x + 30, 366, 59, MINT)
        text(d, x + 120, 393, label, 53, BRIGHT, True)
    think_bar(d, elapsed, speech_duration, total)


def think_bar(d, elapsed, speech_duration, total):
    if elapsed > speech_duration:
        card(d, (455, 536, 825, 543), LINE, radius=3)
        progress = min(1, (elapsed - speech_duration) / (total - speech_duration))
        if progress > .01:
            card(d, (455, 536, round(455 + 370 * progress), 543), MINT, radius=3)


def takeaway(d, step, _elapsed):
    heading(d, "Von der Änderung zum Modul")
    text(d, 78, 237, "Welche Aufgaben ändern sich", 54, BRIGHT, True)
    text(d, 78, 303, "aus demselben Grund?", 54, BRIGHT, True)
    if step >= 1:
        for x, upper, lower in [(78, "Neue Mahnfrist", "Mahnmodul"), (658, "Neuer Mailanbieter", "Versandmodul")]:
            card(d, (x, 376, x + 544, 540), PAPER)
            text(d, x + 23, 422, upper, 41, MUTED)
            text(d, x + 23, 490, lower, 50, INK, True)
    if step >= 2:
        text(d, 640, 580, "Aufgaben mit gleichem Änderungsgrund bündeln.", 36, MINT, True, "mm")


def frame(scene, step, elapsed, speech_duration, total):
    image = background().copy()
    d = ImageDraw.Draw(image)
    brand(d)
    if scene == "conflict":
        conflict(d, step, elapsed)
    elif scene == "split":
        split(d, step, elapsed)
    elif scene == "merge":
        merge(d, step, elapsed)
    elif scene in {"send", "solution"}:
        shipping(d, step, elapsed, new_provider=scene == "solution")
    elif scene == "define":
        define(d, step, elapsed)
    elif scene == "question":
        question(d, step, elapsed, speech_duration, total)
    else:
        takeaway(d, step, elapsed)
    return image


def poster():
    image = background().copy()
    d = ImageDraw.Draw(image)
    brand(d)
    for y, line in [(216, "Warum Software"), (306, "in Module aufteilen?")]:
        text(d, 78, y, line, 77, BRIGHT, True)
    loan(d, 78, 411, 8)
    route(d, [(513, 462), (566, 462), (566, 435), (620, 435)], MID)
    route(d, [(513, 462), (566, 462), (566, 575), (620, 575)], AMBER)
    for y, fill, style, label in [(382, PAPER, "screen", "Noch keine Mahnung"),
                                  (523, AMBER, "mail", "Neue Mahnmail")]:
        card(d, (620, y, 1202, y + 103), fill)
        icon(d, style, 647, y + 22, 59, INK)
        text(d, 728, y + 50, label, 42, INK, True)
    return image
