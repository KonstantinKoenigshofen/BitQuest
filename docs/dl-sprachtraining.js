"use strict";

const tinyCorpus = [
  ...workshopSentences.filter((sentence) => !sentence.includes("prüft")),
  "das team prüft regeln", "heute team prüft regeln", "unser team prüft regeln",
  "das modell prüft pixel", "heute modell prüft pixel", "unser modell prüft pixel",
];
const tinyExamples = tinyCorpus.flatMap((sentence) => {
  const tokens = [languageStart, ...sentence.split(" "), languageEnd];
  return tokens.slice(1).map((target, index) => ({ prefix: tokens.slice(Math.max(0, index - 3), index + 1), target }));
});
const tinyVocabulary = [...new Set(tinyExamples.map(({ target }) => target))];
const tinyBigramPairs = tinyExamples.map(({ prefix, target }) => [prefix.at(-1), target]);

function createTinyTransformer() {
  const weights = labWeightInitializer(200);
  return {
    query: [.5, .25, -.4], key: [.6, -.5, .3], value: [1, 1, 1],
    expand: weights(2, 3), project: weights(3, 2), head: weights(tinyVocabulary.length, 3),
  };
}

function tinyTransformerForward(model, prefix, target, gradients) {
  const tape = [];
  const node = (value, parents = []) => {
    const entry = { value, derivative: 0, parents };
    tape.push(entry);
    return entry;
  };
  const add = (a, b) => node(a.value + b.value, [[a, 1], [b, 1]]);
  const mul = (a, b) => node(a.value * b.value, [[a, b.value], [b, a.value]]);
  const exp = (a) => { const value = Math.exp(a.value); return node(value, [[a, value]]); };
  const divide = (a, b) => node(a.value / b.value, [[a, 1 / b.value], [b, -a.value / b.value ** 2]]);
  const sum = (entries) => entries.reduce(add);
  const affine = (vector, weights) => sum([...vector.map((value, index) => mul(value, weights[index])), weights.at(-1)]);
  const dot = (a, b) => sum(a.map((value, index) => mul(value, b[index])));
  const mapWeights = (value) => Array.isArray(value) ? value.map(mapWeights) : node(value);
  const p = Object.fromEntries(Object.entries(model).map(([key, value]) => [key, mapWeights(value)]));
  const inputs = prefix.map((token, index) => {
    const id = tinyVocabulary.indexOf(token) + 1;
    const embedding = token === "team" ? [1, 0, .3] : token === "modell" ? [-1, 0, .3]
      : [0, Math.sin(id * 1.77), Math.cos(id * 2.04)];
    return embedding.map((value, column) => node(value + (column === 1 ? .08 * index : 0)));
  });
  // The final query only sees the supplied prefix. Later tokens never enter its attention.
  const last = inputs.at(-1);
  const query = dot(last, p.query);
  const scores = inputs.map((vector) => mul(dot(vector, p.key), query));
  const offset = node(-Math.max(...scores.map((score) => score.value)));
  const exponentials = scores.map((score) => exp(add(score, offset)));
  const total = sum(exponentials);
  const attention = exponentials.map((value) => divide(value, total));
  const afterAttention = last.map((value, column) => add(value, sum(inputs.map((vector, index) =>
    mul(attention[index], mul(vector[column], p.value[column]))))));
  const hidden = p.expand.map((row) => {
    const x = affine(afterAttention, row);
    return node(Math.max(0, x.value), [[x, Number(x.value > 0)]]);
  });
  const output = afterAttention.map((value, index) => add(value, affine(hidden, p.project[index])));
  const logits = p.head.map((row) => affine(output, row));
  const prediction = labSoftmax(logits.map(({ value }) => value));
  if (gradients) {
    const id = tinyVocabulary.indexOf(target);
    for (const [index, score] of logits.entries()) score.derivative = prediction.probabilities[index] - Number(index === id);
    for (const entry of tape.reverse()) {
      for (const [parent, weight] of entry.parents) parent.derivative += entry.derivative * weight;
    }
    const accumulate = (parameters, targetGradient) => {
      for (const [index, parameter] of parameters.entries()) {
        if (Array.isArray(parameter)) accumulate(parameter, targetGradient[index]);
        else targetGradient[index] += parameter.derivative;
      }
    };
    for (const key of Object.keys(p)) accumulate(p[key], gradients[key]);
  }
  return { ...prediction, attention: attention.map(({ value }) => value) };
}

function trainTinyTransformer(model) {
  const zeros = (array) => array.map((item) => Array.isArray(item) ? zeros(item) : 0);
  const gradients = Object.fromEntries(Object.entries(model).map(([name, params]) => [name, zeros(params)]));
  for (const { prefix, target } of tinyExamples) tinyTransformerForward(model, prefix, target, gradients);
  const update = (params, derivative) => {
    for (const [index, value] of params.entries()) {
      if (Array.isArray(value)) update(value, derivative[index]);
      else params[index] -= .7 * derivative[index] / tinyExamples.length;
    }
  };
  for (const key of Object.keys(model)) update(model[key], gradients[key]);
}

function renderTinyTransformerLab(reveal) {
  const panel = labPanel("Nur das frühere Wort austauschen",
    "Live-Training. Beide Modelle verwenden dieselben Präfixe und Zielwörter. Der Mini-Transformer hat einen kleinen Attention-Kopf, Restpfade und eine Feedforward-Schicht. Seine Eingabevektoren sind fest. Das Experiment zeigt Trainingsdaten und Trainingsverlust.");
  const choice = labSelect("tiny-context", "Früheres Wort in „das … prüft“", [["team", "team"], ["modell", "modell"]]);
  const guess = dlGuess("tiny-guess", "Wessen Verteilung verändert der Worttausch nach dem Training?", [["both", "Beide"], ["transformer", "Der Transformer"], ["none", "Keines"]]);
  const output = element("div", { className: "dl-trial-output" });
  const feedback = labStatus();
  const state = labStatus();
  let bigram, transformer, steps;
  const prefix = (word) => ["das", word, "prüft"];
  const loss = () => {
    const b = tinyExamples.reduce((sum, { prefix, target }) => sum + labSoftmax(bigram.get(prefix.at(-1))).lossFor(tinyVocabulary.indexOf(target)), 0);
    const t = tinyExamples.reduce((sum, { prefix, target }) => sum + tinyTransformerForward(transformer, prefix).lossFor(tinyVocabulary.indexOf(target)), 0);
    return [b / tinyExamples.length, t / tinyExamples.length];
  };
  const updateState = () => {
    const [b, t] = loss();
    state.textContent = `${steps} Updates je Modell · Bigramm-Verlust ${labNumber.format(b)} · Transformer-Verlust ${labNumber.format(t)}`;
    train.disabled = steps >= 120;
  };
  const train = learningButton("20 Updates je Modell trainieren", () => {
    for (let step = 0; step < 20; step++) {
      trainWordModel(bigram, tinyBigramPairs, tinyVocabulary);
      trainTinyTransformer(transformer);
    }
    steps += 20;
    output.replaceChildren();
    feedback.textContent = "";
    updateState();
  });
  const show = () => {
    const word = choice.input.value;
    const other = word === "team" ? "modell" : "team";
    const b = labSoftmax(bigram.get("prüft")).probabilities;
    const t = tinyTransformerForward(transformer, prefix(word));
    const alternative = tinyTransformerForward(transformer, prefix(other));
    const distance = t.probabilities.reduce((sum, value, index) => sum + Math.abs(value - alternative.probabilities[index]), 0) / 2;
    output.replaceChildren(dlTable(`Vorhersagen für „das ${word} prüft“`, ["Token", "Bigramm", "Transformer", `Transformer · ${other}`],
      tinyVocabulary.map((token, index) => [token, b[index], t.probabilities[index], alternative.probabilities[index]])
        .sort((first, second) => Math.max(...second.slice(1)) - Math.max(...first.slice(1)))
        .map(([token, ...probabilities]) => [token, ...probabilities.map((value) => labPercent.format(value))])));
    feedback.dataset.result = guess.input.value === "transformer" ? "success" : "retry";
    feedback.textContent = `${guess.input.value === "transformer" ? "Deine Vermutung passt." : "Vergleiche deine Vermutung mit den Spalten."} Das Bigramm verwendet in beiden Fällen dieselbe Zeile für „prüft“. Der Transformer verschiebt ${labPercent.format(distance)} der Wahrscheinlichkeitsmasse. Vergleiche besonders „regeln“ und „pixel“.`;
  };
  const check = learningButton("Vermutung prüfen und Verteilungen zeigen", () => {
    if (!steps || !guess.input.value) {
      feedback.dataset.result = "retry";
      feedback.textContent = "Trainiere beide Modelle und wähle eine Vermutung.";
      return;
    }
    show();
    reveal();
  });
  const reset = () => {
    bigram = createWordModel([...new Set(tinyBigramPairs.map(([word]) => word))], tinyVocabulary);
    transformer = createTinyTransformer();
    steps = 0;
    guess.input.value = "";
    choice.input.value = "team";
    output.replaceChildren();
    feedback.textContent = "";
    delete feedback.dataset.result;
    updateState();
  };
  choice.input.addEventListener("change", () => { if (output.childElementCount) show(); });
  panel.append(element("details", { className: "self-check" }, element("summary", { textContent: "Gemeinsame Trainingssätze" }),
    element("ul", {}, ...tinyCorpus.map((sentence) => element("li", { textContent: sentence })))),
    choice.row, guess.row, element("div", { className: "actions" }, train, check, learningButton("Neu starten", reset, true)), state, feedback, output);
  reset();
  return panel;
}

function renderAlignmentLab(reveal) {
  const panel = labPanel("Eine Anfrage durch drei Trainingsstufen verfolgen",
    "Live gezählt und mit vorbereiteten Antworten erklärt. Hier werden Textzeilen bereinigt und Beispiel-Scores verändert. Ein Sprachassistent wird in dieser Übung nicht trainiert.");
  const request = "Mein Ziffernbild ist zu dunkel. Was soll ich tun?";
  const rows = ["Dunkle Bilder können mehr Licht brauchen.", "Dunkle Bilder können mehr Licht brauchen.",
    "Dunkle Bilder können mehr Licht brauchen.", "Ein Testbild zeigt, ob die Ziffer lesbar ist.", "[PLATZHALTER]"];
  const dedupe = dlToggle("align-dedupe", "Identische Zeilen zusammenfassen", true);
  const clean = dlToggle("align-clean", "Platzhalter entfernen", true);
  const guess = dlGuess("align-guess", "Wie oft bleibt die Zeile zu dunklen Bildern nach deiner Auswahl?", [[1, "Einmal"], [3, "Dreimal"]]);
  const preference = dlGuess("align-pref", "Welche Antwort bevorzugst du für die Anfrage?", [
    ["a", "Mehr Licht garantiert eine korrekte Erkennung."], ["b", "Verbessere die Beleuchtung und prüfe ein neues Testbild."],
  ]);
  const output = element("div", { className: "dl-trial-output" });
  const feedback = labStatus();
  const phase = labStatus();
  let stage = 0;
  const update = () => {
    phase.textContent = ["Stufe 1 · Textbestand und Vortraining", "Stufe 2 · Überwachtes Fine-Tuning", "Stufe 3 · Präferenzlernen"][stage];
    preference.row.hidden = stage !== 2;
    dedupe.row.hidden = clean.row.hidden = guess.row.hidden = stage !== 0;
    apply.textContent = ["Bereinigung und Fortsetzung prüfen", "Anweisung und Beispielantwort ansehen", "Präferenz anwenden"][stage];
    next.disabled = true;
    output.replaceChildren();
    feedback.textContent = "";
  };
  const apply = learningButton("Bereinigung und Fortsetzung prüfen", () => {
    const key = stage === 0 ? guess.input.value : preference.input.value;
    if (stage !== 1 && !key) {
      feedback.dataset.result = "retry"; feedback.textContent = "Wähle zuerst eine Antwort."; return;
    }
    if (stage === 0) {
      const filtered = clean.input.checked ? rows.filter((row) => row !== "[PLATZHALTER]") : rows;
      const used = dedupe.input.checked ? [...new Set(filtered)] : filtered;
      const count = used.filter((row) => row === rows[0]).length;
      output.replaceChildren(dlTable("Zeilen im bereinigten Bestand", ["Zeile", "Text"], used.map((row, index) => [index + 1, row])),
        element("p", { textContent: "Vorbereitete Fortsetzung: „… Bei dunklen Bildern hilft oft mehr Licht.“" }));
      feedback.dataset.result = Number(key) === count ? "success" : "retry";
      feedback.textContent = `Die Zeile zu dunklen Bildern kommt ${count}-mal vor. In diesem Durchlauf zählen ${used.length} von ${rows.length} Rohzeilen. Vergleiche die beiden Schalter.`;
    } else if (stage === 1) {
      output.replaceChildren(dlTable("Vorbereitetes Lernpaar", ["Teil", "Text"], [
        ["Anweisung", request], ["Zielantwort", "Beleuchte das Blatt gleichmäßig. Fotografiere es erneut und prüfe, ob der Strich gut sichtbar ist."],
      ]));
      feedback.dataset.result = "success"; feedback.textContent = "Das Modell bekommt eine konkrete Beispielantwort als Ziel. Hier wird der Wechsel der Aufgabenform gezeigt.";
    } else {
      const probability = labSoftmax(key === "a" ? [.6, -.6] : [-.6, .6]).probabilities;
      output.replaceChildren(dlTable("Vereinfachtes Update für genau dieses Antwortpaar", ["Antwort", "Vorher", "Nach deiner Wahl"], [
        ["A · Erfolg garantieren", "50 %", labPercent.format(probability[0])],
        ["B · Erneut aufnehmen und prüfen", "50 %", labPercent.format(probability[1])],
      ]));
      feedback.dataset.result = key === "b" ? "success" : "retry";
      feedback.textContent = key === "b" ? "Du hast eine überprüfbare Handlung bevorzugt. Ihr Score steigt. Eine Präferenz wirkt als relatives Signal."
        : "Das Update bevorzugt jetzt die Garantie. Auch eine schlechte Wahl kann den Score erhöhen. Vergleiche mit der Antwort, die einen überprüfbaren nächsten Schritt nennt.";
      reveal();
    }
    next.disabled = stage >= 2;
  });
  const next = learningButton("Zur nächsten Stufe", () => { stage++; update(); apply.focus(); }, true);
  const reset = learningButton("Neu starten", () => {
    stage = 0; guess.input.value = ""; preference.input.value = "";
    dedupe.input.checked = clean.input.checked = true; update(); guess.input.focus();
  }, true);
  panel.append(element("p", { textContent: `Durchgehende Anfrage: „${request}“` }),
    element("details", { className: "self-check" }, element("summary", { textContent: "Unbereinigte Zeilen ansehen" }),
      element("ol", {}, ...rows.map((row) => element("li", { textContent: row })))),
    phase, dedupe.row, clean.row, guess.row, preference.row, element("div", { className: "actions" }, apply, next, reset), feedback, output);
  update();
  return panel;
}
