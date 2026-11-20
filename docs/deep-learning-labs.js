"use strict";

const digitSamples = [
  { digit: 1, pixels: ["00100", "01100", "00100", "00100", "01110"] },
  { digit: 1, pixels: ["00100", "00100", "00100", "00100", "00100"] },
  { digit: 1, pixels: ["00010", "00110", "00010", "00010", "00111"] },
  { digit: 1, pixels: ["01100", "00100", "00100", "00100", "01110"] },
  { digit: 4, pixels: ["01010", "01010", "11111", "00010", "00010"] },
  { digit: 4, pixels: ["10010", "10010", "11111", "00010", "00010"] },
  { digit: 7, pixels: ["11111", "00010", "00100", "01000", "01000"] },
  { digit: 7, pixels: ["01111", "00010", "00100", "00100", "01000"] },
];

const labNumber = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });
const labPercent = new Intl.NumberFormat("de-DE", { style: "percent", maximumFractionDigits: 1 });

function labPanel(title, description) {
  const panel = element("section", { className: "learning-lab" },
    element("h3", { textContent: title }), element("p", { textContent: description }));
  panel.setAttribute("aria-label", title);
  return panel;
}

function labRange(id, label, min, max, step, value) {
  const input = element("input", { type: "range", id, min, max, step, value });
  const display = element("span", { className: "lab-value" });
  display.setAttribute("aria-hidden", "true");
  const update = () => {
    display.textContent = labNumber.format(input.valueAsNumber);
    input.setAttribute("aria-valuetext", display.textContent);
  };
  input.addEventListener("input", update);
  update();
  const row = element("div", { className: "lab-control" },
    element("div", { className: "lab-range-label" }, element("label", { htmlFor: id, textContent: label }), display),
    input,
  );
  return { input, row };
}

function labSelect(id, label, options, value) {
  const input = element("select", { id, className: "comparison-select" },
    ...options.map(([key, name]) => element("option", { value: key, textContent: name })),
  );
  if (value !== undefined) input.value = value;
  return { input, row: element("div", { className: "lab-control" }, element("label", { htmlFor: id, textContent: label }), input) };
}

function labReadout() {
  const readout = element("dl", { className: "lab-readout" });
  return {
    readout,
    show: (items) => readout.replaceChildren(...items.map(([label, value]) => element("div", {},
      element("dt", { textContent: label }), element("dd", { textContent: value }),
    ))),
  };
}

function labStatus() {
  const status = element("p", { className: "lab-status" });
  status.setAttribute("role", "status");
  return status;
}

function labBar(value, max) {
  const fill = element("span");
  fill.style.width = `${Math.min(1, value / max) * 100}%`;
  const bar = element("span", { className: "lab-bar" }, fill);
  bar.setAttribute("aria-hidden", "true");
  return bar;
}

function labSoftmax(scores) {
  const max = Math.max(...scores);
  const exponentials = scores.map((score) => Math.exp(score - max));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return {
    probabilities: exponentials.map((value) => value / total),
    lossFor: (index) => max - scores[index] + Math.log(total),
  };
}

function labAffine(weights, input) {
  return weights.map((row) => input.reduce((sum, value, index) => sum + value * row[index], row.at(-1)));
}

function digitGrid(preview, sample, name) {
  preview.replaceChildren(...sample.pixels.flatMap((row) => Array.from(row, (pixel) =>
    element("span", { className: pixel === "1" ? "digit-on" : "" }),
  )));
  preview.setAttribute("aria-label", `${name}. Pixelreihen: ${sample.pixels.join(", ")}.`);
}

function renderDatasetLab() {
  const panel = labPanel("Zifferndaten und Baseline ausprobieren",
    "Die acht Pixelbilder wurden für diese Übung gezeichnet. Sieh dir einzelne Beispiele an und vergleiche drei Baselines, die jedem Bild dieselbe Ziffer zuweisen.");
  const sample = labSelect("lab-sample", "Bild auswählen", digitSamples.map((_, index) => [index, `Bild ${index + 1}`]));
  const baseline = labSelect("lab-baseline", "Vorhersageregel", [1, 4, 7].map((digit) => [digit, `Immer ${digit} vorhersagen`]));
  const preview = element("div", { className: "digit-grid" });
  preview.setAttribute("role", "img");
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const selected = digitSamples[Number(sample.input.value)];
    const prediction = Number(baseline.input.value);
    const matches = digitSamples.filter(({ digit }) => digit === prediction).length;
    digitGrid(preview, selected, `Bild ${Number(sample.input.value) + 1}, gezeichnete Ziffer ${selected.digit}`);
    show([["Label des Bildes", selected.digit], ["Vorhersage", prediction], ["Treffer auf allen Bildern", `${matches} von 8`]]);
    status.textContent = selected.digit === prediction ? "Vorhersage stimmt für dieses Bild." : "Vorhersage stimmt für dieses Bild nicht.";
  };
  sample.input.addEventListener("change", update);
  baseline.input.addEventListener("change", update);
  panel.append(element("div", { className: "lab-with-grid" }, preview, element("div", {}, sample.row, baseline.row)), readout, status);
  update();
  return panel;
}

function renderMathLab() {
  const panel = labPanel("Pixel in einen Zahlenwert übersetzen",
    "Zwei Pixel bilden den Vektor x = [x₁, x₂]. Verändere ihre Helligkeit von 0 (leer) bis 1 (volle Tinte). Die festen Gewichte sind 2 und −1, der Bias ist −0,5.");
  const first = labRange("lab-x1", "Helligkeit von Pixel x₁", 0, 1, 0.25, 1);
  const second = labRange("lab-x2", "Helligkeit von Pixel x₂", 0, 1, 0.25, 0);
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const a = first.input.valueAsNumber;
    const b = second.input.valueAsNumber;
    const dot = 2 * a - b;
    show([["Eingabevektor", `[${labNumber.format(a)}; ${labNumber.format(b)}]`],
      ["Beiträge x₁ × 2 und x₂ × (−1)", `${labNumber.format(2 * a)} und ${labNumber.format(-b || 0)}`],
      ["Skalarprodukt", labNumber.format(dot)]]);
    status.textContent = `Ausgabe nach dem Bias: ${labNumber.format(dot - 0.5)}`;
  };
  first.input.addEventListener("input", update);
  second.input.addEventListener("input", update);
  panel.append(first.row, second.row, readout, status);
  update();
  return panel;
}

function renderForwardLab() {
  const panel = labPanel("Einen Forward Pass ausprobieren",
    "Das vereinfachte Netz unterscheidet 1 und 7. x₁ zählt die Tintenpixel der obersten Zeile. x₂ ist das mittlere Pixel in der zweiten Zeile (0 oder 1). Verändere ein Gewicht oder schalte ReLU um.");
  const sample = labSelect("lab-forward-sample", "Ziffernbild", [[0, "1 · mit Fuß"], [1, "1 · schmal"], [6, "7 · breiter Balken"], [7, "7 · versetzter Balken"]], 6);
  const preview = element("div", { className: "digit-grid" });
  preview.setAttribute("role", "img");
  const weight = labRange("lab-forward-weight", "Gewicht w für x₁", -1, 2, 0.25, 1);
  const activation = labSelect("lab-activation", "Aktivierung", [["relu", "ReLU · negative Werte auf 0 setzen"], ["linear", "Identität · Werte unverändert lassen"]]);
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const selected = digitSamples[Number(sample.input.value)];
    const x1 = selected.pixels[0].replaceAll("0", "").length;
    const x2 = Number(selected.pixels[1][2]);
    const first = weight.input.valueAsNumber * x1 + x2 - 2;
    const second = x2 - 0.5;
    const activate = (value) => activation.input.value === "relu" ? Math.max(0, value) : value;
    const score7 = activate(first);
    const score1 = activate(second);
    digitGrid(preview, selected, `Gezeichnete Ziffer ${selected.digit}`);
    show([["Merkmale x₁ und x₂", `${x1} und ${x2}`],
      ["Vor der Aktivierung", `w × x₁ + x₂ − 2 = ${labNumber.format(first)}. x₂ − 0,5 = ${labNumber.format(second)}.`],
      ["Klassenscores nach Aktivierung", `1: ${labNumber.format(score1)} · 7: ${labNumber.format(score7)}`]]);
    const prediction = score7 > score1 ? 7 : 1;
    const tie = score7 === score1 ? " Bei Gleichstand wählt das Beispiel die 1." : "";
    status.textContent = `Vorhersage: ${prediction}. Richtiges Label: ${selected.digit}.${tie}`;
  };
  sample.input.addEventListener("change", update);
  weight.input.addEventListener("input", update);
  activation.input.addEventListener("change", update);
  panel.append(element("div", { className: "lab-with-grid" }, preview, element("div", {}, sample.row, activation.row)), weight.row, readout, status);
  update();
  return panel;
}

function renderLossLab() {
  const panel = labPanel("Score, Verlust und Gradient vergleichen",
    "Für dieses einzelne Ziffernbeispiel ist das Merkmal x = 2. Der Score für 1 bleibt 0, der Score für 7 ist z = w × x. Ändere w und beobachte die Kreuzentropie für das gewählte richtige Label.");
  const weight = labRange("lab-loss-weight", "Gewicht w", -2, 2, 0.25, 0);
  const target = labSelect("lab-label", "Richtiges Label", [[7, "7"], [1, "1"]]);
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const score = weight.input.valueAsNumber * 2;
    const probability7 = 1 / (1 + Math.exp(-score));
    const target7 = Number(target.input.value === "7");
    const probabilityTarget = target7 ? probability7 : 1 - probability7;
    const gradient = 2 * (probability7 - target7);
    show([["Score für 7", labNumber.format(score)],
      ["Softmax für 1 und 7", `${labPercent.format(1 - probability7)} und ${labPercent.format(probability7)}`],
      ["Kreuzentropie −ln(p des richtigen Labels)", labNumber.format(-Math.log(probabilityTarget))]]);
    status.textContent = `Gradient nach w: ${labNumber.format(gradient)}. Ein kleiner Schritt des Gradientenabstiegs ${gradient < 0 ? "erhöht" : "senkt"} w.`;
  };
  weight.input.addEventListener("input", update);
  target.input.addEventListener("change", update);
  panel.append(weight.row, target.row, readout, status);
  update();
  return panel;
}

function renderTrainingLab() {
  const panel = labPanel("Die Lernrate im Gradientenabstieg testen",
    "Dein Startgewicht ist −2, das Ziel liegt bei 2. Wähle eine Lernrate und sage vor dem ersten Klick voraus, wo der nächste Wert landet. Starte danach mit einer anderen Lernrate erneut.");
  const rate = labRange("lab-learning-rate", "Lernrate", 0.05, 2.2, 0.05, 0.5);
  const guess = labSelect("training-guess", "Wo landet das Gewicht nach dem Schritt?", [
    ["", "Vermutung wählen"], ["same", "Es bleibt beim alten Wert"], ["closer", "Zwischen altem Wert und Ziel"], ["target", "Genau auf dem Ziel"], ["past", "Hinter dem Ziel auf der anderen Seite"],
  ]);
  const step = element("button", { type: "button", className: "button", textContent: "Einen Schritt ausführen" });
  const replay = element("button", { type: "button", className: "button secondary", textContent: "Acht Schritte ab Start vergleichen" });
  const reset = element("button", { type: "button", className: "button secondary", textContent: "Zurücksetzen" });
  const status = labStatus();
  const feedback = labStatus();
  feedback.hidden = true;
  const diagram = element("div", { className: "weight-track" });
  diagram.setAttribute("aria-hidden", "true");
  const { readout, show } = labReadout();
  const timeline = element("ol", { className: "lab-timeline" });
  timeline.setAttribute("aria-label", "Verlust der letzten Schritte");
  const history = [-2];
  const loss = (w) => (w - 2) ** 2 / 2;
  const nextWeight = (weight) => weight - rate.input.valueAsNumber * (weight - 2);
  const advance = () => {
    history.push(nextWeight(history.at(-1)));
  };
  const update = () => {
    const index = history.length - 1;
    const weight = history[index];
    step.disabled = index >= 16 || weight === 2;
    status.textContent = `Schritt ${index} · Gewicht ${labNumber.format(weight)} · Verlust ${labNumber.format(loss(weight))}`;
    const start = Math.max(0, index - 7);
    const losses = history.slice(start).map(loss);
    const scale = Math.max(8, ...losses);
    timeline.replaceChildren(...losses.map((value, offset) => element("li", {},
      element("span", { textContent: `Schritt ${start + offset}` }), labBar(value, scale),
      element("strong", { textContent: labNumber.format(value) }),
    )));
    const previous = history.at(-2) ?? weight;
    show([["Alter Wert", labNumber.format(previous)], ["Ziel", "2"], ["Neuer Wert", index ? labNumber.format(weight) : "Noch kein Update"]]);
    const min = Math.min(-3, previous - .5, weight - .5);
    const max = Math.max(3, previous + .5, weight + .5);
    const place = (value) => `${100 * (value - min) / (max - min)}%`;
    const marker = (className, value) => {
      const dot = element("span", { className });
      dot.style.left = place(value);
      return dot;
    };
    const moved = marker("weight-new", weight);
    moved.style.setProperty("--weight-from", place(previous));
    diagram.replaceChildren(marker("weight-target", 2), marker("weight-old", previous), ...(index ? [moved] : []));
  };
  step.addEventListener("click", () => {
    if (!guess.input.value) {
      feedback.hidden = false;
      feedback.textContent = "Wähle zuerst eine Vermutung.";
      guess.input.focus();
      return;
    }
    const before = history.at(-1);
    advance();
    const after = history.at(-1);
    const predicted = guess.input.selectedOptions[0].textContent;
    const actual = after === before ? "same" : after === 2 ? "target" : (after - 2) * (before - 2) < 0 ? "past" : "closer";
    const correct = actual === guess.input.value;
    const change = loss(after) > loss(before) ? "steigt" : loss(after) === loss(before) ? "bleibt gleich" : "sinkt";
    const distances = `Der Abstand zur 2 geht von ${labNumber.format(Math.abs(before - 2))} auf ${labNumber.format(Math.abs(after - 2))}.`;
    feedback.hidden = false;
    feedback.dataset.result = correct ? "success" : "retry";
    feedback.textContent = `Du hast „${predicted}“ gewählt. ${labNumber.format(before)} − ${labNumber.format(rate.input.valueAsNumber)} × (${labNumber.format(before - 2)}) ergibt ${labNumber.format(after)}. Der Verlust ${change} (${labNumber.format(loss(before))} → ${labNumber.format(loss(after))}). ${distances} ${correct
      ? "Deine Vermutung passt. Vergleiche auch mit einer anderen Lernrate."
      : "Markiere den alten Wert, das Ziel und den neuen Wert gedanklich auf der Zahlengeraden. Starte neu und versuch es erneut."}`;
    guess.input.value = "";
    update();
    if (step.disabled) reset.focus();
  });
  reset.addEventListener("click", () => {
    history.length = 1;
    guess.input.value = "";
    feedback.hidden = true;
    update();
  });
  replay.addEventListener("click", () => {
    feedback.hidden = true;
    guess.input.value = "";
    history.length = 1;
    for (let index = 0; index < 8; index++) advance();
    update();
  });
  panel.append(rate.row, guess.row, element("div", { className: "actions" }, step, reset), status, diagram, readout, feedback,
    element("div", { className: "actions" }, replay),
    element("p", { className: "lab-chart-note", textContent: "Verlust pro Schritt. Die Balken verwenden innerhalb eines Laufs dieselbe Skala." }), timeline);
  update();
  return panel;
}

function renderOverfitLab() {
  const panel = labPanel("Den besten Modellstand auswählen",
    "Zwei simulierte Trainingsläufe für die Ziffernerkennung. Bewege den Epochenregler und suche pro Lauf den Modellstand mit dem niedrigsten Validierungsverlust.");
  const run = labSelect("lab-run", "Trainingslauf", [["base", "Ohne zusätzliche Regularisierung"], ["regularized", "Mit stärkerer Regularisierung"]]);
  const epoch = labRange("lab-epoch", "Epoche", 1, 8, 1, 1);
  const losses = {
    base: { train: [0.86, 0.62, 0.45, 0.32, 0.24, 0.18, 0.13, 0.09], validation: [0.93, 0.73, 0.58, 0.51, 0.55, 0.63, 0.73, 0.81] },
    regularized: { train: [0.89, 0.71, 0.59, 0.49, 0.41, 0.36, 0.32, 0.29], validation: [0.95, 0.79, 0.65, 0.56, 0.5, 0.46, 0.47, 0.49] },
  };
  const bars = element("ol", { className: "lab-timeline" });
  bars.setAttribute("aria-label", "Verlust in der gewählten Epoche");
  const status = labStatus();
  const update = () => {
    const index = epoch.input.valueAsNumber - 1;
    const { train, validation } = losses[run.input.value];
    bars.replaceChildren(...[["Training", train[index]], ["Validierung", validation[index]]].map(([label, value]) =>
      element("li", {}, element("span", { textContent: label }), labBar(value, 1), element("strong", { textContent: labNumber.format(value) })),
    ));
    const bestIndex = validation.indexOf(Math.min(...validation.slice(0, index + 1)));
    status.textContent = `Bis Epoche ${index + 1} ist der niedrigste Validierungsverlust ${labNumber.format(validation[bestIndex])} (Epoche ${bestIndex + 1}).`;
  };
  run.input.addEventListener("change", update);
  epoch.input.addEventListener("input", update);
  panel.append(run.row, epoch.row, bars, status);
  update();
  return panel;
}

function renderMetricsLab() {
  const panel = labPanel("Die Fehler bei der Ziffer 7 untersuchen",
    "Positiv bedeutet hier „ist eine 7“. Wähle eine Gruppe und eine Entscheidungsschwelle. Die Konfusionsmatrix und die Kennzahlen basieren auf simulierten Testzählungen.");
  const group = labSelect("lab-group", "Testgruppe", [["all", "Alle 100 Bilder"], ["new", "Teilgruppe · 20 Bilder von neuen Schreibenden"]]);
  const threshold = labSelect("lab-threshold", "Schwelle für „7“", [["0,7", "0,7 · strengere Schwelle"], ["0,4", "0,4 · niedrigere Schwelle"]]);
  const counts = {
    all: { "0,7": [12, 3, 8, 77], "0,4": [17, 9, 3, 71] },
    new: { "0,7": [2, 1, 4, 13], "0,4": [4, 3, 2, 11] },
  };
  const matrix = element("div");
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const [tp, fp, fn, tn] = counts[group.input.value][threshold.input.value];
    matrix.replaceChildren(renderLessonExample({
      title: "Konfusionsmatrix",
      columns: ["Richtiges Label", "Als 7 vorhergesagt", "Anders vorhergesagt"],
      rows: [["7", tp, fn], ["Andere Ziffer", fp, tn]],
    }));
    const precision = tp / (tp + fp);
    const recall = tp / (tp + fn);
    show([["Accuracy", labPercent.format((tp + tn) / (tp + fp + fn + tn))],
      ["Precision für 7", labPercent.format(precision)], ["Recall für 7", labPercent.format(recall)],
      ["F1 für 7", labPercent.format(2 * precision * recall / (precision + recall))]]);
    status.textContent = `${tp} echte Siebenen erkannt, ${fn} übersehen und ${fp} andere Ziffern als 7 markiert.`;
  };
  group.input.addEventListener("change", update);
  threshold.input.addEventListener("change", update);
  panel.append(group.row, threshold.row, matrix, readout, status);
  update();
  return panel;
}

function renderDeepLearningLab(name, reveal = () => {}, startingMode) {
  const labs = {
    dataset: renderDatasetLab,
    math: renderMathLab,
    forward: renderForwardLab,
    loss: renderLossLab,
    training: renderTrainingLab,
    overfit: renderOverfitLab,
    metrics: renderMetricsLab,
    digits: renderDigitTrainingLab,
    convolution: renderConvolutionLab,
    cnn: renderCnnLab,
    tokens: renderTokenLab,
    embeddings: renderEmbeddingLab,
    attention: renderAttentionLab,
    transformer: renderTransformerLab,
    language: renderLanguageLab,
  };
  return deepLearningPracticeLabs[name] ? deepLearningPracticeLabs[name](reveal, startingMode) : labs[name]();
}
