"use strict";

const qcFormat = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 3 });
const qcAmplitude = (value) => Math.abs(value) < 1e-12 ? 0 : value;
const qcProbability = ([real, imaginary]) => real ** 2 + imaginary ** 2;
const qcScale = ([real, imaginary], value) => [real * value, imaginary * value];
const qcAdd = ([a, b], [c, d]) => [a + c, b + d];
const qcMultiply = ([a, b], [c, d]) => [a * c - b * d, a * d + b * c];
const qcBasis = (index, length) => Array.from({ length }, (_, i) => [Number(i === index), 0]);
const qcLabels = (length) => Array.from({ length }, (_, i) => i.toString(2).padStart(Math.log2(length), "0"));
// Qubit 0 ist die linke Stelle der Basisbeschriftung.
const qcMask = (state, qubit) => 1 << (Math.log2(state.length) - 1 - qubit);
const qcTensor = (left, right) => left.flatMap((a) => right.map((b) => qcMultiply(a, b)));

function qcGate(state, gate, qubit = 0) {
  const mask = qcMask(state, qubit);
  return state.map((amp, i) => {
    const one = (i & mask) !== 0;
    if (gate === "X") return state[i ^ mask];
    if (gate === "H") return qcScale(qcAdd(state[i & ~mask], qcScale(state[i | mask], one ? -1 : 1)), Math.SQRT1_2);
    if (!one) return amp;
    if (gate === "Z") return qcScale(amp, -1);
    return qcMultiply(amp, gate === "S" ? [0, 1] : [0, -1]);
  });
}

function qcControlledX(state, controls, target) {
  const mask = controls.reduce((bits, qubit) => bits | qcMask(state, qubit), 0);
  const flip = qcMask(state, target);
  return state.map((amp, i) => (i & mask) === mask ? state[i ^ flip] : amp);
}

function qcProject(state, includes) {
  const probability = state.reduce((sum, amp, index) => sum + (includes(index) ? qcProbability(amp) : 0), 0);
  return {
    probability,
    state: probability < 1e-12 ? null : state.map((amp, i) => includes(i) ? qcScale(amp, 1 / Math.sqrt(probability)) : [0, 0]),
  };
}

function qcFidelity(left, right) {
  const inner = left.reduce((sum, [a, b], i) => qcAdd(sum, qcMultiply([a, -b], right[i])), [0, 0]);
  return Math.min(1, qcProbability(inner));
}

function qcAmplitudeLabel([real, imaginary]) {
  const a = qcAmplitude(real);
  const b = qcAmplitude(imaginary);
  if (b === 0) return qcFormat.format(a);
  if (a === 0) return `${qcFormat.format(b)}i`;
  return `${qcFormat.format(a)} ${b < 0 ? "−" : "+"} ${qcFormat.format(Math.abs(b))}i`;
}

const qcStates = new Map([
  ["zero", ["|0⟩", qcBasis(0, 2)]],
  ["one", ["|1⟩", qcBasis(1, 2)]],
  ["plus", ["|+⟩", [[Math.SQRT1_2, 0], [Math.SQRT1_2, 0]]]],
  ["minus", ["|−⟩", [[Math.SQRT1_2, 0], [-Math.SQRT1_2, 0]]]],
  ["phase", ["√3/2 |0⟩ + i/2 |1⟩", [[Math.sqrt(3) / 2, 0], [0, 0.5]]]],
]);

function qcStateSelect(id, label, value, keys = [...qcStates.keys()]) {
  return labSelect(id, label, keys.map((key) => [key, qcStates.get(key)[0]]), value);
}

function qcChart(label) {
  const chart = element("ul", { className: "quantum-chart" });
  chart.setAttribute("aria-label", label);
  chart.setAttribute("role", "list");
  const show = (probabilities, { labels = qcLabels(probabilities.length), state, counts } = {}) => {
    chart.replaceChildren(...probabilities.map((value, index) => element("li", {},
      element("span", { className: "quantum-chart-label", textContent: labels[index] }),
      element("span", { textContent: state ? `${qcAmplitudeLabel(state[index])} · ${labPercent.format(value)}`
        : `${counts ? `${counts[index]} · ` : ""}${labPercent.format(value)}` }),
      labBar(value),
    )));
  };
  return { chart, show, state: (state) => show(state.map(qcProbability), { state }) };
}

function qcStatus(status, text, result = "") {
  status.textContent = text;
  status.dataset.result = result;
}

function renderQubitState(reveal) {
  const panel = labPanel("Messbasis wechseln", "Stelle die Z-Wahrscheinlichkeit für 1 und die Phase des zweiten Anteils ein. Vergleiche die theoretischen Ausgaben für dieselbe Präparation.");
  const probability = labRange("qubit-p1", "Wahrscheinlichkeit für 1 in Z (in Prozent)", 0, 100, 5, 50);
  const phase = labSelect("qubit-phase", "Relative Phase", [[0, "0°"], [90, "90°"], [180, "180°"], [270, "270°"]]);
  const basis = labSelect("qubit-basis", "Messbasis", [["Z", "Z (0 und 1)"], ["X", "X (+ und −)"], ["Y", "Y (+i und −i)"]]);
  const output = qcChart("Wahrscheinlichkeiten pro Messwert");
  const bloch = labReadout();
  const status = labStatus();
  const show = () => {
    const p = probability.input.valueAsNumber / 100;
    const angle = Number(phase.input.value) * Math.PI / 180;
    const state = [[Math.sqrt(1 - p), 0], [Math.sqrt(p) * Math.cos(angle), Math.sqrt(p) * Math.sin(angle)]];
    const measured = { Z: state, X: qcGate(state, "H"), Y: qcGate(qcGate(state, "Sdg"), "H") };
    const axis = basis.input.value;
    const labels = { Z: ["0", "1"], X: ["+", "−"], Y: ["+i", "−i"] }[axis];
    const probabilities = measured[axis].map(qcProbability);
    output.show(probabilities, { labels });
    const coordinates = ["X", "Y", "Z"].map((key) => qcFormat.format(qcAmplitude(qcProbability(measured[key][0]) - qcProbability(measured[key][1]))));
    bloch.show([["Bloch-Koordinaten (x, y, z)", coordinates.join(" / ")]]);
    qcStatus(status, `α = ${qcAmplitudeLabel(state[0])}, β = ${qcAmplitudeLabel(state[1])}. In ${axis} gilt ${labPercent.format(probabilities[0])} für ${labels[0]}.`);
    reveal();
  };
  panel.append(probability.row, phase.row, basis.row, element("div", { className: "actions" }, learningButton("Messverteilung berechnen", show)), status, output.chart, bloch.readout);
  return panel;
}

function renderQubitGates(reveal) {
  const panel = labPanel("Gatterfolge ausprobieren", "Wähle den Startzustand und wende Gatter nacheinander an. Das Labor zeigt die komplexen Amplituden und die Z-Wahrscheinlichkeiten.");
  const start = qcStateSelect("gatter-start", "Startzustand", "plus");
  const output = qcChart("Amplituden und Z-Wahrscheinlichkeiten");
  const status = labStatus();
  const sequence = element("p");
  const steps = [];
  let state;
  const update = () => {
    sequence.textContent = steps.length ? `Gatterfolge: ${steps.join(" → ")}` : "Noch kein Gatter ausgeführt.";
    output.state(state);
  };
  const change = (gate, label) => {
    state = qcGate(state, gate);
    steps.push(label);
    update();
    qcStatus(status, `${label} angewendet. Normquadrat: ${qcFormat.format(state.reduce((sum, amp) => sum + qcProbability(amp), 0))}.`);
    reveal();
  };
  const reset = () => {
    state = qcStates.get(start.input.value)[1];
    steps.length = 0;
    qcStatus(status, "Startzustand gewählt.");
    update();
  };
  const gates = [["X", "X"], ["Z", "Z"], ["H", "H"], ["S", "S"], ["Sdg", "S†"]];
  start.input.addEventListener("change", reset);
  panel.append(start.row, element("div", { className: "actions" }, ...gates.map(([gate, label]) => learningButton(`${label} anwenden`, () => change(gate, label))),
    learningButton("Zurücksetzen", reset, true)), sequence, status, output.chart);
  reset();
  return panel;
}

function renderQubitRegister(reveal) {
  const panel = labPanel("Ein Zwei-Qubit-Register lesen", "Wähle zwei Faktoren und danach einen Messzweig. Das erste Qubit steht links. Das zweite wird im Experiment nicht gemessen.");
  const first = qcStateSelect("register-erstes", "Erstes Qubit", "plus");
  const second = qcStateSelect("register-zweites", "Zweites Qubit", "phase");
  const branch = labSelect("register-zweig", "Ergebnis am ersten Qubit untersuchen", [[0, "0"], [1, "1"]]);
  const output = qcChart("Amplituden und Z-Wahrscheinlichkeiten des Registers");
  const status = labStatus();
  const product = () => qcTensor(qcStates.get(first.input.value)[1], qcStates.get(second.input.value)[1]);
  const reset = () => {
    output.state(product());
    qcStatus(status, "Zustand vor der Teilmessung.");
  };
  const measure = () => {
    const result = Number(branch.input.value);
    const { state, probability } = qcProject(product(), (index) => (index >> 1) === result);
    if (!state) {
      output.state(product());
      qcStatus(status, `Ergebnis ${result} ist unmöglich. Probiere den anderen Zweig oder ändere das erste Qubit.`, "retry");
    } else {
      output.state(state);
      qcStatus(status, `Zweig ${result} tritt mit ${labPercent.format(probability)} auf. Gezeigt wird der neu normierte Zustand in diesem Zweig.`, "success");
    }
    reveal();
  };
  for (const input of [first.input, second.input, branch.input]) input.addEventListener("change", reset);
  panel.append(first.row, second.row, branch.row, element("div", { className: "actions" }, learningButton("Messzweig auswerten", measure),
    learningButton("Produktzustand anzeigen", reset, true)), status, output.chart);
  reset();
  return panel;
}

function renderDeutschOracle(reveal) {
  const panel = labPanel("Vier Orakel vergleichen", "Das zweite Qubit ist das Ziel des Orakels. Führe die drei Schaltungsschritte aus und lies am Ende nur das erste Qubit aus.");
  const functions = [[0, 0], [1, 1], [0, 1], [1, 0]];
  const oracle = labSelect("deutsch-funktion", "Funktion", functions.map(([zero, one], i) => [i, `f(0) = ${zero}, f(1) = ${one}`]));
  const output = qcChart("Amplituden nach dem letzten Schaltungsschritt");
  const status = labStatus();
  let state;
  let stage;
  const instructions = ["Beide Hadamards ausführen", "Orakel einmal aufrufen", "Hadamard auf dem ersten Qubit anwenden"];
  const next = learningButton(instructions[0], () => {
    const f = functions[Number(oracle.input.value)];
    if (stage === 0) {
      state = qcGate(qcGate(state, "H", 0), "H", 1);
      qcStatus(status, "Beide Qubits wurden gedreht. Das Hilfsqubit ist |−⟩. Orakelaufrufe: 0.");
    } else if (stage === 1) {
      state = state.map((_, i) => state[i ^ f[i >> 1]]);
      qcStatus(status, "Orakelaufrufe: 1. Vergleiche die Vorzeichen der Zweige mit erstem Qubit 0 und 1.");
    } else {
      state = qcGate(state, "H", 0);
      const first = Number(qcProject(state, (i) => i >> 1 === 1).probability > 0.5);
      qcStatus(status, `Erstes Messbit: ${first}. Die Funktion ist ${first ? "balanciert" : "konstant"}. Orakelaufrufe: 1.`, "success");
      reveal();
    }
    output.state(state);
    stage++;
    next.textContent = instructions[stage] ?? "Schaltung abgeschlossen";
    if (stage === instructions.length) {
      next.disabled = true;
      restart.focus();
    }
  });
  const reset = () => {
    state = qcBasis(1, 4);
    stage = 0;
    next.disabled = false;
    next.textContent = instructions[0];
    output.state(state);
    qcStatus(status, "Startzustand |01⟩. Orakelaufrufe: 0.");
  };
  const restart = learningButton("Schaltung zurücksetzen", reset, true);
  oracle.input.addEventListener("change", reset);
  panel.append(oracle.row, element("div", { className: "actions" }, next, restart), status, output.chart);
  reset();
  return panel;
}

function renderDoubleSlit(reveal) {
  const panel = labPanel("Schirmprofil verändern", "Wähle, welche Spalte geöffnet sind und ob ein Detektor die Wege unterscheidet. Die markierte Säule steht in der Schirmmitte.");
  const setup = labSelect("spalt-modus", "Wegpräparation", [["single", "Nur ein Spalt offen"], ["both", "Zwei Spalte ohne Weginformation"], ["marked", "Zwei Spalte mit eindeutiger Weginformation"]], "both");
  const phase = labRange("spalt-phase", "Relative Phase in der Mitte (Grad)", 0, 360, 45, 0);
  const profile = element("div", { className: "quantum-screen" });
  profile.setAttribute("aria-hidden", "true");
  const status = labStatus();
  const output = labReadout();
  const show = () => {
    const angle = phase.input.valueAsNumber * Math.PI / 180;
    const mode = setup.input.value;
    const light = (position) => mode === "single" ? 0.25 : mode === "marked" ? 0.5 : (1 + Math.cos(angle + position * Math.PI / 4)) / 2;
    profile.replaceChildren(...Array.from({ length: 25 }, (_, i) => {
      const bar = element("span", { className: i === 12 ? "quantum-screen-center" : "" });
      bar.style.setProperty("--intensity", `${100 * light(i - 12)}%`);
      return bar;
    }));
    output.show([-4, 0, 4].map((point) => [point === 0 ? "Mitte" : point < 0 ? "Links" : "Rechts", labPercent.format(light(point))]));
    qcStatus(status, mode === "both" ? `Streifenprofil. In der Mitte: ${labPercent.format(light(0))} der maximalen Intensität.`
      : `Gleichmäßiges Profil im vereinfachten Modell. Relative Intensität: ${labPercent.format(light(0))}.`);
    reveal();
  };
  panel.append(setup.row, phase.row, element("div", { className: "actions" }, learningButton("Schirmprofil berechnen", show)), profile, status, output.readout);
  return panel;
}

function renderBellMeasurements(reveal) {
  const panel = labPanel("Gemeinsame und einzelne Ausgaben", "Wähle eine Präparation und eine Messbasis pro Person. Vergleiche gemeinsame Ausgaben, dann betrachte nur Bobs Werte.");
  const type = labSelect("bell-quelle", "Präparation", [["plus", "Bell-Zustand |Φ+⟩"], ["minus", "Bell-Zustand |Φ−⟩"], ["mix", "Klassische Mischung aus 00 und 11"]]);
  const bases = [["Z", "Z (0 und 1)"], ["X", "X (+ und −)"]];
  const a = labSelect("bell-alice", "Alices Basis", bases);
  const b = labSelect("bell-bob", "Bobs Basis", bases);
  const output = qcChart("Gemeinsame Wahrscheinlichkeiten");
  const status = labStatus();
  const run = () => {
    const states = type.input.value === "mix" ? [qcBasis(0, 4), qcBasis(3, 4)]
      : [[[Math.SQRT1_2, 0], [0, 0], [0, 0], [type.input.value === "plus" ? Math.SQRT1_2 : -Math.SQRT1_2, 0]]];
    const probabilities = [0, 0, 0, 0];
    for (let state of states) {
      if (a.input.value === "X") state = qcGate(state, "H", 0);
      if (b.input.value === "X") state = qcGate(state, "H", 1);
      state.forEach((amp, i) => { probabilities[i] += qcProbability(amp) / states.length; });
    }
    const label = (basis, i) => (basis === "X" ? ["+", "−"] : ["0", "1"])[i];
    const labels = probabilities.map((_, i) => `${label(a.input.value, i >> 1)}${label(b.input.value, i & 1)}`);
    output.show(probabilities, { labels });
    qcStatus(status, `Ausgaben ${labels[0]} und ${labels[3]} zusammen: ${labPercent.format(probabilities[0] + probabilities[3])}. Bob allein: ${labPercent.format(probabilities[0] + probabilities[2])} für ${label(b.input.value, 0)}.`);
    reveal();
  };
  panel.append(type.row, a.row, b.row, element("div", { className: "actions" }, learningButton("Messbasen vergleichen", run)), status, output.chart);
  return panel;
}

function renderQubitTeleportation(reveal) {
  const panel = labPanel("Bobs Korrektur prüfen", "Wähle einen Eingang und einen der vier gleich wahrscheinlichen Messzweige. Prüfe die Korrektur zunächst für einen Zustand mit komplexer Amplitude.");
  const input = qcStateSelect("teleport-eingang", "Alices Eingang", "phase", ["phase", "zero", "plus"]);
  const message = labSelect("teleport-bits", "Alices Messzweig (Z-Bit, X-Bit)", [[0, "00"], [1, "01"], [2, "10"], [3, "11"]], 3);
  const correction = labSelect("teleport-korrektur", "Bobs Korrektur", [[0, "Keine"], [1, "X"], [2, "Z"], [3, "Erst X, dann Z"]]);
  const chart = qcChart("Bobs Amplituden und Z-Wahrscheinlichkeiten");
  const status = labStatus();
  let original;
  let bob;
  const measure = () => {
    original = qcStates.get(input.input.value)[1];
    const bell = qcControlledX(qcGate(qcBasis(0, 4), "H", 0), [0], 1);
    const combined = qcTensor(original, bell);
    const measured = qcGate(qcControlledX(combined, [0], 1), "H", 0);
    const bits = Number(message.input.value);
    const { state, probability } = qcProject(measured, (index) => (index >> 1) === bits);
    bob = state.slice(bits * 2, bits * 2 + 2);
    chart.state(bob);
    apply.disabled = false;
    qcStatus(status, `Nachricht ${qcLabels(4)[bits]} (${labPercent.format(probability)} vorhergesagt). Bobs Zustand vor der Korrektur ist unten zu sehen.`);
  };
  const apply = learningButton("Korrektur ausprobieren", () => {
    const rule = Number(correction.input.value);
    let output = bob;
    if (rule & 1) output = qcGate(output, "X");
    if (rule & 2) output = qcGate(output, "Z");
    chart.state(output);
    const fidelity = qcFidelity(original, output);
    const matches = rule === Number(message.input.value);
    qcStatus(status, matches ? "Die Regel stimmt. Bobs Zustand entspricht dem Eingang bis auf globale Phase."
      : `Die Regel passt nicht zu beiden Messbits. Zustandsübereinstimmung in diesem Versuch: ${labPercent.format(fidelity)}. Lies das rechte Bit für X und das linke für Z.`, matches ? "success" : "retry");
    reveal();
  });
  const reset = () => {
    apply.disabled = true;
    chart.chart.replaceChildren();
    qcStatus(status, "Zeige zuerst Alices gewählten Messzweig an.");
  };
  for (const field of [input.input, message.input]) field.addEventListener("change", reset);
  panel.append(input.row, message.row, element("div", { className: "actions" }, learningButton("Messzweig anzeigen", measure)),
    correction.row, element("div", { className: "actions" }, apply), status, chart.chart);
  reset();
  return panel;
}

function renderNoCloning(reveal) {
  const panel = labPanel("CNOT mit einem echten Produkt vergleichen", "Wähle einen Eingang. Vergleiche die CNOT-Ausgabe mit dem Produkt aus zwei unabhängig präparierten Qubits im Eingangszustand.");
  const input = qcStateSelect("kopierer-eingang", "Eingang", "zero", ["zero", "one", "plus", "phase"]);
  const actual = qcChart("CNOT-Ausgabe");
  const expected = qcChart("Produkt aus zwei unabhängigen Präparationen");
  const status = labStatus();
  const run = () => {
    const state = qcStates.get(input.input.value)[1];
    const output = qcControlledX(qcTensor(state, qcBasis(0, 2)), [0], 1);
    const product = qcTensor(state, state);
    actual.state(output);
    expected.state(product);
    qcStatus(status, qcFidelity(product, output) > 1 - 1e-12 ? "Für diesen Basiszustand stimmen CNOT-Ausgabe und Produkt überein. Probiere danach eine Superposition."
      : "CNOT erzeugt hier einen anderen Zustand als zwei unabhängige Präparationen. Vergleiche die Amplituden von 01 und 10.");
    reveal();
  };
  panel.append(input.row, element("div", { className: "actions" }, learningButton("CNOT und zwei Kopien vergleichen", run)), status,
    element("div", { className: "lab-controls" },
      element("section", {}, element("h4", { textContent: "Tatsächliche CNOT-Ausgabe" }), actual.chart),
      element("section", {}, element("h4", { textContent: "Produkt zweier Präparationen" }), expected.chart)));
  return panel;
}

function renderBb84(reveal) {
  const panel = labPanel("BB84-Runden simulieren", "Alice und Bob wählen ihre Basen für jede Runde zufällig. Vergleiche die bei gleicher Basis behaltenen Runden mit einer zufälligen öffentlichen Stichprobe daraus.");
  const method = labSelect("bb84-modus", "Kanalmodell", [["ideal", "Ideale Übertragung"], ["probe", "Zwischenmessung in zufälliger Basis"]]);
  const count = labSelect("bb84-anzahl", "Gesendete Qubits", [[24, "24"], [256, "256"], [1024, "1024"]], 256);
  const summary = labReadout();
  const rounds = labReadout();
  const status = labStatus();
  const coin = () => Number(Math.random() < 0.5);
  const read = (bit, preparedBasis, measuredBasis) => preparedBasis === measuredBasis ? bit : coin();
  const run = () => {
    const interrupted = method.input.value === "probe";
    const sent = Number(count.input.value);
    const series = Array.from({ length: sent }, () => {
      const aliceBasis = coin();
      const bobBasis = coin();
      const aliceBit = coin();
      const channelBasis = interrupted ? coin() : aliceBasis;
      const channelBit = read(aliceBit, aliceBasis, channelBasis);
      return { aliceBasis, bobBasis, aliceBit, bobBit: read(channelBit, channelBasis, bobBasis) };
    });
    const sifted = series.filter(({ aliceBasis, bobBasis }) => aliceBasis === bobBasis);
    const sampleSize = Math.ceil(sifted.length / 4);
    const sample = sifted.map((round) => ({ round, rank: Math.random() })).sort((a, b) => a.rank - b.rank)
      .slice(0, sampleSize).map(({ round }) => round);
    const errors = sample.filter(({ aliceBit, bobBit }) => aliceBit !== bobBit).length;
    summary.show([
      ["Basisabgleich", `${sifted.length} gleiche Basen von ${sent} Runden`],
      ["Öffentlicher Test", `${errors} Abweichungen bei ${sampleSize} Testbits`],
      ["Fehleranteil der Stichprobe", sampleSize ? labPercent.format(errors / sampleSize) : "Keine Testbits"],
      ["Verbleibende Bits vor weiterer Verarbeitung", String(sifted.length - sampleSize)],
    ]);
    rounds.show(series.slice(0, 5).map(({ aliceBasis, bobBasis, aliceBit, bobBit }, index) => [
      `Runde ${index + 1}`,
      `Alice ${aliceBasis ? "X" : "Z"}/${aliceBit} · Bob ${bobBasis ? "X" : "Z"}/${bobBit} · ${aliceBasis === bobBasis ? "gleiche Basis" : "verworfen"}`,
    ]));
    qcStatus(status, interrupted ? "Im Störmodell werden bei übereinstimmender Basis im Mittel 25 % Abweichungen erwartet. Einzelne Stichproben schwanken."
      : "Im idealen Modell stimmen Bits aus gleicher Basis überein. Öffentliche Testbits werden aus dem verbleibenden Material entfernt.");
    reveal();
  };
  panel.append(method.row, count.row, element("div", { className: "actions" }, learningButton("Neue Serie simulieren", run)), status, summary.readout,
    element("h4", { textContent: "Erste fünf Runden der Simulation" }), rounds.readout);
  return panel;
}

function qcSample(probabilities) {
  let draw = Math.random();
  for (const [index, p] of probabilities.entries()) {
    draw -= p;
    if (draw < 0) return index;
  }
  return probabilities.findLastIndex((probability) => probability > 0);
}

function renderGrover(reveal) {
  const panel = labPanel("Grover-Schritte vergleichen", "Das Orakel markiert genau einen Kandidaten. Führe erst das Orakel, dann die Diffusion aus. Du kannst nach jedem Schritt eine Messung aus der aktuellen Verteilung ziehen.");
  const size = labSelect("grover-groesse", "Kandidaten", [[4, "4"], [8, "8"]]);
  const target = labSelect("grover-treffer", "Vom Orakel markierter Kandidat", []);
  const chart = qcChart("Kandidaten: Amplitude und Messwahrscheinlichkeit");
  const status = labStatus();
  let amplitudes;
  let iterations;
  const show = (note) => {
    chart.state(amplitudes.map((amp) => [amp, 0]));
    const chance = amplitudes[Number(target.input.value)] ** 2;
    qcStatus(status, `${note} Trefferchance: ${labPercent.format(chance)}. Vollständige Iterationen: ${iterations}.`);
  };
  const mark = learningButton("Phasenorakel ausführen", () => {
    const i = Number(target.input.value);
    amplitudes[i] = -amplitudes[i];
    show("Markiertes Vorzeichen umgedreht.");
    mark.disabled = true;
    diffuse.disabled = false;
    diffuse.focus();
  });
  const diffuse = learningButton("Diffusion ausführen", () => {
    const mean = amplitudes.reduce((sum, amp) => sum + amp, 0) / amplitudes.length;
    amplitudes = amplitudes.map((amp) => 2 * mean - amp);
    iterations++;
    show(`Spiegelung am Mittelwert ${qcAmplitudeLabel([mean, 0])}.`);
    diffuse.disabled = true;
    mark.disabled = false;
    mark.focus();
    reveal();
  });
  const sample = learningButton("Messwert ziehen", () => {
    const measured = qcSample(amplitudes.map((amp) => amp ** 2));
    show(`Messwert ${qcLabels(amplitudes.length)[measured]}, ${measured === Number(target.input.value) ? "markierter Treffer" : "kein Treffer"}.`);
  }, true);
  const reset = () => {
    const length = Number(size.input.value);
    amplitudes = Array(length).fill(1 / Math.sqrt(length));
    iterations = 0;
    mark.disabled = false;
    diffuse.disabled = true;
    show("Gleichverteilung vorbereitet.");
  };
  const resize = () => {
    target.input.replaceChildren(...qcLabels(Number(size.input.value)).map((label, i) => element("option", { value: String(i), textContent: label })));
    target.input.value = String(target.input.options.length - 1);
    reset();
  };
  size.input.addEventListener("change", resize);
  target.input.addEventListener("change", reset);
  panel.append(size.row, target.row, element("div", { className: "actions" }, mark, diffuse, sample,
    learningButton("Neu vorbereiten", reset, true)), status, chart.chart);
  resize();
  return panel;
}

function renderBitFlipCode(reveal) {
  const panel = labPanel("Fehler in einer Drei-Qubit-Schaltung", "Wähle die Eingabe und einen Fehler. Starte mit einem einzelnen X. Vergleiche danach mit zwei X-Fehlern oder einem Z-Fehler.");
  const input = qcStateSelect("code-eingang", "Logischer Eingang", "phase");
  const errors = new Map([["none", ["Kein Fehler", []]], ["first", ["X am ersten Qubit", [["X", 0]]]], ["second", ["X am zweiten Qubit", [["X", 1]]]],
    ["third", ["X am dritten Qubit", [["X", 2]]]], ["double", ["X am zweiten und dritten Qubit", [["X", 1], ["X", 2]]]], ["phase", ["Z am ersten Qubit", [["Z", 0]]]]]);
  const fault = labSelect("code-fehler", "Fehler nach der Kodierung", Array.from(errors, ([key, [label]]) => [key, label]), "first");
  const chart = qcChart("Aktuelle Amplituden und Z-Wahrscheinlichkeiten");
  const status = labStatus();
  let inputState;
  let state;
  let stage;
  const labels = ["Mit zwei CNOTs kodieren", "Fehler anwenden", "Syndrom sichtbar machen", "Toffoli-Korrektur anwenden"];
  const cnotPair = (register) => qcControlledX(qcControlledX(register, [0], 1), [0], 2);
  const next = learningButton(labels[0], () => {
    if (stage === 0) {
      state = cnotPair(qcTensor(inputState, qcBasis(0, 4)));
      chart.state(state);
      qcStatus(status, "Kodiert. Vergleiche die Amplituden von 000 und 111 mit dem Eingangsqubit.");
    } else if (stage === 1) {
      for (const [gate, qubit] of errors.get(fault.input.value)[1]) state = qcGate(state, gate, qubit);
      chart.state(state);
      qcStatus(status, `${errors.get(fault.input.value)[0]}. Führe die beiden CNOTs für das Syndrom aus.`);
    } else if (stage === 2) {
      state = cnotPair(state);
      const syndrome = state.findIndex((amp) => qcProbability(amp) > 1e-12) & 3;
      chart.state(state);
      qcStatus(status, `Syndrom der beiden Hilfsqubits: ${qcLabels(4)[syndrome]}. Die linke Stelle trägt die logischen Amplituden.`);
    } else {
      state = qcControlledX(state, [1, 2], 0);
      const syndrome = state.findIndex((amp) => qcProbability(amp) > 1e-12) & 3;
      const logical = [state[syndrome], state[4 + syndrome]];
      const match = qcFidelity(inputState, logical);
      chart.state(logical);
      qcStatus(status, match > 1 - 1e-12 ? `Syndrom ${qcLabels(4)[syndrome]}. Der logische Zustand stimmt für diese Eingabe wieder überein.`
        : `Syndrom ${qcLabels(4)[syndrome]}. Logische Zustandsübereinstimmung: ${labPercent.format(match)}. Der Code korrigiert diesen Fehler nicht.`, match > 1 - 1e-12 ? "success" : "retry");
      reveal();
    }
    stage++;
    next.textContent = labels[stage] ?? "Dekodierung abgeschlossen";
    if (stage === labels.length) {
      next.disabled = true;
      restart.focus();
    }
  });
  const reset = () => {
    inputState = qcStates.get(input.input.value)[1];
    stage = 0;
    next.disabled = false;
    next.textContent = labels[0];
    chart.state(inputState);
    qcStatus(status, "Bereit zur Kodierung.");
  };
  const restart = learningButton("Neu vorbereiten", reset, true);
  for (const field of [input.input, fault.input]) field.addEventListener("change", reset);
  panel.append(input.row, fault.row, element("div", { className: "actions" }, next, restart), status, chart.chart);
  reset();
  return panel;
}

function renderQuantumShots(reveal) {
  const panel = labPanel("Eine Zwei-Qubit-Schaltung zusammenstellen", "Deine Schaltung startet in |00⟩. Vergleiche die ideale Vorhersage mit den gemessenen Häufigkeiten. Auslesefehler stammen aus einem vereinfachten lokalen Modell.");
  const gates = [["H", "H auf dem ersten Qubit"], ["CNOT", "CNOT vom ersten zum zweiten Qubit"], ["I", "Kein Gatter"]];
  const first = labSelect("shots-erstes-gatter", "Erster Schritt", gates, "H");
  const second = labSelect("shots-zweites-gatter", "Zweiter Schritt", gates, "CNOT");
  const shots = labSelect("shots-anzahl", "Wiederholungen (Shots)", [[32, "32"], [256, "256"], [1024, "1024"]]);
  const readError = labRange("shots-fehler", "Auslesefehler pro Bit (in Prozent)", 0, 20, 5, 0);
  const output = qcChart("Anzahl und Anteil der gelesenen Ergebnisse");
  const status = labStatus();
  const apply = (state, gate) => gate === "CNOT" ? qcControlledX(state, [0], 1) : gate === "H" ? qcGate(state, "H", 0) : state;
  const run = () => {
    const ideal = [first.input.value, second.input.value].reduce(apply, qcBasis(0, 4)).map(qcProbability);
    const repeats = Number(shots.input.value);
    const p = readError.input.valueAsNumber / 100;
    const counts = [0, 0, 0, 0];
    for (let i = 0; i < repeats; i++) {
      const outcome = qcSample(ideal) ^ (Math.random() < p ? 2 : 0) ^ (Math.random() < p ? 1 : 0);
      counts[outcome]++;
    }
    output.show(counts.map((count) => count / repeats), { counts });
    const idealText = qcLabels(4).map((label, i) => `${label} mit ${labPercent.format(ideal[i])}`).join(", ");
    const changedParity = 2 * p * (1 - p);
    const unequal = ideal[1] + ideal[2];
    const expected = unequal * (1 - changedParity) + (1 - unequal) * changedParity;
    qcStatus(status, `Ideale Verteilung: ${idealText}. Beobachtet: ${counts[1] + counts[2]} ungleiche Ausgaben. Im aktuellen Modell liegt der Erwartungswert dafür bei ${labPercent.format(expected)}.`);
    reveal();
  };
  panel.append(first.row, second.row, shots.row, readError.row,
    element("div", { className: "actions" }, learningButton("Messserie starten", run)), status, output.chart);
  return panel;
}

const quantenLabore = new Map([
  ["qubit-zustand", renderQubitState],
  ["qubit-gatter", renderQubitGates],
  ["qubit-register", renderQubitRegister],
  ["deutsch-orakel", renderDeutschOracle],
  ["doppelspalt-bild", renderDoubleSlit],
  ["bell-messungen", renderBellMeasurements],
  ["qubit-teleportation", renderQubitTeleportation],
  ["qubit-kopie", renderNoCloning],
  ["bb84-basen", renderBb84],
  ["grover-suche", renderGrover],
  ["bitflip-code", renderBitFlipCode],
  ["quanten-shots", renderQuantumShots],
]);
