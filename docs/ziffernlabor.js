"use strict";

const trainingDigits = [1, 4, 7];
const digitBatchSize = 6;
const digitHiddenSize = 8;
const digitPixelCount = 25;
const digitLearningRates = [0.03, 0.4];

function digitExample(digit, pattern) {
  return { digit, pixels: pattern.split(" ") };
}

const digitTrainingSet = [
  ...digitSamples,
  digitExample(1, "00100 11100 00100 00100 01110"),
  digitExample(1, "01100 00100 00100 00100 00100"),
  digitExample(1, "00010 00110 00010 00010 00010"),
  digitExample(1, "01000 11000 01000 01000 11100"),
  digitExample(4, "00110 01010 10010 11111 00010"),
  digitExample(4, "10001 10001 11111 00001 00001"),
  digitExample(4, "01010 01010 01111 00010 00010"),
  digitExample(7, "11111 00001 00010 00100 01000"),
  digitExample(7, "11110 00010 00100 01000 10000"),
  digitExample(7, "01111 00001 00010 00100 00100"),
];

const digitValidationSet = [
  digitExample(1, "00100 01100 00100 00100 00100"),
  digitExample(1, "00010 00010 00010 00010 00111"),
  digitExample(4, "10010 10010 11110 00010 00010"),
  digitExample(4, "00110 01010 11111 00010 00010"),
  digitExample(7, "11111 00001 00110 00100 01000"),
  digitExample(7, "11110 00010 00100 00100 01000"),
];

const digitTestSet = [
  digitExample(1, "00100 00100 00100 00100 01110"),
  digitExample(1, "01000 01000 01000 01000 11100"),
  digitExample(1, "00010 00010 00010 00010 00010"),
  digitExample(1, "01100 10100 00100 00100 01110"),
  digitExample(1, "00001 00011 00001 00001 00011"),
  digitExample(4, "01010 01010 01111 00010 00011"),
  digitExample(4, "00100 01010 11111 00010 00010"),
  digitExample(7, "11111 00010 00100 00100 00100"),
  digitExample(7, "01111 00010 01111 00100 01000"),
];

function digitVector(image) {
  return Array.from(image.pixels.join(""), Number);
}

function labWeightInitializer(initialSeed) {
  let seed = initialSeed;
  return (rows, inputs) => Array.from({ length: rows }, () =>
    Array.from({ length: inputs + 1 }, (_, index) => {
      if (index === inputs) return 0;
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return (2 * seed / 4294967296 - 1) * Math.sqrt(6 / (inputs + rows));
    }),
  );
}

function createDigitNetwork() {
  const weights = labWeightInitializer(127);
  return {
    hiddenWeights: weights(digitHiddenSize, digitPixelCount),
    outputWeights: weights(trainingDigits.length, digitHiddenSize),
  };
}

function predictDigit(network, input) {
  const hidden = labAffine(network.hiddenWeights, input).map(Math.tanh);
  const scores = labAffine(network.outputWeights, hidden);
  return { hidden, digit: trainingDigits[scores.indexOf(Math.max(...scores))], ...labSoftmax(scores) };
}

function trainDigitBatch(network, batch, rate, labels = trainingDigits, trainHidden = true) {
  const { hiddenWeights, outputWeights } = network;
  const hiddenGradient = hiddenWeights.map((row) => row.map(() => 0));
  const outputGradient = outputWeights.map((row) => row.map(() => 0));
  for (const image of batch) {
    const input = digitVector(image);
    const { hidden, probabilities } = predictDigit(network, input);
    // Softmax with cross-entropy gives the derivative with respect to each output score.
    const outputDelta = probabilities.map((value, index) => value - Number(labels[index] === image.digit));
    const hiddenDelta = hidden.map((value, index) =>
      (1 - value ** 2) * outputDelta.reduce((sum, delta, unit) => sum + delta * outputWeights[unit][index], 0),
    );
    for (const [gradient, deltas, values] of [[hiddenGradient, hiddenDelta, input], [outputGradient, outputDelta, hidden]]) {
      for (const [unit, row] of gradient.entries()) {
        for (const [index, value] of values.entries()) row[index] += deltas[unit] * value;
        row[values.length] += deltas[unit];
      }
    }
  }
  // Both gradients use the same original weights. The final column is the bias.
  const layers = [[outputWeights, outputGradient]];
  if (trainHidden) layers.push([hiddenWeights, hiddenGradient]);
  for (const [weights, gradient] of layers) {
    for (const [unit, row] of weights.entries()) {
      for (const [index, value] of row.entries()) row[index] = value - rate * gradient[unit][index] / batch.length;
    }
  }
}

function meanDigitLoss(network, images) {
  return images.reduce((sum, image) =>
    sum + predictDigit(network, digitVector(image)).lossFor(trainingDigits.indexOf(image.digit)), 0) / images.length;
}

function digitTrainingMetrics(run) {
  return {
    train: meanDigitLoss(run.network, digitTrainingSet),
    validation: meanDigitLoss(run.network, digitValidationSet),
  };
}

function createDigitTrainingRun(rate) {
  const run = { rate, network: createDigitNetwork(), steps: 0, history: [] };
  run.history.push(digitTrainingMetrics(run));
  return run;
}

function advanceDigitRun(run) {
  const start = run.steps * digitBatchSize % digitTrainingSet.length;
  trainDigitBatch(run.network, digitTrainingSet.slice(start, start + digitBatchSize), run.rate);
  run.steps += 1;
  if (run.steps % (digitTrainingSet.length / digitBatchSize) === 0) run.history.push(digitTrainingMetrics(run));
}

function renderDigitDrawing(getNetwork) {
  const preview = element("section", { className: "digit-lab-step" },
    element("h4", { textContent: "Eine eigene Ziffer ausprobieren" }),
    element("p", { textContent: "Zeichne eine 1, 4 oder 7. Tippe auf einzelne Felder oder ziehe über das Raster. Per Tastatur schaltest du ein Feld mit Leertaste um." }),
  );
  const grid = element("div", { className: "digit-grid digit-drawing" });
  grid.setAttribute("role", "group");
  grid.setAttribute("aria-label", "Zeichenraster mit fünf Zeilen und fünf Spalten");
  const pixels = Array(digitPixelCount).fill(0);
  const clear = element("button", { type: "button", className: "button secondary", textContent: "Zeichnung löschen" });
  const status = labStatus();
  const { readout, show } = labReadout();
  const update = () => {
    clear.disabled = !pixels.includes(1);
    readout.hidden = clear.disabled;
    if (clear.disabled) {
      status.textContent = "Das Raster ist leer.";
      return;
    }
    const prediction = predictDigit(getNetwork(), pixels);
    status.textContent = `Der aktive Lauf stuft deine Zeichnung als ${prediction.digit} ein.`;
    show(prediction.probabilities.map((score, index) => [`Softmax für ${trainingDigits[index]}`, labPercent.format(score)]));
  };
  const cells = pixels.map((_, index) => {
    const cell = element("button", { type: "button" });
    cell.dataset.pixel = index;
    cell.setAttribute("aria-label", `Zeile ${Math.floor(index / 5) + 1}, Spalte ${index % 5 + 1}`);
    cell.setAttribute("aria-pressed", "false");
    cell.addEventListener("click", (event) => {
      if (event.detail === 0) {
        paint(index, 1 - pixels[index]);
        update();
      }
    });
    return cell;
  });
  const paint = (index, ink) => {
    pixels[index] = ink;
    cells[index].setAttribute("aria-pressed", String(Boolean(ink)));
  };
  let stroke = null;
  grid.addEventListener("pointerdown", (event) => {
    const index = Number(event.target.dataset.pixel);
    if (stroke || event.button !== 0 || !Number.isInteger(index)) return;
    stroke = { pointer: event.pointerId, index, ink: 1 - pixels[index] };
    grid.setPointerCapture(event.pointerId);
    paint(index, stroke.ink);
    update();
  });
  grid.addEventListener("pointermove", (event) => {
    if (stroke?.pointer !== event.pointerId) return;
    const cell = document.elementFromPoint(event.clientX, event.clientY);
    const index = Number(cell?.dataset.pixel);
    if (!Number.isInteger(index) || !grid.contains(cell) || stroke.index === index) return;
    const startRow = Math.floor(stroke.index / 5);
    const startColumn = stroke.index % 5;
    const rowDelta = Math.floor(index / 5) - startRow;
    const columnDelta = index % 5 - startColumn;
    const distance = Math.max(Math.abs(rowDelta), Math.abs(columnDelta));
    for (let step = 1; step <= distance; step++) {
      const row = startRow + Math.round(rowDelta * step / distance);
      const column = startColumn + Math.round(columnDelta * step / distance);
      paint(row * 5 + column, stroke.ink);
    }
    stroke.index = index;
    update();
  });
  grid.addEventListener("lostpointercapture", (event) => {
    if (stroke?.pointer === event.pointerId) stroke = null;
  });
  clear.addEventListener("click", () => {
    for (const index of pixels.keys()) paint(index, 0);
    cells[0].focus();
    update();
  });
  grid.append(...cells);
  preview.append(grid, clear, status, readout);
  update();
  return { preview, update };
}

function renderDigitTrainingLab() {
  const panel = labPanel("Ziffernlabor",
    "Trainiere zwei Netze mit denselben Startgewichten und Batches. Nur die Lernrate unterscheidet sich. Ein Update verarbeitet sechs Bilder, drei Updates ergeben eine Epoche.");
  const batchesPerEpoch = digitTrainingSet.length / digitBatchSize;
  const maxEpochs = 20;
  let runs = digitLearningRates.map(createDigitTrainingRun);
  const rate = labSelect("lab-digit-rate", "Aktiver Trainingslauf",
    digitLearningRates.map((value, index) => [index, `Lernrate ${labNumber.format(value)}`]));
  const activeRun = () => runs[Number(rate.input.value)];
  const step = element("button", { type: "button", className: "button", textContent: "Ein Update ausführen" });
  const epoch = element("button", { type: "button", className: "button secondary", textContent: "Epoche abschließen" });
  const reset = element("button", { type: "button", className: "button secondary", textContent: "Beide Läufe zurücksetzen" });
  const status = labStatus();
  const comparison = element("div");
  const history = element("div");
  const evaluate = element("button", { type: "button", className: "button secondary", textContent: "Testbilder auswerten" });
  const testStatus = labStatus();
  testStatus.hidden = true;
  const testDetails = element("div", { className: "digit-test-details", hidden: true });
  const samplePreview = element("div", { className: "digit-grid" });
  samplePreview.setAttribute("role", "img");
  const sample = labSelect("lab-digit-test-sample", "Testbild auswählen", []);
  const sampleOutcome = labStatus();
  const drawing = renderDigitDrawing(() => activeRun().network);
  let testResults = [];

  const updateSample = () => {
    const result = testResults[Number(sample.input.value)];
    digitGrid(samplePreview, result.image, `Testbild ${Number(sample.input.value) + 1}`);
    sampleOutcome.textContent = `Richtiges Label: ${result.image.digit}. Vorhersage: ${result.prediction.digit}.`;
  };
  const hideTest = () => {
    testStatus.hidden = true;
    testStatus.textContent = "";
    testDetails.hidden = true;
  };
  const update = () => {
    const run = activeRun();
    step.disabled = epoch.disabled = run.steps >= maxEpochs * batchesPerEpoch;
    evaluate.disabled = run.steps === 0;
    const completed = Math.floor(run.steps / batchesPerEpoch);
    const pending = run.steps % batchesPerEpoch;
    status.textContent = `Lernrate ${labNumber.format(run.rate)} · Updates: ${run.steps} · Volle Epochen: ${completed}. ${step.disabled
      ? "Das Laborlimit ist erreicht."
      : `Epoche ${completed + 1}: ${pending} von ${batchesPerEpoch} Batches verarbeitet.`}`;
    comparison.replaceChildren(renderLessonExample({
      title: "Verlust der beiden Läufe vergleichen",
      columns: ["Lauf", "Updates", "Training", "Validierung"],
      rows: runs.map((item) => {
        const metrics = digitTrainingMetrics(item);
        return [labNumber.format(item.rate), item.steps, labNumber.format(metrics.train), labNumber.format(metrics.validation)];
      }),
    }));
    const first = Math.max(0, run.history.length - 5);
    history.replaceChildren(renderLessonExample({
      title: "Verlauf des aktiven Laufs",
      columns: ["Stand", "Training", "Validierung"],
      rows: run.history.slice(first).map((metrics, index) =>
        [first + index === 0 ? "Start" : `Epoche ${first + index}`, labNumber.format(metrics.train), labNumber.format(metrics.validation)]),
    }));
    drawing.update();
  };
  const train = (steps) => {
    for (let index = 0; index < steps; index++) advanceDigitRun(activeRun());
    hideTest();
    update();
  };
  step.addEventListener("click", () => train(1));
  epoch.addEventListener("click", () => train(batchesPerEpoch - activeRun().steps % batchesPerEpoch));
  rate.input.addEventListener("change", () => { hideTest(); update(); });
  reset.addEventListener("click", () => {
    runs = digitLearningRates.map(createDigitTrainingRun);
    hideTest();
    update();
  });
  evaluate.addEventListener("click", () => {
    const run = activeRun();
    testResults = digitTestSet.map((image) => ({ image, prediction: predictDigit(run.network, digitVector(image)) }));
    const hits = testResults.filter(({ image, prediction }) => prediction.digit === image.digit).length;
    const baselineDigit = trainingDigits.reduce((best, digit) =>
      digitTrainingSet.filter((image) => image.digit === digit).length > digitTrainingSet.filter((image) => image.digit === best).length ? digit : best,
    );
    const baselineHits = digitTestSet.filter(({ digit }) => digit === baselineDigit).length;
    testStatus.hidden = false;
    testStatus.textContent = `Netz: ${hits} von ${testResults.length} richtig. Baseline „immer ${baselineDigit}“: ${baselineHits} von ${testResults.length} richtig.`;
    sample.input.replaceChildren(...testResults.map(({ image, prediction }, index) =>
      element("option", { value: index, textContent: `Bild ${index + 1} · ${image.digit === prediction.digit ? "richtig" : "verwechselt"}` }),
    ));
    const firstError = testResults.findIndex(({ image, prediction }) => image.digit !== prediction.digit);
    sample.input.selectedIndex = Math.max(0, firstError);
    testDetails.hidden = false;
    updateSample();
  });
  sample.input.addEventListener("change", updateSample);
  testDetails.append(element("div", { className: "lab-with-grid" }, samplePreview, element("div", {}, sample.row, sampleOutcome)));
  panel.append(rate.row, element("div", { className: "actions" }, step, epoch, reset), status, comparison, history,
    element("section", { className: "digit-lab-step" }, element("h4", { textContent: "Den gewählten Lauf testen" }),
      element("p", { textContent: "Wähle einen Lauf anhand der Validierung. Prüfe seinen aktuellen Stand dann einmal auf den neun Testbildern." }),
      evaluate, testStatus, testDetails,
    ), drawing.preview);
  update();
  return panel;
}
