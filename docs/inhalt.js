"use strict";

const topics = [
  { id: "softwaredesign", title: "Softwaredesign", description: "Entwirf Module und Schnittstellen so, dass sich Regeln ändern lassen und das Verhalten überprüfbar bleibt.", color: "mint", nodes: ["Aufrufer", "Vertrag", "Modul"] },
  { id: "softwarearchitektur", title: "Softwarearchitektur", description: "Triff Entscheidungen über das Gesamtsystem, leite sie aus Qualitätszielen ab und mache ihre Folgen nachvollziehbar.", color: "lavender", nodes: ["Qualitätsziel", "Entscheidung", "System"] },
];

const quests = [
  ...softwaredesignQuests,
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
        check: ["Die Verbindung fällt gerade aus. Der letzte Stand ist schon viereinhalb Minuten alt. Wie lange darf er noch angezeigt werden?", "Noch dreißig Sekunden. Entscheidend ist das Alter der Daten und damit der Zeitpunkt ihres letzten gültigen Stands."],
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
      preview: { label: "Alter des letzten Datenstands in Minuten", limit: 5, max: 8 },
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
        title: "Die passende Architektursicht auswählen",
        intro: "Eine Sicht stellt die Teile und Beziehungen dar, die zur Frage einer Zielgruppe passen. Die Entscheidung selbst und ihre Darstellung erfüllen unterschiedliche Aufgaben.",
        sections: [
          ["Modul- und Laufzeitsicht", "Die Modulsicht zeigt die Struktur des Quellcodes und Abhängigkeiten zwischen Modulen. Eine Laufzeitsicht zeigt zum Beispiel den Weg eines Uploads von der Webanwendung über die Warteschlange bis zum Worker."],
          ["Verteilungssicht für den Betrieb", "Die Verteilungssicht ordnet laufende Software ihrer Infrastruktur zu. Sie kann zeigen, dass die Webanwendung und Worker in getrennten Gruppen laufen. Definiere, was Kästen und Verbindungen bedeuten, damit klar bleibt, ob sie Code, Aufrufe oder Infrastruktur darstellen."],
        ],
        check: ["Welche Sicht zeigt, wo du zusätzliche Worker-Instanzen bereitstellen kannst?", "Die Verteilungssicht, denn sie ordnet die Worker ihrer Laufzeitumgebung zu."],
        source: ["IEEE SWEBOK · Architecture Views and Viewpoints", "https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf#page=71"],
      },
      {
        title: "Den Weg eines Bildauftrags beschreiben",
        intro: "Eine Laufzeitsicht zeigt, wie die Teile zusammenarbeiten. Bei asynchroner Verarbeitung sind die Annahme eines Auftrags und seine Fertigstellung zwei getrennte Ereignisse.",
        sections: [
          ["Die Schritte in Reihenfolge festhalten", "Die Webanwendung speichert das Bild und legt einen Auftrag in die Warteschlange. Sobald das System den Auftrag zuverlässig übernommen hat, kann die Webanwendung „angenommen“ melden. Der Worker holt den Auftrag später ab und speichert das Vorschaubild."],
          ["Wartezeit und Fehler sichtbar machen", "Die Redaktion kann einen Status wie „wartet“, „fertig“ oder „fehlgeschlagen“ sehen. Bei einem vorübergehenden Fehler kann der Auftrag erneut verarbeitet werden. Beschreibe auch diesen Ablauf, damit der Betrieb weiß, wo er nach einem Fehler suchen muss."],
        ],
        example: {
          title: "Laufzeitablauf eines Bildimports",
          columns: ["Systemteil", "Was er tut"],
          rows: [["Webanwendung", "Nimmt Bild und Auftrag an und meldet den Eingang"], ["Warteschlange", "Hält den Auftrag bereit, bis ein Worker ihn abholt"], ["Worker", "Erstellt das Vorschaubild und hinterlegt das Ergebnis"]],
        },
        check: ["Was kann die Redaktion aus dem Status „angenommen“ schließen?", "Der Auftrag wurde übernommen. Das Vorschaubild ist erst dann verfügbar, wenn die Verarbeitung erfolgreich abgeschlossen wurde."],
        source: ["Microsoft Azure Architecture Center · Queue-Based Load Leveling", "https://learn.microsoft.com/en-us/azure/architecture/patterns/queue-based-load-leveling"],
      },
      {
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
];
