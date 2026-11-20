"use strict";

const workshopSentences = [
  "das team prüft das modell",
  "das team prüft die bilder",
  "das team prüft die daten",
  "das team trainiert das modell",
  "das team trainiert mit bildern",
  "das modell erkennt die ziffer",
  "das modell erkennt die bilder",
  "das modell lernt aus daten",
  "die gruppe prüft das modell",
  "die gruppe trainiert das modell",
  "die gruppe prüft die daten",
  "die gruppe liest die daten",
];

function trainSubwordMerges(words, limit) {
  let sequences = words.map((word) => Array.from(word));
  const merges = [];
  for (let step = 0; step < limit; step++) {
    const frequencies = new Map();
    for (const sequence of sequences) {
      for (let index = 1; index < sequence.length; index++) {
        const key = JSON.stringify([sequence[index - 1], sequence[index]]);
        frequencies.set(key, (frequencies.get(key) ?? 0) + 1);
      }
    }
    const mostFrequent = [...frequencies].sort((first, second) => second[1] - first[1])[0];
    if (!mostFrequent) break;
    const [pair, count] = mostFrequent;
    const [left, right] = JSON.parse(pair);
    merges.push({ left, right, count });
    sequences = sequences.map((sequence) => mergeTokenPair(sequence, left, right));
  }
  return merges;
}

function mergeTokenPair(sequence, left, right) {
  const tokens = [];
  for (let index = 0; index < sequence.length; index++) {
    if (sequence[index] === left && sequence[index + 1] === right) {
      tokens.push(left + right);
      index++;
    } else {
      tokens.push(sequence[index]);
    }
  }
  return tokens;
}

function renderTokenLab() {
  const panel = labPanel("Zeichen zu Teilwörtern zusammenführen",
    "Gib Text ein und ändere die Zahl der BPE-Zusammenführungen. Das Beispiel lernt seine Paarregeln aus zwölf kurzen Sätzen. Leerraum trennt hier Wörter, und die Regeln wirken nur innerhalb dieser Wörter.");
  const input = element("input", { type: "text", id: "token-text", className: "lab-text-input", maxLength: 80, value: "modell bilder modellbild" });
  const count = labRange("merge-count", "Gelernte BPE-Schritte anwenden", 0, 18, 1, 12);
  const alphabetWords = workshopSentences.flatMap((sentence) => sentence.split(" "));
  const alphabet = new Set(Array.from(alphabetWords.join("")));
  const rules = trainSubwordMerges(alphabetWords, 18);
  const tokens = element("ul", { className: "token-list" });
  tokens.setAttribute("aria-label", "Tokens und IDs");
  const ruleTable = element("div");
  const status = labStatus();
  const update = () => {
    const activeRules = rules.slice(0, count.input.valueAsNumber);
    const ids = new Map([...alphabet].sort().map((character, index) => [character, index + 1]));
    for (const { left, right } of activeRules) {
      const merged = left + right;
      if (!ids.has(merged)) ids.set(merged, ids.size + 1);
    }
    const words = input.value.toLowerCase().match(/\S+/gu) ?? [];
    const pieces = words.flatMap((word) => activeRules.reduce(
      (sequence, { left, right }) => mergeTokenPair(sequence, left, right), Array.from(word),
    ));
    tokens.replaceChildren(...pieces.map((piece) =>
      element("li", { textContent: ids.has(piece) ? `${piece} · ID ${ids.get(piece)}` : `⟨UNK⟩ · ID 0 (${piece})` }),
    ));
    status.textContent = `${pieces.length} Tokens aus ${words.length} Wörtern. Aktives Vokabular: ${ids.size + 1} Einträge mit ⟨UNK⟩.`;
    ruleTable.replaceChildren(activeRules.length ? renderLessonExample({
      title: "Letzte aktive Regeln aus dem Trainingskorpus",
      columns: ["Paar", "Neues Token", "Häufigkeit beim Lernen"],
      rows: activeRules.slice(-4).map(({ left, right, count }) => [`${left} + ${right}`, left + right, count]),
    }) : element("p", { textContent: "Bei 0 Schritten bildet jedes bekannte Zeichen ein eigenes Token." }));
  };
  input.addEventListener("input", update);
  count.input.addEventListener("input", update);
  panel.append(element("div", { className: "lab-control" }, element("label", { htmlFor: input.id, textContent: "Text tokenisieren" }), input),
    count.row, status, tokens, ruleTable);
  update();
  return panel;
}

function embeddingCosine(first, second) {
  return first.reduce((sum, value, index) => sum + value * second[index], 0) / (Math.hypot(...first) * Math.hypot(...second));
}

function renderEmbeddingLab() {
  const panel = labPanel("Token-IDs und Vektoren vergleichen",
    "Wähle zwei Tokens. Die zweidimensionalen Beispielvektoren sind von Hand festgelegt. Ein Sprachmodell lernt solche Vektoren beim Training, typischerweise mit viel mehr Dimensionen.");
  const entries = [
    ["bild", 2, [1, 0.2]],
    ["bilder", 19, [0.9, 0.3]],
    ["zug", 3, [-0.7, 0.9]],
    ["daten", 11, [0.5, 0.9]],
  ];
  const options = entries.map(([token], index) => [index, token]);
  const first = labSelect("embedding-first", "Erstes Token", options);
  const second = labSelect("embedding-second", "Zweites Token", options, "1");
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const [tokenA, idA, vectorA] = entries[Number(first.input.value)];
    const [tokenB, idB, vectorB] = entries[Number(second.input.value)];
    const format = (vector) => `[${vector.map((value) => labNumber.format(value)).join("; ")}]`;
    show([[tokenA, `ID ${idA} · Vektor ${format(vectorA)}`], [tokenB, `ID ${idB} · Vektor ${format(vectorB)}`],
      ["Abstand der IDs", String(Math.abs(idA - idB))]]);
    status.textContent = `Kosinusähnlichkeit der Vektoren: ${labNumber.format(embeddingCosine(vectorA, vectorB))}.`;
  };
  first.input.addEventListener("change", update);
  second.input.addEventListener("change", update);
  panel.append(element("div", { className: "lab-controls" }, first.row, second.row), status, readout);
  update();
  return panel;
}

function sequenceAttention(queries, keys, values, causal) {
  const scale = Math.sqrt(keys[0].length);
  return queries.map((query, position) => {
    const scores = keys.map((key, index) => causal && index > position
      ? -Infinity
      : query.reduce((sum, value, feature) => sum + value * key[feature], 0) / scale);
    const { probabilities: weights } = labSoftmax(scores);
    const output = values[0].map((_, feature) => weights.reduce((sum, weight, index) => sum + weight * values[index][feature], 0));
    return { scores, weights, output };
  });
}

const attentionLabWords = ["das", "team", "prüft", "bilder"];
const attentionLabStrengths = [0.5, 1.5, 1, 0.5];
const attentionLabKeys = [[0, 1], [1, 0], [-0.5, 0.5], [1.5, -0.5]];
const attentionLabValues = [[0, 1], [1, 0], [1, 1], [2, 0]];

function attentionLabRows(selected, strength, causal) {
  const queries = [[0.5, 1], [1.5, 0.5], [1, 1], [0.5, -1]];
  queries[selected][0] = strength;
  return { queries, rows: sequenceAttention(queries, attentionLabKeys, attentionLabValues, causal) };
}

function renderAttentionLab(initialPosition = 1) {
  const panel = labPanel("Attention-Gewichte und Kontextvektor berechnen",
    "Pro Position sind Query, Key und Value vorgegeben. Ändere die erste Query-Komponente der ausgewählten Position. Mit der kausalen Maske erhält jede zukünftige Position Gewicht 0.");
  const words = attentionLabWords;
  const position = labSelect("attention-position", "Query-Position", words.map((word, index) => [index, `${index + 1} · ${word}`]), String(initialPosition));
  const strength = labRange("attention-query", "Erste Query-Komponente", -2, 2, 0.25, attentionLabStrengths[initialPosition]);
  const mask = element("input", { type: "checkbox", checked: true, id: "attention-mask" });
  const matrix = element("div");
  const details = element("div");
  const status = labStatus();
  const format = (vector) => `[${vector.map((value) => labNumber.format(value)).join("; ")}]`;
  const update = () => {
    const selected = Number(position.input.value);
    const { queries, rows } = attentionLabRows(selected, strength.input.valueAsNumber, mask.checked);
    matrix.replaceChildren(renderLessonExample({
      title: "Attention-Matrix · Zeilen sind Queries",
      columns: ["Query", ...words],
      rows: rows.map(({ weights }, index) => [words[index], ...weights.map((weight, key) => mask.checked && key > index ? "—" : labPercent.format(weight))]),
    }));
    const { scores, weights, output } = rows[selected];
    details.replaceChildren(renderLessonExample({
      title: `Rechnung für „${words[selected]}“ mit Query ${format(queries[selected])}`,
      columns: ["Key-Position", "Score", "Gewicht", "Value"],
      rows: scores.map((score, index) => [words[index], Number.isFinite(score) ? labNumber.format(score) : "Maskiert", labPercent.format(weights[index]), format(attentionLabValues[index])]),
    }));
    status.textContent = `Kontextvektor für „${words[selected]}“: ${format(output)}.`;
  };
  position.input.addEventListener("change", update);
  strength.input.addEventListener("input", update);
  mask.addEventListener("change", update);
  panel.append(position.row, strength.row, element("label", { className: "preview-toggle", htmlFor: mask.id }, mask, "Zukünftige Tokens maskieren"),
    status, matrix, details);
  update();
  return panel;
}

function renderMaskDiscovery(reveal) {
  const words = attentionLabWords;
  const panel = labPanel("Was kann das Modell zu diesem Zeitpunkt wissen?",
    "Tippe im Satz auf alle Wörter, die das Modell deiner Meinung nach sehen darf. Das markierte Wort ist die Stelle, an der es gerade vorhersagt.");
  const position = labSelect("mask-position", "Aktuelle Position", words.slice(0, -1).map((word, index) => [index, word]), "1");
  const sentence = element("div", { className: "mask-sentence" });
  sentence.setAttribute("role", "group");
  sentence.setAttribute("aria-label", "Wörter im Satz auswählen");
  const status = labStatus();
  status.hidden = true;
  const outcome = element("div", { className: "mask-outcome", hidden: true });
  const result = element("ul", { className: "mask-results" });
  const matrix = element("div");
  const calculation = element("details", { className: "self-check", hidden: true },
    element("summary", { textContent: "Vollständige Rechnung zur Vertiefung" }));
  const calculationBody = element("div");
  calculation.append(calculationBody);
  const selected = new Set();
  const wordButtons = words.map((word, index) => {
    const button = learningButton(word, () => {
      if (selected.has(index)) selected.delete(index);
      else selected.add(index);
      updateWords();
      hideResult();
    }, true);
    sentence.append(button);
    return button;
  });
  const updateWords = () => {
    for (const [index, button] of wordButtons.entries()) {
      const current = index === Number(position.input.value);
      button.classList.toggle("current-word", current);
      button.setAttribute("aria-label", current ? `${words[index]}, aktuelle Position` : words[index]);
      button.setAttribute("aria-pressed", String(selected.has(index)));
    }
  };
  const hideResult = () => {
    status.hidden = outcome.hidden = calculation.hidden = true;
    calculation.open = false;
  };
  const check = learningButton("Vermutung prüfen", () => {
    const query = Number(position.input.value);
    const correct = words.every((_, index) => selected.has(index) === (index <= query));
    result.replaceChildren(...words.map((word, index) => {
      const chosen = selected.has(index);
      const allowed = index <= query;
      let reason = allowed ? "Das Wort ist schon im Kontext." : "Das Wort liegt noch in der Zukunft.";
      if (index === query + 1 && chosen) reason = `„${word}“ ist genau das gesuchte nächste Wort. Mit deiner Auswahl hättest du dem Modell die Antwort gezeigt.`;
      else if (index === query && !chosen) reason = "An dieser Stelle steht das aktuelle Wort. Es darf bei der Vorhersage mitwirken.";
      else if (allowed && !chosen) reason = "Dieses Wort wurde schon gelesen. Das Modell darf es als Kontext verwenden.";
      return element("li", { className: chosen === allowed ? "mask-match" : "mask-miss" },
        element("strong", { textContent: word }), element("span", { textContent: `Deine Wahl: ${chosen ? "sichtbar" : "verdeckt"} · Maske: ${allowed ? "sichtbar" : "verdeckt"}` }),
        element("p", { textContent: reason }));
    }));
    const strength = attentionLabStrengths[query];
    const { rows } = attentionLabRows(query, strength, true);
    matrix.replaceChildren(renderLessonExample({
      title: `Attention-Zeile für „${words[query]}“ nach der Maskierung`,
      columns: ["Position", "Darf das Wort sehen", "Gewicht"],
      rows: words.map((word, index) => [word, index <= query ? "Ja" : "Nein", labPercent.format(rows[query].weights[index])]),
    }));
    calculationBody.replaceChildren(renderAttentionLab(query));
    outcome.hidden = status.hidden = calculation.hidden = false;
    status.dataset.result = correct ? "success" : "retry";
    status.textContent = correct
      ? "Deine Auswahl stimmt mit der Maske überein. Wähle eine andere Position und probiere es erneut."
      : "Vergleiche deine Auswahl Wort für Wort mit der Maske. Ändere deine Auswahl und prüfe erneut.";
    reveal();
  });
  position.input.addEventListener("change", () => {
    selected.clear();
    updateWords();
    hideResult();
  });
  const retry = learningButton("Auswahl zurücksetzen", () => {
    selected.clear();
    updateWords();
    hideResult();
    wordButtons[0].focus();
  }, true);
  outcome.append(element("h4", { textContent: "Die kausale Maske im Vergleich" }), result, matrix);
  panel.append(position.row, sentence, element("div", { className: "actions" }, check, retry), status, outcome, calculation);
  updateWords();
  return panel;
}

function transformerExample(words, usePositions) {
  const embeddings = { das: [1, 0, 0.5], team: [0, 1, -0.5], modell: [0.5, -1, 1], "prüft": [-1, 0.5, 0] };
  const positions = [[0, 0, 0], [0.25, -0.25, 0.5], [-0.5, 0.25, 0.1]];
  const add = (first, second) => first.map((value, index) => value + second[index]);
  const normalize = (vector) => {
    const mean = vector.reduce((sum, value) => sum + value, 0) / vector.length;
    const variance = vector.reduce((sum, value) => sum + (value - mean) ** 2, 0) / vector.length;
    return vector.map((value) => (value - mean) / Math.sqrt(variance + 1e-5));
  };
  const input = words.map((word, index) => usePositions ? add(embeddings[word], positions[index]) : embeddings[word]);
  const normalized = input.map(normalize);
  // The toy head uses identity projections so its query, key and value are inspectable.
  const context = sequenceAttention(normalized, normalized, normalized, true).map(({ output }) => output);
  const afterAttention = input.map((vector, index) => add(vector, context[index]));
  const output = afterAttention.map((vector) => {
    const hidden = labAffine([[1, -0.5, 0, 0], [0, 0.5, 1, 0]], normalize(vector)).map((value) => Math.max(0, value));
    const feedforward = labAffine([[0.5, 0, 0], [-0.5, 1, 0], [0.5, -0.5, 0]], hidden);
    return add(vector, feedforward);
  });
  return { input, context, afterAttention, output };
}

function renderTransformerLab() {
  const panel = labPanel("Einen kleinen Decoder-Block verfolgen",
    "Vergleiche zwei Folgen und schalte Positionsvektoren dazu. Der Block verwendet Layer Normalization vor Attention und Feedforward, einen Attention-Kopf und feste Beispielgewichte.");
  const phrases = [["das", "team", "prüft"], ["das", "modell", "prüft"]];
  const phrase = labSelect("transformer-phrase", "Eingabefolge", phrases.map((words, index) => [index, words.join(" ")]));
  const positions = element("input", { type: "checkbox", id: "transformer-positions", checked: true });
  const position = labSelect("transformer-token", "Position im Block", Array.from({ length: 3 }, (_, index) => [index, `Position ${index + 1}`]), "2");
  const { readout, show } = labReadout();
  const status = labStatus();
  const update = () => {
    const words = phrases[Number(phrase.input.value)];
    const index = Number(position.input.value);
    const { input, context, afterAttention, output } = transformerExample(words, positions.checked);
    const format = (vector) => `[${vector.map((value) => labNumber.format(value)).join("; ")}]`;
    show([["Blockeingabe", format(input[index])], ["Kausale Attention", format(context[index])],
      ["Nach der ersten Residualaddition", format(afterAttention[index])], ["Blockausgabe nach Feedforward und Residualaddition", format(output[index])]]);
    status.textContent = `Position ${index + 1} · „${words[index]}“. Die Attention kann ${words.slice(0, index + 1).map((word) => `„${word}“`).join(", ")} berücksichtigen.`;
  };
  for (const control of [phrase.input, position.input, positions]) control.addEventListener("change", update);
  panel.append(element("div", { className: "lab-controls" }, phrase.row, position.row),
    element("label", { className: "preview-toggle", htmlFor: positions.id }, positions, "Positionsvektoren addieren"), status, readout);
  update();
  return panel;
}

const languageStart = "⟨START⟩";
const languageEnd = "⟨ENDE⟩";
const languageVocabulary = [...new Set(workshopSentences.flatMap((sentence) => sentence.split(" "))), languageEnd];
const languageContexts = [languageStart, ...languageVocabulary.slice(0, -1)];

function languageTokenPairs(sentences) {
  return sentences.flatMap((sentence) => {
    const tokens = [languageStart, ...sentence.split(" "), languageEnd];
    return tokens.slice(0, -1).map((word, index) => [word, tokens[index + 1]]);
  });
}

const languageTrainingPairs = languageTokenPairs(workshopSentences);
const languageValidationPairs = languageTokenPairs(["das team liest die daten", "die gruppe trainiert mit bildern", "das modell prüft die bilder"]);

function createWordModel(contexts = languageContexts, vocabulary = languageVocabulary) {
  return new Map(contexts.map((token) => [token, vocabulary.map(() => 0)]));
}

function trainWordModel(model, pairs = languageTrainingPairs, vocabulary = languageVocabulary) {
  const gradients = createWordModel([...model.keys()], vocabulary);
  for (const [context, target] of pairs) {
    const { probabilities } = labSoftmax(model.get(context));
    const gradient = gradients.get(context);
    probabilities.forEach((probability, index) => {
      gradient[index] += probability - Number(vocabulary[index] === target);
    });
  }
  for (const [token, scores] of model) {
    const gradient = gradients.get(token);
    for (const [index, score] of scores.entries()) scores[index] = score - 6 * gradient[index] / pairs.length;
  }
}

function wordModelLoss(model, pairs) {
  return pairs.reduce((sum, [context, target]) =>
    sum + labSoftmax(model.get(context)).lossFor(languageVocabulary.indexOf(target)), 0) / pairs.length;
}

function renderLanguageLab() {
  const panel = labPanel("Ein kleines Next-Token-Modell trainieren",
    "Das Bigramm-Modell arbeitet mit ganzen Wörtern und sieht jeweils nur das letzte Token. Jeder Trainingsschritt passt die Scores anhand der Kreuzentropie aller Tokenpaare an. Die erzeugten Texte bleiben auf das kleine Wortvokabular beschränkt.");
  const prompts = ["das team", "die gruppe", "das modell", "die bilder"];
  const prompt = labSelect("language-prompt", "Starttext", prompts.map((phrase, index) => [index, phrase]));
  const decode = labSelect("language-decode", "Auswahlverfahren", [["greedy", "Greedy · höchster Wert"], ["sample", "Sampling · zufällig nach Gewicht"]]);
  const temperature = labRange("language-temperature", "Temperatur für Sampling", 0.25, 2, 0.25, 1);
  const sampleList = element("ol", { className: "lab-timeline lab-probabilities" });
  sampleList.setAttribute("aria-label", "Fünf wahrscheinlichste nächste Tokens");
  const output = element("p", { className: "lab-generated" });
  output.setAttribute("aria-label", "Erzeugter Text");
  const status = labStatus();
  const generationStatus = labStatus();
  const next = element("button", { className: "button", type: "button", textContent: "Nächstes Token erzeugen" });
  const restartText = element("button", { className: "button secondary", type: "button", textContent: "Text neu beginnen" });
  const button = (name, action, primary = false) => {
    const control = element("button", { className: primary ? "button" : "button secondary", type: "button", textContent: name });
    control.addEventListener("click", action);
    return control;
  };
  let model = createWordModel();
  let steps = 0;
  let generated = [];
  let continuation = 0;
  let ended = false;
  const ranked = () => {
    const scale = decode.input.value === "sample" ? temperature.input.valueAsNumber : 1;
    const { probabilities } = labSoftmax(model.get(generated.at(-1)).map((score) => score / scale));
    return languageVocabulary.map((token, index) => ({ token, probability: probabilities[index] }))
      .sort((first, second) => second.probability - first.probability);
  };
  const updateText = () => {
    next.disabled = ended || continuation >= 20;
    temperature.input.disabled = decode.input.value !== "sample";
    output.textContent = generated.join(" ");
    generationStatus.textContent = ended ? "Das Endtoken hat die Ausgabe gestoppt."
      : next.disabled ? "Die Übung stoppt nach 20 erzeugten Tokens."
      : `Aktueller Kontext: „${generated.at(-1)}“. Die Liste zeigt fünf Kandidaten aus ${languageVocabulary.length} möglichen Tokens.`;
    sampleList.hidden = next.disabled;
    sampleList.replaceChildren(...(next.disabled ? [] : ranked().slice(0, 5).map(({ token, probability }) =>
      element("li", {}, element("span", { textContent: token }), labBar(probability, 1), element("strong", { textContent: labPercent.format(probability) })),
    )));
  };
  const resetText = () => {
    generated = prompts[Number(prompt.input.value)].split(" ");
    continuation = 0;
    ended = false;
    updateText();
  };
  const updateTraining = () => {
    once.disabled = many.disabled = steps >= 200;
    status.textContent = `Updates: ${steps} · Trainingsverlust: ${labNumber.format(wordModelLoss(model, languageTrainingPairs))} · Validierungsverlust: ${labNumber.format(wordModelLoss(model, languageValidationPairs))}`;
    resetText();
  };
  const train = (count) => {
    const remaining = Math.min(count, 200 - steps);
    for (let index = 0; index < remaining; index++) trainWordModel(model);
    steps += remaining;
    updateTraining();
  };
  const once = button("Ein Update trainieren", () => train(1), true);
  const many = button("20 Updates trainieren", () => train(20));
  const reset = button("Modell zurücksetzen", () => {
    model = createWordModel();
    steps = 0;
    updateTraining();
  });
  next.addEventListener("click", () => {
    const choices = ranked();
    let token = choices[0].token;
    if (decode.input.value === "sample") {
      let threshold = Math.random();
      token = choices.find(({ probability }) => (threshold -= probability) < 0)?.token ?? choices.at(-1).token;
    }
    generated.push(token);
    continuation++;
    ended = token === languageEnd;
    updateText();
  });
  prompt.input.addEventListener("change", resetText);
  decode.input.addEventListener("change", updateText);
  temperature.input.addEventListener("input", updateText);
  restartText.addEventListener("click", resetText);
  const examples = element("details", { className: "self-check" }, element("summary", { textContent: "Die zwölf Trainingssätze ansehen" }),
    element("ul", {}, ...workshopSentences.map((sentence) => element("li", { textContent: sentence }))));
  panel.append(examples, element("div", { className: "actions" }, once, many, reset), status,
    element("div", { className: "lab-controls" }, prompt.row, decode.row), temperature.row,
    output, generationStatus, sampleList, element("div", { className: "actions" }, next, restartText));
  updateTraining();
  return panel;
}
