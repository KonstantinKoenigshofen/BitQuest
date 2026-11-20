"use strict";

const deepLearningSources = {
  intro: ["Dive into Deep Learning · Introduction", "https://d2l.ai/chapter_introduction/index.html"],
  math: ["Dive into Deep Learning · Preliminaries", "https://d2l.ai/chapter_preliminaries/index.html"],
  regression: ["Dive into Deep Learning · Linear Neural Networks for Regression", "https://d2l.ai/chapter_linear-regression/index.html"],
  classification: ["Dive into Deep Learning · Linear Neural Networks for Classification", "https://d2l.ai/chapter_linear-classification/index.html"],
  networks: ["Dive into Deep Learning · Multilayer Perceptrons", "https://d2l.ai/chapter_multilayer-perceptrons/index.html"],
  gradients: ["Dive into Deep Learning · Forward and Backward Propagation", "https://d2l.ai/chapter_multilayer-perceptrons/backprop.html"],
  optimization: ["Dive into Deep Learning · Optimization Algorithms", "https://d2l.ai/chapter_optimization/index.html"],
  evaluation: ["Google Machine Learning Crash Course · Accuracy, Recall, Precision", "https://developers.google.com/machine-learning/crash-course/classification/accuracy-precision-recall"],
  overfitting: ["Google Machine Learning Crash Course · Overfitting", "https://developers.google.com/machine-learning/crash-course/overfitting/overfitting"],
  splits: ["Google Machine Learning Crash Course · Dividing the Dataset", "https://developers.google.com/machine-learning/crash-course/overfitting/dividing-datasets"],
  shift: ["Dive into Deep Learning · Environment and Distribution Shift", "https://d2l.ai/chapter_linear-classification/environment-and-distribution-shift.html"],
  project: ["Stanford CS230 · Deep Learning Project", "https://cs230.stanford.edu/project/"],
};

const deepLearningQuests = [
  {
    id: "lernaufgabe-formulieren", topic: "deep-learning", title: "Eine Lernaufgabe formulieren",
    description: "Lege fest, was ein Modell als Eingabe sieht, was es vorhersagt und wie du einen ersten Vergleichswert bekommst.",
    lessons: [
      {
        title: "Aus einem Problem eine Vorhersage machen",
        intro: "Ein Sportverein will handgeschriebene Startnummern digital erfassen. Wir vereinfachen die Aufgabe zunächst auf ein zugeschnittenes Bild mit genau einer Ziffer. Das Modell soll eine Klasse ausgeben, etwa „7“.",
        sections: [
          ["Eingabe, Zielwert und Vorhersage", "Die Eingabe x ist ein Pixelbild. Der Zielwert y ist die von einem Menschen bestätigte Ziffer, auch Label genannt. Die Vorhersage ŷ ist die Ausgabe des Modells. Bei einer schwer lesbaren 7 kann das Label 7 sein, während das Modell 1 ausgibt."],
          ["Klassifikation und Regression", "Eine Ziffer zuzuordnen ist Klassifikation. Die Klassen sind Kategorien, obwohl sie hier Zahlen heißen. Die geschätzte Dicke eines Stifts in Millimetern wäre Regression, weil ein numerischer Wert auf einer Skala vorhergesagt wird."],
        ],
        check: ["Warum solltest du bei einer Ziffernklassifikation keine 4,5 als fertige Vorhersage ausgeben?", "Jede Ziffer ist eine eigene Klasse. Die Aufgabe verlangt eine der vorgesehenen Klassen, beispielsweise 4 oder 5."],
        source: deepLearningSources.intro,
      },
      {
        title: "Woher das Lernsignal kommt",
        intro: "Ein Lernverfahren braucht ein Signal darüber, welche Ausgaben oder Darstellungen es bevorzugen soll. Woher dieses Signal kommt, hängt von Aufgabe und Daten ab.",
        sections: [
          ["Überwachtes Lernen", "Du sammelst Bilder mit bestätigten Ziffern. Beim Training vergleicht das Modell seine Vorhersagen mit diesen Labels. So bekommt es Rückmeldung für die spätere Aufgabe."],
          ["Selbstüberwachtes und unüberwachtes Lernen", "Beim selbstüberwachten Lernen lässt sich ein Ziel aus den Daten erzeugen. Du könntest Pixel verdecken und das unverdeckte Bild als Ziel verwenden. Beim Clustering suchst du etwa Gruppen ähnlich aussehender Bilder ohne vorgegebene Klassen. Die Gruppen tragen dadurch noch keine Ziffernlabels."],
        ],
        check: ["Warum gilt das Vorhersagen verdeckter Pixel hier als selbstüberwacht?", "Das Trainingsziel stammt aus dem Bild selbst. Die ursprünglichen Pixelwerte sind bereits bekannt, auch ohne manuell vergebene Labels."],
        source: deepLearningSources.intro,
      },
      {
        title: "Beispiele prüfen und eine Baseline festlegen",
        intro: "Die Beispiele legen fest, aus welchen Fällen das Modell lernt. Ein System für Startnummern braucht deshalb unterschiedliche Handschriften, Stifte und Aufnahmen aus dem vorgesehenen Einsatz.",
        sections: [
          ["Den Umfang festlegen", "Halte fest, welche Bilder erlaubt sind und wie sie zugeschnitten werden. Ein Ausschnitt mit „17“ enthält zwei Ziffern und gehört in diesem Projekt zur vorgelagerten Zuschneideaufgabe."],
          ["Widersprüche sichtbar machen", "Prüfe, ob Bilder und Labels zusammenpassen. Markiere unleserliche Fälle nach einer gemeinsamen Regel. Erfasse, von welcher Person die Beispiele stammen, damit du später testen kannst, wie das Modell mit neuen Handschriften umgeht."],
          ["Eine einfache Vorhersageregel vergleichen", "Eine Baseline liefert einen Vergleichswert. Bestimme aus den Trainingsdaten die häufigste Klasse und sage mit dieser Regel immer dieselbe Ziffer voraus. Den Anteil richtiger Vorhersagen misst du für Baseline und Netz auf denselben unabhängigen Testbildern. Das Praxisexperiment zeigt vorab nur die Treffer auf seinen acht Übungsbildern."],
        ],
        check: ["Wie viele Treffer hat „immer 1“, wenn vier von acht Übungsbildern eine 1 zeigen?", "Vier von acht, also 50 Prozent. Alle anderen Ziffern werden dabei falsch zugeordnet."],
        source: deepLearningSources.project,
      },
    ],
    practice: {
      title: "Ein erster Vergleich für die Startnummern",
      intro: "Der Sportverein erstellt acht vereinfachte Ausschnitte. Jeder zeigt genau eine 1, 4 oder 7. Sieh dir die Labels und Baselines an und definiere den ersten Vergleich für die automatische Erkennung.",
      lab: "dataset",
      questions: [
        { prompt: "Was soll das System in diesem ersten Versuch ausgeben?", answer: 1, options: ["Die Startnummer der Person, auch bei einem Ausschnitt mit nur einer Ziffer.", "Eine der drei Ziffernklassen für das vorgelegte Bild.", "Die Zahl der sichtbaren Tintenpixel."], clue: "Im Ausschnitt ist genau eine Ziffer. Sie ist das Ziel.", explanation: "Das Ergebnis ist eine Klassenzuordnung zu genau diesem Ausschnitt." },
        { prompt: "Welches Bild eignet sich nach der vereinbarten Regel als einzelnes Lernbeispiel?", answer: 2, options: ["Ein Foto mit der ganzen Startnummer 147.", "Ein leerer Ausschnitt mit einem geratenen Label.", "Ein zugeschnittener Ausschnitt mit einer sichtbaren und bestätigten 4."], clue: "Die Aufgabe hat genau eine Ziffer als Ziel.", explanation: "Das Bild passt zur Aufgabe und liefert mit dem bestätigten Label ein überwachtes Lernsignal." },
        { prompt: "Welche konstante Regel trifft in den acht Übungsbildern am häufigsten?", answer: 0, options: ["Immer 1 ausgeben.", "Immer 4 ausgeben.", "Immer 7 ausgeben."], clue: "Wechsle im Experiment die Vorhersageregel. Vergleiche die Treffer auf allen Bildern.", explanation: "Vier Bilder zeigen eine 1. Die 4 und die 7 kommen jeweils zweimal vor." },
        { prompt: "Wie vergleichst du später Baseline und Netz fair?", answer: 1, options: ["Du bewertest die Baseline auf den schweren Bildern und das Netz auf den leichten.", "Du legst die Baseline anhand der Trainingsdaten fest und prüfst beide auf denselben unabhängigen Testbildern.", "Du passt beide nach jedem Blick auf den Test an und meldest den höchsten Wert."], clue: "Beide Verfahren brauchen dieselben Prüfbedingungen.", explanation: "Ein gemeinsamer, unabhängiger Test macht die Ergebnisse vergleichbar." },
      ],
      summary: "Eingabe, Label und Vergleichsregel stehen. Als Nächstes übersetzt du Pixel in Zahlen, mit denen ein Modell rechnen kann.",
    },
  },
  {
    id: "mathematik-fuer-netze", topic: "deep-learning", title: "Die nötige Mathematik anwenden",
    description: "Lies Tensorformen, berechne eine gewichtete Summe und deute Wahrscheinlichkeiten und Ableitungen.",
    lessons: [
      {
        title: "Bilder als Tensoren lesen",
        intro: "Ein Graustufenbild lässt sich als Matrix mit Zeilen und Spalten darstellen. In unseren Übungsbildern steht 0 für einen leeren Pixel und 1 für volle Tinte.",
        sections: [
          ["Form und Inhalt trennen", "Ein 5-mal-5-Bild hat die Form (5, 5) und enthält 25 Werte. Liest du das Bild zeilenweise als Liste, entsteht ein Vektor der Länge 25. Die Werte bleiben gleich, ihre Anordnung bekommt eine andere Form."],
          ["Beispiele stapeln", "Ein Batch fasst mehrere Beispiele zusammen. Bei acht Graustufenbildern ohne eigene Kanalachse hat der Bildtensor die Form (8, 5, 5). Nach dem zeilenweisen Abflachen jedes Bildes ist es eine Matrix der Form (8, 25)."],
        ],
        check: ["Welche Form hat ein Batch aus drei abgeflachten 5-mal-5-Bildern?", "Für jedes Bild gibt es 25 Werte. Drei Bilder ergeben die Form (3, 25)."],
        source: deepLearningSources.math,
      },
      {
        title: "Ein Skalarprodukt von Hand berechnen",
        intro: "Ein Skalarprodukt multipliziert passende Einträge zweier gleich langer Vektoren und addiert die Produkte. Ein Neuron nutzt diese Rechnung, um Eingaben unterschiedlich stark zu gewichten.",
        sections: [
          ["Die Beiträge aufschreiben", "Für die Eingabe [1, 0,5] und die Gewichte [2, −1] entstehen die Beiträge 1 × 2 = 2 und 0,5 × (−1) = −0,5. Das Skalarprodukt ist 1,5."],
          ["Den Bias dazunehmen", "Der Bias ist ein zusätzlicher fester Term in der Rechnung. Mit Bias −0,5 ergibt das Beispiel vor einer Aktivierungsfunktion den Wert 1. Mehrere Gewichtungsvektoren lassen sich als Zeilen einer Gewichtsmatrix zusammenfassen."],
        ],
        lab: "math",
        check: ["Was ergibt sich bei x₁ = 0,5 und x₂ = 1 mit denselben Gewichten und demselben Bias?", "0,5 × 2 + 1 × (−1) − 0,5 ergibt −0,5."],
        source: deepLearningSources.math,
      },
      {
        title: "Klassenwahrscheinlichkeiten lesen",
        intro: "Ein Modell kann jeder möglichen Ziffer eine geschätzte Wahrscheinlichkeit zuordnen. Sind die Klassen gegenseitig ausschließend und vollständig, summieren sie sich zu 1.",
        sections: [
          ["Die wahrscheinlichste Klasse finden", "Wenn das Modell der 1 den Wert 0,2, der 4 den Wert 0,1 und der 7 den Wert 0,7 gibt, ist die 7 seine wahrscheinlichste Klasse. Alle drei Werte ergeben zusammen 1."],
          ["Sicherheit und Treffer vergleichen", "Die 0,7 ist eine Aussage des Modells. Ob solche Vorhersagen in der Praxis etwa sieben von zehn Mal stimmen, lässt sich über viele Fälle mit ähnlicher vorhergesagter Wahrscheinlichkeit überprüfen."],
        ],
        check: ["Ein Modell vergibt für 1 und 4 die Werte 0,3 und 0,2. Was bleibt für die einzige andere Klasse 7?", "0,5, weil die drei Werte zusammen 1 ergeben."],
        source: deepLearningSources.classification,
      },
      {
        title: "Eine Ableitung als lokale Steigung deuten",
        intro: "Eine Ableitung beschreibt, wie stark sich eine Ausgabe bei einer kleinen Änderung einer Eingabe verändert. Beim Training interessiert uns, wie der Verlust auf Änderungen eines Gewichts reagiert.",
        sections: [
          ["Vorzeichen lesen", "Für f(w) = w² ist die Ableitung 2w. Bei w = 2 beträgt sie 4. Eine kleine Erhöhung des Gewichts vergrößert f dort ungefähr viermal so stark wie die Änderung des Gewichts."],
          ["Mehrere Gewichte unterscheiden", "Hat eine Verlustfunktion mehrere Gewichte, kannst du eines ändern und die anderen festhalten. So erhältst du eine partielle Ableitung. Der Gradient sammelt diese Ableitungen für alle Parameter."],
        ],
        check: ["Welche kleine Änderung senkt f(w) = w² in der Nähe von w = −1?", "Erhöhe w etwas. Die Ableitung ist dort −2, also fällt der Funktionswert bei einer kleinen Erhöhung."],
        source: deepLearningSources.math,
      },
    ],
    practice: {
      title: "Was zwei Pixel zum Ziffernsignal beitragen",
      intro: "Für einen ersten Prototyp möchtest du genau nachrechnen können, woher ein Zahlenwert kommt. Probiere im Experiment zwei Pixel mit den Gewichten 2 und −1 und dem Bias −0,5.",
      lab: "math",
      questions: [
        { prompt: "Wie groß ist der abgeflachte Eingabevektor eines vollständigen 5-mal-5-Bilds?", answer: 2, options: ["5 Werte.", "10 Werte.", "25 Werte."], clue: "Jede Zeile enthält fünf Pixel.", explanation: "Fünf Zeilen mit je fünf Pixeln ergeben 25 Werte." },
        { prompt: "Welche Ausgabe ergibt sich im Experiment bei x₁ = 0,75 und x₂ = 1?", answer: 1, options: ["0,5.", "0.", "1,5."], clue: "Berechne zuerst 2 × 0,75 − 1. Ziehe danach den Biasbetrag 0,5 ab.", explanation: "Die Beiträge ergeben zusammen 0,5. Mit dem Bias −0,5 wird daraus 0." },
        { prompt: "Was passiert, wenn nur x₂ um 0,25 steigt?", answer: 0, options: ["Die Ausgabe sinkt um 0,25.", "Die Ausgabe steigt um 0,5.", "Der Bias sinkt um 0,25."], clue: "Das Gewicht für x₂ ist −1.", explanation: "Die Änderung des gewichteten Beitrags ist 0,25 × (−1), während der Bias fest bleibt." },
        { prompt: "Der Verlust hat nach einem Gewicht die Ableitung +3. In welche Richtung änderst du dieses Gewicht für einen kleinen Schritt zur Verlustsenkung?", answer: 2, options: ["Du erhöhst es leicht.", "Du setzt es in jedem Fall auf 3.", "Du senkst es leicht."], clue: "Eine positive Ableitung bedeutet, dass der Verlust bei einer kleinen Erhöhung zunächst steigt.", explanation: "Ein kleiner Schritt entgegen der lokalen Steigung senkt den Verlust in diesem Fall." },
      ],
      summary: "Du kannst Pixel als Tensoren lesen, gewichtete Beiträge berechnen und die Richtung einer kleinen Parameteränderung begründen.",
    },
  },
  {
    id: "neuronales-netz-aufbauen", topic: "deep-learning", title: "Ein neuronales Netz aufbauen",
    description: "Verfolge, wie Gewichte und Aktivierungen aus Ziffernmerkmalen eine Vorhersage machen.",
    lessons: [
      {
        title: "Ein Neuron berechnet einen Zwischenwert",
        intro: "Ein künstliches Neuron gewichtet seine Eingaben, addiert einen Bias und wendet eine Aktivierungsfunktion an. Die Gewichte und der Bias sind Parameter, die sich beim Training ändern können.",
        sections: [
          ["Einem Merkmal mehr Einfluss geben", "Die Oberkante einer 7 enthält in unseren Beispielen oft mehr Tinte als die einer 1. Ein positives Gewicht kann das Signal dieser Oberkante verstärken. Ein anderes Gewicht kann den Beitrag eines zweiten Merkmals abschwächen."],
          ["Berechnung und Bedeutung auseinanderhalten", "Ein einzelner Zwischenwert ist zunächst eine Modellzahl. Erst der Aufbau des ganzen Netzes und die Aufgabe legen fest, welche Werte als Klassenscores gelesen werden. Ein großer Wert ist für sich genommen keine Wahrscheinlichkeit."],
        ],
        check: ["Was ändert sich, wenn du den Bias um 1 erhöhst und die Eingaben und Gewichte festhältst?", "Die gewichtete Summe vor der Aktivierung steigt für jede Eingabe um 1. Die Aktivierung legt fest, wie sich das auf die Ausgabe auswirkt."],
        source: deepLearningSources.networks,
      },
      {
        title: "Schichten zu einer Vorwärtsrechnung verbinden",
        intro: "Beim Forward Pass wandern Werte von der Eingabe über verborgene Schichten zur Ausgabe. Für eine Klassifikation kann die letzte Schicht je Klasse einen Score liefern.",
        sections: [
          ["Den Weg durch das Netz verfolgen", "Unser Übungsnetz liest zwei Merkmale aus dem Bild. Zwei verborgene Neuronen verarbeiten diese Merkmale unterschiedlich. Die Ausgabeschicht übernimmt ihre Werte in fester Zuordnung als Scores für 1 und 7."],
          ["Training und Vorhersage unterscheiden", "Beim Forward Pass stehen die Parameter fest. Er berechnet die Ausgabe für das aktuelle Bild. Eine Parameteränderung braucht weitere Schritte, die wir in den Quests zu Verlust und Training kennenlernen."],
        ],
        check: ["Wie viele Klassenscores brauchst du für zehn mögliche Ziffern bei einer Ausgabe pro Klasse?", "Zehn Scores. Die Position jedes Scores ist fest einer Ziffer zugeordnet."],
        source: deepLearningSources.networks,
      },
      {
        title: "Mit ReLU eine nichtlineare Schicht bauen",
        intro: "Ohne nichtlineare Aktivierung lässt sich eine Folge aus gewichteten Summen und Bias-Terms zu einer einzigen Abbildung dieser Art zusammenfassen. ReLU verändert diese Eigenschaft.",
        sections: [
          ["Die Regel anwenden", "ReLU liefert bei negativen Werten 0 und gibt positive Werte unverändert weiter. So kann ein Merkmal in manchen Eingabebereichen ganz ausgeblendet sein und in anderen proportional zur Eingabe wirken."],
          ["Die Wirkung am Übungsnetz prüfen", "Wähle eine breite 7, setze w auf 0 und schalte zwischen ReLU und Identität um. Beachte, welche Scores gleich bleiben, welche sich ändern und ob sich dadurch auch die gewählte Klasse ändert."],
        ],
        lab: "forward",
        check: ["Was gibt ReLU für −3 und für 2 aus?", "Für −3 ergibt sich 0. Der positive Wert 2 bleibt 2."],
        source: deepLearningSources.networks,
      },
      {
        title: "Aus Klassenscores eine Ziffer auswählen",
        intro: "Die vorhergesagte Klasse kann direkt aus dem höchsten Score gewählt werden. Diese Auswahl heißt Argmax. Bei einem Gleichstand muss das System eine feste Regel oder einen eigenen Umgang mit Zweifelsfällen vorsehen.",
        sections: [
          ["Ausgabe und Sicherheit unterscheiden", "Das Beispiel wählt bei gleichen Scores die 1. Ein Gleichstand sagt nichts darüber aus, welcher Klasse das Bild tatsächlich angehört. Auch ein größerer Abstand zwischen Scores ist ohne weitere Prüfung keine verlässliche Fehlerwahrscheinlichkeit."],
          ["Merkmale auf die Aufgabe abstimmen", "Zwei Merkmale genügen für einen visuellen Versuch, behalten aber nur einen kleinen Teil des Bildes. Haben zwei verschiedene Ziffern dieselben Merkmale, berechnet dieses Modell dieselbe Ausgabe. Zusätzliche Bildinformation kann die Unterscheidung ermöglichen."],
        ],
        check: ["Ein Bild der 1 und ein Bild der 7 haben dieselben zwei Eingabemerkmale. Kann das feste Modell sie anhand dieser Eingabe unterscheiden?", "Es sieht in beiden Fällen denselben Zahlenvektor. Daher liefert es dieselben Scores und dieselbe Entscheidung."],
        source: deepLearningSources.classification,
      },
      {
        title: "Vier Punkte trennen · XOR und Nichtlinearität",
        intro: "Eine Gerade teilt die Ebene in zwei Hälften. Die Verbindungslinien der gleichfarbigen Paare kreuzen sich. Deshalb kann keine Gerade die vier Punkte richtig trennen. Zwei ReLU-Neuronen reagieren auf x − y und y − x. Zusammen ergeben sie |x − y|. Bei ungleichen Eingaben ist der Wert 1 und bei gleichen 0. Eine Schwelle bei 0,5 ergibt zwei parallele Grenzen.",
        sections: [],
        check: ["Was gibt die verborgene Schicht für x = 0 und y = 1 aus?", "ReLU(−1) ergibt 0, ReLU(1) ergibt 1. Ihre Summe liegt über 0,5."],
        source: deepLearningSources.networks, lab: "xor", discover: true,
      },
    ],
    practice: {
      title: "Die Vorhersage einer 7 nachrechnen",
      intro: "Mit der breiten 7 und w = 1 sollte das handgesetzte Übungsnetz die 7 wählen. Prüfe den Forward Pass und verändere anschließend Gewicht und Aktivierung.",
      lab: "forward",
      questions: [
        { prompt: "Welchen Wert hat x₁ für das Bild „7 · breiter Balken“?", answer: 2, options: ["0.", "2.", "5."], clue: "Zähle die Tintenpixel der obersten Zeile.", explanation: "Die obere Reihe besteht in diesem Bild aus fünf markierten Pixeln." },
        { prompt: "Welchen Score bekommt die 7 in diesem Bild bei w = 1 und ReLU?", answer: 0, options: ["3.", "5.", "0."], clue: "In der zweiten Reihe ist der mittlere Pixel leer. Berechne 1 × 5 + 0 − 2.", explanation: "Der erste Zwischenwert ist 3. ReLU gibt diesen positiven Wert unverändert weiter." },
        { prompt: "Welche Ziffer sagt das Netz bei demselben Bild mit w = 0 und ReLU voraus?", answer: 1, options: ["7, weil das Bild weiterhin gleich aussieht.", "1, weil beide Scores auf 0 fallen und die Gleichstandsregel greift.", "4, weil sich die beiden Scores gegenseitig aufheben."], clue: "Beide Zwischenwerte sind negativ. Schau dir die Scores nach ReLU an.", explanation: "ReLU setzt beide Werte auf 0. Die vordefinierte Regel wählt in diesem Fall 1." },
        { prompt: "Was ändert sich beim Umschalten auf Identität bei w = 0?", answer: 2, options: ["Das Netz lernt neue Gewichte.", "Der Score der 7 bleibt 0.", "Die beiden negativen Werte werden unverändert zu Klassenscores."], clue: "Identität gibt jeden Eingabewert unverändert weiter.", explanation: "Die Klassenscores werden −0,5 für die 1 und −2 für die 7. Die Vorhersage bleibt hier 1." },
      ],
      summary: "Du hast eine Vorhersage anhand der Eingabemerkmale, Zwischenwerte und Klassenscores nachvollzogen.",
    },
  },
  {
    id: "verlust-und-gradienten", topic: "deep-learning", title: "Fehler messen und zurückverfolgen",
    description: "Übersetze Scores in Wahrscheinlichkeiten und berechne, in welche Richtung ein Gewicht den Verlust verändert.",
    lessons: [
      {
        title: "Eine Verlustfunktion zur Aufgabe wählen",
        intro: "Beim Training brauchen wir einen Zahlenwert dafür, wie gut eine Ausgabe zum Ziel passt. Die Verlustfunktion liefert dieses Signal für einzelne Beispiele oder einen Stapel von Beispielen.",
        sections: [
          ["Numerische Abweichungen messen", "Bei einer Regression kann der quadrierte Fehler die Differenz zwischen Vorhersage und Zielwert messen. Liegt eine Vorhersage zwei Einheiten neben dem Ziel, beträgt der quadrierte Fehler 4. Das Vorzeichen der Abweichung spielt dafür keine Rolle."],
          ["Klassenvorhersagen bewerten", "Bei einer Ziffernklassifikation soll das Modell dem richtigen Label möglichst viel Wahrscheinlichkeit geben. Die Kreuzentropie bestraft kleine Wahrscheinlichkeiten für das korrekte Label. Sie liefert auch dann ein Lernsignal, wenn die gewählte Klasse bereits stimmt."],
        ],
        check: ["Welche Art von Verlust passt zum Beispiel, wenn du die Strichdicke als kontinuierliche Zahl vorhersagst?", "Der quadrierte Fehler ist eine mögliche Wahl für diese Regression. Er misst die Abweichung zwischen gemessener und vorhergesagter Dicke."],
        source: deepLearningSources.regression,
      },
      {
        title: "Softmax und Kreuzentropie zusammen lesen",
        intro: "Softmax wandelt Scores in positive Anteile um, die zusammen 1 ergeben. Jeder Score wird exponentiert und anschließend durch die Summe aller exponentierten Scores geteilt.",
        sections: [
          ["Gleiche Scores prüfen", "Bei zwei gleichen Scores teilt Softmax die Wahrscheinlichkeit gleichmäßig auf. Höhere Scores erhalten höhere Anteile. Softmax ändert dabei nicht die Reihenfolge der Klassen nach Score."],
          ["Den Verlust am richtigen Label ablesen", "Für ein eindeutig gelabeltes Beispiel ist die Kreuzentropie −ln(p), wobei p die Wahrscheinlichkeit der richtigen Klasse ist. Bei p = 0,5 ergibt das ungefähr 0,693. Bei p = 0,9 fällt der Verlust auf ungefähr 0,105."],
        ],
        check: ["Was passiert mit dem Verlust, wenn das Modell der richtigen Ziffer statt 0,5 nur noch 0,1 gibt?", "Der Verlust steigt von ungefähr 0,693 auf 2,303. Das Modell gibt dem richtigen Label deutlich weniger Wahrscheinlichkeit."],
        source: deepLearningSources.classification,
      },
      {
        title: "Den Gradienten mit der Kettenregel finden",
        intro: "Der Verlust hängt vom Score ab und der Score vom Gewicht. Die Kettenregel verbindet beide lokalen Ableitungen, damit wir wissen, wie der Verlust auf das Gewicht reagiert.",
        sections: [
          ["Dem Rechenweg rückwärts folgen", "Im Beispiel gilt z = w × 2. Der Score z ändert sich doppelt so stark wie w. Die Ableitung des Verlusts nach z ist p₇ − y₇. Hier steht y₇ für 1 beim Label 7 und für 0 beim Label 1."],
          ["Die beiden Ableitungen multiplizieren", "Der Gradient nach w ist dadurch 2 × (p₇ − y₇). Bei gleichen Scores und Label 7 sind p₇ = 0,5 und y₇ = 1. Der Gradient ist −1. Eine kleine Erhöhung von w senkt also den Verlust."],
        ],
        lab: "loss",
        check: ["Was passiert bei gleichen Scores mit dem Gradienten nach w, wenn das richtige Label 1 statt 7 ist?", "Er wechselt von −1 auf +1. Der Ausdruck y₇ wechselt dabei von 1 auf 0."],
        source: deepLearningSources.classification,
      },
      {
        title: "Backpropagation als Rechenverfahren verstehen",
        intro: "Backpropagation berechnet Gradienten effizient, indem sie die Abhängigkeiten des Forward Pass rückwärts durchgeht. Die Berechnung kann damit frühere Schichten genauso erreichen wie die Ausgabeschicht.",
        sections: [
          ["Beiträge über mehrere Pfade sammeln", "Ein Zwischenwert kann in mehrere weitere Rechnungen einfließen. Seine Ableitung zum Endverlust berücksichtigt dann alle Pfade. In tiefen Netzen wird diese Rückwärtsrechnung für viele Parameter wiederverwendet."],
          ["Automatische Differenzierung einsetzen", "Eine Bibliothek kann die benutzten Operationen und ihre Ableitungen verfolgen. Sie liefert die konkreten Gradienten, während ein Optimierer anschließend entscheidet, wie stark die Parameter aktualisiert werden."],
        ],
        check: ["Ist das Gewicht direkt nach der Backpropagation schon kleiner oder größer?", "Die Rückwärtsrechnung liefert zunächst seinen Gradienten. Erst die Parameteraktualisierung durch den Optimierer ändert den Wert."],
        source: deepLearningSources.gradients,
      },
    ],
    practice: {
      title: "Warum eine sichere falsche Vorhersage teuer ist",
      intro: "Ein Bild zeigt eine 7. Verwende das vereinfachte Modell mit zwei Klassen und vergleiche den Verlust bei w = 0, w = 1 und w = −1. Wechsle dann das richtige Label und beobachte den Gradienten.",
      lab: "loss",
      questions: [
        { prompt: "Welche Wahrscheinlichkeit hat die 7 bei w = 0?", answer: 0, options: ["50 %.", "0 %.", "100 %."], clue: "Bei w = 0 haben beide Klassen denselben Score.", explanation: "Gleiche Scores führen bei zwei Klassen zu gleichen Wahrscheinlichkeiten von je 0,5." },
        { prompt: "Bei welchem Gewicht ist der Verlust für das Label 7 am kleinsten?", answer: 2, options: ["w = −1.", "w = 0.", "w = 1."], clue: "Das Gewicht mit dem höchsten Score für die 7 gibt ihr auch die höchste Wahrscheinlichkeit.", explanation: "Bei w = 1 beträgt ihr Score 2. Bei festem Score 0 für die andere Klasse steigt p₇ und der Verlust sinkt." },
        { prompt: "Wie groß ist der Gradient nach w bei w = 0 und Label 7?", answer: 1, options: ["+1.", "−1.", "0."], clue: "Setze p₇ = 0,5 und y₇ = 1 in 2 × (p₇ − y₇) ein.", explanation: "2 × (0,5 − 1) ergibt −1. Ein kleiner Schritt des Gradientenabstiegs erhöht w." },
        { prompt: "Welche Richtung zeigt der Gradient nach Wechsel auf Label 1 bei w = 0?", answer: 0, options: ["Der Gradient ist positiv. Ein kleiner Abstiegsschritt senkt w.", "Der Gradient bleibt negativ.", "Beide Scores sind 0, daher kann es keinen Gradienten geben."], clue: "Für Label 1 ist y₇ = 0.", explanation: "Der Gradient wird +1. Ein kleiner Schritt senkt w und damit den Score der 7." },
      ],
      summary: "Du kannst zwischen Score, Wahrscheinlichkeit, Verlust und Gradient unterscheiden und ihren Zusammenhang nachrechnen.",
    },
  },
  {
    id: "ein-netz-trainieren", topic: "deep-learning", title: "Ein Netz trainieren und das Training verstehen",
    description: "Verfolge einzelne Gewichtsupdates und untersuche, wie Lernrate, Batch-Größe und Startwerte das Training beeinflussen.",
    lessons: [
      {
        title: "Ein Gewicht mit Gradientenabstieg aktualisieren",
        intro: "Der Gradient zeigt die Richtung des stärksten lokalen Verlustanstiegs. Beim Gradientenabstieg ziehst du den mit der Lernrate multiplizierten Gradienten von den Parametern ab.",
        sections: [
          ["Ein Update nachrechnen", "Für L = (w − 2)² / 2 ist der Gradient w − 2. Am Start w = −2 beträgt er −4. Mit Lernrate 0,5 ergibt sich w neu = −2 − 0,5 × (−4) = 0. Der Verlust fällt von 8 auf 2."],
          ["Den Zyklus wiederholen", "Berechne die Vorhersage und den Verlust. Bestimme die Gradienten aus dieser Rechnung und aktualisiere die Gewichte. Für den nächsten Schritt rechnest du mit den neuen Werten erneut."],
        ],
        check: ["Starte diesmal gedanklich bei w = 4. Das Ziel bleibt 2 und die Lernrate ist 0,5. Wo landet das Gewicht und wie ändert sich der Verlust?", "Bei w = 4 ist der Gradient 4 − 2 = 2. Das Update zieht 0,5 × 2 ab und landet bei 3. Die Entfernung zum Ziel sinkt von 2 auf 1, damit fällt (w − 2)² / 2 von 2 auf 0,5."],
        source: deepLearningSources.optimization,
      },
      {
        title: "Mit Batches und Epochen rechnen",
        intro: "Ein Mini-Batch enthält einen Teil der Trainingsbeispiele. In der üblichen Trainingsschleife berechnest du einen gemeinsamen Verlust pro Batch und führst danach ein Parameterupdate aus.",
        sections: [
          ["Vom Stapel zum Update", "Mit 80 Bildern und Batches zu je 20 Bildern kannst du vier Updates ausführen. Bestimmen die Beispiele den Verlust zu gleichen Teilen, verwendest du ihren mittleren Verlust für den Gradienten."],
          ["Eine Epoche einordnen", "Eine Epoche ist hier ein vollständiger Durchlauf durch die Trainingsdaten. Häufig wird die Reihenfolge vor jeder Epoche gemischt. Kleinere Batches ergeben bei gleicher Datenmenge mehr Updates je Epoche. Der Gradient pro Batch kann stärker schwanken."],
        ],
        check: ["Wie viele Updates macht die beschriebene Trainingsschleife mit 80 Bildern, Batch-Größe 10 und zwei Epochen?", "Acht Updates pro Epoche, also 16 insgesamt."],
        source: deepLearningSources.optimization,
      },
      {
        title: "Die Lernrate anhand des Verlusts beurteilen",
        intro: "Die Lernrate bestimmt die Größe eines Updates bei gegebenem Gradienten. Eine kleine Rate kann lange brauchen. Eine große Rate kann ein Minimum überspringen und den Verlust vergrößern.",
        sections: [
          ["Die Bewegung im Beispiel verfolgen", "Mit Lernrate 0,1 nähert sich das Modellgewicht langsam dem Zielwert 2. Mit 0,5 halbiert sich der Abstand pro Schritt. Mit 2,1 wechselt das Gewicht bei jedem Schritt die Seite des Ziels, und der Abstand wächst."],
          ["Unter gleichen Bedingungen vergleichen", "Starte bei jedem Vergleich mit derselben Initialisierung und der gleichen Zahl an Schritten. Die Zahlen in diesem Experiment gelten für die gewählte quadratische Verlustfunktion. Bei einem anderen Netz und anderen Daten können andere Lernraten sinnvoll sein."],
        ],
        lab: "training",
        check: ["Ein Verlust steigt nach fast jedem Update. Welche einfache Einstellung könntest du zuerst vergleichen?", "Teste eine kleinere Lernrate bei gleichem Startwert. Bleibt das Problem bestehen, prüfe auch Daten und Berechnung."],
        source: deepLearningSources.optimization,
      },
      {
        title: "Startwerte für mehrere Neuronen wählen",
        intro: "Neuronale Netze brauchen Startwerte, bevor sie das erste Bild sehen. Sehr große oder sehr kleine Werte können dazu führen, dass Signale durch viele Schichten anwachsen oder verschwinden.",
        sections: [
          ["Symmetrie aufbrechen", "Starten zwei gleich angebundene Neuronen mit exakt denselben Parametern und erhalten dieselben Updates, lernen sie dieselbe Funktion. Zufällige Gewichte können verschiedene Startpunkte schaffen."],
          ["Die Größe der Gewichte planen", "Verfahren wie Xavier- und He-Initialisierung orientieren sich an der Schichtgröße. Die Wahl hängt auch von der Aktivierung ab. So sollen Zwischenwerte und Gradienten beim Start in einer brauchbaren Größenordnung bleiben."],
        ],
        check: ["Warum sind gleiche Startgewichte für alle identisch angebundenen Neuronen ungünstig?", "Gleiche Aktivierungen und Rückmeldungen können zu gleichen Updates führen. Die Neuronen bleiben dann redundant."],
        source: deepLearningSources.networks,
      },
      {
        title: "Momentum und Adam einordnen",
        intro: "Optimierer können neben dem aktuellen Gradienten auch Informationen aus vorherigen Schritten verwenden. Dadurch ändert sich die Update-Regel.",
        sections: [
          ["Momentum glättet Richtungswechsel", "Momentum hält eine geglättete Richtung früherer Gradienten fest. Wiederholt in dieselbe Richtung zeigende Gradienten verstärken den Schritt in dieser Richtung. Wechselnde Gradienten können sich teilweise ausgleichen."],
          ["Adam passt Schritte pro Parameter an", "Adam verwendet laufende Schätzungen des Gradienten und seines Quadrats. So kann die effektive Schrittgröße zwischen Parametern variieren. Die gewählte Lernrate bleibt eine wichtige Einstellung und wird über geeignete Vergleichsläufe geprüft."],
        ],
        check: ["Was hältst du möglichst konstant, wenn du Adam gegen einfachen Gradientenabstieg vergleichst?", "Datenaufteilung, Architektur und ein vergleichbares Trainingsbudget. Die Lernrate testest du für die jeweiligen Optimierer auf denselben Validierungsbedingungen."],
        source: deepLearningSources.optimization,
      },
    ],
    practice: {
      title: "Einen instabilen Trainingsschritt verstehen",
      intro: "Für die Ziffernerkennung übst du zuerst an einem Gewicht mit einem bekannten Minimum. Mit „Acht Schritte ab Start vergleichen“ beginnst du für jede Lernrate wieder am selben Punkt.",
      lab: "training",
      questions: [
        { prompt: "Wo liegt w nach einem Schritt mit Lernrate 0,5 vom Startwert −2 aus?", answer: 1, options: ["Bei −4.", "Bei 0.", "Bei 2."], clue: "Der Gradient am Start ist −4. Ziehe die Hälfte dieses Gradienten von −2 ab.", explanation: "−2 − 0,5 × (−4) ergibt 0." },
        { prompt: "Was zeigt der Lauf mit Lernrate 2,1 gegenüber 0,5?", answer: 2, options: ["Der Verlust erreicht schneller das Minimum.", "Die Lernrate ändert den Verlustverlauf nicht.", "Das Gewicht überschießt das Minimum wiederholt und der Verlust steigt."], clue: "Teste beide Raten ab demselben Startwert und vergleiche den Verlauf der Balken.", explanation: "Der Abstand zum Minimum wächst bei jeder Aktualisierung um den Faktor 1,1. Der quadratische Verlust steigt entsprechend." },
        { prompt: "Was hältst du für diesen Lernratenvergleich gleich?", answer: 0, options: ["Startgewicht, Verlustfunktion und Schrittzahl.", "Das letzte Gewicht jedes Laufs.", "Nur die Farbe der Verlaufsbalken."], clue: "Der Lauf soll sich nur durch die getestete Lernrate unterscheiden.", explanation: "Gleicher Start und gleiche Schrittzahl machen sichtbar, welche Unterschiede von der Lernrate kommen." },
        { prompt: "Was bedeutet ein kleinerer Trainingsverlust für die Qualität auf neuen Handschriften?", answer: 2, options: ["Die neuen Bilder müssen nun richtig klassifiziert werden.", "Die Test-Accuracy lässt sich daraus direkt ablesen.", "Der Trainingsverlust zeigt Fortschritt auf den Trainingsdaten. Neue Handschriften brauchen eine eigene Prüfung."], clue: "Die Gewichtsänderung wurde an bekannten Beispielen bestimmt.", explanation: "Die Generalisierung wird auf getrennten Daten beurteilt. Trainingsfortschritt beantwortet eine andere Frage." },
      ],
      summary: "Du hast Parameterupdates nachgerechnet und gezeigt, wie sich unterschiedliche Lernraten am selben Startpunkt auswirken.",
    },
  },
  {
    id: "ueberanpassung-begrenzen", topic: "deep-learning", title: "Überanpassung erkennen und begrenzen",
    description: "Trenne die Datensätze, erkenne typische Verlustverläufe und wähle einen Modellstand anhand der Validierung.",
    lessons: [
      {
        title: "Training, Validierung und Test unterschiedlich einsetzen",
        intro: "Generalisierung beschreibt, wie gut ein Modell auf neuen Beispielen funktioniert. Dafür brauchst du Daten, die das Modell beim Lernen seiner Parameter noch nicht gesehen hat.",
        sections: [
          ["Parameter und Einstellungen getrennt wählen", "Trainingsdaten bestimmen die Gewichte. Validierungsdaten helfen bei Entscheidungen über Lernrate, Modellgröße und die beste Epoche. Ein unabhängiger Test misst die Qualität des ausgewählten Modells am Ende."],
          ["Testdaten für den Schluss aufheben", "Wer nach jedem Testwert das Modell verändert, verwendet den Test für die Auswahl. Halte Daten für eine echte Abschlussprüfung zurück, die diese Entscheidungen noch nicht beeinflusst haben."],
        ],
        check: ["Welcher Datensatz hilft dir, unter acht gespeicherten Modellständen einen auszuwählen?", "Der Validierungsdatensatz. Den Test verwendest du für die Abschlussprüfung des ausgewählten Stands."],
        source: deepLearningSources.splits,
      },
      {
        title: "Datenleckage vor dem Training verhindern",
        intro: "Ein Modell kann scheinbar gut abschneiden, weil Informationen aus der Prüfung versehentlich in das Training gelangen. Bei handgeschriebenen Ziffern passiert das leicht durch Wiederholungen oder Abwandlungen derselben Bilder.",
        sections: [
          ["Nach Schreibenden aufteilen", "Wenn es um neue Handschriften geht, bleiben alle Aufnahmen einer Person in derselben Teilmenge. Bilde die Teilmengen vor der Datenaugmentation. Sonst können Original und leicht gedrehte Kopie auf beiden Seiten auftauchen."],
          ["Datenaufbereitung nur am Training anpassen", "Wenn die Vorverarbeitung Mittelwert und Streuung aus Bildern schätzt, berechne beides auf den Trainingsbildern. Wende anschließend dieselben gespeicherten Zahlen auf Validierung und Test an."],
        ],
        check: ["Darf eine gedrehte Kopie eines Trainingsbilds zur Prüfung neuer Handschriften verwendet werden?", "Die Kopie gehört zum selben Ursprung wie das Trainingsbild. Ein solcher Test würde die Leistung auf neuen Handschriften überschätzen können."],
        source: deepLearningSources.splits,
      },
      {
        title: "Underfitting und Overfitting an Kurven erkennen",
        intro: "Der Trainingsverlust misst die Anpassung an die Trainingsdaten. Der Validierungsverlust zeigt, wie sich dieselbe Anpassung auf getrennte Beispiele auswirkt.",
        sections: [
          ["Eine zu schwache Anpassung erkennen", "Bleiben beide Verluste hoch, kann das Modell zu wenig Kapazität haben oder noch nicht ausreichend trainiert sein. Prüfe auch Lernrate und Datenqualität, bevor du die Ursache festlegst."],
          ["Wachsende Unterschiede untersuchen", "Sinkt der Trainingsverlust weiter, während der Validierungsverlust nach einem Minimum steigt, ist das ein typisches Anzeichen für Überanpassung. Vergleiche die Kurven über mehrere Epochen, weil einzelne Werte schwanken können."],
        ],
        check: ["Welche Entwicklung deutet eher auf Überanpassung hin: zwei hohe Verluste oder fallender Trainingsverlust bei wieder steigendem Validierungsverlust?", "Der zweite Verlauf. Das Modell passt sich weiter den Trainingsbeispielen an, während es bei den getrennten Beispielen schlechter wird."],
        source: deepLearningSources.overfitting,
      },
      {
        title: "Regularisierung und Augmentation einsetzen",
        intro: "Regularisierung soll die Generalisierung verbessern. Welche Methode hilft, hängt von der Aufgabe und den Daten ab.",
        sections: [
          ["Das Modell beim Training einschränken", "Eine L2-Strafe verteuert große Gewichte. Dropout blendet beim Training zufällig einzelne Aktivierungen aus. Beim regulären Vorhersagen werden die Aktivierungen nicht zufällig ausgeblendet."],
          ["Sinnvolle Bildvarianten erzeugen", "Kleine Verschiebungen und leichtes Drehen können die Daten erweitern, sofern das Ziffernlabel erhalten bleibt. Eine starke Drehung könnte eine 6 wie eine 9 aussehen lassen. Entscheide anhand der Validierung, ob die gewählte Augmentation hilft."],
        ],
        check: ["Was muss für eine Augmentation gelten, die das vorhandene Ziffernlabel beibehält?", "Das veränderte Bild muss weiterhin dieselbe Ziffer zeigen. Deshalb braucht die Umformung fachlich sinnvolle Grenzen."],
        source: deepLearningSources.networks,
      },
      {
        title: "Den besten Modellstand speichern",
        intro: "Bei frühem Stoppen beobachtest du die Validierung und speicherst den bisher besten Modellstand. Nach mehreren Epochen ohne relevante Verbesserung kannst du den Lauf beenden.",
        sections: [
          ["Stoppzeit und Auswahl unterscheiden", "Wenn das beste Ergebnis in Epoche 4 erreicht wurde und drei Epochen lang keine Verbesserung folgt, kann der Lauf nach Epoche 7 enden. Für die weitere Prüfung wird der gespeicherte Stand aus Epoche 4 geladen."],
          ["Läufe vergleichbar halten", "Prüfe verschiedene Maßnahmen anhand derselben Datenaufteilung und desselben Auswahlkriteriums. Übernimm den am besten validierten Stand zur abschließenden Prüfung auf den zurückgehaltenen Testdaten."],
        ],
        lab: "overfit",
        check: ["Welchen Stand wählst du, wenn der Trainingsverlust bis Epoche 8 fällt, der Validierungsverlust aber in Epoche 4 am niedrigsten war?", "Bei Auswahl nach Validierungsverlust verwendest du den gespeicherten Stand aus Epoche 4."],
        source: deepLearningSources.overfitting,
      },
    ],
    practice: {
      title: "Den Ziffernerkenner für neue Handschriften auswählen",
      intro: "Vergleiche zwei simulierte Trainingsläufe und finde in beiden den Modellstand mit dem kleinsten Validierungsverlust. Der Verein will später Aufnahmen neuer Teilnehmender verarbeiten.",
      lab: "overfit",
      questions: [
        { prompt: "Wie gestaltest du die Datenaufteilung für neue Handschriften?", answer: 2, options: ["Originale kommen ins Training, gedrehte Kopien in den Test.", "Alle Bilder kommen in alle Teilmengen.", "Bilder derselben Person bleiben gemeinsam in genau einer Teilmenge."], clue: "Die Prüfung soll zeigen, wie das Modell mit unbekannten Schreibenden umgeht.", explanation: "Eine gruppierte Aufteilung verhindert, dass das Modell dieselbe Handschrift in Training und Prüfung sieht." },
        { prompt: "Welche Epoche wählst du ohne zusätzliche Regularisierung nach niedrigstem Validierungsverlust?", answer: 0, options: ["Epoche 4.", "Epoche 6.", "Epoche 8."], clue: "Verfolge den Validierungsverlust bis Epoche 8. Der niedrigste Trainingsverlust ist hier kein Auswahlkriterium.", explanation: "Das Minimum ohne zusätzliche Regularisierung liegt in Epoche 4 bei 0,51." },
        { prompt: "Welcher Stand gewinnt in diesem Vergleich nach Validierungsverlust?", answer: 1, options: ["Der Lauf ohne zusätzliche Regularisierung in Epoche 8.", "Der stärker regularisierte Lauf in Epoche 6.", "Der stärker regularisierte Lauf in Epoche 1."], clue: "Vergleiche das Minimum der beiden Validierungsverläufe.", explanation: "Der stärker regularisierte Lauf erreicht 0,46 in Epoche 6. Das ist niedriger als 0,51 beim anderen Lauf." },
        { prompt: "Wann verwendest du die zurückgehaltenen Testbilder?", answer: 2, options: ["Jedes Mal, wenn sich die Trainingskurve ändert.", "Wenn du pro Modell die beste Epoche aussuchst.", "Für die Abschlussprüfung nach der Auswahl des Modellstands."], clue: "Die Entscheidungen über Modell und Einstellungen sollen ohne die Testbilder zustande kommen.", explanation: "Der unabhängige Test schätzt die Qualität des bereits ausgewählten Modells." },
      ],
      summary: "Du hast Datenleckage vermieden, Überanpassung in den Kurven erkannt und anhand der Validierung einen Modellstand gewählt.",
    },
  },
  {
    id: "modelle-bewerten", topic: "deep-learning", title: "Ein Modell bewerten und Fehler untersuchen",
    description: "Lies eine Konfusionsmatrix, prüfe verschiedene Kennzahlen und suche Fehler, die ein Gesamtwert verdeckt.",
    lessons: [
      {
        title: "Eine Konfusionsmatrix lesen",
        intro: "Eine Konfusionsmatrix zählt tatsächliche und vorhergesagte Klassen gemeinsam. In unseren Tabellen stehen die Labels in den Zeilen und die Vorhersagen in den Spalten.",
        sections: [
          ["Richtig und falsch zuordnen", "Zähle die Ziffer 7 als positiv und alle anderen Ziffern als negativ. Eine echte 7, die als andere Ziffer eingestuft wird, ist falsch negativ. Eine 1, die als 7 eingestuft wird, ist falsch positiv."],
          ["Mehrere Klassen getrennt sehen", "Für alle Ziffern kannst du auch eine Matrix mit einer Zeile und einer Spalte je Ziffer bilden. Auf der Hauptdiagonale stehen die Treffer. Abseits davon zeigen die Zellen, welche Ziffern das Modell besonders häufig verwechselt."],
        ],
        check: ["Wo zählst du eine echte 7, die das Modell als 1 einstuft?", "In der Zeile der echten Siebenen und der Spalte für die Vorhersage 1. Bei der Zweiteilung 7 oder andere ist das ein falsch negativer Fall."],
        source: deepLearningSources.evaluation,
      },
      {
        title: "Accuracy, Precision, Recall und F1 unterscheiden",
        intro: "Kennzahlen beantworten verschiedene Fragen. Wähle sie danach, welche Fehler in deiner Anwendung besonders wichtig sind.",
        sections: [
          ["Treffer aus zwei Blickwinkeln messen", "Accuracy ist der Anteil aller richtig eingeordneten Fälle. Precision für 7 fragt, welcher Anteil der als 7 markierten Bilder tatsächlich eine 7 zeigt. Recall für 7 fragt, welcher Anteil der tatsächlichen Siebenen gefunden wurde."],
          ["F1 und ungleiche Klassenhäufigkeit einordnen", "F1 ist das harmonische Mittel von Precision und Recall. Ein niedriger Wert in einer der beiden Größen zieht F1 deutlich nach unten. Wenn nur 20 von 100 Bildern eine 7 sind, erreicht „nie 7“ bei dieser Zweiteilung trotzdem 80 Prozent Accuracy und hat 0 Prozent Recall für 7."],
        ],
        check: ["Welche Kennzahl passt besonders, wenn du möglichst wenige echte Siebenen übersehen willst?", "Recall für die 7. Er misst, wie viele der vorhandenen Siebenen das Modell findet."],
        source: deepLearningSources.evaluation,
      },
      {
        title: "Eine Entscheidungsschwelle mit Fehlerkosten verbinden",
        intro: "Bei einer binären Entscheidung kann ein Modell „7“ ausgeben, sobald sein Wert für diese Klasse eine gewählte Schwelle erreicht.",
        sections: [
          ["Die Schwelle senken", "Bei feststehenden Modellwerten gelangen so mehr Bilder in die positive Klasse oder ihre Zahl bleibt gleich. Das kann mehr echte Siebenen erfassen und zugleich mehr andere Ziffern fälschlich markieren."],
          ["Den Zielkonflikt prüfen", "Der Verein kann zusätzliche manuelle Prüfungen akzeptieren, um weniger Siebenen zu übersehen. Wähle die Schwelle anhand eines Validierungssatzes und prüfe die festgelegte Einstellung anschließend auf getrennten Testdaten. Im Experiment dienen die Testzählungen nur zur Illustration."],
        ],
        lab: "metrics",
        check: ["Welche mögliche Nebenwirkung hat eine niedrigere Schwelle?", "Mehr andere Ziffern können als 7 markiert werden. Das kann zusätzliche manuelle Nachprüfungen erfordern."],
        source: deepLearningSources.evaluation,
      },
      {
        title: "Fehler in Teilgruppen untersuchen",
        intro: "Ein Gesamtwert kann verdecken, dass ein Modell mit einer bestimmten Handschrift oder Aufnahmeart Schwierigkeiten hat. Prüfe plausible Teilgruppen getrennt und behalte ihre Größe im Blick.",
        sections: [
          ["Muster in einzelnen Beispielen suchen", "Vergleiche übersehene Siebenen mit richtig erkannten. Hat die Fehlergruppe häufiger einen schwachen Kontrast oder einen versetzten Querstrich? Prüfe auch die Labels, bevor du eine Ursache zuschreibst."],
          ["Neue Daten und kleine Gruppen berücksichtigen", "Bei einer kleinen Gruppe ändern schon wenige Fehler den Prozentwert deutlich. Gib deshalb auch absolute Zahlen an. Bei einem späteren Lauf mit anderem Licht oder anderen Stiften kann sich die Datenverteilung ändern. Sammle dafür passende, neu gelabelte Beispiele und bewerte das Modell erneut."],
        ],
        check: ["Warum solltest du neben einem niedrigen Recall in einer Teilgruppe auch die Zahl der echten Siebenen angeben?", "Der Prozentwert kann auf wenigen Fällen beruhen. Die Anzahl hilft dir, das Ergebnis einzuordnen und geeignete zusätzliche Beispiele zu sammeln."],
        source: deepLearningSources.shift,
      },
    ],
    practice: {
      title: "Die übersehenen Siebenen finden",
      intro: "Die Ziffernerkennung soll wenige echte Siebenen übersehen. Vergleiche im Experiment beide Schwellen und untersuche dann die Gruppe neuer Schreibender. Die angezeigten 20 Bilder sind in den 100 Gesamtbildern enthalten.",
      lab: "metrics",
      questions: [
        { prompt: "Wie viele echte Siebenen übersieht das Modell bei Schwelle 0,7 in der Gesamtauswertung?", answer: 1, options: ["3.", "8.", "77."], clue: "Lies die Zeile der echten Siebenen und die Spalte für anders vorhergesagte Bilder.", explanation: "Acht echte Siebenen sind falsch negativ." },
        { prompt: "Was passiert beim Wechsel von 0,7 auf 0,4 für alle 100 Bilder?", answer: 2, options: ["Recall sinkt, und es gibt weniger falsch positive Fälle.", "Accuracy steigt und alle Fehler verschwinden.", "Recall steigt von 60 auf 85 Prozent, zugleich steigen die falsch positiven Fälle von 3 auf 9."], clue: "Vergleiche die gefundenen Siebenen und die anderen Ziffern, die als 7 markiert werden.", explanation: "Die niedrigere Schwelle findet mehr der 20 echten Siebenen und markiert gleichzeitig mehr andere Ziffern." },
        { prompt: "Was fällt bei neuen Schreibenden mit Schwelle 0,7 auf?", answer: 0, options: ["Nur 2 von 6 echten Siebenen werden erkannt. Der Recall ist niedriger als im Gesamtdatensatz.", "Alle 6 echten Siebenen werden erkannt.", "Es gibt in der Teilgruppe keine echten Siebenen."], clue: "Addiere die beiden Zellen der Zeile für echte Siebenen. Wie viele davon liegen in der Spalte „Als 7 vorhergesagt“?", explanation: "2 von 6 entsprechen ungefähr 33,3 Prozent, gegenüber 12 von 20 oder 60 Prozent in der Gesamtauswertung." },
        { prompt: "Wie gehst du mit dem auffälligen Teilgruppenergebnis um?", answer: 1, options: ["Du ignorierst es, solange die Gesamt-Accuracy hoch ist.", "Du prüfst Fehlerbilder und Labels, sammelst weitere passende Fälle und validierst Verbesserungen getrennt.", "Du meldest, dass genau ein bestimmter Schreibstil bewiesenermaßen die Ursache ist."], clue: "Die kleine Stichprobe zeigt ein Problem, liefert aber noch keine sichere Erklärung.", explanation: "Die Einzelbeispiele helfen bei der Ursachenanalyse. Zusätzliche Daten zeigen, ob sich das beobachtete Muster bestätigt." },
      ],
      summary: "Du hast die Fehlerarten unterschieden, einen Schwellenwert anhand seiner Folgen beurteilt und ein Problem in einer Teilgruppe gefunden.",
    },
  },
  {
    id: "ziffernerkenner-trainieren", topic: "deep-learning", title: "Einen kleinen Ziffernerkenner selbst trainieren",
    description: "Trainiere ein Mehrschichtnetz, vergleiche zwei Lernraten und teste es auf einer selbst gezeichneten Ziffer.",
    lessons: [
      {
        title: "Bilder und Labels für das Modell vorbereiten",
        intro: "Für den Sportverein verbinden wir die bisherigen Übungen zu einem kleinen Modell für die Ziffern 1, 4 und 7. Jedes Bild besteht aus 25 Pixeln. Eine bestätigte Ziffer dient als Label.",
        sections: [
          ["Pixel direkt verwenden", "Wir lesen jedes 5-mal-5-Bild zeilenweise ein. Das ergibt 25 Eingaben mit den Werten 0 für leer und 1 für Tinte. Acht verborgene Neuronen kombinieren diese Eingaben. Die Ausgabeschicht liefert drei Scores, einen pro Ziffer."],
          ["Beispiele vorab aufteilen", "Das Labor enthält 18 Trainingsbilder, sechs Validierungsbilder und neun zurückgehaltene Testbilder. Die Trainingsbilder gehen in die Gewichtsupdates ein. Die Validierungsbilder helfen beim Lernratenvergleich. Den Test hebst du bis zur Wahl eines Laufs auf. Die Bilder sind eigens erstellte Pixelmuster für die Übung."],
        ],
        check: ["Welche Form hat ein Batch aus sechs abgeflachten Bildern? Wie viele Scores liefert das Netz je Bild?", "Die Eingabematrix hat die Form (6, 25). Für jedes Bild liefert das Netz drei Klassenscores."],
        source: deepLearningSources.splits,
      },
      {
        title: "Das Netz schrittweise trainieren",
        intro: "Im Browser rechnet ein Mehrschichtnetz mit 25 Eingaben, acht verborgenen Neuronen mit tanh-Aktivierung und drei Ausgaben. Die zwei Trainingsläufe beginnen mit identischen Gewichten und verwenden dieselben Batches.",
        sections: [
          ["Ein Update ausführen", "Das Netz berechnet für sechs Bilder die Scores und daraus per Softmax die Klassenwahrscheinlichkeiten. Die mittlere Kreuzentropie bewertet, wie viel Wahrscheinlichkeit die richtigen Ziffern erhalten. Backpropagation berechnet die Gradienten beider Schichten, und der Gradientenabstieg aktualisiert ihre Gewichte und Bias-Terme."],
          ["Eine Epoche abschließen", "Drei Batches ergeben im Labor eine Epoche. Der Epochenknopf bearbeitet die noch offenen Batches der aktuellen Epoche. Vergleiche die beiden Lernraten nach derselben Anzahl an Updates. Ein geringerer Trainingsverlust zeigt, dass das Netz die Trainingsbilder besser anpasst. Für die Auswahl zählt auch der Verlust auf den Validierungsbildern."],
        ],
        check: ["Du hast ein Update ausgeführt und klickst auf „Epoche abschließen“. Wie viele Updates kommen hinzu?", "Zwei. Das erste Update hat bereits den ersten Batch verarbeitet. Nach insgesamt drei Updates hat das Netz alle Trainingsbilder einmal gesehen."],
        source: ["Dive into Deep Learning · Minibatch Stochastic Gradient Descent", "https://d2l.ai/chapter_optimization/minibatch-sgd.html"],
      },
      {
        title: "Das trainierte Modell auf neuen Bildern prüfen",
        intro: "Nach dem Lernratenvergleich wählst du einen Lauf aus und prüfst seinen aktuellen Modellstand auf den zurückgehaltenen Bildern. Ein einfacher Vergleich hilft dir, die Trefferzahl einzuordnen.",
        sections: [
          ["Die Baseline aus dem Training ableiten", "Die 1 kommt im Training häufiger vor als jede andere Klasse. Unsere Baseline sagt daher immer 1 voraus. Sie erzielt auf den neun Testbildern fünf Treffer. Vergleiche das Netz mit dieser Regel auf genau denselben Bildern und prüfe, ob es auch andere Ziffern korrekt erkennt."],
          ["Fehler und eigene Eingaben ausprobieren", "Ein falsches Testergebnis verrät, welches Bild und welche Ziffer das Netz verwechselt hat. Zeichne anschließend eine 1, 4 oder 7 und variiere beispielsweise die Position eines Strichs. Die Softmax-Werte zeigen, wie das Netz seine Vorhersage auf die drei verfügbaren Klassen verteilt. Bei ungewöhnlichen Formen können auch hohe Werte mit einer falschen Vorhersage einhergehen."],
        ],
        check: ["Warum wählst du die Lernrate anhand der Validierung, bevor du die Testbilder auswertest?", "Wenn du die Lernrate anhand der Testergebnisse änderst, fließt der Test in die Modellauswahl ein. Die abschließende Bewertung braucht dafür einen unabhängigen Datensatz."],
        source: ["Dive into Deep Learning · Implementation of Multilayer Perceptrons", "https://d2l.ai/chapter_multilayer-perceptrons/mlp-implementation.html"],
      },
    ],
    practice: {
      title: "Dein Ziffernerkenner im Trainingslabor",
      intro: "Trainiere beide Läufe jeweils fünf Epochen lang. Vergleiche die Validierungsverluste und wähle einen Lauf für die Abschlussprüfung. Sieh dir seine Fehlerbilder an und zeichne dann eine eigene Ziffer.",
      lab: "digits",
      questions: [
        { prompt: "Wie vergleichst du die Wirkung der beiden Lernraten?", answer: 1, options: ["Du verwendest andere Trainingsbilder für jeden Lauf.", "Du vergleichst bei gleichen Startgewichten, gleichen Batches und gleich vielen Updates.", "Du vergleichst grundsätzlich das erste Update eines Laufs mit dem letzten des anderen."], clue: "Außer der Lernrate sollen möglichst alle Bedingungen gleich sein.", explanation: "Beide Läufe starten gleich und sehen dieselben Batches. Gleiche Updatezahlen machen den Lernratenvergleich aussagekräftiger." },
        { prompt: "Wie viele Updates braucht eine vollständige Epoche ab ihrem Beginn?", answer: 2, options: ["Eines, weil der Knopf nur einmal gedrückt wird.", "Sechs, weil sechs Bilder in einem Batch liegen.", "Drei, weil 18 Bilder in Batches zu je sechs verarbeitet werden."], clue: "Ein Update verarbeitet einen Batch.", explanation: "18 geteilt durch 6 ergibt drei Updates pro Epoche." },
        { prompt: "Welcher Lauf hat in diesem Labor nach fünf Epochen den niedrigeren Validierungsverlust?", answer: 1, options: ["Lernrate 0,03.", "Lernrate 0,4.", "Beide haben denselben Verlust."], clue: "Vergleiche in der Tabelle die Spalte „Validierung“, sobald beide Läufe bei 15 Updates stehen.", explanation: "Im Labor liegt der Validierungsverlust nach fünf Epochen mit Lernrate 0,4 bei etwa 0,244 und mit 0,03 bei etwa 0,998. Das gilt für diese Daten und Startgewichte." },
        { prompt: "Warum erreicht „immer 1“ im Test fünf von neun Treffern?", answer: 0, options: ["Fünf der neun Testbilder haben das Label 1.", "Das Netz hat der Baseline fünf Vorhersagen gegeben.", "Die Baseline aktualisiert ihre Gewichte fünfmal."], clue: "Die Baseline trifft jedes Mal, wenn das tatsächliche Label mit ihrer konstanten Vorhersage übereinstimmt.", explanation: "Die Regel sagt für alle neun Bilder 1. Genau fünf davon zeigen eine 1." },
        { prompt: "Deine ungewöhnlich gezeichnete 4 wird mit einem hohen Softmax-Wert zur 7. Was zeigt das?", answer: 1, options: ["Der hohe Wert beweist, dass du eine 7 gezeichnet hast.", "Das Netz kann eine ungewohnte Eingabe mit hohem Wert falsch zuordnen.", "Die Zeichnung wurde automatisch als neues Beispiel zum Training hinzugefügt."], clue: "Vergleiche die vom Modell verteilten Werte mit dem tatsächlichen Label deiner Zeichnung.", explanation: "Der Softmax-Wert stammt aus den Scores des Netzes. Eine falsche Vorhersage kann dabei einen hohen Wert erhalten." },
      ],
      summary: "Du hast den Weg vom gelabelten Pixelbild über Gewichtsupdates bis zur Vorhersage und Fehleranalyse durchgespielt.",
    },
  },
  {
    id: "bilder-mit-cnns-erkennen", topic: "deep-learning", title: "Bilder mit CNNs erkennen",
    description: "Schiebe Filter über Ziffernbilder und trainiere ein kleines CNN auf den Beispielen aus dem Ziffernlabor.",
    lessons: [
      {
        title: "Lokale Muster mit einem Filter finden",
        intro: "Im vorigen Ziffernlabor sah das Netz jedes Bild als Liste von 25 Zahlen. Ein Convolutional Neural Network (CNN) nutzt zusätzlich die räumliche Anordnung. Ein kleiner Filter kann nach einem Strich oder einer Ecke suchen.",
        sections: [
          ["Ein Fenster berechnen", "Lege einen 3-mal-3-Filter über neun benachbarte Pixel. Multipliziere jeden Pixelwert mit dem Gewicht an derselben Stelle und addiere die Produkte. Ein Filter mit drei Einsen in der mittleren Reihe zählt beispielsweise die Tintenpixel in diesem waagerechten Ausschnitt."],
          ["Gewichte an allen Positionen teilen", "Schiebe denselben Filter über das Bild. Seine Ergebnisse bilden eine Merkmalskarte, auch Feature Map genannt. Ein senkrechter Strich kann dadurch an mehreren Stellen auf denselben Filter reagieren. Deep-Learning-Bibliotheken nennen diese Rechnung ohne Spiegelung des Filters meist Faltung."],
        ],
        check: ["Warum braucht derselbe 3-mal-3-Filter an der nächsten Stelle keine neun neuen Gewichte?", "Seine neun Gewichte werden an allen Positionen wiederverwendet. Das Fenster wählt lediglich andere Eingabepixel aus."],
        source: ["Dive into Deep Learning · Convolutions for Images", "https://d2l.ai/chapter_convolutional-neural-networks/conv-layer.html"],
      },
      {
        title: "Mit Padding und Stride die Kartengröße ändern",
        intro: "Padding ergänzt einen Rand um das Bild. Stride gibt an, um wie viele Pixel du den Filter je Schritt verschiebst. Beides bestimmt, an welchen Stellen der Filter rechnet.",
        sections: [
          ["Den Bildrand mitrechnen", "Ohne Rand hat das 3-mal-3-Fenster auf einem 5-mal-5-Bild drei mögliche Startpositionen pro Achse. Ein Nullrand von einem Pixel je Seite erweitert die Eingabe auf 7 mal 7. Bei Schrittweite 1 ergibt das fünf Startpositionen pro Achse."],
          ["Positionen überspringen", "Bei Schrittweite 2 testet das Fenster nur jede zweite Startposition. Bei 5 mal 5 Pixeln ohne Rand erhältst du dadurch eine 2-mal-2-Karte. Pro Achse gilt abgerundet (Eingabe + 2 × Padding − Filtergröße) / Stride, plus 1."],
        ],
        lab: "convolution",
        check: ["Welche Kartengröße ergibt sich bei 5 mal 5 Pixeln, 3-mal-3-Filter, Padding 1 und Stride 2?", "Drei Positionen pro Achse, also 3 mal 3. Die Eingabe mit Rand hat sieben Felder je Achse und das Fenster startet bei 0, 2 und 4."],
        source: ["Dive into Deep Learning · Padding and Stride", "https://d2l.ai/chapter_convolutional-neural-networks/padding-and-strides.html"],
      },
      {
        title: "Merkmalskarten verdichten und zur Klasse verbinden",
        intro: "Mehrere Filter erkennen verschiedene lokale Muster. Jeder Filter erzeugt eine eigene Karte. Aus diesen Karten lässt sich dann eine Ziffer vorhersagen.",
        sections: [
          ["Aktivierung und Pooling unterscheiden", "ReLU setzt negative Filterantworten auf null. Max-Pooling ersetzt mehrere benachbarte Werte durch ihren größten Wert. Das verdichtet die Karte und lässt die genaue Position innerhalb des Fensters weg. Zu starke Verdichtung kann für die Ziffer wichtige Unterschiede entfernen."],
          ["Den Klassifikationskopf anschließen", "Das kleine CNN im Praxislabor verwendet vier gelernte Filter, ReLU und eine dichte Ausgabeschicht. Vier Karten mit je neun Werten ergeben 36 Eingaben für die Ausgabeschicht. Das kleine Modell behält diese 36 Werte. Pooling probierst du separat im Filterexperiment aus."],
        ],
        check: ["Was ergibt Max-Pooling über die vier Werte 0, 1, 3 und 2?", "Der Wert 3. Innerhalb des Poolingfensters bleibt nur der größte Wert erhalten."],
        source: ["Dive into Deep Learning · Pooling", "https://d2l.ai/chapter_convolutional-neural-networks/pooling.html"],
      },
      {
        title: "Zwei Modellarchitekturen mit denselben Daten vergleichen",
        intro: "Das CNN und das dichte Netz aus der vorherigen Quest lösen dieselbe Aufgabe. Trainiere beide mit denselben Batches und demselben Updatebudget, um Unterschiede sichtbar zu machen.",
        sections: [
          ["Dasselbe Lernziel nutzen", "Beide Netze geben drei Scores für 1, 4 und 7 aus. Softmax und Kreuzentropie liefern denselben Typ von Verlust. Beim CNN fließen die Gradienten aus allen Kartenpositionen in die Gewichte des jeweiligen gemeinsamen Filters ein."],
          ["Testergebnisse einordnen", "Vergleiche die Validierungsverluste nach derselben Zahl an Epochen. Prüfe danach beide Netze auf denselben neun Bildern. Die kleine Stichprobe und die unterschiedlichen Startparameter begrenzen, was du daraus über die Modellfamilien ableiten kannst."],
        ],
        check: ["Was würdest du für einen belastbareren Vergleich ergänzen?", "Mehr repräsentative Testbilder und mehrere Läufe mit unterschiedlichen Startwerten. So hängt der Vergleich weniger von einer kleinen Stichprobe und einer einzelnen Initialisierung ab."],
        source: ["Dive into Deep Learning · Convolutional Neural Networks (LeNet)", "https://d2l.ai/chapter_convolutional-neural-networks/lenet.html"],
      },
    ],
    practice: {
      title: "Ein CNN für die Ziffern des Sportvereins trainieren",
      intro: "Trainiere beide Modelle fünf Epochen lang. Vergleiche zunächst die Verluste und werte dann die neun zurückgehaltenen Testbilder aus. Wähle einzelne Bilder, um gleiche und unterschiedliche Vorhersagen zu finden.",
      lab: "cnn",
      questions: [
        { prompt: "Warum erkennt ein Filter dasselbe lokale Muster an verschiedenen Bildstellen?", answer: 1, options: ["Jede Position bekommt unabhängig gelernte Filtergewichte.", "An jeder Position werden dieselben Filtergewichte benutzt.", "Die Filterwerte kommen aus den Klassenlabels."], clue: "Welche Zahlen bleiben gleich, wenn du das Fenster verschiebst?", explanation: "Die Gewichte gehören zum Filter. Nur die Pixel im Fenster ändern sich." },
        { prompt: "Wie groß ist die Karte für ein 5-mal-5-Bild mit 3-mal-3-Filter, Padding 0 und Stride 1?", answer: 0, options: ["3 mal 3.", "5 mal 5.", "2 mal 2."], clue: "Zähle die Startpositionen, an denen das Fenster ganz ins Bild passt.", explanation: "Pro Achse passen die Startpositionen 0, 1 und 2." },
        { prompt: "Welcher Knopf nutzt die neun zurückgehaltenen Bilder?", answer: 2, options: ["Beide fünf Epochen trainieren.", "Neu starten.", "Neun Testbilder auswerten."], clue: "Das Training verwendet für die Gewichtsänderungen ausschließlich die 18 Trainingsbilder.", explanation: "Die Testauswertung ruft die trainierten Netze zur Vorhersage auf und verändert ihre Gewichte nicht." },
        { prompt: "Welche Aussage erlaubt der Vergleich?", answer: 1, options: ["Das Modell mit mehr Treffern gewinnt bei allen Bildaufgaben.", "Die Treffer zeigen, wie diese beiden Läufe auf diesen neun Bildern abschneiden.", "Die Anzahl richtiger Bilder ist aus dem Trainingsverlust garantiert vorhersagbar."], clue: "Denke an Testgröße, Daten und Startparameter.", explanation: "Der Test ist ein anschaulicher Vergleich dieser Modellstände auf genau dieser Stichprobe." },
      ],
      summary: "Du hast räumliche Filter berechnet, ein CNN trainiert und seine Vorhersagen mit denen eines dichten Netzes verglichen.",
    },
  },
  {
    id: "tokens-und-embeddings", topic: "deep-learning", group: "Sprachmodelle und LLMs", title: "Text in Tokens und Embeddings übersetzen",
    description: "Zerlege Text in Zeichen und Teilwörter und sieh, wie aus Token-IDs Vektoren werden.",
    lessons: [
      {
        title: "Text mit einem Vokabular in Tokens zerlegen",
        intro: "Ein Sprachmodell rechnet mit Zahlen. Ein Tokenizer übersetzt Text in eine geordnete Liste von Einheiten und weist jeder Einheit eine ID aus seinem Vokabular zu.",
        sections: [
          ["Wörter, Zeichen und Teilwörter", "Ganze Wörter halten eine Sequenz kurz, brauchen aber viele Einträge und können an unbekannten Wörtern scheitern. Einzelne Zeichen lassen sich besser kombinieren, ergeben aber längere Sequenzen. Teilwörter bilden häufige Buchstabenfolgen als eigene Einheiten und können seltene Wörter aus kleineren Stücken zusammensetzen."],
          ["Die richtige ID zum Modell verwenden", "ID 17 bedeutet nur innerhalb eines bestimmten Vokabulars etwas. In einem anderen Tokenizer kann sie für ein anderes Token stehen. Das Modell muss bei Training und Nutzung dieselbe Zuordnung verwenden."],
        ],
        check: ["Ist die ID 17 dem Modell inhaltlich näher an der ID 18 als an ID 3?", "Die IDs sind Adressen im Vokabular. Aus dem Abstand der Zahlen folgt keine inhaltliche Beziehung."],
        source: ["Stanford CS336 · Language Modeling from Scratch", "https://cs336.stanford.edu/"],
      },
      {
        title: "Teilwörter mit Byte Pair Encoding lernen",
        intro: "Byte Pair Encoding (BPE) lernt eine feste Reihenfolge von Paarregeln. Unser Labor startet zur Veranschaulichung mit Zeichen und lernt die Regeln aus zwölf Sätzen.",
        sections: [
          ["Häufige Nachbarn zusammenführen", "Zähle benachbarte Paare in den Trainingswörtern, wähle ein häufigstes Paar und ersetze es durch ein gemeinsames Token. Zähle die Paare danach erneut. Eine spätere Regel kann ein schon zusammengefügtes Stück weiter vergrößern."],
          ["Regeln auf neuen Text anwenden", "Der neue Text bestimmt die Regeln beim Tokenisieren nicht neu. Er wird mit den gelernten Regeln in ihrer Reihenfolge zerlegt. Das Labor macht Text klein und verwendet für unbekannte Zeichen ⟨UNK⟩. Ein bytebasierter Tokenizer kann dagegen mit einem vollständigen Alphabet aus Bytes starten."],
        ],
        lab: "tokens",
        check: ["Warum kann das Labor ein zuvor ungesehenes Wort wie „modellbild“ in bekannte Bestandteile aufteilen?", "Die Regeln wirken auf Teile des Wortes. Der Tokenizer braucht keinen speziellen Vokabulareintrag für das ganze neue Wort."],
        source: ["Sennrich, Haddow und Birch · Neural Machine Translation of Rare Words with Subword Units", "https://arxiv.org/abs/1508.07909"],
      },
      {
        title: "Eine ID in einen trainierbaren Vektor nachschlagen",
        intro: "Die Einbettungstabelle enthält pro Token einen Vektor. Die ID wählt eine Zeile dieser Tabelle aus. Beim Training können die Vektoren zusammen mit den übrigen Modellparametern angepasst werden.",
        sections: [
          ["Die Form im Blick behalten", "Für fünf Eingabetokens und eine Einbettungsbreite von 64 entstehen fünf Vektoren mit je 64 Zahlen. Ein wiederholtes Token verwendet zunächst dieselbe Zeile. Informationen über Position und Kontext kommen in weiteren Berechnungen dazu."],
          ["Vektorähnlichkeit von ID-Abstand unterscheiden", "Die Kosinusähnlichkeit misst den Winkel zwischen zwei Vektoren. Im Labor zeigen „bild“ und „bilder“ in eine ähnliche Richtung, obwohl ihre IDs weit auseinanderliegen. Die Beispielvektoren wurden dafür von Hand gewählt. Bei trainierten Vektoren hängen Ähnlichkeiten von Daten und Trainingsziel ab."],
        ],
        check: ["Was ändert sich, wenn du die IDs und gleichzeitig die entsprechenden Tabellenzeilen umnummerierst?", "Die Lookup-Ergebnisse bleiben gleich, solange jedes Token weiterhin seinen ursprünglichen Vektor findet."],
        source: ["Jurafsky und Martin · Speech and Language Processing, Embeddings", "https://web.stanford.edu/~jurafsky/slp3/"],
      },
    ],
    practice: {
      title: "Vom Wort „modellbild“ zum Eingabevektor",
      intro: "Untersuche, wie sich bekannte Wörter und Wortteile tokenisieren lassen. Vergleiche danach die ID-Abstände und Vektorrichtungen aus dem Embedding-Experiment.",
      labs: ["tokens", "embeddings"],
      questions: [
        { prompt: "Was passiert im Experiment bei 0 BPE-Schritten?", answer: 0, options: ["Die bekannten Zeichen bleiben einzeln.", "Der gesamte Text wird zu einem Token.", "Das Modell lernt für jedes Wort einen neuen Vektor."], clue: "Ohne Paarregeln werden keine Nachbarn zusammengeführt.", explanation: "Der Labor-Tokenizer startet mit einzelnen Zeichen. Leerraum trennt die Wörter." },
        { prompt: "Warum passen „bild“ und „bilder“ im Vektorexperiment gut zusammen, obwohl ihre IDs weit auseinanderliegen?", answer: 2, options: ["Die höhere ID erhöht immer die Ähnlichkeit.", "Die Wörter werden automatisch in dasselbe Token umgeschrieben.", "Die Beispielvektoren zeigen ungefähr in dieselbe Richtung."], clue: "Die Kosinusähnlichkeit nutzt die Vektoren.", explanation: "Die Einbettungstabelle bestimmt die Vektoren. Die ID selbst dient als Schlüssel." },
        { prompt: "Welche Daten erhält die nächste Schicht bei fünf Tokens und Einbettungsbreite 64?", answer: 1, options: ["Eine einzige Zahl zwischen 0 und 64.", "Fünf Vektoren mit je 64 Zahlen.", "64 Vektoren mit je fünf Token-IDs."], clue: "Jedes Token schlägt genau eine Zeile nach.", explanation: "Die Sequenz behält ihre fünf Positionen. Jede Position hat jetzt 64 Merkmale." },
      ],
      summary: "Du hast Text zerlegt und erklärt, wie das Modell zu jeder Token-ID einen Eingabevektor erhält.",
    },
  },
  {
    id: "attention-und-transformer", topic: "deep-learning", group: "Sprachmodelle und LLMs", title: "Attention und Transformer verstehen",
    description: "Berechne, auf welche Token eine Position zugreift, und verfolge danach ihren Weg durch einen Transformer-Block.",
    lessons: [
      {
        title: "Mit Query, Key und Value Kontext zusammenstellen",
        intro: "Ein Token startet mit seinem Einbettungsvektor. Bei der Self-Attention werden daraus pro Position drei Vektoren berechnet. Sie heißen Query, Key und Value und erfüllen verschiedene Aufgaben.",
        sections: [
          ["Scores aus Query und Keys bilden", "Die Query ist die Eingabe für die Suche an der aktuellen Position. Ihr Skalarprodukt mit jedem Key ergibt einen Vergleichswert. Teile ihn durch die Wurzel der Key-Dimension. Die Skalierung begrenzt, wie stark große Dimensionen die Scores typischerweise anwachsen lassen."],
          ["Die Values gewichtet mischen", "Softmax macht aus den Scores Gewichte, die je Query zu 1 summieren. Der Kontextvektor ist die Summe der gewichteten Value-Vektoren. Welche Information übernommen wird, hängt daher sowohl von den Gewichten als auch von den Values ab."],
        ],
        check: ["Wie lautet der Kontextvektor für die Values [1, 0] und [0, 2] mit Gewichten 0,75 und 0,25?", "Er lautet [0,75; 0,5]. Multipliziere jeden Value mit seinem Gewicht und addiere komponentenweise."],
        source: ["Vaswani et al. · Attention Is All You Need", "https://arxiv.org/abs/1706.03762"],
      },
      {
        title: "Zukünftige Positionen kausal maskieren",
        intro: "Bei einem autoregressiven Sprachmodell soll jede Position nur auf sich selbst und das Vorherige zugreifen. Dafür setzt die kausale Maske Scores für zukünftige Positionen vor Softmax auf minus unendlich.",
        sections: [
          ["Die Matrix zeilenweise lesen", "Jede Zeile gehört zu einer Query. Innerhalb dieser Zeile steht jede Spalte für einen Key aus der Folge. Eine erlaubte Position kann auch ein sehr kleines Gewicht bekommen. Eine maskierte Position bekommt immer exakt null."],
          ["Beim Training keine Lösung vorwegnehmen", "Beim Training ist der ganze Satz vorhanden. Die Ausgabe für die Position „team“ soll trotzdem ohne Zugriff auf das spätere „prüft“ entstehen, wenn genau dieses Token das Lernziel ist. Die Maske erlaubt, mehrere Vorhersagen in einem Durchlauf zu berechnen und diese Regel einzuhalten."],
        ],
        lab: "attention",
        check: ["Welche Spalten sind in der Zeile der zweiten Position eines Texts mit vier Tokens erlaubt?", "Die erste und die zweite Spalte. Position 3 und 4 liegen in der Zukunft."],
        source: ["Vaswani et al. · Scaled Dot-Product Attention und Decoder-Maskierung", "https://arxiv.org/abs/1706.03762"],
      },
      {
        title: "Reihenfolge und mehrere Attention-Köpfe einbauen",
        intro: "In „das Team prüft das Modell“ und „das Modell prüft das Team“ kommen dieselben Wörter vor. Ihre Anordnung ändert, wer etwas prüft. Der Transformer braucht ein Signal für diese Anordnung.",
        sections: [
          ["Positionen in die Berechnung aufnehmen", "Eine Möglichkeit addiert Positionsvektoren zu den Einbettungen. Andere Varianten verändern Query und Key abhängig von ihrer Position. Zwei gleiche Tokens an verschiedenen Stellen starten mit derselben Token-Einbettung, können durch Position und Kontext aber verschiedene Repräsentationen erhalten."],
          ["Köpfe mit eigenen Projektionen nutzen", "Multi-Head Attention berechnet mehrere Attention-Ausgaben parallel. Jeder Kopf bildet Query, Key und Value mit eigenen gelernten Projektionen. Die Ausgaben werden zusammengeführt und erneut projiziert. So können Köpfe unterschiedliche Beziehungen berücksichtigen."],
        ],
        check: ["Was kann sich zwischen zwei Köpfen für dasselbe Token unterscheiden?", "Die Projektionen und damit die Scores, Gewichte und gewichteten Values können sich unterscheiden."],
        source: ["Dive into Deep Learning · Self-Attention and Positional Encoding", "https://d2l.ai/chapter_attention-mechanisms-and-transformers/self-attention-and-positional-encoding.html"],
      },
      {
        title: "Den Datenfluss durch einen Decoder-Block verfolgen",
        intro: "Bei einem Decoder-only-Transformer durchlaufen die Eingabevektoren mehrere Blöcke. Die kausale Attention in jedem Block bringt Informationen zwischen erlaubten Positionen zusammen.",
        sections: [
          ["Attention und Feedforward-Schicht verbinden", "Die Attention mischt Informationen aus mehreren Positionen. Ein Feedforward-Netz verarbeitet danach jede Position einzeln mit geteilten Parametern. Residualverbindungen addieren die Eingabe eines Teilschritts zu seiner Ausgabe. Layer Normalization stabilisiert die Verarbeitung. Wo genau normalisiert wird, hängt von der Architektur ab."],
          ["Aus dem letzten Block Scores erzeugen", "Eine lineare Ausgabeschicht übersetzt den Vektor an jeder Position in einen Score pro Vokabulareintrag. Für das Weiterführen eines Texts liest das Modell die Scores an der letzten Position. Das Experiment zeigt die Eingaben und Ausgaben eines einzelnen Blocks vor dieser Ausgabeschicht."],
        ],
        lab: "transformer",
        check: ["Welcher Teil des Blocks mischt Werte aus verschiedenen Positionen?", "Die Attention. Die Feedforward-Schicht verarbeitet jede Position für sich."],
        source: ["Dive into Deep Learning · The Transformer Architecture", "https://d2l.ai/chapter_attention-mechanisms-and-transformers/transformer.html"],
      },
    ],
    practice: {
      title: "Den Kontext für „das team prüft bilder“ berechnen",
      intro: "Untersuche die Query zur Position „team“. Schalte die Maske aus und wieder ein und ändere die Query. Vergleiche die Gewichte sowie den daraus berechneten Kontextvektor.",
      labs: ["attention", "transformer"],
      questions: [
        { prompt: "Welche Positionen sind für die Query „team“ bei aktiver kausaler Maske erlaubt?", answer: 1, options: ["Nur „bilder“.", "„das“ und „team“.", "„team“, „prüft“ und „bilder“."], clue: "Die aktuelle Position und alles davor bleiben sichtbar.", explanation: "„prüft“ und „bilder“ liegen danach und erhalten Gewicht null." },
        { prompt: "Was fließt am Ende als gewichtete Summe in den Kontextvektor ein?", answer: 2, options: ["Die Token-IDs.", "Die Keys.", "Die Values."], clue: "Die Key-Vektoren helfen zuerst, die Gewichte zu berechnen.", explanation: "Die Values liefern die Inhalte. Ihre Gewichte entstehen aus dem Vergleich von Query und Keys." },
        { prompt: "Bei aktiver Maske liegen die Werte für „das“ und „team“ bei [0; 1] und [1; 0]. Was passiert, wenn das Gewicht für „team“ steigt?", answer: 0, options: ["Die erste Komponente des Kontextvektors wächst.", "„bilder“ wird sichtbar.", "Die zweite Komponente wächst im gleichen Maß."], clue: "Nur der Value von „team“ hat in der ersten Komponente eine 1.", explanation: "Die erste Komponente entspricht in dieser Zeile dem Gewicht von „team“. Die zweite entspricht dem Gewicht von „das“." },
      ],
      summary: "Du hast Kontext aus Attention-Gewichten berechnet, die kausale Maske geprüft und die Rechnung im Transformer-Block eingeordnet.",
    },
  },
  {
    id: "sprachmodell-trainieren-und-generieren", topic: "deep-learning", group: "Sprachmodelle und LLMs", title: "Das nächste Token lernen und Text erzeugen",
    description: "Trainiere ein kleines Sprachmodell, beobachte seinen Verlust und erzeuge mit Greedy oder Sampling Schritt für Schritt Text.",
    lessons: [
      {
        title: "Aus einem Text Vorhersageziele erstellen",
        intro: "Beim Next-Token-Training liefert der Text selbst die Zielwerte. Zu jedem Präfix gehört das Token, das im Trainingssatz unmittelbar darauf folgt.",
        sections: [
          ["Eingabe und Ziel um eine Position verschieben", "Für „das team prüft bilder“ soll „das“ das Token „team“ vorhersagen. Nach „das team“ ist „prüft“ das Ziel. Ein Endtoken kann markieren, dass der Satz abgeschlossen ist. Beim Transformer sorgt die kausale Maske dafür, dass ein Ziel für diese Position nicht in die Eingabeberechnung gelangt."],
          ["Dasselbe Lernziel in einem kleineren Modell testen", "Das Browserlabor trainiert ein Bigramm-Modell. Es speichert für jedes zuletzt gesehene Token eine Zeile mit Scores für nächste Tokens. Hier zählt nur das letzte Wort. Ein Transformer kann einen längeren Kontext aus Einbettungen und Attention berücksichtigen und verwendet einen anderen Modellaufbau."],
        ],
        check: ["Was ist das Trainingsziel nach „das team“ im Satz „das team prüft die bilder“?", "Das nächste Token „prüft“. In diesem Beispiel entspricht ein Token einem ganzen Wort."],
        source: ["Jurafsky und Martin · Speech and Language Processing, Language Models", "https://web.stanford.edu/~jurafsky/slp3/"],
      },
      {
        title: "Die Kreuzentropie über viele Tokenpaare senken",
        intro: "Das Modell vergibt einen Score pro möglichem nächsten Token. Softmax bildet daraus Wahrscheinlichkeiten. Die Kreuzentropie zieht bei jedem Trainingspaar das tatsächliche nächste Token heran.",
        sections: [
          ["Mehrere mögliche Fortsetzungen lernen", "Im Korpus folgt auf „team“ dreimal „prüft“ und zweimal „trainiert“. Beide Fortsetzungen liefern ein Lernsignal. Beginnen alle Scores bei null, sind die Wahrscheinlichkeiten am Anfang gleich. Der Gradientenabstieg ändert die Scores anhand aller Paare."],
          ["Auch neue Kombinationen prüfen", "Die Validierung nutzt drei separate Sätze mit bekannten Wörtern in anderen Kombinationen. Seltene Übergänge können dort schlecht bewertet werden. Trainiere und vergleiche beide Verluste. Das Labor passt die Scores nur mit den zwölf Trainingssätzen an."],
        ],
        check: ["Warum kann es sinnvoll sein, dass nach „team“ mehrere Ausgaben Gewicht bekommen?", "Die Trainingssätze verwenden nach „team“ unterschiedliche Fortsetzungen. Das Modell lernt eine Verteilung über mögliche nächste Tokens."],
        source: ["Stanford CS336 · Language Modeling from Scratch", "https://cs336.stanford.edu/"],
      },
      {
        title: "Greedy und Sampling beim Generieren vergleichen",
        intro: "Bei der Generierung hängt das Modell das ausgewählte Token an den Text an. Dieser längere Text dient als Ausgangspunkt für die nächste Vorhersage. Dieser Ablauf heißt autoregressiv.",
        sections: [
          ["Ein Token auswählen", "Greedy wählt bei jedem Schritt das Token mit der höchsten Wahrscheinlichkeit. Sampling zieht zufällig aus der Verteilung. Deshalb können zwei Sampling-Durchläufe mit demselben Starttext auseinanderlaufen. Ein beim Training verwendetes Endtoken kann die Erzeugung beenden."],
          ["Temperatur und Kontext auseinanderhalten", "Für Sampling werden die Scores vor Softmax durch die Temperatur geteilt. Eine kleinere Temperatur verstärkt Unterschiede zwischen Scores. Eine größere verteilt mehr Gewicht auf Alternativen. Im Bigramm-Labor bestimmt nur das letzte Token die neuen Scores. Ein Transformer kann weitere vorherige Positionen für sie berücksichtigen."],
        ],
        check: ["Was übernimmt das Modell unmittelbar nach der Auswahl von „prüft“?", "Es hängt „prüft“ an und nutzt den neuen Kontext für den folgenden Schritt. Beim Bigramm-Modell ist das zuletzt gewählte Wort der ganze Modellkontext."],
        source: ["Jurafsky und Martin · Speech and Language Processing, Transformers and Pretraining", "https://web.stanford.edu/~jurafsky/slp3/"],
      },
    ],
    practice: {
      title: "Ein Modell mit zwölf kurzen Sätzen trainieren",
      intro: "Verfolge den Verlust vor und nach dem Training. Nimm dann „das team“ als Anfang und erzeuge Text zuerst mit Greedy, danach mit Sampling. Prüfe dabei, wann und warum sich die wahrscheinlichsten Fortsetzungen ändern.",
      lab: "language",
      questions: [
        { prompt: "Welches Zieltoken entsteht im Satz „das team prüft die bilder“ aus dem Präfix „das team“?", answer: 0, options: ["„prüft“.", "„team“.", "„bilder“."], clue: "Gesucht ist genau das nächste Token.", explanation: "Hinter „team“ folgt hier „prüft“. Erst nach dem längeren Präfix wird „die“ zum nächsten Ziel." },
        { prompt: "Welche Information nutzt das Modell im Labor für die Fortsetzung von „das team“?", answer: 2, options: ["Einen Transformer, der den ganzen Text verarbeitet.", "Alle bisherigen Sätze als direkte Eingabe bei jedem Klick.", "Die gelernte Score-Zeile des letzten Tokens „team“."], clue: "Das kleine Modell beschränkt sich auf ein vorhergehendes Token.", explanation: "Die Score-Zeile für „team“ bildet den Kontext des Bigramm-Modells." },
        { prompt: "Was kann eine höhere Temperatur bei Sampling bewirken?", answer: 1, options: ["Das Modell beginnt bei jedem Token ein neues Training.", "Alternativen zum Spitzenkandidaten bekommen bei unterschiedlichen Scores mehr Gewicht insgesamt.", "Die Auswahl ist nun immer Greedy."], clue: "Die Temperatur verändert die Unterschiede zwischen Scores vor Softmax.", explanation: "Höhere Temperatur flacht die Verteilung ab. Der jeweils höchste Score bleibt gleich eingeordnet, doch die anderen Tokens erhalten zusammen mehr Wahrscheinlichkeit." },
        { prompt: "Was passiert, wenn die Ausgabe das Endtoken auswählt?", answer: 0, options: ["Der aktuelle Textlauf stoppt.", "Die nächste Epoche beginnt.", "Die Gewichte werden zurückgesetzt."], clue: "Das Token markiert einen abgeschlossenen Satz.", explanation: "Es beendet die Generierung. Du kannst mit demselben Modell einen neuen Text beginnen." },
      ],
      summary: "Du hast Trainingsziele aus Text gebildet, den Lernfortschritt beobachtet und Text mit zwei Auswahlverfahren erzeugt.",
    },
  },
];
