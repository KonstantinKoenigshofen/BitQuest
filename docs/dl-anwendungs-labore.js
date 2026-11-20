"use strict";

function dlPixels(label, pixels, width = 5, classes) {
  const grid = element("div", { className: "dl-pixels" });
  grid.style.setProperty("--pixel-columns", width);
  grid.setAttribute("role", "img");
  grid.setAttribute("aria-label", label);
  for (const [index, value] of pixels.entries()) {
    const cell = element("span", { className: classes?.[index] ?? "" });
    cell.style.setProperty("--ink-level", Math.max(0, Math.min(1, value)));
    grid.append(cell);
  }
  return grid;
}

function renderRecurrentLab(reveal) {
  const panel = labPanel("Zwei Messreihen mit demselben letzten Wert",
    "Live berechnete vereinfachte Zustände. Spiele eine Folge Schritt für Schritt ab. Das Basismodell schreibt den letzten Wert fort. In dieser Übung setzen wir die Tore von LSTM und GRU von Hand.");
  const series = labSelect("history-series", "Erster Messwert", [[9, "Hoch · 9"], [1, "Niedrig · 1"]]);
  const model = labSelect("history-model", "Zustandsmodell", [["rnn", "RNN"], ["lstm", "LSTM"], ["gru", "GRU"]]);
  const keep = labRange("history-keep", "Vergessenstor / Anteil des alten Zustands", 0, 1, .1, .8);
  const write = labRange("history-write", "LSTM · Eingabetor", 0, 1, .1, .4);
  const outputGate = labRange("history-output", "LSTM · Ausgabetor", 0, 1, .1, 1);
  const resetGate = labRange("history-reset", "GRU · Rücksetztor im Kandidaten", 0, 1, .1, .7);
  const guess = dlGuess("history-guess", "Welche Folge liefert am Ende die höhere Modellprognose?", [["high", "Die mit dem hohen Anfang"], ["same", "Beide gleich"], ["low", "Die mit dem niedrigen Anfang"]]);
  const output = element("div");
  const status = labStatus();
  let rows = [], cell = 0, hidden = 0, comparedCell = 0, comparedHidden = 0;
  const sequence = (first) => [first, 5, 3, 3];
  const recurrentStep = (value, last, oldCell) => {
    const input = (value - 3) / 6;
    const retention = keep.input.valueAsNumber;
    if (model.input.value === "rnn") return [0, Math.tanh(.8 * last + input)];
    if (model.input.value === "gru") return [0, retention * last + (1 - retention) * Math.tanh(input + resetGate.input.valueAsNumber * last)];
    const nextCell = retention * oldCell + write.input.valueAsNumber * Math.tanh(input);
    return [nextCell, outputGate.input.valueAsNumber * Math.tanh(nextCell)];
  };
  const reset = () => {
    rows = []; cell = hidden = comparedCell = comparedHidden = 0;
    output.replaceChildren(); status.textContent = ""; delete status.dataset.result;
    next.disabled = false;
    write.row.hidden = outputGate.row.hidden = model.input.value !== "lstm";
    keep.row.hidden = model.input.value === "rnn";
    resetGate.row.hidden = model.input.value !== "gru";
  };
  const next = learningButton("Nächsten Messwert lesen", () => {
    if (!guess.input.value) {
      status.dataset.result = "retry"; status.textContent = "Wähle zuerst eine Vermutung."; return;
    }
    const high = Number(series.input.value) === 9;
    const input = sequence(high ? 9 : 1)[rows.length];
    const otherInput = sequence(high ? 1 : 9)[rows.length];
    [cell, hidden] = recurrentStep(input, hidden, cell);
    [comparedCell, comparedHidden] = recurrentStep(otherInput, comparedHidden, comparedCell);
    rows.push([rows.length + 1, input, input, labNumber.format(cell), labNumber.format(hidden), labNumber.format(3 + 3 * hidden), labNumber.format(3 + 3 * comparedHidden)]);
    output.replaceChildren(dlTable("Zustände und Prognosen", ["Zeit", "Wert", "Naiv", "Zelle", "Zustand", "Prognose", "Andere Folge"], rows));
    status.textContent = `Wert ${input} gelesen. Die naive Prognose bleibt bei ${input}. Der aktuelle Zustand ist ${labNumber.format(hidden)}.`;
    next.disabled = rows.length === 4;
    if (next.disabled) {
      const difference = (hidden - comparedHidden) * (high ? 1 : -1);
      const result = Math.abs(difference) < 1e-8 ? "same" : difference > 0 ? "high" : "low";
      status.dataset.result = result === guess.input.value ? "success" : "retry";
      status.textContent = (result === guess.input.value ? "Deine Vermutung passt. " : "Vergleiche deine Vermutung mit den letzten beiden Prognosen. ") + (result === "same"
        ? "Die beiden Folgen enden hier mit derselben Prognose. Der ältere Unterschied wirkt in dieser Einstellung auf den sichtbaren Zustand nicht mehr."
        : `Beide naive Prognosen sind 3. ${result === "high" ? "Die Folge mit dem hohen Anfang" : "Die Folge mit dem niedrigen Anfang"} liefert die höhere Zustandsprognose. Vergleiche die letzte Zeile und ändere ein Tor.`);
      reveal();
    }
  });
  for (const control of [series, model, keep, write, outputGate, resetGate]) {
    control.input.addEventListener(control.input.type === "range" ? "input" : "change", reset);
  }
  panel.append(element("div", { className: "lab-controls" }, series.row, model.row, keep.row, write.row, outputGate.row, resetGate.row, guess.row),
    element("div", { className: "actions" }, next, learningButton("Neu starten", () => { guess.input.value = ""; reset(); }, true)), status, output);
  reset();
  return panel;
}

function renderVisionTasksLab(reveal) {
  const art = [digitSamples[1], digitSamples[4], digitSamples[6]];
  const pixels = art[0].pixels.flatMap((_, row) => art.flatMap((image, index) => [
    ...Array.from(image.pixels[row], Number), ...(index < art.length - 1 ? [0] : []),
  ]));
  const mode = labSelect("vision-task", "Ausgabe anzeigen", [["class", "Bildklassifikation"], ["box", "Objekterkennung"], ["mask", "Segmentierung"]]);
  const guess = dlGuess("vision-guess", "Welche Ausgabe markiert genau die Ziffernpixel?", [["class", "Bildklassifikation"], ["box", "Rahmen"], ["mask", "Pixelmaske"]]);
  const original = dlPixels("Dasselbe Bild enthält eine 1, eine 4 und eine 7", pixels, 17);
  const panel = dlTrial("Ein Ziffernbild mit drei möglichen Ausgaben",
    "Vorbereitete Ziffernannotation, live dargestellt. Das Originalbild bleibt gleich. Vergleiche die Ausgaben für Labels, Rahmen und Pixel.",
    [mode, guess], () => {
      if (!guess.input.value) return null;
      const kind = mode.input.value;
      const boxes = art.map((image, group) => {
        const coordinates = digitVector(image).flatMap((value, index) => value ? [[index % 5 + 6 * group, Math.floor(index / 5)]] : []);
        return { label: image.digit, left: Math.min(...coordinates.map(([x]) => x)), right: Math.max(...coordinates.map(([x]) => x)),
          top: Math.min(...coordinates.map(([, y]) => y)), bottom: Math.max(...coordinates.map(([, y]) => y)) };
      });
      const classes = pixels.map((value, index) => {
        const x = index % 17, y = Math.floor(index / 17);
        if (kind === "mask" && value) return `vision-mask-${Math.floor(x / 6)}`;
        if (kind === "box" && boxes.some((box) => x >= box.left && x <= box.right && y >= box.top && y <= box.bottom
          && (x === box.left || x === box.right || y === box.top || y === box.bottom))) return "vision-box";
        return "";
      });
      const annotations = kind === "class" ? element("p", { textContent: "Bildlabels: 1, 4, 7." })
        : kind === "box" ? dlTable("Rahmen · Zeile und Spalte beginnen bei 1", ["Ziffer", "Spalten", "Zeilen"], boxes.map((box) =>
          [box.label, `${box.left + 1}–${box.right + 1}`, `${box.top + 1}–${box.bottom + 1}`]))
        : element("p", { textContent: `Pixelmaske. ${pixels.filter(Boolean).length} Pixel gehören zu den drei Ziffern. Alle übrigen Pixel sind Hintergrund.` });
      return { nodes: [dlPixels("Gewählte Ausgabe für das Bild mit 1, 4 und 7", pixels, 17, classes), annotations],
        correct: guess.input.value === "mask",
        message: kind === "box" ? "Ein Rahmen umfasst eine rechteckige Region. Darin liegen auch Hintergrundpixel. Vergleiche mit der Pixelmaske."
          : kind === "mask" ? "Die Maske markiert nur Ziffernpixel. Vergleiche diese Ausgabe mit deiner Vermutung."
          : "Die Labels nennen die Ziffernarten im Bild. Für eine Position oder einen einzelnen Pixel brauchst du eine genauere Ausgabe." };
    }, reveal);
  panel.children[1].after(original);
  return panel;
}

function dlRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function renderImageGenerationLab(reveal, startingMode) {
  const panel = labPanel("Bildmodelle am Pixelraster vergleichen",
    "Autoencoder, VAE, GAN und Diffusion als gekennzeichnete Simulationen. Die Pixel ändern sich live; die Verfahren verwenden kleine Rechenregeln statt trainierter Bildnetze.");
  const mode = labSelect("generate-model", "Verfahren", [["ae", "Autoencoder"], ["vae", "Variational Autoencoder"], ["gan", "GAN"], ["diffusion", "Diffusion"]], startingMode);
  const seed = labRange("generate-seed", "Zufallsstart", 1, 20, 1, 4);
  const strength = labRange("generate-strength", "Engpass: Auflösung des Zwischencodes", 2, 4, 1, 2);
  const guess = dlGuess("generate-guess", "Woher kommt hier das erste Signal?", [["input", "Aus dem gewählten Originalbild"], ["noise", "Aus einem neuen Zufallsstart"]]);
  const original = digitVector(digitSamples[6]);
  const templates = [digitSamples[1], digitSamples[4], digitSamples[6]].map(digitVector);
  const output = element("div", { className: "dl-trial-output" });
  const status = labStatus();
  let pixels, step, reverse, random, target, started;
  const reset = () => {
    started = false; step = 0; reverse = false; target = null;
    pixels = [...original];
    random = dlRandom(seed.input.valueAsNumber);
    status.textContent = ""; output.replaceChildren(); delete status.dataset.result;
    strength.row.hidden = mode.input.value !== "ae";
    restartNoise.hidden = mode.input.value !== "diffusion";
    restartNoise.disabled = true;
    next.disabled = false;
    next.textContent = mode.input.value === "diffusion" ? "Einen Schritt verrauschen" : "Ausgabe berechnen";
    if (mode.input.value === "diffusion") output.append(dlPixels("Unverrauschte Ziffer 7", pixels));
    else if (mode.input.value === "ae") output.append(dlPixels("Original zur Rekonstruktion: Ziffer 7", original));
  };
  const distance = (image, template) => image.reduce((sum, value, index) => sum + (value - template[index]) ** 2, 0) / image.length;
  const closest = (image) => templates.reduce((best, template) =>
    distance(image, template) < distance(image, best) ? template : best);
  const show = (label) => output.replaceChildren(element("p", { textContent: label }), dlPixels(label, pixels));
  const next = learningButton("Ausgabe berechnen", () => {
    if (!guess.input.value && !started) {
      status.dataset.result = "retry"; status.textContent = "Wähle zuerst eine Vermutung."; return;
    }
    const kind = mode.input.value;
    if (!started) {
      const source = kind === "ae" || kind === "diffusion" ? "input" : "noise";
      status.dataset.result = guess.input.value === source ? "success" : "retry";
      started = true;
    }
    if (kind === "ae") {
      const side = strength.input.valueAsNumber;
      const code = Array.from({ length: side * side }, () => []);
      const group = (index) => Math.floor(Math.floor(index / 5) * side / 5) * side + Math.floor((index % 5) * side / 5);
      original.forEach((value, index) => code[group(index)].push(value));
      const decoded = code.map((values) => values.reduce((sum, value) => sum + value, 0) / values.length);
      pixels = original.map((_, index) => decoded[group(index)]);
      show(`Rekonstruktion aus ${side * side} Zahlen`);
      status.textContent = "Die Eingabe wurde verdichtet und danach vergrößert. Vergleiche die Ziffer mit dem Original nach einem Neustart.";
    } else if (kind === "vae") {
      const code = Math.sqrt(-2 * Math.log(Math.max(1e-8, random()))) * Math.cos(2 * Math.PI * random());
      const index = code < -.45 ? 0 : code > .45 ? 2 : 1;
      pixels = templates[index].map((value) => (value * .8 + random() * .15));
      show(`VAE-Simulation · gezogener Code ${labNumber.format(code)}`);
      status.textContent = "Der Code stammt aus einer Normalverteilung. Der vereinfachte Decoder bildet ihn auf eine Ziffernvariante ab.";
    } else if (kind === "gan") {
      if (step === 0) {
        pixels = original.map(() => random());
        target = closest(pixels);
      }
      const before = distance(pixels, target);
      pixels = pixels.map((value, index) => value * .7 + target[index] * .3);
      step++;
      show(`GAN-Simulation · Generator-Update ${step}`);
      status.textContent = `Ein Ersatz für den Diskriminator misst den Abstand zur ähnlichsten Vorlage. Der Abstand ändert sich von ${labNumber.format(before)} auf ${labNumber.format(distance(pixels, target))}. Ein echtes GAN lernt diese Bewertung aus Trainingsbeispielen.`;
    } else {
      step++;
      pixels = pixels.map((value, index) => reverse
        ? value * .63 + target[index] * .37 : value * .60 + random() * .40);
      show(reverse ? `Generierung aus neuem Rauschen · Schritt ${step} von 6` : `Vorwärtsverrauschung · Schritt ${step} von 6`);
      status.textContent = reverse ? "Der simulierte Entrauscher nähert sich schrittweise einer passenden Vorlage. Das zuvor verrauschte Bild liefert dafür keine Pixel."
        : "Das Originalsignal verliert Gewicht. Jede Runde mischt neue Zufallswerte hinein.";
      restartNoise.disabled = reverse || step < 6;
      next.disabled = step >= 6;
      if (next.disabled) (reverse ? restart : restartNoise).focus();
    }
    if (step <= 1 && !reverse) status.textContent = (status.dataset.result === "success" ? "Deine Vermutung passt. " : "Vergleiche die Quelle mit deiner Vermutung. ") + status.textContent;
    if (kind !== "diffusion" || (reverse && step === 6)) reveal();
  });
  const restartNoise = learningButton("Aus frischem Rauschen generieren", () => {
    random = dlRandom(seed.input.valueAsNumber + 2759);
    pixels = original.map(() => random());
    target = closest(pixels);
    reverse = true; step = 0;
    restartNoise.disabled = true; next.disabled = false;
    next.textContent = "Einen Generierungsschritt ausführen";
    show("Frisches Rauschen für die Generierung");
    status.textContent = "Neuer Start. Die Vorlage wird aus dem frischen Rauschen gewählt.";
    next.focus();
  }, true);
  const restart = learningButton("Neu starten", () => { guess.input.value = ""; reset(); }, true);
  mode.input.addEventListener("change", reset);
  seed.input.addEventListener("input", reset);
  strength.input.addEventListener("input", reset);
  panel.append(mode.row, seed.row, strength.row, guess.row,
    element("div", { className: "actions" }, next, restartNoise, restart), status, output);
  reset();
  return panel;
}

function renderContrastiveLab(reveal, startingMode) {
  const panel = labPanel("Paare im Merkmalsraum verschieben",
    "Live berechnete Positionsupdates in einem vereinfachten Raum, ohne trainierte Encoder. Wähle erst eine Ansicht desselben Bildes und danach einen passenden Text.");
  const mode = labSelect("pair-mode", "Art des Trainingspaars", [["image", "Bild mit Bild"], ["text", "Bild mit Text"]], startingMode);
  const pair = dlGuess("pair-choice", "Welchen Partner ordnest du der Vorlage zu?", []);
  const anchor = digitVector(digitSamples[6]);
  const related = anchor.map((value, index) => value * .70 + (index % 5 ? anchor[index - 1] * .22 : 0));
  const unrelated = digitVector(digitSamples[4]);
  const candidates = element("div", { className: "experiment-split" });
  const output = element("div", { className: "dl-trial-output" });
  const status = labStatus();
  let points;
  const positions = ["Vorlage", "Partner A", "Partner B"];
  const distance = (point) => Math.hypot(point[0] - points[0][0], point[1] - points[0][1]);
  const update = () => {
    output.replaceChildren(dlChart("Abstände zwischen Vorlage A und B", (ctx, width, height) => {
      ctx.font = "bold 15px sans-serif";
      points.forEach(([x, y], index) => {
        const px = x * width, py = y * height;
        ctx.fillStyle = ["#1b4a3b", "#235577", "#8a3e14"][index];
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2); ctx.fill();
        ctx.fillText(positions[index], Math.min(px + 10, width - 85), py - 10);
      });
    }), dlTable("Abstände zur Vorlage", ["Partner", "Abstand"], points.slice(1).map((point, index) => [positions[index + 1], labNumber.format(distance(point))])));
  };
  const reset = () => {
    points = [[.4, .65], [.78, .63], [.50, .23]];
    const images = mode.input.value === "image";
    const labels = images ? ["Ansicht A", "Ansicht B"] : ["A · Eine Ziffer mit breitem Querstrich und schrägem Bein", "B · Eine geschlossene runde Form"];
    pair.input.replaceChildren(element("option", { value: "", textContent: "Partner wählen" }),
      ...labels.map((name, index) => element("option", { value: String(index + 1), textContent: name })));
    candidates.replaceChildren(...labels.map((label, index) => element("div", { className: "experiment-surface" },
      element("p", { textContent: label }), ...(images ? [dlPixels(label, index === 0 ? related : unrelated)] : []))));
    status.textContent = ""; delete status.dataset.result;
    update();
  };
  const step = learningButton("Paar bilden und Lernschritt ausführen", () => {
    if (!pair.input.value) { status.textContent = "Wähle zuerst einen Partner."; status.dataset.result = "retry"; return; }
    const index = Number(pair.input.value);
    const other = index === 1 ? 2 : 1;
    const before = distance(points[index]);
    points[index] = points[index].map((value, axis) => value + .3 * (points[0][axis] - value));
    points[other] = points[other].map((value, axis) => Math.max(.12, Math.min(.9, value + .12 * (value - points[0][axis]))));
    update();
    status.dataset.result = index === 1 ? "success" : "retry";
    status.textContent = `Dein ausgewählter Partner rückt von ${labNumber.format(before)} auf ${labNumber.format(distance(points[index]))} heran. ${index === 1
      ? "Das Paar verbindet passende Ansichten oder Inhalte."
      : "Auch der falsche Partner rückt beim Update heran. Vergleiche seine Form oder Beschreibung mit dem Bild und versuche es erneut."}`;
    reveal();
  });
  mode.input.addEventListener("change", reset);
  panel.append(mode.row, dlPixels("Bildvorlage: eine gezeichnete Sieben", anchor), candidates, pair.row, element("div", { className: "actions" }, step, learningButton("Neu starten", reset, true)), status, output);
  reset();
  return panel;
}

function renderAgentLab(reveal) {
  const panel = labPanel("Ein Agent am Abzweig",
    "Live Q-Learning in einer kleinen Welt. Spiele selbst oder trainiere den Agenten. Beide Routen enden am Ziel. Die Tür ist kürzer, kann aber eine Strafe bringen.");
  const reward = labRange("agent-reward", "Zusatzbelohnung für die Tür", -10, 5, 1, 0);
  const guess = dlGuess("agent-guess", "Welchen ersten Schritt lernt der Agent?", [["door", "Zur Tür"], ["detour", "Zum Umweg"]]);
  const board = element("div", { className: "agent-board" });
  const status = labStatus();
  const learned = labStatus();
  const output = element("div");
  const names = { start: "Abzweig", door: "Tür", detour: "Umweg", corner: "Ecke", goal: "Ziel" };
  const routes = { start: ["door", "detour"], door: ["goal"], detour: ["corner"], corner: ["goal"], goal: [] };
  let pos = "start", total = 0;
  const gain = (destination) => -1 + (destination === "door" ? reward.input.valueAsNumber : 0) + (destination === "goal" ? 8 : 0);
  const draw = () => {
    board.replaceChildren(...["start", "door", "detour", "corner", "goal"].map((location) =>
      element("span", { className: location === pos ? "agent-pos" : "", textContent: location === pos ? `${names[location]} · du` : names[location] })));
    walkDoor.disabled = !routes[pos].includes("door");
    walkDetour.disabled = !routes[pos].includes("detour");
    walkNext.disabled = routes[pos].length !== 1;
  };
  const move = (destination) => {
    const change = gain(destination);
    const previous = names[pos];
    pos = destination; total += change;
    status.textContent = `${previous} → ${names[pos]}. Belohnung ${change}. Summe ${total}.`;
    draw();
    if (pos === "goal") resetWalk.focus();
    else walkNext.focus();
  };
  const walkDoor = learningButton("Zur Tür gehen", () => move("door"), true);
  const walkDetour = learningButton("Zum Umweg gehen", () => move("detour"), true);
  const walkNext = learningButton("Weitergehen", () => move(routes[pos][0]), true);
  const reset = () => {
    pos = "start"; total = 0; status.textContent = "Du stehst am Abzweig.";
    draw();
  };
  const resetWalk = learningButton("Neu spielen", reset, true);
  const train = learningButton("Agenten von null trainieren", () => {
    if (!guess.input.value) {
      learned.dataset.result = "retry"; learned.textContent = "Wähle zuerst eine Vermutung."; return;
    }
    const q = Object.fromEntries(Object.keys(names).map((key) => [key, routes[key].map(() => 0)]));
    for (let episode = 0; episode < 120; episode++) {
      let state = "start";
      while (state !== "goal") {
        // Alternating the two starts guarantees that each route is explored.
        const index = state === "start" ? episode % 2 : 0;
        const destination = routes[state][index];
        const future = destination === "goal" ? 0 : Math.max(...q[destination]);
        q[state][index] += .35 * (gain(destination) + .9 * future - q[state][index]);
        state = destination;
      }
    }
    const route = q.start[0] >= q.start[1] ? "door" : "detour";
    learned.dataset.result = route === guess.input.value ? "success" : "retry";
    learned.textContent = `Nach 120 Erkundungen bevorzugt der Agent ${route === "door" ? "die Tür" : "den Umweg"}. Der höhere gelernte Aktionswert gewinnt. Ändere die Türbelohnung und trainiere erneut.`;
    output.replaceChildren(dlTable("Gelernte Werte am Abzweig", ["Aktion", "Erwarteter Wert"], [["Tür", labNumber.format(q.start[0])], ["Umweg", labNumber.format(q.start[1])]]));
    reveal();
  });
  reward.input.addEventListener("input", () => {
    reset(); learned.textContent = ""; delete learned.dataset.result; output.replaceChildren();
  });
  panel.append(reward.row, board, element("div", { className: "actions" }, walkDoor, walkDetour, walkNext, resetWalk),
    status, guess.row, element("div", { className: "actions" }, train), learned, output);
  reset();
  return panel;
}

function quantizeDigitNetwork(network, bits) {
  const maxInteger = 2 ** (bits - 1) - 1;
  return Object.fromEntries(Object.entries(network).map(([name, rows]) => {
    const scale = Math.max(...rows.flat().map(Math.abs)) / maxInteger || 1;
    return [name, rows.map((row) => row.map((value) => Math.round(value / scale) * scale))];
  }));
}

function renderEfficiencyLab(reveal) {
  const bits = labSelect("weight-bits", "Bits pro Gewicht", [[2, "2 Bit"], [4, "4 Bit"], [8, "8 Bit"]]);
  const light = labRange("weight-light", "Tintenstärke beim Test", .3, 1, .1, 1);
  const guess = dlGuess("weight-guess", "Verändert sich mindestens eine Vorhersageklasse?", [["yes", "Ja"], ["no", "Nein"]]);
  let reference;
  return dlTrial("Packmaß, Messzeit und Änderungen im Ziffernnetz",
    "Live berechnet. Die Speichergröße ist rechnerisch. Zur Vorhersage werden die gerundeten Werte wieder als JavaScript-Fließkommazahlen verwendet. Die Zeit ist eine Browser-Messung, kein Vergleich optimierter Inferenz-Hardware.",
    [bits, light, guess], () => {
      if (!guess.input.value) return null;
      reference ??= trainedDigitReference();
      const width = Number(bits.input.value);
      const compressed = quantizeDigitNetwork(reference, width);
      const count = Object.values(reference).reduce((sum, rows) => sum + rows.flat().length, 0);
      const input = calibrationImages().map(({ digit, values }) => [digit, values.map((value) => value * light.input.valueAsNumber)]);
      const batches = 6;
      const benchmark = (network) => {
        input.slice(0, 20).forEach(([, pixels]) => predictDigit(network, pixels));
        let labels;
        const start = performance.now();
        for (let index = 0; index < batches; index++) labels = input.map(([, pixels]) => predictDigit(network, pixels).digit);
        return { labels, ms: (performance.now() - start) / batches };
      };
      const a = benchmark(reference), b = benchmark(compressed);
      const accuracy = (labels) => labPercent.format(labels.filter((label, index) => label === input[index][0]).length / input.length);
      const examples = a.labels.flatMap((label, index) => label !== b.labels[index] ? [[index + 1, input[index][0], label, b.labels[index]]] : []);
      const savings = 1 - (Math.ceil(count * width / 8) + 8) / (4 * count);
      const example = examples[0];
      const firstChange = example ? element("div", { className: "experiment-surface" },
        element("p", { textContent: `Bild ${example[0]} · Label ${example[1]} · Original: ${example[2]} · Gerundet: ${example[3]}` }),
        dlPixels(`Bild ${example[0]} mit geänderter Vorhersage`, input[example[0] - 1][1])) : null;
      return { nodes: [dlTable("Vergleich desselben Netzes", ["Gewichte", "Parameter", "Bytes", "ms pro Testsatz", "Treffer"], [
        ["32 Bit", count, 4 * count, labNumber.format(a.ms), accuracy(a.labels)],
        [`${width} Bit`, count, Math.ceil(count * width / 8) + 8, labNumber.format(b.ms), accuracy(b.labels)],
      ]), ...(firstChange ? [firstChange, dlTable("Bis zu zwölf geänderte Vorhersagen", ["Bild", "Label", "Original", "Gerundet"], examples.slice(0, 12))] : [])],
      correct: Boolean(examples.length) === (guess.input.value === "yes"),
      message: `Rechnerische Speicherersparnis ${labPercent.format(savings)}. ${examples.length} von ${input.length} Klassen ändern sich. Vergleiche auch eine andere Bitzahl oder Tintenstärke. Die Zeit darf zwischen Durchläufen schwanken.` };
    }, reveal);
}
