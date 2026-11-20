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
  const destination = typeof step === "number" ? (quest.lessons[step - 1]?.id ?? step) : step;
  return `./index.html?quest=${quest.id}&schritt=${destination}`;
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
  main.append(hero("BitQuest", "Informatik in Quests", "Wähle ein Thema. Jede Quest führt von kurzen Lektionen zu einer konkreten Aufgabe.", ["Thema", "Quest", "Praxis"]));

  const videoCard = element("a", { className: "card sister-card", href: "./videos/index.html" },
    element("strong", { textContent: "BitQuest Videos" }),
    element("span", { className: "card-label lavender", textContent: "Zur Videoseite" }),
  );
  const moreSection = element("section", { className: "catalogue" },
    element("h2", { id: "mehr-von-bitquest", textContent: "Mehr von BitQuest" }),
    element("div", { className: "card-grid" }, videoCard),
  );
  moreSection.setAttribute("aria-labelledby", "mehr-von-bitquest");
  main.append(moreSection);

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
  const groups = new Map();
  for (const quest of quests.filter((entry) => entry.topic === topic.id)) {
    const group = quest.group ?? topic.defaultGroup ?? "Quests";
    if (!groups.has(group)) groups.set(group, element("div", { className: "card-grid" }));
    const lessonLabel = quest.lessons.length === 1 ? "Lektion" : "Lektionen";
    const caption = `${quest.lessons.length} ${lessonLabel} und Praxis`;
    const questCard = card(quest.title, quest.description, questUrl(quest), caption, topic.color);
    const refresh = () => { questCard.firstElementChild.textContent = isComplete(quest) ? "Abgeschlossen" : caption; };
    refresh();
    window.addEventListener("pageshow", refresh);
    groups.get(group).append(questCard);
  }
  for (const [title, grid] of groups) {
    main.append(element("section", { className: "catalogue" }, element("h2", { textContent: title }), grid));
  }
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
  const rows = example.rows.map(([label, ...values]) => element("tr", {},
    element("th", { scope: "row", textContent: label }),
    ...values.map((value) => element("td", { textContent: value })),
  ));
  return element("table", { className: "lesson-example" },
    element("caption", { textContent: example.title }),
    element("thead", {}, element("tr", {}, ...headings)),
    element("tbody", {}, ...rows),
  );
}

function renderLesson(quest, step) {
  const lesson = quest.lessons[step - 1];
  const learning = quest.learning ?? learningActivities[quest.id];
  const experiment = learning.experiments?.[step];
  const prediction = learning.predictions?.[step] ?? (step === 1 ? learning.entry : null);
  const article = element("article", { className: "sheet" },
    element("p", { className: "eyebrow section-label", textContent: `Lektion ${step} von ${quest.lessons.length}` }),
    element("h2", { textContent: lesson.title }),
    element("p", { className: "sheet-intro", textContent: learning.openings[step - 1] }),
  );
  const lab = experiment ?? lesson.lab;
  if (prediction) article.append(renderLearningDecision(prediction, "einstieg", Boolean(lab)));
  else if (!asksPrediction(lab)) article.append(renderPredictionNote());
  const revealAfterTry = lesson.discover || ["ring", "discount", "discover-mask", "queue"].includes(lab);
  const explanation = element("div", { hidden: revealAfterTry });
  if (lab) article.append(renderLearningExperiment(lab, quest, () => { explanation.hidden = false; }, lesson.startingMode));
  if (lesson.intro) explanation.append(element("p", { className: "lesson-explanation", textContent: lesson.intro }));
  for (const [title, body] of lesson.sections) {
    explanation.append(element("section", { className: "lesson-section" }, element("h3", { textContent: title }), element("p", { textContent: body })));
  }
  if (lesson.example) explanation.append(renderLessonExample(lesson.example));
  explanation.append(renderLessonReflection(lesson.check));
  article.append(explanation);
  article.append(element("p", { className: "source" }, link(lesson.source[0], lesson.source[1])));
  if (lesson.relatedQuest) {
    const related = quests.find(({ id }) => id === lesson.relatedQuest);
    article.append(element("p", { className: "source" }, link(`Zur Vertiefung „${related.title}“`, questUrl(related))));
  }
  const next = step === quest.lessons.length ? "praxis" : step + 1;
  const actions = element("div", { className: "actions" });
  if (step > 1) actions.append(link("Vorherige Lektion", questUrl(quest, step - 1), "button secondary"));
  actions.append(link(next === "praxis" ? "Zum Praxisbeispiel" : "Nächste Lektion", questUrl(quest, next), "button"));
  article.append(actions);
  return article;
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
  const topicQuests = activeTopic.sequential ? quests.filter(({ topic }) => topic === quest.topic) : [];
  const nextQuest = topicQuests[topicQuests.indexOf(quest) + 1];
  const nextLink = nextQuest ? link(`Nächste Quest · ${nextQuest.title}`, questUrl(nextQuest), "button secondary") : null;
  const feedback = [];
  const labs = practice.labs ?? (practice.lab ? [practice.lab] : []);
  if (practice.preview) article.append(renderDepartureExperiment(practice.preview));
  if (practice.comparison) article.append(renderComparison(practice.comparison));
  if (architectureTradeoffs[quest.id]) article.append(renderTradeoffExperiment(architectureTradeoffs[quest.id]));
  for (const lab of labs) article.append(renderDeepLearningLab(lab));

  const transfer = (quest.learning ?? learningActivities[quest.id]).transfer;
  if (quest.learning) {
    const reasoning = element("textarea", { id: "transfer-reasoning", className: "lab-text-input", rows: 2 });
    form.append(element("div", { className: "lesson-task" },
      element("label", { htmlFor: reasoning.id, textContent: "Deine Begründung zum Transferfall" }), reasoning));
  }
  const questions = [...practice.questions, transfer];
  for (const [index, question] of questions.entries()) {
    const decision = createLearningDecision(question, `entscheidung-${index}`);
    feedback.push(decision);
    decision.field.addEventListener("change", () => { result.textContent = ""; });
    if (question === transfer) {
      form.append(element("section", { className: "transfer-case" },
        element("h3", { textContent: "Auf einen neuen Fall anwenden" }), decision.field,
      ));
    } else form.append(decision.field);
  }

  form.append(result, element("div", { className: "actions" },
    element("button", { className: "button", type: "submit", textContent: labs.length ? "Antworten prüfen" : "Entwurf prüfen" }),
    link("Zur letzten Lektion", questUrl(quest, quest.lessons.length), "button secondary"),
    ...(nextLink ? [nextLink] : []),
  ));
  if (nextLink) nextLink.hidden = !isComplete(quest);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const correctCount = feedback.map(({ evaluate }) => evaluate()).filter(Boolean).length;
    const passed = correctCount === questions.length;
    result.dataset.result = passed ? "success" : "retry";
    if (passed) {
      const saved = saveCompletion(quest);
      completedNote.textContent = saved ? "Quest abgeschlossen" : "Quest in dieser Sitzung abgeschlossen";
      completedNote.hidden = false;
      if (nextLink) nextLink.hidden = false;
      result.textContent = practice.summary;
    } else {
      result.textContent = `${correctCount} von ${questions.length} Entscheidungen passen. Lies die Hinweise bei den übrigen Fragen und versuch es erneut.`;
    }
  });
  article.append(completedNote, form);
  return article;
}

function renderQuest(quest) {
  const selected = params.get("schritt");
  const namedStep = quest.lessons.findIndex(({ id }) => id === selected) + 1;
  const number = namedStep || (quest.legacySteps?.[selected] ?? Number(selected));
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
