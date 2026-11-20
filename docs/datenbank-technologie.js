"use strict";

const dbPostgres = "https://www.postgresql.org/docs/current/";
const dbPerformance = "Speicher, Indizes und Ausführungspläne";
const dbTransactions = "Transaktionen und Nebenläufigkeit";
const dbAnalytics = "Data Warehouse und Data Mining";
const dbDistributed = "Verteilte und spezialisierte Datenbanken";

const datenbankQuests = [
  {
    id: "db-bibliothek-modellieren", title: "Ein relationales Bibliotheksschema entwerfen",
    description: "Unterscheide Titel und Exemplare und teste Primärschlüssel, Fremdschlüssel und Pflichtfelder.",
    lessons: [{
      title: "Vom ER-Modell zur Tabelle", lab: "db-schema",
      opening: "Die Bibliothek besitzt zwei Exemplare desselben Buches. Eines wird ausgeliehen. Welche Tabellen und Schlüssel braucht die Bibliothek, damit das zweite Exemplar verfügbar bleibt?",
      intro: "Titel, Exemplar und Mitglied sind unterschiedliche Entitäten. Im Relationenmodell speichert ein Fremdschlüssel am Exemplar, zu welchem Titel es gehört. Mehrere Exemplare können denselben Titel referenzieren.",
      sections: [
        ["Kardinalitäten aus dem Fachfall lesen", "Ein Exemplar gehört genau einem Titel. Ein Titel kann null bis viele Exemplare haben. Für die Ausleihhistorie verbindet eine eigene Relation Mitglied und Exemplar und hält zusätzlich das Ausleihdatum fest."],
        ["Regeln in SQL ausdrücken", "PRIMARY KEY identifiziert jede Ausleihe. FOREIGN KEY prüft, ob die Referenz existiert. NOT NULL macht eine Angabe verpflichtend. CHECK kann etwa eine positive Verlängerungsdauer erzwingen. DDL definiert diese Regeln und DML fügt Datensätze ein oder ändert sie."],
      ],
      check: ["Wo würdest du den Zustand eines beschädigten Exemplars speichern?", "Am Exemplar. Ein zweites Exemplar desselben Titels kann einen anderen Zustand haben."],
      source: ["PostgreSQL · Constraints", `${dbPostgres}ddl-constraints.html`],
    }],
    practice: {
      title: "Ausgaben und Vormerkungen trennen",
      intro: "Die Bibliothek will jetzt Titelvormerkungen erlauben, bevor feststeht, welches Exemplar später frei wird.",
      questions: [{ prompt: "Worauf verweist eine Titelvormerkung?", options: ["Auf die Kennung des Titels.", "Auf die Kennung eines zufällig gewählten Exemplars."], answer: 0, clue: "Prüfe, welches Objekt zu diesem Zeitpunkt fachlich feststeht.", explanation: "Die Vormerkung betrifft den Titel. Das konkrete Exemplar wird erst später gewählt." }],
      summary: "Du hast das fachliche Objekt identifiziert und die passende Referenz gewählt.",
    },
    transfer: { prompt: "Eine Ausleihe nennt ein Exemplar, dessen Kennung in der Exemplartabelle fehlt. Welche Regel verhindert das?", options: ["Ein Index auf dem Titeltext.", "Ein Fremdschlüssel von der Ausleihe zum Exemplar."], answer: 1, clue: "Welche Regel prüft das Vorhandensein in einer anderen Tabelle?", explanation: "Der Fremdschlüssel erzwingt eine gültige Referenz." },
  },
  {
    id: "db-sql-auswerten", title: "Tabellen verknüpfen und mit SQL auswerten",
    description: "Baue Abfragen aus Join, Filter und Gruppierung. Prüfe dabei leere Gruppen und NULL.",
    lessons: [{
      title: "Vom Verbund zur Ergebniszeile", lab: "db-abfrage",
      opening: "Die Bibliothek sucht Titel, für die es noch nie eine Ausleihe gab. Die bisherige Auswertung liefert nur Titel mit Treffern. Ändere den Verbund und prüfe die Zeilenzählung.",
      intro: "Die relationale Selektion filtert Zeilen, die Projektion wählt Attribute und der Join verbindet Relationen. In SQL kann die Projektion ohne DISTINCT Duplikate behalten.",
      sections: [
        ["INNER JOIN und LEFT JOIN", "Ein innerer Verbund liefert passende Paare. Ein linker äußerer Verbund behält auch Titel ohne passende Ausleihe und ergänzt fehlende Werte mit NULL. Der Filter im Labor steht in ON, damit unpassende Ausleihen einen Titel nicht aus dem linken Ergebnis entfernen."],
        ["Gruppen und dreiwertige Logik", "COUNT(a.id) zählt vorhandene IDs. COUNT(*) zählt alle Ergebniszeilen, einschließlich der mit NULL aufgefüllten Zeile eines Titels ohne Treffer. Verwende IS NULL, um einen fehlenden Wert zu prüfen. Ein gewöhnlicher Vergleich mit NULL liefert unbekannt."],
        ["Mengenoperationen", "UNION vereinigt kompatible Ergebnisse ohne Duplikate, INTERSECT liefert die Schnittmenge und EXCEPT entfernt Treffer der rechten Seite. UNION ALL hängt die Zeilen einschließlich Duplikaten an."],
      ],
      check: ["Warum kann ein Filter auf den Status in WHERE beim LEFT JOIN einen Titel ohne Treffer ausschließen?", "Der Status der ergänzten Zeile ist NULL. Der Vergleich mit 'offen' ist unbekannt. WHERE behält nur Zeilen, für die die Bedingung wahr ist."],
      source: ["PostgreSQL · Tabellenausdrücke und Gruppierung", `${dbPostgres}queries-table-expressions.html`],
    }],
    practice: {
      title: "Eine Liste mit Nullwerten auswerten",
      intro: "Jeder Titel soll mit der Anzahl seiner offenen Ausleihen erscheinen, auch wenn die Anzahl null ist.",
      questions: [{ prompt: "Welche Kombination passt?", options: ["INNER JOIN und COUNT(*).", "LEFT JOIN mit Statusfilter in ON und COUNT auf der Ausleih-ID."], answer: 1, clue: "Behalte Titel ohne Treffer und zähle nur echte Ausleihzeilen.", explanation: "Der linke Verbund hält den Titel im Ergebnis. COUNT auf der Ausleih-ID ignoriert NULL." }],
      summary: "Du hast ON, LEFT JOIN und COUNT passend kombiniert.",
    },
    transfer: { prompt: "Welche Bedingung findet Zeilen, in denen das Rückgabedatum fehlt?", options: ["rueckgabe IS NULL", "rueckgabe = NULL"], answer: 0, clue: "Bei fehlendem Wert liefert ein Gleichheitsvergleich unbekannt.", explanation: "IS NULL ist die dafür vorgesehene Prüfung." },
  },
  {
    id: "db-normalformen-anwenden", title: "Redundanz mit Normalformen auflösen",
    description: "Erzeuge eine Änderungsanomalie und zerlege die Importtabelle anhand ihrer Abhängigkeiten.",
    lessons: [{
      title: "Abhängigkeiten vor der Zerlegung finden", lab: "db-normalform",
      opening: "Zwei Exemplare desselben Titels heißen im Import plötzlich unterschiedlich. Ändere einen Titel zuerst in der flachen Liste und danach im getrennten Schema. Welcher Unterschied entsteht?",
      intro: "In diesem Beispiel bestimmt die Titel-ID den Titeltext und die Verlags-ID. Die Verlags-ID bestimmt den Verlagsnamen. Eine Spalte kann daher von einem Schlüssel direkt oder über weitere Attribute abhängen.",
      sections: [
        ["Von der ersten zur dritten Normalform", "Ein Feld soll einen Wert der vorgesehenen Domäne enthalten. Abhängigkeiten eines Nichtschlüsselattributs von nur einem Teil eines zusammengesetzten Kandidatenschlüssels verletzen die zweite Normalform. Trenne hier auch den Verlag, damit der Verlagsname nicht transitiv über die Verlags-ID vom Titelschlüssel abhängt."],
        ["Verlustfrei zusammenführen", "Exemplar verweist auf Titel und Titel auf Verlag. Der Join über diese Schlüssel stellt die Beispielansicht wieder her. Prüfe bei einer Zerlegung auch, ob sich die fachlichen Abhängigkeiten weiterhin zuverlässig durchsetzen lassen."],
        ["Höhere Normalformen", "In BCNF muss jede nichttriviale funktionale Abhängigkeit einen Superschlüssel als Determinante haben. 4NF behandelt auch mehrwertige Abhängigkeiten, etwa zwei unabhängige Listen zu einem Titel. 5NF behandelt allgemeinere Join-Abhängigkeiten."],
      ],
      check: ["Warum hilft es nicht, im flachen Import nur den Titeltext als Primärschlüssel zu deklarieren?", "Ein Titel kann mehrfach vorkommen und verschiedene Titel können denselben Namen tragen. Die Titel-ID gehört in eine eigene Titeltabelle."],
      source: ["Ronald Fagin · Multivalued Dependencies and a New Normal Form", "https://research.ibm.com/publications/multivalued-dependencies-and-a-new-normal-form-for-relational-databases"],
    }],
    practice: {
      title: "Verlagsdaten an einer Stelle pflegen",
      intro: "Mehrere Titel eines Verlags nennen seinen historischen und seinen neuen Namen gemischt. Die Verlags-ID ist stabil.",
      questions: [{ prompt: "Wie lässt sich die Regel Verlag-ID → Verlagsname abbilden?", options: ["Den Namen in jeder Titelzeile speichern.", "Eine Verlagsrelation mit Verlag-ID als Schlüssel anlegen und aus Titel darauf verweisen."], answer: 1, clue: "Suche das Attribut, das den Verlagsnamen bestimmt.", explanation: "Der Name gehört in die Relation, deren Schlüssel ihn bestimmt." }],
      summary: "Du hast eine transitive Abhängigkeit aus der Titelrelation herausgezogen.",
    },
    transfer: { prompt: "Ein Titel hat unabhängige Schlagwörter und Übersetzungen. Wie vermeidest du alle Kombinationen beider Listen?", options: ["Separate Zuordnungen Titel–Schlagwort und Titel–Übersetzung.", "Eine einzige Relation mit einer Zeile für jedes Paar aus Schlagwort und Übersetzung."], answer: 0, clue: "Die Zugehörigkeit eines Schlagworts hängt hier von keiner Übersetzung ab.", explanation: "Zwei getrennte Zuordnungen bilden die beiden unabhängigen Mehrfachwerte ab." },
  },
  {
    id: "db-sql-betrieb-migrieren", title: "Sichten bereitstellen und ein Schema migrieren",
    description: "Begrenze sichtbare Daten mit einer View und überführe Altbestände in eine neue Spalte.",
    lessons: [{
      title: "Eine kleine Schnittstelle für die Statistik", lab: "db-view",
      opening: "Das Statistikteam braucht Ausleihzahlen, aber keine Mitgliedsnamen. Probiere zwei Rollen an einer Basistabelle und an einer aggregierten View aus.",
      intro: "Eine View speichert eine Abfragedefinition. Eine getrennte Rolle kann SELECT auf der View erhalten, während der direkte Zugriff auf die Basistabelle gesperrt bleibt. Die Demo zeigt nur diese explizit vergebenen Rechte.",
      sections: [
        ["Daten sparen", "Die Statistikview liefert nur Filialen und Summen. In einem echten System sind zusätzlich Rollenmitgliedschaften, Rechte des Eigentümers sowie aus Summen ableitbare Informationen zu prüfen."],
        ["Regeln beim Schreiben", "Constraints prüfen deklarierte Bedingungen. Trigger reagieren auf Tabellenereignisse und können beispielsweise ein fachliches Änderungsprotokoll führen. Eine Sequenz vergibt Werte. Rollbacks können Lücken in Sequenzwerten hinterlassen."],
      ],
      check: ["Was sollte die Rolle statistik für diese Aufgabe abfragen dürfen?", "Die View mit den nötigen Summen. Der direkte Zugriff auf Ausleihzeilen würde unnötige Details offenlegen."],
      source: ["PostgreSQL · CREATE VIEW", `${dbPostgres}sql-createview.html`],
    }, {
      title: "Bestandsdaten schrittweise umstellen", lab: "db-migration",
      opening: "Die neue Anwendung erwartet einen Pflichtwert in filialcode. Der Altbestand kennt nur die ausgeschriebenen Namen. Führe die Umstellung aus und prüfe, wann die neue Regel aktiviert werden kann.",
      intro: "In der Simulation wird zunächst eine leere Spalte hinzugefügt. Dann setzt ein Backfill bekannte Werte. Die Prüfung findet zurückgebliebene oder unbekannte Fälle vor dem Umschalten.",
      sections: [
        ["Erweitern, befüllen und prüfen", "Bei laufendem Betrieb müssen neue Schreibvorgänge während der Umstellung konsistent bleiben, etwa durch zeitweises Befüllen beider Spalten oder ein vereinbartes Wartungsfenster. Prüfe Regeln und Zahlen vor der Umschaltung."],
        ["Rückweg und Aufräumen", "Behalte die bisherige Darstellung für den geplanten Rückweg verfügbar. Entferne sie erst, wenn die neuen Leser und Schreiber umgestellt und alte Daten geprüft sind."],
      ],
      check: ["Was sagt die Zahl der kopierten Zeilen über deren Filialcodes aus?", "Sie belegt nur die Anzahl. Prüfe zusätzlich Pflichtwerte, zulässige Codes und den fachlichen Abgleich."],
      source: ["PostgreSQL · Tabellen ändern", `${dbPostgres}ddl-alter.html`],
    }],
    practice: {
      title: "Eine neue Pflichtspalte ausrollen",
      intro: "Bei einem Migrationslauf wurden fast alle Altzeilen befüllt. Drei Zeilen stehen noch auf NULL und die alte Anwendung schreibt weiter.",
      questions: [{ prompt: "Was gehört vor die Umschaltung?", options: ["Altfälle klären und sicherstellen, dass neue Schreibvorgänge beide Darstellungen konsistent halten.", "Die alte Spalte sofort löschen."], answer: 0, clue: "Berücksichtige sowohl vorhandene als auch neu geschriebene Zeilen.", explanation: "Die neue Regel funktioniert erst, wenn beide Gruppen umgestellt sind." }],
      summary: "Du hast die Migration abgesichert, bevor die neue Anwendung umschaltet.",
    },
    transfer: { prompt: "Welches Recht sollte das reine Statistikteam in der Beispielarchitektur erhalten?", options: ["Tabelleneigentum.", "SELECT auf der vorbereiteten View."], answer: 1, clue: "Welche Schnittstelle liefert bereits alle benötigten Daten?", explanation: "Das View-Recht genügt für die geforderte Auswertung." },
  },
  {
    id: "db-seiten-cache-verstehen", title: "Speicherseiten und Puffer beobachten",
    description: "Miss im Modell, wie Zeilengröße und Zugriffsmuster die gelesenen Seiten beeinflussen.", group: dbPerformance,
    lessons: [{
      title: "Gleiche Zeilenzahl, andere I/O-Kosten", lab: "db-seiten",
      opening: "Zwei Abfragen lesen je acht Zeilen. Eine liest benachbarte Zeilen, die andere greift quer durchs Archiv. Vergleiche ihre Seitenzugriffe und wiederhole dieselbe Abfrage mit warmem Puffer.",
      intro: "Datenbanken speichern Zeilen in Seiten. Fällt ein Zugriff auf eine Seite, die schon im Puffer liegt, muss der Datenbankpuffer sie dafür nicht erneut nachladen.",
      sections: [
        ["Platz in einer Seite", "Das Modell nimmt 8 KiB pro Seite und feste Zeilenbreiten an. Header, Zeilenverweise, unterschiedliche Füllgrade und ausgelagerte Werte erschweren die Rechnung in einem echten System."],
        ["Lokalität und Cache", "Benachbarte Zeilen teilen häufig eine Seite. Beim Verdrängen ersetzt das Labor die am längsten nicht benutzte Seite. Das zeigt das Prinzip eines Puffers. PostgreSQL verwendet eigene Ersetzungsregeln und das Betriebssystem kann zusätzlich cachen."],
      ],
      check: ["Warum ist ein Puffermiss im Modell kein gemessener SSD-Zugriff?", "Das Modell zählt Nachladen in den Datenbankpuffer. In einem echten System kann die Seite noch im Betriebssystemcache liegen."],
      source: ["PostgreSQL · Database Page Layout", `${dbPostgres}storage-page-layout.html`],
    }],
    practice: {
      title: "Zwei identische Läufe vergleichen",
      intro: "Eine Abfrage berührt vier Seiten und der Puffer hält acht. Direkt nach dem ersten Lauf wird sie wiederholt.",
      questions: [{ prompt: "Was erwartest du im Modell beim zweiten Lauf?", options: ["Vier erneute Seitennachladungen.", "Puffertreffer für alle vier Seiten, sofern dazwischen niemand sie verdrängt."], answer: 1, clue: "Alle benötigten Seiten passen gleichzeitig in den Puffer.", explanation: "Die vier Seiten sind aus dem vorigen Lauf noch verfügbar." }],
      summary: "Du hast Seitenzugriffe und Puffertreffer getrennt betrachtet.",
    },
    transfer: { prompt: "Was ändert sich bei gleicher Seitengröße, wenn Zeilen deutlich breiter werden?", options: ["Es passen weniger Zeilen auf eine Seite.", "Es passen mehr Zeilen auf eine Seite."], answer: 0, clue: "Die verfügbare Anzahl Bytes pro Seite bleibt gleich.", explanation: "Größere Zeilen belegen mehr vom festen Seitenbudget." },
  },
  {
    id: "db-index-waehlen", title: "Einen Index passend zur Abfrage wählen",
    description: "Vergleiche ganze Scans mit einer sortierten Suche und ändere die Reihenfolge der Indexspalten.", group: dbPerformance,
    lessons: [{
      title: "Selektivität und zusammengesetzte Schlüssel", lab: "db-index",
      opening: "Das Archiv protokolliert jede Öffnung eines Medienschranks je Filiale und Tag. Teste, welche Indexreihenfolge für eine seltene Filialabfrage und welche für eine Suche über alle Filialen passt.",
      intro: "Ein B-Baum führt zu passenden Schlüsseln und unterstützt geordnete Bereichsabfragen. Die Demo nutzt eine binäre Suche in einer sortierten Liste, um das Prinzip der Begrenzung auf einen Schlüsselbereich zu zeigen.",
      sections: [
        ["Führende Spalten", "Bei (filiale, tag) stehen die Tage je Filiale zusammen. Bei (tag, filiale) liegen alle Filialen desselben Tags zusammen. Bedingungen auf führenden Spalten grenzen oft den gelesenen Schlüsselbereich am stärksten ein. PostgreSQL kann in manchen Fällen weitere Verfahren nutzen, etwa Skip Scan."],
        ["Lesen und Schreiben abwägen", "Viele Treffer können zahlreiche Datenseiten berühren. Ein sequenzieller Scan kann dann günstiger sein. Jeder zusätzliche Index benötigt Speicher und muss bei Änderungen gepflegt werden."],
      ],
      check: ["Welche Reihenfolge hilft im Modell einer Abfrage nur nach Tag?", "(tag, filiale). Der Tag ist die führende Spalte und bildet einen zusammenhängenden Schlüsselbereich."],
      source: ["PostgreSQL · Mehrspaltige Indizes", `${dbPostgres}indexes-multicolumn.html`],
    }],
    practice: {
      title: "Den Zugriff für einen Monatsreport erklären",
      intro: "Der Report liest beinahe alle Zeilen einer kleinen Tabelle. Ein neuer Index ist vorhanden und der Planner wählt einen sequenziellen Scan.",
      questions: [{ prompt: "Welche Erklärung passt?", options: ["Ein Tabellenscan kann bei vielen Treffern weniger Arbeit verursachen.", "Der vorhandene Index muss bei jeder Abfrage benutzt werden."], answer: 0, clue: "Denke an die Anzahl der zusätzlich einzulesenden Datenseiten.", explanation: "Die Existenz eines Indexes zwingt den Planner nicht, ihn zu verwenden." }],
      summary: "Du hast einen Zugriff nach Selektivität und Seitenarbeit beurteilt.",
    },
    transfer: { prompt: "Welche führende Indexspalte passt im Labor zu einer Suche ausschließlich nach Filiale?", options: ["tag", "filiale"], answer: 1, clue: "Unter welcher Sortierung liegen die Treffer dieser Filiale zusammen?", explanation: "Mit filiale als erster Spalte ist der Bereich zusammenhängend." },
  },
  {
    id: "db-ausfuehrungsplaene-lesen", title: "Ausführungspläne und Join-Strategien vergleichen",
    description: "Vergleiche Schätzungen und tatsächliche Arbeit bei Nested Loop und Hash Join.", group: dbPerformance,
    lessons: [{
      title: "Wie eine Fehlschätzung den Plan ändert", lab: "db-plan",
      opening: "Die Planvorschau erwartet vier Zeilen. Der gleiche Filter trifft nach einem Import auf Tausende. Teste, welcher Join gewählt wird und wie eine aktualisierte Schätzung die Wahl verändert.",
      intro: "EXPLAIN beschreibt den geplanten Weg und geschätzte Zeilen. EXPLAIN ANALYZE führt das Statement aus und erfasst tatsächliche Zeilen und Laufzeitinformationen. Im Labor werden stattdessen nachvollziehbare Arbeitsschritte gezählt.",
      sections: [
        ["Verbundstrategien", "Nested Loop führt für jede äußere Zeile eine innere Suche aus. Mit einem passenden Index kann das bei wenigen äußeren Zeilen günstig sein. Hash Join baut für einen Gleichheitsverbund eine Hashtabelle auf und prüft dann die Schlüssel der anderen Eingabe."],
        ["Schätzung und Planwahl", "Die Zahl der Zeilen beeinflusst die Wahl des Joins und der Zugriffswege. ANALYZE sammelt Statistiken. In echten Plänen helfen Abweichungen zwischen geschätzten und tatsächlichen Zeilen, Ursachen einzugrenzen. Kostenwerte eines Plans sind keine Laufzeitangaben in Millisekunden."],
      ],
      check: ["Warum ist ein Hash Join im Modell für eine äußere Eingabe mit vier Zeilen oft unnötig teuer?", "Der Aufbau der Hashtabelle liest erst die gesamte innere Eingabe. Wenige gezielte Indexabfragen können diese Arbeit sparen."],
      source: ["PostgreSQL · Using EXPLAIN", `${dbPostgres}using-explain.html`],
    }],
    practice: {
      title: "Nach einem großen Import diagnostizieren",
      intro: "Der Planner schätzt vier Zeilen, EXPLAIN ANALYZE beobachtet tatsächlich 3.200. Ein Nested Loop wiederholt dadurch viele Indexsuchen.",
      questions: [{ prompt: "Was prüfst du zuerst?", options: ["Ob die Schätzung und die Tabellenstatistik zum neuen Datenstand passen.", "Ob ein anderer Spaltenname dieselbe Laufzeit garantiert."], answer: 0, clue: "Die Abweichung liegt schon an der Eingabe des Joins.", explanation: "Eine bessere Schätzung kann die Planwahl ändern. Danach vergleicht man die Ausführung erneut." }],
      summary: "Du hast eine Fehlschätzung von der eigentlichen Ausführung unterschieden.",
    },
    transfer: { prompt: "Was kann EXPLAIN ANALYZE mit einem ändernden SQL-Statement tun?", options: ["Nur den Plan anzeigen, ohne den Befehl auszuführen.", "Das Statement tatsächlich ausführen und so Änderungen auslösen."], answer: 1, clue: "Wodurch entstehen tatsächliche statt geschätzte Messwerte?", explanation: "ANALYZE in EXPLAIN ANALYZE führt die Anweisung aus. Plane Prüfungen mit Nebenwirkungen entsprechend." },
  },
  {
    id: "db-transaktion-abschliessen", title: "Eine Ausleihe als ACID-Transaktion ausführen",
    description: "Verwende BEGIN, SAVEPOINT, COMMIT und ROLLBACK bei einer fehlerhaften Buchung.", group: dbTransactions,
    lessons: [{
      title: "Zusammengehörige Änderungen gemeinsam abschließen", lab: "db-acid",
      opening: "Die Fachanwendung hat eine Ausleihe eingetragen. Bevor sie den Freibestand anpassen kann, schlägt eine weitere Anweisung fehl. Teste, welche Daten außerhalb der Transaktion sichtbar sind und wie du zurückkehrst.",
      intro: "Atomarität bedeutet, dass zusammengehörige Änderungen gemeinsam wirksam werden oder gemeinsam entfallen. Konsistenz meint, dass die durch Regeln und fachlich korrekte Transaktionen geforderten Invarianten erhalten bleiben.",
      sections: [
        ["ACID vollständig lesen", "Isolation beschreibt, wie gleichzeitige Transaktionen einander beobachten oder beeinflussen dürfen. Dauerhaftigkeit sichert bestätigte Änderungen gegen die zugesicherten Fehlerfälle. Das vereinfachte Labor zeigt nur unterschiedliche Sichtbarkeit und die fachliche Bestandsregel."],
        ["Zwischenstand und Rückweg", "BEGIN startet den Block. ROLLBACK verwirft den Block. ROLLBACK TO SAVEPOINT stellt den gespeicherten Zwischenstand wieder her. In PostgreSQL lässt sich ein fehlgeschlagener Transaktionsblock über einen vorher gesetzten Savepoint fortsetzen."],
        ["Regeln am richtigen Zeitpunkt prüfen", "Einige Constraints, etwa entsprechend definierte Fremdschlüssel, können in PostgreSQL bis COMMIT aufgeschoben werden. Die zeilenübergreifende Bestandsregel im Modell ist als fachliche Prüfung umgesetzt. Ein gewöhnliches CHECK eignet sich dafür nicht."],
      ],
      check: ["Wann sieht eine andere Sitzung nach diesem Modell die neue Ausleihe?", "Nach dem erfolgreichen COMMIT. Vorher bleiben die gemeinsam geänderten Daten in der laufenden Transaktion."],
      source: ["PostgreSQL · Transaktionen und Savepoints", `${dbPostgres}tutorial-transactions.html`],
    }],
    practice: {
      title: "Eine halbe Buchung vermeiden",
      intro: "Zwei Schreibanweisungen einer Buchung laufen einzeln mit Autocommit. Die erste war erfolgreich und die zweite schlägt fehl.",
      questions: [{ prompt: "Wie behandelst du beide Änderungen künftig als Einheit?", options: ["Jede Anweisung einzeln bestätigen.", "Beide in einen gemeinsamen Transaktionsblock legen und nur bei Erfolg bestätigen."], answer: 1, clue: "Welche Grenze bestimmt, was gemeinsam veröffentlicht wird?", explanation: "Beide Schritte gehören unter dasselbe BEGIN und COMMIT." }],
      summary: "Du hast die Transaktionsgrenze an den fachlichen Vorgang angepasst.",
    },
    transfer: { prompt: "Welche Operation verwirft nur die nach einem gespeicherten Zwischenstand ausgeführten Änderungen?", options: ["ROLLBACK TO SAVEPOINT", "COMMIT"], answer: 0, clue: "Die Transaktion soll auf einem früheren Punkt fortfahren können.", explanation: "ROLLBACK TO nimmt die Änderungen nach dem Savepoint zurück." },
  },
  {
    id: "db-nebenlaeufigkeit-mvcc", title: "Snapshots und Isolation bei parallelen Buchungen prüfen",
    description: "Spiele Phantom Reads und Write Skew nach und entscheide, wann ein Neustart nötig ist.", group: dbTransactions,
    lessons: [{
      title: "Eine Abfrage in zwei Sitzungen wiederholen", lab: "db-mvcc",
      opening: "Sitzung A zählt offene Vormerkungen. Parallel legt B eine weitere an. Verfolge den Unterschied zwischen einem unbestätigten Eintrag und einem neu sichtbaren Snapshot.",
      intro: "PostgreSQL verwendet MVCC. Jede Abfrage sieht die für ihren Snapshot sichtbaren Zeilenversionen. Lesende und Schreibende können dadurch in vielen Fällen parallel arbeiten.",
      sections: [
        ["Zwei Zeitpunkte für einen Snapshot", "READ COMMITTED verwendet für jede Anweisung einen neuen Snapshot. REPEATABLE READ behält für gewöhnliche Leseabfragen den Transaktionssnapshot ab der ersten relevanten Anweisung. READ UNCOMMITTED verhält sich in PostgreSQL wie READ COMMITTED."],
        ["Was sich bei wiederholtem Lesen ändert", "Ändert sich eine bereits gelesene Zeile, spricht man von nicht wiederholbarem Lesen. Ändert sich die Treffermenge einer Bedingung, kann ein Phantom Read vorliegen. Alte, nicht mehr benötigte Zeilenversionen werden durch VACUUM für Wiederverwendung aufgeräumt."],
      ],
      check: ["Weshalb kann A unter READ COMMITTED nach B’s COMMIT einen weiteren Treffer sehen?", "Die zweite Anweisung erhält einen neueren Snapshot mit der bestätigten Änderung von B."],
      source: ["PostgreSQL · Transaction Isolation", `${dbPostgres}transaction-iso.html`],
    }, {
      title: "Ein Write-Skew-Rennen auflösen", lab: "db-write-skew",
      opening: "Zwei Schichten haben je eine Person im Dienst. Beide wollen sich gleichzeitig abmelden und prüfen vorher, ob jemand anderes bleibt. Teste dieselbe Reihenfolge unter zwei Isolationsstufen.",
      intro: "Beide Transaktionen lesen dieselbe Regel und ändern unterschiedliche Zeilen. Unter Snapshot-Isolation können sie jeweils eine lokale Entscheidung treffen, die zusammen die Regel verletzt.",
      sections: [
        ["Serialisierbarkeit", "Ein serialisierbares Ergebnis entspricht einer zulässigen seriellen Reihenfolge. PostgreSQL kann bei erkannten gefährlichen Abhängigkeiten eine Transaktion mit einem Serialisierungsfehler abbrechen. Das Labor zeigt einen möglichen Abbruch."],
        ["Die ganze Transaktion wiederholen", "Nach dem Abbruch muss der erneute Versuch seine Entscheidung auf einen neuen Snapshot stützen. Bewerte die Mindestbesetzung erneut. Bei sich überlappenden Sperren können auch Wartezeiten oder Deadlocks entstehen."],
      ],
      check: ["Warum reicht die Wiederholung nur des letzten UPDATE nach dem Abbruch nicht?", "Die Entscheidung beruhte auf einem alten Lesezustand. Prüfe Regel und Lesevorgänge in der neuen Transaktion erneut."],
      source: ["PostgreSQL · Serializable Isolation Level", `${dbPostgres}transaction-iso.html#XACT-SERIALIZABLE`],
    }],
    practice: {
      title: "Einen Serialisierungsfehler behandeln",
      intro: "Zwei gleichzeitige Buchungen lesen denselben Bestand. Eine der Transaktionen wird mit SQLSTATE 40001 abgebrochen.",
      questions: [{ prompt: "Wie sollte der Aufrufer einen fachlich zulässigen erneuten Versuch starten?", options: ["Die komplette Transaktion mit frischer Prüfung neu starten.", "Nur den alten COMMIT wiederholen."], answer: 0, clue: "Die vorherige Entscheidung basierte auf einer veralteten Sicht.", explanation: "Der gesamte Vorgang muss die Voraussetzungen erneut lesen und prüfen." }],
      summary: "Du kannst Snapshot-Sichtbarkeit und den korrekten Retry erklären.",
    },
    transfer: { prompt: "Welche Stufe verwendet in PostgreSQL für zwei SELECT-Anweisungen im selben Block jeweils einen neuen Snapshot?", options: ["REPEATABLE READ", "READ COMMITTED"], answer: 1, clue: "Vergleiche die Sichtbarkeit je Anweisung mit einer Sicht je Transaktion.", explanation: "READ COMMITTED nimmt bei jeder Anweisung einen neuen Snapshot." },
  },
  {
    id: "db-warehouse-verdichten", title: "Ein Data Warehouse aufbauen und auswerten",
    description: "Bereinige einen Import, lege die Faktengranularität fest und verdichte nach Monat oder Filiale.", group: dbAnalytics,
    lessons: [{
      title: "Von Ausleihvorgängen zur Kennzahl", lab: "db-warehouse",
      opening: "Der Filialreport zählt sechs Importzeilen. Eine Ausleihe ist doppelt, bei einer fehlt die Filiale. Bereinige die Eingabe und vergleiche anschließend zwei Gruppierungen.",
      intro: "Das operative System bearbeitet einzelne Ausleihen. Das Warehouse sammelt historische Daten für Auswertungen. Das Sternschema verbindet Fakten mit Dimensionen wie Filiale, Datum und Genre.",
      sections: [
        ["Granularität festlegen", "Eine Faktzeile steht hier für einen Ausleihvorgang. Damit ist klar, welche Ereignisse gezählt und welche doppelten Importe zusammengeführt werden. ETL steht für Extrahieren, Transformieren und Laden. Unklare Zeilen werden zur Klärung separat gehalten."],
        ["Filtern und Verdichten", "Ein Slice schränkt eine Dimension ein. Roll-up verdichtet zu einer gröberen Ebene, Drill-down geht in mehr Details. Ein Monatsbericht und ein Filialbericht können aus derselben Faktentabelle kommen."],
      ],
      check: ["Warum sollte derselbe Import wiederholt werden können, ohne die Zahl der Ausleihen zu verdoppeln?", "Die Ausleih-ID identifiziert das Fakt. Ein wiederholter Import soll denselben Vorgang abgleichen statt ihn erneut zu zählen."],
      source: ["Kimball Group · Grain", "https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/grain/"],
    }],
    practice: {
      title: "Scheinbares Nachfragewachstum erklären",
      intro: "Eine Datei wurde erneut geladen. Die Summe verdoppelt sich, obwohl die Ausleih-IDs gleich geblieben sind.",
      questions: [{ prompt: "Welche Regel verhindert den Fehler?", options: ["Jeden Dateiimport als neue Ausleihe zählen.", "Ausleih-IDs beim Laden zum eindeutigen Fakt abgleichen."], answer: 1, clue: "Entscheidend ist das fachliche Ereignis, das eine Faktzeile repräsentiert.", explanation: "Die Regel macht die Wiederholung des Imports für die Kennzahl unschädlich." }],
      summary: "Du hast Granularität und Importregel auf die Kennzahl abgestimmt.",
    },
    transfer: { prompt: "Wie nennt man das Verdichten täglicher Zahlen zu Monatswerten?", options: ["Roll-up", "Drill-down"], answer: 0, clue: "Die Zeitauflösung wird gröber.", explanation: "Roll-up fasst Werte auf einer höheren Aggregationsebene zusammen." },
  },
  {
    id: "db-muster-in-ausleihen", title: "Ausleihmuster mit Data Mining beurteilen",
    description: "Berechne Support, Konfidenz und Lift für Genrekombinationen.", group: dbAnalytics,
    lessons: [{
      title: "Aus einem häufigen Paar wird noch keine gute Regel", lab: "db-mining",
      opening: "Die Bibliothek will aus häufig gemeinsam ausgeliehenen Genres Empfehlungen ableiten. Reisebücher sind allgemein beliebt. Prüfe, ob die Regel Krimi → Reise gegenüber dem Grundanteil viel hinzufügt.",
      intro: "Der Support einer Regel A → B ist der Anteil der Vorgänge mit A und B. Die Konfidenz teilt diese Anzahl durch die Zahl der Vorgänge mit A.",
      sections: [
        ["Grundrate berücksichtigen", "Der Lift teilt die Konfidenz durch den Anteil von B an allen Vorgängen. Lift über 1 heißt, dass B in der beobachteten Stichprobe bei A häufiger vorkommt als insgesamt."],
        ["Eine Beobachtung überprüfen", "Vergleiche Muster mit weiteren Zeiträumen und ausreichenden Fallzahlen. Saison, Sortiment und Filiale können Häufigkeiten beeinflussen. Eine Assoziation beweist keine Ursache."],
      ],
      check: ["Warum kann die Konfidenz bei A → B und B → A unterschiedlich sein?", "Der gemeinsame Zähler ist gleich. Die Nenner sind die Häufigkeiten von A beziehungsweise B."],
      source: ["Agrawal, Imieliński und Swami · Mining Association Rules", "https://research.ibm.com/publications/mining-association-rules-between-sets-of-items-in-large-databases"],
    }],
    practice: {
      title: "Eine Regel mit hoher Konfidenz prüfen",
      intro: "Eine Regel hat 80 % Konfidenz. Ihr Zielgenre kommt auch in 80 % aller Ausleihvorgänge vor.",
      questions: [{ prompt: "Wie groß ist der Lift und was sagt er?", options: ["1. Die Regel erreicht dieselbe Häufigkeit wie die Grundrate.", "80. Die Regel zeigt eine starke Ursache."], answer: 0, clue: "Teile Konfidenz durch die Grundrate des Zielgenres.", explanation: "0,8 geteilt durch 0,8 ergibt 1." }],
      summary: "Du hast den Zusammenhang mit der Grundrate verglichen.",
    },
    transfer: { prompt: "Beweist ein Lift über 1, dass die Ausleihe von A die Ausleihe von B verursacht?", options: ["Ja, bei genügend Dezimalstellen.", "Nein, er beschreibt zunächst einen beobachteten Zusammenhang."], answer: 1, clue: "Auch ein dritter Faktor kann beide Häufigkeiten beeinflussen.", explanation: "Ein Zusammenhang in Beobachtungsdaten ist kein Kausalitätsnachweis." },
  },
  {
    id: "db-verteilte-daten-abwaegen", title: "Replikation, Sharding und CAP auseinanderhalten",
    description: "Trenne zwei Knoten, beobachte veraltete Kopien und ordne Filialdaten passenden Shards zu.", group: dbDistributed,
    lessons: [{
      title: "Was passiert bei einer Netztrennung?", lab: "db-verteilung",
      opening: "Nord und Süd teilen dieselbe Bestandszahl. Das Netz zwischen ihnen fällt aus. Probiere eine lokale Buchung aus und lies anschließend beide Seiten, bevor du die Verbindung wiederherstellst.",
      intro: "Replikation hält Kopien derselben Daten auf mehreren Knoten. Sharding verteilt unterschiedliche Teile eines Datenbestands auf Knoten. Beide Verfahren lassen sich kombinieren.",
      sections: [
        ["CAP bei einer Partition", "Wenn Knoten keine Nachrichten austauschen können, lässt sich für dieselben Daten nicht zugleich eine stets verfügbare Antwort an jedem erreichbaren Knoten und eine einheitliche Sicht im Sinne von Linearizierbarkeit garantieren. Das Labor vergleicht deshalb Antworten aus der lokalen Kopie mit einer Variante, die bei getrennter Leitung wartet."],
        ["Konsistenz und Verteilung", "Die Konsistenz in ACID bezeichnet die Einhaltung von Regeln durch Transaktionen. Die Konsistenz im CAP-Satz bezeichnet die beobachtbare Ordnung von Zugriffen auf verteilte Daten. Ein Shard-Schlüssel beeinflusst Lastverteilung und ob eine Abfrage mehrere Knoten braucht."],
        ["Über Teilmengen rechnen", "Bei verteilten Summen können Knoten Beiträge pro Schlüssel berechnen und eine Reduce-Stufe diese Beiträge zusammenfassen. Replikation alleine teilt die eigentliche Arbeit noch nicht auf."],
      ],
      check: ["Warum kann Süd nach einer bestätigten lokalen Änderung in Nord einen älteren Stand zeigen?", "Die Leitung ist unterbrochen und die Änderung wurde noch nicht repliziert. Süd antwortet mit seinem bisherigen Stand."],
      source: ["Gilbert und Lynch · Perspectives on the CAP Theorem", "https://dspace.mit.edu/entities/publication/dfcb6512-af44-4fc9-8e8b-1a8f28f1b53a"],
    }],
    practice: {
      title: "Eine veraltete Anzeige fachlich bewerten",
      intro: "Am Standort Süd ist die Reservierungszahl älter als in Nord, weil die Verbindung unterbrochen ist.",
      questions: [{ prompt: "Welche Entscheidung schützt eine sofortige verbindliche Bestätigung vor unklarem globalem Bestand?", options: ["Bis zur nötigen Koordination warten oder die Bestätigung ablehnen.", "Immer beide lokalen Bestände als unabhängig verbindlich ausgeben."], answer: 0, clue: "Eine Bestätigung muss zu den bereits verbindlichen Buchungen passen.", explanation: "Die Koordination wahrt die geforderte Sicht auf Kosten der Antwortverfügbarkeit." }],
      summary: "Du hast das Verhalten während der Partition passend zum Fachfall beurteilt.",
    },
    transfer: { prompt: "Was kennzeichnet Sharding nach Filiale?", options: ["Jeder Knoten hat in jedem Moment eine vollständige Kopie.", "Die Filialkennung bestimmt, auf welchem Teilbestand eine Zeile liegt."], answer: 1, clue: "Überlege, ob Daten kopiert oder aufgeteilt werden.", explanation: "Die Filialkennung ist der Verteilschlüssel für verschiedene Teilbestände." },
  },
  {
    id: "db-nosql-modelle-auswaehlen", title: "Ein NoSQL-Modell passend zum Zugriff wählen",
    description: "Vergleiche Schlüssel-Wert-, Dokument-, Wide-Column- und Graphmodelle anhand konkreter Aufgaben.", group: dbDistributed,
    lessons: [{
      title: "Der typische Zugriff bestimmt das Datenmodell", lab: "db-nosql",
      opening: "Eine Bibliothek baut einen Sitzungscache, einen Katalog mit variablen Feldern, eine Ereignisliste und einen Empfehlungsgraphen. Vergleiche, welche Datenzugriffe sich in den vier Modellen direkt abbilden lassen.",
      intro: "Schlüssel-Wert-Speicher sind für Zugriffe auf einen bekannten Schlüssel geeignet. Dokumentmodelle können zusammen gelesene eingebettete Daten als Einheit speichern. Bei Wide-Column-Modellen sind Partition und Sortierung auf bekannte Zugriffe zugeschnitten. Graphmodelle stellen Knoten und Beziehungen in den Vordergrund.",
      sections: [
        ["Kosten der Modellierung", "Eingebettete Daten sparen Nachschlagen, können bei mehrfacher Speicherung aber zusätzliche Pflege verlangen. Bei Wide-Column-Modellen sind abfragegerechte Partitionen wichtig. Ein Graph eignet sich für variable Beziehungspfade. Auch relationale Modelle können viele dieser Aufgaben erfüllen und bieten schlüsselbasierte Integritätsregeln."],
        ["Wide Column und analytische Spaltenspeicherung", "Wide Column bezeichnet hier ein Datenmodell mit abfrageorientierten Partitionen und Spalten. Die separat betrachtete physische Spaltenspeicherung organisiert Werte für analytische Scans nach Spalten."],
      ],
      check: ["Was würdest du für einen Sitzungscache vorab klären?", "Wie oft per Sitzungsschlüssel gelesen wird, welche Lebensdauer die Daten haben und welche Folgen ein Cacheausfall hätte."],
      source: ["MongoDB · Embedded Data in Your MongoDB Schema", "https://www.mongodb.com/docs/manual/data-modeling/embedding/"],
    }],
    practice: {
      title: "Beziehungen mehrerer Schritte untersuchen",
      intro: "Du suchst beliebig lange Wege von Autorinnen zu verwandten Gruppen über mehrere Arten von Beziehungen.",
      questions: [{ prompt: "Welches der vier Modelle macht diese Wege direkt zum Schwerpunkt?", options: ["Ein einfacher Schlüssel-Wert-Cache.", "Ein Graphmodell."], answer: 1, clue: "Gesucht wird das Traversieren von Kanten zwischen Knoten.", explanation: "Im Graphmodell stellen die Beziehungen und ihre Pfade zentrale Abfrageobjekte dar." }],
      summary: "Du hast die Modellentscheidung an den Zugriff gebunden.",
    },
    transfer: { prompt: "Was erleichtert eine passende Wide-Column-Partition für Ereignisse je Filiale?", options: ["Einen Zeitbereich innerhalb der ausgewählten Partition lesen.", "Ohne passenden Zugriffsschlüssel jedes beliebige Beziehungsnetz direkt traversieren."], answer: 0, clue: "Ordne die Ereignisse nach Filiale und innerhalb der Filiale nach Zeit.", explanation: "Der Partitions- und Sortierschlüssel unterstützen genau diesen Zugriff." },
  },
  {
    id: "db-aehnliche-titel-finden", title: "Ähnliche Titel per Vektorsuche finden",
    description: "Vergleiche Distanzmaße und miss den Recall einer vereinfachten Kandidatensuche.", group: dbDistributed,
    lessons: [{
      title: "Exakte Treffer mit einer Kandidatenauswahl vergleichen", lab: "db-vektoren",
      opening: "Die Schlagwortsuche kennt nur exakte Begriffe. Im Labor repräsentieren kleine Vektoren die Ausrichtung eines Titels. Wähle ein Distanzmaß und prüfe, wie viele der exakten Top-3 in einem verkürzten Suchlauf erhalten bleiben.",
      intro: "Die euklidische Distanz misst den Abstand im Vektorraum. Kosinus-Ähnlichkeit bezieht sich auf die Richtung und setzt von null verschiedene Vektoren voraus. Die verwendete Kosinusdistanz ist 1 minus Kosinus-Ähnlichkeit.",
      sections: [
        ["Exakt und approximativ", "Die exakte Suche bewertet im Labor alle Kandidaten. Die vereinfachte Kandidatensuche durchsucht nur eine Teilmenge und dient als Modell für den Zielkonflikt zwischen Aufwand und Trefferqualität. Verfahren wie HNSW und IVFFlat erzeugen Kandidaten auf andere Weise."],
        ["Recall@k", "Recall@k ist hier der Anteil der exakten ersten k Treffer, die auch in den ersten k der Näherung vorkommen. Vergleiche dieselbe Anfrage und dasselbe Distanzmaß. In einer Anwendung hängt die Güte zusätzlich vom verwendeten Embedding ab."],
      ],
      check: ["Warum können Kosinus- und euklidische Distanz verschiedene Reihenfolgen liefern?", "Zwei Vektoren können in dieselbe Richtung zeigen und trotzdem stark unterschiedliche Längen haben. Dann ist ihre Kosinusdistanz null, ihr euklidischer Abstand kann groß sein."],
      source: ["pgvector · Distanzoperatoren und Suchindizes", "https://github.com/pgvector/pgvector"],
    }],
    practice: {
      title: "Ein Suchbudget bewerten",
      intro: "Die exakte Suche liefert A, B, C. Eine schnellere Näherung liefert A, C, D.",
      questions: [{ prompt: "Wie groß ist Recall@3?", options: ["2/3, weil A und C in beiden Mengen liegen.", "1/3, weil nur A denselben Rang hat."], answer: 0, clue: "Zähle die gemeinsamen Treffer unabhängig von ihrer Position.", explanation: "Zwei von drei Referenztreffern wurden wiedergefunden." }],
      summary: "Du hast die Treffermenge einer Näherung mit der exakten Referenz verglichen.",
    },
    transfer: { prompt: "Welches Maß bleibt gleich, wenn ein von null verschiedener Kandidatenvektor mit einem positiven Faktor verlängert wird?", options: ["Der euklidische Abstand zu jedem anderen Vektor.", "Die Kosinusdistanz zu einem festen von null verschiedenen Vektor."], answer: 1, clue: "Die Skalierung verändert die Länge und lässt die Richtung gleich.", explanation: "Die Kosinusdistanz hängt von den Richtungen der beiden Vektoren ab." },
  },
].map(({ lessons, transfer, ...quest }) => ({
  ...quest,
  topic: "datenbank-technologie",
  lessons: lessons.map(({ opening, ...lesson }) => ({ ...lesson, discover: true })),
  learning: { openings: lessons.map(({ opening }) => opening), transfer },
}));
