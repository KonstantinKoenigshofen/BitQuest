"""Sprechtext und Kapitel für Folge 2 zur Softwarearchitektur."""

from episode import Film, shot


FILM = Film(
    "qualitaetsziele",
    "softwarearchitektur-qualitaetsziele-messbar-machen",
    "Qualitätsziele messbar machen",
    ("Qualitätsziele", "messbar machen"),
    "qualitaet-entwerfen",
    "Qualitätsziele in Entwürfe übersetzen",
    (
        shot(
            "auftrag",
            "Die Abfahrtstafel soll bei einem Netzausfall zuverlässig sein. Was würdest du messen, um diese Anforderung zu prüfen?",
            "In Folge eins hat ein lokaler Speicher geholfen. Heute legen wir fest, was die Tafel im Ausfall anzeigen muss und wie wir das im Test überprüfen.",
        ),
        shot(
            "lage",
            "Zuerst machen wir die Situation konkret. Es ist Berufsverkehr, und die Tafel am Gleis hat um acht Uhr zwölf gültige Abfahrtsdaten empfangen.",
            "Um acht Uhr sechzehn und dreißig Sekunden bricht die Verbindung zum Fahrplanserver ab.",
            "Damit stehen die Umgebung, der betroffene Systemteil und der Auslöser fest.",
        ),
        shot(
            "reaktion",
            "Jetzt beschreiben wir die erwartete Reaktion. Die Tafel zeigt die letzten Abfahrten mit einem sichtbaren Zeitstempel.",
            "Die erste Messung beginnt beim Netzausfall. Bis zum sichtbaren Zeitstempel dürfen höchstens zwei Sekunden vergehen.",
        ),
        shot(
            "datenalter",
            "Die zweite Messung beginnt schon beim Empfang. Beim Ausfall sind die Daten vier Minuten und dreißig Sekunden alt.",
            "Der gespeicherte Stand darf nur angezeigt werden, solange er jünger als fünf Minuten ist.",
            "Um acht Uhr siebzehn muss also der Störungshinweis erscheinen. Vom Ausfall bis dahin bleiben nur dreißig Sekunden.",
        ),
        shot(
            "szenario",
            "Jetzt haben wir ein Qualitätsszenario. Die Netzverbindung ist die Quelle der Störung. Ihr Abbruch ist der Auslöser.",
            "Wir wissen, wann der Ausfall passiert und welche Tafel betroffen ist.",
            "Und wir haben eine erwartete Reaktion mit zwei messbaren Grenzen. So kann das Team denselben Test wiederholen.",
        ),
        shot(
            "aufbau",
            "Für den Test spielen wir einen gültigen Stand ein und stellen die Uhr auf den Zeitpunkt des Ausfalls.",
            "Dann unterbrechen wir die Verbindung und notieren zwei Werte: die Sekunden bis zum Zeitstempel und das Datenalter beim Wechsel zum Störungshinweis.",
        ),
        shot(
            "think",
            "Hier sind drei Beispielmessungen. Die erste Zahl sagt, wie schnell die Tafel reagiert.",
            "Die zweite zeigt das Alter der Daten beim Umschalten.",
            "Welcher Versuch hält beide Vorgaben ein?",
            hold=5.0,
        ),
        shot(
            "loesung",
            "Versuch A besteht. Der Zeitstempel erscheint nach eins Komma vier Sekunden und der Hinweis bei genau fünf Minuten Datenalter.",
            "Versuch B reagiert sogar schneller, zeigt aber die alten Daten vierzehn Sekunden zu lange.",
            "Versuch C beendet die Anzeige rechtzeitig, braucht aber zwei Komma vier Sekunden für die erste Reaktion.",
        ),
        shot(
            "grenzen",
            "Für einen weiteren Test ändern wir die Ausgangslage. Die Tafel startet ohne Netz und ihr Speicher ist leer.",
            "Hier muss sie direkt einen Störungshinweis zeigen. Erst mit einem neuen gültigen Stand kann sie wieder aktuelle Abfahrten anzeigen.",
        ),
        shot(
            "naechste",
            "Wenn du das nächste Mal eine Anforderung wie zuverlässig oder schnell hörst, frag nach einer konkreten Lage, der erwarteten Reaktion und einer Messgröße.",
            "In der nächsten Folge halten wir fest, warum wir einen bestimmten Aufbau wählen und welche Folgen er hat.",
            hold=2.0,
        ),
    ),
    voice="Charon",
)

CHAPTERS = (
    ("auftrag", "Was bedeutet zuverlässig?"),
    ("lage", "Den Ausfall konkret beschreiben"),
    ("reaktion", "Reaktionszeit und Datenalter"),
    ("szenario", "Das Qualitätsszenario festhalten"),
    ("aufbau", "Den Störungstest vorbereiten"),
    ("think", "Drei Messungen auswerten"),
    ("grenzen", "Weitere Fälle und Ausblick"),
)
