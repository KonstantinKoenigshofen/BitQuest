"use strict";

const topics = [
  { id: "softwaredesign", title: "Softwaredesign", description: "Entwirf Module und Schnittstellen so, dass sich Regeln ändern lassen und das Verhalten überprüfbar bleibt.", color: "mint", nodes: ["Aufrufer", "Vertrag", "Modul"] },
  { id: "softwarearchitektur", title: "Softwarearchitektur", description: "Triff Entscheidungen über das Gesamtsystem, leite sie aus Qualitätszielen ab und mache ihre Folgen nachvollziehbar.", color: "lavender", nodes: ["Qualitätsziel", "Entscheidung", "System"] },
  { id: "deep-learning", title: "Deep Learning", description: "Trainiere Netze für handgeschriebene Ziffern und lerne, wie Sprachmodelle Text vorhersagen und erzeugen.", color: "sky", nodes: ["Daten", "Modell", "Vorhersage"], sequential: true, defaultGroup: "Grundlagen und Bildmodelle" },
  { id: "it-sicherheit", title: "IT-Sicherheit", description: "Schütze Konten, Geräte und Daten eines kleinen Sportvereins. Acht Quests führen vom ersten Risiko bis zum Sicherheitsvorfall.", color: "amber", nodes: ["Schützen", "Prüfen", "Reagieren"], sequential: true, defaultGroup: "Lernpfad für den Einstieg" },
  { id: "quantencomputer", title: "Quantencomputer", description: "Rechne mit Qubits, baue kleine Quantenschaltungen und untersuche Verschränkung, Algorithmen und Fehlerkorrektur.", color: "lavender", nodes: ["Qubit", "Gatter", "Messung"], sequential: true, defaultGroup: "Grundlagen" },
  { id: "datenbank-technologie", title: "Datenbank-Technologie", description: "Modelliere eine Bibliothek, untersuche SQL-Abfragen und Transaktionen und vergleiche relationale, verteilte und spezialisierte Datenbanken.", color: "mint", nodes: ["Schema", "Abfrage", "Transaktion"], sequential: true, defaultGroup: "Relationale Grundlagen und SQL" },
];

const quests = [...softwaredesignQuests, ...softwarearchitekturQuests,
  ...deepLearningQuests.filter((quest) => !quest.group), ...deepLearningExtensions.filter((quest) => !quest.group),
  ...deepLearningQuests.filter((quest) => quest.group), ...deepLearningExtensions.filter((quest) => quest.group),
  ...sicherheitsQuests, ...quantenQuests, ...datenbankQuests];
