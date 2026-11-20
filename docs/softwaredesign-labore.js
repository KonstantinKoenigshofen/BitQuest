"use strict";

function renderRingExperiment(reveal) {
  const panel = labPanel("Eine Warteschlange, zwei Ansichten",
    "Wähle zuerst deine Vermutung und sieh das nächste Ticket an. Rufe danach eine Person auf und versuche, Ticket C einzureihen.");
  const guess = labSelect("ring-first", "Wer kommt zuerst dran?", [["", "Vermutung wählen"], ["A", "Ticket A"], ["B", "Ticket B"]]);
  const place = labSelect("ring-place", "Auf welchem Platz landet das nächste Ticket?",
    [["", "Platz wählen"], ...[0, 1, 2, 3].map((number) => [number, `Platz ${number}`])]);
  const queue = element("ol", { className: "ring-queue" });
  queue.setAttribute("aria-label", "Warteschlange am Schalter");
  const ring = element("ol", { className: "ring-slots" });
  ring.setAttribute("aria-label", "Nummerierte Speicherplätze im Ring");
  const pointer = element("span", { className: "ring-pointer", textContent: "↑" });
  pointer.setAttribute("aria-hidden", "true");
  const slots = [0, 1, 2, 3].map((index) => {
    const slot = element("li", { className: `ring-slot slot-${index}` });
    ring.append(slot);
    return slot;
  });
  const state = labStatus();
  const feedback = labStatus();
  feedback.hidden = true;
  let buffer;
  let start;
  let count;
  let nextCode;
  let highlighted;
  let seen;
  let called;
  const ordered = () => Array.from({ length: count }, (_, offset) => buffer[(start + offset) % buffer.length]);
  const report = (text, outcome = "") => {
    feedback.hidden = false;
    feedback.dataset.result = outcome;
    feedback.textContent = text;
  };
  const update = (message) => {
    const tickets = ordered();
    queue.replaceChildren(...tickets.map((ticket) => element("li", {
      className: ticket === highlighted ? "ring-highlight" : "", textContent: `Ticket ${ticket}`,
    })));
    if (!tickets.length) queue.append(element("li", { textContent: "Niemand wartet" }));
    for (const [index, slot] of slots.entries()) {
      const ticket = buffer[index];
      slot.classList.toggle("ring-highlight", Boolean(ticket && ticket === highlighted));
      slot.replaceChildren(element("span", { textContent: `Platz ${index}` }),
        element("strong", { textContent: ticket ? `Ticket ${ticket}` : "frei" }),
        ...(start === index ? [element("span", { className: "ring-start-label", textContent: "Start" })] : []));
    }
    ring.dataset.start = start;
    state.textContent = `${message} Start: Platz ${start}. Anzahl wartender Tickets: ${count}.`;
    call.disabled = !seen || !count;
    peek.disabled = !count;
    enqueue.disabled = !called || count === buffer.length;
    place.input.disabled = enqueue.disabled;
    guess.input.disabled = called;
  };
  const peek = learningButton("Nächstes Ticket ansehen", () => {
    if (!called && !guess.input.value) {
      report("Wähle zuerst, wer deiner Meinung nach vorne steht.", "retry");
      guess.input.focus();
      return;
    }
    highlighted = buffer[start];
    seen = true;
    update(`Ticket ${highlighted} leuchtet in beiden Ansichten auf. Beim Ansehen bleibt es in der Schlange.`);
    if (!called) {
      const correct = guess.input.value === highlighted;
      report(`Du hast Ticket ${guess.input.value} gewählt. Der Start zeigt auf Platz ${start}, dort liegt Ticket ${highlighted}. ${correct
        ? "Deine Vermutung passt. Rufe die Person jetzt auf."
        : "Die Nummern beschreiben Speicherplätze. Schau auf den Startpfeil und probiere es erneut."}`, correct ? "success" : "retry");
    }
  });
  const call = learningButton("Person aufrufen", () => {
    const ticket = buffer[start];
    const previous = start;
    buffer[start] = null;
    start = (start + 1) % buffer.length;
    count--;
    called = true;
    highlighted = null;
    feedback.hidden = true;
    update(`Ticket ${ticket} verlässt die Warteschlange. Der Start wandert von ${previous} auf ${start}.`);
    if (!count) place.input.focus();
  });
  const enqueue = learningButton("Ticket einreihen", () => {
    if (!place.input.value) {
      report("Wähle zuerst einen Speicherplatz für das nächste Ticket.", "retry");
      place.input.focus();
      return;
    }
    const index = (start + count) % buffer.length;
    const previousCount = count;
    const ticket = String.fromCharCode(nextCode++);
    buffer[index] = ticket;
    count++;
    highlighted = ticket;
    update(`Ticket ${ticket} steht jetzt hinten am Schalter und liegt auf Platz ${index}.`);
    const correct = Number(place.input.value) === index;
    report(`Du hast Platz ${place.input.value} gewählt. Vom Start ${start} zählst du ${previousCount} bereits belegte Plätze weiter und landest auf ${index}. ${correct
      ? "Deine Vermutung passt."
      : "Zähle beim nächsten Versuch ab dem Start so viele Schritte, wie Tickets bereits warten. Nach Platz 3 geht es mit Platz 0 weiter."}`, correct ? "success" : "retry");
    place.input.value = "";
    if (enqueue.disabled) peek.focus();
    reveal();
  });
  const reset = () => {
    buffer = ["B", null, null, "A"];
    start = 3;
    count = 2;
    nextCode = 67;
    highlighted = null;
    seen = called = false;
    guess.input.value = place.input.value = "";
    feedback.hidden = true;
    update("Am Schalter warten zwei Personen.");
  };
  const views = element("div", { className: "experiment-split" },
    element("section", { className: "experiment-surface" }, element("h4", { textContent: "Am Schalter" }), queue),
    element("section", { className: "experiment-surface" }, element("h4", { textContent: "Im Speicher" }),
      element("div", { className: "ring-visual" }, ring, pointer)));
  panel.append(views, state, guess.row, element("div", { className: "actions" }, peek, call), place.row,
    element("div", { className: "actions" }, enqueue, learningButton("Neu starten", () => { reset(); guess.input.focus(); }, true)), feedback);
  reset();
  return panel;
}

const discountCurrency = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

function parsePurchaseCents(input) {
  const match = input.trim().match(/^(\d{1,7})(?:[,.](\d{1,2}))?$/u);
  return match ? Number(match[1]) * 100 + Number((match[2] ?? "").padEnd(2, "0")) : null;
}

function registerPrice(cents, qualifies) {
  return qualifies ? Math.round(cents * 9 / 10) : cents;
}

function renderDiscountExperiment(reveal) {
  const panel = labPanel("Zwei Kassen mit Testkäufen vergleichen",
    "Die Geschäftsregel lautet „Rabatt ab 100 Euro“. Tippe einen Betrag in Euro ein. Jede Kasse berechnet ihren Endpreis für denselben Warenkorb.");
  const entry = element("form", { className: "purchase-form", noValidate: true });
  const amount = element("input", { type: "text", inputMode: "decimal", id: "purchase-amount", className: "lab-text-input", maxLength: 12 });
  const submit = element("button", { className: "button", type: "submit", textContent: "Testkauf ausführen" });
  const oldPrice = element("p", { textContent: "Noch kein Testkauf" });
  const newPrice = element("p", { textContent: "Noch kein Testkauf" });
  const status = labStatus();
  status.hidden = true;
  const hint = labStatus();
  hint.hidden = true;
  const solution = element("p", { className: "purchase-solution", hidden: true,
    textContent: "Die alte Kasse prüft „mindestens 100 Euro“. Die neue prüft „mehr als 100 Euro“. Beide behandeln Beträge darunter und darüber gleich. Genau 100,00 Euro erfüllen nur die erste Bedingung." });
  const log = element("div");
  const attempts = [];
  const hints = [
    "Überlege, bei welchem Betrag sich laut Geschäftsregel das Ergebnis ändert.",
    "Teste in Ein-Cent-Schritten dicht um die Schwelle. Hast du die Grenze selbst schon geprüft?",
    "Probiere genau 100,00 Euro. Die Formulierung „ab“ schließt diesen Betrag ein.",
  ];
  let hintIndex = 0;
  const hintButton = learningButton("Hinweis holen", () => {
    hint.hidden = false;
    hint.textContent = hints[hintIndex++];
    if (hintIndex === hints.length) {
      amount.focus();
      hintButton.disabled = true;
    } else hintButton.textContent = "Weiteren Hinweis holen";
  }, true);
  const test = element("section", { className: "digit-lab-step", hidden: true }, element("h4", { textContent: "Formuliere deinen Regressionstest" }));
  const testAmount = element("input", { type: "text", inputMode: "decimal", id: "regression-amount", className: "lab-text-input", maxLength: 12 });
  const expected = labSelect("regression-expected", "Welches Verhalten muss gelten?", [
    ["", "Erwartung wählen"], ["discount", "10 Prozent Rabatt, Endpreis 90,00 €"], ["no-discount", "Kein Rabatt, Endpreis 100,00 €"],
  ]);
  const testStatus = labStatus();
  testStatus.hidden = true;
  const assess = learningButton("Regressionstest prüfen", () => {
    const cents = parsePurchaseCents(testAmount.value);
    const correct = cents === 10000 && expected.input.value === "discount";
    testStatus.hidden = false;
    testStatus.dataset.result = correct ? "success" : "retry";
    testStatus.textContent = correct
      ? "Dein Test hält fest: Bei 100,00 € gelten 10 Prozent Rabatt. Der Endpreis muss 90,00 € betragen. Die neue Kasse würde diesen Test verfehlen."
      : cents !== 10000 ? "Wähle den Betrag, bei dem deine beiden Kassen auseinanderliefen. Nur damit würde dieser Test den Umbaufehler erkennen."
      : "„Ab 100 Euro“ schließt 100,00 € ein. Prüfe, welchen Endpreis die alte Kasse für diesen Kauf berechnet hat.";
  });
  test.append(element("label", { htmlFor: testAmount.id, textContent: "Bei welchem Betrag (in Euro)?" }), testAmount, expected.row, assess, testStatus);
  entry.append(element("div", { className: "lab-control" }, element("label", { htmlFor: amount.id, textContent: "Kaufbetrag in Euro" }), amount), submit);
  entry.addEventListener("submit", (event) => {
    event.preventDefault();
    const cents = parsePurchaseCents(amount.value);
    status.hidden = false;
    if (cents === null) {
      amount.setAttribute("aria-invalid", "true");
      status.dataset.result = "retry";
      status.textContent = "Gib einen Betrag ab 0 Euro mit höchstens zwei Nachkommastellen ein, zum Beispiel 72,50.";
      amount.focus();
      return;
    }
    amount.removeAttribute("aria-invalid");
    const before = registerPrice(cents, cents >= 10000);
    const after = registerPrice(cents, cents > 10000);
    const money = (value) => discountCurrency.format(value / 100);
    const receipt = (value) => `${money(value)} · ${value === cents ? "kein Rabatt" : "10 Prozent Rabatt"}`;
    oldPrice.textContent = receipt(before);
    newPrice.textContent = receipt(after);
    attempts.push([String(attempts.length + 1), money(cents), money(before), money(after)]);
    log.replaceChildren(renderLessonExample({ title: "Deine bisherigen Testkäufe", columns: ["Versuch", "Betrag", "Alte Kasse", "Neue Kasse"], rows: attempts }));
    const found = before !== after;
    status.dataset.result = found ? "success" : "retry";
    status.textContent = found
      ? `Bei ${money(cents)} berechnet die alte Kasse ${money(before)}, die neue ${money(after)}. Mit diesem Testkauf hast du den Fehler nachgewiesen.`
      : `Bei ${money(cents)} berechnen beide Kassen ${money(before)}. Dieser Kauf zeigt keinen Unterschied. Probiere einen anderen Betrag.`;
    if (found) {
      solution.hidden = test.hidden = false;
      hint.hidden = hintButton.hidden = true;
      reveal();
    }
  });
  panel.append(entry, element("div", { className: "experiment-split checkout-split" },
    element("section", { className: "experiment-surface" }, element("h4", { textContent: "Alte Kasse" }), oldPrice),
    element("section", { className: "experiment-surface" }, element("h4", { textContent: "Neue Kasse" }), newPrice)),
    status, log, element("div", { className: "actions" }, hintButton), hint, solution, test);
  return panel;
}
