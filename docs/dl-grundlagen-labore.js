"use strict";

const deepLearningPracticeLabs = {
  xor: renderXorLab, regression: renderRegressionLab, transfer: renderTransferLab,
  stability: renderStabilityLab, calibration: renderCalibrationLab,
  tinyTransformer: renderTinyTransformerLab, alignment: renderAlignmentLab,
  recurrent: renderRecurrentLab, visionTasks: renderVisionTasksLab, imageGeneration: renderImageGenerationLab,
  contrastive: renderContrastiveLab, agent: renderAgentLab, efficiency: renderEfficiencyLab,
};

function dlChart(label, draw) {
  const canvas = element("canvas", { className: "dl-chart", width: 480, height: 270 });
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", label);
  draw(canvas.getContext("2d"), canvas.width, canvas.height);
  return canvas;
}

function dlTable(title, columns, rows) {
  return renderLessonExample({ title, columns, rows });
}

function dlTrial(title, description, controls, evaluate, reveal) {
  const panel = labPanel(title, description);
  const output = element("div", { className: "dl-trial-output" });
  const feedback = labStatus();
  const run = learningButton("Versuch ausführen", () => {
    const result = evaluate();
    if (!result) {
      feedback.dataset.result = "retry";
      feedback.textContent = "Wähle zuerst eine Vermutung.";
      return;
    }
    output.replaceChildren(...result.nodes);
    feedback.dataset.result = result.correct === undefined ? "" : result.correct ? "success" : "retry";
    const verdict = result.correct === undefined ? "" : result.correct ? "Deine Vermutung passt. " : "Prüfe deine Vermutung anhand der Messwerte. ";
    feedback.textContent = verdict + result.message;
    if (result.correct !== undefined) reveal();
  });
  const reset = learningButton("Neu starten", () => {
    for (const control of controls) {
      const input = control.input;
      if (input.type === "checkbox") input.checked = input.defaultChecked;
      else input.value = control.initial;
      input.dispatchEvent(new Event("input"));
    }
    output.replaceChildren();
    feedback.textContent = "";
    delete feedback.dataset.result;
    controls[0].input.focus();
  }, true);
  for (const control of controls) control.initial ??= control.input.value;
  panel.append(element("div", { className: "lab-controls" }, ...controls.map(({ row }) => row)),
    element("div", { className: "actions" }, run, reset), feedback, output);
  return panel;
}

function dlGuess(id, label, options) {
  return labSelect(id, label, [["", "Vermutung wählen"], ...options]);
}

function dlToggle(id, label, checked = false) {
  const input = element("input", { type: "checkbox", id, defaultChecked: checked, checked });
  return { input, row: element("label", { className: "preview-toggle" }, input, label) };
}

function renderXorLab(reveal) {
  const panel = labPanel("Vier Punkte und ihre Entscheidungsgrenze",
    "Live berechnet. Orange bedeutet Klasse 1, Blau Klasse 0. Verschiebe oder drehe die Gerade. Prüfe dann, welche Punkte das Modell richtig einordnet.");
  const angle = labRange("xor-angle", "Winkel der Geraden", 0, 360, 5, 45);
  const shift = labRange("xor-shift", "Abstand vom Mittelpunkt", -1, 1, .05, 0);
  const hidden = dlToggle("xor-hidden", "Eine verborgene ReLU-Schicht einsetzen");
  const second = dlToggle("xor-second", "Zweites Neuron für y − x hinzufügen", true);
  hidden.input.disabled = second.input.disabled = true;
  const guess = dlGuess("xor-guess", "Schafft die aktuelle Grenze alle vier Punkte?", [["yes", "Ja"], ["no", "Nein"]]);
  const plot = element("div");
  const output = element("div");
  const feedback = labStatus();
  const points = [[0, 0], [0, 1], [1, 0], [1, 1]];
  const predict = (x, y) => {
    const rotation = angle.input.valueAsNumber * Math.PI / 180;
    const a = Math.max(0, x - y), b = second.input.checked ? Math.max(0, y - x) : 0;
    const score = hidden.input.checked ? a + b - .5
      : (x - .5) * Math.cos(rotation) + (y - .5) * Math.sin(rotation) - shift.input.valueAsNumber;
    return { a, b, label: Number(score >= 0) };
  };
  const draw = () => {
    plot.replaceChildren(dlChart("Entscheidungsbereiche mit den vier XOR-Punkten", (ctx, width, height) => {
      const cells = 72;
      for (let row = 0; row < cells; row++) for (let col = 0; col < cells; col++) {
        const { label } = predict(-.25 + 1.5 * col / cells, 1.25 - 1.5 * row / cells);
        ctx.fillStyle = label ? "#f8d4a8" : "#d6ebfb";
        ctx.fillRect(col * width / cells, row * height / cells, width / cells + 1, height / cells + 1);
      }
      for (const [x, y] of points) {
        const px = (x + .25) * width / 1.5, py = (1.25 - y) * height / 1.5;
        ctx.fillStyle = x === y ? "#154768" : "#8a3e14";
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 16px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(x === y ? "0" : "1", px, py + 5);
      }
    }));
    angle.input.disabled = shift.input.disabled = hidden.input.checked;
    second.input.disabled = !hidden.input.checked;
    second.row.hidden = !hidden.input.checked;
    output.replaceChildren();
    feedback.textContent = "";
  };
  const run = learningButton("Grenze prüfen", () => {
    if (!guess.input.value) { feedback.textContent = "Wähle zuerst deine Vermutung."; return; }
    const rows = points.map(([x, y]) => {
      const { a, b, label } = predict(x, y);
      return [`(${x}, ${y})`, Number(x !== y), label, ...(hidden.input.checked ? [a, b, a + b] : [])];
    });
    const hits = rows.filter((row) => row[1] === row[2]).length;
    const correct = (hits === 4) === (guess.input.value === "yes");
    output.replaceChildren(dlTable("Ergebnis für die vier Ecken",
      ["Punkt", "Soll", "Ist", ...(hidden.input.checked ? ["ReLU 1", "ReLU 2", "Summe"] : [])], rows));
    feedback.dataset.result = correct ? "success" : "retry";
    feedback.textContent = `${hits} von 4 Punkten stimmen. ${correct ? "Deine Vermutung passt." : "Vergleiche die falsch eingeordneten Ecken mit deiner Vermutung."} ${hidden.input.checked
      ? second.input.checked ? "Die beiden Neuronen liefern Beiträge für entgegengesetzte Diagonalseiten. Schalte das zweite aus und prüfe, welcher Punkt seinen Beitrag verliert."
        : "Das erste Neuron trägt nur auf der Seite x > y bei. Ergänze das zweite und prüfe erneut."
      : "Probiere eine andere Gerade oder setze die zwei ReLU-Neuronen ein."}`;
    hidden.input.disabled = false;
    if (hidden.input.checked) reveal();
  });
  const reset = learningButton("Neu starten", () => {
    angle.input.value = 45;
    shift.input.value = 0;
    hidden.input.checked = false;
    second.input.checked = true;
    hidden.input.disabled = true;
    guess.input.value = "";
    for (const control of [angle, shift]) control.input.dispatchEvent(new Event("input"));
    guess.input.focus();
  }, true);
  for (const input of [angle.input, shift.input, hidden.input, second.input]) {
    input.addEventListener("input", draw);
  }
  panel.append(plot, angle.row, shift.row, hidden.row, second.row, guess.row, element("div", { className: "actions" }, run, reset), feedback, output);
  draw();
  return panel;
}

function regressionFit(points, squared) {
  let best = { error: Infinity };
  for (let intercept = 0; intercept <= 22; intercept += .5) {
    for (let slope = 0; slope <= 10; slope += .25) {
      const error = points.reduce((sum, [x, y]) => sum + Math.abs(y - intercept - slope * x) ** (squared ? 2 : 1), 0);
      if (error < best.error) best = { intercept, slope, error };
    }
  }
  return best;
}

function renderRegressionLab(reveal) {
  const slope = labRange("reg-slope", "Deine Steigung in Minuten je km", 0, 10, .25, 4);
  const intercept = labRange("reg-intercept", "Deine Startzeit in Minuten", 0, 22, .5, 8);
  const outlier = dlToggle("reg-outlier", "Lieferung mit Panne hinzufügen: 6 km, 62 Minuten");
  const guess = dlGuess("reg-guess", "Welche beste Gerade kommt bei der Panne näher an 62 Minuten?", [
    ["same", "Beide gleich nah"], ["square", "Quadratischer Fehler"], ["absolute", "Absoluter Fehler"],
  ]);
  return dlTrial("Deine Gerade und zwei Anpassungen vergleichen",
    "Live berechnet. Schätze zuerst selbst. Aktiviere die Panne und beobachte erst danach, wie die besten Geraden reagieren.",
    [slope, intercept, outlier, guess], () => {
      if (outlier.input.checked && !guess.input.value) return null;
      const points = [[1, 12], [2, 17], [3, 20], [4, 24], [5, 28]];
      if (outlier.input.checked) points.push([6, 62]);
      const absolute = regressionFit(points, false), square = regressionFit(points, true);
      const lines = [[intercept.input.valueAsNumber, slope.input.valueAsNumber, "#173f32"], [absolute.intercept, absolute.slope, "#235577"], [square.intercept, square.slope, "#8a3e14"]];
      const chart = dlChart("Lieferzeit gegen Entfernung, Messpunkte und drei Geraden", (ctx, width, height) => {
        const x = (km) => 25 + km * (width - 45) / 6;
        const y = (minutes) => height - 22 - minutes * (height - 42) / 85;
        ctx.strokeStyle = "#a9c2b5";
        ctx.beginPath(); ctx.moveTo(x(0), y(85)); ctx.lineTo(x(0), y(0)); ctx.lineTo(x(6), y(0)); ctx.stroke();
        for (const [base, gain, color] of lines) {
          ctx.strokeStyle = color; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.moveTo(x(0), y(base)); ctx.lineTo(x(6), y(base + 6 * gain)); ctx.stroke();
        }
        for (const [km, minutes] of points) {
          ctx.setLineDash([4, 3]); ctx.strokeStyle = "#173f32"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x(km), y(minutes)); ctx.lineTo(x(km), y(lines[0][0] + km * lines[0][1])); ctx.stroke();
          ctx.setLineDash([]); ctx.fillStyle = "#173f32";
          ctx.beginPath(); ctx.arc(x(km), y(minutes), 4, 0, Math.PI * 2); ctx.fill();
        }
      });
      const atSix = (fit) => fit.intercept + fit.slope * 6;
      const closest = Math.abs(62 - atSix(square)) === Math.abs(62 - atSix(absolute)) ? "same"
        : Math.abs(62 - atSix(square)) < Math.abs(62 - atSix(absolute)) ? "square" : "absolute";
      return {
        nodes: [chart, dlTable("Geraden im Vergleich", ["Gerade", "Start", "Steigung", "Bei 6 km"],
          [["Deine · grün", lines[0][0], lines[0][1], lines[0][0] + lines[0][1] * 6],
            ["Absoluter Fehler · blau", absolute.intercept, absolute.slope, atSix(absolute)], ["Quadratischer Fehler · orange", square.intercept, square.slope, atSix(square)]]),
          dlTable("Abweichungen je Messpunkt · Messwert minus Vorhersage", ["Kilometer", "Messwert", "Deine", "Absolut", "Quadratisch"], points.map(([x, y]) =>
            [x, y, ...lines.map(([base, gain]) => labNumber.format(y - base - gain * x))]))],
        correct: outlier.input.checked ? closest === guess.input.value : undefined,
        message: outlier.input.checked ? `Bei 6 km schätzt die absolute Anpassung ${atSix(absolute)} Minuten und die quadratische ${atSix(square)}. Große Abweichungen wachsen beim Quadrieren schneller. Vergleiche die Werte mit deiner Vermutung.`
          : "Du siehst den Ausgangslauf ohne Panne. Schalte die Panne ein und vergleiche die beiden neuen Schätzungen bei 6 km.",
      };
    }, reveal);
}

function trainedDigitReference() {
  const run = createDigitTrainingRun(.4);
  for (let step = 0; step < 60; step++) advanceDigitRun(run);
  return run.network;
}

const letterTrain = [
  digitExample("I", "00100 00100 00100 00100 00100"), digitExample("I", "01110 00100 00100 00100 01110"),
  digitExample("A", "00100 01010 10001 11111 10001"), digitExample("A", "01100 10010 11110 10010 10010"),
  digitExample("T", "11111 00100 00100 00100 00100"), digitExample("T", "01110 00100 00100 00100 00100"),
];
const letterTest = [
  digitExample("I", "00010 00010 00010 00010 00010"), digitExample("I", "11111 00100 00100 00100 11111"),
  digitExample("I", "01000 01000 01000 01000 01000"), digitExample("A", "00100 01010 11111 10001 10001"),
  digitExample("A", "01110 01010 01110 01010 01010"), digitExample("A", "01110 10001 11111 10001 10001"),
  digitExample("T", "11111 00010 00010 00010 00010"), digitExample("T", "11110 01000 01000 01000 01000"),
  digitExample("T", "01111 00010 00010 00010 00010"),
];

function renderTransferLab(reveal) {
  const updates = labSelect("transfer-updates", "Updates pro Lauf", [[12, "12"], [3, "3"], [60, "60"]]);
  const methods = ["Neu trainieren", "Nur den Ausgabekopf trainieren", "Gesamtes Netz feinabstimmen"];
  const guess = dlGuess("transfer-guess", "Welcher Lauf gehört zu denen mit den meisten Treffern?", methods.map((name, index) => [index, name]));
  return dlTrial("Ein Ziffernnetz mit sechs Buchstabenbildern weitertrainieren",
    "Live berechnet. Drei Läufe bekommen dieselben sechs Trainingsbilder, dieselben neuen Kopfgewichte und dieselbe Lernrate. Neun separate Bilder prüfen I, A und T.",
    [updates, guess], () => {
      if (!guess.input.value) return null;
      const labels = ["I", "A", "T"];
      const reference = trainedDigitReference();
      const rows = methods.map((name, mode) => {
        const net = createDigitNetwork();
        if (mode) net.hiddenWeights = reference.hiddenWeights.map((row) => [...row]);
        for (let step = 0; step < Number(updates.input.value); step++) trainDigitBatch(net, letterTrain, .4, labels, mode !== 1);
        const results = letterTest.map((image) => predictDigit(net, digitVector(image)));
        const hits = results.filter((item, index) => labels[trainingDigits.indexOf(item.digit)] === letterTest[index].digit).length;
        const loss = results.reduce((sum, item, index) => sum + item.lossFor(labels.indexOf(letterTest[index].digit)), 0) / results.length;
        return [name, hits, labNumber.format(loss)];
      });
      const best = Math.max(...rows.map((row) => row[1]));
      const winners = rows.filter((row) => row[1] === best).map((row) => row[0]);
      return { nodes: [dlTable("Getrennte Buchstabenbilder", ["Lauf", "Treffer von 9", "Mittlerer Verlust"], rows)],
        correct: rows[Number(guess.input.value)][1] === best,
        message: `Bei ${updates.input.value} Updates sind ${best} von 9 Treffern das beste Ergebnis. ${winners.join(" · ")}. Teste auch ein anderes Updatebudget. Gleiche Treffer können mit unterschiedlichen Verlusten einhergehen.` };
    }, reveal);
}

function stabilityRun(scale, residual, normalize) {
  const input = [-1, 0, 1];
  const rms = (vector) => Math.hypot(...vector) / Math.sqrt(vector.length);
  const states = [input];
  const local = [];
  for (let layer = 0; layer < 8; layer++) {
    const previous = states.at(-1);
    const factor = scale + Number(residual);
    const raw = previous.map((value) => value * factor);
    const mean = raw.reduce((sum, value) => sum + value, 0) / 3;
    const centered = raw.map((value) => value - mean);
    const spread = Math.sqrt(rms(centered) ** 2 + 1e-4);
    states.push(normalize ? centered.map((value) => value / spread) : raw);
    local.push({ factor, centered, spread });
  }
  const gradients = [[1, -1, 0]];
  for (const { factor, centered, spread } of local.reverse()) {
    const gradient = gradients[0];
    const mean = gradient.reduce((sum, value) => sum + value, 0) / 3;
    const dot = gradient.reduce((sum, value, index) => sum + value * centered[index], 0) / 3;
    gradients.unshift(gradient.map((value, index) => factor * (normalize
      ? (value - mean - centered[index] * dot / spread ** 2) / spread : value)));
  }
  return states.map((state, index) => [index, rms(state), rms(gradients[index])]);
}

function renderStabilityLab(reveal) {
  const scale = labSelect("stable-scale", "Anfänglicher Schichtfaktor", [[.5, "Klein · 0,5"], [1, "Neutral · 1"], [1.6, "Groß · 1,6"]]);
  const skip = dlToggle("stable-skip", "Direkten Restpfad addieren");
  const norm = dlToggle("stable-norm", "Aktivierungen pro Schicht normalisieren");
  const guess = dlGuess("stable-guess", "Wie groß ist der Gradient am Eingang gegenüber dem Ausgang?", [["small", "Kleiner"], ["similar", "Ungefähr gleich"], ["large", "Größer"]]);
  return dlTrial("Acht Schichten vorwärts und rückwärts durchrechnen",
    "Live berechnet. Das vereinfachte lineare Modell verwendet drei Werte je Schicht. Verglichen wird jeweils die quadratische Durchschnittsgröße (RMS).",
    [scale, skip, norm, guess], () => {
      if (!guess.input.value) return null;
      const rows = stabilityRun(Number(scale.input.value), skip.input.checked, norm.input.checked);
      const ratio = rows[0][2] / rows.at(-1)[2];
      const result = ratio < .8 ? "small" : ratio > 1.2 ? "large" : "similar";
      const baseline = stabilityRun(.5, false, false);
      return { nodes: [dlTable("Dein Lauf und Ausgangslauf mit Faktor 0,5", ["Schicht", "Aktivierung (RMS)", "Gradient (RMS)", "Referenzgradient"], rows.map(([index, a, g]) =>
        [index, labNumber.format(a), labNumber.format(g), labNumber.format(baseline[index][2])]))], correct: result === guess.input.value,
        message: `Dein Eingangsgradient ist ${labNumber.format(ratio)}-mal so groß wie der Ausgangsgradient. ${norm.input.checked
          ? "Normalisierung verändert im Beispiel sowohl die Aktivierungen als auch die Ableitung. Schalte nur sie aus und vergleiche."
          : "Ohne Normalisierung multiplizieren sich die acht Schichtfaktoren. Der Restpfad erhöht jeden Faktor hier um 1."}` };
    }, reveal);
}

function sampleDigitPixel(input, x, y) {
  const left = Math.floor(x), top = Math.floor(y);
  let value = 0;
  for (let row = top; row <= top + 1; row++) for (let col = left; col <= left + 1; col++) {
    if (col < 0 || row < 0 || col >= 5 || row >= 5) continue;
    value += input[row * 5 + col] * (1 - Math.abs(y - row)) * (1 - Math.abs(x - col));
  }
  return value;
}

function calibrationImages() {
  return digitTestSet.flatMap((image) => Array.from({ length: 40 }, (_, variant) => {
    const pixels = digitVector(image);
    return { digit: image.digit, values: pixels.map((_, index) =>
      sampleDigitPixel(pixels, index % 5 + (variant % 8 - 3.5) * .09, Math.floor(index / 5) + (Math.floor(variant / 8) - 2) * .1)) };
  }));
}

function renderCalibrationLab(reveal) {
  const brightness = labRange("cal-light", "Sichtbarkeit der Tinte", .2, 1, .1, 1);
  const lean = labRange("cal-lean", "Neigung · horizontale Verschiebung je Zeile", -.6, .6, .15, 0);
  const guess = dlGuess("cal-guess", "Wie ändert sich die Trefferquote gegenüber dem Ausgangslauf?", [["lower", "Sie sinkt"], ["similar", "Sie bleibt gleich"], ["higher", "Sie steigt"]]);
  let network;
  const images = calibrationImages();
  const measure = (light, tilt) => {
    network ??= trainedDigitReference();
    const bins = [0, 1, 2, 3].map(() => ({ count: 0, hits: 0, confidence: 0 }));
    for (const { digit, values } of images) {
      const changed = values.map((_, index) => sampleDigitPixel(values, index % 5 - tilt * (Math.floor(index / 5) - 2), Math.floor(index / 5)) * light);
      const result = predictDigit(network, changed);
      const confidence = Math.max(...result.probabilities);
      const bin = bins[confidence >= .9 ? 3 : confidence >= .75 ? 2 : confidence >= .6 ? 1 : 0];
      bin.count++; bin.hits += Number(result.digit === digit); bin.confidence += confidence;
    }
    return bins;
  };
  return dlTrial("Gemeldete Sicherheit auf 360 Pixelvarianten prüfen",
    "Live berechnet. Neun zurückgehaltene Ziffern liefern je 40 synthetische Varianten. Die Varianten sind verwandt. Dünn besetzte Bereiche sind besonders unsicher.",
    [brightness, lean, guess], () => {
      if (!guess.input.value) return null;
      const baseline = measure(1, 0), changed = measure(brightness.input.valueAsNumber, lean.input.valueAsNumber);
      const total = (bins) => bins.reduce((sum, bin) => sum + bin.hits, 0);
      const actual = total(changed) < total(baseline) ? "lower" : total(changed) > total(baseline) ? "higher" : "similar";
      const rows = (bins) => bins.map(({ count, hits, confidence }, index) =>
        [["Unter 60 %", "60 bis unter 75 %", "75 bis unter 90 %", "90 bis 100 %"][index], `${count}${count === 0 ? " · leer" : count < 20 ? " · klein" : ""}`,
          count ? labPercent.format(confidence / count) : "–", count ? labPercent.format(hits / count) : "–"]);
      const columns = ["Bereich", "Beispiele", "Ø Sicherheit", "Treffer"];
      return { nodes: [dlTable("Ausgangslauf · Helligkeit 1, Neigung 0", columns, rows(baseline)),
        dlTable("Deine Einstellungen", columns, rows(changed))], correct: actual === guess.input.value,
        message: `Ausgangslauf: ${total(baseline)} von 360 richtig. Dein Lauf: ${total(changed)} von 360. Vergleiche in derselben Zeile die durchschnittliche Sicherheit mit dem Trefferanteil und achte auf die Gruppengröße.` };
    }, reveal);
}
