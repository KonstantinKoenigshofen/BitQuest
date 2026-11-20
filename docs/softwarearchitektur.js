"use strict";

const softwarearchitekturQuests = [
  {
    id: "qualitaet-entwerfen", topic: "softwarearchitektur", title: "Qualitätsziele in Entwürfe übersetzen",
    description: "Entwickle messbare Szenarien und vergleiche Architekturmaßnahmen anhand ihrer Folgen.",
    lessons: [
      {
        title: "Ein überprüfbares Qualitätsszenario formulieren",
        intro: "Verfügbarkeit beschreibt, ob das System seinen Dienst erbringen kann, wenn er gebraucht wird. Eine Anforderung wie „Die Anzeige soll zuverlässig sein“ wird überprüfbar, wenn Auslöser, Betriebsbedingungen, Reaktion und Messgröße feststehen.",
        sections: [
          ["Die sechs Teile eines Szenarios", "Beschreibe die Quelle des Ereignisses, den Auslöser, die Betriebsumgebung, den betroffenen Systemteil, die erwartete Reaktion und eine Messgröße. Eine Abfahrtstafel kann beispielsweise bei einem Ausfall des Fahrplanservers während des Berufsverkehrs weiterhin den zuletzt empfangenen Stand anzeigen."],
          ["Die Grenzen festlegen", "Lege fest, wie lange ein Stand verwendet werden darf und wie lange die Tafel zum Umschalten braucht. Ein Test kann dann den Fahrplanserver abschalten und Zeitgrenze sowie sichtbare Kennzeichnung überprüfen."],
        ],
        check: ["Welcher Zusatz macht „schnell umschalten“ im Test überprüfbar?", "Eine Zeitgrenze ab dem simulierten Ausfall, etwa höchstens zwei Sekunden bis zum Anzeigen des gekennzeichneten letzten Stands."],
        source: ["CMU Software Engineering Institute · Deriving Architectural Tactics", "https://www.sei.cmu.edu/library/deriving-architectural-tactics-a-step-toward-methodical-architectural-design/"],
      },
      {
        title: "Eine Maßnahme und ihre Nebenwirkungen bewerten",
        intro: "Eine Architekturtaktik soll eine bestimmte Reaktion begünstigen. Prüfe sie immer gegen das konkrete Szenario und gegen andere Qualitätsziele.",
        sections: [
          ["Verfügbarkeit durch lokale Daten", "Eine Abfahrtstafel kann einen Zeitstempel und den letzten empfangenen Stand lokal speichern. So hängt jede Anzeige während einer Störung weniger vom Netz ab. Das Speichern allein sagt allerdings nichts über die Aktualität des Stands aus."],
          ["Den Zielkonflikt sichtbar machen", "Mit zunehmendem Alter sinkt die Verlässlichkeit der geschätzten Abfahrtszeiten. Eine Altersgrenze und ein sichtbarer Hinweis begrenzen diese Folge. Ob das System in zwei Sekunden umschaltet, muss ein Störungstest zeigen."],
        ],
        check: ["Welche Qualitätsgröße kann bei längerer Nutzung des letzten Stands schlechter werden?", "Die Aktualität der Information. Ein verfügbarer Bildschirm kann inzwischen überholte Abfahrten anzeigen."],
        source: ["CMU Software Engineering Institute · Fundamental Contributors to Software Architecture Quality", "https://www.sei.cmu.edu/library/illuminating-the-fundamental-contributors-to-software-architecture-quality/"],
      },
      {
        title: "Regeln für den Ausfall festlegen",
        intro: "Beschreibe, was die Tafel in jeder Lage zeigt. Das hilft beim Entwurf und macht sichtbar, welche Ausfälle du noch berücksichtigen musst.",
        sections: [
          ["Den Datenstand beim Empfang festhalten", "Speichere die Zeit des letzten gültigen Datenstands. Wenn die Verbindung abbricht, berechne das Alter ab diesem Zeitpunkt. Waren die Daten beim Abbruch bereits vier Minuten alt, bleibt noch eine Minute bis zum Wechsel zum Störungshinweis."],
          ["Den Neustart mitdenken", "Startet die Tafel ohne Verbindung und ohne einen gespeicherten Stand, zeigt sie direkt den Störungshinweis. Beim Wiederverbinden schaltet sie auf die Live-Anzeige um, sobald sie einen gültigen neuen Datenstand empfangen hat."],
        ],
        example: {
          title: "Anzeige bei verschiedenen Betriebszuständen",
          columns: ["Lage", "Was auf der Tafel erscheint"],
          rows: [["Neuer gültiger Datenstand empfangen", "Aktuelle Abfahrten"], ["Verbindung unterbrochen, letzter Stand jünger als fünf Minuten", "Letzte Abfahrten mit sichtbarem Zeitstempel"], ["Verbindung unterbrochen, letzter Stand mindestens fünf Minuten alt oder fehlt", "Störungshinweis"]],
        },
        check: ["Die Verbindung fällt um 08:16:30 Uhr aus. Der letzte Stand stammt weiter von 08:12 Uhr. Wie lange darf er noch sichtbar bleiben, und was steht danach auf der Tafel?", "Um 08:16:30 Uhr sind die Daten bereits vier Minuten und dreißig Sekunden alt. Die Tafel darf sie noch dreißig Sekunden mit Zeitstempel zeigen. Um genau 08:17 Uhr steht dort „Störung · Abfahrten unbekannt“. Die Uhr für das Datenalter begann beim Empfang, also um 08:12 Uhr."],
        source: ["CMU Software Engineering Institute · Deriving Architectural Tactics, Verfügbarkeitsszenarien", "https://www.sei.cmu.edu/library/deriving-architectural-tactics-a-step-toward-methodical-architectural-design/"],
      },
      {
        title: "Die Umschaltregeln unter Störungen testen",
        intro: "Grenzwerte aus einem Qualitätsszenario geben vor, was der Test messen muss. Halte die beiden Zeiten für diese Tafel getrennt fest.",
        sections: [
          ["Zwei Uhren beobachten", "Miss vom simulierten Verbindungsabbruch bis zur sichtbaren Reaktion. Sie muss innerhalb von zwei Sekunden erscheinen. Miss getrennt davon das Alter des letzten Datenstands. Sobald dieser fünf Minuten alt ist, soll der Störungshinweis erscheinen."],
          ["Mehrere Ausgangslagen vorbereiten", "Lege einmal einen frischen und einmal einen fast abgelaufenen Stand vor. Prüfe außerdem einen Neustart mit leerem Speicher und die Rückkehr der Verbindung. Trage für jeden Versuch die erwartete Anzeige, die gemessene Zeit und das tatsächliche Ergebnis ein."],
        ],
        check: ["Der gekennzeichnete Stand erscheint nach 1,5 Sekunden, bleibt aber sechs Minuten nach seinem Empfang sichtbar. Was ist das Testergebnis?", "Die Umschaltzeit liegt im Ziel. Die Anzeige überschreitet die Altersgrenze und der gesamte Versuch erfüllt das Szenario daher nicht."],
        source: ["MIT 6.102 · Testing und Grenzfälle", "https://web.mit.edu/6.102/www/sp26/classes/02-testing/"],
      },
    ],
    practice: {
      title: "Abfahrtstafeln bei Netzausfall betreiben",
      intro: "Der Verkehrsbetrieb will während des Berufsverkehrs innerhalb von zwei Sekunden nach einem Verbindungsabbruch ein Ergebnis anzeigen. Fahrplandaten mit weniger als fünf Minuten Alter sind zulässig, wenn ihr Stand sichtbar ist. Ab fünf Minuten und bei leerem Speicher soll die Tafel einen Störungshinweis anzeigen.",
      preview: { limit: 5, max: 8 },
      questions: [
        { prompt: "Welche Maßnahme erfüllt das Ziel im Entwurf am besten?", answer: 1, options: ["Den Fahrplanserver bei jeder Anzeige synchron abfragen und auf Wiederverbindung warten.", "Einen lokalen Stand mit Zeitstempel nutzen, den Stand beim Ausfall kennzeichnen und nach fünf Minuten durch einen Hinweis ersetzen."], clue: "Der Bildschirm braucht während der Störung sowohl Daten als auch eine Regel für deren Alter.", explanation: "Der lokale Stand macht die Anzeige vom ausgefallenen Netz unabhängig. Zeitstempel und Ablaufregel begrenzen die Nutzung alter Daten." },
        { prompt: "Welche Beobachtung aus einem simulierten Test erfüllt beide Vorgaben?", answer: 0, options: ["Der gekennzeichnete Stand erscheint nach 1,4 Sekunden. Bei einem Datenalter von fünf Minuten folgt der Störungshinweis.", "Der gekennzeichnete Stand erscheint nach 0,8 Sekunden. Er bleibt sieben Minuten lang sichtbar.", "Der Störungshinweis folgt nach fünf Minuten. Die erste Anzeige erscheint nach 2,4 Sekunden."], clue: "Prüfe die Umschaltzeit und das maximale Datenalter getrennt.", explanation: "1,4 Sekunden liegen innerhalb der Umschaltfrist. Der Wechsel nach fünf Minuten hält die zweite Grenze ein." },
        { prompt: "Was soll die Tafel nach einem Neustart ohne Verbindung und ohne gespeicherten Stand zeigen?", answer: 1, options: ["Eine leere Liste mit dem Hinweis „Heute keine Abfahrten“.", "Einen Störungshinweis, bis ein gültiger Datenstand vorliegt."], clue: "Fehlende Fahrplandaten sagen nichts darüber aus, ob Busse und Bahnen fahren.", explanation: "Der Hinweis macht sichtbar, dass die Tafel zurzeit keine gültigen Informationen liefern kann." },
      ],
      summary: "Du hast aus einem Qualitätsziel eine konkrete Taktik und zwei überprüfbare Akzeptanzkriterien abgeleitet.",
    },
  },
  {
    id: "architektur-dokumentieren", topic: "softwarearchitektur", title: "Architekturentscheidungen dokumentieren",
    description: "Halte Gründe und Folgen eines Entwurfs fest und wähle die passende Sicht für den Betrieb.",
    legacySteps: { 3: 2, 4: 3 },
    lessons: [
      {
        title: "Kontext, Entscheidung und Konsequenzen festhalten",
        intro: "Ein Architecture Decision Record, kurz ADR, hält eine wesentliche Entscheidung fest, damit das Team ihre Gründe später nachvollziehen kann.",
        sections: [
          ["Mit dem Problem beginnen", "Ein Bildimport beansprucht während großer Uploads so viel Rechenzeit, dass Anfragen des Redaktionssystems langsamer beantwortet werden. Der Kontext hält fest, welche Last, Ziele und organisatorischen Grenzen für die Entscheidung relevant waren."],
          ["Alternativen und Folgen benennen", "Die Redaktion kann den Import in der Webanwendung belassen oder ihn über eine Warteschlange an getrennte Worker geben. Worker sind Prozesse, die Aufträge im Hintergrund bearbeiten. Sie lassen sich getrennt von der Webanwendung vervielfachen, bringen aber zusätzlichen Betrieb und Wartezeit mit. Notiere, wann sich eine erneute Bewertung lohnt."],
        ],
        check: ["Was fehlt in der Notiz „Wir führen eine Warteschlange ein“?", "Der Anlass, die betrachteten Alternativen und die erwarteten Folgen. So bleiben die Gründe für die Wahl nachvollziehbar."],
        source: ["Michael Nygard · Documenting Architecture Decisions", "https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions"],
      },
      {
        title: "Architektursichten am Bildimport unterscheiden",
        intro: "Eine Sicht stellt die Teile und Beziehungen dar, die zur Frage einer Zielgruppe passen. Die Entscheidung selbst und ihre Darstellung erfüllen unterschiedliche Aufgaben.",
        sections: [
          ["Modulsicht", "Die Modulsicht zeigt die Struktur des Quellcodes und Abhängigkeiten zwischen Modulen. Für den Bildimport zeigt sie zum Beispiel, welches Modul Vorschaubilder erzeugt und wo dessen Aufrufer liegen."],
          ["Verteilungssicht für den Betrieb", "Die Verteilungssicht ordnet laufende Software ihrer Infrastruktur zu. Sie kann zeigen, dass die Webanwendung und Worker in getrennten Gruppen laufen. Definiere, was Kästen und Verbindungen bedeuten, damit klar bleibt, ob sie Code, Aufrufe oder Infrastruktur darstellen."],
          ["Laufzeitsicht am konkreten Auftrag", "Verfolge einen Upload von der Webanwendung über die Warteschlange bis zum Worker. Sobald das System den Auftrag zuverlässig übernommen hat, meldet es „angenommen“. Der Worker speichert die fertige Vorschau später. Zeichne auch den Fehlerfall und einen möglichen neuen Versuch ein, damit der Betrieb den angezeigten Status einordnen kann."],
        ],
        example: {
          title: "Laufzeitablauf eines Bildimports",
          columns: ["Systemteil", "Was er tut"],
          rows: [["Webanwendung", "Nimmt Bild und Auftrag an und meldet den Eingang"], ["Warteschlange", "Hält den Auftrag bereit, bis ein Worker ihn abholt"], ["Worker", "Erstellt das Vorschaubild und hinterlegt das Ergebnis"]],
        },
        check: ["Welche Sicht zeigt, wo zusätzliche Worker laufen können, und welche erklärt den Status „angenommen“?", "Die Verteilungssicht ordnet Worker ihrer Infrastruktur zu. Die Laufzeitsicht zeigt, wann der Auftrag übernommen und wann die Vorschau fertig wird."],
        source: ["IEEE SWEBOK · Architecture Views and Viewpoints", "https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf#page=71"],
      },
      {
        id: "wirkung",
        title: "Überprüfen, ob die Entscheidung wirkt",
        intro: "Lege fest, woran du im Betrieb erkennst, ob die Entscheidung ihr Ziel erreicht. Beobachte auch die Folgen, die sie für andere Teile des Systems hat.",
        sections: [
          ["Für jedes Ziel eine Messgröße wählen", "Um die Artikelbearbeitung zu schützen, beobachte die Antwortzeit beim Speichern von Artikeln während größerer Uploads. Für die Bildverarbeitung misst du getrennt, wie lange Aufträge auf ein Vorschaubild warten. Sonst kann eine schnelle Webseite einen Rückstau bei den Bildern verdecken."],
          ["Einen Anlass zur Neubewertung festhalten", "Das fiktive Redaktionsteam will, dass während großer Uploads 95 von 100 Speichervorgängen höchstens eine Sekunde brauchen. Wenn zugleich viele Vorschauen dauerhaft erst nach mehr als zwei Minuten fertig werden, untersucht das Team die Worker und ihre Fehler sowie den Rückstau. Halte Zielwerte und Anlass im ADR fest."],
        ],
        check: ["Die Redaktion speichert Artikel schnell, aber Vorschaubilder bleiben deutlich länger als vereinbart aus. Was zeigt das?", "Das Ziel für die Artikelbearbeitung kann erfüllt sein. Die Verarbeitung der Vorschaubilder verfehlt ihr eigenes Ziel und braucht eine getrennte Untersuchung."],
        source: ["Google SRE · Monitoring Distributed Systems", "https://sre.google/sre-book/monitoring-distributed-systems/#the-four-golden-signals"],
      },
    ],
    practice: {
      title: "Die Architektur eines Redaktionssystems übergeben",
      intro: "Bildimporte legen bei Spitzenlast die Redaktion lahm. Redakteurinnen und Redakteure akzeptieren verzögerte Vorschaubilder, Artikelbearbeitung soll verfügbar bleiben. Das Betriebsteam kann eine vorhandene Warteschlange und einen separat skalierbaren Worker-Pool nutzen.",
      questions: [
        { prompt: "Welche Entscheidung passt zu den Vorgaben?", answer: 1, options: ["Die Bildverarbeitung innerhalb jeder Webanfrage abschließen.", "Uploads annehmen und die aufwendige Bildverarbeitung über die Warteschlange an Worker geben."], clue: "Die Bearbeitung der Bilder kann zeitversetzt stattfinden und hat andere Ressourcenanforderungen als die Webseite.", explanation: "Getrennte Worker entkoppeln die schwere Verarbeitung von der Webanfrage und lassen sich gezielt skalieren." },
        { prompt: "Welche Konsequenz gehört in die Entscheidungsnotiz?", answer: 0, options: ["Vorschaubilder erscheinen verzögert. Rückstau und wiederholte Verarbeitungsversuche müssen beobachtet werden.", "Jede Verarbeitung ist ab jetzt sofort abgeschlossen und jeder Auftrag wird garantiert genau einmal verarbeitet."], clue: "Überlege, was zwischen Annahme und Fertigstellung des Uploads passiert.", explanation: "Die Warteschlange macht die Verarbeitung asynchron. Betrieb und Nutzeroberfläche müssen mit Wartezeit und Fehlern umgehen." },
        { prompt: "Welche Sicht zeigt dem Betrieb, wo zusätzliche Worker bereitgestellt werden?", answer: 1, options: ["Eine Übersicht über die Quellcodepakete.", "Eine Verteilungssicht mit getrennten Gruppen für Webanwendung und Worker."], clue: "Das Betriebsteam fragt nach der Zuordnung zur Infrastruktur.", explanation: "Die Verteilungssicht zeigt die Laufzeitumgebungen und macht die unabhängige Skalierung nachvollziehbar." },
        { prompt: "Welche zwei Messgrößen zeigen, ob die Trennung im Betrieb hilft?", answer: 0, options: ["Antwortzeit beim Speichern von Artikeln und Zeit vom angenommenen Upload bis zum fertigen Vorschaubild.", "Gesamtzahl der Bilddateien und Anzahl der Quellcodepakete."], clue: "Die Entscheidung soll die Redaktion entlasten. Die Verzögerung der Bilder bleibt eine Folge, die das Team beobachten muss.", explanation: "So prüfst du den Nutzen für die Artikelbearbeitung und die Wartezeit im Hintergrund getrennt." },
      ],
      summary: "Die Entscheidung hält Artikelbearbeitung und Bildverarbeitung getrennt. Dein ADR erklärt den Zielkonflikt, und die Verteilungssicht zeigt dem Betrieb, wo er eingreifen kann.",
    },
  },
  {
    id: "architekturstil-auswaehlen", topic: "softwarearchitektur", title: "Einen Architekturstil auswählen",
    description: "Gliedere eine Bestellplattform in Schichten und entscheide, welche Teile du gemeinsam auslieferst.",
    lessons: [
      {
        title: "Schichten nach Verantwortung trennen",
        intro: "Eine Schicht fasst Code mit einer ähnlichen Aufgabe zusammen. Die Einteilung zeigt, wo eine Entscheidung im Programm getroffen wird und welche Teile aufeinander zugreifen dürfen.",
        sections: [
          ["Eine Bestellung durch die Anwendung verfolgen", "Die Webschicht nimmt die Bestellung entgegen. Die Anwendungsschicht führt den Bestellvorgang aus und prüft die fachlichen Regeln. Die Datenzugriffsschicht übernimmt das Lesen und Speichern in der Datenbank."],
          ["Codegliederung und Betrieb getrennt betrachten", "Eine Anwendung kann mehrere logische Schichten im selben Prozess ausführen. Wenn Teile in getrennten Prozessen oder auf verschiedenen Rechnern laufen, beschreiben diese Grenzen zusätzlich die technische Verteilung."],
        ],
        example: {
          title: "Der Weg einer Bestellung durch die Schichten",
          columns: ["Schicht", "Beispielaufgabe"],
          rows: [["Webschicht", "Die Anfrage entgegennehmen und das Ergebnis anzeigen"], ["Anwendungsschicht", "Den Bestellvorgang und seine fachlichen Prüfungen ausführen"], ["Datenzugriff", "Die Bestellung in der Datenbank speichern"]],
        },
        check: ["Wo prüfst du, ob eine Bestellung nach der Versandfreigabe noch storniert werden darf?", "In der Fachlogik der Anwendung. Die Regel gilt unabhängig davon, ob die Bestellung von einer Webseite oder einer anderen Schnittstelle kommt."],
        source: ["Microsoft Learn · Common web application architectures, N-Layer", "https://learn.microsoft.com/en-us/dotnet/architecture/modern-web-apps-azure/common-web-application-architectures#traditional-n-layer-architecture-applications"],
      },
      {
        title: "Einen modularen Monolithen verstehen",
        intro: "Bei einem modularen Monolithen bleiben Module fachlich abgegrenzt und werden als eine Anwendung ausgeliefert. Ein Release ist hier die Bereitstellung einer neuen Version dieser Anwendung.",
        sections: [
          ["Fachliche Grenzen innerhalb der Anwendung ziehen", "Bestellungen, Lager und Versand sind eigene Module. Jedes Modul kann intern Code für seine Fachlogik und seinen Datenzugriff enthalten. Diese Fachgrenzen beantworten eine andere Frage als die Schichten. Sie legen fest, wer sich um Bestellung, Bestand oder Versand kümmert."],
          ["Die Anwendung als Einheit betreiben", "Das Team kann eine neue Version gemeinsam ausliefern. Wenn die Anwendung darauf vorbereitet ist und die gemeinsamen Abhängigkeiten mithalten, kann das Team bei Bedarf mehrere Instanzen derselben Version betreiben. Alle enthaltenen Module werden dabei zusammen repliziert."],
        ],
        check: ["Können Lager und Versand im selben Release liegen und trotzdem klare Modulgrenzen haben?", "Ja. Der Code kann eigene Verantwortungen und Schnittstellen haben, obwohl das Team ihn als eine Anwendung ausliefert."],
        source: ["Shopify Engineering · Deconstructing the Monolith", "https://shopify.engineering/deconstructing-monolith-designing-software-maximizes-developer-productivity"],
      },
      {
        title: "Nutzen und Kosten eines eigenen Dienstes abwägen",
        intro: "Ein eigener Versanddienst bringt eine getrennt betreibbare Einheit. Eine kompatible Schnittstelle erlaubt dem Versandteam, neue Versionen unabhängig von der Bestellanwendung bereitzustellen.",
        sections: [
          ["Einen konkreten Vorteil benennen", "Das kann sinnvoll sein, wenn ein eigenes Team Versandregeln wesentlich häufiger ausliefert oder nur der Versand mehr Rechenleistung benötigt. Der Vorteil hängt davon ab, ob sich der Versand tatsächlich unabhängig betreiben und weiterentwickeln lässt."],
          ["Die neue Grenze betreiben", "Zwischen Bestellanwendung und Versand verläuft nun eine Netzwerkverbindung. Aufrufe können länger dauern oder fehlschlagen. Die Teams müssen die Schnittstelle kompatibel halten, Zuständigkeiten für Daten absprechen und den Dienst separat überwachen."],
        ],
        check: ["Warum erschwert ein gemeinsam geändertes Tabellenschema unabhängige Releases?", "Wenn beide Teile dieselbe Tabellenstruktur voraussetzen, kann eine Änderung einen gleichzeitigen Release erzwingen. Eine stabile Schnittstelle und klare Verantwortung für die Daten lockern diese Bindung."],
        source: ["Microsoft Azure Architecture Center · Microservices Architecture Style", "https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles/microservices"],
      },
      {
        title: "Die Entscheidung aus Anforderungen ableiten",
        intro: "Begründe den Stil mit dem, was das Team heute braucht. Halte auch fest, bei welcher Veränderung sich der Vergleich erneut lohnt.",
        sections: [
          ["Die Ausgangslage gewichten", "Ein kleines Team betreut Bestellung, Lager und Versand und liefert gemeinsam aus. Der Betrieb soll überschaubar bleiben. Ein modularer Monolith bietet dafür klare Fachgrenzen und einen gemeinsamen Release. Die Schichten helfen zusätzlich, die Verantwortungen im Code zu ordnen."],
          ["Einen Anlass für einen Wechsel festlegen", "Wenn ein eigenes Versandteam später unabhängig ausliefern muss, kann ein separater Versanddienst einen konkreten Nutzen haben. Vergleiche dann Release-Aufwand, Datenverantwortung und Fehlerfälle an der neuen Netzwerkgrenze. Halte die Entscheidung und ihre Folgen in einer kurzen Notiz fest."],
        ],
        check: ["Welche neue Anforderung ist ein konkreter Anlass, den Versand als eigenen Dienst zu prüfen?", "Das Versandteam muss neue Versionen unabhängig von der Bestellanwendung bereitstellen. Die Vorteile lassen sich dann gegen den zusätzlichen Betriebsaufwand abwägen."],
        source: ["Martin Fowler · Monolith First", "https://martinfowler.com/bliki/MonolithFirst.html"],
      },
    ],
    practice: {
      title: "Die Architektur einer kleinen Bestellplattform wählen",
      intro: "Drei Entwickler bauen eine Bestellplattform mit Lager und Versand. Sie veröffentlichen gemeinsam, und der Betrieb soll am Anfang überschaubar bleiben. Später könnte ein anderes Team den Versand übernehmen und eigene Releases brauchen.",
      comparison: {
        title: "Auslieferungsvarianten vergleichen",
        label: "Variante für die Bestellplattform",
        variants: [
          { label: "Modularer Monolith", details: [["Im Code", "Bestellungen, Lager und Versand bleiben eigene Module"], ["Auslieferung", "Die Anwendung hat einen gemeinsamen Release"], ["Betrieb", "Aufrufe zwischen ihren Modulen können im selben Prozess bleiben"]] },
          { label: "Versand als eigener Dienst", details: [["Im Code", "Die Bestellanwendung spricht den Versand über eine definierte Schnittstelle an"], ["Auslieferung", "Versand kann bei kompatibler Schnittstelle unabhängig bereitgestellt werden"], ["Betrieb", "Für den Netzwerkaufruf und den Versanddienst sind eigene Fehlerbehandlung und Überwachung nötig"]] },
        ],
      },
      questions: [
        { prompt: "Wo entscheidest du, ob eine Bestellung storniert werden darf?", answer: 0, options: ["In der Fachlogik des Bestellmoduls.", "In der Weboberfläche, die den Stornieren-Knopf anzeigt."], clue: "Die fachliche Regel soll für alle Aufrufer der Anwendung gelten.", explanation: "Das Bestellmodul entscheidet. Die Weboberfläche stellt das Ergebnis dar." },
        { prompt: "Welche Auslieferung passt zum Start am besten?", answer: 1, options: ["Bestellung, Lager und Versand sofort als drei getrennt betriebene Dienste.", "Eine gemeinsam ausgelieferte Anwendung mit getrennten Fachmodulen."], clue: "Beachte, wie das Team Releases organisiert und welchen Betriebsaufwand es tragen will.", explanation: "Der modulare Monolith verbindet klare Fachgrenzen mit einem gemeinsamen Release und einem kleineren Betriebsumfang." },
        { prompt: "Was ist später ein konkreter Grund, einen Versanddienst zu prüfen?", answer: 0, options: ["Ein eigenes Versandteam braucht unabhängige Releases für seine Änderungen.", "Im Versandmodul liegen inzwischen mehr Dateien als im Lagermodul."], clue: "Suche eine Anforderung, die eine getrennte Auslieferung tatsächlich erfüllt.", explanation: "Unabhängige Releases sind ein konkreter Nutzen. Ob er den zusätzlichen Betrieb rechtfertigt, hängt von der Situation ab." },
        { prompt: "Was hilft den Teams, den Versand tatsächlich unabhängig auszuliefern?", answer: 1, options: ["Beide Anwendungen greifen direkt auf dieselben Versandtabellen zu und ändern das Schema gemeinsam.", "Der Versand besitzt seine Daten und bietet eine kompatible Schnittstelle für die Bestellanwendung an."], clue: "Die Bestellanwendung soll eine neue Versandversion ohne gleichzeitige Änderung weiter aufrufen können.", explanation: "Eine kompatible Schnittstelle und klare Datenverantwortung verringern die Abhängigkeit auf Release-Ebene." },
      ],
      summary: "Dein Entwurf ordnet den Code nach Aufgaben und belässt die Auslieferung zunächst bei einer Anwendung. Ein eigener Versanddienst wird interessant, sobald die Anforderungen des Teams seinen zusätzlichen Betrieb rechtfertigen.",
    },
  },
  {
    id: "teilausfaelle-beherrschen", topic: "softwarearchitektur", title: "Teilausfälle beherrschen",
    description: "Begrenze die Folgen eines ausgefallenen Dienstes und halte den Fortschritt von Aufträgen nachvollziehbar.",
    lessons: [
      {
        title: "Abhängigkeiten und Ausfallfolgen erkennen",
        intro: "Ein Teilausfall trifft nur einen Teil des Systems, kann sich aber über Abhängigkeiten ausbreiten. Entscheide für jede Funktion, auf welche Ergebnisse sie sofort angewiesen ist und welche Arbeit warten darf.",
        sections: [
          ["Die kritische Kette zeichnen", "Ruft der Shop beim Abschicken jeder Bestellung den Versanddienst auf, hängt der Checkout von dessen Antwort ab. Während der Dienst hängt, bleiben Verbindungen und Verarbeitungskapazität belegt. Dann können auch Anfragen ins Stocken geraten, die mit dem Versand gar nichts zu tun haben."],
          ["Eine fachlich sinnvolle Zwischenstufe finden", "Kann der Shop eine Bestellung bereits verbindlich annehmen, darf er den Versandauftrag später anlegen. Dann speichert er die Bestellung und den offenen Versandauftrag gemeinsam dauerhaft. Die Anzeige unterscheidet zwischen „Bestellung angenommen“, „Versand wird vorbereitet“ und „Sendung angelegt“."],
        ],
        example: {
          title: "Was darf auf den Versand warten?",
          columns: ["Funktion", "Abhängigkeit"],
          rows: [["Warenkorb anzeigen", "Braucht den Versanddienst in diesem Shop nicht."], ["Bestellung annehmen", "Braucht eine dauerhaft gespeicherte Bestellung samt offenem Versandauftrag."], ["Sendungsnummer anzeigen", "Braucht die bestätigte Nummer des Versanddienstes."]],
        },
        check: ["Was muss den Neustart des Shops überstehen, wenn der Versand später startet?", "Die Bestellung und die Information, dass ihr Versandauftrag noch ausgeführt werden muss."],
        source: ["Google SRE · Addressing Cascading Failures", "https://sre.google/sre-book/addressing-cascading-failures/"],
      },
      {
        title: "Zeitlimits und Wiederholungen begrenzen",
        intro: "Ein Timeout beendet das Warten des Aufrufers. Die Arbeit im anderen Dienst kann trotzdem bereits erfolgreich abgeschlossen sein oder dort noch weiterlaufen.",
        sections: [
          ["Zeit als gemeinsames Budget behandeln", "Setze ein Zeitlimit für den gesamten Vorgang und für einzelne Aufrufe. Mehrere Schichten mit eigenen Wiederholungen können die Anzahl der Aufrufe vervielfachen. Lege fest, welche Schicht vorübergehende Fehler wiederholt und wie viele Versuche sie maximal macht."],
          ["Wiederholen, ohne Wirkungen zu verdoppeln", "Der Versanddienst muss für denselben fachlichen Auftrag dieselbe Auftragskennung wiedererkennen. Nur wenn sein Vertrag das garantiert, darf der Shop die Erstellung bei unklarem Ergebnis mit dieser Kennung wiederholen. Bei Hintergrundaufträgen verteilen wachsende Wartezeiten mit einem kleinen Zufallsanteil die erneuten Versuche."],
        ],
        check: ["Was weißt du nach einem Timeout beim Anlegen einer Sendung?", "Du hast keine bestätigte Antwort erhalten. Ob eine Sendung angelegt wurde, bleibt bis zum Abgleich oder einer Wiederholung mit derselben Auftragskennung offen."],
        source: ["Amazon Builders’ Library · Timeouts, retries, and backoff with jitter", "https://d1.awsstatic.com/builderslibrary/pdfs/timeouts-retries-and-backoff-with-jitter.pdf"],
      },
      {
        title: "Eine gestörte Abhängigkeit vorübergehend abschalten",
        intro: "Ein Circuit Breaker verfolgt die Fehler einer Abhängigkeit. Bei einer anhaltenden Störung lässt er Aufrufe zeitweise früh scheitern, damit die Dienste Zeit zur Erholung bekommen.",
        sections: [
          ["Geschlossen, offen und halboffen", "Im geschlossenen Zustand laufen Aufrufe normal. Werden in einem geeigneten Zeitfenster zu viele Aufrufe fehlerhaft, öffnet der Schutzschalter. Nach einer Wartezeit erlaubt er im halboffenen Zustand wenige Probeaufrufe. Je nach Ergebnis schließt er wieder oder bleibt offen."],
          ["Schutzschalter und offene Arbeit verbinden", "Solange der Schalter offen ist, behält der Shop die offenen Versandaufträge. Die Hintergrundverarbeitung plant den nächsten Versuch ein und begrenzt beim Wiederanlauf die gleichzeitigen Aufrufe. So gelangen aufgestaute Aufträge kontrolliert zum Versanddienst."],
        ],
        check: ["Wozu dienen die wenigen Probeaufrufe?", "Sie zeigen, ob sich die Abhängigkeit erholt hat, bevor wieder reguläre Last zugelassen wird."],
        source: ["Microsoft Azure Architecture Center · Circuit Breaker", "https://learn.microsoft.com/en-us/azure/architecture/patterns/circuit-breaker"],
      },
      {
        title: "Zwischenzustände und Wiederanlauf sichtbar machen",
        intro: "Bei entkoppelter Verarbeitung sind Bestellannahme und Versand zwei getrennte Ergebnisse. Die Oberfläche und der Betrieb brauchen jeweils eine zuverlässige Sicht auf den Fortschritt.",
        sections: [
          ["Einen ehrlichen Status anzeigen", "Solange keine Sendungsnummer bestätigt ist, zeigt das Portal „Versand wird vorbereitet“. Bei einem endgültigen Fehler wechselt der Auftrag in einen Klärungszustand. Nach einer bestätigten Anlage speichert der Shop die Nummer und zeigt „Sendung angelegt“."],
          ["Den aufgestauten Bestand überwachen", "Messe, wie viele Versandaufträge offen sind und wie alt der älteste offene Auftrag ist. Ein Test mit abgeschaltetem Versanddienst prüft die Bestellannahme, den sichtbaren Status und die kontrollierte Abarbeitung nach dem Wiederanlauf."],
        ],
        check: ["Woran erkennst du eine Versandstörung, obwohl der Checkout weiterhin antwortet?", "Die offenen Versandaufträge werden älter oder häufen sich. Der Checkout allein misst nur die Annahme der Bestellung."],
        source: ["Microsoft Azure Architecture Center · Queue-Based Load Leveling", "https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling"],
      },
    ],
    practice: {
      title: "Der Shop während einer Versandstörung",
      intro: "Ein Fahrradshop soll Bestellungen innerhalb einer Sekunde annehmen. Sein Versanddienst reagiert normalerweise in 150 Millisekunden, während der Störung aber erst nach sechs Sekunden oder gar nicht. Er unterstützt eine feste Auftragskennung für Wiederholungen. Vergleiche die Folgen und entscheide, was der Shop speichert, anzeigt und wiederholt.",
      comparison: {
        title: "Versandstörung durchspielen", label: "Ablauf auswählen",
        variants: [
          { label: "Synchroner Versand, Dienst langsam", details: [["Checkout", "Bei sechs Sekunden Wartezeit für den Versand verfehlt der Checkout sein Ziel."], ["Belastung", "Jede wartende Bestellung hält Ressourcen im Shop belegt."]] },
          { label: "Hintergrundversand, Dienst ausgefallen", details: [["Checkout", "Der Shop bestätigt, sobald Bestellung und Versandauftrag gemeinsam gespeichert sind."], ["Status", "Versand wird vorbereitet. Der offene Versandauftrag bleibt erhalten."]] },
          { label: "Hintergrundversand, Dienst erholt", details: [["Wiederanlauf", "Probeaufrufe und begrenzte Parallelität lassen den Versand schrittweise aufholen."], ["Status", "Eine bestätigte Sendungsnummer erscheint nach erfolgreicher Verarbeitung."]] },
        ],
      },
      questions: [
        { prompt: "Was muss vor der Bestätigung der Bestellung passieren?", answer: 1, options: ["Die Arbeit wird nach der Antwort im Arbeitsspeicher vorgemerkt.", "Bestellung und offener Versandauftrag werden gemeinsam dauerhaft gespeichert.", "Der Shop wartet immer auf eine Sendungsnummer."], clue: "Stell dir einen Neustart unmittelbar nach der Bestätigung vor.", explanation: "So übersteht die noch offene Versandarbeit den Neustart und der Checkout kann unabhängig vom Versanddienst antworten." },
        { prompt: "Wie reagiert der Worker auf einen vorübergehenden Fehler mit unklarem Ergebnis?", answer: 2, options: ["Er vergibt beim Wiederholen eine neue Auftragskennung.", "Er wiederholt sofort unbegrenzt.", "Er plant begrenzte Versuche mit Abstand und derselben Auftragskennung."], clue: "Die Sendung könnte existieren, obwohl beim Shop keine Antwort angekommen ist.", explanation: "Die feste Kennung erlaubt dem Versanddienst, die Wiederholung demselben Auftrag zuzuordnen. Abstände und ein Limit schonen die Abhängigkeit." },
        { prompt: "Was zeigt das Portal während der Störung?", answer: 0, options: ["Versand wird vorbereitet.", "Sendung angelegt, mit einer vorläufigen Sendungsnummer.", "Bestellung fehlgeschlagen."], clue: "Die Bestellung ist gespeichert, die Versandanlage steht noch aus.", explanation: "Die Anzeige meldet den Fortschritt, den der Shop bestätigen kann." },
        { prompt: "Wie nimmst du den Betrieb bei vielen offenen Aufträgen wieder auf?", answer: 1, options: ["Bei der ersten erfolgreichen Antwort alle offenen Aufträge gleichzeitig senden.", "Mit wenigen Probeaufrufen beginnen und den Rückstand mit begrenzter Parallelität abarbeiten.", "Alle vorhandenen Aufträge aus der Warteschlange entfernen."], clue: "Der Versanddienst soll nach seiner Erholung Zeit haben, die Last wieder zu übernehmen.", explanation: "Die Probeaufrufe prüfen die Erholung. Ein begrenzter Durchsatz schützt den Dienst beim Abarbeiten des Rückstands." },
      ],
      summary: "Der Shop nimmt Bestellungen unabhängig an, bewahrt offene Versandarbeit dauerhaft auf und arbeitet Rückstände nach der Störung kontrolliert ab.",
    },
  },
  {
    id: "architekturvarianten-bewerten", topic: "softwarearchitektur", title: "Architekturvarianten bewerten",
    description: "Vergleiche Entwürfe anhand derselben Szenarien und lege Annahmen, Zielkonflikte und offene Risiken offen.",
    lessons: [
      {
        title: "Entwürfe anhand derselben Szenarien vergleichen",
        intro: "Eine Architekturvariante ist für einen bestimmten Zweck geeignet. Prüfe konkurrierende Entwürfe am selben Kontext, damit der Vergleich für die anstehende Entscheidung etwas aussagt.",
        sections: [
          ["An einem Ereignis beginnen", "Für einen Ticketshop ist der Verkaufsstart interessanter als ein ruhiger Nachmittag. Formuliere die erwartete Last, die betroffene Funktion und das Ziel. Zum Beispiel sollen beim Verkaufsstart 95 Prozent der Reservierungsanfragen binnen 800 Millisekunden beantwortet werden."],
          ["Erfolg und Verfügbarkeit gesondert messen", "Eine schnelle Fehlermeldung erfüllt vielleicht das Zeitziel, rettet aber keine Reservierung. Ergänze ein eigenes Ziel für den Anteil der technisch erfolgreich abgewickelten Anfragen. Ein reguläres „ausverkauft“ kann eine korrekte Fachantwort sein."],
        ],
        check: ["Warum kann die Antwortzeit allein eine schlechte Variante gut aussehen lassen?", "Die Variante könnte einen großen Teil der Anfragen sehr schnell mit technischen Fehlern beantworten."],
        source: ["CMU Software Engineering Institute · ATAM: Method for Architecture Evaluation", "https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/"],
      },
      {
        title: "Muss-Kriterien und Abwägungen trennen",
        intro: "Manche Eigenschaften sind Voraussetzungen, andere lassen Spielraum. Lege vor dem Vergleich fest, welche davon wie entschieden werden.",
        sections: [
          ["Grenzen markieren", "Ein Sitz darf höchstens einmal verkauft werden. Das ist eine fachliche Invariante, also eine Regel, die immer gelten muss. Auch verbindliche Grenzwerte für Latenz oder Fehlerquote können als Muss-Kriterien gelten."],
          ["Trade-offs benennen", "Mehrere unabhängig betriebene Dienste können getrennt skaliert werden. Sie können zugleich zusätzliche Netzaufrufe, Überwachung und Bereitschaftsaufwand mitbringen. Wie stark der Vorteil ist, hängt vom Lastprofil und von der Teamorganisation ab."],
        ],
        example: {
          title: "Welche Rolle spielt das Kriterium?",
          columns: ["Kriterium", "Verwendung im Vergleich"],
          rows: [["Jeder Sitz wird höchstens einmal vergeben", "Fachliche Voraussetzung für beide Varianten."], ["p95 höchstens 800 ms beim Start", "Prüfbares Leistungsziel unter definierter Last."], ["Möglichst wenig Bereitschaftsaufwand", "Auswahlkriterium unter den Entwürfen, die die verbindlichen Ziele erreichen."]],
        },
        check: ["Darf ein geringerer Betriebsaufwand ausgleichen, dass Sitzplätze doppelt verkauft werden?", "Die Einzigkeit der Platzvergabe ist eine fachliche Voraussetzung. Sie muss unabhängig von anderen Vorteilen eingehalten werden."],
        source: ["IEEE Computer Society · SWEBOK, Kapitel Software Architecture", "https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf"],
      },
      {
        title: "Risiken und empfindliche Annahmen finden",
        intro: "ATAM leitet Risiken und Abwägungen aus Szenarien ab. In dieser Quest übernimmst du daraus einen kleinen szenariobasierten Vergleich für zwei Entwürfe.",
        sections: [
          ["Den empfindlichen Punkt identifizieren", "Eine Architektureigenschaft ist ein Sensitivitätspunkt, wenn sich ein Qualitätsziel stark mit ihr ändert. Treten viele gleichzeitige Reservierungen für dieselbe Veranstaltung auf, können etwa die Dauer und der Umfang einer Datenbanksperre die Antwortzeit prägen."],
          ["Eine Annahme gezielt testen", "Die mittlere Last über alle Veranstaltungen verschleiert den Andrang auf wenige Sitzbereiche. Teste deshalb eine konzentrierte Last und konkurrierende Anfragen auf denselben Platz. Erfasse Antwortzeit, erfolgreiche Abwicklung und Fehler getrennt."],
        ],
        check: ["Welches Szenario prüft Sperrkonflikte besser als ein gleichmäßig verteilter Lasttest?", "Viele gleichzeitige Reservierungen für dieselben Plätze oder Sitzbereiche einer gefragten Veranstaltung."],
        source: ["CMU Software Engineering Institute · ATAM: Method for Architecture Evaluation", "https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/"],
      },
      {
        title: "Messwerte in eine nachvollziehbare Entscheidung übersetzen",
        intro: "Ein Architekturvergleich liefert eine Entscheidung unter dokumentierten Annahmen. Unterscheide klar zwischen Messdaten, Schätzungen und offenen Fragen.",
        sections: [
          ["Ergebnisse einordnen", "Ein Lasttest liefert Hinweise für den getesteten Verkehr und die getestete Umgebung. Aus zwei erfolgreichen Testläufen lässt sich keine dauerhafte Produktionsverfügbarkeit ableiten. Für diese Frage brauchst du etwa Störungstests und Messungen über einen definierten Betriebszeitraum."],
          ["Den erneuten Prüfpunkt festlegen", "Halte fest, welche Variante die Ziele im getesteten Szenario erreicht, welche Nachteile sie mitbringt und wann die Entscheidung erneut geprüft wird. Anlass können eine höhere erwartete Spitzenlast oder neue Anforderungen an unabhängige Releases sein."],
        ],
        check: ["Was gehört neben Messwert und Entscheidung in die Begründung?", "Mindestens die Testbedingungen, relevante Unsicherheiten und ein Kriterium dafür, wann du erneut vergleichst."],
        source: ["CMU Software Engineering Institute · ATAM: Method for Architecture Evaluation", "https://insights.sei.cmu.edu/library/atam-method-for-architecture-evaluation/"],
      },
    ],
    practice: {
      title: "Tickets für ein ausverkauftes Festival",
      intro: "Zwei Prototypen für eine Festivalbuchung laufen im gleichen simulierten Verkaufsstart mit 200 Anfragen pro Sekunde. Verbindlich sind ein p95 von höchstens 800 Millisekunden und mindestens 99,5 Prozent technisch korrekt abgewickelte Antworten, jeweils im Lasttest. Beide Entwürfe verwenden dieselbe atomare Platzvergabe. Das kleine Betriebsteam bevorzugt weniger separat betreute Dienste, wenn die Ziele erreicht werden.",
      comparison: {
        title: "Messwerte der Entwürfe vergleichen", label: "Prototyp auswählen",
        variants: [
          { label: "A · Modularer Monolith", details: [["p95 / technische Erfolgsquote", "680 ms / 99,7 % im simulierten Verkaufsstart"], ["Betriebsumfang", "Ein auszuliefernder Anwendungsdienst mit gemeinsamem Release."]] },
          { label: "B · Getrennter Reservierungsdienst", details: [["p95 / technische Erfolgsquote", "780 ms / 99,8 % im simulierten Verkaufsstart"], ["Betriebsumfang", "Zwei auszuliefernde Anwendungsdienste. Die Reservierung lässt sich getrennt skalieren."]] },
        ],
      },
      questions: [
        { prompt: "Was lässt sich über die beiden Prototypen anhand der vorliegenden Zahlen sagen?", answer: 2, options: ["Nur A erfüllt das Zeitziel.", "Nur B erfüllt die technische Erfolgsquote.", "Beide erfüllen die beiden messbaren Ziele des Lasttests."], clue: "Vergleiche jede Zahl mit ihrer eigenen Schwelle.", explanation: "Beide p95-Werte liegen unter 800 Millisekunden. Beide Quoten liegen über 99,5 Prozent." },
        { prompt: "Welchen Entwurf wählst du mit den aktuellen Anforderungen?", answer: 0, options: ["A, weil er die Ziele im Test erreicht und weniger Anwendungsdienste im Betrieb hat.", "B allein wegen der um 0,1 Prozentpunkte höheren technischen Erfolgsquote.", "B allein, weil er separat skalierbar ist."], clue: "Das Betriebsteam hat eine ausdrückliche Präferenz, sobald die Testziele erreicht werden.", explanation: "A erfüllt die gemessenen Ziele und entspricht der Präferenz für weniger betriebene Dienste." },
        { prompt: "Womit prüfst du das Risiko eines besonders gefragten Sitzbereichs?", answer: 1, options: ["Mit einem einzelnen Aufruf auf dem leeren System.", "Mit vielen konkurrierenden Reservierungsanfragen auf dieselben Plätze.", "Mit einer Messung der Ladezeit der Startseite."], clue: "Der Engpass kann dort auftreten, wo Anfragen um dieselben Daten konkurrieren.", explanation: "Diese Last zeigt, ob Sperrkonflikte die Antwortzeit erhöhen und die Platzvergabe die Einzigkeit weiterhin erzwingt." },
        { prompt: "Welche Aussage zur Verfügbarkeit kannst du verantworten?", answer: 2, options: ["A hat garantiert mindestens 99,7 Prozent Verfügbarkeit im Jahresbetrieb.", "B hat nachweislich die bessere Produktionsverfügbarkeit.", "Die Quoten gelten für den simulierten Verkaufsstart. Ausfalltests und Betriebsdaten beantworten weitere Fragen zur Verfügbarkeit."], clue: "Der Test deckt ein konkretes Lastszenario ab. Wie verhält sich das System über Zeit und bei Störungen?", explanation: "Die technischen Erfolgsquoten beschreiben genau den Test. Für Aussagen zur Verfügbarkeit muss der Beobachtungsrahmen erweitert werden." },
      ],
      summary: "Du hast eine Variante anhand definierter Ziele und des Betriebsaufwands gewählt und festgehalten, welche Risiken weitere Tests erfordern.",
    },
  },
  {
    id: "systeme-ueber-ereignisse-verbinden", topic: "softwarearchitektur", title: "Systeme über Ereignisse verbinden",
    description: "Verteile Ereignisse an mehrere Empfänger und entwirf eine Verarbeitung für wiederholte Zustellungen.",
    lessons: [
      {
        title: "Ereignisse, Befehle und Anfragen unterscheiden",
        intro: "Ein Ereignis beschreibt etwas, das bereits passiert ist. Ein Befehl fordert eine Handlung an. Eine Anfrage fragt nach einer Auskunft. Die Bedeutung hilft dir zu entscheiden, wie Dienste kommunizieren sollen.",
        sections: [
          ["Absicht im Namen sichtbar machen", "„Bestellung bestätigt“ ist ein Fakt des Bestellsystems. „Paket versenden“ weist einen Empfänger an, eine Aufgabe zu erledigen. „Wie lautet die Sendungsnummer?“ braucht eine Antwort und ist eine Anfrage."],
          ["Verantwortung beim Erzeuger lassen", "Nur das Bestellsystem bestätigt die Bestellung und veröffentlicht den Fakt nach dem Speichern. Lager und Versand können unabhängig reagieren. Falls der Versand auf die Kommissionierung warten muss, reagiert er auf das spätere Ereignis „Ware kommissioniert“."],
        ],
        example: {
          title: "Drei Nachrichten im Bestellprozess",
          columns: ["Nachricht", "Bedeutung"],
          rows: [["Bestellung bestätigt", "Ereignis, das einen bereits eingetretenen Fakt meldet."], ["Paket versenden", "Befehl, der eine Handlung anfordert."], ["Sendungsnummer abfragen", "Anfrage nach einer Auskunft."]],
        },
        check: ["Welches Ereignis passt, wenn der Versand erst nach der Kommissionierung planen darf?", "„Ware kommissioniert“. Dieses Ereignis meldet, dass die notwendige Vorbedingung erfüllt ist."],
        source: ["Microsoft Azure Architecture Center · Publisher-Subscriber", "https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber"],
      },
      {
        title: "Ein Ereignis an unabhängige Empfänger verteilen",
        intro: "Bei Publish/Subscribe sendet ein Erzeuger an einen Nachrichtenvermittler, den Broker. Jeder interessierte Empfänger erhält über sein eigenes Abonnement eine Kopie.",
        sections: [
          ["Verteilung von Arbeitsteilung unterscheiden", "Mehrere Worker derselben Warteschlange teilen die Aufgaben typischerweise unter sich auf. Soll ein Ereignis sowohl das Lager als auch die Versandplanung erreichen, bekommen beide je ein Abonnement. Mehrere Instanzen des Lagers können sich wiederum dessen Verarbeitung teilen."],
          ["Einen brauchbaren Vertrag festlegen", "Gib dem Ereignis eine stabile Ereignis-ID sowie Typ, Bestell-ID und die fachlich erforderlichen Daten. Die Ereignis-ID identifiziert genau diese Meldung. Die Bestell-ID verbindet mehrere verschiedene Ereignisse derselben Bestellung. Halte den Vertrag kompatibel, solange ältere Empfänger weiterlaufen."],
        ],
        check: ["Warum teilen sich Lager und Versandplanung für diese Aufgabe keine einzelne Worker-Warteschlange?", "Beide sollen das Ereignis jeweils verarbeiten. Worker aus einer gemeinsamen Warteschlange teilen Nachrichten üblicherweise auf, sodass eine Nachricht nur eine der beiden Aufgaben anstoßen könnte."],
        source: ["Microsoft Azure Architecture Center · Publisher-Subscriber", "https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber"],
      },
      {
        title: "Doppelte Zustellungen ohne doppelte Wirkung verarbeiten",
        intro: "Bei einer Zustellgarantie von mindestens einmal kann dasselbe Ereignis mehrfach ankommen. Ein idempotenter Empfänger erreicht nach einer erneuten Zustellung dasselbe fachliche Ergebnis wie nach der ersten Verarbeitung.",
        sections: [
          ["Den Fehler zwischen Wirkung und Quittung betrachten", "Ein Lager-Worker schreibt die Pickliste in seine Datenbank und stürzt ab, bevor er die Nachricht bestätigt. Der Broker liefert sie erneut. Jede Zustellung darf verarbeitet werden, aber am Ende soll es für diese Meldung nur eine Pickliste geben."],
          ["Verarbeitung und Kennung gemeinsam festschreiben", "Speichere im Lager die Ereignis-ID und die Pickliste in derselben lokalen Transaktion. Eine Eindeutigkeitsregel verhindert, dass zwei Worker dieselbe ID gleichzeitig neu verarbeiten. Bestätige die Nachricht nach dem Commit oder sobald eine bereits erfolgreich verarbeitete ID erkannt wurde."],
        ],
        check: ["Warum reicht eine Liste verarbeiteter Ereignis-IDs im Arbeitsspeicher nicht aus?", "Sie geht bei einem Neustart verloren und schützt nicht zuverlässig vor paralleler Verarbeitung durch mehrere Worker."],
        source: ["AWS Prescriptive Guidance · Transactional Outbox, Duplicate Messages", "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html#issues-and-considerations"],
      },
      {
        title: "Datenänderung und Ereignis zusammen speichern",
        intro: "Speichert ein Dienst zuerst die Bestellung und sendet danach die Nachricht, kann er zwischen beiden Schritten abstürzen. Eine transaktionale Outbox hält die noch zu sendende Nachricht dauerhaft fest.",
        sections: [
          ["Eine lokale Transaktion verwenden", "Die Bestellbestätigung und der Outbox-Eintrag werden zusammen festgeschrieben. Ein Hintergrundprozess liest den Eintrag und veröffentlicht das Ereignis. Schlägt das Speichern fehl, existiert auch kein Outbox-Eintrag für die Bestätigung."],
          ["Die verbleibende Lücke erkennen", "Ein Hintergrundprozess kann nach der Veröffentlichung und vor seiner lokalen Versandmarkierung abstürzen. Beim Wiederanlauf versendet er gegebenenfalls dasselbe Ereignis erneut. Die Nachricht behält ihre ursprüngliche ID, sodass Empfänger die Verarbeitung erkennen können."],
        ],
        check: ["Wofür brauchst du beim Empfänger weiterhin Idempotenz, obwohl der Sender eine Outbox hat?", "Der Sender oder der Broker kann eine Nachricht wiederholen. Die Outbox verbindet die Datenänderung mit der Absicht zur Veröffentlichung, während der Empfänger doppelte Wirkungen verhindert."],
        source: ["AWS Prescriptive Guidance · Transactional Outbox", "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html"],
      },
      {
        title: "Mit verspäteten und vertauschten Ereignissen umgehen",
        intro: "Eine eindeutige Ereignis-ID erkennt dieselbe Nachricht bei erneuter Zustellung. Für zwei unterschiedliche Änderungen derselben Bestellung brauchst du zusätzlich eine Regel für ihre Reihenfolge.",
        sections: [
          ["Den fachlichen Stand mitgeben", "Der Bestelldienst kann für jede Statusänderung eine steigende Versionsnummer mitgeben. Hat die Versandplanung bereits den vollständigen Status „storniert“ aus Version 5 gespeichert, kann sie eine spät eingetroffene Version 4 als älter erkennen und ignorieren."],
          ["Vollständigen Stand und Änderung unterscheiden", "Bei Meldungen, die nur einzelne Änderungen enthalten, kann eine fehlende Zwischenversion wichtig sein. Vereinbare dann beispielsweise geordnete Zustellung je Bestellung oder einen Weg, den vollständigen Stand beim Bestelldienst abzugleichen. Eine Reihenfolge über alle Bestellungen ist dafür nicht erforderlich."],
        ],
        check: ["Warum genügen unterschiedliche Ereignis-IDs nicht, um den aktuelleren Bestellstatus zu erkennen?", "Sie identifizieren die Nachrichten. Ihre Reihenfolge ergibt sich zum Beispiel aus einer Versionsnummer je Bestellung."],
        source: ["Microsoft Azure Architecture Center · Publisher-Subscriber", "https://learn.microsoft.com/en-us/azure/architecture/patterns/publisher-subscriber"],
      },
    ],
    practice: {
      title: "Eine bestätigte Bestellung erreicht Lager und Versandplanung",
      intro: "Die fiktive Bestellplattform Nordmarkt erstellt für jede bestätigte Bestellung eine Pickliste und einen vorläufigen Versandplan. Beide Aufgaben sollen unabhängig starten. Die physische Sendung darf erst nach der Kommissionierung angelegt werden. Der Broker kann Nachrichten erneut zustellen.",
      comparison: {
        title: "Zustellung und Fehlerfälle durchspielen", label: "Zustellsituation auswählen",
        variants: [
          { label: "Beide Abonnements verfügbar", details: [["Lager", "Erhält Ereignis E42 und legt eine Pickliste an."], ["Versandplanung", "Erhält eine eigene Kopie von E42 und legt einen vorläufigen Plan an."]] },
          { label: "Lager stürzt nach dem Commit ab", details: [["Neu zugestellt", "Das Lager erhält E42 nach dem Neustart erneut, weil es die Nachricht noch nicht quittiert hatte."], ["Fachliches Ergebnis", "Die gespeicherte Ereignis-ID E42 verhindert eine zweite Pickliste."]] },
          { label: "Versandplanung vorübergehend offline", details: [["Lager", "Verarbeitet sein Abonnement wie gewohnt."], ["Versandplanung", "Innerhalb der Speicherfrist kann sie den Rückstand ihres dauerhaften Abonnements nachholen."]] },
        ],
      },
      questions: [
        { prompt: "Wie erreicht die Bestätigung zuverlässig beide Empfänger?", answer: 0, options: ["Lager und Versandplanung erhalten je ein dauerhaftes Abonnement.", "Lager und Versandplanung konkurrieren um Nachrichten aus einer gemeinsamen Warteschlange.", "Nur das Lager erhält die Bestätigung. Die Versandplanung schätzt den Zustand."], clue: "Jedes der beiden Systeme hat eine eigene Aufgabe für dieselbe Meldung.", explanation: "Unabhängige Abonnements liefern beiden Empfängern eine eigene Kopie der Bestätigung." },
        { prompt: "Wie verhindert das Lager eine zweite Pickliste nach einer Neuzustellung?", answer: 2, options: ["Es quittiert jede Nachricht vor dem Speichern.", "Es legt bei jeder Zustellung eine neue Pickliste an.", "Es speichert Ereignis-ID und Pickliste in derselben Transaktion und sichert die ID auf Eindeutigkeit."], clue: "Der Prozess kann zwischen zwei getrennten Schreibvorgängen oder vor der Quittung abstürzen.", explanation: "Die gespeicherte ID und die Pickliste werden gemeinsam wirksam. Das Lager erkennt eine erneute Zustellung auch nach einem Neustart." },
        { prompt: "Wie bleibt die Meldung erhalten, wenn der Bestelldienst nach dem Speichern abstürzt?", answer: 1, options: ["Das Bestellsystem quittiert seine eigene Meldung im Voraus.", "Die Bestellbestätigung wird zusammen mit einem Outbox-Eintrag gespeichert.", "Die Meldung wird einige Zeit im Arbeitsspeicher gehalten."], clue: "Auch die Absicht, später zu veröffentlichen, muss dauerhaft festgeschrieben werden.", explanation: "Der Hintergrundprozess kann die ausstehende Meldung nach einem Neustart aus der Outbox veröffentlichen." },
        { prompt: "Wann darf der Versand die physische Sendung anlegen?", answer: 0, options: ["Nach dem Ereignis „Ware kommissioniert“.", "Sobald „Bestellung bestätigt“ zum zweiten Mal eintrifft.", "Nach Erstellung des vorläufigen Versandplans."], clue: "Der Versand braucht einen bestätigten fachlichen Schritt aus dem Lager.", explanation: "Das Kommissionierungsereignis bestätigt die Vorbedingung für die physische Sendung." },
        { prompt: "Die Versandplanung hat für eine Bestellung bereits Version 5 mit dem vollständigen Status „storniert“ gespeichert. Wie behandelt sie den später eintreffenden Status „bestätigt“ aus Version 4?", answer: 2, options: ["Sie übernimmt Version 4, weil sie zuletzt eingetroffen ist.", "Sie übernimmt Version 4, weil die Ereignis-ID neu ist.", "Sie behält den Status aus Version 5, weil Version 4 älter ist."], clue: "Die fachliche Reihenfolge ergibt sich aus der Versionsnummer der Bestellung.", explanation: "Die vollständige Statusmeldung aus Version 5 bleibt maßgeblich. Eine verspätete ältere Meldung kann sie nicht zurücksetzen." },
      ],
      summary: "Dein Entwurf verteilt Fakten über dauerhafte Abonnements, übersteht Fehler beim Veröffentlichen und schützt die Empfänger vor doppelten Wirkungen.",
    },
  },
  {
    id: "verteilte-daten-konsistent-halten", topic: "softwarearchitektur", title: "Verteilte Daten konsistent halten",
    description: "Lege fest, wo Datenregeln gelten und wie ein Vorgang mit mehreren Diensten bei Fehlern abgeschlossen wird.",
    lessons: [
      {
        title: "Verantwortung für Daten und Regeln zuordnen",
        intro: "Wenn mehrere Dienste eigene Datenbanken besitzen, kann eine lokale Transaktion die Regeln eines Dienstes schützen. Lege fest, welcher Dienst für welche Daten und Invarianten verantwortlich ist.",
        sections: [
          ["Den verfügbaren Bestand am richtigen Ort prüfen", "Der Lagerdienst entscheidet verbindlich über Reservierungen. Er prüft und verringert den verfügbaren Bestand in einer atomaren Änderung, damit zwei Anfragen nicht das letzte Stück für sich beanspruchen. Er speichert jede Reservierung mit ihrer eigenen Kennung."],
          ["Momentaufnahmen einordnen", "Der Bestelldienst kann einen verzögert aktualisierten Bestand für die Produktanzeige lesen. In der Zeit zwischen Anzeige und Kauf kann sich der Bestand ändern. Eine Zusage entsteht erst mit der bestätigten Reservierung im Lager."],
        ],
        check: ["Wo erzwingst du die Regel, dass der Bestand nie negativ wird?", "Im Lagerdienst bei der atomaren Reservierung. Dort werden die konkurrierenden Änderungen am verbindlichen Bestand koordiniert."],
        source: ["AWS Prescriptive Guidance · Saga Orchestration", "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-orchestration.html"],
      },
      {
        title: "Zwischenzustände eines verteilten Vorgangs modellieren",
        intro: "Eine Saga verbindet lokale Transaktionen zu einem fachlichen Vorgang. Jede Transaktion schreibt im zuständigen Dienst fest. Während die Schritte ablaufen, kann der Gesamtvorgang noch offen sein.",
        sections: [
          ["Fortschritt dauerhaft festhalten", "Der Bestelldienst legt die Bestellung als „in Prüfung“ an. Ein Koordinator speichert, ob der Bestandsdienst bereits reserviert hat und ob die Zahlungsautorisierung bestätigt ist. Nach einem Neustart setzt der Koordinator den Vorgang anhand dieses Fortschritts fort."],
          ["Nachrichten und Zusagen abstimmen", "Der Koordinator verknüpft Antworten mit derselben Vorgangs- und Reservierungskennung. Die Oberfläche meldet „in Prüfung“, bis die benötigten Zusagen vorliegen. Das System braucht einen Wiederanlauf oder eine Eskalation für länger offene Fälle, damit der Zwischenzustand nicht unbegrenzt bestehen bleibt."],
        ],
        example: {
          title: "Status aus bestätigten Schritten ableiten",
          columns: ["Bestätigte Schritte", "Bestellstatus"],
          rows: [["Bestellung angelegt, Lagerentscheidung ausstehend", "In Prüfung"], ["Bestand reserviert, Zahlungsantwort ausstehend", "In Prüfung"], ["Bestand reserviert und Zahlung autorisiert", "Bestätigt"], ["Zahlung abgelehnt, Freigabe des Bestands noch offen", "Stornierung läuft"]],
        },
        check: ["Darf der Shop nach erfolgreicher Reservierung und noch offener Zahlungsprüfung „bestätigt“ melden?", "Die Bestellung bleibt in Prüfung, bis auch die erforderliche Zahlungsautorisierung bestätigt ist."],
        source: ["Hector Garcia-Molina und Kenneth Salem · Sagas", "https://www.cs.princeton.edu/techreports/1987/070.pdf"],
      },
      {
        title: "Bereits ausgeführte Schritte fachlich kompensieren",
        intro: "Eine Kompensation ist ein neuer fachlicher Schritt. Sie gleicht die Wirkung eines bereits festgeschriebenen Schritts aus und muss zwischenzeitliche Änderungen berücksichtigen.",
        sections: [
          ["Die Reservierung gezielt auflösen", "Wird eine Zahlung verbindlich abgelehnt, sendet der Koordinator einen Freigabeauftrag für genau diese Reservierungskennung. Das Lager markiert eine noch aktive Reservierung als freigegeben und erhöht den verfügbaren Bestand in derselben Transaktion."],
          ["Freigaben wiederholbar machen", "Geht die Freigabeantwort verloren, darf eine Wiederholung derselben Kennung den Bestand kein zweites Mal erhöhen. Der Lagerdienst erkennt die bereits freigegebene Reservierung am gespeicherten Zustand. Ein unklarer Payment-Timeout braucht zuerst Klärung oder eine sichere Wiederholung, bevor du das Ergebnis als Ablehnung behandelst."],
        ],
        check: ["Warum stellst du bei einer Stornierung keinen alten Bestandswert wieder her?", "Andere Bestellungen können den Bestand inzwischen verändert haben. Die Freigabe berücksichtigt nur den Anteil der konkreten Reservierung."],
        source: ["Microsoft Azure Architecture Center · Compensating Transaction", "https://learn.microsoft.com/en-us/azure/architecture/patterns/compensating-transaction"],
      },
      {
        title: "Orchestrierung und Choreografie abwägen",
        intro: "An einer Saga können Dienste auf Ereignisse reagieren oder Anweisungen von einem Koordinator erhalten. Die Wahl bestimmt, wo die Regeln für den Gesamtvorgang stehen.",
        sections: [
          ["Choreografie bei wenigen klaren Reaktionen", "In einer Choreografie entscheidet jeder Dienst anhand empfangener Ereignisse über den eigenen nächsten Schritt. Bei längeren Abläufen verteilen sich Reihenfolge, Fehlerreaktionen und Kompensationen auf mehrere Komponenten."],
          ["Orchestrierung für einen sichtbaren Ablauf", "Ein Orchestrator verwaltet Fortschritt und nächste Schritte. Er sendet beispielsweise bei einer abgelehnten Zahlung die Freigabe und wartet auf die Bestätigung. Die Teilnehmer behalten die Verantwortung für ihre Daten. Der Koordinator braucht dauerhaft gespeicherten Fortschritt und einen verlässlichen Wiederanlauf."],
        ],
        check: ["Welches Modell erleichtert es, einen mehrstufigen Stornierungsablauf an einer Stelle zu erklären?", "Eine Orchestrierung, weil der Koordinator Fortschritt, nächste Schritte und Kompensationen des Ablaufs verwaltet."],
        source: ["AWS Prescriptive Guidance · Saga Patterns", "https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/saga-patterns.html"],
      },
      {
        title: "Zwei gleichzeitige Reservierungen korrekt entscheiden",
        intro: "Eine lokale Transaktion fasst Schreibvorgänge zusammen. Für das letzte Fahrrad muss die Datenbank außerdem konkurrierende Änderungen so koordinieren, dass nur eine Reservierung erfolgreich ist.",
        sections: [
          ["Bedingung und Änderung zusammenführen", "Beide Anfragen könnten zunächst den Bestand 1 lesen. Der Lagerdienst kann deshalb den Bestand mit einer einzigen bedingten Anweisung verringern, die nur bei positivem Bestand greift. Schreibt diese Anweisung keine Zeile, ist kein Stück verfügbar. Die Reservierung wird nur bei erfolgreicher Änderung im selben Commit gespeichert."],
          ["Die Grenze der Transaktion erkennen", "Der Lagerdienst kann damit seine eigene Bestandsregel schützen. Die Zahlungsautorisierung liegt in einer anderen Datenbank. Der Koordinator muss die bereits gespeicherte Reservierung bei einer endgültigen Ablehnung über die dafür vorgesehene Freigabe kompensieren."],
        ],
        check: ["Was meldet der Lagerdienst an die zweite Anfrage, wenn das erste Update den verbindlichen Bestand bereits von 1 auf 0 gesetzt hat?", "Der Bestandsabzug der zweiten Anfrage ändert keine Zeile. Der Lagerdienst meldet, dass kein Stück verfügbar ist, und speichert dafür keine Reservierung."],
        source: ["PostgreSQL · Transaction Isolation, Read Committed", "https://www.postgresql.org/docs/current/transaction-iso.html#XACT-READ-COMMITTED"],
      },
    ],
    practice: {
      title: "Das letzte Fahrrad im Lager",
      intro: "Zwei Kundinnen bestellen gleichzeitig das letzte verfügbare Fahrrad. Das Lager und der Bestelldienst besitzen getrennte Datenbanken. Der Shop bestätigt eine Bestellung erst nach Bestandsreservierung und Zahlungsautorisierung. Der Zahlungsdienst kann verbindlich ablehnen oder ohne eindeutige Antwort ausfallen.",
      comparison: {
        title: "Den Bestellverlauf durchspielen", label: "Ausgang der Zahlungsprüfung auswählen",
        variants: [
          { label: "Zahlung autorisiert", details: [["Lager", "Reservierung R17 bleibt aktiv, bis die weitere Abwicklung übernimmt."], ["Bestellung", "Der Shop bestätigt nach beiden Zusagen."]] },
          { label: "Zahlung eindeutig abgelehnt", details: [["Lager", "Der Koordinator lässt R17 freigeben. Der Bestand steigt genau einmal."], ["Bestellung", "Stornierung läuft, bis die Freigabe bestätigt ist. Dann ist sie storniert."]] },
          { label: "Zahlungsantwort fehlt", details: [["Lager", "R17 bleibt während der begrenzten Klärungsphase bestehen."], ["Bestellung", "Der Shop bleibt in Prüfung und klärt die Zahlungsautorisierung über ihre Auftragskennung. Hängende Fälle werden zur Klärung gemeldet."]] },
        ],
      },
      questions: [
        { prompt: "Wie verhinderst du zwei Reservierungen für das letzte Fahrrad?", answer: 1, options: ["Beide Bestellungen lesen den zuletzt angezeigten Bestand.", "Der Lagerdienst prüft und reserviert den verfügbaren Bestand in einer atomaren Änderung.", "Der Bestelldienst setzt für beide gleichzeitigen Anfragen den Status auf bestätigt."], clue: "Die Entscheidung und die Änderung des verbindlichen Bestands müssen zusammenpassen.", explanation: "Die atomare Änderung im Lager schützt die Bestandsregel auch dann, wenn mehrere Anfragen gleichzeitig ankommen." },
        { prompt: "Welchen Bestellstatus zeigst du nach verloren gegangener Zahlungsantwort?", answer: 2, options: ["Bestätigt.", "Storniert und freigegeben.", "In Prüfung, während der Status der Zahlungsautorisierung geklärt wird."], clue: "Eine fehlende Antwort enthält keine gesicherte Aussage über die Autorisierung.", explanation: "Der Zwischenzustand ermöglicht die Klärung, bevor der Shop die Bestellung bestätigt oder eine Freigabe einleitet." },
        { prompt: "Was passiert nach eindeutig abgelehnter Zahlung?", answer: 0, options: ["Der Koordinator veranlasst die wiederholbare Freigabe genau dieser Reservierung.", "Das Lager schreibt den Bestand auf den Wert von heute Morgen zurück.", "Die Bestellung wird bestätigt, weil das Fahrrad reserviert war."], clue: "Andere Bestellungen können den Bestand parallel verändert haben.", explanation: "Die gezielte Kompensation gibt nur das Stück dieser Reservierung frei und bleibt auch bei einem wiederholten Auftrag korrekt." },
        { prompt: "Was hilft dem Koordinator nach einem Absturz während der Stornierung?", answer: 1, options: ["Eine erneute Bestellung für die Kundin anlegen.", "Den gespeicherten Workflowzustand und dieselben Vorgangskennungen nutzen.", "Alle noch offenen Bestellungen in der Anwendung bestätigen."], clue: "Der Prozess muss erkennen können, welche Schritte bereits festgeschrieben wurden.", explanation: "Mit dauerhaftem Fortschritt und stabilen Kennungen kann der Koordinator eine ausstehende Freigabe korrekt wiederholen oder den bestätigten Schritt abschließen." },
      ],
      summary: "Dein Entwurf schützt den Bestand im zuständigen Dienst, zeigt offene Vorgänge korrekt und schließt Fehlerfälle über gezielte Kompensation ab.",
    },
  },
  {
    id: "engpaesse-finden-und-skalieren", topic: "softwarearchitektur", title: "Engpässe finden und gezielt skalieren",
    description: "Lokalisiere Kapazitätsgrenzen mit Lastdaten und prüfe, ob eine Änderung den Durchsatz tatsächlich erhöht.",
    lessons: [
      {
        title: "Latenz, Durchsatz und Auslastung unterscheiden",
        intro: "Latenz misst die Zeit einer Anfrage. Durchsatz misst, wie viel Arbeit pro Zeiteinheit fertig wird. Auslastung beschreibt, wie stark eine Ressource beansprucht wird. Zusammen helfen die Größen bei der Suche nach einem Engpass.",
        sections: [
          ["Die ganze Nutzeraufgabe messen", "Ein Fotoportal bestätigt Uploads schnell, auch wenn fertige Vorschaubilder erst viel später erscheinen. Miss die Zeit bis zur Upload-Bestätigung und die Zeit bis zur fertigen Vorschau getrennt. Erfasse außerdem Anfragen, Fehler und die Auslastung wichtiger Komponenten."],
          ["Langsame Anfragen sichtbar machen", "Bei einem p95 von 800 Millisekunden dauerten ungefähr 95 Prozent der beobachteten Anfragen höchstens so lange. Ein Durchschnitt kann verbergen, dass viele Nutzende in einer Spitze deutlich länger warten. Vergleiche Werte aus denselben Lastbedingungen."],
        ],
        check: ["Welcher Messwert zeigt, ob mehr Vorschaubilder fertig werden?", "Der Durchsatz der fertigen Vorschaubilder, zum Beispiel die Zahl je Minute."],
        source: ["Google SRE · Monitoring Distributed Systems", "https://sre.google/sre-book/monitoring-distributed-systems/"],
      },
      {
        title: "Wachstum der Warteschlange erklären",
        intro: "Eine Warteschlange puffert vorübergehende Spitzen. Treffen dauerhaft mehr Aufträge ein, als die Verarbeitung abschließen kann, wachsen Rückstand und Wartezeit.",
        sections: [
          ["Zufluss und Abfluss vergleichen", "Kommen 120 Bildaufträge pro Minute in die Warteschlange und schließt der Worker 90 ab, kommen im vereinfachten Modell 30 offene Aufträge pro Minute hinzu. Nach vier Minuten aus einer leeren Warteschlange sind es 120. Ein größerer Puffer gibt Zeit, erhöht aber den Durchsatz der Worker nicht."],
          ["Den Ort der Wartezeit finden", "Beobachte, vor welcher Verarbeitung sich Arbeit staut und worauf die Komponente tatsächlich wartet. Ein ausgelasteter Worker kann eigene Rechenzeit verbrauchen oder lange auf die Datenbank warten. Diese Fälle erfordern unterschiedliche Maßnahmen."],
        ],
        example: {
          title: "Änderung des Rückstands bei anhaltender Last",
          columns: ["Aufträge rein / fertig pro Minute", "Folge im vereinfachten Modell"],
          rows: [["120 / 90", "Der Rückstand wächst um 30 pro Minute."], ["120 / 120", "Ein bestehender Rückstand bleibt gleich groß."], ["120 / 145", "Der Rückstand schrumpft um bis zu 25 pro Minute."]],
        },
        check: ["Warum reicht es bei 120 neuen Aufträgen pro Minute nicht, die Verarbeitung auf 120 zu erhöhen, wenn bereits Arbeit wartet?", "Der Rückstand wächst dann nicht weiter, schrumpft aber erst mit zusätzlicher freier Verarbeitungskapazität oder weniger Zufluss."],
        source: ["Microsoft Azure Architecture Center · Queue-Based Load Leveling", "https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling"],
      },
      {
        title: "Die passende Skalierungsmaßnahme wählen",
        intro: "Vertikales Skalieren gibt einer Instanz mehr Ressourcen. Horizontales Skalieren ergänzt Instanzen. Beide Maßnahmen haben Grenzen, die vom aktuellen Engpass abhängen.",
        sections: [
          ["Parallelisierbare Arbeit verteilen", "Unabhängige Bildaufträge lassen sich auf zusätzliche Worker verteilen. Dafür müssen die Worker Aufgaben verlässlich untereinander aufteilen, und gemeinsame Ressourcen brauchen genügend Reserven. Mehr Webinstanzen helfen vor allem, wenn der Webteil selbst limitiert."],
          ["Gemeinsame Ressourcen berücksichtigen", "Warten alle Worker auf dieselbe Datenbank, kann zusätzliche Parallelität deren Überlastung verschärfen. Prüfe dann beispielsweise teure Abfragen oder lang gehaltene Sperren und begrenze die Zahl gleichzeitiger Zugriffe. Nach jeder Änderung kann der Engpass an eine andere Stelle wandern."],
        ],
        check: ["Wann können mehr Worker die Verarbeitungszeit sogar verschlechtern?", "Wenn sie eine bereits ausgelastete gemeinsame Ressource stärker belasten, etwa durch zusätzliche parallele Datenbankzugriffe."],
        source: ["Microsoft Azure Well-Architected Framework · Scaling and Partitioning", "https://learn.microsoft.com/en-us/azure/well-architected/scalability/design-scale"],
      },
      {
        title: "Eine Skalierung unter Last überprüfen",
        intro: "Eine Skalierungsentscheidung beginnt mit einer Hypothese über den Engpass. Ein vergleichbarer Lasttest überprüft, ob der angenommene Mechanismus die Verbesserung erklärt.",
        sections: [
          ["Vorher und nachher vergleichbar halten", "Halte Auftragsmix, Dauer und Eingangsrate konstant. Ändere gezielt eine Maßnahme. Vergleiche fertige Bilder pro Minute, Wartezeit, Fehler und die Auslastung von Worker und Datenbank. Ein Test unter Spitzenlast zeigt, ob die Wirkung auch dort anhält."],
          ["Mit Grenzen auf Last reagieren", "Regle die Zahl der Worker beispielsweise anhand des Alters offener Aufträge. Lege einen Höchstwert für den Datenbankzugriff fest und beobachte Fehlerraten. Wenn die sichere Kapazität erschöpft ist, kann der Dienst neue Arbeit begrenzen oder verzichtbare Hintergrundaufträge später annehmen."],
        ],
        check: ["Mit welchen Ergebnissen erkennst du, dass mehr Worker tatsächlich helfen?", "Mehr Bilder werden pro Minute fertig, ältere Aufträge werden abgearbeitet und Fehlerrate sowie nachgelagerte Belastung bleiben im Zielbereich."],
        source: ["Microsoft Azure Well-Architected Framework · Capacity Planning", "https://learn.microsoft.com/en-us/azure/well-architected/performance-efficiency/capacity-planning"],
      },
    ],
    practice: {
      title: "Das Fotoportal nach dem Stadtlauf",
      intro: "Pro Minute treffen 120 Bildaufträge beim Portal ein. Jedes Bild durchläuft in diesem Modell einmal Webannahme, Datenbank und anschließende Vorschauverarbeitung. Die Vergleichsdaten sind simuliert und beziehen sich auf denselben Auftragsmix. Solange ein Rückstand besteht, können freie Worker-Kapazitäten ihn zusätzlich zum Zufluss abarbeiten.",
      comparison: {
        title: "Kapazität und Rückstand je Maßnahme vergleichen", label: "Maßnahme auswählen",
        variants: [
          { label: "Ausgangslage", details: [["Kapazität Web / Datenbank / Worker", "180 / 150 / 90 Aufträge pro Minute"], ["Rückstand vor dem Worker", "+30 Aufträge pro Minute"]] },
          { label: "Webkapazität verdoppeln", details: [["Kapazität Web / Datenbank / Worker", "360 / 150 / 90 Aufträge pro Minute"], ["Rückstand vor dem Worker", "+30 Aufträge pro Minute"]] },
          { label: "Datenbankkapazität erhöhen", details: [["Kapazität Web / Datenbank / Worker", "180 / 220 / 90 Aufträge pro Minute"], ["Rückstand vor dem Worker", "+30 Aufträge pro Minute"]] },
          { label: "Worker für mehr Parallelität skalieren", details: [["Kapazität Web / Datenbank / Worker", "180 / 150 / 145 Aufträge pro Minute"], ["Rückstand vor dem Worker", "Sinkt um 25 Aufträge pro Minute, solange er mindestens 25 beträgt."]] },
        ],
      },
      questions: [
        { prompt: "Welche Komponente begrenzt in der Ausgangslage den Durchsatz fertiger Bilder?", answer: 2, options: ["Die Webannahme mit 180 Aufträgen pro Minute.", "Die Datenbank mit 150 Aufträgen pro Minute.", "Die Vorschauverarbeitung mit 90 Aufträgen pro Minute."], clue: "Vergleiche jede Kapazität mit dem Zufluss von 120 Aufträgen pro Minute.", explanation: "Nur die Worker-Kapazität liegt unter dem Zufluss. Vor dieser Stufe wächst der Rückstand." },
        { prompt: "Wie viele Aufträge warten nach vier Minuten aus einer leeren Warteschlange?", answer: 1, options: ["30 Aufträge.", "120 Aufträge.", "360 Aufträge."], clue: "Berechne zuerst, wie viele Aufträge pro Minute zusätzlich offen bleiben.", explanation: "Von 120 neuen Aufträgen werden je Minute 90 verarbeitet. Vier Minuten mit je 30 offenen Aufträgen ergeben einen Rückstand von 120." },
        { prompt: "Welche Maßnahme lässt den vorhandenen Rückstand bei gleichem Zufluss schrumpfen?", answer: 0, options: ["Die Vorschauverarbeitung auf 145 Aufträge pro Minute bringen.", "Nur die Webkapazität erhöhen.", "Die Warteschlange größer dimensionieren."], clue: "Für den Abbau brauchst du freie Kapazität über die 120 neu eintreffenden Aufträge hinaus.", explanation: "Die Worker können in diesem Modell 25 weitere Aufträge pro Minute abarbeiten, ohne die Kapazität der anderen Komponenten zu überschreiten." },
        { prompt: "Was prüfst du bei einer weiteren Skalierung?", answer: 2, options: ["Nur die Anzahl der Worker, unabhängig vom Ergebnis.", "Nur die Antwortzeit beim Upload, unabhängig vom Rückstand.", "Fertige Bilder, Wartezeiten, Fehler und die Auslastung gemeinsamer Ressourcen unter vergleichbarer Last."], clue: "Der Engpass kann durch die Maßnahme an eine andere Stelle wandern.", explanation: "Die Messung zeigt, ob die Nutzeraufgabe schneller fertig wird und eine andere Stufe an ihre Grenze gerät." },
      ],
      summary: "Du hast den Engpass aus dem Rückstand abgeleitet, die passende Komponente skaliert und eine Prüfung für den nächsten Engpass festgelegt.",
    },
  },
  {
    id: "sicherheitsgrenzen-entwerfen", topic: "softwarearchitektur", title: "Sicherheitsgrenzen entwerfen",
    description: "Modelliere Vertrauensgrenzen und lege fest, welche Personen und Dienste auf welche Daten zugreifen dürfen.",
    lessons: [
      {
        title: "Datenflüsse und Vertrauensgrenzen zeichnen",
        intro: "Eine Vertrauensgrenze ist ein Übergang, an dem sich Annahmen über Identität, Kontrolle oder Berechtigungen ändern. Ein einfaches Datenflussbild macht sichtbar, wo das System solche Annahmen überprüfen muss.",
        sections: [
          ["Akteure und Daten erfassen", "Markiere Browser, Portal-API, Abrechnungsdienst und Datenbank. Beschrifte die Pfeile mit den übertragenen Daten, etwa Identitätsnachweis, Rechnungsanfrage oder Rechnungsinhalt. So siehst du, welche Schnittstellen überhaupt sensible Informationen weitergeben."],
          ["Vertrauen an Übergängen prüfen", "Am Eingang prüft die API, von wem die Anfrage stammt. Fordert die API vom Abrechnungsdienst Daten an, prüft dieser die für den Aufruf erforderliche Dienstidentität und Berechtigung. Muss der Abrechnungsdienst auch die Person prüfen, braucht er einen überprüfbaren Kontext über sie."],
        ],
        check: ["Warum ist die Grenze zwischen Portal und Abrechnungsdienst relevant?", "Der Abrechnungsdienst besitzt Daten und Operationen mit eigenen Zugriffsregeln. Er muss feststellen, welcher Aufruf dort zulässig ist."],
        source: ["OWASP · Threat Modeling Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html"],
      },
      {
        title: "Identität und Berechtigung getrennt prüfen",
        intro: "Authentifizierung stellt eine Identität fest. Autorisierung prüft, ob diese Identität eine bestimmte Handlung für ein bestimmtes Objekt ausführen darf. Eine gültige Anmeldung beantwortet deshalb erst die erste Frage.",
        sections: [
          ["Rollen für gleiche Aufgaben bündeln", "Rollenbasierte Zugriffskontrolle (RBAC) verknüpft Personen über ihre Rollen mit Berechtigungen. Eine Rolle „Support“ kann etwa eine Ansicht für die Fallbearbeitung erlauben. Weise der Rolle nur die Berechtigungen zu, die dafür erforderlich sind."],
          ["Den Bezug zum Objekt ergänzen", "Zwei Kundinnen haben dieselbe Rolle, dürfen aber jeweils nur ihre eigenen Rechnungen einsehen. Eine Regel prüft darum zusätzlich die Beziehung zwischen angemeldeter Person und Rechnung. Beim Support kann eine aktive Fallzuordnung den erlaubten Zugriff eingrenzen."],
        ],
        example: {
          title: "Vom Konto zur Objektberechtigung",
          columns: ["Anfrage", "Bedingung für die Freigabe"],
          rows: [["Kundin liest eine Rechnung", "Die Rechnung gehört zum angemeldeten Konto."], ["Support liest Rechnungsstatus", "Ein aktiver, zugewiesener Fall betrifft diese Rechnung."], ["Support liest vollständige Rechnung", "Die Aufgabe gewährt dafür keine Berechtigung."]],
        },
        check: ["Welche Prüfung fehlt, wenn die API beim Rechnungslesen allein die Rolle „Kundin“ verlangt?", "Die API muss prüfen, ob genau diese Rechnung zum angemeldeten Konto gehört."],
        source: ["NIST · Ferraiolo und Kuhn, Role-Based Access Controls", "https://csrc.nist.gov/pubs/conference/1992/10/13/rolebased-access-controls/final"],
      },
      {
        title: "Zugriffsregeln an der richtigen Stelle durchsetzen",
        intro: "Jede Anfrage braucht eine serverseitige Entscheidung über die angeforderte Aktion und Ressource. Die Oberfläche kann die Bedienung anpassen. Die eigentliche Freigabe findet dort statt, wo der Server die Operation schützt.",
        sections: [
          ["Mit minimalen Rechten beginnen", "Lehne den Zugriff ab, solange keine passende Regel ihn freigibt. Eine Supportansicht liefert nur die erforderlichen Statusfelder. So landen Name, Anschrift oder Zahlungsdetails erst dann in einer Antwort, wenn die Funktion und die Berechtigung diese Daten wirklich brauchen."],
          ["Entscheidung und Durchsetzung verbinden", "Ein zentraler Satz von Regeln erleichtert einheitliche Entscheidungen. Die Codepfade, die Daten lesen oder ändern, müssen diese Regeln auch anwenden. Prüfe deshalb Einzelansicht, Download und Listen nach derselben fachlichen Vorgabe."],
        ],
        check: ["Wo prüfst du den Eigentümer einer Rechnung für einen PDF-Download?", "Serverseitig bei jeder Downloadanfrage, bevor der geschützte Rechnungsinhalt ausgeliefert wird."],
        source: ["OWASP · Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"],
      },
      {
        title: "Erlaubte und verweigerte Zugriffe testen",
        intro: "Eine Berechtigungsmatrix macht Zugriffsregeln überprüfbar. Sie beschreibt je Rolle, Aktion und Objektbezug, was erlaubt ist und welche Daten die Antwort enthalten darf.",
        sections: [
          ["Die Grenzen als Testfälle verwenden", "Teste die eigene und eine andere Rechnung mit zwei Testkonten. Prüfe dieselbe Supportanfrage mit aktivem und abgeschlossenem Fall. Überprüfe für positive Fälle auch die erlaubten Felder der Antwort. So testest du Berechtigung und Datenausgabe gemeinsam."],
          ["Entscheidungen im Betrieb nachvollziehen", "Protokolliere sicherheitsrelevante Berechtigungsentscheidungen in dem erforderlichen Umfang, etwa Aktion, Ergebnis und Zeitpunkt. Beschränke den Zugriff auf diese Protokolle und vermeide vollständige Rechnungsinhalte oder Zugangsdaten. Änderungen an Regeln brauchen passende Regressionstests."],
        ],
        check: ["Welche zwei Tests passen zu der Regel „Support sieht den Status bei aktiver Fallzuordnung“?", "Die Statusansicht mit aktivem zugewiesenem Fall muss erlaubt sein. Ohne diese Zuordnung oder nach Abschluss des Falls muss der Zugriff abgelehnt werden."],
        source: ["OWASP · Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"],
      },
    ],
    practice: {
      title: "Rechnungen im Kundenportal schützen",
      intro: "Im Kundenportal sehen Kundinnen ihre eigenen Rechnungen in voller Länge. Support-Mitarbeitende sehen für einen aktiven, ihnen zugewiesenen Fall ausschließlich den Rechnungsstatus. Die API bietet eine Detailansicht und einen PDF-Download. Entwirf die serverseitige Entscheidung für beide Wege.",
      comparison: {
        title: "Zugriffsregeln an Beispielen prüfen", label: "Anfrage auswählen",
        variants: [
          { label: "Kundin liest ihre eigene Rechnung", details: [["Entscheidung", "Erlaubt, nachdem die API Konto und Rechnung zugeordnet hat."], ["Antwort", "Vollständige Rechnung oder PDF gemäß der gewählten Aktion."]] },
          { label: "Kundin fragt eine fremde Rechnung an", details: [["Entscheidung", "Verweigert, da der erforderliche Kontobezug fehlt."], ["Antwort", "Keine Rechnungsdaten."]] },
          { label: "Support fragt den Status zu einem aktiven eigenen Fall ab", details: [["Entscheidung", "Statusansicht erlaubt, solange die Fallzuordnung aktiv ist."], ["Antwort", "Nur der Status. Ein vollständiger Download ist für diese Rolle nicht freigegeben."]] },
          { label: "Support fragt den Status nach Abschluss des Falls ab", details: [["Entscheidung", "Verweigert, da die Fallzuordnung nicht mehr aktiv ist."], ["Antwort", "Keine Rechnungsdaten."]] },
        ],
      },
      questions: [
        { prompt: "Was prüft die API neben der Rolle „Kundin“?", answer: 1, options: ["Ob die Oberfläche die Schaltfläche für den Download zeigt.", "Ob die angefragte Rechnung zum angemeldeten Konto gehört.", "Ob die Person schon einmal eine beliebige Rechnung geöffnet hat."], clue: "Die beiden Kundinnen haben dieselbe Rolle, aber verschiedene Rechnungen.", explanation: "Der Bezug zum konkreten Objekt entscheidet, ob die Rolle diese Rechnung lesen darf." },
        { prompt: "Welche Daten liefert die Statusansicht für einen aktiven zugewiesenen Supportfall?", answer: 0, options: ["Nur den Rechnungsstatus.", "Den Status und die vollständige Rechnung.", "Alle Rechnungen des Kontos zur Auswahl."], clue: "Die Supportaufgabe braucht genau eine Auskunft.", explanation: "Eine Antwort mit minimalen Feldern setzt den fachlichen Zugriffsumfang bereits auf dem Server durch." },
        { prompt: "Wo wird die Freigabe für einen PDF-Download durchgesetzt?", answer: 2, options: ["Nur beim Anmelden.", "Im Browser, wenn die Schaltfläche gerendert wird.", "Auf dem Server für die konkrete Downloadanfrage, vor der Ausgabe der Rechnung."], clue: "Die Downloadfunktion braucht eine Entscheidung für diese Aktion und diese Rechnung.", explanation: "Die serverseitige Prüfung schützt den Rechnungsinhalt bei jedem Abruf." },
        { prompt: "Welches Testpaar überprüft die zeitliche Grenze eines Supportfalls?", answer: 1, options: ["Zwei erlaubte Aufrufe mit demselben aktiven Fall.", "Dieselbe Statusanfrage mit aktiver Fallzuordnung und nach deren Abschluss.", "Zwei Aufrufe der Startseite durch unterschiedliche Kundinnen."], clue: "Der Status des Falls soll allein den Unterschied ausmachen.", explanation: "Dieses Testpaar prüft die Erlaubnis während der Bearbeitung und ihren Entzug nach Abschluss." },
      ],
      summary: "Dein Entwurf verbindet Rollen mit dem Bezug zur Rechnung und prüft jede Aktion serverseitig. Die Berechtigungsmatrix liefert konkrete Tests für diese Grenzen.",
    },
  },
  {
    id: "architektur-schrittweise-migrieren", topic: "softwarearchitektur", title: "Architektur schrittweise migrieren",
    description: "Löse eine Funktion aus einer Altanwendung und plane Datenübergabe, gestaffelte Freigabe und Rückweg.",
    lessons: [
      {
        title: "Einen kleinen fachlichen Ausschnitt auswählen",
        intro: "Beim Strangler-Fig-Muster ersetzt ein neues System Funktionen schrittweise. Ein gemeinsamer Zugang leitet Anfragen jeweils zur zuständigen Implementierung, während alte und neue Komponenten nebeneinander laufen.",
        sections: [
          ["Mit einem überprüfbaren Ausschnitt beginnen", "In einem alten Shop soll zuerst der Download endgültiger Rechnungen umziehen. Er hat einen klaren Eingang und ein überprüfbares Ergebnis. Rechnungserstellung, Korrekturen und Zahlungsabwicklung bleiben in der ersten Phase bei der Altanwendung."],
          ["Die Grenze als Vertrag behandeln", "Erfasse, welche Clients den Download aufrufen und welche Berechtigungen, Schnittstellenantworten und Dokumentinhalte sie erwarten. Ein Router oder eine Fassade kann Anfragen intern umleiten, während der öffentliche Downloadvertrag gültig bleibt."],
        ],
        check: ["Warum eignet sich der Download einer fertigen Rechnung für den ersten Schritt?", "Der lesende Vorgang hat einen kleinen Funktionsumfang und ein überprüfbares Ergebnis. Die Schreibverantwortung kann für den ersten Schritt bei der Altanwendung bleiben."],
        source: ["Martin Fowler · Strangler Fig", "https://martinfowler.com/bliki/StranglerFigApplication.html"],
      },
      {
        title: "Alte und neue Versionen gleichzeitig unterstützen",
        intro: "Parallel Change teilt eine inkompatible Änderung in Erweitern, Migrieren und Aufräumen auf. Beide Versionen können in der Übergangszeit den benötigten Vertrag verwenden.",
        sections: [
          ["Erweitern und Bestandsdaten übernehmen", "Ergänze eine neue Leseschnittstelle oder ein kompatibles Datenformat. Übertrage vorhandene Rechnungsdaten und übernimm neue Rechnungen aus der weiterhin führenden Altanwendung. Vergleiche Stichproben und Vollständigkeit, bevor der neue Download echten Verkehr erhält."],
          ["Nach Abschluss aufräumen", "Stelle die Aufrufer schrittweise um. Entferne alte Schnittstellen erst, wenn ihre Nutzer migriert sind und die vereinbarte Rückfallfrist abgelaufen ist. Während der Koexistenz gelten dieselben Zugriffsregeln auf beiden Pfaden."],
        ],
        example: {
          title: "Drei Schritte für den Download",
          columns: ["Phase", "Arbeitsschritt"],
          rows: [["Erweitern", "Neuen Downloadpfad ergänzen und Rechnungsdaten für ihn bereitstellen."], ["Migrieren", "Die neue Implementierung mit ausgewählten Konten prüfen und die Freigabe ausweiten."], ["Aufräumen", "Alten Downloadpfad nach der Beobachtungs- und Rückfallphase entfernen."]],
        },
        check: ["Ab wann kann der alte Downloadpfad entfernt werden?", "Wenn die Aufrufer umgestellt sind, die neue Variante stabil läuft und der vereinbarte Rückweg über den alten Downloadpfad nicht mehr erforderlich ist."],
        source: ["Danilo Sato · Parallel Change", "https://martinfowler.com/bliki/ParallelChange.html"],
      },
      {
        title: "Die Freigabe schrittweise an echten Daten prüfen",
        intro: "Bei einer Canary-Freigabe erhält eine kleine, abgegrenzte Gruppe zuerst die neue Version. Vergleiche sie mit einer Kontrollgruppe auf dem alten Pfad und erweitere die Freigabe anhand vorher vereinbarter Bedingungen.",
        sections: [
          ["Eine stabile Testgruppe bilden", "Leite bestimmte Testkonten konsistent zur neuen Umsetzung. Überwache technische Fehler und Antwortzeiten. Prüfe außerdem, ob jede erwartete Rechnung vorhanden ist, die fachlichen Werte übereinstimmen und der Server Zugriffsregeln auf beiden Pfaden durchsetzt."],
          ["Kriterien für den Abbruch festlegen", "Kläre vor dem Start, was die Freigabe stoppt. Ein fehlendes Dokument oder ein falscher Betrag gehört beispielsweise sofort untersucht. Eine definierte Beobachtungsdauer und eine Mindestanzahl von Downloads helfen, technische Messwerte einzuordnen."],
        ],
        check: ["Warum reicht eine unveränderte Fehlerrate bei der neuen Rechnungsausgabe nicht aus?", "Auch eine fachlich falsche Rechnung kann technisch erfolgreich ausgeliefert werden. Dokumentinhalt, Vollständigkeit und Zugriff brauchen eigene Prüfungen."],
        source: ["Google SRE · Canarying Releases", "https://sre.google/workbook/canarying-releases/"],
      },
      {
        title: "Den Rückweg nach einer Datenänderung planen",
        intro: "Das Zurückschalten von Anfragen und die Rückgabe der Datenverantwortung sind verschiedene Schritte. Je mehr sich die gespeicherten Daten verändert haben, desto mehr muss der Rückweg berücksichtigen.",
        sections: [
          ["Den lesenden Rückweg testen", "Schreibt weiter allein die Altanwendung, kann der Router den Download dorthin zurückleiten. Die alte Seite besitzt den führenden Datenstand. Prüfe vor der Freigabe, dass das alte Ziel erreichbar ist und auch neu hinzugekommene Rechnungen korrekt ausliefert."],
          ["Schreibverantwortung kontrolliert übergeben", "Beim Wechsel der führenden Schreibstelle braucht jede Rechnung eine eindeutige Schreibverantwortung. Plane vor dem Wechsel, wie die Rückgabe mit dem aktuellen Datenstand funktionieren würde. Ein Rückweg kann Schreibvorgänge vorübergehend anhalten, Änderungen der neuen Seite vollständig übertragen und prüfen und erst dann die alte Seite wieder schreiben lassen."],
        ],
        check: ["Wann reicht das bloße Zurückschalten der Anfragen auf die Altanwendung aus?", "Wenn die Altanwendung den benötigten aktuellen Datenstand und die nötige Funktion weiterhin bereitstellt. Hat die neue Seite allein geschrieben, müssen ihre Änderungen vor einem Rückwechsel berücksichtigt werden."],
        source: ["Microsoft Azure Architecture Center · Strangler Fig", "https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig"],
      },
    ],
    practice: {
      title: "Der Rechnungsdownload zieht schrittweise um",
      intro: "Ein Händler löst den Download fertiger Rechnungen aus einer Altanwendung. Die Altanwendung erstellt und speichert Rechnungen in der ersten Phase weiterhin verbindlich. Der Router kann kleine, feste Gruppen auf den neuen Download leiten. Eine spätere Phase soll auch die Rechnungserstellung übertragen.",
      comparison: {
        title: "Umschaltung und Rückweg je Phase prüfen", label: "Migrationsphase auswählen",
        variants: [
          { label: "Vorbereitung", details: [["Datenführung", "Altanwendung. Die neue Leseseite übernimmt und prüft Rechnungsdaten."], ["Verkehr", "Download weiterhin über den alten Pfad."]] },
          { label: "Testgruppe nutzt neuen Download", details: [["Datenführung", "Altanwendung. Neue Rechnungen werden auf die Leseseite übernommen."], ["Rückweg", "Router für die Testgruppe auf den alten Download zurückstellen."]] },
          { label: "Neues System erstellt bereits Rechnungen", details: [["Datenführung", "Das neue System hat bereits allein neue Rechnungen geschrieben."], ["Rückweg", "Bei einer Rückgabe der Schreibverantwortung neue Änderungen vollständig übertragen und prüfen, bevor die Altanwendung wieder schreibt."]] },
        ],
      },
      questions: [
        { prompt: "Welche Funktion ziehst du zuerst um?", answer: 1, options: ["Download, Erstellung, Korrekturen und Zahlung am selben Tag.", "Nur den Download bereits erstellter Rechnungen.", "Nur die Neuanlage, mit parallelen Schreibvorgängen beider Systeme."], clue: "Der erste Schritt soll einen überprüfbaren Eingang und Ausgang haben, während die Altanwendung die Schreibverantwortung behält.", explanation: "Ein lesender Ausschnitt ist in diesem Fall klein und gut prüfbar. Der alte Pfad hat weiterhin die führenden Rechnungsdaten." },
        { prompt: "Wann weitest du die Testfreigabe aus?", answer: 2, options: ["Sobald sich der erste Download öffnen lässt.", "Sobald die neue Ausgabe schneller ist, unabhängig vom Inhalt.", "Nach dem vereinbarten Vergleich von Fehlern, Antwortzeiten, Rechnungsdaten und Zugriffsregeln."], clue: "Auch ein technisch erfolgreicher Download kann ein falsches Dokument liefern.", explanation: "Die Freigabe braucht sowohl technische Stabilität als auch korrekte und geschützte Rechnungen." },
        { prompt: "Wie reagierst du auf falsche Beträge beim neuen lesenden Download?", answer: 0, options: ["Die Ausweitung stoppen und die Testgruppe auf den alten Download zurückleiten.", "Die Ergebnisse beider Seiten beim Download zusammenführen.", "Die Altanwendung sofort abschalten und die neuen Beträge übernehmen."], clue: "In dieser Phase erstellt und speichert die Altanwendung alle Rechnungen verbindlich.", explanation: "Das alte Ziel führt die Daten und kann die korrekten Rechnungen weiterhin ausliefern. Der Fehler der neuen Leseseite lässt sich anschließend untersuchen." },
        { prompt: "Was brauchst du beim Rückweg, wenn das neue System bereits allein Rechnungen geschrieben hat?", answer: 1, options: ["Nur dieselbe Routerregel wie in der Lesephase.", "Eine kontrollierte Rückgabe der Schreibverantwortung mit vollständiger, geprüfter Übernahme neuer Änderungen.", "Beide Anwendungen ab sofort unabhängig schreiben lassen."], clue: "Überlege, welche Rechnungen die Altanwendung seit der Übergabe noch nie gesehen hat.", explanation: "Nur mit einem abgeglichenen aktuellen Stand kann die Altanwendung wieder verbindlich schreiben, ohne neue Rechnungen zu verlieren." },
      ],
      summary: "Du hast eine kleine Funktion zuerst umgestellt, den Übergang stufenweise überprüft und den Rückweg für beide Phasen anhand der Datenverantwortung geplant.",
    },
  },
];
