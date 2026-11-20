"use strict";

const dbNumber = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });
const dbTitles = [["T1", "Orbit"], ["T2", "Küstentage"], ["T3", "Moosatlas"]];
const dbCopies = [["E1", "T1"], ["E2", "T1"], ["E3", "T2"], ["E4", "T3"]];
const dbLoans = [
  ["L1", "E1", "M1", "Nord", "offen"],
  ["L2", "E2", "M2", "Nord", "zurück"],
  ["L3", "E3", "M1", "Süd", "zurück"],
];

function dbStatus(status, message, result = "") {
  status.textContent = message;
  status.dataset.result = result;
}

function dbRun(label, run) {
  return element("div", { className: "actions" }, learningButton(label, run));
}

function dbTable(container, title, columns, rows) {
  const body = rows.length ? renderLessonExample({ title, columns, rows }) : element("p", { textContent: "Keine Zeilen im Ergebnis." });
  container.replaceChildren(body);
}

function renderDatabaseSchema(reveal) {
  const panel = labPanel("Eine Ausleihzeile einfügen", "E1 und E2 gehören zum Titel T1. Gültige Mitglieder sind M1 und M2. Teste die vier Felder der neuen Zeile, bevor du weitere Daten eingibst.");
  const key = labSelect("db-schema-id", "Ausleih-ID", [["L1", "L1"], ["L2", "L2"], ["L3", "L3"]], "L2");
  const copy = labSelect("db-schema-exemplar", "Exemplar", [["E2", "E2"], ["E3", "E3"], ["E9", "E9 (fehlt im Bestand)"]]);
  const member = labSelect("db-schema-mitglied", "Mitglied", [["M1", "M1"], ["M2", "M2"], ["M9", "M9 (unbekannt)"], ["", "NULL"]]);
  const days = labSelect("db-schema-tage", "Ausleihdauer", [[14, "14 Tage"], [0, "0 Tage"], [28, "28 Tage"]]);
  const state = element("div");
  const statement = element("pre", { className: "db-command" });
  const definition = element("details", { className: "self-check" }, element("summary", { textContent: "Tabellendefinition ansehen" }),
    element("pre", { className: "db-command", textContent: "CREATE TABLE ausleihe (\n  id text PRIMARY KEY,\n  exemplar_id text NOT NULL REFERENCES exemplar(id),\n  mitglied_id text NOT NULL REFERENCES mitglied(id),\n  tage integer NOT NULL CHECK (tage > 0),\n  status text NOT NULL DEFAULT 'offen'\n);" }));
  const status = labStatus();
  const rows = [];
  const update = () => dbTable(state, "Gespeicherte Ausleihen", ["ID", "Exemplar", "Mitglied", "Tage"], rows);
  const reset = () => {
    rows.splice(0, rows.length, ["L1", "E1", "M1", 14]);
    statement.textContent = "";
    update();
    dbStatus(status, "L1 ist bereits gespeichert. Füge eine weitere Zeile ein.");
  };
  const insert = () => {
    const id = key.input.value;
    const exemplar = copy.input.value;
    const person = member.input.value;
    const duration = Number(days.input.value);
    statement.textContent = `INSERT INTO ausleihe (id, exemplar_id, mitglied_id, tage)\nVALUES ('${id}', '${exemplar}', ${person ? `'${person}'` : "NULL"}, ${duration});`;
    const errors = [];
    if (rows.some(([stored]) => stored === id)) errors.push("PRIMARY KEY: Diese Ausleih-ID ist bereits belegt.");
    if (!dbCopies.some(([stored]) => stored === exemplar)) errors.push("FOREIGN KEY: Das Exemplar fehlt im Bestand.");
    if (!person) errors.push("NOT NULL: Wähle ein Mitglied.");
    else if (!["M1", "M2"].includes(person)) errors.push("FOREIGN KEY: Das Mitglied ist unbekannt.");
    if (duration <= 0) errors.push("CHECK: Wähle eine Dauer größer als null.");
    if (errors.length) dbStatus(status, errors.join(" "), "retry");
    else {
      rows.push([id, exemplar, person, duration]);
      update();
      dbStatus(status, `${id} wurde gespeichert. E1 und E2 bleiben eigenständige Exemplare.`, "success");
    }
    reveal();
  };
  panel.append(element("div", { className: "lab-controls" }, key.row, copy.row, member.row, days.row),
    element("div", { className: "actions" }, learningButton("INSERT ausführen", insert), learningButton("Bestand zurücksetzen", reset, true)), status, statement, state, definition);
  reset();
  return panel;
}

function renderDatabaseQuery(reveal) {
  const panel = labPanel("Eine SQL-Auswertung zusammenstellen", "Orbit wurde zweimal ausgeliehen, Küstentage einmal und Moosatlas noch nie. Ändere Join, Statusbedingung und Zählweise. Die Demo führt die gewählten Operationen auf lokalen Beispieldaten aus.");
  const join = labSelect("db-sql-join", "Verbund", [["INNER", "INNER JOIN"], ["LEFT", "LEFT JOIN"]]);
  const filter = labSelect("db-sql-filter", "Status im ON-Ausdruck", [["all", "Alle Ausleihen"], ["open", "Nur offene Ausleihen"]]);
  const count = labSelect("db-sql-count", "Zählweise", [["id", "COUNT(a.id)"], ["*", "COUNT(*)"]]);
  const code = element("pre", { className: "db-command" });
  const output = element("div");
  const status = labStatus();
  const run = () => {
    const outer = join.input.value === "LEFT";
    const openOnly = filter.input.value === "open";
    const allRows = count.input.value === "*";
    const rows = dbTitles.flatMap(([id, title]) => {
      const copyIds = dbCopies.filter(([, titleId]) => titleId === id).map(([copyId]) => copyId);
      const matches = dbLoans.filter(([, copyId, , , state]) => copyIds.includes(copyId) && (!openOnly || state === "offen")).length;
      return matches || outer ? [[title, matches || Number(allRows)]] : [];
    });
    code.textContent = `SELECT t.titel, COUNT(${allRows ? "*" : "a.id"}) AS anzahl\nFROM titel AS t\n${join.input.value} JOIN (exemplar AS e JOIN ausleihe AS a\n  ON a.exemplar_id = e.id${openOnly ? " AND a.status = 'offen'" : ""})\n  ON e.titel_id = t.id\nGROUP BY t.id, t.titel\nORDER BY t.id;`;
    dbTable(output, "Abfrageergebnis", ["Titel", "Anzahl"], rows);
    dbStatus(status, outer && allRows ? "Der LEFT JOIN ergänzt pro Titel ohne Treffer eine Zeile. COUNT(*) zählt auch diese Zeile.":
      `${rows.length} Titel im Ergebnis. ${outer ? "Titel ohne Treffer bleiben mit Anzahl 0 erhalten." : "Titel ohne Treffer fehlen."}`);
    reveal();
  };
  panel.append(element("div", { className: "lab-controls" }, join.row, filter.row, count.row), dbRun("Abfrage ausführen", run), status, code, output);
  return panel;
}

function renderDatabaseNormalization(reveal) {
  const panel = labPanel("Einen Titel an zwei Stellen vergleichen", "E1 und E2 haben dieselbe Titel-ID. Wähle ein Schema und benenne Orbit um. Ein Zurücksetzen stellt die Anfangsdaten beider Varianten wieder her.");
  const mode = labSelect("db-nf-modell", "Datenmodell", [["flat", "Flache Importtabelle"], ["split", "Exemplar, Titel und Verlag getrennt"]]);
  const copy = labSelect("db-nf-kopie", "Exemplar für die Änderung", [["E1", "E1"], ["E2", "E2"]]);
  const nextTitle = element("input", { id: "db-nf-titel", className: "lab-text-input", type: "text", value: "Orbit – Neuausgabe", maxLength: 42 });
  const labels = [["E1", "T1"], ["E2", "T1"]];
  const output = element("div");
  const status = labStatus();
  let flat;
  let title;
  const show = () => {
    const split = mode.input.value === "split";
    dbTable(output, split ? "Join aus drei Relationen" : "Flache Importzeilen", ["Exemplar", "Titel-ID", "Titel", "Verlag"],
      labels.map(([id, titleId]) => [id, titleId, split ? title : flat.get(id), "Lichtbuch"]));
  };
  const reset = () => {
    flat = new Map(labels.map(([id]) => [id, "Orbit"]));
    title = "Orbit";
    dbStatus(status, "Beide Varianten zeigen den ursprünglichen Titel.");
    show();
  };
  const change = () => {
    const value = nextTitle.value.trim();
    if (!value) {
      dbStatus(status, "Gib einen neuen Titel ein.", "retry");
      return;
    }
    if (mode.input.value === "split") {
      title = value;
      dbStatus(status, "Ein UPDATE an T1 genügt. Der Join zeigt den neuen Namen bei beiden Exemplaren.", "success");
    } else {
      flat.set(copy.input.value, value);
      const inconsistent = new Set(flat.values()).size > 1;
      dbStatus(status, inconsistent ? "Änderungsanomalie: Dieselbe Titel-ID hat jetzt zwei verschiedene Namen." : "Beide Importzeilen stimmen jetzt überein.", inconsistent ? "retry" : "success");
    }
    show();
    reveal();
  };
  mode.input.addEventListener("change", () => { show(); dbStatus(status, "Modell gewechselt. Prüfe die Änderung in diesem Schema."); });
  panel.append(mode.row, copy.row, element("div", { className: "lab-control" }, element("label", { htmlFor: nextTitle.id, textContent: "Neuer Titel" }), nextTitle),
    element("div", { className: "actions" }, learningButton("Titel ändern", change), learningButton("Zurücksetzen", reset, true)), status, output);
  reset();
  return panel;
}

function renderDatabaseView(reveal) {
  const panel = labPanel("Berechtigungen im Lesemodell prüfen", "Die Rolle Ausleihtheke darf beide Quellen abfragen. Die Rolle Statistik erhält in der Demo nur Zugriff auf die View. Probiere beide Kombinationen aus.");
  const role = labSelect("db-view-rolle", "Rolle", [["stats", "Statistik"], ["desk", "Ausleihtheke"]]);
  const source = labSelect("db-view-quelle", "Quelle", [["table", "Basistabelle ausleihe"], ["view", "View filialstatistik"]]);
  const output = element("div");
  const status = labStatus();
  const select = () => {
    if (source.input.value === "table") {
      if (role.input.value === "stats") {
        output.replaceChildren();
        dbStatus(status, "Zugriff verweigert. Statistik hat kein SELECT-Recht auf der Basistabelle.", "retry");
      } else {
        dbTable(output, "Ausleihdaten", ["ID", "Exemplar", "Mitglied", "Filiale", "Status"], dbLoans);
        dbStatus(status, "Die Ausleihtheke sieht die einzelnen Ausleihen.", "success");
      }
    } else {
      const totals = new Map();
      for (const [, , , branch] of dbLoans) totals.set(branch, (totals.get(branch) ?? 0) + 1);
      dbTable(output, "Statistikview", ["Filiale", "Ausleihen"], [...totals]);
      dbStatus(status, "Die View liefert die Summen pro Filiale. Einzelne Mitgliedskennungen werden nicht ausgegeben.", "success");
    }
    reveal();
  };
  for (const input of [role.input, source.input]) input.addEventListener("change", () => { output.replaceChildren(); dbStatus(status, "Auswahl geändert. Führe die Abfrage erneut aus."); });
  panel.append(role.row, source.row, dbRun("SELECT testen", select), status, output);
  return panel;
}

function renderDatabaseMigration(reveal) {
  const panel = labPanel("Filialcode nachtragen", "Spiele die Migration im Wartungsfenster durch. Für die alte Außenstelle muss die Fachabteilung den Code bestätigen. Du kannst den Rückstand vor der Umschaltung prüfen.");
  const rows = [["A01", "Nord"], ["A02", "Süd"], ["A03", "Außenstelle"], ["A04", "Nord"]];
  const status = labStatus();
  const output = element("div");
  let added;
  let approved;
  let switched;
  let codes;
  const show = () => dbTable(output, switched ? "Neue Spalte wird gelesen" : "Altbestand", added ? ["ID", "Altwert", "Filialcode"] : ["ID", "Altwert"],
    rows.map(([id, branch], index) => added ? [id, branch, codes[index] ?? "NULL"] : [id, branch]));
  const actions = new Map([
    ["Neue Spalte hinzufügen", () => {
      added = true;
      dbStatus(status, "Spalte ergänzt. Bestehende Codes bleiben erhalten. Fehlende Codes stehen auf NULL.");
    }],
    ["Altwerte nachtragen", () => {
      if (!added) return dbStatus(status, "Füge zuerst die Zielspalte hinzu.", "retry");
      const mapping = new Map([["Nord", "N"], ["Süd", "S"]]);
      if (approved) mapping.set("Außenstelle", "OST");
      codes = rows.map(([, branch]) => mapping.get(branch));
      dbStatus(status, `${codes.filter(Boolean).length} von ${rows.length} Codes befüllt.`);
    }],
    ["Code OST bestätigen", () => {
      approved = true;
      dbStatus(status, "Die Fachabteilung bestätigt OST für Außenstelle. Wiederhole das Nachtragen.");
    }],
    ["Pflichtwert prüfen und umschalten", () => {
      const missing = codes.filter((value) => !value).length;
      if (!added || missing) return dbStatus(status, `Umschaltung abgelehnt. ${missing} fehlende Codes. Ergänze das Mapping und befülle die Spalte erneut.`, "retry");
      switched = true;
      dbStatus(status, "Alle Codes sind befüllt. Die Anwendung liest jetzt die neue Spalte. Der Altwert bleibt für den Rückweg verfügbar.", "success");
    }],
  ]);
  const reset = () => {
    added = approved = switched = false;
    codes = rows.map(() => null);
    dbStatus(status, "Altschema geladen.");
    show();
  };
  panel.append(element("div", { className: "actions" }, ...Array.from(actions, ([label, action]) => learningButton(label, () => {
    action();
    show();
    reveal();
  })), learningButton("Migration zurücksetzen", reset, true)), status, output);
  reset();
  return panel;
}

function renderDatabasePages(reveal) {
  const panel = labPanel("Seiten in einen Puffer lesen", "Das vereinfachte Archiv hat 2.048 gleich große Zeilen und 8.192 Bytes pro Seite. Wiederhole eine Abfrage, um kalte und warme Puffer zu vergleichen.");
  const width = labSelect("db-seiten-breite", "Zeilenbreite", [[128, "128 Byte"], [1024, "1.024 Byte"], [3072, "3.072 Byte"]]);
  const order = labSelect("db-seiten-ordnung", "Zugriffsmuster", [["near", "8 benachbarte Zeilen"], ["far", "8 über das Archiv verteilte Zeilen"]]);
  const capacity = labSelect("db-seiten-kapazitaet", "Pufferkapazität", [[2, "2 Seiten"], [8, "8 Seiten"]], 8);
  const result = labReadout();
  const status = labStatus();
  const cache = new Set();
  let runs = 0;
  const reset = () => {
    cache.clear();
    runs = 0;
    result.show([]);
    dbStatus(status, "Der Puffer ist leer.");
  };
  const run = () => {
    const rows = Array.from({ length: 8 }, (_, index) => order.input.value === "near" ? index : index * 256);
    const perPage = Math.floor(8192 / Number(width.input.value));
    const pages = rows.map((index) => Math.floor(index / perPage));
    let hits = 0;
    for (const page of pages) {
      if (cache.delete(page)) hits++;
      cache.add(page);
      if (cache.size > Number(capacity.input.value)) cache.delete(cache.values().next().value);
    }
    result.show([["Zeilen pro Seite", String(perPage)], ["Reihenfolge der Seiten", pages.join(", ")], ["Verschiedene Seiten", String(new Set(pages).size)],
      ["Puffertreffer", String(hits)], ["Seitennachladungen", String(pages.length - hits)], ["Puffer am Ende", [...cache].join(", ")]]);
    const misses = pages.length - hits;
    dbStatus(status, `Lauf ${++runs}: ${hits} Puffertreffer, ${misses} ${misses === 1 ? "Seite" : "Seiten"} nachgeladen. Wiederhole die Abfrage mit demselben Puffer.`);
    reveal();
  };
  for (const select of [width, order, capacity]) select.input.addEventListener("change", reset);
  panel.append(element("div", { className: "lab-controls" }, width.row, order.row, capacity.row),
    element("div", { className: "actions" }, learningButton("Zeilen lesen", run), learningButton("Puffer leeren", reset, true)), status, result.readout);
  reset();
  return panel;
}

function dbLowerBound(array, value) {
  let low = 0;
  let high = array.length;
  let comparisons = 0;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    comparisons++;
    if (array[middle].key < value) low = middle + 1;
    else high = middle;
  }
  return { offset: low, comparisons };
}

function renderDatabaseIndex(reveal) {
  const panel = labPanel("Suchbereiche im Index vergleichen", "Das Modell arbeitet mit 240 Einträgen von 4 Filialen aus 60 Tagen. Der Tabellenscan prüft alle Einträge. Der sortierte Zugriff grenzt einen passenden Schlüsselbereich ein.");
  const query = labSelect("db-index-query", "Abfrage", [["exact", "Filiale 2 am Tag 20"], ["day", "Tag 20 in allen Filialen"], ["branch", "Alle Tage der Filiale 2"]]);
  const index = labSelect("db-index-sortierung", "Reihenfolge im Index", [["branch", "(filiale, tag)"], ["day", "(tag, filiale)"]]);
  const rows = Array.from({ length: 240 }, (_, i) => ({ branch: i % 4 + 1, day: Math.floor(i / 4) + 1, page: Math.floor(i / 20) }));
  const output = element("div");
  const status = labStatus();
  const run = () => {
    const kind = query.input.value;
    const first = index.input.value;
    const matches = ({ branch, day }) => (kind === "day" || branch === 2) && (kind === "branch" || day === 20);
    const modelKey = (branch, day) => first === "branch" ? branch * 100 + day : day * 100 + branch;
    const sorted = rows.map((row) => ({ ...row, key: modelKey(row.branch, row.day) })).sort((a, b) => a.key - b.key);
    const bounded = kind === "exact" || kind === first;
    const base = kind === "exact" ? modelKey(2, 20) : (kind === "day" ? 20 : 2) * 100;
    const lower = bounded ? dbLowerBound(sorted, base) : { offset: 0, comparisons: 0 };
    const upper = bounded ? dbLowerBound(sorted, base + (kind === "exact" ? 1 : 100)) : { offset: sorted.length, comparisons: 0 };
    const search = sorted.slice(lower.offset, upper.offset);
    const found = search.filter(matches);
    const touched = new Set(found.map(({ page }) => page)).size;
    dbTable(output, "Arbeit im Modell", ["Pfad", "Geprüfte Einträge", "Datenseiten", "Treffer"], [
      ["Tabellenscan", rows.length, 12, rows.filter(matches).length], ["Indexzugriff", search.length, touched, found.length],
    ]);
    dbStatus(status, bounded ? `Indexbereich eingegrenzt. ${lower.comparisons + upper.comparisons} zusätzliche Vergleiche suchen die Grenzen.`
      : "Die Bedingung gilt nur für die zweite Spalte. Im vereinfachten Indexmodell wird die ganze Liste geprüft. Tausche die Spalten und vergleiche.");
    reveal();
  };
  panel.append(query.row, index.row, dbRun("Zugriffswege vergleichen", run), status, output);
  return panel;
}

function renderDatabasePlan(reveal) {
  const panel = labPanel("Einen Join erklären und ausführen", "Beim Modell kostet eine Indexsuche 12 Schritte. Der Hash Join braucht einen Schritt je Zeile für Aufbau oder Nachschlagen. Vergleiche die Planwahl vor und nach einer aktualisierten Schätzung.");
  const scenario = labSelect("db-plan-lage", "Filter", [["few", "Seltener Treffer: 4 Zeilen"], ["many", "Nach Import: 3.200 Zeilen"]], "many");
  const statistics = labSelect("db-plan-statistik", "Statistik", [["old", "Alt: 4 Zeilen geschätzt"], ["fresh", "Aktualisiert: tatsächliche Größe bekannt"]]);
  const choice = labSelect("db-plan-wahl", "Join-Strategie", [["auto", "Wahl nach geschätztem Aufwand"], ["nested", "Nested Loop mit Indexsuche"], ["hash", "Hash Join"]]);
  const status = labStatus();
  const plan = element("pre", { className: "db-command" });
  const output = labReadout();
  const run = (execute) => {
    const actual = scenario.input.value === "many" ? 3200 : 4;
    const estimate = statistics.input.value === "fresh" ? actual : 4;
    const inner = 6000;
    const cost = (kind, outer) => kind === "nested" ? outer * 12 : inner + outer;
    const automatic = cost("nested", estimate) <= cost("hash", estimate) ? "nested" : "hash";
    const kind = choice.input.value === "auto" ? automatic : choice.input.value;
    const label = kind === "nested" ? "Nested Loop" : "Hash Join";
    plan.textContent = `${label} (geschätzt: ${dbNumber.format(estimate)} äußere Zeilen)\n  Filter auf Ausleihe (geschätzt: ${dbNumber.format(estimate)} Zeilen)\n  ${kind === "nested" ? "Indexsuche je äußerer Zeile" : "Hash-Aufbau (6.000 Zeilen)"}`;
    const data = [["Geschätzter Aufwand des gewählten Plans", dbNumber.format(cost(kind, estimate))]];
    if (execute) data.push(["Tatsächliche äußere Zeilen", dbNumber.format(actual)], ["Nested Loop im Modell", `${dbNumber.format(cost("nested", actual))} Schritte`],
      ["Hash Join im Modell", `${dbNumber.format(cost("hash", actual))} Schritte`]);
    output.show(data);
    dbStatus(status, execute ? `Ausgeführt: ${label}. Geschätzt: ${dbNumber.format(estimate)} Zeilen. Tatsächlich: ${dbNumber.format(actual)} Zeilen.`
      : `Planvorschau: ${label}. Der Join wurde noch nicht ausgeführt.`);
    reveal();
  };
  panel.append(scenario.row, statistics.row, choice.row, element("div", { className: "actions" }, learningButton("EXPLAIN anzeigen", () => run(false)),
    learningButton("EXPLAIN ANALYZE simulieren", () => run(true))), status, plan, output.readout);
  return panel;
}

function renderDatabaseTransaction(reveal) {
  const panel = labPanel("Eine Buchung mit Rückweg", "Es gibt ein freies Exemplar. Starte die Transaktion, erfasse die Ausleihe und passe den Freibestand an. Löse nach einem Savepoint einen Fehler aus und prüfe den Unterschied zwischen den beiden Sichten.");
  const status = labStatus();
  const output = element("div");
  let committed;
  let pending;
  let saved;
  let failed;
  const show = () => dbTable(output, "Sichtbarkeit der Daten", ["Sicht", "Freibestand", "Ausleihe"], [
    ["Andere Sitzung", committed.free, committed.loan ? "vorhanden" : "fehlt"],
    ["Laufende Transaktion", pending?.free ?? "—", pending ? (pending.loan ? "vorhanden" : "fehlt") : "—"],
  ]);
  const end = () => { pending = saved = null; failed = false; };
  const reset = () => {
    committed = { free: 1, loan: false };
    end();
    dbStatus(status, "Ein freies Exemplar. Starte mit BEGIN.");
    show();
  };
  const requireBlock = (action, allowFailed = false) => () => {
    if (!pending) return dbStatus(status, "Es ist keine Transaktion geöffnet. Starte mit BEGIN.", "retry");
    if (failed && !allowFailed) return dbStatus(status, "Der Block ist fehlgeschlagen. Wähle ROLLBACK oder ROLLBACK TO, falls ein Savepoint existiert.", "retry");
    action();
  };
  const statements = new Map([
    ["BEGIN", () => {
      if (pending) return dbStatus(status, "Ein Block läuft bereits.", "retry");
      pending = { ...committed };
      dbStatus(status, "Der Transaktionsblock ist geöffnet.");
    }],
    ["Ausleihe eintragen", requireBlock(() => {
      if (pending.loan) return dbStatus(status, "Für diese Demo-Buchung existiert bereits ein Eintrag.", "retry");
      pending.loan = true;
      dbStatus(status, "Die Ausleihe ist im Zwischenstand sichtbar. Passe auch den Freibestand an.");
    })],
    ["Freibestand reduzieren", requireBlock(() => {
      if (pending.free === 0) return dbStatus(status, "Der Freibestand ist bereits null.", "retry");
      pending.free--;
      dbStatus(status, "Der Freibestand im Zwischenstand beträgt jetzt null.");
    })],
    ["SAVEPOINT setzen", requireBlock(() => {
      saved = { ...pending };
      dbStatus(status, "Zwischenstand gesichert.");
    })],
    ["Fehler auslösen", requireBlock(() => {
      failed = true;
      dbStatus(status, "Eine simulierte Anweisung ist fehlgeschlagen. Der Block ist bis zum Rückweg abgebrochen.", "retry");
    })],
    ["ROLLBACK TO SAVEPOINT", requireBlock(() => {
      if (!saved) return dbStatus(status, "Es gibt noch keinen Savepoint. Mit ROLLBACK kannst du den ganzen Block verwerfen.", "retry");
      pending = { ...saved };
      failed = false;
      dbStatus(status, "Der Zwischenstand wurde wiederhergestellt. Der Block kann fortgesetzt werden.", "success");
    }, true)],
    ["COMMIT", requireBlock(() => {
      if (pending.free + Number(pending.loan) !== 1) {
        end();
        return dbStatus(status, "Die Bestandsregel für den Abschluss ist verletzt. Die Demo verwirft den Block. Beginne erneut und ändere beide Werte gemeinsam.", "retry");
      }
      committed = pending;
      end();
      dbStatus(status, "COMMIT erfolgreich. Der bestätigte Zustand ist jetzt auch außerhalb des Blocks sichtbar.", "success");
    })],
    ["ROLLBACK", requireBlock(() => {
      end();
      dbStatus(status, "Der Block wurde verworfen. Die Außenansicht zeigt weiterhin den zuvor bestätigten Zustand.");
    }, true)],
  ]);
  panel.append(element("div", { className: "actions" }, ...Array.from(statements, ([label, action]) => learningButton(label, () => {
    action();
    show();
    reveal();
  })), learningButton("Szenario zurücksetzen", reset, true)), status, output);
  reset();
  return panel;
}

function renderDatabaseSnapshots(reveal) {
  const panel = labPanel("Zwei Sitzungen Schritt für Schritt", "A beginnt eine Transaktion. B arbeitet parallel. A liest vor und nach B’s Bestätigung. Wechsle den Isolationsgrad und wiederhole dieselbe Folge.");
  const isolation = labSelect("db-mvcc-isolation", "Isolation für A", [["rc", "READ COMMITTED"], ["rr", "REPEATABLE READ"]]);
  const kind = labSelect("db-mvcc-fall", "Abfrage in A", [["count", "Offene Vormerkungen zählen"], ["days", "Ausleihdauer von L1 lesen"]]);
  const status = labStatus();
  const output = element("div");
  const labels = ["A liest zuerst", "B schreibt", "A liest vor COMMIT", "B bestätigt", "A liest danach"];
  const events = [];
  let stage;
  const show = () => dbTable(output, "Ablauf der Sitzungen", ["Schritt", "Beobachtung"], events);
  const next = learningButton(labels[0], () => {
    const insert = kind.input.value === "count";
    const first = insert ? "2 Vormerkungen" : "14 Tage";
    const second = insert ? "3 Vormerkungen" : "21 Tage";
    const stable = isolation.input.value === "rr";
    const notes = [
      `A sieht ${first}.`,
      insert ? "B fügt eine offene Vormerkung ein. Die Änderung ist noch unbestätigt." : "B ändert L1 auf 21 Tage. Die Änderung ist noch unbestätigt.",
      `A sieht weiterhin ${first}. Unbestätigte Änderungen von B sind ausgeschlossen.`,
      `COMMIT in B. Der bestätigte Wert ist nun ${second}.`,
      stable ? `A sieht ${first}. Sein Transaktionssnapshot bleibt gleich.`
        : `A sieht jetzt ${second}. ${insert ? "Phantom Read" : "Nicht wiederholbares Lesen"}; der Anweisungssnapshot hat sich geändert.`,
    ];
    events.push([labels[stage], notes[stage]]);
    dbStatus(status, notes[stage]);
    show();
    stage++;
    next.textContent = labels[stage] ?? "Ablauf beendet";
    if (stage === labels.length) {
      next.disabled = true;
      restart.focus();
      reveal();
    }
  });
  const reset = () => {
    stage = 0;
    events.length = 0;
    next.textContent = labels[0];
    next.disabled = false;
    output.replaceChildren();
    dbStatus(status, "Bereit für die erste Abfrage in Sitzung A.");
  };
  const restart = learningButton("Ablauf zurücksetzen", reset, true);
  for (const select of [isolation, kind]) select.input.addEventListener("change", reset);
  panel.append(isolation.row, kind.row, element("div", { className: "actions" }, next, restart), status, output);
  reset();
  return panel;
}

function renderDatabaseWriteSkew(reveal) {
  const panel = labPanel("Die letzte Person im Dienst behalten", "Mindestens eine Person muss im Dienst bleiben. A und B ändern je eine andere Zeile. In der strengeren Variante zeigt die Demo einen möglichen Konfliktabbruch von B.");
  const isolation = labSelect("db-skew-isolation", "Isolation", [["rr", "REPEATABLE READ"], ["serial", "SERIALIZABLE"]]);
  const status = labStatus();
  const result = labReadout();
  let phase;
  let active;
  let abort;
  const show = () => result.show([["Bestätigte Besetzung", `${active} ${active === 1 ? "Person" : "Personen"} im Dienst`],
    ["Mindestbesetzung", active >= 1 ? "Eingehalten" : "Verletzt"]]);
  const read = learningButton("Beide lesen", () => {
    phase = 1;
    read.disabled = true;
    write.disabled = false;
    write.focus();
    dbStatus(status, "Beide Snapshots zeigen zwei Personen im Dienst.");
  });
  const write = learningButton("Beide Abmeldungen vormerken", () => {
    phase = 2;
    write.disabled = true;
    commit.disabled = false;
    commit.focus();
    dbStatus(status, "A und B ändern unterschiedliche Zeilen. Die Abmeldungen sind noch unbestätigt.");
  });
  const commit = learningButton("Beide COMMITs versuchen", () => {
    phase = 3;
    abort = isolation.input.value === "serial";
    active = abort ? 1 : 0;
    show();
    dbStatus(status, abort ? "A bestätigt. B erhält einen Serialisierungsfehler. Ein vollständiger Neustart liest den neuen Zustand." : "Beide bestätigen. Die Mindestbesetzung ist verletzt: Write Skew.", abort ? "success" : "retry");
    commit.disabled = true;
    retry.disabled = !abort;
    (abort ? retry : restart).focus();
    reveal();
  });
  const retry = learningButton("B mit neuem Snapshot starten", () => {
    if (phase !== 3 || !abort) return;
    dbStatus(status, "B sieht jetzt nur eine Person im Dienst und lässt die Abmeldung aus. Die Mindestbesetzung bleibt erfüllt.", "success");
  });
  const reset = () => {
    phase = 0;
    active = 2;
    abort = false;
    read.disabled = false;
    write.disabled = commit.disabled = retry.disabled = true;
    dbStatus(status, "Zwei Personen sind im Dienst. Beginne mit den beiden Lesevorgängen.");
    show();
  };
  const restart = learningButton("Zurücksetzen", reset, true);
  isolation.input.addEventListener("change", reset);
  panel.append(isolation.row, element("div", { className: "actions" }, read, write, commit, retry, restart), status, result.readout);
  reset();
  return panel;
}

function renderDatabaseWarehouse(reveal) {
  const panel = labPanel("Faktentabelle laden und auswerten", "Im Eingang liegen sechs Zeilen. Prüfe erst die Rohdaten. Lade dann die bereinigte Faktentabelle und vergleiche Zeit und Filiale.");
  const group = labSelect("db-dwh-gruppe", "Gruppierung", [["month", "Nach Monat"], ["branch", "Nach Filiale"], ["both", "Nach Monat und Filiale"]]);
  const slice = labSelect("db-dwh-filter", "Genre", [["all", "Alle"], ["krimi", "Krimi"], ["reise", "Reise"], ["natur", "Natur"]]);
  const input = [
    ["A1", "Januar", "Nord", "krimi"], ["A2", "Januar", "Süd", "reise"], ["A2", "Januar", "Süd", "reise"],
    ["A3", "Februar", "Nord", "natur"], ["A4", "Februar", "Süd", "reise"], ["A5", "Februar", "", "krimi"],
  ];
  const output = element("div");
  const status = labStatus();
  let facts;
  const report = () => {
    const totals = new Map();
    const dataset = facts ?? input;
    for (const [, month, branch, genre] of dataset) {
      if (slice.input.value !== "all" && genre !== slice.input.value) continue;
      const place = branch || "Filiale fehlt";
      const key = group.input.value === "month" ? month : group.input.value === "branch" ? place : `${month} · ${place}`;
      totals.set(key, (totals.get(key) ?? 0) + 1);
    }
    dbTable(output, facts ? "Bericht aus dem Warehouse" : "Bericht direkt aus Rohzeilen", ["Gruppe", "Ausleihen"], [...totals]);
    dbStatus(status, `${facts ? "Bereinigte Faktentabelle" : "Rohimport"}: ${dataset.length} Zeilen vor dem Genrefilter.`);
    reveal();
  };
  const load = () => {
    const valid = input.filter(([, , branch]) => branch);
    facts = [...new Map(valid.map((row) => [row[0], row])).values()];
    dbTable(output, "Faktentabelle", ["Ausleihe", "Monat", "Filiale", "Genre"], facts);
    dbStatus(status, `${facts.length} Fakten geladen. ${valid.length - facts.length} Dublette zusammengeführt, ${input.length - valid.length} Zeile ohne Filiale zur Klärung abgelegt.`, "success");
    reveal();
  };
  const reset = () => {
    facts = undefined;
    output.replaceChildren();
    dbStatus(status, "Rohimport geladen. Erstelle einen Bericht oder lade zuerst die Faktentabelle.");
  };
  panel.append(group.row, slice.row, element("div", { className: "actions" }, learningButton("Bericht erstellen", report),
    learningButton("ETL ausführen", load), learningButton("Rohdaten wiederherstellen", reset, true)), status, output);
  reset();
  return panel;
}

function renderDatabaseMining(reveal) {
  const panel = labPanel("Zwei Genres gegeneinander prüfen", "Die Stichprobe umfasst zehn Ausleihvorgänge mit je einem oder mehreren Genres. Wähle die Richtung der Regel und vergleiche sie mit der Grundrate des Zielgenres.");
  const genres = ["Krimi", "Reise", "Natur"].map((value) => [value, value]);
  const first = labSelect("db-mining-von", "Voraussetzung A", genres, "Krimi");
  const second = labSelect("db-mining-nach", "Zielgenre B", genres, "Reise");
  const baskets = [
    ["Krimi", "Reise"], ["Krimi", "Reise"], ["Krimi"], ["Reise"], ["Reise"],
    ["Reise"], ["Reise"], ["Natur"], ["Natur", "Reise"], ["Krimi", "Reise"],
  ];
  const status = labStatus();
  const output = labReadout();
  const run = () => {
    const a = first.input.value;
    const b = second.input.value;
    if (a === b) {
      output.show([]);
      dbStatus(status, "Wähle für diesen Vergleich zwei unterschiedliche Genres.", "retry");
      return;
    }
    const source = baskets.filter((basket) => basket.includes(a));
    const target = baskets.filter((basket) => basket.includes(b)).length;
    const both = source.filter((basket) => basket.includes(b)).length;
    const support = both / baskets.length;
    const confidence = both / source.length;
    const base = target / baskets.length;
    const lift = confidence / base;
    output.show([["Support", `${both}/${baskets.length} = ${labPercent.format(support)}`],
      ["Konfidenz", `${both}/${source.length} = ${labPercent.format(confidence)}`],
      ["Grundrate von B", `${target}/${baskets.length} = ${labPercent.format(base)}`], ["Lift", dbNumber.format(lift)]]);
    dbStatus(status, `Regel ${a} → ${b}. Unter den Vorgängen mit ${a} kommt ${b} ${confidence > base ? "häufiger" : confidence < base ? "seltener" : "genauso häufig"} vor wie insgesamt.`);
    reveal();
  };
  panel.append(first.row, second.row, dbRun("Regel berechnen", run), status, output.readout);
  return panel;
}

function renderDatabaseDistribution(reveal) {
  const panel = labPanel("Zwei Knoten trennen und wieder verbinden", "Die Replikation betrifft einen gemeinsamen Bestand. Für den Sharding-Vergleich darunter betrachtet das Labor separat eine Liste von Filialdatensätzen.");
  const policy = labSelect("db-cap-policy", "Antwortregel bei Netztrennung", [["local", "Aus lokaler Kopie antworten"], ["strict", "Für Zugriff beide Knoten koordinieren"]]);
  const status = labStatus();
  const replication = labReadout();
  let connected = true;
  let north = 2;
  let south = 2;
  const show = () => {
    replication.show([["Leitung", connected ? "Verbunden" : "Getrennt"], ["Kopie Nord", String(north)], ["Kopie Süd", String(south)]]);
    network.textContent = connected ? "Netz trennen" : "Netz wieder verbinden";
  };
  const network = learningButton("Netz trennen", () => {
    connected = !connected;
    if (connected) south = north;
    show();
    dbStatus(status, connected ? "Die Leitung steht wieder. Die Demo übernimmt bestätigte Änderungen des einzigen Schreibknotens Nord nach Süd." : "Die Knoten können keine Änderungen austauschen.");
  }, true);
  const read = (branch) => () => {
    if (!connected && policy.input.value === "strict") dbStatus(status, `${branch} wartet auf Koordination. In dieser Variante liefert die Abfrage derzeit keine Antwort.`, "retry");
    else dbStatus(status, `${branch} meldet ${branch === "Nord" ? north : south} freie Exemplare. ${!connected && branch === "Süd" ? "Der Stand kann älter sein." : ""}`.trim());
    reveal();
  };
  const write = () => {
    if (!connected && policy.input.value === "strict") dbStatus(status, "Die Buchung wartet auf Koordination. Keine Änderung bestätigt.", "retry");
    else if (north === 0) dbStatus(status, "In Nord ist kein Exemplar mehr frei.", "retry");
    else {
      north--;
      if (connected) south = north;
      show();
      dbStatus(status, connected ? "Die Buchung wurde in beiden Kopien wirksam." : "Nord bestätigt lokal. Süd hat diese Änderung noch nicht erhalten.", "success");
    }
    reveal();
  };
  const reset = () => {
    connected = true;
    north = south = 2;
    dbStatus(status, "Beide Kopien beginnen mit demselben Bestand.");
    show();
  };
  const placement = labReadout();
  const shards = () => {
    const records = [["A01", "Nord"], ["A02", "Süd"], ["A03", "Nord"], ["A04", "Süd"], ["A05", "Nord"]];
    placement.show(["Nord", "Süd"].map((branch) => [`Shard ${branch}`, records.filter(([, site]) => site === branch).map(([id]) => id).join(", ")]));
    dbStatus(status, "Die Filiale ist der Shard-Schlüssel. Jede Zeile liegt auf genau einem der beiden Beispiel-Shards.");
    reveal();
  };
  panel.append(policy.row, element("div", { className: "actions" }, network, learningButton("In Nord buchen", write),
    learningButton("Nord lesen", read("Nord")), learningButton("Süd lesen", read("Süd")), learningButton("Kopien zurücksetzen", reset, true)),
    status, replication.readout, dbRun("Filialdatensätze auf Shards routen", shards), placement.readout);
  reset();
  return panel;
}

function renderDatabaseModels(reveal) {
  const panel = labPanel("Vier Zugriffe vergleichen", "Wähle die Aufgabe und ein Datenmodell. Der Vergleich bewertet den gezeigten Standardzugriff. Ergänzende Indizes oder ein anderes Schema können das Ergebnis verändern.");
  const models = new Map([
    ["kv", ["Schlüssel-Wert", "session:17 → { Ablauf, Rolle }", "Zugriff per bekanntem Schlüssel"]],
    ["document", ["Dokument", "{ titel, formate: [ … ], infos: { … } }", "Ein Dokument samt eingebetteten Feldern lesen"]],
    ["wide", ["Wide Column", "Partition: Filiale · Sortierung: Zeit", "Innerhalb einer bekannten Partition einen Zeitbereich lesen"]],
    ["graph", ["Graph", "(Person) → [MITGLIED_VON] → (Gruppe) → [KOOPERIERT] → (Gruppe)", "Beziehungen als Pfad traversieren"]],
  ]);
  const cases = new Map([
    ["session", ["Sitzung mit bekannter ID lesen", "kv", "Ein einziger bekannter Schlüssel reicht aus. Plane Lebensdauer und Folgen eines Cache-Ausfalls."]],
    ["catalog", ["Titel mit unterschiedlich aufgebauten Details lesen", "document", "Die gemeinsam gelesenen Titelinfos passen in ein Dokument. Mehrfach gespeicherte Angaben brauchen eine Abstimmung beim Schreiben."]],
    ["events", ["Ereignisse einer Filiale im Zeitbereich lesen", "wide", "Filiale als Partition und Zeit als Sortierung passen zum Zugriff. Eine überlastete Filiale kann zur heißen Partition werden."]],
    ["relations", ["Personen über mehrere Beziehungen verbinden", "graph", "Ein variabler Pfad lässt sich als Abfolge von Knoten und Kanten ausdrücken. Begrenze große Suchräume fachlich."]],
  ]);
  const task = labSelect("db-nosql-aufgabe", "Aufgabe", Array.from(cases, ([key, [label]]) => [key, label]));
  const model = labSelect("db-nosql-modell", "Datenmodell", Array.from(models, ([key, [label]]) => [key, label]));
  const status = labStatus();
  const output = labReadout();
  const run = () => {
    const [, recommended, why] = cases.get(task.input.value);
    const [label, structure, access] = models.get(model.input.value);
    const fits = model.input.value === recommended;
    output.show([["Beispielstruktur", structure], ["Direkter Zugriff im Modell", access], ["Ein passendes Ausgangsmodell", `${models.get(recommended)[0]}. ${why}`]]);
    dbStatus(status, fits ? `${label} unterstützt den vorgesehenen Zugriff direkt.`
      : `${label} kann mit zusätzlicher Modellierung funktionieren. Der dargestellte Standardzugriff deckt diese Aufgabe nicht direkt ab.`, fits ? "success" : "retry");
    reveal();
  };
  panel.append(task.row, model.row, dbRun("Zugriff beurteilen", run), status, output.readout);
  return panel;
}

function dbVectorDistance(query, vector, metric) {
  if (metric === "euclidean") return Math.hypot(...query.map((value, i) => value - vector[i]));
  const dot = query.reduce((sum, value, i) => sum + value * vector[i], 0);
  return Math.max(0, 1 - dot / (Math.hypot(...query) * Math.hypot(...vector)));
}

function renderDatabaseVectors(reveal) {
  const panel = labPanel("Die ersten drei Treffer finden", "Die zweidimensionalen Beispielvektoren sind vorgegeben. Wähle die Anfrage, das Maß und den Suchraum. Vergleiche die Näherung mit den exakten Top-3.");
  const queries = new Map([["space", ["Weltraum [1; 0,1]", [1, 0.1]]], ["travel", ["Küste [0,1; 1]", [0.1, 1]]]]);
  const search = labSelect("db-vector-anfrage", "Suchvektor", Array.from(queries, ([key, [label]]) => [key, label]));
  const metric = labSelect("db-vector-mass", "Distanzmaß", [["cosine", "Kosinusdistanz"], ["euclidean", "Euklidische Distanz"]]);
  const scope = labSelect("db-vector-kandidaten", "Kandidaten prüfen", [["all", "Alle Kandidaten"], ["A", "Nur Gruppe A"], ["B", "Nur Gruppe B"]]);
  const documents = [
    ["Orbit", [2.8, 0.2], "A"], ["Sternkarte", [0.85, 0.05], "B"], ["Küstentage", [0.1, 0.95], "B"],
    ["Hafenlicht", [0.18, 0.8], "A"], ["Moosatlas", [0.45, 0.45], "A"], ["Rand der Galaxis", [0.9, 0.3], "B"],
  ];
  const status = labStatus();
  const output = element("div", { className: "lab-controls" });
  const picked = element("div");
  const reference = element("div");
  output.append(picked, reference);
  const run = () => {
    const query = queries.get(search.input.value)[1];
    const distance = metric.input.value;
    const group = scope.input.value;
    const candidates = documents.filter(([, , bucket]) => group === "all" || group === bucket);
    const rank = (items) => items.map(([title, vector]) => [title, vector, dbVectorDistance(query, vector, distance)])
      .sort((a, b) => a[2] - b[2]).slice(0, 3);
    const top = rank(candidates);
    const exact = group === "all" ? top : rank(documents);
    const shared = top.filter(([title]) => exact.some(([other]) => other === title)).length;
    const rows = (entries) => entries.map(([title, vector, value]) => [title, vector.map((n) => dbNumber.format(n)).join(" / "), dbNumber.format(value)]);
    dbTable(picked, "Treffer im gewählten Suchraum", ["Titel", "Vektor", "Distanz"], rows(top));
    if (group === "all") reference.replaceChildren();
    else dbTable(reference, "Exakte Referenz", ["Titel", "Vektor", "Distanz"], rows(exact));
    dbStatus(status, `${candidates.length} Vektoren im Suchraum bewertet. Recall@3: ${shared}/3 (${labPercent.format(shared / 3)}). Die Referenz vergleicht dieselbe Anfrage mit allen ${documents.length} Vektoren.`);
    reveal();
  };
  panel.append(search.row, metric.row, scope.row, dbRun("Top-3 berechnen", run), status, output);
  return panel;
}

const datenbankLabore = new Map([
  ["db-schema", renderDatabaseSchema],
  ["db-abfrage", renderDatabaseQuery],
  ["db-normalform", renderDatabaseNormalization],
  ["db-view", renderDatabaseView],
  ["db-migration", renderDatabaseMigration],
  ["db-seiten", renderDatabasePages],
  ["db-index", renderDatabaseIndex],
  ["db-plan", renderDatabasePlan],
  ["db-acid", renderDatabaseTransaction],
  ["db-mvcc", renderDatabaseSnapshots],
  ["db-write-skew", renderDatabaseWriteSkew],
  ["db-warehouse", renderDatabaseWarehouse],
  ["db-mining", renderDatabaseMining],
  ["db-verteilung", renderDatabaseDistribution],
  ["db-nosql", renderDatabaseModels],
  ["db-vektoren", renderDatabaseVectors],
]);
