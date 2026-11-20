"use strict";

function learningButton(text, action, secondary = false) {
  const button = element("button", { type: "button", className: secondary ? "button secondary" : "button", textContent: text });
  button.addEventListener("click", action);
  return button;
}

function createLearningDecision(question, name) {
  const message = element("p", { className: "field-feedback", id: `${name}-hinweis` });
  message.setAttribute("role", "status");
  const field = element("fieldset", { className: "learning-decision" }, element("legend", { textContent: question.prompt }));
  field.setAttribute("aria-describedby", message.id);
  const choices = question.options.map((option, index) => {
    const input = element("input", { type: "radio", name, value: String(index) });
    field.append(element("label", { className: "option" }, input, element("span", { textContent: option })));
    return input;
  });
  field.append(message);
  const evaluate = () => {
    const selected = choices.findIndex((choice) => choice.checked);
    const correct = selected === question.answer;
    message.dataset.result = correct ? "success" : "retry";
    message.textContent = selected < 0 ? "Wähle zuerst eine Antwort."
      : correct ? question.explanation : `Du hast „${question.options[selected]}“ gewählt. ${question.hints?.[selected] ?? question.clue}`;
    return correct;
  };
  field.addEventListener("change", () => { message.textContent = ""; });
  return { field, evaluate };
}

function renderLearningDecision(question, name, checkAfterExperiment) {
  const { field, evaluate } = createLearningDecision(question, name);
  return element("div", { className: "lesson-task" }, field,
    element("div", { className: "actions" }, learningButton(checkAfterExperiment ? "Nach dem Ausprobieren prüfen" : "Vermutung prüfen", evaluate)));
}

function renderPredictionNote() {
  const input = element("input", { id: "lesson-prediction", type: "text", className: "lab-text-input", maxLength: 240 });
  return element("div", { className: "lesson-task" }, element("label", { htmlFor: input.id, textContent: "Halte deine erste Idee kurz fest" }), input);
}

function renderLessonReflection([prompt, answer]) {
  const input = element("textarea", { id: "lesson-attempt", className: "lab-text-input", rows: 2 });
  const resolution = element("div", { className: "reflection-answer", hidden: true },
    element("p", { textContent: answer }),
  );
  const toggle = learningButton("Mit der Musterlösung vergleichen", () => {
    resolution.hidden = !resolution.hidden;
    toggle.setAttribute("aria-expanded", String(!resolution.hidden));
    toggle.textContent = resolution.hidden ? "Mit der Musterlösung vergleichen" : "Musterlösung einklappen";
  }, true);
  resolution.id = "lesson-answer";
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", resolution.id);
  return element("section", { className: "lesson-task" },
    element("h3", { textContent: "Jetzt du" }),
    element("label", { htmlFor: input.id, textContent: prompt }),
    input, element("div", { className: "actions" }, toggle), resolution);
}

function renderReservationExperiment() {
  const panel = labPanel("Paketfach trotz verlorener Antwort reservieren",
    "Zwei passende Fächer sind frei. Ein Schlüssel ist hier das Kennzeichen eines Auftrags. Sende K1 und verfolge die Nachricht. Entscheide nach der Zeitüberschreitung, wie du erneut sendest.");
  const phone = element("p");
  const machine = element("p");
  const boxes = element("div", { className: "reservation-boxes" });
  const linkLine = element("div", { className: "message-track" });
  linkLine.setAttribute("aria-hidden", "true");
  const event = labStatus();
  const feedback = labStatus();
  feedback.hidden = true;
  const key = labSelect("retry-key", "Schlüssel beim erneuten Senden", [["same", "Derselbe Schlüssel K1"], ["new", "Neuer Schlüssel K2"]]);
  const guess = labSelect("retry-guess", "Wie viele Fächer sind danach belegt?", [["", "Vermutung wählen"], ["0", "0"], ["1", "1"], ["2", "2"]]);
  const retry = element("div", { className: "lab-controls", hidden: true }, key.row, guess.row);
  let phase = 0;
  let reservation = { occupied: 0, number: "" };
  let attempt;
  const states = [
    ["Bereit zum Senden", "Wartet", "Zwei passende Fächer sind frei.", ""],
    ["Anfrage K1 unterwegs", "Wartet auf die Anfrage", "Das Handy sendet die Anfrage. Noch ist kein Fach belegt.", "send"],
    ["Wartet auf die Antwort", "A42 gespeichert", "Der Automat hat K1 verarbeitet und Fach 1 belegt.", ""],
    ["Zeitüberschreitung", "A42 bleibt gespeichert", "Die Antwort geht verloren. Der fehlende Beleg auf dem Handy macht die Reservierung nicht rückgängig.", "lost"],
    ["Erneute Anfrage unterwegs", "A42 bleibt gespeichert", "Der Automat erhält gleich den gewählten Schlüssel.", "send"],
    ["", "", "", "return"],
  ];
  const update = () => {
    const [phoneState, machineState, message, movement] = states[phase];
    phone.textContent = phase === 5 ? `Reservierung ${reservation.number} empfangen` : phoneState;
    machine.textContent = phase === 5 ? `Antwort ${reservation.number}` : machineState;
    boxes.replaceChildren(...[1, 2].map((number) =>
      element("span", { className: number <= reservation.occupied ? "occupied" : "", textContent: `Fach ${number} · ${number <= reservation.occupied ? "belegt" : "frei"}` }),
    ));
    linkLine.replaceChildren(movement ? element("span", { className: `message-dot ${movement}` }) : "");
    event.textContent = phase === 5 ? `${message} ${reservation.occupied} von 2 Fächern sind belegt.`.trim() : message;
    advance.textContent = ["Anfrage senden", "Am Automaten ankommen", "Antwort unterwegs verlieren", "Erneut senden", "Wiederholung verarbeiten", "Ablauf abgeschlossen"][phase];
    if (phase === 5 && !advance.disabled) reset.focus();
    advance.disabled = phase === 5;
    retry.hidden = phase < 3;
    key.input.disabled = guess.input.disabled = phase > 3;
  };
  const advance = learningButton("Anfrage senden", () => {
    if (phase === 3 && guess.input.value === "") {
      event.textContent = "Wähle zuerst deine Vermutung zur Belegung.";
      guess.input.focus();
      return;
    }
    if (phase === 3) attempt = { same: key.input.value === "same", guess: Number(guess.input.value) };
    phase++;
    if (phase === 2) reservation = { occupied: 1, number: "A42" };
    if (phase === 5) {
      if (!attempt.same) reservation = { occupied: 2, number: "A43" };
      const correct = attempt.guess === reservation.occupied;
      feedback.hidden = false;
      feedback.dataset.result = correct ? "success" : "retry";
      const cause = attempt.same
        ? "Beim letzten Schritt findet der Automat K1 wieder und antwortet mit A42. Die Belegung bleibt bei 1. Eine Wiederholung mit demselben Schlüssel hat hier dieselbe Wirkung wie ein einzelner Aufruf. Das heißt idempotent."
        : "Beim letzten Schritt kennt der Automat K2 noch nicht. Er behandelt ihn als neuen Auftrag, belegt Fach 2 und sendet A43.";
      feedback.textContent = `Du hast ${attempt.guess} gewählt. ${cause} ${correct ? "Deine Vermutung trifft zu." : "Achte beim nächsten Versuch darauf, ob der Schlüssel schon gespeichert ist."} Starte den Ablauf neu und teste den anderen Schlüssel.`;
    }
    update();
  });
  const reset = learningButton("Vom Anfang wiederholen", () => {
    phase = 0;
    reservation = { occupied: 0, number: "" };
    guess.input.value = "";
    feedback.textContent = "";
    feedback.hidden = true;
    update();
    advance.focus();
  }, true);
  panel.append(element("div", { className: "reservation-actors" },
    element("div", {}, element("h4", { textContent: "Handy" }), phone),
    element("div", {}, element("h4", { textContent: "Automat" }), machine, boxes)),
    linkLine, event, retry, element("div", { className: "actions" }, advance, reset), feedback);
  update();
  return panel;
}

function renderDepartureExperiment({ limit, max }) {
  const panel = labPanel("Abfahrtstafel bei einem Ausfall ausprobieren",
    `Trenne die Verbindung um 08:12 Uhr. Springe auf Minute 4 und auf genau Minute ${limit}. Sage vor dem Vorspulen voraus, was auf der Tafel erscheinen wird. Probiere danach den Start ohne gespeicherten Stand.`);
  const age = labRange("departure-age", "Uhr vorspulen · Minuten seit 08:12", 0, max, 1, 0);
  const data = labSelect("departure-data", "Gespeicherter Fahrplan", [["known", "Eine Abfahrt um 08:17"], ["missing", "Speicher leer"], ["empty", "Gültige Meldung: keine Abfahrten"]]);
  const prediction = labSelect("departure-guess", "Deine Vermutung für die gewählte Minute", [
    ["", "Anzeige wählen"], ["cached", "Letzter bekannter Stand mit Uhrzeit"], ["unknown", "Störung · Abfahrten unbekannt"], ["empty", "Laut Stand keine Abfahrten"],
  ]);
  const board = element("div", { className: "departure-board" });
  const message = element("p");
  const detail = element("p");
  const clock = element("strong");
  board.setAttribute("role", "status");
  board.append(element("span", { textContent: "Abfahrten · Bahnhof Mitte" }), clock, message, detail);
  const feedback = labStatus();
  feedback.hidden = true;
  let online = true;
  let minutes = 0;
  let snapshot = "known";
  const getState = () => {
    if (online) return "live";
    if (snapshot === "missing" || minutes >= limit) return "unknown";
    return snapshot === "empty" ? "empty" : "cached";
  };
  const update = () => {
    const state = getState();
    const texts = {
      live: ["Bus 12 · 08:17 · Rathaus", "Verbindung aktiv · aktueller Fahrplan"],
      cached: ["Bus 12 · 08:17 · Rathaus", "Verbindung getrennt · letzter Stand 08:12"],
      unknown: ["Störung · Abfahrten unbekannt", snapshot === "missing" ? "Kein Fahrplan gespeichert." : `Stand von 08:12 erreicht die Grenze von ${limit} Minuten.`],
      empty: ["Laut Fahrplan keine Abfahrten", "Verbindung getrennt · letzter Stand 08:12"],
    };
    [message.textContent, detail.textContent] = texts[state];
    clock.textContent = `08:${String(12 + minutes).padStart(2, "0")} Uhr`;
    disconnect.textContent = online ? "Verbindung trennen" : "Verbindung wiederherstellen";
    age.input.disabled = prediction.input.disabled = advance.disabled = online;
  };
  const disconnect = learningButton("Verbindung trennen", () => {
    online = !online;
    minutes = 0;
    snapshot = data.input.value;
    age.input.value = "0";
    prediction.input.value = "";
    age.input.dispatchEvent(new Event("input"));
    feedback.hidden = true;
    update();
  });
  const advance = learningButton("Uhr stellen und Tafel prüfen", () => {
    if (prediction.input.value === "") {
      feedback.hidden = false;
      feedback.textContent = "Wähle zuerst eine Vermutung für die Anzeige.";
      prediction.input.focus();
      return;
    }
    minutes = age.input.valueAsNumber;
    snapshot = data.input.value;
    update();
    const state = getState();
    const reason = snapshot === "missing" ? "Der Speicher ist leer. Die Tafel hat keine Aussage darüber, ob ein Bus fährt."
      : minutes >= limit ? `Bei Minute ${minutes} gilt die Ablaufregel. Nur ein Alter unter ${limit} Minuten ist erlaubt.`
      : `Bei Minute ${minutes} ist der Stand jünger als ${limit} Minuten. Entscheidend ist jetzt, was im gespeicherten Fahrplan steht.`;
    feedback.hidden = false;
    feedback.dataset.result = prediction.input.value === state ? "success" : "retry";
    feedback.textContent = `Du hast „${prediction.input.selectedOptions[0].textContent}“ gewählt. ${reason} ${prediction.input.value === state ? "Die Anzeige passt zu deiner Vermutung." : "Ändere deine Vermutung oder die Ausgangslage und prüfe erneut."}`;
  });
  for (const [input, event] of [[data.input, "change"], [age.input, "input"], [prediction.input, "change"]]) {
    input.addEventListener(event, () => { feedback.hidden = true; });
  }
  panel.append(board, element("div", { className: "actions" }, disconnect), data.row, age.row, prediction.row,
    element("div", { className: "actions" }, advance), feedback);
  update();
  return panel;
}

const architectureTradeoffs = {
  "architekturstil-auswaehlen": {
    goals: ["Mit kleinem Team den Betrieb einfach halten", "Versand unabhängig ausliefern"],
    choices: [
      ["Gemeinsam ausliefern", 0, "Ein gemeinsames Release hält Auslieferung und Überwachung übersichtlich.", "Versandänderungen warten auf einen gemeinsamen Release-Termin."],
      ["Versand getrennt ausliefern", 1, "Ein eigener Versanddienst kann unabhängig veröffentlicht werden, wenn sein Vertrag kompatibel bleibt.", "Das Team betreibt einen weiteren Dienst und muss Netzfehler sowie Änderungen an der Schnittstelle berücksichtigen."],
    ],
  },
  "teilausfaelle-beherrschen": {
    goals: ["Die Annahme soll auch ohne Versanddienst funktionieren", "Eine Bestätigung soll sofort eine Sendungsnummer enthalten"],
    choices: [
      ["Auf den Versanddienst warten", 1, "Ein erfolgreicher synchroner Aufruf liefert die Sendungsnummer unmittelbar.", "Bei Ausfall kann der Shop so keine Bestellung mit Sendungsnummer bestätigen."],
      ["Versand später abarbeiten", 0, "Die Bestellung samt ausstehender Arbeit bleibt gespeichert. Der Shop kann die Annahme sofort bestätigen.", "Die Nummer kommt später. Der Shop muss den Zwischenstand anzeigen und Rückstände überwachen."],
    ],
  },
  "architekturvarianten-bewerten": {
    goals: ["Den Betrieb mit wenigen Diensten vereinfachen", "Die Reservierung separat skalieren"],
    choices: [
      ["A · Modularer Monolith", 0, "A erfüllt im Test beide Grenzwerte mit 680 ms im p95 und 99,7 Prozent technischen Erfolgen. Ein gemeinsamer Dienst hält den Betrieb einfacher.", "Für mehr Reservierungskapazität lässt sich der Reservierungsteil nicht unabhängig vom restlichen Dienst skalieren."],
      ["B · Getrennter Reservierungsdienst", 1, "B erfüllt mit 780 ms im p95 und 99,8 Prozent beide Testziele. Der Reservierungsdienst kann separat skaliert werden.", "Zwei Anwendungsdienste erhöhen den Betriebsaufwand. Der Abstand zum Zeitziel ist in diesem Test geringer."],
    ],
  },
  "architektur-schrittweise-migrieren": {
    goals: ["Einen schnellen Rückweg behalten", "Das Erstellen neuer Rechnungen ins neue System verlagern"],
    choices: [
      ["Nur den Download umleiten", 0, "Die Altanwendung behält alle Schreibvorgänge. Bei einer fehlerhaften Ausgabe lässt sich der Download zurückschalten.", "Die Rechnungserstellung bleibt vorerst in der Altanwendung."],
      ["Auch Schreibverantwortung übergeben", 1, "Das neue System führt dann neue Rechnungen verbindlich.", "Ein Rückweg muss neue Rechnungen abgleichen und die Schreibverantwortung eindeutig zurückgeben."],
    ],
  },
};

function renderTradeoffExperiment({ goals, choices }) {
  const panel = labPanel("Eine Wahl unter zwei Zielen prüfen",
    "Lege zuerst fest, was im aktuellen Einsatz Vorrang hat. Wähle dann einen Entwurf und prüfe seine Folgen. Ändere das Ziel für den nächsten Versuch.");
  const goal = labSelect("design-goal", "Wichtigstes Ziel", goals.map((name, index) => [index, name]));
  const design = labSelect("design-choice", "Dein Entwurf", choices.map(([name], index) => [index, name]));
  const status = labStatus();
  status.hidden = true;
  const { readout, show } = labReadout();
  readout.hidden = true;
  const action = learningButton("Entwurf am Ziel prüfen", () => {
    const [name, priority, benefit, cost] = choices[Number(design.input.value)];
    const matches = priority === Number(goal.input.value);
    show([["Was dein Entwurf erfüllt", benefit], ["Welchen Nachteil du in Kauf nimmst", cost]]);
    readout.hidden = false;
    status.hidden = false;
    status.textContent = `${name} ${matches ? "unterstützt dein vorrangiges Ziel." : `unterstützt vor allem „${goals[priority]}“. Prüfe, ob du den Nachteil für dein gewähltes Ziel akzeptieren würdest.`}`;
  });
  for (const input of [goal.input, design.input]) input.addEventListener("change", () => { readout.hidden = status.hidden = true; });
  panel.append(goal.row, design.row, element("div", { className: "actions" }, action), status, readout);
  return panel;
}

function renderQueueExperiment(reveal) {
  const arrivals = 120;
  const panel = labPanel("Den Rückstand Minute für Minute prüfen",
    "In jeder Minute kommen 120 Bilder an. Die Verarbeitung schafft in den ersten beiden Minuten je 90. Führe beide Minuten aus und beobachte, wie viele Bilder warten bleiben.");
  const capacity = labSelect("queue-capacity", "Kapazität pro Minute", [[90, "90 Bilder"], [120, "120 Bilder"], [145, "145 Bilder"]]);
  const prediction = labSelect("queue-guess", "Der Rückstand …", [["", "Vermutung wählen"], ["up", "wächst"], ["same", "bleibt gleich"], ["down", "schrumpft"]]);
  const challenge = element("section", { className: "digit-lab-step", hidden: true },
    element("h4", { textContent: "Der Rückstand soll verschwinden. Welche Kapazität stellst du ein?" }), capacity.row, prediction.row);
  const visual = element("div", { className: "experiment-surface queue-surface" },
    element("h4", { textContent: "Warteschlange" }));
  const count = element("p", { className: "queue-count" });
  const blocks = element("div", { className: "queue-blocks" });
  blocks.setAttribute("aria-hidden", "true");
  const flow = element("div", { className: "queue-flow" });
  const history = element("div");
  const log = labStatus();
  let backlog = 0;
  const rows = [];
  const update = () => {
    count.textContent = backlog ? `${backlog} Bilder warten` : "Warteschlange leer · 0 Bilder";
    const shown = Math.min(Math.ceil(backlog / 5), 24);
    blocks.replaceChildren(...Array.from({ length: shown }, () => element("span")),
      ...(backlog > 120 ? [element("strong", { textContent: `+${backlog - 120}` })] : []));
    history.replaceChildren(renderLessonExample({
      title: "Dein Verlauf je Minute",
      columns: ["Minute", "Kapazität", "Neu", "Fertig", "Noch offen"],
      rows,
    }));
    history.hidden = rows.length === 0;
    challenge.hidden = rows.length < 2;
  };
  const reset = () => {
    backlog = 0;
    rows.length = 0;
    flow.replaceChildren();
    capacity.input.value = "90";
    prediction.input.value = "";
    log.dataset.result = "";
    log.textContent = "Minute 0. Die Warteschlange ist leer.";
    update();
  };
  const next = learningButton("Eine Minute ausführen", () => {
    const canChoose = rows.length >= 2;
    if (canChoose && !prediction.input.value) {
      log.dataset.result = "retry";
      log.textContent = "Wähle zuerst, was du für den Rückstand erwartest.";
      prediction.input.focus();
      return;
    }
    const before = backlog;
    const rate = canChoose ? Number(capacity.input.value) : 90;
    const processed = Math.min(before + arrivals, rate);
    backlog = before + arrivals - processed;
    const minute = rows.length + 1;
    rows.push([minute, rate, arrivals, processed, backlog]);
    const direction = backlog > before ? "up" : backlog === before ? "same" : "down";
    const correct = direction === prediction.input.value;
    const reason = rate < arrivals ? "Es kommen mehr Bilder an, als fertig werden. Der Rückstand wächst."
      : rate === arrivals ? `Bei 120 fertigen Bildern hältst du mit den 120 neuen Aufträgen mit. ${before ? `Deine bereits wartenden ${before} Bilder werden dadurch insgesamt nicht weniger.` : "So bleibt die Schlange leer."}`
      : before ? `Die Kapazität liegt ${rate - arrivals} über dem Zufluss. In dieser Minute holst du ${before - backlog} alte Bilder auf${backlog ? "." : " und die Schlange ist leer."}`
      : "Die Warteschlange bleibt leer. Die Verarbeitung kann nur vorhandene Aufträge fertigstellen.";
    const verdict = minute === 2 ? "Der Rückstand soll verschwinden. Wähle jetzt eine Kapazität." : !canChoose ? ""
      : correct ? "Deine Vermutung passt." : "Deine Vermutung passt noch nicht. Vergleiche im Verlauf die Spalten „Neu“ und „Fertig“ und versuche es in der nächsten Minute erneut.";
    flow.replaceChildren(element("span", { className: "queue-in", textContent: `+${arrivals} eingetroffen` }),
      element("span", { className: "queue-out", textContent: `−${processed} fertig` }));
    log.dataset.result = canChoose ? (correct ? "success" : "retry") : "";
    log.textContent = `Minute ${minute}: ${before} wartende + ${arrivals} neue − ${processed} fertige = ${backlog} wartende Bilder. ${reason} ${verdict}`.trim();
    update();
    if (canChoose) reveal();
  });
  visual.append(count, element("p", { className: "lab-chart-note", textContent: "Ein Feld steht für fünf wartende Bilder." }), blocks);
  reset();
  panel.append(visual, flow, challenge, element("div", { className: "actions" }, next, learningButton("Neu starten", reset, true)), log, history);
  return panel;
}

function renderTraceExperiment({ title, setup, variants }) {
  const panel = labPanel(title, setup);
  const variant = labSelect("trace-variant", "Ausgangslage", variants.map(({ label }, index) => [index, label]));
  const prediction = labSelect("trace-guess", "Deine Vermutung zum Ergebnis", []);
  const log = element("ol", { className: "trace-list" });
  log.setAttribute("aria-label", "Beobachtete Schritte");
  const status = labStatus();
  const current = () => variants[Number(variant.input.value)];
  let phase = 0;
  let guess = "";
  const reset = () => {
    phase = 0;
    const { options } = current();
    prediction.input.replaceChildren(element("option", { value: "", textContent: "Vermutung wählen" }),
      ...options.map((text, index) => element("option", { value: String(index), textContent: text })));
    log.replaceChildren();
    status.hidden = true;
    status.textContent = "";
    variant.input.disabled = prediction.input.disabled = next.disabled = false;
    next.textContent = "Ersten Schritt ausführen";
  };
  const next = learningButton("Ersten Schritt ausführen", () => {
    const { steps, answer, options, hint } = current();
    if (phase === 0) {
      if (prediction.input.value === "") {
        status.hidden = false;
        status.dataset.result = "retry";
        status.textContent = "Wähle zuerst eine Vermutung.";
        prediction.input.focus();
        return;
      }
      guess = Number(prediction.input.value);
      variant.input.disabled = prediction.input.disabled = true;
      status.hidden = true;
    }
    const [label, detail] = steps[phase++];
    const done = phase === steps.length;
    const item = element("li", { className: done ? "trace-outcome" : "" },
      element("strong", { textContent: label }), element("p", { textContent: detail }));
    log.append(item);
    status.hidden = false;
    status.dataset.result = done ? (guess === answer ? "success" : "retry") : "";
    status.textContent = done ? `Du hast „${options[guess]}“ gewählt. ${guess === answer
      ? "Das passt zum letzten Schritt."
      : `Entscheidend ist „${label}“. ${hint}`}` : `${label}. ${detail}`;
    if (done) restart.focus();
    next.disabled = done;
    next.textContent = done ? "Ablauf abgeschlossen" : "Nächsten Schritt ausführen";
  });
  const restart = learningButton("Neuen Versuch starten", () => {
    reset();
    variant.input.focus();
  }, true);
  variant.input.addEventListener("change", reset);
  panel.append(variant.row, prediction.row, element("div", { className: "actions" }, next, restart), log, status);
  reset();
  return panel;
}

function asksPrediction(name) {
  return sicherheitsLabore.has(name) || quantenLabore.has(name) || datenbankLabore.has(name) || ["reservation", "departure", "tradeoffs", "training", "queue", "trace", "ring", "discount", "discover-mask"].includes(name) || Boolean(deepLearningPracticeLabs[name]);
}

function renderLearningExperiment(name, quest, reveal, startingMode) {
  const datenbankLabor = datenbankLabore.get(name);
  if (datenbankLabor) return datenbankLabor(reveal);
  const quantenLabor = quantenLabore.get(name);
  if (quantenLabor) return quantenLabor(reveal);
  const sicherheitsLabor = sicherheitsLabore.get(name);
  if (sicherheitsLabor) {
    const panel = sicherheitsLabor(reveal);
    panel.classList.add("security-lab");
    return panel;
  }
  if (name === "reservation") return renderReservationExperiment();
  if (name === "departure") return renderDepartureExperiment(quest.practice.preview);
  if (name === "tradeoffs") return renderTradeoffExperiment(architectureTradeoffs[quest.id]);
  if (name === "queue") return renderQueueExperiment(reveal);
  if (name === "ring") return renderRingExperiment(reveal);
  if (name === "discount") return renderDiscountExperiment(reveal);
  if (name === "discover-mask") return renderMaskDiscovery(reveal);
  if (name === "trace") return renderTraceExperiment(learningTraces[quest.id]);
  return renderDeepLearningLab(name, reveal, startingMode);
}
