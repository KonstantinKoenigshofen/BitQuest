"use strict";

function convolveDigit(pixels, kernel, padding = 0, stride = 1) {
  const size = Math.floor((5 + 2 * padding - 3) / stride) + 1;
  const patches = Array.from({ length: size ** 2 }, (_, index) => {
    const top = Math.floor(index / size) * stride - padding;
    const left = index % size * stride - padding;
    return kernel.map((_, offset) => {
      const row = top + Math.floor(offset / 3);
      const column = left + offset % 3;
      return row >= 0 && row < 5 && column >= 0 && column < 5 ? row * 5 + column : -1;
    });
  });
  const values = patches.map((patch) => kernel.reduce((sum, weight, index) => sum + weight * (pixels[patch[index]] ?? 0), 0));
  return { size, patches, values };
}

function renderConvolutionLab() {
  const panel = labPanel("Einen Filter über Pixel schieben",
    "Wähle ein Bild und einen Filter. Tippe auf ein Feld der Feature Map, um zu sehen, welche Pixel zur Rechnung beitragen.");
  const image = labSelect("conv-image", "Ziffernbild", [[1, "1 · senkrechter Strich"], [4, "4 · Kreuzung"], [6, "7 · breiter Balken"]], 6);
  const kernels = [[0, 0, 0, 1, 1, 1, 0, 0, 0], [0, 1, 0, 0, 1, 0, 0, 1, 0]];
  const filter = labSelect("conv-kernel", "3-mal-3-Filter", [[0, "Waagerechter Strich"], [1, "Senkrechter Strich"]]);
  const padding = labSelect("conv-padding", "Padding", [[0, "0 · ohne Rand"], [1, "1 · mit Nullrand"]], "1");
  const stride = labSelect("conv-stride", "Schrittweite (Stride)", [[1, "1 Pixel"], [2, "2 Pixel"]]);
  const preview = element("div", { className: "digit-grid" });
  preview.setAttribute("role", "img");
  const field = element("div", { className: "feature-map" });
  field.setAttribute("role", "group");
  field.setAttribute("aria-label", "Feature Map");
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const selected = digitSamples[Number(image.input.value)];
    const pixels = digitVector(selected);
    const kernel = kernels[Number(filter.input.value)];
    const { size, patches, values } = convolveDigit(pixels, kernel, Number(padding.input.value), Number(stride.input.value));
    const showPosition = (index) => {
      const position = `Zeile ${Math.floor(index / size) + 1}, Spalte ${index % size + 1}`;
      const patch = patches[index];
      for (const [pixel, cell] of Array.from(preview.children).entries()) {
        cell.classList.toggle("pixel-window", patch.includes(pixel));
      }
      const terms = patch.flatMap((pixel, offset) => kernel[offset] === 1 ? [pixels[pixel] ?? 0] : []);
      for (const [offset, cell] of Array.from(field.children).entries()) cell.setAttribute("aria-pressed", String(offset === index));
      status.textContent = `${position}: ${terms.join(" + ")} = ${values[index]}.`;
    };
    digitGrid(preview, selected, `Gezeichnete Ziffer ${selected.digit}`);
    field.style.setProperty("--feature-size", size);
    field.replaceChildren(...values.map((value, index) => {
      const cell = element("button", { type: "button", textContent: value });
      cell.setAttribute("aria-label", `Zeile ${Math.floor(index / size) + 1}, Spalte ${index % size + 1}, Wert ${value}`);
      cell.addEventListener("click", () => showPosition(index));
      return cell;
    }));
    show([["Filterzeilen", [0, 3, 6].map((offset) => kernel.slice(offset, offset + 3).join(" ")).join(" / ")],
      ["Größe der Feature Map", `${size} × ${size}`],
      ["2 × 2 Max-Pooling · links oben", String(Math.max(values[0], values[1], values[size], values[size + 1]))]]);
    showPosition(0);
  };
  for (const control of [image, filter, padding, stride]) control.input.addEventListener("change", update);
  panel.append(element("div", { className: "lab-controls" }, image.row, filter.row, padding.row, stride.row),
    element("div", { className: "feature-comparison" },
      element("div", {}, element("p", { textContent: "Eingabebild" }), preview),
      element("div", {}, element("p", { textContent: "Feature Map" }), field),
    ), status, readout);
  update();
  return panel;
}

function createDigitCnn() {
  const weights = labWeightInitializer(314);
  return { filters: weights(4, 9), outputWeights: weights(3, 36) };
}

function predictDigitCnn(network, input) {
  const maps = network.filters.map((filter) => convolveDigit(input, filter.slice(0, -1)));
  const features = maps.flatMap(({ values }, index) => values.map((value) => Math.max(0, value + network.filters[index][9])));
  const scores = labAffine(network.outputWeights, features);
  return { maps, features, digit: trainingDigits[scores.indexOf(Math.max(...scores))], ...labSoftmax(scores) };
}

function trainCnnBatch(network, images, rate) {
  const { filters, outputWeights } = network;
  const filterGradient = filters.map((row) => row.map(() => 0));
  const outputGradient = outputWeights.map((row) => row.map(() => 0));
  for (const image of images) {
    const input = digitVector(image);
    const { maps, features, probabilities } = predictDigitCnn(network, input);
    const delta = probabilities.map((probability, index) => probability - Number(trainingDigits[index] === image.digit));
    for (const [unit, row] of outputGradient.entries()) {
      for (const [index, value] of features.entries()) row[index] += delta[unit] * value;
      row[features.length] += delta[unit];
    }
    for (const [filter, { patches }] of maps.entries()) {
      for (const [position, patch] of patches.entries()) {
        const index = filter * patches.length + position;
        if (features[index] === 0) continue;
        const gradient = delta.reduce((sum, value, unit) => sum + value * outputWeights[unit][index], 0);
        // The same kernel is used at every position, so all positions contribute to it.
        for (const [offset, pixel] of patch.entries()) filterGradient[filter][offset] += gradient * input[pixel];
        filterGradient[filter][9] += gradient;
      }
    }
  }
  for (const [weights, gradients] of [[filters, filterGradient], [outputWeights, outputGradient]]) {
    for (const [unit, row] of weights.entries()) {
      for (const [index, value] of row.entries()) row[index] = value - rate * gradients[unit][index] / images.length;
    }
  }
}

function renderCnnLab() {
  const panel = labPanel("Ziffernnetz und CNN auf denselben Bildern vergleichen",
    "Beide Netze verwenden die 18 Trainingsbilder und sechs Validierungsbilder aus dem Ziffernlabor. Sie trainieren jeweils mit Lernrate 0,4 und denselben Batches. Der Aufbau und die Startparameter unterscheiden sich.");
  let dense;
  let cnn;
  let epochs;
  const updatesPerEpoch = digitTrainingSet.length / digitBatchSize;
  const train = element("button", { type: "button", className: "button", textContent: "Beide fünf Epochen trainieren" });
  const reset = element("button", { type: "button", className: "button secondary", textContent: "Neu starten" });
  const evaluate = element("button", { type: "button", className: "button secondary", textContent: "Neun Testbilder auswerten" });
  const status = labStatus();
  const loss = element("div");
  const test = element("div", { hidden: true });
  const results = labStatus();
  const selected = labSelect("cnn-test-image", "Testbild wählen", digitTestSet.map((_, index) => [index, `Bild ${index + 1}`]));
  const preview = element("div", { className: "digit-grid" });
  preview.setAttribute("role", "img");
  const answer = labStatus();
  const update = () => {
    const meanCnnLoss = (images) => images.reduce((sum, image) =>
      sum + predictDigitCnn(cnn, digitVector(image)).lossFor(trainingDigits.indexOf(image.digit)), 0) / images.length;
    loss.replaceChildren(renderLessonExample({
      title: "Mittlere Kreuzentropie",
      columns: ["Modell", "Training", "Validierung"],
      rows: [
        ["Dichtes Netz", labNumber.format(meanDigitLoss(dense, digitTrainingSet)), labNumber.format(meanDigitLoss(dense, digitValidationSet))],
        ["CNN", labNumber.format(meanCnnLoss(digitTrainingSet)), labNumber.format(meanCnnLoss(digitValidationSet))],
      ],
    }));
    status.textContent = `Beide Modelle: ${epochs} Epochen, ${epochs * updatesPerEpoch} Updates pro Modell.`;
    train.disabled = epochs >= 20;
    if (train.disabled) status.textContent += " Das Laborlimit ist erreicht.";
    test.hidden = true;
    evaluate.disabled = epochs === 0;
  };
  const selectImage = () => {
    const image = digitTestSet[Number(selected.input.value)];
    const input = digitVector(image);
    digitGrid(preview, image, `Testbild ${Number(selected.input.value) + 1}`);
    answer.textContent = `Label ${image.digit} · Dichtes Netz: ${predictDigit(dense, input).digit} · CNN: ${predictDigitCnn(cnn, input).digit}`;
  };
  const restart = () => {
    dense = createDigitNetwork();
    cnn = createDigitCnn();
    epochs = 0;
    update();
  };
  train.addEventListener("click", () => {
    for (let epoch = 0; epoch < 5; epoch++) {
      for (let start = 0; start < digitTrainingSet.length; start += digitBatchSize) {
        const images = digitTrainingSet.slice(start, start + digitBatchSize);
        trainDigitBatch(dense, images, 0.4);
        trainCnnBatch(cnn, images, 0.4);
      }
    }
    epochs += 5;
    update();
  });
  reset.addEventListener("click", restart);
  evaluate.addEventListener("click", () => {
    const hits = (predict, network) => digitTestSet.filter((image) => predict(network, digitVector(image)).digit === image.digit).length;
    test.hidden = false;
    results.textContent = `Von neun Bildern richtig · Dichtes Netz: ${hits(predictDigit, dense)} · CNN: ${hits(predictDigitCnn, cnn)}.`;
    selectImage();
  });
  selected.input.addEventListener("change", selectImage);
  test.append(results, element("div", { className: "lab-with-grid" }, preview, element("div", {}, selected.row, answer)));
  panel.append(element("div", { className: "actions" }, train, reset), status, loss,
    element("div", { className: "actions" }, evaluate), test);
  restart();
  return panel;
}
