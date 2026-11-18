"use strict";

const params = new URLSearchParams(window.location.search);
const activeQuest = quests.find(({ id }) => id === params.get("quest"));
const activeTopic = topics.find(({ id }) => id === (activeQuest?.topic ?? params.get("thema")));
const main = document.querySelector("#inhalt");
const progressPrefix = "bitquest.quest.v1.";

function element(tag, properties = {}, ...children) {
  const node = Object.assign(document.createElement(tag), properties);
  node.append(...children);
  return node;
}

function link(text, href, className = "") {
  return element("a", { href, className, textContent: text });
}

function topicUrl(topic) {
  return `./index.html?thema=${topic.id}`;
}

function questUrl(quest, step = 1) {
  return `./index.html?quest=${quest.id}&schritt=${step}`;
}

function isComplete(quest) {
  try {
    return localStorage.getItem(progressPrefix + quest.id) === "1";
  } catch {
    return false;
  }
}

function saveCompletion(quest) {
  try {
    localStorage.setItem(progressPrefix + quest.id, "1");
    return true;
  } catch {
    return false;
  }
}

function renderNavigation() {
  const topicNav = document.querySelector("#themen-nav");
  topicNav.append(element("p", { className: "eyebrow", textContent: "Themen" }));
  for (const topic of topics) {
    const destination = link(topic.title, topicUrl(topic), "topic-link");
    if (topic === activeTopic) destination.setAttribute("aria-current", activeQuest ? "true" : "page");
    topicNav.append(destination);
  }
  topicNav.append(element("div", { className: "topic-future" }, "Deep Learning & LLMs", element("small", { textContent: "Geplant" })));

  const trail = document.querySelector("#breadcrumb");
  const items = [link("Themen", "./index.html")];
  if (activeTopic) items.push(link(activeTopic.title, topicUrl(activeTopic)));
  if (activeQuest) items.push(element("span", { textContent: activeQuest.title }));
  items.at(-1).setAttribute("aria-current", "page");
  for (const item of items) trail.append(item);
}

function hero(label, title, description, nodes = []) {
  const copy = element("div", { className: "hero-copy" },
    element("p", { className: "eyebrow", textContent: label }),
    element("h1", { textContent: title }),
    element("p", { className: "hero-description", textContent: description }),
  );
  const header = element("header", { className: "hero" }, copy);
  if (nodes.length) {
    const graph = element("div", { className: "hero-graph" });
    graph.setAttribute("aria-hidden", "true");
    for (const name of nodes) graph.append(element("span", { textContent: name }));
    header.append(graph);
  }
  return header;
}

function card(title, description, href, label, color) {
  return element("a", { className: "card", href },
    element("span", { className: `card-label ${color}`, textContent: label }),
    element("strong", { textContent: title }),
    element("span", { className: "card-description", textContent: description }),
  );
}

function renderOverview() {
  main.append(hero("BitQuest", "Informatik in Quests", "Wähle ein Thema. Jede Quest führt von kurzen Lektionen zu einer konkreten Entwurfsaufgabe.", ["Thema", "Quest", "Praxis"]));
  const grid = element("div", { className: "card-grid" });
  for (const topic of topics) {
    const count = quests.filter((quest) => quest.topic === topic.id).length;
    grid.append(card(topic.title, topic.description, topicUrl(topic), `${count} Quests`, topic.color));
  }
  main.append(element("section", { className: "catalogue" }, element("h2", { textContent: "Themen" }), grid));
}

function renderTopic(topic) {
  document.title = `${topic.title} · BitQuest`;
  main.append(hero("Thema", topic.title, topic.description, topic.nodes));
  const grid = element("div", { className: "card-grid" });
  for (const quest of quests.filter((entry) => entry.topic === topic.id)) {
    const caption = `${quest.lessons.length} Lektionen und Praxis`;
    const questCard = card(quest.title, quest.description, questUrl(quest), caption, topic.color);
    const refresh = () => { questCard.firstElementChild.textContent = isComplete(quest) ? "Abgeschlossen" : caption; };
    refresh();
    window.addEventListener("pageshow", refresh);
    grid.append(questCard);
  }
  main.append(element("section", { className: "catalogue" }, element("h2", { textContent: "Quests" }), grid));
}

function renderSteps(quest, step) {
  const list = element("ol", { className: "steps" });
  const steps = [...quest.lessons.map((lesson) => lesson.title), "Praxisbeispiel"];
  for (const [index, title] of steps.entries()) {
    const destination = index < quest.lessons.length ? index + 1 : "praxis";
    const stepLink = link(title, questUrl(quest, destination));
    if (destination === step) stepLink.setAttribute("aria-current", "step");
    list.append(element("li", {}, stepLink));
  }
  const nav = element("nav", { className: "step-nav" }, element("h2", { textContent: "In dieser Quest" }), list);
  nav.setAttribute("aria-label", "Questablauf");
  return nav;
}

function renderLessonExample(example) {
  const headings = example.columns.map((title) => element("th", { scope: "col", textContent: title }));
  const rows = example.rows.map(([label, description]) => element("tr", {},
    element("th", { scope: "row", textContent: label }),
    element("td", { textContent: description }),
  ));
  return element("table", { className: "lesson-example" },
    element("caption", { textContent: example.title }),
    element("thead", {}, element("tr", {}, ...headings)),
    element("tbody", {}, ...rows),
  );
}

function renderLesson(quest, step) {
  const lesson = quest.lessons[step - 1];
  const article = element("article", { className: "sheet" },
    element("p", { className: "eyebrow section-label", textContent: `Lektion ${step} von ${quest.lessons.length}` }),
    element("h2", { textContent: lesson.title }),
    element("p", { className: "sheet-intro", textContent: lesson.intro }),
  );
  for (const [title, body] of lesson.sections) {
    article.append(element("section", { className: "lesson-section" }, element("h3", { textContent: title }), element("p", { textContent: body })));
  }
  if (lesson.example) article.append(renderLessonExample(lesson.example));
  article.append(element("details", { className: "self-check" },
    element("summary", { textContent: lesson.check[0] }),
    element("p", { textContent: lesson.check[1] }),
  ));
  article.append(element("p", { className: "source" }, link(lesson.source[0], lesson.source[1])));
  const next = step === quest.lessons.length ? "praxis" : step + 1;
  const actions = element("div", { className: "actions" });
  if (step > 1) actions.append(link("Vorherige Lektion", questUrl(quest, step - 1), "button secondary"));
  actions.append(link(next === "praxis" ? "Zum Praxisbeispiel" : "Nächste Lektion", questUrl(quest, next), "button"));
  article.append(actions);
  return article;
}

function renderPreview(preview) {
  const hasData = element("input", { type: "checkbox", id: "datenstand-vorhanden", checked: true });
  const age = element("input", { type: "range", id: "datenalter", min: "0", max: String(preview.max), value: "2" });
  const output = element("output", { className: "preview-output" });
  output.setAttribute("for", `${hasData.id} ${age.id}`);
  const update = () => {
    const minutes = Number(age.value);
    age.disabled = !hasData.checked;
    age.setAttribute("aria-valuetext", `${minutes} Minuten`);
    if (!hasData.checked) {
      output.textContent = "Störungshinweis · Es ist kein Datenstand gespeichert";
    } else {
      output.textContent = minutes < preview.limit
        ? `Abfahrtstafel zeigt den letzten Stand · ${minutes} Min. alt`
        : `Störungshinweis · Der letzte Stand ist ${minutes} Min. alt`;
    }
  };
  hasData.addEventListener("change", update);
  age.addEventListener("input", update);
  update();
  return element("details", { className: "self-check" },
    element("summary", { textContent: "Abfahrtstafel bei einem Ausfall ausprobieren" }),
    element("label", { className: "preview-toggle" }, hasData, "Ein Fahrplandatenstand ist gespeichert"),
    element("label", { className: "preview-label", htmlFor: age.id, textContent: preview.label }), age, output,
  );
}

function renderComparison(comparison) {
  const select = element("select", { id: "praxisvariante", className: "comparison-select" },
    ...comparison.variants.map(({ label }) => element("option", { textContent: label })),
  );
  const outcomes = element("dl", { className: "comparison-details" });
  outcomes.setAttribute("aria-live", "polite");
  outcomes.setAttribute("aria-atomic", "true");
  const update = () => {
    const variant = comparison.variants[select.selectedIndex];
    outcomes.replaceChildren(...variant.details.map(([term, description]) => element("div", {},
      element("dt", { textContent: term }), element("dd", { textContent: description }),
    )));
  };
  select.addEventListener("change", update);
  update();
  return element("details", { className: "self-check" },
    element("summary", { textContent: comparison.title }),
    element("label", { className: "preview-label", htmlFor: select.id, textContent: comparison.label }), select, outcomes,
  );
}

function renderPractice(quest) {
  const { practice } = quest;
  const article = element("article", { className: "sheet" },
    element("p", { className: "eyebrow section-label", textContent: "Praxisbeispiel" }),
    element("h2", { textContent: practice.title }),
    element("p", { className: "sheet-intro case-brief", textContent: practice.intro }),
  );
  const form = element("form", { className: "exercise" });
  const result = element("p", { className: "result" });
  result.setAttribute("role", "status");
  const completedNote = element("p", { className: "completion", hidden: !isComplete(quest), textContent: "Quest bereits abgeschlossen" });
  const feedback = [];
  if (practice.preview) article.append(renderPreview(practice.preview));
  if (practice.comparison) article.append(renderComparison(practice.comparison));

  for (const [index, question] of practice.questions.entries()) {
    const name = `entscheidung-${index}`;
    const message = element("p", { className: "field-feedback", id: `${name}-hinweis` });
    const field = element("fieldset", {}, element("legend", { textContent: question.prompt }));
    field.setAttribute("aria-describedby", message.id);
    for (const [option, caption] of question.options.entries()) {
      field.append(element("label", { className: "option" },
        element("input", { type: "radio", name, value: String(option) }),
        element("span", { textContent: caption }),
      ));
    }
    feedback.push(message);
    field.addEventListener("change", () => {
      message.textContent = "";
      result.textContent = "";
    });
    field.append(message);
    form.append(field);
  }

  form.append(result, element("div", { className: "actions" },
    element("button", { className: "button", type: "submit", textContent: "Entwurf prüfen" }),
    link("Zur letzten Lektion", questUrl(quest, quest.lessons.length), "button secondary"),
  ));
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const answers = new FormData(form);
    let correctCount = 0;
    for (const [index, question] of practice.questions.entries()) {
      const value = answers.get(`entscheidung-${index}`);
      const correct = value === String(question.answer);
      if (correct) correctCount += 1;
      feedback[index].dataset.result = correct ? "success" : "retry";
      feedback[index].textContent = correct ? question.explanation : (value === null ? "Hier fehlt noch eine Auswahl." : question.clue);
    }
    const passed = correctCount === practice.questions.length;
    result.dataset.result = passed ? "success" : "retry";
    if (passed) {
      const saved = saveCompletion(quest);
      completedNote.textContent = saved ? "Quest abgeschlossen" : "Quest in dieser Sitzung abgeschlossen";
      completedNote.hidden = false;
      result.textContent = practice.summary;
    } else {
      result.textContent = `${correctCount} von ${practice.questions.length} Entscheidungen passen. Lies die Hinweise bei den übrigen Fragen.`;
    }
  });
  article.append(completedNote, form);
  return article;
}

function renderQuest(quest) {
  const selected = params.get("schritt");
  const number = Number(selected);
  const step = selected === "praxis" ? selected : (Number.isInteger(number) && number >= 1 && number <= quest.lessons.length ? number : 1);
  const title = step === "praxis" ? quest.practice.title : quest.lessons[step - 1].title;
  document.title = `${title} · BitQuest`;
  main.append(hero(activeTopic.title, quest.title, quest.description));
  main.append(element("div", { className: "quest-layout" }, renderSteps(quest, step), step === "praxis" ? renderPractice(quest) : renderLesson(quest, step)));
}

const legacyLinks = {
  "#quests": "./index.html?thema=softwaredesign",
  "#module": "./index.html?quest=module-entwerfen&schritt=praxis",
  "#vertraege": "./index.html?quest=schnittstellen-entwerfen&schritt=praxis",
  "#abhaengigkeiten": "./index.html?quest=abhaengigkeiten-austauschen&schritt=2",
  "#qualitaet": "./index.html?quest=qualitaet-entwerfen&schritt=praxis",
  "#entscheidungen": "./index.html?quest=architekturstil-auswaehlen&schritt=4",
  "#sichten": "./index.html?quest=architektur-dokumentieren&schritt=2",
};

const legacy = legacyLinks[window.location.hash];
if (!window.location.search && legacy) {
  window.location.replace(legacy);
} else {
  renderNavigation();
  if (activeQuest) renderQuest(activeQuest);
  else if (activeTopic) renderTopic(activeTopic);
  else renderOverview();
}
