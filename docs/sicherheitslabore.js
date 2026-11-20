"use strict";

function securityCheckbox(text, checked = false) {
  const input = element("input", { type: "checkbox", checked });
  return { input, row: element("label", { className: "option" }, input, element("span", { textContent: text })) };
}

function securityChoices(title, choices) {
  return element("fieldset", { className: "security-choices" }, element("legend", { textContent: title }), ...choices.map(({ row }) => row));
}

function securityStatus(status, text, result = "") {
  status.textContent = text;
  status.dataset.result = result;
}

function renderProtectionBudget(reveal) {
  const panel = labPanel("Wer trägt den Schaden?", "Ordne die Folgen zu. Danach kannst du den Schutz für den Turniertag vergleichen.");
  const decisions = [
    {
      prompt: "Die Mitgliederliste ist öffentlich. Wer trägt den unmittelbaren Schaden?",
      options: ["Die Mitglieder, deren private Kontaktdaten sichtbar werden.", "Nur die Person, die den Spielplan sucht."], answer: 0,
      clue: "Überlege, wessen Daten jetzt Fremde sehen können.", explanation: "Die Mitglieder verlieren Kontrolle über ihre Kontaktdaten.",
    }, {
      prompt: "Ein falsches Spielergebnis steht fest. Wer hat einen Nachteil?",
      options: ["Nur die Redaktion der Website.", "Die Mannschaft, die bei falschem Ergebnis ausscheidet."], answer: 1,
      clue: "Wer ist von der sportlichen Entscheidung betroffen?", explanation: "Die Mannschaft kann wegen der falschen Daten ausscheiden.",
    }, {
      prompt: "Der Spielplan ist ausgefallen. Wer kann schlechter handeln?",
      options: ["Teams und Helfende, die ihre Zeiten und Plätze nachschlagen wollen.", "Nur Personen, die bereits einen aktuellen Ausdruck haben."], answer: 0,
      clue: "Wer hat gerade keinen anderen Weg zum Plan?", explanation: "Wer den Plan erst nachschlagen muss, kann den Einsatz schlechter organisieren.",
    },
  ].map((question, index) => createLearningDecision(question, `schutz-schaden-${index}`));
  const budget = element("div", { className: "security-budget", hidden: true });
  const controls = [
    ["Mitgliederliste", "Zugriff auf Mitgliederliste prüfen (2 Punkte)", "Nur freigegebene Konten können die Liste öffnen. Bereits verteilte Kopien bleiben ein Risiko.", "Die Liste kann weiterhin von Unberechtigten geöffnet werden."],
    ["Spielergebnisse", "Zweite Freigabe für Ergebnisse (2 Punkte)", "Die zweite Prüfung senkt das Risiko einer unbemerkten Änderung. Zwei übersehene Fehler bleiben möglich.", "Eine Änderung kann weiterhin ungeprüft veröffentlicht werden."],
    ["Spielplan", "Datierten Spielplan als Aushang bereitlegen (2 Punkte)", "Beim Website-Ausfall ist der Plan vor Ort zugänglich. Änderungen nach dem Ausdruck können fehlen.", "Beim Website-Ausfall fehlt Teams und Helfenden ein Ersatz."],
  ].map(([area, label, protectedRisk, openRisk]) => ({ area, protectedRisk, openRisk, ...securityCheckbox(label) }));
  const budgetStatus = labStatus();
  const result = labReadout();
  const selectedCount = () => controls.filter(({ input }) => input.checked).length;
  const budgetInfo = element("p");
  const update = () => {
    budgetInfo.textContent = `${selectedCount() * 2} von 4 Punkten ausgewählt.`;
    securityStatus(budgetStatus, "");
    result.show([]);
  };
  update();
  for (const { input } of controls) input.addEventListener("change", update);
  const simulate = learningButton("Schutzplan ausprobieren", () => {
    if (selectedCount() > 2) {
      securityStatus(budgetStatus, "Die drei Maßnahmen kosten zusammen 6 Punkte. Nimm eine Auswahl zurück und entscheide, welches Risiko zuerst offenbleibt.", "retry");
      return;
    }
    result.show(controls.map(({ area, input, protectedRisk, openRisk }) => [area, input.checked ? protectedRisk : openRisk]));
    securityStatus(budgetStatus, "Vergleiche die geschützten Bereiche und die offenen Risiken. Ändere dann deine Auswahl.");
    reveal();
  });
  const check = learningButton("Schäden prüfen", () => {
    const correct = decisions.map(({ evaluate }) => evaluate()).every(Boolean);
    if (!correct) return;
    budget.hidden = false;
    budget.querySelector("input").focus();
  });
  budget.append(budgetInfo, securityChoices("Vier Punkte für Schutzmaßnahmen", controls), element("div", { className: "actions" }, simulate), budgetStatus, result.readout);
  panel.append(...decisions.map(({ field }) => field), element("div", { className: "actions" }, check), budget);
  return panel;
}

function renderClubAccount(reveal) {
  const panel = labPanel("Anmeldung für Leni", "Demo-Konto: leni@sv-uferpark.example. Das Handy ist im Verlustfall gesperrt. Das Portal verwendet ausschließlich erfundene Zugangsdaten.");
  const method = labSelect("konto-anmeldung", "Anmeldemethode", [
    ["password", "Nur Passwort"], ["mfa", "Passwort und App-Code"], ["passkey", "Nur Passkey auf dem Smartphone"],
  ]);
  const recovery = labSelect("konto-ersatz", "Unabhängiger Ersatz", [
    ["none", "Kein Ersatz"], ["device", "Separates Ersatzgerät bereits eingerichtet"], ["code", "Wiederherstellungsnachweis geschützt auf Papier"],
  ]);
  const manager = securityCheckbox("Einzigartiges Demo-Passwort im geschützten Manager auf einem zweiten Gerät ablegen");
  const passwordResult = element("p", { className: "lab-generated" });
  const phoneResult = element("p", { className: "lab-generated" });
  for (const output of [passwordResult, phoneResult]) output.setAttribute("role", "status");
  const reset = () => {
    manager.input.disabled = method.input.value === "passkey";
    passwordResult.textContent = phoneResult.textContent = "";
  };
  const passwordLeak = learningButton("Bekanntes Passwort simulieren", () => {
    const observations = {
      password: "Eine fremde Person kann sich mit dem bekannten Vereinskennwort anmelden. Leni hat ebenfalls noch Zugang und kann das Passwort ersetzen.",
      mfa: "Das bekannte Vereinskennwort allein reicht nicht. Leni kann sich mit Passwort und App-Code anmelden und das Passwort ersetzen.",
      passkey: "Das Portal akzeptiert kein Kennwort mehr. Das alte Demo-Passwort ermöglicht keinen Zugang. Lenis Passkey funktioniert weiterhin.",
    };
    const managerNote = manager.input.checked && !manager.input.disabled
      ? " Der Passwortmanager hilft gegen Wiederverwendung. Das bereits bekannte Vereinskennwort schützt er in diesem Fall nicht." : "";
    passwordResult.textContent = observations[method.input.value] + managerNote;
    reveal();
  });
  const lostPhone = learningButton("Handyverlust simulieren", () => {
    let ownAccess;
    if (method.input.value === "password") {
      ownAccess = manager.input.checked ? "Leni kann sich mit dem im separaten Manager abgelegten Passwort anmelden."
        : "Leni kann sich weiter anmelden, sofern sie ihr Passwort kennt. Das Portal verlangt kein Handy.";
    } else if (recovery.input.value === "device") {
      ownAccess = method.input.value === "mfa" ? "Leni nutzt ihr Kennwort und den eingerichteten Faktor des Ersatzgeräts."
        : "Leni meldet sich mit dem vorab registrierten zweiten Passkey an.";
    } else if (recovery.input.value === "code") {
      ownAccess = "Leni beginnt die Wiederherstellung über das offizielle Portal mit dem getrennt aufbewahrten Nachweis. Der Vereinsdienst prüft ihre Berechtigung und registriert ein neues Gerät.";
    } else {
      ownAccess = "Leni ist ausgesperrt. Halte den Verlust beim zuständigen Vereinsteam fest. Ein Ersatzweg hätte vor dem Verlust eingerichtet werden müssen.";
    }
    const revoke = method.input.value !== "password" && recovery.input.value === "none" ? "" : " Nach dem Zugang prüft Leni das verlorene Gerät und widerruft alte Sitzungen und Anmeldemittel.";
    phoneResult.textContent = `Für eine fremde Person bleibt der Zugang in diesem Fall gesperrt. Das Handy ist gesperrt und das Passwort in diesem Versuch geheim. ${ownAccess}${revoke}`;
    reveal();
  }, true);
  for (const input of [method.input, recovery.input, manager.input]) input.addEventListener("change", reset);
  panel.append(method.row, recovery.row, manager.row, element("div", { className: "actions" }, passwordLeak, lostPhone), passwordResult, phoneResult);
  return panel;
}

function renderClubInbox(reveal) {
  const panel = labPanel("Postfach des SV Uferpark", "Wähle eine Nachricht und prüfe, welche Beobachtung deinen Verdacht begründet. Die angezeigten Übungsadressen lassen sich hier nicht öffnen.");
  const messages = [
    { subject: "Zahlung vor dem Turnier", note: "Die Zahlung muss vor dem Anpfiff raus. Die übliche Freigabe kann diesmal warten.", linkText: "Details zur Zahlung", sender: "vorstand@verein-post.example", target: "verein-post.example · fremde Domain", call: "Der Vorstand hat keine Zahlung angefordert.", confirmed: false },
    { subject: "Aktualisierte Hallenrechnung", note: "Zur Hallenbuchung liegt eine aktualisierte Rechnung vor. Die Zahlungsangaben unterscheiden sich von der bisherigen Fassung.", linkText: "Aktualisierte Rechnung", sender: "rechnung@hallen-service.example", target: "hallen-service.example · nicht im Vereinsverzeichnis", call: "Der Vorstand bestätigt die bisher bekannte Rechnung. Eine Änderung wurde nicht vereinbart.", confirmed: false },
    { subject: "Halle B!! Schlüssel???", note: "Schlüssel heut abholn. Diesmal Halle B, nich Halle A!", linkText: "Hallenübersicht", sender: "halle@sv-uferpark.example", target: "sv-uferpark.example · bekannte Domain", call: "Die Hallenwartin bestätigt über die gespeicherte Nummer, dass der Schlüssel heute an Halle B abgeholt werden soll.", confirmed: true },
  ];
  const inbox = labSelect("postfach-nachricht", "Nachricht", messages.map(({ subject }, index) => [index, subject]));
  const body = labReadout();
  const details = labReadout();
  const status = labStatus();
  let inspected = new Map();
  let verified = false;
  const current = () => messages[Number(inbox.input.value)];
  const show = (label, value) => {
    inspected.set(label, value);
    details.show([...inspected]);
    securityStatus(status, `${label}: ${value}`);
  };
  const mark = (confirmed) => {
    if (!verified) {
      securityStatus(status, "Frage zuerst über den gespeicherten Kontaktweg nach. Name, Stil und Domain können einen Verdacht begründen, bestätigen die Bitte allein aber nicht.", "retry");
      return;
    }
    const correct = confirmed === current().confirmed;
    securityStatus(status, correct ? `Das passt zur unabhängigen Rückfrage. ${current().call}` : `Vergleiche deine Entscheidung mit der unabhängigen Rückfrage. ${current().call}`, correct ? "success" : "retry");
    reveal();
  };
  const reset = () => {
    inspected = new Map();
    verified = false;
    details.show([]);
    securityStatus(status, "");
    body.show([["Angezeigter Name", current().confirmed ? "Hallenwartin · SV Uferpark" : "Vorstand · SV Uferpark"],
      ["Nachricht", current().note], ["Linktext", current().linkText]]);
  };
  inbox.input.addEventListener("change", reset);
  panel.append(inbox.row, body.readout,
    element("div", { className: "actions" },
      learningButton("Absenderadresse anzeigen", () => show("Absenderadresse", current().sender), true),
      learningButton("Linkziel anzeigen", () => show("Linkziel", current().target), true),
      learningButton("Über gespeicherte Nummer nachfragen", () => {
        verified = true;
        show("Unabhängige Rückfrage", current().call);
      }, true)),
    details.readout, element("div", { className: "actions" },
      learningButton("Als Täuschung einordnen", () => mark(false)),
      learningButton("Bitte als bestätigt einordnen", () => mark(true), true)), status);
  reset();
  return panel;
}

function renderClubPermissions(reveal) {
  const panel = labPanel("Berechtigungsbrett", "Alle Rollen müssen die eigene Adresse lesen und ändern können. Die Trainerin braucht zusätzlich die Kontakte ihrer Mannschaft. Der Kassenwart braucht die Beitragsdaten und den genehmigten Export für den Jahresversand.");
  const permissions = ["Eigene Adresse lesen", "Eigene Adresse ändern", "Eigene Mannschaft kontaktieren", "Beitragsdaten lesen", "Gesamte Mitgliederliste exportieren"];
  const roles = [
    ["Mitglied", [0, 1], [0]],
    ["Trainerin", [0, 1, 2], [0, 1]],
    ["Kassenwart", [0, 1, 3, 4], [0, 1, 2, 3]],
  ].map(([name, required, initial]) => ({
    name, required, controls: permissions.map((permission, index) => securityCheckbox(permission, initial.includes(index))),
  }));
  const result = labReadout();
  const status = labStatus();
  const run = () => {
    let issues = 0;
    result.show(roles.map(({ name, required, controls }) => {
      const observations = controls.map(({ input }, index) => {
        const expected = required.includes(index);
        if (input.checked !== expected) issues++;
        const verdict = input.checked ? (expected ? "erlaubt" : "übermäßiges Recht") : (expected ? "Aufgabe blockiert" : "richtigerweise gesperrt");
        return `${permissions[index]}: ${verdict}.`;
      });
      return [name, observations.join(" ")];
    }));
    securityStatus(status, issues ? `${issues} Abweichungen. Vergleiche pro Rolle die blockierten Aufgaben und die übermäßigen Rechte.`
      : "Alle benötigten Aktionen gelingen. Weitere Rechte und Exporte bleiben gesperrt.", issues ? "retry" : "success");
    reveal();
  };
  for (const { controls } of roles) {
    for (const { input } of controls) input.addEventListener("change", () => {
      securityStatus(status, "Rechte geändert. Teste den Vereinsalltag erneut.");
      result.show([]);
    });
  }
  panel.append(...roles.map(({ name, controls }) => securityChoices(name, controls)),
    element("div", { className: "actions" }, learningButton("Vereinsalltag testen", run)), status, result.readout);
  return panel;
}

function renderLoginRoute(reveal) {
  const panel = labPanel("Der Weg der Demo-Anmeldung", "Bekannte Vereinsadresse: portal.sv-uferpark.example. Wähle eine Verbindung und markiere, wo die gesendeten Inhalte im Klartext lesbar sind.");
  const routes = [
    { label: "HTTP zur Vereinsdomain", domain: "portal.sv-uferpark.example", encrypted: false, isClub: true },
    { label: "HTTPS zur Vereinsdomain", domain: "portal.sv-uferpark.example", encrypted: true, isClub: true },
    { label: "HTTPS zu einer ähnlich aussehenden Domain", domain: "portal.sv-uferpark-info.example", encrypted: true, isClub: false },
  ];
  const route = labSelect("anmeldeweg", "Verbindung", routes.map(({ label }, index) => [index, label]));
  const readers = ["Lenis Browser", "Mitlesende im fremden WLAN", "Empfangender Server"].map((place) => securityCheckbox(place));
  const status = labStatus();
  const output = labReadout();
  const run = () => {
    const { domain, encrypted, isClub } = routes[Number(route.input.value)];
    const correct = readers.every(({ input }, index) => input.checked === (index !== 1 || !encrypted));
    output.show([
      ["Lenis Browser", "Kann die eingegebenen Demo-Daten lesen und sendet sie an das gewählte Ziel."],
      ["Fremdes WLAN", encrypted ? "Die Anmeldedaten sind unterwegs verschlüsselt. Verbindungsmetadaten können sichtbar sein." : "Die gesendeten Demo-Daten können auf dem Übertragungsweg mitgelesen werden."],
      ["Empfangender Server", `${domain} erhält die Inhalte lesbar. ${isClub ? "Das ist der Vereinsserver." : "Das ist ein anderer Server."}`],
      ["Zertifikat", encrypted ? `Gültig für ${domain}. ${isClub ? "Der Hostname entspricht der gespeicherten Vereinsadresse." : "Der Hostname weicht von der Vereinsadresse ab."}` : "Bei HTTP gibt es hier keinen TLS-Zertifikatsnachweis."],
    ]);
    securityStatus(status, correct ? "Deine Vorhersage stimmt. Vergleiche danach eine andere Verbindung." : "Prüfe in der Ausgabe die beiden Endpunkte und den Weg dazwischen. Ändere deine Vermutung und vergleiche erneut.", correct ? "success" : "retry");
    reveal();
  };
  const clear = () => {
    output.show([]);
    securityStatus(status, "");
  };
  route.input.addEventListener("change", clear);
  for (const { input } of readers) input.addEventListener("change", clear);
  panel.append(route.row, securityChoices("Hier sind die Inhalte lesbar", readers),
    element("div", { className: "actions" }, learningButton("Anmeldung verfolgen", run)), status, output.readout);
  return panel;
}

function renderFileHash(reveal) {
  const panel = labPanel("Datei mit der Freigabe vergleichen", "Ändere den Spielplan im Textfeld. Der Sollwert stammt in dieser Übung aus dem getrennten Freigabevermerk der Turnierleitung.");
  const original = "Spielplan\nFinale: Samstag, 16:00 Uhr\n";
  const expected = "9f245459a40433825a3945b31a887fff0244a61445983cd23b536a61cfee2607";
  const file = element("textarea", { className: "lab-text-input", id: "hash-datei", value: original, rows: 3, maxLength: 1000, spellcheck: false });
  const status = labStatus();
  const hashes = labReadout();
  let revision = 0;
  const clear = () => {
    revision++;
    hashes.show([["SHA-256 aus dem Freigabevermerk", expected]]);
    securityStatus(status, "");
  };
  const calculate = async () => {
    if (!globalThis.crypto?.subtle) {
      securityStatus(status, "Dieser Browser stellt hier keine Prüffunktion bereit. Öffne BitQuest über HTTPS oder localhost und versuche es erneut.", "retry");
      return;
    }
    const current = ++revision;
    securityStatus(status, "SHA-256 wird berechnet.");
    try {
      const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(file.value));
      if (current !== revision) return;
      const actual = Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
      hashes.show([["SHA-256 aus dem Freigabevermerk", expected], ["SHA-256 deiner aktuellen Datei", actual]]);
      securityStatus(status, actual === expected ? "Stimmt überein. Die Datei entspricht der freigegebenen Fassung."
        : "Der Hash weicht ab. Vergleiche den Dateiinhalt mit der freigegebenen Fassung und probiere es erneut.", actual === expected ? "success" : "retry");
      reveal();
    } catch {
      if (current === revision) securityStatus(status, "Die Datei konnte nicht geprüft werden. Versuche es erneut.", "retry");
    }
  };
  file.addEventListener("input", clear);
  panel.append(element("div", { className: "lab-control" }, element("label", { htmlFor: file.id, textContent: "spielplan.txt · Übungsdatei" }), file),
    element("div", { className: "actions" }, learningButton("SHA-256 berechnen und vergleichen", calculate),
      learningButton("Freigegebenen Text zurückholen", () => { file.value = original; clear(); file.focus(); }, true)), status, hashes.readout);
  clear();
  return panel;
}

function renderMaintenanceWindow(reveal) {
  const panel = labPanel("Ein Update pro Wartungsfenster", "In beiden Durchläufen stehen dir 20 Minuten zur Verfügung. Jede Installation mit Neustart und Prüfung füllt das Fenster.");
  const scenario = labSelect("wartung-lage", "Durchlauf", [["local", "1 · Router-Verwaltung nur intern"], ["public", "2 · Router-Verwaltung jetzt öffentlich erreichbar"]]);
  const devices = new Map([
    ["laptop", { label: "Vereinslaptop", risk: "Lokales Update gegen eine Schwachstelle bei der Dateivorschau. Kein direkter Zugriff aus dem Internet. Die Kasse ist beim Neustart kurz außer Betrieb.", test: "Die freigegebene Kassenliste lässt sich auf dem Laptop öffnen. Die installierte Version ist aktuell." }],
    ["router", { label: "Router", risk: "Update für die Verwaltungsschnittstelle. Der Hersteller meldet laufenden Missbrauch öffentlich erreichbarer Geräte. Beim Neustart fällt das Vereins-WLAN kurz aus.", test: "Ein Gerät im Vereins-WLAN kann wieder ins Internet. Der Router meldet die korrigierte Version." }],
    ["website", { label: "Vereinswebsite", risk: "Patch für eine direkt aus dem Internet erreichbare Schwachstelle. Die Website ist während der Wartung kurz offline.", test: "Der Spielplan ist von außen erreichbar. Das System meldet die korrigierte Version." }],
  ]);
  const device = labSelect("wartung-geraet", "Gerät für das Wartungsfenster", [["", "Gerät wählen"], ...Array.from(devices, ([key, { label }]) => [key, label])]);
  const inventory = labReadout();
  const status = labStatus();
  const output = labReadout();
  let installed = "";
  const install = learningButton("Update einspielen", () => {
    if (!device.input.value) {
      securityStatus(status, "Wähle anhand der Erreichbarkeit zuerst ein Gerät.", "retry");
      device.input.focus();
      return;
    }
    installed = device.input.value;
    install.disabled = device.input.disabled = true;
    test.disabled = false;
    securityStatus(status, `${devices.get(installed).label}: Update installiert, Neustart beendet. Das Wartungsfenster ist verbraucht. Prüfe jetzt die wichtigste Funktion.`);
    output.show([["Update", "Korrigierte Version installiert"], ["Betrieb", "Funktionstest steht aus"]]);
    test.focus();
    reveal();
  });
  const test = learningButton("Wichtigste Funktion testen", () => {
    const priority = scenario.input.value === "public" ? "router" : "website";
    const correct = installed === priority;
    output.show([
      ["Funktionstest", devices.get(installed).test],
      ["Offene Updates", Array.from(devices, ([key, { label }]) => key !== installed ? label : "").filter(Boolean).join(" und ")],
      ["Begründung", priority === "router" ? "Die Router-Verwaltung ist jetzt direkt erreichbar. Die zugehörige Lücke wird laut Hersteller bereits missbraucht. Die Website bleibt die nächste Priorität."
        : "Die Website ist direkt erreichbar. Die betroffene Router-Verwaltung ist im ersten Durchlauf nur intern erreichbar. Plane Router und Laptop anschließend ein."],
    ]);
    securityStatus(status, correct ? "Funktionstest bestanden. Deine Priorität passt zur aktuellen Erreichbarkeit."
      : "Funktionstest bestanden. Im Vergleich bleibt ein dringlicheres Update offen. Prüfe die Begründung und starte einen neuen Versuch.", correct ? "success" : "retry");
  }, true);
  const reset = () => {
    installed = device.input.value = "";
    test.disabled = true;
    device.input.disabled = install.disabled = false;
    output.show([]);
    securityStatus(status, "Wartungsfenster frei. Vergleiche die aktuellen Gerätehinweise.");
    const exposure = scenario.input.value === "public" ? " Verwaltung ist nun aus dem Internet erreichbar." : " Verwaltung nur aus dem Vereinsnetz erreichbar.";
    inventory.show(Array.from(devices, ([key, { label, risk }]) => [label, risk + (key === "router" ? exposure : "")]));
  };
  const restart = learningButton("Wartungsfenster neu starten", () => { reset(); device.input.focus(); }, true);
  scenario.input.addEventListener("change", reset);
  panel.append(scenario.row, inventory.readout, device.row, element("div", { className: "actions" }, install, test, restart), status, output.readout);
  reset();
  return panel;
}

function renderBackupTimeline(reveal) {
  const panel = labPanel("Mitgliederliste auf der Zeitleiste", "Spule vor. Stelle nach der Löschung einen Sicherungsstand in einem getrennten Prüfbereich wieder her. Vergleiche bei Bedarf beide Versionen.");
  const thursdayNoon = ["Ari", "Jo"];
  const thursdayEvening = [...thursdayNoon, "Kim"];
  const lastWorking = [...thursdayEvening, "Mika"];
  const backups = new Map([["mittag", thursdayNoon], ["abend", thursdayEvening]]);
  const stages = [
    ["Donnerstag, 18:00 Uhr · Zweite Sicherung erstellt", thursdayEvening, thursdayEvening],
    ["Freitag, 09:00 Uhr · Mika hinzugefügt und synchronisiert", lastWorking, lastWorking],
    ["Freitag, 12:00 Uhr · Lokale Datei gelöscht", null, lastWorking],
    ["Freitag, 12:05 Uhr · Löschung in den Ordner übernommen", null, null],
  ];
  const version = labSelect("backup-version", "Getrennten Sicherungsstand wählen", [["abend", "Donnerstag, 18:00 Uhr"], ["mittag", "Donnerstag, 12:00 Uhr"]]);
  const timeline = element("ol", { className: "security-events" });
  const storage = labReadout();
  const status = labStatus();
  const inspection = labReadout();
  let phase = 0;
  let restored;
  const summary = (names) => names ? `${names.length} Einträge: ${names.join(", ")}` : "Datei fehlt";
  const update = () => {
    const [, local, synced] = stages[phase];
    storage.show([["Vereinslaptop", summary(local)], ["Synchronisierter Ordner", summary(synced)],
      ["Getrennte Sicherung", "Beide Stände vom Donnerstag bleiben erhalten."]]);
    timeline.replaceChildren(...stages.slice(0, phase + 1).map(([event]) => element("li", { textContent: event })));
  };
  const next = learningButton("Uhr vorspulen", () => {
    if (phase === stages.length - 1) {
      securityStatus(status, "Die Löschung ist jetzt synchronisiert. Nutze eine getrennte Sicherung oder starte die Zeitleiste neu.");
      return;
    }
    phase++;
    update();
    securityStatus(status, stages[phase][0]);
    if (phase >= 2) reveal();
  });
  const restore = learningButton("In Prüfbereich wiederherstellen", () => {
    if (phase < 2) {
      securityStatus(status, "Die Arbeitsdatei ist noch vorhanden. Spule bis zur Löschung vor.", "retry");
      return;
    }
    restored = backups.get(version.input.value).join("\n");
    inspection.show([]);
    securityStatus(status, "Fassung in den getrennten Prüfbereich kopiert. Öffne sie und prüfe die Einträge.");
  });
  const inspect = learningButton("Lesbarkeit und Einträge prüfen", () => {
    if (!restored) {
      securityStatus(status, "Stelle zuerst einen Sicherungsstand wieder her.", "retry");
      return;
    }
    const names = restored.split("\n");
    const missing = lastWorking.filter((name) => !names.includes(name));
    inspection.show([["Datei geöffnet", "Lesbar"], ["Wiederhergestellte Einträge", names.join(", ")], ["Nach dem gewählten Stand hinzugefügt", missing.join(", ")]]);
    securityStatus(status, "Die Datei ist lesbar. Gleiche die fehlenden Einträge anhand bestätigter Anmeldungen ab.", "success");
  }, true);
  const reset = learningButton("Zurück zu Donnerstag", () => {
    phase = 0;
    version.input.value = "abend";
    restored = undefined;
    inspection.show([]);
    update();
    securityStatus(status, stages[phase][0]);
    next.focus();
  }, true);
  version.input.addEventListener("change", () => {
    restored = undefined;
    inspection.show([]);
    securityStatus(status, "Sicherungsstand gewählt. Stelle diese Version im Prüfbereich wieder her.");
  });
  panel.append(timeline, element("div", { className: "actions" }, next, reset), storage.readout, version.row,
    element("div", { className: "actions" }, restore, inspect), status, inspection.readout);
  update();
  return panel;
}

function renderIncidentTimeline(reveal) {
  const panel = labPanel("Meldungen und Protokoll ordnen", "Füge die vier Einträge in zeitlicher Reihenfolge hinzu. Du kannst Einträge zurücknehmen und die Reihenfolge jederzeit prüfen.");
  const events = [
    ["discovery", "19:11 · Verwaltung: Sitzung B wird als aktiv angezeigt. Das Gerät ist dem Team unbekannt."],
    ["notice", "18:50 · Leni meldet eine unerwartete Bestätigungsanfrage. Sie hat sie laut eigener Aussage nicht bestätigt."],
    ["creation", "19:03 · Portalprotokoll: Sitzung B wurde für das Trainerkonto eröffnet."],
    ["request", "18:48 · Portalprotokoll: Bestätigungsanfrage für das Trainerkonto ausgelöst."],
  ];
  const correctOrder = ["request", "notice", "creation", "discovery"];
  const descriptions = new Map(events);
  const chooser = labSelect("vorfall-eintrag", "Eintrag hinzufügen", [["", "Eintrag wählen"], ...events]);
  const status = labStatus();
  const timeline = element("ol", { className: "security-events" });
  const order = [];
  const update = () => timeline.replaceChildren(...order.map((entry) => element("li", { textContent: descriptions.get(entry) })));
  const add = learningButton("Eintrag übernehmen", () => {
    const choice = chooser.input.value;
    if (!choice || order.includes(choice)) {
      securityStatus(status, choice ? "Dieser Eintrag steht bereits in deiner Zeitleiste." : "Wähle einen Eintrag aus dem Protokoll aus.", "retry");
      return;
    }
    order.push(choice);
    chooser.input.value = "";
    update();
    securityStatus(status, `${order.length} von 4 Einträgen hinzugefügt.`);
    chooser.input.focus();
  });
  const undo = learningButton("Letzten Eintrag zurücknehmen", () => {
    order.pop();
    update();
    securityStatus(status, `${order.length} von 4 Einträgen in der Zeitleiste.`);
  }, true);
  const check = learningButton("Zeitleiste prüfen", () => {
    if (order.length !== correctOrder.length) {
      securityStatus(status, "Ordne zuerst alle vier Meldungen und Protokolleinträge ein.", "retry");
      return;
    }
    const correct = order.every((event, index) => event === correctOrder[index]);
    securityStatus(status, correct ? "Die Zeiten stimmen. Belegt sind die Anfrage, der spätere Sitzungsstart und die aktive Sitzung. Wer sich angemeldet hat und welche Daten abgerufen wurden, bleibt offen."
      : "Vergleiche die Zeitstempel. Die ausgelöste Anfrage liegt vor Lenis Meldung. Der protokollierte Start liegt vor der Beobachtung in der Sitzungsliste.", correct ? "success" : "retry");
    if (correct) reveal();
  }, true);
  panel.append(chooser.row, element("div", { className: "actions" }, add, undo, check), timeline, status);
  return panel;
}

function renderIncidentResponse(reveal) {
  const panel = labPanel("Trainerkonto wieder unter Kontrolle bringen", "Wähle Maßnahmen in beliebiger Reihenfolge. Prüfe nach einem Passwortwechsel, ob Sitzung B immer noch aktiv ist. Behandle echte Sitzungsdaten grundsätzlich vertraulich.");
  const status = labStatus();
  const state = labReadout();
  let evidence = false;
  let password = false;
  let revoked = false;
  let factors = false;
  const update = () => state.show([
    ["Vorfallmeldung und Protokoll", evidence ? "An das zuständige Vereinsteam gemeldet und gesichert." : "Meldung und Belegsicherung stehen aus."],
    ["Passwort", password ? "Ersetzt. Das alte Kennwort kann keine neue Anmeldung bestätigen." : "Noch nicht ersetzt. Kenntnis durch Dritte ist nicht geklärt."],
    ["Unbekannte Sitzung B", revoked ? "Widerrufen. Das Portal weist diese Sitzung ab." : "Weiter aktiv. Sie bleibt auch nach einem reinen Passwortwechsel gültig."],
    ["Faktoren und Wiederherstellung", factors ? "Geprüft. Leni hat ihren vorgesehenen zweiten Faktor und einen unabhängigen Ersatzweg bestätigt." : "Noch ungeprüft."],
  ]);
  const act = (action, note) => () => {
    action();
    update();
    securityStatus(status, note);
    reveal();
  };
  const actions = [
    learningButton("Melden und Belege sichern", act(() => { evidence = true; }, "Das Vereinsteam hat die Meldung und die relevanten Zeitstempel erhalten."), true),
    learningButton("Passwort ersetzen", act(() => { password = true; }, "Das Kennwort wurde ersetzt. Prüfe den separaten Status der Sitzung B.")),
    learningButton("Sitzung B widerrufen", act(() => { revoked = true; }, "Sitzung B ist beendet. Prüfe auch die Anmeldemittel und den berechtigten Zugang.")),
    learningButton("Anmeldemittel und Ersatzweg prüfen", act(() => { factors = true; }, "Lenis Anmeldemittel und der vorgesehene Ersatzweg wurden bestätigt."), true),
  ];
  const test = learningButton("Weiterbetrieb prüfen", () => {
    const ready = evidence && password && revoked && factors;
    const missing = [!revoked && "Sitzung B ist noch aktiv", !password && "Kennwort wurde noch nicht ersetzt",
      !factors && "Anmeldemittel und Ersatzweg sind noch ungeprüft", !evidence && "Meldung und Belegsicherung stehen noch aus"].filter(Boolean);
    securityStatus(status, ready ? "Die alte Sitzung wird abgewiesen. Leni kann sich neu anmelden und den Spielplan bearbeiten. Der Verein kann kontrolliert weiterarbeiten. Ob zuvor Daten abgerufen wurden, untersucht das Team anhand der Belege."
      : `Die Freigabe wäre verfrüht. ${missing.join(". ")}. Prüfe den Status und versuche es erneut.`, ready ? "success" : "retry");
    reveal();
  });
  const reset = learningButton("Vorfall neu starten", () => {
    evidence = password = revoked = factors = false;
    update();
    securityStatus(status, "Ausgangslage wiederhergestellt. Sitzung B ist aktiv.");
    actions[0].focus();
  }, true);
  panel.append(state.readout, element("div", { className: "actions" }, ...actions, test, reset), status);
  update();
  return panel;
}

const sicherheitsLabore = new Map([
  ["schutzbudget", renderProtectionBudget],
  ["vereinskonto", renderClubAccount],
  ["vereins-postfach", renderClubInbox],
  ["vereinsrechte", renderClubPermissions],
  ["anmeldeweg", renderLoginRoute],
  ["datei-hash", renderFileHash],
  ["wartungsfenster", renderMaintenanceWindow],
  ["sicherungszeit", renderBackupTimeline],
  ["vorfall-zeitlinie", renderIncidentTimeline],
  ["vorfall-reaktion", renderIncidentResponse],
]);
