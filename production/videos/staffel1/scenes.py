"""Zeichnet die Szenen der fünf Filme anhand ihrer gesprochenen Einsätze."""

from dataclasses import dataclass

from PIL import ImageDraw

from visuals import (
    AMBER, BLUE, INK, LILAC, MINT, RED, THEMES, WHITE,
    backdrop, bicycle, card, cloud, dot, ease, icon, label, line,
    parcel, phone, pill, position, question, sheet, spark, title, top, traveler, wire,
)


@dataclass(frozen=True)
class Clock:
    seconds: float
    cues: tuple[float, ...]
    spoken: float
    end: float

    def move(self, cue=0, duration=1.5, offset=.08):
        return ease(self.seconds, duration, self.cues[cue] + offset)

    def asks(self, draw, prompt):
        question(draw, prompt, self.seconds, self.spoken, self.end - .1)


def book(d, x, y, name, days):
    sheet(d, (x, y, x + 300, y + 143), "#d8f3e3")
    card(d, (x + 17, y + 21, x + 87, y + 122), "#20735d", radius=12)
    icon(d, "book", x + 26, y + 48, 52, WHITE)
    label(d, x + 105, y + 32, name, 29, anchor="lm")
    label(d, x + 105, y + 77, f"{days} Tage", 48, anchor="lm")
    label(d, x + 105, y + 114, "überfällig", 24, anchor="lm")


def library_desk(d, mail):
    for row in range(3):
        y = 193 + row * 102
        card(d, (64, y, 1214, y + 99), "#2b4c3f", radius=6)
        for x in range(76, 1190, 37):
            height = 45 + (x * (row + 1)) % 40
            fill = ("#3e6152", "#496451", "#50715d")[(x + row) % 3]
            card(d, (x, y + 91 - height, x + 32, y + 91), fill, radius=4)
    sheet(d, (100, 227, 752, 471), "#111f24", "#99b4a9")
    card(d, (118, 245, 734, 452), "#f3fcf7", radius=14)
    line(d, [(117, 306), (733, 306)], "#cadbd4", 3)
    label(d, 147, 277, "Stadtbibliothek  /  Buch L24", 29, anchor="lm")
    label(d, 426, 374, "Keine Mahnung fällig", 53)
    card(d, (383, 473, 468, 521), "#a1b8ad", radius=5)
    card(d, (327, 513, 524, 530), "#a1b8ad", radius=8)
    phone(d, (818, 219, 1146, 530), "Mahnmail" if mail else "Leas Handy",
          "Buch L24" if mail else "", AMBER if mail else MINT)


LIBRARY_TITLES = {
    "screen": "Am Bibliothekstresen", "mail": "Gleichzeitig bei Lea",
    "rewind": "Zurück zum selben Buch", "split": "Ein Buch auf zwei Wegen",
    "ten": "Die Anzeige prüft mit 10 Tagen", "seven": "Der Versand prüft mit 7 Tagen",
    "think": "Zwei Regeln, zwei Ergebnisse", "merge": "Ein gemeinsames Mahnmodul",
    "replay": "Derselbe Tag, noch einmal", "quiet": "Beide Wege sind sich einig",
    "twelve": "Ein Buch mit 12 Tagen Rückstand", "send": "Jetzt ist die Mahnung fällig",
    "boundary": "Die Frist am Übergang prüfen",
    "lesson": "Eine Stelle für die Mahnfrist",
}


def library(d, action, clock):
    title(d, LIBRARY_TITLES[action])
    if action in ("screen", "mail"):
        ping = clock.move(duration=.75)
        library_desk(d, action == "mail" and ping > .35)
        if action == "mail" and .35 < ping < 1:
            spark(d, 1138, 249, ping, AMBER)
        return

    if action == "rewind":
        track = [(933, 438), (346, 438)]
        wire(d, track)
        label(d, 936, 492, "Mahnmail", 31, WHITE)
        label(d, 346, 492, "Ausleihe", 31, WHITE)
        x, _ = position(track, clock.move(duration=2.0))
        book(d, x - 150, 254, "Buch L24", 8)
        return

    if action == "lesson":
        items = [(255, "Anzeige", "Status zeigen", "screen", BLUE),
                 (640, "Mahnmodul", "Frist prüfen", "book", MINT),
                 (1025, "Versand", "Mail verschicken", "mail", AMBER)]
        for x, name, job, motif, fill in items:
            sheet(d, (x - 172, 253, x + 172, 519), fill)
            icon(d, motif, x - 42, 277, 84, INK)
            label(d, x, 406, name, 45)
            label(d, x, 471, job, 31)
        return

    if action == "boundary":
        for x, days, result, fill, cue in (
            (344, "9 Tage", "Nicht fällig", BLUE, 1),
            (936, "10 Tage", "Fällig", MINT, 2),
        ):
            sheet(d, (x - 251, 264, x + 251, 520), fill)
            label(d, x, 338, days, 70)
            shown = clock.move(cue, .6) > .45
            label(d, x, 439, result if shown else "…", 52)
        return

    shared = action in ("merge", "replay", "quiet", "twelve", "send")
    due = action in ("twelve", "send")
    book(d, 63, 299, "Buch L31" if due else "Buch L24", 12 if due else 8)
    rise = clock.move(duration=2.6, offset=.4) if action == "merge" else clock.move(duration=1.7)
    joined = shared and (action != "merge" or rise > .8)
    branch = 812 if joined else 407
    paths = [[(786 if joined else 362, 367), (branch, 367), (branch, y), (838, y)]
             for y in (275, 467)]
    for path, fill in zip(paths, (BLUE, AMBER)):
        wire(d, path, MINT if shared else fill)
    if shared:
        join = rise if action == "merge" else 1
        if join < 1:
            pill(d, 630, 275 + 95 * join, "10 Tage", BLUE, 37)
            pill(d, 630, 467 - 97 * join, "7 Tage", AMBER, 37)
        if joined:
            wire(d, [(362, 367), (473, 367)], MINT)
            sheet(d, (474, 293, 789, 440), MINT)
            label(d, 631, 331, "Mahnmodul", 39)
            label(d, 631, 393, "≥ 10 Tage", 54)
    else:
        for y, show, days, fill in (
            (275, action in ("ten", "seven", "think"), 10, BLUE),
            (467, action in ("seven", "think"), 7, AMBER),
        ):
            pill(d, 630, y, f"≥ {days} Tage" if show else "Frist?", fill, 38)

    show_top = action != "split"
    show_bottom = action in ("seven", "think", "replay", "quiet", "send")
    for y, name, result, fill, motif in (
        (275, "Anzeige", ("Fällig" if due else "Nicht fällig") if show_top else "…", BLUE, "screen"),
        (467, "Versand", ("Mailauftrag" if not shared or due else "Kein Auftrag") if show_bottom else "…", AMBER, "mail"),
    ):
        sheet(d, (839, y - 68, 1206, y + 68), fill)
        icon(d, motif, 858, y - 51, 53, INK)
        label(d, 929, y - 35, name, 31, anchor="lm")
        label(d, 864, y + 24, result, 48, anchor="lm")
    if action in ("split", "ten", "seven", "replay", "twelve"):
        indices = (0, 1) if action in ("split", "replay", "twelve") else (int(action == "seven"),)
        if joined:
            traveler(d, [(362, 367), (473, 367)], min(1, rise * 2), "book")
            rise = max(0, 2 * rise - 1)
        for index in indices:
            traveler(d, paths[index], rise, "book", BLUE if index == 0 else MINT)
    if action == "send":
        traveler(d, [(786, 371), (816, 371), (816, 467), (844, 467)], rise, "mail", AMBER)
        if .65 < rise < 1:
            spark(d, 1183, 444, rise, WHITE)
    if action == "think":
        clock.asks(d, "Wo würdest du die Frist ablegen?")


LOCKER_TITLES = {
    "start": "Ein Fach reservieren", "request": "Auftrag A1 ist unterwegs",
    "booked": "Fach 01 ist reserviert", "lost": "Eine Antwort auf dem Rückweg",
    "freeze": "Standbild nach der Zeitüberschreitung", "same": "Versuch 1 · Derselbe Schlüssel",
    "same_result": "A1 liefert wieder #101", "reset": "Zurück zum selben Standbild",
    "new": "Versuch 2 · Neuer Schlüssel", "new_result": "B2 erzeugt #102",
    "compare": "Derselbe Start, andere Schlüssel", "lesson": "Idempotenz bei Wiederholungen",
    "memory": "Was der Automat speichert",
}


def locker_doors(d, number):
    sheet(d, (848, 209, 1206, 513), "#d6eafa", "#adc9e3")
    label(d, 1027, 243, "Paketautomat", 32)
    for index in range(4):
        x, y = 874 + 158 * (index % 2), 270 + 103 * (index // 2)
        occupied = index < number
        card(d, (x, y, x + 145, y + 89), "#263d56" if occupied else "#f4faff", "#92adc5", 11)
        label(d, x + 21, y + 22, f"{index + 1:02}", 25, BLUE if occupied else INK, "lm")
        label(d, x + 14, y + 60, f"#{index + 101}" if occupied else "Frei",
              33, WHITE if occupied else INK, "lm")
        dot(d, x + 123, y + 24, 6, AMBER if occupied else "#60988b")


def locker(d, action, clock):
    title(d, LOCKER_TITLES[action])
    if action == "memory":
        sheet(d, (220, 226, 1060, 536), "#daecf8")
        label(d, 434, 281, "Auftragsschlüssel", 35)
        label(d, 845, 281, "Reservierung", 35)
        for y, key, number, fill in ((370, "A1", "#101", MINT), (462, "B2", "#102", BLUE)):
            card(d, (270, y - 38, 1010, y + 38), fill, radius=14)
            label(d, 434, y, key, 51)
            label(d, 640, y, "→", 49)
            label(d, 845, y, number, 51)
        return
    if action in ("compare", "lesson"):
        for x, code, total, result, fill in (
            (349, "A1 → A1", "1 Fach", "#101", MINT),
            (927, "A1 → B2", "2 Fächer", "#101 + #102", BLUE),
        ):
            sheet(d, (x - 247, 247, x + 247, 526), fill)
            label(d, x, 299, code, 43)
            label(d, x, 383, total, 68)
            label(d, x, 474, result, 46)
        return

    forward = [(369, 318), (838, 318)]
    backward = [(838, 446), (369, 446)]
    wire(d, forward, BLUE)
    wire(d, backward, "#9fb5c5")
    label(d, 605, 280, "Auftrag", 29, WHITE)
    label(d, 605, 490, "Bestätigung", 29, WHITE)
    p = clock.move(duration=1.7)
    status, detail, count = "Reservieren", "", 0
    if action == "request":
        status, detail = "Gesendet", "Schlüssel A1"
        pill(d, 388 + 429 * p, 318, "A1", BLUE, 40)
    elif action in ("booked", "lost"):
        status, detail, count = "Warte …", "Schlüssel A1", 1
        if action == "booked":
            advance = .05 + .31 * clock.move(1, 1.35)
            traveler(d, backward, advance, "mail", MINT, True)
        else:
            # Die Antwort übernimmt hier ihre Position aus dem vorherigen Einsatz.
            advance = .36 + .14 * clock.move(duration=.55, offset=0)
            if clock.seconds < .55:
                traveler(d, backward, advance, "mail", MINT, True)
            elif clock.seconds < 1.22:
                spark(d, 603, 446, (clock.seconds - .55) / .67, RED)
            else:
                label(d, 603, 441, "×", 60, RED)
    elif action in ("freeze", "reset"):
        status, detail, count = "Keine Antwort", "Erneut senden?", 1
        label(d, 604, 440, "×", 61, RED)
    elif action != "start":
        new = action in ("new", "new_result")
        received = action in ("same_result", "new_result")
        confirmation = clock.move(duration=1.3)
        status = "Reserviert" if received and confirmation > .92 else "Erneut gesendet"
        detail = ("#102" if new else "#101") if status == "Reserviert" else ("Schlüssel B2" if new else "Schlüssel A1")
        count = 2 if action == "new_result" else 1
        if received:
            traveler(d, backward, confirmation, "mail", MINT)
        else:
            pill(d, 388 + 429 * p, 318, "B2" if new else "A1", AMBER if new else BLUE, 40)

    phone(d, (68, 215, 367, 514), status, detail, BLUE, "box")
    locker_doors(d, count)
    if action == "freeze":
        clock.asks(d, "Wie viele Fächer sind nach dem zweiten Tippen belegt?")
    else:
        pill(d, 1027, 566, f"Belegt: {count} / 4", AMBER if count else MINT, 37)


WEATHER_TITLES = {
    "start": "Wo bleibt die Regenwarnung?", "provider": "Eine neue Wetterquelle",
    "raw": "Der Wert wandert zur App", "wrong": "Die App vergleicht mit 60",
    "think": "Ein Wert in zwei Einheiten", "adapter": "Ein Adapter für die Wetterquelle",
    "convert": "Aus 0,65 werden 65 %", "warn": "Jetzt erscheint die Warnung",
    "swap": "Wetterquelle für den Test tauschen", "sixty": "Genau an der Schwelle",
    "test": "Warnung ab 60 % bestätigt", "lesson": "Ein Vertrag für beide Quellen",
    "border": "59 % und 60 % im Vergleich", "paths": "Zwei Prüfungen für zwei Aufgaben",
}


def mountain(d):
    d.polygon([(0, 465), (179, 244), (261, 342), (422, 200), (654, 490),
               (817, 267), (1030, 438), (1150, 326), (1280, 460), (1280, 617), (0, 617)],
              fill="#2c4747")
    d.polygon([(0, 513), (254, 408), (383, 506), (594, 453), (768, 480), (972, 404),
               (1280, 518), (1280, 617), (0, 617)], fill="#273e3e")


def weather_source(d, x, y, name, value, test=False):
    sheet(d, (x - 172, y - 113, x + 172, y + 113), BLUE if test else "#d6f3ef")
    if test:
        icon(d, "check", x - 24, y - 94, 48, "#27596b")
    else:
        cloud(d, x, y - 64, "#356377", .66)
    label(d, x, y - 13, name, 34)
    label(d, x, y + 57, value, 58)


def weather(d, action, clock):
    title(d, WEATHER_TITLES[action])
    mountain(d)
    if action in ("border", "paths"):
        rows = (("59 %", "Keine Warnung", BLUE), ("60 %", "Regenwarnung", MINT)) if action == "border" else (
            ("Adapter", "0,65 → 65 %", BLUE), ("Warnregel", "60 % → Warnung", MINT))
        for index, (input_value, result, color) in enumerate(rows):
            y = 250 + 145 * index
            sheet(d, (168, y, 1112, y + 99), color, radius=17)
            label(d, 211, y + 49, input_value, 52, anchor="lm")
            label(d, 1066, y + 49, result, 49, anchor="rm")
            if action == "border":
                label(d, 640, y + 49, "→", 47)
        return
    if action == "think":
        for x, value, unit in ((345, "0,65", "Anteil"), (935, "65 %", "Prozent")):
            sheet(d, (x - 204, 255, x + 204, 495), "#d6f3ef")
            label(d, x, 354, value, 87)
            label(d, x, 441, unit, 38)
        label(d, 640, 371, "=", 70, WHITE)
        clock.asks(d, "Wer soll die Einheit übersetzen?")
        return

    test = action in ("sixty", "test", "lesson")
    adapter = action in ("adapter", "convert", "warn")
    swapped = action == "swap"
    warning = action in ("warn", "test", "lesson")
    p = clock.move(duration=.9, offset=4.22) if action == "convert" else clock.move(duration=1.8)
    handle = clock.move(1, 1.25) if swapped else 1
    if swapped and handle < .47:
        y = 362 - handle * 131
    elif swapped:
        y = 362 + (1 - handle) * 117
    else:
        y = 362
    test_source = test or swapped and handle >= .47
    wire(d, [(386, 361), (873, 361)], AMBER if adapter or test else BLUE)
    weather_source(d, 220, y, "Testquelle" if test_source else "Wetterdienst",
                   "60 %" if test_source else "0,65", test_source)

    if adapter:
        sheet(d, (449, 243, 812, 493), MINT)
        label(d, 630, 282, "Adapter", 39)
        raw = action == "adapter" or (action == "convert" and p < .57)
        label(d, 630, 366, "0,65" if raw else "65 %", 81)
        label(d, 630, 454, "× 100", 39)
        if action == "convert" and .49 < p < .76:
            spark(d, 747, 343, (p - .49) / .27, "#268668")
    elif test or swapped:
        sheet(d, (474, 267, 807, 450), "#d9f1e9")
        label(d, 640, 320, "Wetterquelle", 40)
        label(d, 640, 389, "liefert Prozent", 34)
    elif action in ("raw", "wrong"):
        x = 455 + 342 * p if action == "raw" else 640
        pill(d, x, 361, "0,65", BLUE, 43)

    detail = "65 % ≥ 60 %" if action == "warn" else "60 % ≥ 60 %" if test else "ab 60 %"
    if action == "wrong":
        detail = "0,65 < 60"
    status = "Regenwarnung" if warning else "Wird berechnet" if action == "sixty" else "Keine Warnung"
    phone(d, (879, 207, 1210, 533), status,
          detail, AMBER if warning else BLUE, "rain")
    if warning:
        if .1 < p < .97:
            for offset in (-32, 0, 32):
                x = 1044 + offset
                y = 300 + 32 * p
                line(d, [(x, y), (x - 6, y + 12)], "#387998", 4)
        if test:
            pill(d, 1044, 580, "Test bestanden", MINT, 34)


SHIPPING_TITLES = {
    "start": "Express gewählt. Was kostet es?", "trace": "Von der Auswahl zur Regel",
    "formula": "Die Expressregel im Einzeltest", "think": "Der Preis passt nicht zur Auswahl",
    "miswire": "Express landet bei Standard", "rewire": "Express richtig verbinden",
    "price": "Express kostet 9,90 €", "contract": "Ein Vertrag für jede Strategie",
    "bike": "Ein Fahrradkurier kommt hinzu", "bike_price": "Die Preisvorschau bleibt dieselbe",
    "options": "Drei Lieferarten, derselbe Aufruf", "tests": "Die Formel und den Weg prüfen",
    "lesson": "Auswahl, Berechnung und Anzeige",
}


def shop_menu(d, selected):
    sheet(d, (62, 234, 388, 506), "#e6dcfc")
    label(d, 225, 272, "Lieferart", 36)
    for y, name in ((343, "Standard"), (427, selected)):
        active = y == 427
        card(d, (81, y - 33, 369, y + 33), "#413464" if active else WHITE, radius=13)
        label(d, 101, y, name, 39 if name != "Fahrradkurier" else 33,
              WHITE if active else INK, "lm")
        dot(d, 343, y, 9, MINT if active else "#bdacd8")


def total(d, x, y, amount):
    sheet(d, (x - 180, y - 110, x + 180, y + 110), WHITE)
    label(d, x, y - 51, "Warenkorb", 34)
    line(d, [(x - 141, y - 14), (x + 141, y - 14)], "#c9d8d0", 3)
    label(d, x, y + 48, amount, 69)


def strategy(d, x, y, name, cents, accent, active):
    sheet(d, (x, y - 47, x + 480, y + 47), accent if active else "#ece8f1", radius=17)
    label(d, x + 28, y, name, 38, anchor="lm")
    label(d, x + 451, y, cents, 40, anchor="rm")


def shipping(d, action, clock):
    title(d, SHIPPING_TITLES[action])
    if action == "options":
        rows = ((266, "Standard", "490 Cent", LILAC),
                (382, "Express", "990 Cent", MINT), (498, "Fahrradkurier", "690 Cent", BLUE))
        for y, name, amount, color in rows:
            wire(d, [(393, 382), (463, 382), (463, y), (687, y)] if y != 382 else [(393, 382), (687, 382)], color)
            strategy(d, 701, y, name, amount, color, True)
        sheet(d, (66, 301, 393, 462), WHITE)
        label(d, 231, 348, "Warenkorb", 39)
        label(d, 231, 411, "2 kg · Innenstadt", 34)
        return
    if action == "tests":
        for x, name, amount, fill, cue in (
            (344, "Expressregel direkt", "990 Cent", MINT, 1),
            (936, "Express im Shop", "490 Cent", RED, 2),
        ):
            sheet(d, (x - 251, 263, x + 251, 515), fill)
            label(d, x, 326, name, 39)
            label(d, x, 432, amount if clock.move(cue, .7) > .5 else "…", 67)
        return
    if action in ("start", "think", "price", "bike_price"):
        bike = action == "bike_price"
        shop_menu(d, "Fahrradkurier" if bike else "Express")
        result = "6,90 €" if bike else "9,90 €" if action == "price" else "4,90 €"
        total(d, 1015, 376, result)
        path = [(396, 386), (829, 386)]
        wire(d, path, LILAC)
        if action == "think":
            clock.asks(d, "Wo würdest du nachsehen?")
            label(d, 620, 326, "?", 74, AMBER)
        elif bike:
            x, y = position(path, .27 + .47 * clock.move(duration=2.4))
            bicycle(d, x, y - 36, LILAC, .7)
        else:
            traveler(d, path, clock.move(duration=1.7), "book", LILAC)
        return

    if action in ("formula", "contract", "lesson"):
        if action == "formula":
            sheet(d, (64, 249, 417, 518), LILAC)
            parcel(d, 239, 331, .72, INK)
            label(d, 240, 417, "2 kg", 64)
            label(d, 240, 479, "Innenstadt", 34)
            wire(d, [(432, 382), (679, 382)], LILAC)
            p = clock.move(1, 1.3)
            strategy(d, 700, 382, "Express", "990 Cent" if p > .37 else "…", MINT, True)
            traveler(d, [(432, 382), (679, 382)], p, "book", LILAC)
            return
        for x, head, main, accent in (
            (252, "Auswahl", "Lieferart", LILAC),
            (640, "Versandstrategie", "Betrag in Cent", MINT),
            (1028, "Warenkorb", "Preis anzeigen", BLUE),
        ):
            sheet(d, (x - 167, 290, x + 167, 490), accent)
            label(d, x, 351, head, 36)
            label(d, x, 430, main, 43)
        wire(d, [(421, 393), (468, 393)], WHITE)
        wire(d, [(810, 393), (857, 393)], WHITE)
        pill(d, 640, 232, "Eingabe  /  Versanddaten", LILAC, 33)
        return

    bike = action == "bike"
    shop_menu(d, "Fahrradkurier" if bike else "Express")
    rows = (252, 372, 492) if bike else (298, 436)
    p = clock.move(duration=3.1, offset=.65) if action == "rewire" else clock.move(duration=1.5)
    if action == "trace":
        wire(d, [(389, 427), (510, 427), (510, 369), (689, 369)], LILAC)
        sheet(d, (710, 288, 1190, 452), LILAC)
        label(d, 950, 335, "Express", 48)
        label(d, 950, 400, "2 kg · Innenstadt", 40)
        traveler(d, [(391, 427), (510, 427), (510, 369), (707, 369)], p, "book", LILAC)
        return
    if bike:
        from_x = 721 + 195 * (1 - p)
        strategy(d, from_x, rows[2], "Fahrradkurier", "690 Cent", BLUE, True)
        connection = [(389, 427), (571, 427), (571, rows[2]), (from_x - 8, rows[2])]
        wire(d, connection, BLUE)
        bicycle(d, 560, 316, BLUE, .65)
    else:
        bend_y = rows[0] + (rows[1] - rows[0]) * (p if action == "rewire" else 0)
        bend_x = 703 - 87 * 4 * p * (1 - p) if action == "rewire" else 707
        connection = [(389, 427), (539, 427), (539, bend_y), (bend_x, bend_y)]
        wire(d, connection, RED if action == "miswire" or p < .24 else MINT)
        if action == "rewire" and .06 < p < .98:
            dot(d, bend_x, bend_y, 10, MINT)
    strategy(d, 721, rows[0], "Standard", "490 Cent", RED, action == "miswire")
    strategy(d, 721, rows[1], "Express", "990 Cent", MINT, action == "rewire" and p > .92)


REGISTER_TITLES = {
    "start": "Ein Fall für zwei Kassen", "below": "Spur 1 · Knapp darunter",
    "above": "Spur 2 · Knapp darüber", "think": "Welche Spur fehlt?",
    "exact": "Bei 100,00 € trennen sich die Belege", "rules": "Ein Zeichen macht den Unterschied",
    "assert": "Aus der Spur wird ein Regressionstest", "fail": "Der neue Code fällt durch",
    "fix": "Gleicher Test, reparierte Kasse", "suite": "Drei Tests an der Rabattgrenze",
    "control": "Gegenprobe mit der alten Kasse", "cent": "Der kleinstmögliche Schritt",
    "lesson": "Diese Tests sichern den Umbau ab",
}


def cash_register(d, x, heading, cents, result, p, accent):
    y = 276
    sheet(d, (x - 225, y, x + 225, 476), accent, radius=22)
    card(d, (x - 190, y + 58, x + 190, y + 131), "#252e27", radius=12)
    label(d, x, y + 30, heading, 31)
    label(d, x, y + 94, cents, 60, MINT)
    for column in range(8):
        dx = x - 157 + column * 42
        card(d, (dx, y + 157, dx + 25, y + 175), "#b1a48e", radius=5)
    if result and p > .03:
        bottom = round(469 + 90 * p)
        card(d, (x - 160, 465, x + 160, bottom), WHITE, radius=min(6, (bottom - 465) // 2))
        if p > .75:
            label(d, x, 514, result, 39, "#823a2b" if result == "Kein Rabatt" else INK)


def register(d, action, clock):
    title(d, REGISTER_TITLES[action])
    if action == "cent":
        wire(d, [(176, 394), (1102, 394)], AMBER)
        for x, amount, fill in ((277, "99,99 €", WHITE), (640, "100,00 €", AMBER), (1003, "100,01 €", WHITE)):
            dot(d, x, 394, 13, fill)
            label(d, x, 464, amount, 52, fill)
        label(d, 455, 328, "+ 1 Cent", 35, AMBER)
        label(d, 823, 328, "+ 1 Cent", 35, AMBER)
        return
    if action in ("suite", "lesson"):
        for index, (amount, result, color) in enumerate((
            ("99,99 €", "Kein Rabatt", WHITE), ("100,00 €", "Rabatt", AMBER), ("100,01 €", "Rabatt", MINT)
        )):
            y = 235 + 110 * index
            sheet(d, (216, y, 1064, y + 83), color, radius=14)
            label(d, 266, y + 41, amount, 49, anchor="lm")
            label(d, 1007, y + 41, result, 46, anchor="rm")
        return
    if action in ("assert", "control", "fail", "fix"):
        def test_result():
            if action == "assert":
                return "Erwartet: Rabatt", AMBER
            if action == "fail":
                return "Fehler: kein Rabatt", RED
            if action == "control":
                if clock.move(1, .65) > .65:
                    return "Alte Kasse: bestanden", MINT
                return "Alte Kasse: Test läuft …", AMBER
            if clock.move(1, .85) > .7:
                return "Bestanden: Rabatt", MINT
            return "Test läuft …", AMBER
        result, color = test_result()
        sheet(d, (170, 233, 1110, 536), WHITE)
        label(d, 222, 288, "Regressionstest  /  Rabattgrenze", 39, anchor="lm")
        label(d, 640, 371, "100,00 €", 76)
        card(d, (229, 432, 1051, 507), color, radius=15)
        label(d, 640, 469, result, 46)
        return
    if action == "rules":
        for x, name, comparator, color in ((345, "Alte Kasse", "≥", MINT), (935, "Umgebaute Kasse", ">", RED)):
            sheet(d, (x - 229, 247, x + 229, 515), WHITE)
            label(d, x, 297, name, 39)
            label(d, x + 49, 414, "100 €", 72)
            card(d, (x - 185, 366, x - 72, 459), color, radius=15)
            label(d, x - 129, 409, comparator, 73)
        return
    cents, old, new = {
        "start": ("–", "", ""), "below": ("99,99 €", "Kein Rabatt", "Kein Rabatt"),
        "above": ("100,01 €", "Rabatt", "Rabatt"), "exact": ("100,00 €", "Rabatt", "Kein Rabatt"),
        "think": ("?", "", ""),
    }[action]
    p = clock.move(duration=1.36, offset=.68)
    if action in ("below", "above", "exact"):
        travel = clock.move(duration=.78)
        routes = [[(640, 221), (x, 221), (x, 274)] for x in (338, 942)]
        for path in routes:
            wire(d, path, AMBER)
            traveler(d, path, travel, "book", AMBER)
    cash_register(d, 338, "Alte Kasse", cents, old, p, "#efe5ce")
    cash_register(d, 942, "Umgebaute Kasse", cents, new, p, "#f0e8d9")
    if action == "start":
        pill(d, 640, 220, "Rabatt ab 100 €", AMBER, 37)
    if action == "think":
        pill(d, 640, 227, "99,99 €   ·   ?   ·   100,01 €", AMBER, 34)
        clock.asks(d, "Welcher Betrag fehlt?")


SCENES = {
    "library": ("Stadtbibliothek", library),
    "locker": ("Paketautomat", locker),
    "weather": ("Wander-App", weather),
    "shipping": ("Versandkosten", shipping),
    "register": ("Kassenvergleich", register),
}


def frame(key, action, clock):
    image = backdrop(key).copy()
    draw = ImageDraw.Draw(image)
    setting, scene = SCENES[key]
    top(draw, key, setting)
    scene(draw, action, clock)
    return image


def poster(film):
    image = backdrop(film.key).copy()
    d = ImageDraw.Draw(image)
    accent = THEMES[film.key][2]
    top(d, film.key, SCENES[film.key][0])
    for index, row in enumerate(film.poster_title):
        label(d, 67, 290 + index * 100, row, 77, WHITE if index == 0 else accent, "lm")

    if film.key == "library":
        sheet(d, (837, 207, 1160, 549), "#1d664e", MINT, 36)
        icon(d, "book", 872, 253, 245, WHITE)
        pill(d, 871, 504, "7 Tage", AMBER, 37)
        pill(d, 1106, 504, "10 Tage", BLUE, 37)
    elif film.key == "locker":
        locker_doors(d, 1)
        pill(d, 952, 545, "A1", BLUE, 41)
        pill(d, 1118, 545, "B2", AMBER, 41)
    elif film.key == "weather":
        sheet(d, (834, 215, 1168, 526), "#ddf6f2")
        cloud(d, 997, 292, "#427286", .91)
        label(d, 1001, 418, "0,65", 95)
        pill(d, 1001, 539, "→ 65 %", MINT, 46)
    elif film.key == "shipping":
        sheet(d, (873, 221, 1196, 529), "#e4dbf7")
        parcel(d, 1035, 325, 1.35, "#46315d")
        label(d, 1035, 457, "4,90 €", 70, "#793f3f")
    else:
        cash_register(d, 959, "Rabattgrenze", "100,00 €", "≥ oder > ?", 1, AMBER)
    return image
