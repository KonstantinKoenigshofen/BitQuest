"use strict";

const softwaredesignQuests = [
  {
    id: "module-entwerfen", topic: "softwaredesign", title: "Module mit klarer Verantwortung entwerfen",
    description: "Finde zusammengehörige Regeln und schütze interne Entscheidungen vor Änderungen außerhalb des Moduls.",
    lessons: [
      {
        title: "Verantwortung und Kohäsion",
        intro: "Ein Modul ist ein Teil des Programms mit einer eigenen Aufgabe. Kohäsion beschreibt, wie eng die Aufgaben innerhalb dieses Teils zusammenhängen.",
        sections: [
          ["Mit fachlichen Regeln beginnen", "In einer Stadtbibliothek werden Ausleihen verlängert, Rückgaben erfasst und verspätete Medien angemahnt. Verlängerung und Rückgabe ändern den Ausleihzustand. Fristen für Mahnstufen und Ausnahmen für bestimmte Nutzergruppen gehören zu einer anderen Regelgruppe."],
          ["Eine mögliche Änderung durchspielen", "Wenn der Stadtrat die Mahnfristen ändert, sollst du im Code eine zuständige Stelle finden. Gehe mehrere typische Änderungen durch. Aufgaben, die dieselben Regeln und Daten pflegen, sind Kandidaten für dasselbe Modul."],
        ],
        check: ["Wo gehört die Regel hin, dass vorgemerkte Medien nicht verlängert werden dürfen?", "Ins Ausleihmodul. Die Regel entscheidet über die Dauer einer Ausleihe und verwendet den aktuellen Vormerkstatus als Eingabe."],
        source: ["ACM, IEEE-CS und AAAI · CS2023, Software Design", "https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm"],
      },
      {
        title: "Information Hiding und Kopplung",
        intro: "Nachdem du die Verantwortungen gefunden hast, entscheidest du, was ein Modul nach außen preisgibt. Kopplung beschreibt seine Abhängigkeiten zu anderen Teilen.",
        sections: [
          ["Die veränderliche Entscheidung verbergen", "Beim Information Hiding bleiben Entscheidungen wie die Speicherung oder die Berechnung einer Mahnstufe im zuständigen Modul. Andere Teile verwenden eine Schnittstelle, die das fachliche Ergebnis beschreibt, etwa welche Mahnung für eine Ausleihe fällig ist."],
          ["Abhängigkeiten beim Umbau sichtbar machen", "Ein direkter Tabellenzugriff koppelt den Aufrufer an Felder und Datenformate. Eine Schnittstelle lässt eine Abhängigkeit vom fachlichen Vertrag bestehen. Ein Wechsel der internen Datenhaltung ist möglich, solange die zugesicherten Ergebnisse gleich bleiben."],
        ],
        check: ["Was ändert sich beim Wechsel von einer Tabelle zu einer Regeldatei, wenn der Vertrag stabil bleibt?", "Das Mahnmodul ändert die Umsetzung. Die aufrufenden Teile können dieselbe Operation und dieselben Ergebnisse verwenden."],
        source: ["David L. Parnas · On the Criteria To Be Used in Decomposing Systems into Modules", "https://www.cs.lafayette.edu/~gexia/cs301/resources/parnas.html"],
      },
      {
        title: "Eine fachliche Schnittstelle zuschneiden",
        intro: "Wenn die Verantwortung feststeht, lege fest, welche Operation der Rest des Programms für seine Arbeit braucht. So bekommt der Aufrufer ein Ergebnis, das er direkt verwenden kann.",
        sections: [
          ["Vom Bedarf des Aufrufers ausgehen", "Der tägliche Mahnlauf muss wissen, ob für eine Ausleihe eine Mahnung fällig ist. Er übergibt die relevanten Ausleihdaten und den Stichtag an bewerteMahnung. Die Operation meldet, dass keine Mahnung fällig ist, oder liefert die fällige Mahnstufe."],
          ["Eingaben und Zusagen beschreiben", "Lege fest, welche Ausleihdaten die Operation braucht und was das Ergebnis bedeutet. Fristentabelle und Berechnungsreihenfolge bleiben bei der Umsetzung. Änderungen daran sind möglich, solange die Operation ihre Zusagen einhält."],
        ],
        example: {
          title: "Was über die Modulgrenze geht",
          columns: ["Bereich", "Beispiel im Mahnlauf"],
          rows: [["Eingabe", "Rückgabefrist, Kontogruppe und Stichtag"], ["Ergebnis", "Keine Mahnung oder eine konkrete Mahnstufe"], ["Intern im Mahnmodul", "Speicherformat und Ablauf der Regelprüfung"]],
        },
        check: ["Warum bekommt der tägliche Mahnlauf die Mahnstufe als Ergebnis?", "So kann er den Versand anstoßen, ohne die Regeln zur Berechnung der Stufe selbst zu kennen."],
        source: ["MIT 6.102 · Abstract Data Types und Representation Independence", "https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/"],
      },
      {
        title: "Modulgrenzen mit Änderungen überprüfen",
        intro: "Spiele typische Änderungen durch. So siehst du vor einem Umbau, wie weit sich jede Änderung im Programm ausbreiten würde.",
        sections: [
          ["Zwei Änderungen getrennt betrachten", "Bei einer neuen Frist für Jugendkonten änderst du die Mahnregeln und passt ihre Tests an. Wenn die Bibliothek den Mailanbieter wechselt, änderst du den Versand und prüfst seine Zustellung. Im guten Zuschnitt bleibt der fachliche Vertrag zwischen den beiden Teilen dabei stabil."],
          ["Schnittstellen mitprüfen", "Prüfe nach dem Anbieterwechsel, ob derselbe Versandauftrag noch angenommen wird. Ein Test der Mahnstufe sollte dafür dieselben Eingaben und Erwartungen verwenden können wie vorher. Wenn ein Aufrufer neue Informationen braucht, ist eine bewusste Änderung am Vertrag mit passenden Tests sinnvoll."],
        ],
        check: ["Welche zwei Prüfungen würdest du beim Wechsel des Mailanbieters ausführen?", "Prüfe, dass der bisherige Auftrag beim neuen Anbieter zugestellt wird und dass dieselben Ausleihdaten weiterhin zur gewohnten Mahnstufe führen."],
        source: ["David L. Parnas · Modularisierung und Änderbarkeit", "https://www.cs.lafayette.edu/~gexia/cs301/resources/parnas.html"],
      },
    ],
    practice: {
      title: "Die Mahnregeln einer Stadtbibliothek umbauen",
      intro: "Die Bibliothek führt neue Ausnahmen für Jugendkonten ein und wechselt später ihren Mailanbieter. Heute berechnet ein einziges Skript Fristen und verschickt die Nachrichten. Plane einen Zuschnitt, mit dem beide Änderungen unabhängig bearbeitet werden können.",
      questions: [
        { prompt: "Wer verwaltet Fristen, Mahnstufen und deren Ausnahmen?", answer: 1, options: ["Das Versandmodul, das auch Briefvorlagen pflegt.", "Das Mahnmodul, das den Fälligkeitsstatus fachlich bewertet."], clue: "Suche nach der Verantwortung, die sich bei einer Änderung der Mahnordnung gemeinsam ändert.", explanation: "Die Regeln für Mahnstufen haben einen gemeinsamen Änderungsgrund und bleiben an einer fachlichen Stelle." },
        { prompt: "Welche Information bekommt das Versandmodul?", answer: 0, options: ["Einen Versandauftrag mit Empfänger, Mahnstufe und benötigten Briefdaten.", "Zugriff auf die komplette Regeltabelle, um die Stufe selbst zu berechnen."], clue: "Der Versand braucht das Ergebnis der Berechnung und die Daten zur Zustellung.", explanation: "Der Auftrag bildet eine fachliche Schnittstelle. Die Mahnregeln bleiben im Mahnmodul und der Anbieterwechsel bleibt beim Versand." },
        { prompt: "Welche Änderung prüft die entworfene Grenze direkt?", answer: 1, options: ["Zwei weitere Versandvorlagen hinzufügen und alle Tabellen migrieren.", "Den Mailanbieter wechseln und den bestehenden Test der Mahnstufen unverändert ausführen."], clue: "Eine unabhängige Änderung sollte die andere Verantwortung unberührt lassen.", explanation: "So prüfst du, ob der Anbieterwechsel ohne Änderung der fachlichen Regeln möglich ist." },
        { prompt: "Was sollte der tägliche Mahnlauf vom Mahnmodul abfragen?", answer: 0, options: ["Ob am Stichtag für die Ausleihe eine Mahnung fällig ist und welche Stufe sie hat.", "Welche Fristentabelle gespeichert ist, damit der Mahnlauf die Stufe berechnen kann."], clue: "Der Mahnlauf braucht ein fachliches Ergebnis für den nächsten Schritt.", explanation: "Die Operation liefert eine Entscheidung. Dadurch kann das Mahnmodul seine Berechnung intern weiterentwickeln." },
      ],
      summary: "Dein Entwurf kapselt die Mahnordnung im Mahnmodul und die Zustellung im Versandmodul. Der fachliche Versandauftrag ist die Verbindung zwischen beiden.",
    },
  },
  {
    id: "schnittstellen-entwerfen", topic: "softwaredesign", title: "Verlässliche Schnittstellen entwerfen",
    description: "Formuliere Vor- und Nachbedingungen und leite Tests für Fehlerfälle und Wiederholungen ab.",
    lessons: [
      {
        title: "Vorbedingungen und zugesichertes Verhalten",
        intro: "Ein Schnittstellenvertrag legt fest, was beim Aufruf gilt und was die Implementierung für gültige Aufrufe garantiert.",
        sections: [
          ["Die Pflichten der Beteiligten trennen", "Beim Reservieren eines Paketfachs muss der Aufrufer zum Beispiel eine gültige Größenklasse übergeben. Das ist eine Vorbedingung. Ein vollständig belegter Automat ist dagegen eine erwartbare Situation bei gültiger Eingabe. Der Vertrag kann dafür das Ergebnis BELEGT und einen unveränderten Bestand zusichern."],
          ["Alle beobachtbaren Folgen festhalten", "Eine Nachbedingung beschreibt Rückgabewerte und sichtbare Zustandsänderungen. Bei Erfolg kann der Vertrag ein neu reserviertes Fach und eine Reservierungsnummer zusichern. Daraus kannst du Tests ableiten, die unabhängig von der internen Datenbank sind."],
        ],
        check: ["Ist ein voller Paketautomat eine ungültige Eingabe?", "Bei der hier vereinbarten Schnittstelle ist das ein fachlicher Ablehnungsfall mit einem zugesicherten Ergebnis."],
        source: ["MIT 6.102 · Specifications", "https://web.mit.edu/6.102/www/sp26/classes/04-specifications/"],
      },
      {
        title: "Wiederholungen spezifizieren und testen",
        intro: "Bei einem Verbindungsabbruch kann ein Aufrufer dieselbe Anforderung wiederholen. Bei einer idempotenten Ausführung hat diese Wiederholung dieselbe beabsichtigte Wirkung auf den Zustand wie die einmalige Ausführung.",
        sections: [
          ["Eine logische Anforderung erkennen", "Der Aufrufer gibt einen Anforderungsschlüssel mit. Für diese Schnittstelle gilt, dass derselbe Schlüssel mit identischen Eingaben innerhalb von 24 Stunden dasselbe zuvor verarbeitete Ergebnis zurückgibt. Das erlaubt eine Wiederholung nach einem Timeout."],
          ["Die Wirkung prüfen", "Teste zuerst den erfolgreichen Aufruf. Sende danach denselben Schlüssel mit denselben Eingaben. Beide Antworten sollen dieselbe Reservierungsnummer enthalten, und die Zahl der belegten Fächer soll nur einmal steigen. Ein bereits verwendeter Schlüssel mit anderen Eingaben sollte im Vertrag einen eigenen Konfliktfall bekommen."],
        ],
        check: ["Jetzt sind schon drei Fächer belegt. Ein neuer Auftrag mit K7 reserviert A51, die Antwort geht verloren. Was soll dein Test nach dem erneuten Senden prüfen?", "Mit K7 und denselben Angaben muss die Antwort A51 enthalten. Die Belegung soll gegenüber dem Start nur um eins steigen, also von drei auf vier. Ein Erfolg mit anderer Nummer oder fünf belegten Fächern hätte die Doppelreservierung übersehen, wenn du nur den Erfolgsstatus prüfst."],
        source: ["AWS Builders’ Library · Making retries safe with idempotent APIs", "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/"],
      },
      {
        title: "Gültige Zustände mit Invarianten schützen",
        intro: "Eine Invariante ist eine Regel, die in jedem gültigen Zustand gilt. Bei der Paketstation darf jedes Fach höchstens eine aktive Reservierung haben.",
        sections: [
          ["Regeln über einzelne Antworten hinaus festlegen", "Die Nachbedingung von reserviere beschreibt die Wirkung dieses Aufrufs. Die Invariante gilt auch nach Freigaben und bei zwei gleichzeitig eintreffenden Anfragen. Zusammen beschreiben diese Regeln, welche Zustände zulässig sind."],
          ["Wiederholungen und konkurrierende Aufträge unterscheiden", "Derselbe Anforderungsschlüssel kennzeichnet eine Wiederholung. Zwei verschiedene Schlüssel können zu zwei Zustellern gehören, die gleichzeitig das letzte Fach beanspruchen. Das System muss den Bestand so aktualisieren, dass höchstens einer eine neue Reservierung dafür erhält."],
        ],
        check: ["Weshalb brauchen wir die Invariante auch bei idempotenten Wiederholungen?", "Die Behandlung desselben Schlüssels regelt Wiederholungen eines Auftrags. Zwei unterschiedliche Aufträge müssen sich unabhängig davon an die gemeinsame Belegungsregel halten."],
        source: ["MIT 6.102 · Abstraction Functions & Rep Invariants", "https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/"],
      },
      {
        title: "Testfälle aus dem Vertrag ableiten",
        intro: "Ein guter Testfall beschreibt Ausgangslage, Aufruf und erwartetes Ergebnis. Bei einer zustandsändernden Operation prüfst du zusätzlich, was sich geändert hat.",
        sections: [
          ["Fälle mit unterschiedlichem Verhalten suchen", "Teste getrennt, ob die Reservierung bei einem freien Fach gelingt, bei voller Station sauber abgelehnt wird und bei Wiederholung den vorhandenen Beleg zurückgibt. Wenn der Vertrag einen Konflikt für denselben Schlüssel mit anderen Daten zusagt, erhält er einen eigenen Test."],
          ["An den Grenzen testen", "Der Übergang von genau einem passenden freien Fach zu null ist besonders aufschlussreich. Starte bei genau einem Fach auch zwei überlappende Aufrufe mit verschiedenen Schlüsseln. Erwartet wird eine neue Reservierung und einmal BELEGT."],
        ],
        example: {
          title: "Beobachtbare Erwartungen an die Paketstation",
          columns: ["Ausgangslage und Aufruf", "Ergebnis und Wirkung"],
          rows: [["Ein freies Fach, neuer gültiger Auftrag", "Neue Reservierungsnummer und ein Fach weniger frei"], ["Kein freies Fach, neuer gültiger Auftrag", "BELEGT bei unverändertem Bestand"], ["Antwort verloren, erneute Anfrage mit denselben Daten und demselben Schlüssel", "Dieselbe Reservierungsnummer bei unverändertem Bestand"]],
        },
        check: ["Woran erkennst du im Test, dass die Station bei Ablehnung korrekt arbeitet?", "Prüfe die Antwort BELEGT und vergleiche den Bestand vor und nach dem Aufruf."],
        source: ["MIT 6.102 · Testing und Grenzfälle", "https://web.mit.edu/6.102/www/sp26/classes/02-testing/"],
      },
    ],
    practice: {
      title: "Eine Paketfach-Reservierung nach einem Timeout prüfen",
      intro: "Ein Zusteller reserviert ein Fach der Größe M. Der Server hat die Reservierung A42 gespeichert, aber die Antwort geht verloren. Innerhalb der Zusagefrist wiederholt die App denselben Auftrag. Außerdem musst du das Verhalten bei voller Station prüfen.",
      questions: [
        { prompt: "Welches Ergebnis muss die Wiederholung mit demselben Schlüssel und denselben Daten liefern?", answer: 0, options: ["A42 zurückgeben und kein weiteres Fach belegen.", "Ein neues Fach belegen und eine weitere Reservierungsnummer erzeugen."], clue: "Beide technischen Aufrufe stehen für denselben fachlichen Auftrag.", explanation: "Aus Sicht der Belegung wirkt die wiederholte Anfrage wie der ursprüngliche Aufruf allein." },
        { prompt: "Was gilt bei einem neuen gültigen Auftrag für eine volle Station?", answer: 1, options: ["Der Aufruf liegt außerhalb des Vertrags.", "Der Aufruf liefert BELEGT und ändert den Bestand nicht."], clue: "Belegung ist ein Systemzustand. Die Größenklasse bleibt eine gültige Eingabe.", explanation: "Die Ablehnung ist Teil der Nachbedingung und lässt sich gezielt testen." },
        { prompt: "Welcher Test würde eine versehentliche Doppelbelegung erkennen?", answer: 1, options: ["Beide Antworten haben einen Erfolgsstatus.", "Die Reservierungsnummer bleibt A42 und die Zahl der belegten Fächer steigt insgesamt um eins."], clue: "Teste neben der Antwort auch die beobachtbare Zustandsänderung.", explanation: "Der Test überprüft Ergebnis und Wirkung der Wiederholung." },
        { prompt: "Welches Ergebnis erwartest du bei zwei neuen, überlappenden Aufträgen mit verschiedenen Schlüsseln für das letzte passende Fach?", answer: 0, options: ["Eine neue Reservierung und einmal BELEGT.", "Zwei erfolgreiche Reservierungen für dasselbe Fach, weil die Schlüssel unterschiedlich sind."], clue: "Die Schlüssel unterscheiden die Aufträge. Die Regel für die Belegung gilt für beide zugleich.", explanation: "Höchstens eine Reservierung pro Fach bleibt auch bei konkurrierenden Aufträgen die Invariante." },
      ],
      summary: "Dein Vertrag unterscheidet gültige Ablehnungen von Eingabebedingungen und macht die Wirkung von Wiederholungen testbar.",
    },
  },
  {
    id: "abhaengigkeiten-austauschen", topic: "softwaredesign", title: "Abhängigkeiten austauschbar machen",
    description: "Halte die Tourenlogik unabhängig von einem konkreten Wetteranbieter und teste sie mit vorhersehbaren Antworten.",
    lessons: [
      {
        title: "Eine feste Abhängigkeit erkennen",
        intro: "Ein Teil des Programms hängt von einem anderen ab, wenn er dessen Schnittstelle oder konkrete Umsetzung kennen muss. Welche Details er kennt, bestimmt, wie weit sich Änderungen ausbreiten.",
        sections: [
          ["Vom fachlichen Bedarf ausgehen", "Die Wander-App berechnet einen Regenhinweis für Ort und Zeitpunkt. Dafür braucht sie eine Niederschlagswahrscheinlichkeit und die Information, ob eine Vorhersage verfügbar ist. Die Verbindung zum Wetterdienst dient dazu, diese Daten zu beschaffen."],
          ["Den Anbieterwechsel durchspielen", "In der ersten Version erzeugt die Tourenlogik den Netzwerkclient selbst und liest das Feld rain_probability aus seiner Antwort. Ein neuer Anbieter nutzt ein anderes Format. Beim Wechsel müsste die Logik den Aufbau der neuen Antwort kennen, obwohl ihre Regel für den Regenhinweis gleich bleibt."],
        ],
        check: ["Welches Wissen in der Tourenlogik erschwert den Anbieterwechsel?", "Sie kennt den konkreten Netzwerkclient und das Antwortformat des Anbieters. Die Regel für den Regenhinweis braucht nur die fachlich vereinbarte Wahrscheinlichkeit."],
        source: ["Microsoft Learn · Common web application architectures", "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures#clean-architecture"],
      },
      {
        title: "Eine Schnittstelle und passende Adapter entwerfen",
        intro: "Definiere eine Schnittstelle in der Sprache der Tourenlogik. Ein Adapter verbindet diese Schnittstelle mit dem Format eines konkreten Wetteranbieters.",
        sections: [
          ["Den Vertrag festlegen", "Die Operation vorhersage erhält Ort und Zeitpunkt. Sie liefert entweder eine Niederschlagswahrscheinlichkeit in Prozent von 0 bis 100 oder meldet, dass keine Vorhersage verfügbar ist. Null Prozent ist ein gültiger Wert."],
          ["Die Codeabhängigkeit umdrehen", "Die Tourenlogik definiert und nutzt die Schnittstelle Wetterquelle. Jeder Anbieteradapter implementiert sie und hängt damit im Code von diesem Vertrag ab. Zur Laufzeit ruft die Tourenlogik den ausgewählten Adapter über die Schnittstelle auf."],
        ],
        example: {
          title: "Welche Aufgabe gehört wohin?",
          columns: ["Baustein", "Verantwortung"],
          rows: [["Tourenlogik", "Den Regenhinweis aus der Wahrscheinlichkeit ableiten"], ["Schnittstelle Wetterquelle", "Eingaben, Einheit und mögliche Ergebnisse vereinbaren"], ["Anbieteradapter", "Die Antwort des Anbieters auf das vereinbarte Format abbilden"]],
        },
        check: ["Ein Anbieter liefert 0,65 als Anteil. Wer rechnet das in 65 Prozent um?", "Der Anbieteradapter. Er kennt das fremde Format und liefert der Tourenlogik die vereinbarte Einheit."],
        source: ["Alistair Cockburn · Hexagonal Architecture, Ports and Adapters", "https://alistair.cockburn.us/hexagonal-architecture/"],
      },
      {
        title: "Die Wetterquelle von außen übergeben",
        intro: "Beim Start der App wählst du den Adapter aus und übergibst ihn beim Erzeugen der Tourenlogik. Diese Übergabe heißt Dependency Injection.",
        sections: [
          ["Den Aufbau zentral erledigen", "Eine Startfunktion liest die Konfiguration, erzeugt den Wetteradapter und übergibt ihn an die Tourenlogik. Auf diesem Weg kann die App für unterschiedliche Umgebungen verschiedene Wetterquellen einsetzen."],
          ["Schnittstelle und Übergabe auseinanderhalten", "Dependency Inversion beschreibt hier die Richtung der Codeabhängigkeit. Dependency Injection beschreibt, wie die konkrete Wetterquelle zur Laufzeit in die Tourenlogik gelangt. Eine Übergabe im Konstruktor reicht für dieses Beispiel aus."],
        ],
        check: ["Wo wählst du beim Anbieterwechsel den neuen Adapter aus?", "In der Startfunktion beziehungsweise ihrer Konfiguration. Die Tourenlogik arbeitet weiter mit der vereinbarten Wetterquelle."],
        source: ["Martin Fowler · Inversion of Control Containers and the Dependency Injection Pattern", "https://martinfowler.com/articles/injection.html"],
      },
      {
        title: "Die Tourenlogik mit einem Test-Stub prüfen",
        intro: "Ein Stub ist hier eine kleine Ersatzimplementierung, die für den Test vereinbarte Antworten liefert. So kannst du die Regel für den Regenhinweis mit gezielten Werten prüfen.",
        sections: [
          ["Den Grenzwert gezielt testen", "Die fiktive App zeigt ab 60 Prozent einen Regenhinweis. Übergib für dieselbe Tour einmal einen Stub mit 59 Prozent und einmal einen mit 60 Prozent. Ein weiterer Test gibt „nicht verfügbar“ zurück und prüft die sichtbare Meldung für fehlende Wetterdaten."],
          ["Die Adapter separat prüfen", "Prüfe die Umrechnung und die Behandlung von Ausfällen direkt im Adapter. Verwende dafür etwa gespeicherte Beispielantworten. Die Tourenlogik und die Anbieteranbindung haben damit jeweils Tests für ihre eigene Verantwortung."],
        ],
        check: ["Warum übergibst du im Grenztest genau 60 Prozent?", "So prüfst du, ob der Hinweis bereits an der vereinbarten Grenze erscheint."],
        source: ["Martin Fowler · Mocks Aren’t Stubs", "https://martinfowler.com/articles/mocksArentStubs.html"],
      },
    ],
    practice: {
      title: "Die Wetterquelle einer Wander-App austauschen",
      intro: "Die App bekommt einen zweiten Wetteranbieter. Nord liefert die Wahrscheinlichkeit als Anteil zwischen 0 und 1, Süd als Prozentzahl. Die Tourenlogik erwartet Prozent und zeigt ab 60 Prozent einen Regenhinweis. Prüfe auch, wie sie ohne Wetterdaten reagiert.",
      comparison: {
        title: "Wetterquellen mit Beispieldaten ausprobieren",
        label: "Wetterquelle",
        variants: [
          { label: "Anbieter Nord", details: [["Anbieterantwort", "0,65 als Anteil"], ["Ergebnis der Wetterquelle", "65 Prozent"], ["Anzeige", "Regenhinweis"]] },
          { label: "Anbieter Süd", details: [["Anbieterantwort", "65 als Prozentzahl"], ["Ergebnis der Wetterquelle", "65 Prozent"], ["Anzeige", "Regenhinweis"]] },
          { label: "Test-Stub mit 59 Prozent", details: [["Vorgegebene Testantwort", "59 Prozent"], ["Ergebnis der Wetterquelle", "59 Prozent"], ["Anzeige", "Kein Regenhinweis"]] },
          { label: "Test-Stub mit 60 Prozent", details: [["Vorgegebene Testantwort", "60 Prozent"], ["Ergebnis der Wetterquelle", "60 Prozent"], ["Anzeige", "Regenhinweis an der Grenze"]] },
          { label: "Anbieter nicht erreichbar", details: [["Anbieterantwort", "Zeitüberschreitung"], ["Ergebnis der Wetterquelle", "Nicht verfügbar"], ["Anzeige", "Wetterdaten fehlen"]] },
        ],
      },
      questions: [
        { prompt: "Wer definiert den Vertrag, von dem die Tourenlogik abhängen soll?", answer: 1, options: ["Der Anbieter Nord legt das Antwortformat für die Tourenlogik fest.", "Die Tourenlogik definiert die Schnittstelle Wetterquelle und die Anbieteradapter setzen sie um."], clue: "Richte die Schnittstelle nach der Information aus, die die Tourenlogik für ihre eigene Regel braucht.", explanation: "So hängt der fachliche Code nur von seiner Schnittstelle ab und die Adapter übernehmen die technischen Anpassungen." },
        { prompt: "Was macht der Nord-Adapter mit der Antwort 0,65?", answer: 0, options: ["Er liefert der Tourenlogik 65 Prozent.", "Er gibt 0,65 unverändert als Prozentzahl zurück."], clue: "Der Vertrag definiert dieselbe Einheit für alle Wetterquellen.", explanation: "Der Adapter übersetzt den Anteil in Prozent und hält anbieterbezogene Details aus der Regel heraus." },
        { prompt: "Wie prüfst du die Regel direkt an ihrer Grenze?", answer: 1, options: ["Rufe den echten Dienst zweimal zu beliebigen Zeitpunkten auf.", "Übergib einen Stub mit genau 60 Prozent und erwarte einen Regenhinweis."], clue: "Für einen zuverlässigen Grenztest muss der Eingabewert feststehen.", explanation: "Der Stub liefert die gewünschte Eingabe ohne Netzwerk. Der Test prüft die Regel an ihrer Grenze." },
        { prompt: "Welche Anzeige passt zu einer Zeitüberschreitung beim Wetterdienst?", answer: 0, options: ["Wetterdaten fehlen.", "Niederschlagswahrscheinlichkeit 0 Prozent."], clue: "Eine fehlende Vorhersage und ein gültiger Zahlenwert haben unterschiedliche Bedeutungen.", explanation: "Der Adapter liefert „nicht verfügbar“ und die Tourenlogik kann den Ausfall sichtbar machen." },
      ],
      summary: "Dein Entwurf trennt fachliche Regeln, Anbieterformate und Auswahl der Wetterquelle. Dieselbe Tourenlogik kann mit beiden Anbietern und einem Test-Stub arbeiten.",
    },
  },
  {
    id: "strategien-variieren", topic: "softwaredesign", title: "Verhalten mit Entwurfsmustern variieren",
    description: "Kapsle austauschbare Regeln mit dem Strategy-Muster und ergänze eine Lieferart, ohne die Bestelllogik erneut zu verzweigen.",
    legacySteps: { 4: 3 },
    lessons: [
      {
        title: "Erkennen, welche Regel sich ändert",
        intro: "Ein Entwurfsmuster beschreibt eine wiederkehrende Lösung für ein Entwurfsproblem. Beim Strategy-Muster können mehrere Berechnungen dieselbe Aufgabe übernehmen.",
        sections: [
          ["Gemeinsamen Ablauf finden", "Ein Shop ermittelt für jede Bestellung einen Versandpreis und zeigt ihn im Warenkorb an. Standardversand, Express und Abholung haben unterschiedliche Preisregeln. Die Schritte für die Anzeige und Bestellung bleiben gleich."],
          ["Die Variante benennen", "Wenn jede neue Lieferart Änderungen in der Preisvorschau und in der Bestellung erfordert, lohnt sich eine eigene Stelle für die Berechnung. Bei zwei festen Beträgen kann eine kleine Tabelle weiterhin genügen. Eine Strategie ist vor allem dann sinnvoll, wenn sich die Berechnungen unabhängig ändern."],
        ],
        check: ["Welcher Teil eignet sich im Shop als austauschbare Strategie?", "Die Berechnung der Versandkosten für die ausgewählte Lieferart."],
        source: ["John Vlissides · An Introduction to Design Patterns, Strategy", "https://www.dre.vanderbilt.edu/~schmidt/PDF/GoF.pdf"],
      },
      {
        title: "Einen gemeinsamen Vertrag für Strategien entwerfen",
        intro: "Alle Strategien erfüllen denselben Vertrag. Der aufrufende Code kann deshalb jede von ihnen auf die gleiche Weise verwenden.",
        sections: [
          ["Eingaben und Einheit vereinbaren", "Die Operation berechneVersand erhält die Versanddaten, etwa Gewicht und Lieferzone, und liefert einen Betrag in Cent. Die Abholstrategie liefert null Cent. Auch dieser Betrag ist ein reguläres Ergebnis."],
          ["Den Vertrag klein halten", "Eine Strategie erhält die Daten, die sie für ihre Berechnung braucht. Die Regeln dafür, welche Lieferarten zur Auswahl stehen, können bereits davor geprüft werden. Dadurch lässt sich jede Strategie mit denselben Arten von Eingaben testen."],
        ],
        example: {
          title: "Eine Schnittstelle, drei Berechnungen",
          columns: ["Lieferart", "Beispielpreis für ein Paket mit zwei Kilogramm"],
          rows: [["Standard", "490 Cent"], ["Express", "990 Cent"], ["Abholung", "0 Cent"]],
        },
        check: ["Warum sollte jede Strategie ein Ergebnis in Cent liefern?", "Der aufrufende Code kann alle Ergebnisse gleich behandeln. Welche Berechnung den Betrag erzeugt hat, braucht er dafür nicht zu wissen."],
        source: ["Gamma, Helm, Johnson und Vlissides · Design Patterns", "https://www.informit.com/store/design-patterns-elements-of-reusable-object-oriented-9780321770462"],
      },
      {
        title: "Eine Strategie auswählen und die Auswahl testen",
        intro: "Der Shop wählt die Strategie anhand der Lieferart aus. Die Bestelllogik bekommt die ausgewählte Berechnung übergeben und führt sie aus.",
        sections: [
          ["Auswahl an einer Stelle halten", "Eine Zuordnung verbindet Standard, Express und Abholung mit ihren Strategien. Wenn ein Fahrradkurier hinzukommt, ergänzt das Team die neue Berechnung und ihre Zuordnung. Die Schritte für Preisvorschau und Bestellung können dieselbe Schnittstelle behalten."],
          ["Die Berechnung zusammensetzen", "Der Shop kombiniert die ausgewählte Berechnung mit dem übrigen Bestellablauf. Diese Form von Komposition funktioniert auch mit Funktionen, sofern sie denselben Vertrag erfüllen."],
          ["Berechnung und Zuordnung getrennt prüfen", "Teste die Expressberechnung für feste Gewichte und Grenzwerte. Wähle außerdem Express im Bestellablauf und prüfe, dass der Shop diese Berechnung verwendet. Beim Fahrradkurier helfen dieselben zwei Tests, einen Rechenfehler von einer falschen Zuordnung zu unterscheiden."],
        ],
        check: ["Der Expresstest für die Berechnung ist grün, der Warenkorb zeigt den Standardpreis. Was solltest du zuerst prüfen?", "Prüfe, ob die Lieferart Express tatsächlich der Expressstrategie zugeordnet ist."],
        source: ["MIT 6.102 · Testing und Grenzfälle", "https://web.mit.edu/6.102/www/sp26/classes/02-testing/"],
      },
    ],
    practice: {
      title: "Einen Fahrradkurier als neue Lieferart ergänzen",
      intro: "Der Shop bietet Standard, Express und Abholung an. Für eine Innenstadtzone kommt ein Fahrradkurier hinzu. Alle Preise werden in Cent berechnet. Plane, wie der Shop die passende Regel findet und wie du die neue Lieferart prüfst.",
      comparison: {
        title: "Versandkosten für dasselbe Paket vergleichen", label: "Lieferart",
        variants: [
          { label: "Standard", details: [["Eingabe", "2 kg, Innenstadt"], ["Strategie", "Standardversand"], ["Versandkosten", "490 Cent"]] },
          { label: "Express", details: [["Eingabe", "2 kg, Innenstadt"], ["Strategie", "Expressversand"], ["Versandkosten", "990 Cent"]] },
          { label: "Abholung", details: [["Eingabe", "2 kg, Innenstadt"], ["Strategie", "Abholung"], ["Versandkosten", "0 Cent"]] },
          { label: "Fahrradkurier", details: [["Eingabe", "2 kg, Innenstadt"], ["Strategie", "Fahrradkurier"], ["Versandkosten", "690 Cent"]] },
        ],
      },
      questions: [
        { prompt: "Wo soll die Berechnung für den Fahrradkurier hin?", answer: 1, options: ["In einen neuen Sonderfall in jeder Ansicht des Shops.", "In eine eigene Strategie mit dem gemeinsamen Versandvertrag."], clue: "Der Shop soll dieselbe Preisberechnung an mehreren Stellen aufrufen können.", explanation: "Eine eigene Strategie hält die neue Regel an einer Stelle und lässt sie über die bestehende Schnittstelle verwenden." },
        { prompt: "Wer wählt die Strategie für eine Lieferung per Fahrradkurier aus?", answer: 0, options: ["Die zentrale Zuordnung von Lieferart zu Strategie.", "Die Standardstrategie beim Ausrechnen ihres Preises."], clue: "Auswahl und Ausführung sind zwei getrennte Aufgaben.", explanation: "Die zentrale Zuordnung liefert die Strategie. Sie berechnet anschließend ihren Preis." },
        { prompt: "Welches Ergebnis passt zum vereinbarten Vertrag?", answer: 0, options: ["690 Cent für das Beispielpaket.", "Ein Anzeigetext mit „6,90 €“ als Ergebnis der Berechnung."], clue: "Der aufrufende Code erwartet dieselbe Einheit und Art von Ergebnis für jede Strategie.", explanation: "Die Berechnung liefert einen Betrag in Cent. Die Anzeige kann ihn später formatieren." },
        { prompt: "Welcher Testplan prüft sowohl Auswahl als auch Berechnung?", answer: 1, options: ["Nur prüfen, ob die Lieferart im Menü steht.", "Den Preis der Kurierstrategie einzeln testen und außerdem prüfen, dass der Shop sie bei der Lieferart Fahrradkurier verwendet."], clue: "Eine sichtbare Auswahl sagt noch nichts über die aufgerufene Berechnung aus.", explanation: "Die beiden Tests unterscheiden eine falsche Zuordnung von einer falschen Preisberechnung." },
      ],
      summary: "Du hast eine neue Preisregel als Strategie ergänzt. Auswahl, Berechnung und Anzeige behalten ihre eigenen Aufgaben.",
    },
  },
  {
    id: "code-refaktorieren", topic: "softwaredesign", title: "Bestehenden Code refaktorieren",
    description: "Sichere das sichtbare Verhalten einer Preisberechnung mit Tests ab und zerlege sie in verständliche Schritte.",
    lessons: [
      {
        title: "Beobachtbares Verhalten erkennen",
        intro: "Beim Refactoring änderst du die innere Struktur des Codes. Für dieselben gültigen Eingaben sollen die vereinbarten Ergebnisse und sichtbaren Auswirkungen gleich bleiben.",
        sections: [
          ["Die erste Änderung abgrenzen", "Eine lange Preisfunktion summiert Warenpositionen und zieht ab 100 Euro zehn Prozent Rabatt ab. Das Team möchte den Code verständlicher machen. Die Rabattgrenze bleibt in diesem Arbeitsschritt bei 100 Euro."],
          ["Beobachtbare Zusagen sammeln", "Halte fest, welche Preise Kundinnen und Kunden bei bestimmten Warenkörben sehen. Prüfe auch die Einheit und die Rundungsregel. Interne Namen und die Anzahl der Hilfsfunktionen können sich beim Umbau ändern."],
        ],
        check: ["Gehört eine neue Rabattgrenze von 90 Euro zu demselben Refactoring?", "Sie ist eine Änderung am Verhalten und bekommt einen eigenen Arbeitsschritt mit eigenen Erwartungen."],
        source: ["Martin Fowler · Definition of Refactoring", "https://martinfowler.com/bliki/DefinitionOfRefactoring.html"],
      },
      {
        title: "Das bestehende Verhalten mit Tests festhalten",
        intro: "Schreibe vor dem Umbau Tests, die das derzeitige Verhalten an repräsentativen Fällen festhalten. Das gibt dir einen Ausgangspunkt für den Vergleich.",
        sections: [
          ["Fälle um die Grenze wählen", "Ein Warenkorb zu 99,99 Euro bleibt ohne Rabatt. Bei genau 100 Euro kostet er nach dem Rabatt 90 Euro. Mit einem weiteren Warenkorb oberhalb der Grenze prüfst du einen typischen Fall mit Rabatt."],
          ["Begründete Erwartungen festschreiben", "Wenn ein Ergebnis überraschend ist, kläre mit dem Team, ob es zu den bestehenden Regeln gehört. Eine gewünschte Fehlerkorrektur kannst du später gezielt umsetzen. Ein Test hält eine bewusste Erwartung fest und sollte am Preis statt an internen Funktionsaufrufen ansetzen."],
        ],
        example: {
          title: "Beispiele vor dem Umbau",
          columns: ["Warenwert", "Bisheriger Endpreis"],
          rows: [["99,99 Euro", "99,99 Euro"], ["100,00 Euro", "90,00 Euro"], ["120,00 Euro", "108,00 Euro"]],
        },
        check: ["Welcher Test erkennt, wenn im neuen Code versehentlich erst oberhalb von 100 Euro Rabatt gilt?", "Der Test mit genau 100 Euro. Er erwartet einen Endpreis von 90 Euro."],
        source: ["MIT 6.102 · Testing und Regressionstests", "https://web.mit.edu/6.102/www/sp26/classes/02-testing/"],
      },
      {
        title: "Eine Berechnung in kleinen Schritten zerlegen",
        intro: "Ein überschaubarer Umbau lässt sich leichter prüfen. Führe nach jedem sinnvollen Schritt dieselben Tests aus.",
        sections: [
          ["Eine fachliche Teilaufgabe herauslösen", "Benenne zunächst die Zwischensumme klar. Ziehe anschließend das Aufsummieren der Warenpositionen in eine eigene Funktion. Die Preisfunktion kann dann die Summe ermitteln und die Rabattregel darauf anwenden."],
          ["Ergebnis und Reihenfolge kontrollieren", "Achte darauf, mit welchen Beträgen und in welcher Reihenfolge gerechnet wird. Eine ursprünglich einmalige Rundung nach der Berechnung kann andere Preise liefern, wenn sie versehentlich schon pro Position erfolgt. Wenn ein Test fehlschlägt, prüfe zuerst die zuletzt vorgenommene Änderung."],
        ],
        check: ["Welche Schritte helfen dir, wenn das Ergebnis nach dem Umbau abweicht?", "Vergleiche die letzte Änderung mit den Erwartungen des Tests. Korrigiere diesen Schritt und führe die Tests erneut aus."],
        source: ["Martin Fowler · Crossing Refactoring’s Rubicon", "https://martinfowler.com/articles/refactoringRubicon.html"],
      },
      {
        title: "Eine neue Anforderung separat umsetzen",
        intro: "Nach einem geprüften Refactoring kannst du das neu strukturierte Programm gezielt erweitern. Beginne mit einem Test für die gewünschte Änderung.",
        sections: [
          ["Neue Erwartungen ergänzen", "Wenn der Shop künftig ab 90 Euro Rabatt gibt, lege die Erwartungen bei 89,99 und 90 Euro fest. Bei genau 90 Euro sind zehn Prozent Rabatt gleich neun Euro. Das erwartete Ergebnis beträgt dann 81 Euro."],
          ["Bestehende Fälle erneut prüfen", "Die bisherigen Fälle bei 100 und 120 Euro behalten ihre Ergebnisse. So zeigt die Testsammlung, welche Preise sich bewusst ändern und welche Zusagen weiterhin gelten."],
        ],
        check: ["Warum ist ein eigener Schritt für die neue Rabattgrenze hilfreich?", "Du kannst die Verhaltensänderung gezielt testen und sie bei der Prüfung des Codes eindeutig von der Umstrukturierung unterscheiden."],
        source: ["CS2023 · Refactoring and Code Evolution", "https://csed.acm.org/wp-content/uploads/2025/11/CS2023-Report.htm"],
      },
    ],
    practice: {
      title: "Eine gewachsene Warenkorb-Preisberechnung entflechten",
      intro: "Die Preisfunktion eines Shops berechnet Zwischensumme und Rabatt in einem langen Block. Heute gelten zehn Prozent Rabatt ab einschließlich 100 Euro. Das Team will zuerst die Funktion umstrukturieren und danach die Grenze auf 90 Euro senken.",
      comparison: {
        title: "Testergebnisse beim Umbau vergleichen", label: "Prüfstand",
        variants: [
          { label: "Ausgangsverhalten", details: [["99,99 Euro Warenwert", "99,99 Euro Endpreis"], ["100,00 Euro Warenwert", "90,00 Euro Endpreis"], ["120,00 Euro Warenwert", "108,00 Euro Endpreis"]] },
          { label: "Umbau mit falscher Vergleichsgrenze", details: [["99,99 Euro Warenwert", "99,99 Euro Endpreis"], ["100,00 Euro Warenwert", "100,00 Euro Endpreis"], ["120,00 Euro Warenwert", "108,00 Euro Endpreis"]] },
          { label: "Geplante Regel ab 90 Euro", details: [["89,99 Euro Warenwert", "89,99 Euro Endpreis"], ["90,00 Euro Warenwert", "81,00 Euro Endpreis"], ["100,00 Euro Warenwert", "90,00 Euro Endpreis"]] },
        ],
      },
      questions: [
        { prompt: "Was machst du als Erstes?", answer: 0, options: ["Bestehende Ergebnisse mit Tests direkt an und um die Rabattgrenze festhalten.", "Die alte Funktion ersetzen und anschließend die Zielpreise aus dem neuen Code übernehmen."], clue: "Brauchst du einen Vergleichsmaßstab vor oder erst nach dem Umbau?", explanation: "Die Tests halten das Ausgangsverhalten fest und können unbeabsichtigte Abweichungen beim Umbau zeigen." },
        { prompt: "Welcher Test schlägt beim Umbau mit falscher Vergleichsgrenze fehl?", answer: 1, options: ["Der Test mit 120,00 Euro Warenwert erwartet 108,00 Euro.", "Der Test mit 100,00 Euro Warenwert erwartet 90,00 Euro."], clue: "Vergleiche das Ergebnis genau an der bisherigen Rabattgrenze.", explanation: "Bei genau 100 Euro muss die alte Regel bereits greifen. Der fehlerhafte Umbau liefert dafür den Preis ohne Rabatt." },
        { prompt: "Welcher Schritt ist eine geeignete kleine Umstrukturierung?", answer: 0, options: ["Die Summenbildung herauslösen und danach dieselben Tests ausführen.", "Die Summenbildung herauslösen und im selben Schritt die Rabattgrenze senken."], clue: "Eine einzelne Strukturänderung lässt sich mit den bestehenden Erwartungen überprüfen.", explanation: "Die Summenbildung ist eine fachliche Teilaufgabe. Der bisherige Preis bleibt nach diesem Schritt gleich." },
        { prompt: "Welchen Grenztest ergänzt du für die neue Rabattregel?", answer: 1, options: ["Bei 90,00 Euro bleibt der Endpreis bei 90,00 Euro.", "Bei 90,00 Euro sinkt der Endpreis auf 81,00 Euro."], clue: "Die neue Grenze gilt einschließlich 90 Euro und der Rabatt beträgt zehn Prozent.", explanation: "Genau an der neuen Grenze zieht der Shop neun Euro ab." },
      ],
      summary: "Du hast die Berechnung schrittweise vereinfacht, eine Abweichung an der Grenze erkannt und die neue Rabattregel als eigenen Schritt geplant.",
    },
  },
  {
    id: "zustaende-modellieren", topic: "softwaredesign", title: "Fachliche Zustände modellieren",
    description: "Beschreibe den Lebenszyklus einer Rücksendung und lege fest, welche Aktionen in welchem Zustand möglich sind.",
    lessons: [
      {
        title: "Zustände und Ereignisse unterscheiden",
        intro: "Ein Zustand beschreibt, wo sich ein Vorgang gerade befindet. Ein Ereignis bezeichnet etwas, das passiert und den Zustand ändern kann.",
        sections: [
          ["Den Lebenszyklus aus dem Ablauf ableiten", "In der Übung beginnt eine Rücksendung im Zustand Beantragt. Der Shop kann sie freigeben oder ablehnen. Nach der Freigabe prüft das Lager die eingegangene Ware. Erst danach kann der Vorgang abgeschlossen werden."],
          ["Zustände mit fachlichem Nutzen wählen", "Beantragt und Freigegeben brauchen getrennte Zustände, weil jeweils andere Aktionen erlaubt sind. Den Namen der Person, die geprüft hat, kannst du als zusätzliche Information speichern."],
        ],
        check: ["Ist „Lager bestätigt die Prüfung“ ein Zustand oder ein Ereignis?", "Es ist ein Ereignis. Geprüft ist der Zustand, den die Rücksendung danach erreicht."],
        source: ["W3C · SCXML, States and Events", "https://www.w3.org/TR/scxml/"],
      },
      {
        title: "Erlaubte Übergänge festlegen",
        intro: "Ein Übergang verbindet einen Ausgangszustand mit einem neuen Zustand. In diesem Ablauf wird er durch ein Ereignis ausgelöst und kann weitere Bedingungen voraussetzen.",
        sections: [
          ["Den zulässigen Weg aufschreiben", "Freigeben ist in Beantragt erlaubt, wenn der Antrag nach der internen Fristregel der Übung zulässig ist. Das Team kann den Antrag auch ablehnen. Eine Lagerprüfung ist nach der Freigabe möglich. Abschließen verlangt den Zustand Geprüft."],
          ["Abgelehnte Aktionen erklären", "Wenn jemand eine beantragte Rücksendung abschließen will, bleibt ihr Zustand Beantragt. Eine verständliche Rückmeldung nennt die noch fehlende Prüfung oder den erforderlichen nächsten Schritt."],
        ],
        example: {
          title: "Übergänge im Rücksendeprozess",
          columns: ["Ausgang und Ereignis", "Ergebnis"],
          rows: [["Beantragt · fristgerecht freigeben", "Freigegeben"], ["Beantragt · ablehnen", "Abgelehnt"], ["Freigegeben · Prüfung bestätigen", "Geprüft"], ["Geprüft · abschließen", "Abgeschlossen"], ["Beantragt · abschließen", "Beantragt, Aktion abgelehnt"]],
        },
        check: ["Was brauchst du außer der Aktion „freigeben“, um den nächsten Zustand zu bestimmen?", "Den Ausgangszustand und die Information, ob die Freigabebedingung erfüllt ist."],
        source: ["W3C · SCXML, Transitions and Conditions", "https://www.w3.org/TR/scxml/"],
      },
      {
        title: "Zustandswechsel und ihre Wirkung zusammen prüfen",
        intro: "Ein Zustandswechsel kann sichtbare Folgen haben. Beim Abschluss einer Rücksendung soll der Shop einmal eine Bestätigung erzeugen.",
        sections: [
          ["Entscheidung an einer Stelle treffen", "Die Bestelloberfläche kann den Abschlussknopf passend zum Zustand anzeigen. Die Regel prüft trotzdem die Funktion, die den Rücksendevorgang ändert. Damit gilt sie auch für andere Aufrufer wie einen Lager-Scanner."],
          ["Wiederholte Ereignisse berücksichtigen", "Eine Bestätigung kann nach einem Netzwerkfehler erneut eintreffen. Für diesen Prozess gilt, dass das bereits ausgeführte Abschlussereignis den Zustand Abgeschlossen beibehält und keine zweite Bestätigung erzeugt."],
        ],
        check: ["Was prüfst du bei einem wiederholten Abschluss außer dem Zustand?", "Prüfe, ob die Bestätigung insgesamt nur einmal erzeugt wurde."],
        source: ["AWS Builders’ Library · Making retries safe with idempotent APIs", "https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/"],
      },
      {
        title: "Gute Tests für den Lebenszyklus auswählen",
        intro: "Wähle Tests für erfolgreiche Übergänge, gesperrte Aktionen und Wiederholungen. Nutze Zustand und sichtbare Folgen als Prüfergebnis.",
        sections: [
          ["Erfolg und Fehler nebeneinander testen", "Starte für einen Test in Geprüft und schließe ab. Starte für einen zweiten Test in Freigegeben und versuche ebenfalls abzuschließen. Im zweiten Fall fehlt die Prüfung, und der Vorgang bleibt Freigegeben."],
          ["Das Ende des Vorgangs prüfen", "Führe nach einem erfolgreichen Abschluss dasselbe Ereignis erneut aus. Der Zustand bleibt gleich und die Anwendung erzeugt keine zweite Bestätigung. Damit prüfst du eine andere Fehlerquelle als beim verfrühten Abschluss."],
        ],
        check: ["Warum ist ein Test nur für den vollständigen Erfolgsweg zu wenig?", "Er zeigt, dass der normale Ablauf funktioniert. Verfrühte Aktionen und Wiederholungen haben eigene Regeln, die zusätzliche Tests sichtbar machen."],
        source: ["MIT 6.102 · Testing und Fallauswahl", "https://web.mit.edu/6.102/www/sp26/classes/02-testing/"],
      },
    ],
    practice: {
      title: "Eine Rücksendung bis zum Abschluss verfolgen",
      intro: "Lege für den Shop fest, was bei Freigabe, Ablehnung, Lagerprüfung und Abschluss passiert. Die Anwendung soll eine Rücksendung erst nach der Prüfung abschließen und ihre Bestätigung genau einmal erzeugen.",
      comparison: {
        title: "Was passiert bei verschiedenen Ereignissen?", label: "Aktion im Rücksendeprozess",
        variants: [
          { label: "Beantragt · fristgerecht freigeben", details: [["Startzustand", "Beantragt"], ["Folgezustand", "Freigegeben"], ["Wirkung", "Das Lager kann den Eingang prüfen"]] },
          { label: "Beantragt · ablehnen", details: [["Startzustand", "Beantragt"], ["Folgezustand", "Abgelehnt"], ["Wirkung", "Der Antrag endet ohne Lagerprüfung"]] },
          { label: "Freigegeben · vorzeitig abschließen", details: [["Startzustand", "Freigegeben"], ["Folgezustand", "Freigegeben"], ["Wirkung", "Abschluss abgelehnt, Lagerprüfung fehlt"]] },
          { label: "Geprüft · abschließen", details: [["Startzustand", "Geprüft"], ["Folgezustand", "Abgeschlossen"], ["Wirkung", "Eine Bestätigung wird erzeugt"]] },
          { label: "Abgeschlossen · Abschluss wiederholen", details: [["Startzustand", "Abgeschlossen"], ["Folgezustand", "Abgeschlossen"], ["Wirkung", "Die vorhandene Bestätigung bleibt die einzige"]] },
        ],
      },
      questions: [
        { prompt: "Was ist im Modell ein Zustand?", answer: 1, options: ["Lager bestätigt die Prüfung.", "Geprüft."], clue: "Ein Zustand gilt über einen Zeitraum. Ein Ereignis passiert zu einem Zeitpunkt.", explanation: "Geprüft beschreibt die Phase nach dem Prüfergebnis." },
        { prompt: "Wie reagiert der Shop auf einen Abschluss im Zustand Freigegeben?", answer: 0, options: ["Er lehnt die Aktion ab und lässt den Zustand bei Freigegeben.", "Er springt zur Vereinfachung direkt nach Abgeschlossen."], clue: "Der Abschluss setzt eine bestätigte Lagerprüfung voraus.", explanation: "Der gesperrte Übergang schützt den fachlich vorgeschriebenen Ablauf." },
        { prompt: "Wo sollte die Regel für den Abschluss geprüft werden?", answer: 1, options: ["Ausschließlich beim Anzeigen des Knopfes in der Weboberfläche.", "In der Funktion, die den Rücksendevorgang für alle Aufrufer ändert."], clue: "Auch der Lager-Scanner kann die Funktion aufrufen.", explanation: "Die zentrale Regel gilt für alle Wege, über die der Vorgang geändert werden kann." },
        { prompt: "Was überprüfst du nach zwei Zustellungen desselben Abschlussereignisses?", answer: 0, options: ["Der Vorgang ist abgeschlossen und es gibt insgesamt eine Bestätigung.", "Beide Aufrufe hatten eine Antwort, der Bestand der Bestätigungen ist unerheblich."], clue: "Der Zustand allein zeigt eine doppelte Bestätigung nicht an.", explanation: "Der Test erfasst den Zustand und die einmalige sichtbare Wirkung." },
      ],
      summary: "Dein Zustandsmodell hält den Ablauf nachvollziehbar. Die Tests prüfen erlaubte und gesperrte Übergänge sowie die Wirkung einer Wiederholung.",
    },
  },
  {
    id: "datentypen-entwerfen", topic: "softwaredesign", title: "Abstrakte Datentypen entwerfen",
    description: "Definiere eine Warteliste über ihre Operationen und tausche ihre Speicherung aus, ohne die Bedienung zu ändern.",
    lessons: [
      {
        title: "Einen Datentyp über seine Operationen beschreiben",
        intro: "Ein abstrakter Datentyp beschreibt Werte und die Operationen, die mit ihnen arbeiten. Aufrufe richten sich nach diesem Vertrag.",
        sections: [
          ["An den Ablauf der Beratung denken", "Im Beratungszentrum werden Tickets in der Reihenfolge ihrer Ankunft aufgerufen. Die Warteliste bietet einreihen, werIstDran und entnehmen an. Ein neues Ticket wird hinten angefügt. Entnehmen nimmt das vorderste Ticket heraus."],
          ["Auch den leeren Zustand festlegen", "Bei leerer Warteliste melden werIstDran und entnehmen LEER. WerIstDran zeigt das erste Ticket, ohne die Liste zu verändern. Entnehmen liefert das erste Ticket und entfernt es."],
        ],
        check: ["Was liefert werIstDran bei den Tickets A und B, und wie sieht die Liste danach aus?", "Es liefert A. Die Reihenfolge A, B bleibt erhalten."],
        source: ["MIT 6.102 · Abstract Data Types", "https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/"],
      },
      {
        title: "Lesende und verändernde Operationen trennen",
        intro: "Ein Aufrufer sollte wissen, ob eine Operation nur Informationen liefert oder den Zustand verändert. Gute Namen und klare Zusagen machen das sichtbar.",
        sections: [
          ["Die Wirkung jeder Operation festlegen", "Das Wartezimmer-Display fragt werIstDran ab. Ein Mitarbeitender verwendet entnehmen, sobald die Beratung beginnt. Beide Aufrufe können dieselbe Ticket-ID liefern, wirken aber unterschiedlich auf die Warteliste."],
          ["Interne Daten schützen", "Gib der Anzeige eine Ticket-ID oder eine separate Kopie der gewünschten Informationen. Wenn sie die interne Liste direkt ändern kann, könnte sie die Reihenfolge umsortieren und damit die Zusagen der Warteliste verletzen."],
        ],
        example: {
          title: "Zwei Aufrufe bei derselben Startreihenfolge A, B",
          columns: ["Aufruf", "Ergebnis und Liste danach"],
          rows: [["werIstDran", "A · Liste bleibt A, B"], ["entnehmen", "A · Liste enthält danach B"]],
        },
        check: ["Welche Operation darf eine Anzeige regelmäßig aufrufen, ohne Tickets zu entfernen?", "WerIstDran. Sie beobachtet den nächsten Platz und lässt die Warteliste unverändert."],
        source: ["MIT 6.102 · Abstract Data Types, Classifying Types and Operations", "https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/"],
      },
      {
        title: "Dieselbe Warteliste unterschiedlich speichern",
        intro: "Bei Repräsentationsunabhängigkeit darfst du die interne Speicherung wechseln. Die zugesicherte Bedeutung der Operationen bleibt dabei erhalten.",
        sections: [
          ["Zwei Speicherformen vergleichen", "Eine Implementierung hält die Tickets in einer Liste und entfernt deren erstes Element. Eine andere verwendet Speicherplätze, die sie der Reihe nach belegt und nach dem letzten Platz wieder vom Anfang aus nutzt. Das heißt Ringpuffer. In beiden Fällen werden Tickets in ihrer Ankunftsreihenfolge aufgerufen."],
          ["Den internen Zustand prüfen", "Beim Ringpuffer muss die gespeicherte Anzahl zu den wartenden Tickets passen und die Position des ersten Tickets gültig sein. Solche Regeln über zulässige interne Zustände heißen Repräsentationsinvarianten."],
        ],
        check: ["Muss das Wartezimmer-Display wissen, wo A im Ringpuffer liegt?", "Die Anzeige braucht nur die Zusage von werIstDran. Die Position im Speicher wird innerhalb der Warteliste verwaltet."],
        source: ["MIT 6.102 · Abstraction Functions & Rep Invariants", "https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/"],
      },
      {
        title: "Beide Speicherformen mit denselben Tests prüfen",
        intro: "Testfälle für den abstrakten Datentyp verwenden seine öffentlichen Operationen. So kannst du sie für mehrere Implementierungen ausführen.",
        sections: [
          ["Eine Folge von Aufrufen testen", "Reihe A und B ein. WerIstDran liefert A, und das erste Entnehmen liefert ebenfalls A. Danach liefert werIstDran B. Entnimm auch B und prüfe, dass ein weiterer Aufruf LEER meldet."],
          ["Die Beispiele auf Speichergrenzen erweitern", "Wiederhole das Einreihen und Entnehmen so lange, dass der Ringpuffer zum Anfang seines Speicherbereichs zurückkehrt. Beide Implementierungen müssen weiterhin dieselben Ergebnisse liefern. Zusätzliche interne Tests können die Invarianten des Ringpuffers prüfen."],
        ],
        check: ["Was wäre ein Fehler, den derselbe Test für Liste und Ringpuffer erkennt?", "Wenn die zuletzt eingereihte Person zuerst entnommen wird, verletzt das die zugesicherte Ankunftsreihenfolge."],
        source: ["MIT 6.102 · Testing an Abstract Data Type", "https://web.mit.edu/6.102/www/sp26/classes/06-abstract-data-types/"],
      },
      {
        title: "Den internen Speicherzustand in eine Warteliste übersetzen",
        intro: "Du hast denselben Vorgang am Schalter und im Speicher gesehen. Die Regel, die aus dem Speicherzustand die sichtbare Warteliste macht, heißt Abstraktionsfunktion.",
        sections: [
          ["Vom Start aus lesen", "Vor dem Aufruf waren Start 3 und Anzahl 2. Du liest Platz 3 und danach Platz 0. Am Schalter ergibt das A, B. Beim Ansehen bleiben beide Zahlen gleich. Beim Aufrufen von A springt der Start auf 0 und die Anzahl sinkt auf 1."],
          ["Hinten einreihen", "Nach A wartet B an Platz 0. Ein belegter Platz ab dem Start führt zu Platz 1. Dort landet C. Die Anzahl steigt wieder auf 2, sodass die Abstraktionsfunktion jetzt B, C liefert. Sie liest genau die angegebene Anzahl ab dem Start."],
        ],
        check: ["Angenommen, der Start steht auf Platz 2 und drei Tickets warten. Auf welchen Plätzen liest du sie vom ersten bis zum letzten?", "Auf Platz 2, dann 3 und dann 0. Die Abstraktionsfunktion liest drei Einträge und springt nach Platz 3 zum Anfang des Rings."],
        source: ["MIT 6.102 · Abstraction Functions & Rep Invariants", "https://web.mit.edu/6.102/www/sp26/classes/07-abstraction-functions-rep-invariants/"],
      },
    ],
    practice: {
      title: "Die Speicherung einer Beratungswarteliste austauschen",
      intro: "Das Beratungszentrum ersetzt die intern verwendete Liste durch einen Ringpuffer. Die Anzeige und der Aufruf am Schalter sollen dieselben Operationen und Ergebnisse verwenden können. Prüfe den Ablauf mit zwei Tickets und mit leerer Warteliste.",
      comparison: {
        title: "Speicherformen mit derselben Aufruffolge prüfen", label: "Implementierung",
        variants: [
          { label: "Liste", details: [["Aufrufe", "A und B einreihen, erstes Ticket ansehen, dann entnehmen"], ["Ergebnisse", "Ansehen liefert A, Entnehmen liefert A"], ["Liste danach", "B wartet"]] },
          { label: "Ringpuffer", details: [["Aufrufe", "A und B einreihen, erstes Ticket ansehen, dann entnehmen"], ["Ergebnisse", "Ansehen liefert A, Entnehmen liefert A"], ["Liste danach", "B wartet"]] },
          { label: "Fehlerhafter Umbau", details: [["Aufrufe", "A und B einreihen, erstes Ticket ansehen, dann entnehmen"], ["Ergebnisse", "Ansehen liefert B, Entnehmen liefert B"], ["Liste danach", "A wartet"]] },
        ],
      },
      questions: [
        { prompt: "Welche Zusage muss jede Speicherform erfüllen?", answer: 0, options: ["Das zuerst eingereihte wartende Ticket wird zuerst entnommen.", "Das zuletzt eingereihte Ticket liegt im ersten Feld des internen Speichers."], clue: "Orientiere dich am sichtbaren Ablauf und seiner Ankunftsreihenfolge.", explanation: "Die Reihenfolge ist Teil des Vertrags. Interne Speicherpositionen sind veränderlich." },
        { prompt: "Welche Operation verwendet das Display?", answer: 1, options: ["Entnehmen, damit das Ticket sichtbar wird.", "WerIstDran, damit das Ticket sichtbar wird und weiter wartet."], clue: "Die Anzeige darf die Warteliste beim regelmäßigen Aktualisieren nicht leeren.", explanation: "WerIstDran ist eine lesende Operation." },
        { prompt: "Was soll entnehmen nach dem letzten Ticket zurückgeben?", answer: 0, options: ["LEER, wenn keine weiteren Tickets warten.", "Die zuletzt entnommene Ticket-ID erneut."], clue: "Für die leere Warteliste gibt es eine eigene Zusage im Vertrag.", explanation: "LEER signalisiert, dass aktuell niemand auf den Aufruf wartet." },
        { prompt: "Welche Tests kannst du für beide Implementierungen gleich verwenden?", answer: 1, options: ["Tests, welche internen Speicherpositionen tatsächlich verwendet werden.", "Eine Folge öffentlicher Aufrufe mit erwarteten Ticket-IDs und erwarteter Restreihenfolge."], clue: "Die Tests sollen den Vertrag trotz unterschiedlicher Speicherung prüfen.", explanation: "Die öffentlichen Operationen bilden die gemeinsame Prüffläche beider Implementierungen." },
        { prompt: "Ein Ring mit vier Plätzen beginnt bei Position 3 und enthält zwei Tickets. An Position 3 steht A, an Position 0 steht B. Was liest die Anzeige?", answer: 0, options: ["A. Die Warteliste lautet A, B.", "B. Die Warteliste lautet B, A."], clue: "Für das erste Ticket zählt die Startposition und für das zweite der nächste Platz im Ring.", explanation: "Die Startposition 3 enthält A. Nach dem letzten Platz beginnt der Ring wieder bei Position 0 mit B." },
      ],
      summary: "Du hast die Warteliste über ihre Operationen beschrieben und beide Speicherformen mit denselben Erwartungen verglichen.",
    },
  },
  {
    id: "schnittstellen-weiterentwickeln", topic: "softwaredesign", title: "Schnittstellen kompatibel weiterentwickeln",
    description: "Erweitere eine Bibliotheks-API so, dass bereits installierte Apps weiterhin mit ihr arbeiten können.",
    lessons: [
      {
        title: "Den Vertrag aus Sicht bestehender Aufrufer lesen",
        intro: "Rückwärtskompatibilität bedeutet hier, dass eine bereits installierte App den aktualisierten Server weiterhin wie vereinbart verwenden kann.",
        sections: [
          ["Aufruf und Antwort festhalten", "Die Bibliotheks-App ruft die Bücherliste mit GET /v1/buecher ab. Sie erwartet auch ausgeliehene Titel und verwendet die Felder titel und verfuegbar. Ältere App-Versionen bleiben nach der Serveränderung noch im Einsatz."],
          ["Bedeutung mitprüfen", "Die Felder können gleich aussehen, obwohl sich die Antwort inhaltlich ändert. Wenn die API plötzlich standardmäßig ausgeliehene Bücher ausblendet, fehlt der alten App ein zugesicherter Teil der Liste."],
        ],
        check: ["Warum reicht es für Kompatibilität nicht aus, wenn der alte Aufruf weiterhin erfolgreich antwortet?", "Die Antwort muss auch die bisher zugesicherten Informationen und deren Bedeutung erhalten."],
        source: ["Google API Improvement Proposals · AIP-180 Backwards Compatibility", "https://google.aip.dev/180"],
      },
      {
        title: "Neue Funktionen mit unverändertem Standard ergänzen",
        intro: "Ein optionaler Parameter kann eine zusätzliche Funktion zugänglich machen. Prüfe, welches Verhalten ein bereits vorhandener Aufruf ohne den neuen Parameter bekommt.",
        sections: [
          ["Den Filter ausdrücklich einschalten", "Eine neue App-Version kann nurVerfuegbar=true senden. Damit bekommt sie nur verfügbare Titel. Ohne den Parameter und mit false liefert die API wie bisher die vollständige Liste."],
          ["Änderungen an Antworten mitprüfen", "Zusätzliche Antwortfelder funktionieren mit Aufrufern, die unbekannte Felder ignorieren. Manche Programme prüfen Antworten strenger. Deshalb lohnt sich ein Test mit den tatsächlich unterstützten App-Versionen."],
        ],
        example: {
          title: "Die neue API mit alten und neuen Aufrufen",
          columns: ["Aufruf", "Ergebnis"],
          rows: [["GET /v1/buecher", "Verfügbare und ausgeliehene Titel"], ["GET /v1/buecher?nurVerfuegbar=false", "Verfügbare und ausgeliehene Titel"], ["GET /v1/buecher?nurVerfuegbar=true", "Nur verfügbare Titel"]],
        },
        check: ["Welcher Standard passt für eine alte App, die den Filter noch nicht kennt?", "Der Filter bleibt aus. Die alte App bekommt weiterhin die vollständige Liste."],
        source: ["Google API Improvement Proposals · AIP-180, Adding Components", "https://google.aip.dev/180#adding-components"],
      },
      {
        title: "Inkompatible Änderungen mit Versionsgrenzen planen",
        intro: "Eine neue Hauptversion kann eine Änderung aufnehmen, die Aufrufer bewusst übernehmen müssen. Lege vorher fest, wie die bisherige Version weiter verfügbar bleibt.",
        sections: [
          ["Vertragsbrüche erkennen", "Das Feld verfuegbar aus der Antwort zu entfernen oder den Filter für alle Aufrufe dauerhaft einzuschalten, ändert den bisherigen Vertrag. Wenn die Bibliothek das neue Verhalten für eine weitere Version will, kann sie es getrennt unter /v2/buecher anbieten."],
          ["Die Umstellung vorbereiten", "Beschreibe die Änderung, veröffentliche die neue Variante und gib den unterstützten Aufrufern Zeit zum Wechsel. Halte fest, wie lange die bisherige Version angeboten wird."],
        ],
        check: ["Was passiert mit dem alten Aufruf während der Umstellung auf eine neue Hauptversion?", "Er spricht während der vereinbarten Übergangszeit weiter die bisherige API-Version mit ihrem bisherigen Vertrag an."],
        source: ["Google API Improvement Proposals · AIP-185 API Versioning", "https://google.aip.dev/185"],
      },
      {
        title: "Alte und neue Aufrufe im Test vergleichen",
        intro: "Sichere den bisherigen Vertrag und die neue Funktion mit getrennten Fällen ab. Verwende Testdaten, an denen der Unterschied sichtbar wird.",
        sections: [
          ["Einen aussagekräftigen Bestand wählen", "Lege mindestens einen verfügbaren und einen ausgeliehenen Titel an. Prüfe, dass der alte Aufruf beide Titel sieht und die vertrauten Felder erhält. Rufe anschließend den neuen Filter auf und erwarte nur den verfügbaren Titel."],
          ["Die Auslieferung absichern", "Stelle zuerst den Server mit der kompatiblen Erweiterung bereit. Ein Test mit der alten App zeigt, ob sie weiterhin damit arbeitet. Die neue App kann den Filter verwenden, sobald die Serverfunktion verfügbar ist."],
        ],
        check: ["Warum reicht für diese Tests ein Bestand mit ausschließlich verfügbaren Büchern nicht aus?", "Beide Aufrufe könnten dieselben Titel liefern. Ein ausgeliehener Titel macht sichtbar, ob der Filter nur beim gewünschten Aufruf greift."],
        source: ["MIT 6.102 · Testing und Regressionstests", "https://web.mit.edu/6.102/www/sp26/classes/02-testing/"],
      },
    ],
    practice: {
      title: "Die Bibliotheks-API um einen Filter erweitern",
      intro: "Der Testbestand enthält einen verfügbaren Atlas und einen ausgeliehenen Roman. Die neue App soll gezielt nur verfügbare Titel laden können. Die alte App muss in ihrer bisherigen Bücherliste weiter beide Titel sehen.",
      comparison: {
        title: "Antworten für alte und neue Apps vergleichen", label: "Aufruf im Testbestand",
        variants: [
          { label: "Alte App ohne Filter", details: [["Anfrage", "GET /v1/buecher"], ["Antwort", "Atlas und Roman"], ["Wirkung", "Die vollständige Liste bleibt sichtbar"]] },
          { label: "Neue App mit Filter", details: [["Anfrage", "GET /v1/buecher?nurVerfuegbar=true"], ["Antwort", "Atlas"], ["Wirkung", "Die ausdrücklich angefragte Auswahl ist aktiv"]] },
          { label: "Fehlerhafte neue Voreinstellung", details: [["Anfrage", "GET /v1/buecher"], ["Antwort", "Atlas"], ["Wirkung", "Der Roman fehlt auch in der bisherigen Bücherliste"]] },
        ],
      },
      questions: [
        { prompt: "Wie ergänzst du den Filter kompatibel?", answer: 1, options: ["Der neue Filter muss bei jedem Aufruf mitgesendet werden.", "Der Filter ist optional und bleibt beim alten Aufruf aus."], clue: "Die alte App kann den neuen Parameter noch nicht übergeben.", explanation: "Der bisherige Aufruf behält seine Eingaben und seine vollständige Antwort." },
        { prompt: "Welcher Serverwechsel würde den alten Vertrag brechen?", answer: 0, options: ["Der Server blendet den ausgeliehenen Roman auch bei einem Aufruf ohne Filter aus.", "Bei ausdrücklich eingeschaltetem Filter wird der ausgeliehene Roman weggelassen."], clue: "Achte darauf, welche Antwort der alte Aufruf ohne den neuen Parameter erwarten darf.", explanation: "Der Aufruf funktioniert technisch weiter, aber die bisherige Bedeutung der Liste geht verloren." },
        { prompt: "Welches Testpaar weist die gewünschte Änderung nach?", answer: 1, options: ["Zweimal die neue App aufrufen und nur den Erfolgsstatus prüfen.", "Ohne Filter beide Titel erwarten und mit eingeschaltetem Filter nur den Atlas erwarten."], clue: "Der Test soll die neue Funktion und den alten Aufruf getrennt absichern.", explanation: "Atlas und Roman unterscheiden die erwarteten Antworten der beiden Aufrufe." },
        { prompt: "Wie kannst du später einen dauerhaft anderen Standard anbieten?", answer: 0, options: ["Eine neue Hauptversion mit eigener Vereinbarung anbieten und die Umstellung der alten Apps planen.", "Die bestehende Version umstellen, sobald die erste neue App-Version veröffentlicht ist."], clue: "Ältere installierte Apps erreichen auch nach der Veröffentlichung weiterhin die bisherige Version.", explanation: "Die Versionsgrenze gibt den Aufrufern eine bewusste Wahl und Zeit für die Umstellung." },
      ],
      summary: "Du hast die Bücherliste kompatibel erweitert, die beiden Aufruferwartungen getrennt geprüft und einen Weg für spätere Vertragsänderungen geplant.",
    },
  },
  {
    id: "fachbegriffe-modellieren", topic: "softwaredesign", title: "Fachliche Begriffe im Code modellieren",
    description: "Unterscheide Bestellungen mit eigener Identität von Werten wie Geldbeträgen und Lieferadressen.",
    lessons: [
      {
        title: "Begriffe und Regeln des Bestellvorgangs sammeln",
        intro: "Ein fachliches Modell beschreibt die Dinge, mit denen der Shop arbeitet, und die Regeln, die für sie gelten. Beginne mit Beispielen aus dem Arbeitsablauf.",
        sections: [
          ["Die Sprache des Shops verwenden", "Der Shop spricht von Bestellungen, Bestellpositionen und Lieferadressen. Eine Position enthält ein Produkt, seine Menge und den vereinbarten Einzelpreis. Verwende diese Begriffe auch im Code und in Tests."],
          ["Eine Regel dem passenden Begriff zuordnen", "Im Übungsfall braucht eine bestätigte Bestellung mindestens eine Position und eine Lieferadresse. Die Bestätigung ist eine fachliche Operation der Bestellung. Sie prüft die Bedingungen und ändert erst dann den Status."],
        ],
        check: ["Wo kannst du nachvollziehbar festlegen, wann der Shop eine Bestellung bestätigen darf?", "Bei der Operation zur Bestätigung der Bestellung. Dort können die Bedingungen für alle Aufrufer gelten."],
        source: ["Martin Fowler · Domain Model", "https://martinfowler.com/eaaCatalog/domainModel.html"],
      },
      {
        title: "Eine Bestellung über ihre Identität verfolgen",
        intro: "Eine Entität hat eine Identität, die über Änderungen hinweg erhalten bleibt. Im Shop dient eine eindeutige Bestellnummer dazu, dieselbe Bestellung wiederzufinden.",
        sections: [
          ["Dieselbe Bestellung wiedererkennen", "Die Bestellung B-17 kann mehrere Zustände durchlaufen. Der Wechsel von Offen zu Bestätigt ändert ihre Daten, während ihre Identität B-17 erhalten bleibt."],
          ["Gleiche Inhalte auseinanderhalten", "Zwei Kundinnen können dieselben Produkte zum selben Preis bestellen. Der Shop erfasst sie mit eigenen Bestellnummern. So kann er jede Bestellung getrennt bezahlen, versenden oder erstatten."],
        ],
        check: ["Sind B-17 und B-18 dieselbe Bestellung, wenn ihre Positionen übereinstimmen?", "Sie sind getrennte Bestellungen. Die Bestellnummer zeigt an, welchen Vorgang du verfolgst."],
        source: ["Microsoft Learn · The Domain Entity Pattern", "https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/microservice-domain-model#the-domain-entity-pattern"],
      },
      {
        title: "Geldbeträge als Werte abbilden",
        intro: "Ein Wertobjekt wird durch seine fachlich relevanten Bestandteile beschrieben. Bei einem Geldbetrag gehören Betrag und Währung zusammen.",
        sections: [
          ["Gleichheit mit allen relevanten Feldern prüfen", "Zwei Werte mit 1299 Cent und EUR beschreiben denselben Betrag. Ein Wert mit der Zahl 1299 und der Währung USD beschreibt einen anderen Geldbetrag. Der Code prüft bei der Gleichheit beide Bestandteile."],
          ["Rechenregeln an einer Stelle verwalten", "Ein Geldtyp kann Addition für Beträge derselben Währung anbieten und bei einer anderen Währung einen Fehler liefern. Wenn eine Umrechnung vorgesehen ist, braucht sie einen ausdrücklich festgelegten Wechselkurs und eine Rundungsregel."],
        ],
        example: {
          title: "Was Gleichheit in diesem Modell bedeutet",
          columns: ["Vergleich", "Ergebnis"],
          rows: [["B-17 offen und B-17 bestätigt", "Dieselbe Bestellung mit geändertem Status"], ["B-17 und B-18 mit identischen Positionen", "Zwei unterschiedliche Bestellungen"], ["1299 Cent EUR und 1299 Cent EUR", "Derselbe Geldwert"], ["1299 Cent EUR und 1299 Cent USD", "Verschiedene Geldwerte"]],
        },
        check: ["Was überprüfst du vor dem Addieren zweier Geldbeträge?", "Prüfe die Währungen. Für verschiedene Währungen braucht der Aufrufer eine ausdrückliche Umrechnung."],
        source: ["Martin Fowler · Money", "https://martinfowler.com/eaaCatalog/money.html"],
      },
      {
        title: "Die vereinbarte Lieferadresse als Wert festhalten",
        intro: "Ein Wertobjekt kann nach seiner Erstellung unveränderlich bleiben. Für eine neue Adresse legst du dann einen neuen Wert an.",
        sections: [
          ["Die zur Bestellung gehörende Adresse speichern", "Wenn der Shop die Bestellung bestätigt, hält er die vereinbarte Lieferadresse fest. In der Übung speichert die Bestellung diesen Adresswert. Das Kundenprofil kann später einen anderen Adresswert bekommen."],
          ["Eine Änderung bewusst modellieren", "Ein Kunde kann nach der Bestellung umziehen. Eine Profiländerung soll die Adresse einer bestehenden Bestellung in diesem Ablauf nicht verändern. Falls der Shop eine Umleitung unterstützt, braucht sie eine eigene Operation mit eigenen Regeln, etwa zur Versandfreigabe."],
        ],
        check: ["Was passiert nach einer Profiländerung mit der bereits vereinbarten Lieferadresse?", "Die bestätigte Bestellung verweist weiter auf ihren bisherigen Adresswert."],
        source: ["Martin Fowler · Value Object", "https://martinfowler.com/bliki/ValueObject.html"],
      },
    ],
    practice: {
      title: "Bestellung, Geldbetrag und Lieferadresse modellieren",
      intro: "Ein Shop erfasst zwei gleich zusammengestellte Bestellungen. Nach der Bestätigung von B-17 ändert die Kundin ihre Profiladresse. Der Shop soll die vereinbarten Bestelldaten nachvollziehbar halten und Geldbeträge mit Währung behandeln.",
      comparison: {
        title: "Änderungen und Vergleiche im Bestellmodell verfolgen", label: "Fall im Bestellmodell",
        variants: [
          { label: "B-17 wechselt den Status", details: [["Vorher", "B-17 · Offen"], ["Nachher", "B-17 · Bestätigt"], ["Bedeutung", "Dieselbe Bestellung bleibt auffindbar"]] },
          { label: "Die Profiladresse ändert sich", details: [["Neue Profiladresse", "Birkenweg 4"], ["Adresse der bestätigten B-17", "Lindenweg 8"], ["Bedeutung", "Die Bestellung behält ihren vereinbarten Adresswert"]] },
          { label: "Zwei Geldbeträge haben dieselbe Zahl", details: [["Erster Wert", "1299 Cent · EUR"], ["Zweiter Wert", "1299 Cent · USD"], ["Bedeutung", "Die Beträge sind wegen ihrer Währung unterschiedliche Werte"]] },
        ],
      },
      questions: [
        { prompt: "Was macht B-17 nach der Bestätigung zur selben Bestellung?", answer: 0, options: ["Ihre Bestellnummer B-17 bleibt gleich.", "Ihr Zustand bleibt immer Offen."], clue: "Die Bestellung soll auch nach einer Änderung ihres Status wiederauffindbar sein.", explanation: "Die Bestellnummer bezeichnet die Entität über ihren Lebenszyklus hinweg." },
        { prompt: "Welche Felder entscheiden über die Gleichheit eines Geldbetrags?", answer: 1, options: ["Nur die Zahl im kleinsten Währungsbetrag.", "Der Betrag und die Währung."], clue: "Zwei identische Zahlen können unterschiedliche Währungen bezeichnen.", explanation: "Der Geldwert setzt sich aus Betrag und Währung zusammen." },
        { prompt: "Was passiert mit der Adresse von B-17 nach der Änderung im Kundenprofil?", answer: 0, options: ["B-17 behält die bei ihrer Bestätigung vereinbarte Adresse.", "B-17 übernimmt automatisch den neuen Adresswert im Kundenprofil."], clue: "Die Bestellung soll ihre eigenen vereinbarten Daten behalten.", explanation: "Die Bestellung hält einen eigenen unveränderlichen Adresswert fest." },
        { prompt: "Wo gehört die Prüfung hin, dass eine Bestellung vor der Bestätigung eine Position und eine Adresse hat?", answer: 1, options: ["In den Text der Bestätigungs-E-Mail.", "In die fachliche Operation zur Bestätigung der Bestellung."], clue: "Die Regel muss gelten, sobald irgendein Aufrufer die Bestellung bestätigt.", explanation: "Die fachliche Operation entscheidet über einen gültigen Übergang und hält die Regel an einer Stelle." },
      ],
      summary: "Dein Modell hält die Identität der Bestellung stabil und beschreibt Geldbeträge sowie Lieferadressen als fachliche Werte mit eigenen Regeln.",
    },
  },
];
