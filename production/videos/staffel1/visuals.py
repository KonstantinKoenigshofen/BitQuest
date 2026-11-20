"""Gemeinsame Zeichenfunktionen für die Animationen der ersten Staffel."""

from functools import lru_cache
from math import cos, sin, tau

from PIL import Image, ImageDraw

from animation import WIDTH, HEIGHT, card, ease, font, icon, position, route, text

INK = "#152821"
WHITE = "#f8fffb"
MINT = "#acebc9"
RED = "#ffaf9d"
AMBER = "#ffe0a1"
BLUE = "#bbdef4"
LILAC = "#e5d4ff"

THEMES = {
    "library": ("#142f28", "#22644d", "#99e6bc"),
    "locker": ("#192c40", "#335982", "#b5dbf6"),
    "weather": ("#203530", "#3e6268", "#b6eddf"),
    "shipping": ("#282337", "#535078", "#dbcbff"),
    "register": ("#302923", "#62513a", "#ffe1a3"),
}


@lru_cache
def backdrop(key):
    dark, light, accent = THEMES[key]
    a, b = bytes.fromhex(dark[1:]), bytes.fromhex(light[1:])
    gradient = Image.new("RGB", (128, 72))
    gradient.putdata([
        tuple(round(left + (right - left) * max(0, 1 - (((x - 101) / 112) ** 2 +
                    ((y - 37) / 54) ** 2) ** .5)) for left, right in zip(a, b))
        for y in range(72) for x in range(128)
    ])
    image = gradient.resize((WIDTH, HEIGHT), Image.Resampling.BILINEAR)
    draw = ImageDraw.Draw(image)
    for y in range(185, 613, 29):
        for x in range(18, WIDTH, 29):
            draw.point((x, y), fill="#678076" if key in ("library", "weather") else "#757885")
    draw.line((64, 92, 1216, 92), fill=accent, width=1)
    return image


def label(d, x, y, value, size=34, color=INK, anchor="mm"):
    text(d, x, y, value, size, color, True, anchor)


def fit(d, x, y, value, size, width, color=INK):
    length = font(size, True).getlength(value)
    if length > width:
        size = int(size * width / length)
    label(d, x, y, value, size, color)


def pill(d, x, y, value, fill=MINT, size=33, ink=INK):
    width = font(size, True).getlength(value) + 38
    card(d, (x - width / 2, y - 25, x + width / 2, y + 25), fill, radius=24)
    label(d, x, y - 1, value, size, ink)


def sheet(d, box, fill=WHITE, edge=None, radius=24):
    x, y, x2, y2 = box
    card(d, (x + 6, y + 9, x2 + 6, y2 + 9), "#111d1e", radius=radius)
    card(d, box, fill, edge, radius)


def top(d, key, name):
    accent = THEMES[key][2]
    for row in range(2):
        for col in range(2):
            x, y = 65 + 17 * col, 44 + 17 * row
            card(d, (x, y, x + 12, y + 12), accent if row == col else WHITE, radius=3)
    label(d, 111, 58, "BitQuest Videos", 26, accent, "lm")
    label(d, 1214, 58, name, 26, WHITE, "rm")


def title(d, value):
    label(d, 63, 139, value, 55, WHITE, "lm")


def line(d, points, color=MINT, width=4):
    d.line(points, fill=color, width=width, joint="curve")


def wire(d, points, color=MINT):
    route(d, points, color)


def dot(d, x, y, radius, fill):
    d.ellipse((x - radius, y - radius, x + radius, y + radius), fill=fill)


def traveler(d, points, progress, motif, fill=MINT, show_end=False):
    if 0 < progress < 1 or show_end:
        x, y = position(points, progress)
        card(d, (x - 27, y - 25, x + 27, y + 25), fill, radius=10)
        icon(d, motif, x - 19, y - 19, 38, INK)


def envelope(d, x, y, color=INK, size=58):
    icon(d, "mail", x - size / 2, y - size / 2, size, color)


def spark(d, x, y, fraction, color):
    for index in range(8):
        angle = index * tau / 8
        inner = 12 + 23 * fraction
        outer = inner + (1 - fraction) * 21
        line(d, [(x + cos(angle) * inner, y + sin(angle) * inner),
                 (x + cos(angle) * outer, y + sin(angle) * outer)], color, 4)


def phone(d, box, status, detail, accent, motif="mail"):
    x, y, x2, y2 = box
    cx = (x + x2) / 2
    sheet(d, box, "#121e24", accent, 27)
    card(d, (x + 12, y + 13, x2 - 12, y2 - 13), "#f3f9f7", radius=20)
    card(d, (cx - 34, y + 20, cx + 34, y + 28), "#293c42", radius=5)
    dot(d, cx, y + 83, 34, accent)
    if motif == "rain":
        cloud(d, cx, y + 80, INK, .48)
    elif motif == "box":
        parcel(d, cx, y + 83, .45, INK)
    else:
        envelope(d, cx, y + 83, size=48)
    fit(d, cx, y + 157, status, 41, x2 - x - 40)
    fit(d, cx, y + 212, detail, 34, x2 - x - 40)
    card(d, (cx - 28, y2 - 25, cx + 28, y2 - 19), "#293c42", radius=4)


def cloud(d, x, y, fill, scale=1):
    def disk(dx, dy, radius):
        dot(d, x + dx * scale, y + dy * scale, radius * scale, fill)
    disk(-36, 1, 25)
    disk(-4, -17, 34)
    disk(32, 0, 27)
    card(d, (x - 54 * scale, y, x + 54 * scale, y + 25 * scale), fill, radius=round(14 * scale))


def parcel(d, x, y, scale, color):
    def path(points):
        line(d, [(x + a * scale, y + b * scale) for a, b in points], color, max(2, round(5 * scale)))
    path([(-38, -23), (0, -41), (38, -23), (38, 19), (0, 39), (-38, 19), (-38, -23),
          (0, -4), (38, -23)])
    path([(0, -4), (0, 39)])
    path([(-18, -32), (20, -13), (20, 1)])


def question(d, prompt, seconds, start, end):
    sheet(d, (110, 530, 1170, 612), AMBER, radius=22)
    fit(d, 640, 563, prompt, 41, 1000)
    if seconds >= start:
        progress = ease(seconds, max(.1, end - start), start)
        card(d, (150, 593, 1130, 598), "#ccb37c", radius=3)
        card(d, (150, 593, 152 + 978 * progress, 598), INK, radius=3)


def bicycle(d, x, y, color, scale=1):
    def p(dx, dy):
        return x + scale * dx, y + scale * dy
    for dx in (-56, 57):
        cx, cy = p(dx, 14)
        r = 27 * scale
        d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=color, width=max(2, round(5 * scale)))
    line(d, [p(-56, 14), p(-27, -28), p(12, 14), p(-56, 14), p(-27, -28),
             p(34, -28), p(12, 14)], color, max(2, round(5 * scale)))
    line(d, [p(57, 14), p(24, -46), p(42, -54)], color, max(2, round(5 * scale)))
    line(d, [p(-39, -30), p(-15, -30)], color, max(2, round(5 * scale)))
