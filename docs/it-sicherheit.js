"use strict";

const sicherheitsQuests = [
  {
    id: "schutzziele-abwaegen", topic: "it-sicherheit", title: "Was wollen wir eigentlich schützen?",
    description: "Untersuche drei Vorfälle beim Turnier und setze ein knappes Schutzbudget ein.",
    lessons: [{
      title: "Drei Vorfälle, drei Arten von Schaden", lab: "schutzbudget", discover: true,
      intro: "Die drei Fälle unterscheiden sich darin, was verloren ging. Diese Unterscheidung hilft dir, eine passende Maßnahme einzukaufen.",
      sections: [
        ["Vertraulichkeit", "Nur berechtigte Personen sollen Informationen sehen. Bei der öffentlichen Mitgliederliste verlieren Mitglieder die Kontrolle über private Kontaktdaten. Eine Rechteprüfung schützt den Zugriff, während das Entfernen der Liste allein bereits geladene Kopien nicht zurückholt."],
        ["Integrität", "Daten sollen richtig bleiben und Änderungen nachvollziehbar sein. Beim falschen Ergebnis kann eine Mannschaft ausscheiden. Eine zweite Freigabe senkt die Gefahr, dass eine unbemerkte Änderung veröffentlicht wird."],
        ["Verfügbarkeit", "Berechtigte sollen die Information dann nutzen können, wenn sie sie brauchen. Ein bereitgelegter, datierter Aushang hilft beim Ausfall der Website. Bei kurzfristigen Änderungen kann er veralten."],
        ["Ein Risiko bleibt übrig", "Frage, wie wahrscheinlich ein Vorfall ist und wie schwer sein Schaden wäre. Budget, Turnierbetrieb und betroffene Personen bestimmen, welche Risiken du zuerst senkst. Halte fest, wer sich um das übrige Risiko kümmert."],
      ],
      check: ["Wenn die Spiele gleich anfangen und ein alter Spielplan ausliegt, welche zwei Schutzziele sind relevant?", "Der erreichbare Aushang verbessert die Verfügbarkeit. Ein alter Stand gefährdet die Integrität der Information. Kennzeichne den Stand und bestimme, wer Änderungen nachträgt."],
      source: ["NIST FIPS 199 · Vertraulichkeit, Integrität und Verfügbarkeit", "https://csrc.nist.gov/pubs/fips/199/final"],
    }],
    learning: {
      openings: ["Beim Turnier des fiktiven SV Uferpark taucht die Mitgliederliste öffentlich auf. Eine Mannschaft meldet ein falsches Ergebnis. Kurz darauf lädt der Spielplan nicht mehr. Wer trägt in jedem Fall den Schaden?"],
      transfer: {
        prompt: "Eine Prüferin bemerkt erst am Abend, dass jemand den Betrag eines Beitrags geändert hat. Welche Kontrolle passt künftig am besten?",
        options: ["Beitragsänderungen protokollieren und unabhängig prüfen.", "Die Beitragsseite zusätzlich ausdrucken.", "Die Ladezeit der Beitragsseite verkürzen."], answer: 0,
        clue: "Achte darauf, dass der Betrag lesbar und erreichbar war. Welchen Unterschied hätte eine erkennbare Änderung gemacht?",
        explanation: "Ein Protokoll und eine unabhängige Kontrolle helfen, fehlerhafte Änderungen zu erkennen und zu korrigieren.",
      },
    },
    practice: {
      title: "Neuer Fall: Die Beitragsdatei beim Sommerfest",
      intro: "Die Kassenprüfung braucht die korrekten Beträge. Entscheide, welcher Schaden im Vordergrund steht und welche Kontrolle dazu passt.",
      questions: [{
        prompt: "Alle Berechtigten können die Datei öffnen. Ein falscher Betrag führt zu einer falschen Mahnung. Welches Schutzziel wurde verletzt?",
        options: ["Verfügbarkeit", "Integrität", "Vertraulichkeit"], answer: 1,
        clue: "Vergleiche den gespeicherten Betrag mit der tatsächlichen Zahlung.", explanation: "Der Betrag ist falsch. Das ist eine Verletzung der Integrität.",
      }],
      summary: "Du hast den Schaden einem Schutzziel zugeordnet und eine gezielte Kontrolle gewählt.",
    },
  },
  {
    id: "vereinskonto-sichern", topic: "it-sicherheit", title: "Wie sichere ich ein Konto, ohne mich selbst auszusperren?",
    description: "Richte ein fiktives Konto ein und teste Passwortverlust und Smartphone-Verlust getrennt.",
    lessons: [{
      title: "Anmeldung und Wiederherstellung planen", lab: "vereinskonto", discover: true,
      intro: "Teste den Schutz vor fremdem Zugriff und deinen eigenen Ersatzweg getrennt. Ein Konto kann beim ersten Test gut abschneiden und dich beim zweiten aussperren.",
      sections: [
        ["Ein eigenes Passwort pro Konto", "Ein Passwortmanager kann lange, unterschiedliche Passwörter erzeugen und verwahren. Wird das Passwort eines anderen Dienstes bekannt, passt es dann nicht zum Vereinsportal. Ist das Vereinskennwort selbst bereits bekannt, ändert die Ablage im Manager daran nichts."],
        ["Zweiter Faktor und Passkey", "Mit einem App-Code verlangt das Portal zusätzlich zum Passwort einen Nachweis vom eingerichteten Gerät. Ein Passkey verwendet stattdessen einen kryptografischen Schlüssel, der an den Dienst gebunden ist. In dieser Simulation liegt er nur auf dem Smartphone. In der Praxis können manche Passkeys über einen geschützten Dienst synchronisiert werden."],
        ["Ein Ersatzweg vor dem Verlust", "Registriere, wenn möglich, ein zweites Gerät oder bewahre Wiederherstellungscodes getrennt auf. Der Anbieter legt fest, welche Nachweise ausreichen. Melde ein verlorenes Gerät und entferne dessen Anmeldemittel und Sitzungen, sobald du wieder Zugang hast."],
      ],
      check: ["Was passiert, wenn Passwortmanager, App-Code und Wiederherstellungscode ausschließlich auf dem verlorenen Handy liegen?", "Alle vorgesehenen Wege hängen am selben Gerät. Ein unabhängig erreichbares Ersatzgerät oder getrennt aufbewahrter Wiederherstellungsnachweis würde diesen gemeinsamen Ausfall vermeiden."],
      source: ["NIST SP 800-63B · Authentifizierung und Kontowiederherstellung", "https://pages.nist.gov/800-63-4/sp800-63b.html#account-recovery"],
    }],
    learning: {
      openings: ["Leni verwaltet den Spielplan im Mitgliederportal. Ihr Handy ist bisher der einzige Ort, an dem sie ihre Anmeldung eingerichtet hat. Richte ihr Demo-Konto ein und probiere beide Störfälle aus."],
      transfer: {
        prompt: "Wo würdest du einen Ersatznachweis für den Handyverlust aufbewahren?",
        options: ["Als Foto ausschließlich auf demselben Handy.", "Geschützt und getrennt vom Handy, mit zuvor geprüftem Wiederherstellungsweg.", "Offen auf dem von allen genutzten Laptop."], answer: 1,
        clue: "Der Ersatz muss erreichbar sein, wenn das Handy fehlt, und zugleich vor anderen geschützt bleiben.",
        explanation: "Eine getrennte, geschützte Ablage hilft der berechtigten Person, ohne den Ersatznachweis allen anderen zugänglich zu machen.",
      },
    },
    practice: {
      title: "Neuer Fall: Das Helferkonto für die Laufgruppe",
      intro: "Das Portal akzeptiert Passwort und App-Code. Der Kassenwart erfährt, dass das Portalpasswort öffentlich geworden ist. Das Smartphone hat er noch bei sich.",
      questions: [{
        prompt: "Wer kann sich in diesem Fall mit dem bekannten Passwort allein neu anmelden?",
        options: ["Jede Person, die das Passwort kennt.", "Niemand. Das Portal verlangt zusätzlich den eingerichteten App-Code."], answer: 1,
        clue: "Welche zweite Prüfung verlangt dieses Portal bei einer neuen Anmeldung?", explanation: "Der App-Code fehlt den Personen, die nur das Passwort kennen. Das bekannte Passwort sollte dennoch ersetzt werden.",
      }],
      summary: "Du hast den zweiten Faktor und einen unabhängigen Ersatzweg passend zum Fall beurteilt.",
    },
  },
  {
    id: "phishing-pruefen", topic: "it-sicherheit", title: "Die Nachricht vom Vorstand – echt oder Phishing?",
    description: "Untersuche ein lokales Demo-Postfach und bestätige Bitten über einen bekannten Kontaktweg.",
    lessons: [{
      title: "Eine Bitte unabhängig überprüfen", lab: "vereins-postfach", discover: true,
      intro: "Phishing täuscht eine vertrauenswürdige Nachricht vor, um eine Handlung auszulösen. Eine verdächtige Beobachtung ist ein Anlass zum Prüfen. Die unabhängige Rückfrage klärt, ob die konkrete Bitte echt ist.",
      sections: [
        ["Name, Adresse und Linkziel", "Ein Anzeigename kann wie der Name des Vorstands aussehen. Prüfe, welche Absenderadresse das Postfach anzeigt und welche Domain das Linkziel tatsächlich hat. Auch eine vertraute Adresse ist nur ein Hinweis, denn ein echtes Konto kann missbraucht werden."],
        ["Druck und Schreibstil", "Eine Frist kann zu einer echten Aufgabe gehören. Auch eine sprachlich einwandfreie Nachricht kann täuschen. Entscheidend ist, ob die Bitte zur Aufgabe passt und sich ohne die Kontaktdaten aus der verdächtigen Nachricht bestätigen lässt."],
        ["Getrennter Kontaktweg", "Rufe unter der bereits gespeicherten Vereinsnummer an oder frage persönlich nach. Lass dir die konkrete Zahlung oder Änderung bestätigen. Wenn sie nicht bestätigt werden kann, halte die Handlung zurück und melde die Nachricht im Verein."],
      ],
      check: ["Eine Nachricht kommt von einer bekannten Adresse und fordert neue Bankdaten. Was würdest du unabhängig bestätigen?", "Frage über die bereits bekannte Nummer, ob der Wechsel vereinbart wurde und welche konkreten Angaben gelten. Die Adresse allein bestätigt die Änderung nicht."],
      source: ["BSI · Das Internet sicher nutzen", "https://www.bsi.bund.de/SharedDocs/Downloads/DE/BSI/Publikationen/Broschueren/Wegweiser_Checklisten_Flyer/Brosch_A6_Surfen_aber_sicher.pdf?__blob=publicationFile"],
    }],
    learning: {
      openings: ["Beim SV Uferpark kommt kurz vor dem Spiel eine Zahlungsbitte vom angeblichen Vorstand an. Im selben Postfach liegen zwei weitere Nachrichten. Untersuche die Hinweise, bevor du über die Bitten entscheidest."],
      transfer: {
        prompt: "Welcher Kontaktweg ist in diesem Fall unabhängig?",
        options: ["Die im E-Mail-Text neu genannte Handynummer.", "Die schon vor der Nachricht im Vereinsverzeichnis gespeicherte Nummer.", "Die Antwortschaltfläche derselben E-Mail."], answer: 1,
        clue: "Suche einen Kontaktweg, den eine Person, die diese Nachricht verschickt hat, nicht zugleich vorgeben konnte.",
        explanation: "Die früher gespeicherte Nummer kommt aus einer unabhängigen Quelle.",
      },
    },
    practice: {
      title: "Neuer Fall: Geänderte Rechnung für die Trikots",
      intro: "Eine fehlerfrei formulierte Nachricht nennt neue Zahlungsdaten. Sie zeigt den korrekten Namen und die gewohnte E-Mail-Adresse des Lieferanten.",
      questions: [{
        prompt: "Was tust du vor der Überweisung?",
        options: ["Sofort zahlen, weil die Absenderadresse stimmt.", "Die Änderung zurückhalten und den Lieferanten über einen bekannten Weg fragen."], answer: 1,
        clue: "Was kannst du aus der Absenderzeile ableiten, und welche konkrete Aussage über die Bankverbindung fehlt noch?", explanation: "Eine getrennte Rückfrage klärt, ob der Lieferant die Zahlungsdaten tatsächlich geändert hat.",
      }],
      summary: "Du hast technische Hinweise von der Bestätigung der konkreten Bitte unterschieden.",
    },
  },
  {
    id: "vereinsrechte-vergeben", topic: "it-sicherheit", title: "Eingeloggt – aber was darf ich sehen?",
    description: "Vergib Rechte für drei Rollen und finde fehlende und übermäßige Freigaben.",
    lessons: [{
      title: "Rollen, Aufgaben und Datenbereiche", lab: "vereinsrechte", discover: true, relatedQuest: "sicherheitsgrenzen-entwerfen",
      intro: "Die Anmeldung belegt, wer das Konto benutzt. Für jede Aktion prüft das Portal zusätzlich, ob diese Person genau diese Daten lesen, ändern oder exportieren darf.",
      sections: [
        ["Authentifizierung und Autorisierung", "Authentifizierung ist der Nachweis der Identität. Autorisierung ist die Entscheidung, ob eine Aktion erlaubt ist. Auch für ein angemeldetes Mitglied muss der Server prüfen, ob die angeforderte Adresse zum eigenen Profil gehört."],
        ["Geringste Rechte", "Gib jeder Rolle nur die Rechte, die sie für ihre Aufgaben benötigt. Die Trainerin braucht Kontakte ihrer Mannschaft, aber keine Gesamtliste. Der Kassenwart erhält in dieser Übung den genehmigten Export für den Jahresversand. In einem echten Portal lässt sich diese Freigabe zusätzlich zeitlich begrenzen und protokollieren."],
        ["Positive und negative Tests", "Teste, ob die gewollte Aktion gelingt, und ob ein Vergleichsfall mit fremden Daten gesperrt ist. Eine im Browser ausgeblendete Schaltfläche ersetzt die serverseitige Entscheidung nicht."],
      ],
      check: ["Was würdest du testen, wenn eine Trainerin das Team wechselt?", "Sie soll die Kontakte des neuen Teams erreichen und die Kontakte des alten Teams verlieren. Prüfe beides mit ihrer Rolle und den jeweiligen Datensätzen."],
      source: ["OWASP · Authorization Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html"],
    }],
    learning: {
      openings: ["Nach dem Training kann ein Mitglied seine eigene Adresse nicht ändern. Die Trainerin fragt nach Teamkontakten und der Kassenwart braucht für den genehmigten Jahresversand einen Export. Richte Rollen ein und teste den Vereinsalltag."],
      transfer: {
        prompt: "Wo muss geprüft werden, ob eine Trainerin die konkret angeforderte Mannschaft betreut?",
        options: ["Nur in der Browseransicht, die sonst keinen Knopf zeigt.", "Auf dem Server bei jeder passenden Anfrage, mit Rolle und Mannschaft.", "Einmal für alle Mannschaften, wenn die Trainerin sich anmeldet."], answer: 1,
        clue: "Eine Anmeldung beantwortet die Frage nach der Identität. Wer entscheidet über den konkreten Datensatz?",
        explanation: "Die serverseitige Prüfung verbindet die Identität, die Rolle, den Vorgang und die angeforderten Daten.",
      },
    },
    practice: {
      title: "Neuer Fall: Eine Vertretung für die Jugendmannschaft",
      intro: "Eine Trainerin springt eine Woche lang für die Jugendmannschaft ein. Sie soll deren Eltern kontaktieren können.",
      questions: [{
        prompt: "Welche Freigabe passt zur Aufgabe?",
        options: ["Den Export aller Mitglieder dauerhaft erlauben.", "Befristeten Lesezugriff auf die benötigten Kontakte der Jugendmannschaft geben.", "Ihr das Konto des Kassenwarts überlassen."], answer: 1,
        clue: "Welche Daten und welche Aktion braucht die Trainerin wirklich, und wie lange?", explanation: "Der befristete Teamzugriff deckt die Aufgabe ab und begrenzt zusätzliche Rechte.",
      }],
      summary: "Du hast die Ausnahme auf Rolle, Aktion, Datenbereich und Zeitraum begrenzt.",
    },
  },
  {
    id: "verbindung-und-datei-pruefen", topic: "it-sicherheit", title: "Was schützt eine verschlüsselte Verbindung?",
    description: "Verfolge eine Anmeldung mit HTTP und HTTPS und überprüfe eine Übungsdatei per SHA-256.",
    lessons: [{
      title: "Vom Browser bis zum Zielserver", lab: "anmeldeweg", discover: true,
      intro: "HTTPS schützt den Transport zur geprüften Domain. Der empfangende Server verarbeitet die Anmeldung und kann die übergebenen Daten lesen.",
      sections: [
        ["Schutz unterwegs", "Ohne TLS kann eine Person mit Zugriff auf den Datenverkehr die gesendeten Inhalte lesen und unter Umständen verändern. Bei HTTPS verschlüsselt TLS die Inhalte und schützt sie vor Änderungen auf dem Weg. Je nach Netz und Technik bleiben Verbindungsmetadaten wie Zeitpunkt oder Ziel-IP sichtbar."],
        ["Welche Domain bestätigt wurde", "Der Browser prüft das Zertifikat gegen den Hostnamen der aufgerufenen Adresse. Ein gültiges Zertifikat einer ähnlich benannten Domain sagt nichts darüber, ob diese Seite zum Verein gehört. Öffne das Vereinsportal über eine bekannte Adresse, bevor du Daten eingibst."],
      ],
      check: ["Wer könnte die Anmeldung auch bei gültigem HTTPS auf einer falschen Seite lesen?", "Der Server der falschen Seite. TLS schützt die Verbindung dorthin. Darum ist das tatsächliche Ziel der Verbindung wichtig."],
      source: ["OWASP · Transport Layer Security Cheat Sheet", "https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Security_Cheat_Sheet.html"],
    }, {
      title: "Hat sich der Spielplan verändert?", lab: "datei-hash", discover: true,
      intro: "Ein kryptografischer Hash wie SHA-256 bildet den Dateiinhalt auf einen kurzen Prüfwert fester Länge ab. Schon ein einzelnes geändertes Zeichen führt bei dieser Übung zu einem anderen Wert.",
      sections: [
        ["Vergleichen statt entschlüsseln", "Ein Hash wird aus den Bytes berechnet. Er dient hier als Fingerabdruck und lässt sich nicht wie ein verschlüsselter Text öffnen. Auch ein Zeilenumbruch zählt als Dateiinhalt."],
        ["Der Vergleichswert muss vertrauenswürdig sein", "Hole den Sollwert aus einer unabhängigen, verlässlichen Quelle. Wer eine Datei und den daneben stehenden Sollwert gleichzeitig austauschen kann, kann auch einen passenden neuen Wert veröffentlichen."],
      ],
      check: ["Warum reicht es nicht, nach einer Änderung einfach den neuen Hash als Sollwert einzutragen?", "Dann vergleichst du die Datei nur mit sich selbst. Die vertrauenswürdige Referenz soll zeigen, ob sie dem freigegebenen Stand entspricht."],
      source: ["NIST FIPS 180-4 · Secure Hash Standard", "https://csrc.nist.gov/pubs/fips/180-4/upd1/final"],
    }],
    learning: {
      openings: ["Beim Auswärtsspiel meldet sich Leni im Vereinsportal an. Das fremde WLAN ist derselbe Übertragungsweg für drei unterschiedliche Verbindungen. Wer kann Lenis Demo-Daten an den einzelnen Stationen lesen?", "Die Turnierleitung hat den Spielplan freigegeben und seinen SHA-256-Wert separat notiert. Eine Datei taucht mit anderer Anstoßzeit auf. Vergleiche sie mit der freigegebenen Fassung."],
      transfer: {
        prompt: "Welcher Vergleich zeigt, ob deine Datei zum freigegebenen Stand passt?",
        options: ["Den Hash der Datei mit dem separat und vertrauenswürdig bereitgestellten Sollwert vergleichen.", "Den Dateinamen mit der Überschrift vergleichen.", "Den neu berechneten Hash zweimal hintereinander anzeigen."], answer: 0,
        clue: "Suche einen Vergleich, der von der zu prüfenden Kopie unabhängig ist.", explanation: "Der unabhängig bereitgestellte Hash ist die Referenz für die freigegebenen Bytes.",
      },
    },
    practice: {
      title: "Neuer Fall: Die Wettkampfliste liegt auf einer anderen Domain",
      intro: "Ein Link aus dem Chat öffnet eine verschlüsselte Verbindung zu einer fast gleich geschriebenen Adresse. Du erwartest die Liste im bekannten Vereinsportal.",
      questions: [{
        prompt: "Was bestätigt das gültige Zertifikat für die angezeigte Domain?",
        options: ["Dass die Website zum Verein gehört.", "Dass die Verbindung zum geprüften Hostnamen geschützt ist. Ob es die Vereinsadresse ist, prüfst du separat."], answer: 1,
        clue: "Vergleiche den Hostnamen im Browser mit dem, den du vom Verein kennst.", explanation: "Eine gültige Verbindung kann zum falschen Ziel führen. Öffne die bekannte Adresse des Vereins direkt.",
      }],
      summary: "Du hast das Ziel einer Verbindung und die Integrität einer Datei mit jeweils passenden Nachweisen geprüft.",
    },
  },
  {
    id: "updates-priorisieren", topic: "it-sicherheit", title: "Welches Update kommt zuerst?",
    description: "Plane zwei kurze Wartungsfenster für Laptop, Router und Vereinswebsite.",
    lessons: [{
      title: "Erreichbarkeit, Risiko und Funktionstest", lab: "wartungsfenster", discover: true,
      intro: "Ein Sicherheitsupdate schließt bekannte Schwachstellen. Die Reihenfolge hängt davon ab, welche Systeme betroffen und erreichbar sind und welche Folgen eine Störung hätte.",
      sections: [
        ["Erreichbarkeit verändert die Dringlichkeit", "Ein direkt aus dem Internet erreichbarer Dienst ist anders exponiert als eine Verwaltungsoberfläche im internen Netz. Hinweise auf laufenden Missbrauch erhöhen die Dringlichkeit. Plane im Verein zugleich, wann die Betroffenen eine Unterbrechung verkraften."],
        ["Installiert und funktionsfähig sind zwei Prüfungen", "Nutze Updates aus der vorgesehenen Quelle. Prüfe die installierte Version und teste danach die wichtigste Aufgabe, etwa die öffentliche Spielplanseite oder den Internetzugang aus dem Vereins-WLAN."],
        ["Code ohne weitere Updates", "Ein Gerät ohne Sicherheitsupdates bleibt bei neu entdeckten Schwachstellen verwundbar. Hohe Erreichbarkeit verschärft das Risiko. Plane die Ablösung oder entferne das Gerät bis dahin aus dem erreichbaren Betrieb."],
      ],
      check: ["Der Router muss bis zum Ersatz eine Woche weiterlaufen. Welche Änderung kann die Gefahr bis dahin senken?", "Eine unnötige Fernverwaltung abschalten und den Zugriff auf die Verwaltung auf ein vertrauenswürdiges internes Netz beschränken. Die Ablösung bleibt erforderlich, wenn Sicherheitsupdates dauerhaft fehlen."],
      source: ["NIST SP 800-40 Rev. 4 · Planung von Sicherheitsupdates", "https://csrc.nist.gov/pubs/sp/800/40/r4/final"],
    }],
    learning: {
      openings: ["Der SV Uferpark hat vor dem nächsten Heimspiel genau ein kurzes Wartungsfenster. Drei Geräte melden Updates. Wähle anhand der Hinweise aus, welches zuerst drankommt, und prüfe, ob es danach seinen Dienst erfüllt."],
      transfer: {
        prompt: "Welche Prüfung schließt die Wartung des Ersatzrouters sinnvoll ab?",
        options: ["Nur prüfen, ob die Verpackung das richtige Modell nennt.", "Aktuellen Update-Stand prüfen und aus dem Vereins-WLAN einen normalen Seitenaufruf testen.", "Nur den Gerätenamen ändern."], answer: 1,
        clue: "Du brauchst einen Nachweis für die installierte Version und für die wichtigste Aufgabe des Geräts.",
        explanation: "Versionsprüfung und Funktionstest beantworten verschiedene Fragen. Beide gehören zur Wartung.",
      },
    },
    practice: {
      title: "Neuer Fall: Der alte Router bekommt keine Updates mehr",
      intro: "Die Verwaltung des Routers ist von außen erreichbar. Der Hersteller stellt keine Sicherheitsupdates mehr bereit.",
      questions: [{
        prompt: "Welche Maßnahme ist am sinnvollsten?",
        options: ["Den Router neu starten und auf den nächsten Patch hoffen.", "Den Fernzugriff abschalten und einen unterstützten Ersatz einplanen.", "Nur den Namen des WLANs ändern."], answer: 1,
        clue: "Was begrenzt die Erreichbarkeit sofort, und wodurch werden künftige Sicherheitskorrekturen wieder möglich?", explanation: "Die Reichweite sinkt sofort. Ein unterstütztes Gerät kann danach wieder Sicherheitsupdates erhalten.",
      }],
      summary: "Du hast Erreichbarkeit und Update-Support berücksichtigt und die Wartung mit einem Funktionstest abgeschlossen.",
    },
  },
  {
    id: "sicherung-wiederherstellen", topic: "it-sicherheit", title: "Das Backup war grün – kommen die Daten wirklich zurück?",
    description: "Verfolge eine Löschung und prüfe zwei wiederhergestellte Sicherungsstände.",
    lessons: [{
      title: "Die Löschung und die Sicherungsstände", lab: "sicherungszeit", discover: true,
      intro: "Synchronisation hält Arbeitskopien auf demselben Stand. Eine getrennte, versionierte Sicherung kann einen älteren Stand erhalten, auch wenn die Arbeitskopien die Löschung übernommen haben.",
      sections: [
        ["Eine Änderung wandert mit", "Der synchronisierte Ordner übernimmt hier auch Löschungen. Manche Dienste bieten einen Papierkorb oder einen Versionsverlauf. Im Beispiel gibt es dort keinen unabhängigen Sicherungsstand."],
        ["Wiederherstellen und lesen", "Stelle einen geeigneten Stand zunächst separat wieder her. Öffne die Datei und prüfe Stichproben und Vollständigkeit. Ein grüner Backup-Status zeigt nur, dass der Sicherungslauf gemeldet wurde."],
        ["Lücke nach der Sicherung", "Neue Daten zwischen Sicherung und Löschung fehlen im wiederhergestellten Stand. Nutze vertrauenswürdige Quellen wie bestätigte Anmeldungen, um diese Lücke zu schließen. Häufigere Sicherungen verkleinern die mögliche Lücke."],
      ],
      check: ["Warum lohnt es sich, auch den zweitneuesten Stand anzusehen?", "Die neueste Sicherung könnte bereits den Fehler enthalten oder sich nicht lesen lassen. Ein zweiter erhaltener Stand gibt dir einen weiteren überprüfbaren Rückweg."],
      source: ["NIST SP 800-184 · Wiederherstellung nach Sicherheitsereignissen", "https://csrc.nist.gov/pubs/sp/800/184/final"],
    }],
    learning: {
      openings: ["Am Freitag löscht ein Helfer die Mitgliederliste vom Vereinslaptop. Die Anzeige der Sicherungssoftware war am Donnerstag grün. Spule die Uhr vor und schau nach, in welchen Speicherorten die Datei tatsächlich vorhanden ist."],
      transfer: {
        prompt: "Wie gehst du mit neuen Einträgen nach der letzten Sicherung um?",
        options: ["Sie aus einer verlässlichen Quelle wie bestätigten Anmeldungen abgleichen und ergänzen.", "Die wiederhergestellte Datei offen liegen lassen, bis sie von selbst vollständig wird.", "Annehmen, dass ein grüner Status alle späteren Änderungen umfasst."], answer: 0,
        clue: "Der Zeitstempel begrenzt, welche Änderungen dieser Sicherungslauf enthalten kann.",
        explanation: "Der geprüfte Sicherungsstand ist die Ausgangsbasis. Später bestätigte Änderungen müssen separat ergänzt werden.",
      },
    },
    practice: {
      title: "Neuer Fall: Wiederherstellung der Helferliste",
      intro: "Die Liste wurde am Mittwoch gelöscht. Eine getrennte Kopie vom Dienstag ist vorhanden. Am Mittwochmorgen meldeten sich zwei neue Helferinnen an.",
      questions: [{
        prompt: "Woran erkennst du, dass die Wiederherstellung für den Einsatz genügt?",
        options: ["Das Backup-Symbol leuchtet grün.", "Die wiederhergestellte Datei lässt sich lesen, der Inhalt stimmt mit dem erwarteten Stand überein und spätere Einträge sind geklärt."], answer: 1,
        clue: "Überlege, was die Farbe des Symbols über die geöffnete Datei und die zwei Einträge aussagt.", explanation: "Lesbarkeit und Vollständigkeit werden erst geprüft, wenn der Stand tatsächlich wiederhergestellt und verglichen wurde.",
      }],
      summary: "Du hast den Wiederherstellungsstand geprüft und die zeitliche Datenlücke berücksichtigt.",
    },
  },
  {
    id: "vereinsvorfall-bearbeiten", topic: "it-sicherheit", title: "Abschlussfall: Im Vereinskonto stimmt etwas nicht",
    description: "Ordne Meldungen, beende eine unbekannte Sitzung und prüfe den sicheren Weiterbetrieb.",
    lessons: [{
      title: "Was die Zeitleiste wirklich zeigt", lab: "vorfall-zeitlinie", discover: true,
      intro: "Sammle Beobachtungen mit Uhrzeit und Quelle, bevor du Schlüsse ziehst. Eine Meldung über eine Anmeldeanfrage und ein protokollierter Sitzungsstart sind unterschiedliche Ereignisse.",
      sections: [
        ["Beobachtung und Deutung", "Eine unbekannte Sitzung ist ein Hinweis auf einen möglichen Vorfall. Ein Zeitstempel zeigt, wann der Dienst etwas protokollierte. Die Person hinter der Sitzung und mögliche Zugriffe auf Daten müssen separat geklärt werden."],
        ["Belege erhalten", "Sichere die nötigen Meldungen und Protokolle gezielt für das zuständige Team. Halte fest, wer wann welche Beobachtung machte und welche Maßnahmen danach durchgeführt wurden."],
      ],
      check: ["Beweist die Sitzungsliste, dass Mitgliederdaten exportiert wurden?", "Die Sitzungsliste belegt im Beispiel einen Sitzungsstart. Für einen Export brauchst du zusätzliche Protokolle oder andere Belege."],
      source: ["NIST SP 800-61 Rev. 3 · Erkennung, Reaktion und Wiederherstellung", "https://csrc.nist.gov/pubs/sp/800/61/r3/final"],
    }, {
      title: "Zugriff unterbrechen und Weiterbetrieb prüfen", lab: "vorfall-reaktion", discover: true,
      intro: "Eine bereits bestehende Sitzung kann unabhängig vom Passwortwechsel gültig bleiben. Dieses fiktive Portal beendet Sitzungen erst bei einem eigenen Widerruf.",
      sections: [
        ["Zugriff begrenzen", "Melde den Vorfall an die zuständige Person. Widerrufe unbekannte Sitzungen über die Verwaltung und tausche möglicherweise kompromittierte Anmeldedaten. Prüfe außerdem Anmeldemittel und Wiederherstellungsoptionen, damit kein unvertrauter Zugang bestehen bleibt."],
        ["Funktions- und Sicherheitsprüfung", "Kontrolliere, ob die alte Sitzung abgewiesen wird und die berechtigte Trainerin sich über den eingerichteten Weg neu anmelden kann. Prüfe die nötigen Vereinsfunktionen. Dokumentiere offene Fragen und kontrolliere die Protokolle weiter."],
      ],
      check: ["Was kannst du sagen, wenn beide Anmeldetests passen, aber Logs für einen Teil des Zeitraums fehlen?", "Das Konto kann nach den geprüften Maßnahmen kontrolliert weitergenutzt werden. Für den nicht protokollierten Zeitraum bleibt offen, ob Daten abgerufen wurden."],
      source: ["NIST SP 800-61 Rev. 3 · Reaktion und Rückkehr zum Betrieb", "https://csrc.nist.gov/pubs/sp/800/61/r3/final"],
    }],
    learning: {
      openings: ["Trainerin Leni meldet eine unerwartete Anmeldebestätigung. Später fällt in der Verwaltung eine unbekannte aktive Sitzung auf. Ordne ihre Meldung und die Protokolle des Portals und finde heraus, was tatsächlich belegt ist.", "Der Vorstand möchte das Vereinskonto möglichst bald wieder freigeben. Im Portal steht die unbekannte Sitzung noch auf ‚aktiv‘. Probiere aus, welche Maßnahmen den Zugriff ändern und welche Prüfungen noch fehlen."],
      transfer: {
        prompt: "Das Portal lehnt die alte Sitzung ab. Womit prüfst du die Wiederherstellung zusätzlich?",
        options: ["Die berechtigte Trainerin meldet sich neu an, prüft ihre Vereinsaufgabe, und das Team kontrolliert Faktoren und Protokolle.", "Niemand meldet sich an, damit das Konto aus der Statistik verschwindet.", "Die Trainerin verwendet die alte Sitzung weiter."], answer: 0,
        clue: "Außer der alten Sitzung muss auch der neue, berechtigte Zugriff und seine normale Funktion geprüft werden.",
        explanation: "Die Abweisung der alten Sitzung und die erfolgreiche berechtigte Anmeldung belegen zwei verschiedene Voraussetzungen für den Weiterbetrieb.",
      },
    },
    practice: {
      title: "Neuer Fall: Unbekannte Sitzung im Helferpostfach",
      intro: "Das Passwort wurde gewechselt. Das Postfach zeigt eine bestehende unbekannte Sitzung. Über ihre bisherigen Aktionen liegen noch keine verlässlichen Daten vor.",
      questions: [{
        prompt: "Welche Feststellung und Maßnahme passen zur Lage?",
        options: ["Die Sitzung ist nach dem Passwortwechsel automatisch beendet.", "Der Zugriff kann bestehen. Sitzung widerrufen, relevante Belege sichern und mögliche Zugriffe getrennt untersuchen.", "Der Sitzungsstart beweist, dass alle Nachrichten gelesen wurden."], answer: 1,
        clue: "Trenne den Status der Sitzung von der Frage, welche Daten eine Person tatsächlich abgerufen hat.", explanation: "Der Widerruf beendet die vorhandene Sitzung. Protokolle und weitere Belege klären, was davor geschehen ist.",
      }],
      summary: "Du hast Hinweise eingeordnet, den Zugriff gezielt begrenzt und den sicheren Weiterbetrieb geprüft.",
    },
  },
];
