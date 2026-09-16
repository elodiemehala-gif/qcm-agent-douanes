import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourcePath = path.join(root, 'drafts', 'Banque_QCM_Geographie_250_questions.md');
const outputPath = path.join(root, 'geography-curated-bank.txt');

const visuals = {
  'ordre-population-continents.svg': {
    alt: 'Comparaison visuelle de la population des continents',
    caption: 'Ordres de grandeur de la population des continents'
  },
  'oceans-et-mers.svg': {
    alt: 'Carte des principaux océans et mers du monde',
    caption: 'Les cinq océans et les principales mers'
  },
  'ordre-superficie-oceans.svg': {
    alt: 'Comparaison visuelle de la superficie des océans',
    caption: 'Ordres de grandeur de la superficie des océans'
  },
  'ordre-profondeurs-altitudes.svg': {
    alt: 'Comparaison à la même échelle de la fosse des Mariannes, de l’Everest et du mont Blanc',
    caption: 'Profondeurs et altitudes comparées à la même échelle'
  },
  'passages-maritimes.svg': {
    alt: 'Carte des grands détroits et canaux stratégiques',
    caption: 'Les principaux passages maritimes stratégiques'
  },
  'grands-massifs.svg': {
    alt: 'Carte des grandes chaînes de montagnes du monde',
    caption: 'Les grandes chaînes de montagnes dans le monde'
  },
  'ordre-longueur-chaines.svg': {
    alt: 'Comparaison visuelle de la longueur des grandes chaînes de montagnes',
    caption: 'Ordres de grandeur de la longueur des chaînes de montagnes'
  },
  'ordre-altitude-sommets.svg': {
    alt: 'Comparaison visuelle de l’altitude des grands sommets',
    caption: 'Ordres de grandeur de l’altitude des grands sommets'
  },
  'ordre-superficie-deserts.svg': {
    alt: 'Comparaison visuelle de la superficie des grands déserts',
    caption: 'Ordres de grandeur de la superficie des grands déserts'
  },
  'organisations-internationales-chronologie.svg': {
    alt: 'Frise chronologique et nature des principales organisations internationales',
    caption: 'Chronologie et rôle des principales organisations internationales'
  },
  'reliefs-france.svg': {
    alt: 'Carte des principaux reliefs et points culminants de la France',
    caption: 'Les principaux reliefs et points culminants français'
  },
  'fleuves-france.svg': {
    alt: 'Carte des principaux fleuves français et de leur embouchure',
    caption: 'Les principaux fleuves français'
  },
  'mers-france.svg': {
    alt: 'Carte des mers et océans bordant la France métropolitaine',
    caption: 'Les façades maritimes de la France métropolitaine'
  },
  'regions-capitales-france.svg': {
    alt: 'Carte des régions françaises et de leurs chefs-lieux',
    caption: 'Les régions françaises et leurs chefs-lieux'
  },
  'outre-mer-statuts-carte.svg': {
    alt: 'Carte des territoires ultramarins français classés par statut',
    caption: 'DROM, COM, TAAF et Nouvelle-Calédonie'
  }
};

function inRanges(number, ranges) {
  return ranges.some(([from, to = from]) => number >= from && number <= to);
}

function visualName(number) {
  if (inRanges(number, [[1], [5, 6], [9]])) return 'ordre-population-continents.svg';
  if (inRanges(number, [[11], [17], [20]])) return 'ordre-superficie-oceans.svg';
  if (number === 12) return 'ordre-profondeurs-altitudes.svg';
  if (inRanges(number, [[13, 16], [18, 19]])) return 'oceans-et-mers.svg';
  if (inRanges(number, [[21, 30]])) return 'passages-maritimes.svg';
  if (number === 31) return 'ordre-longueur-chaines.svg';
  if (inRanges(number, [[33], [35], [37, 38], [40]])) return 'ordre-altitude-sommets.svg';
  if (inRanges(number, [[32], [34], [36], [39], [41, 43]])) return 'grands-massifs.svg';
  if (inRanges(number, [[45, 47]])) return 'ordre-superficie-deserts.svg';
  if (inRanges(number, [[129, 138], [149, 160]])) return 'organisations-internationales-chronologie.svg';
  if (inRanges(number, [[161, 168]])) return 'reliefs-france.svg';
  if (inRanges(number, [[169, 174]])) return 'fleuves-france.svg';
  if (inRanges(number, [[175], [198], [229]])) return 'mers-france.svg';
  if (inRanges(number, [[211, 228]])) return 'regions-capitales-france.svg';
  if (inRanges(number, [[230, 240]])) return 'outre-mer-statuts-carte.svg';
  return null;
}

function parseMarkdown(markdown) {
  const questions = [];
  let chapter = '';
  let topicName = '';
  let current = null;
  let collectingExplanation = false;

  const finish = () => {
    if (!current) return;
    current.why = current.explanationLines.join(' ').replace(/\s+/g, ' ').trim();
    delete current.explanationLines;
    const image = visualName(current.number);
    if (image) {
      current.visual = {
        src: `assets/geography/${image}`,
        ...visuals[image]
      };
    }
    questions.push(current);
    current = null;
    collectingExplanation = false;
  };

  for (const rawLine of markdown.split(/\r?\n/)) {
    const line = rawLine.trim();
    const questionMatch = line.match(/^###\s+(\d+)\.\s+(.+)$/);
    if (questionMatch) {
      finish();
      const number = Number(questionMatch[1]);
      current = {
        id: `GEOV-${String(number).padStart(4, '0')}`,
        number,
        cat: 'Géographie',
        chapter,
        topicName,
        prompt: questionMatch[2].trim(),
        o: [],
        ans: null,
        explanationLines: []
      };
      continue;
    }

    if (line.match(/^##\s+(I|II)\./)) {
      finish();
      chapter = line.replace(/^##\s+/, '').trim();
      continue;
    }

    if (line.startsWith('### ') && !questionMatch) {
      finish();
      topicName = line.replace(/^###\s+/, '').trim();
      continue;
    }

    if (!current) continue;
    const optionMatch = line.match(/^([A-D])\.\s+(.+)$/);
    if (optionMatch) {
      const expected = String.fromCharCode(65 + current.o.length);
      if (optionMatch[1] !== expected) throw new Error(`Option ${optionMatch[1]} inattendue à la question ${current.number}`);
      current.o.push(optionMatch[2].trim());
      collectingExplanation = false;
      continue;
    }

    const answerMatch = line.match(/^\*\*Réponse\s*:\s*([A-D])\*\*$/);
    if (answerMatch) {
      current.ans = answerMatch[1].charCodeAt(0) - 65;
      collectingExplanation = false;
      continue;
    }

    const explanationMatch = line.match(/^\*\*Explication\s*:\*\*\s*(.*)$/);
    if (explanationMatch) {
      collectingExplanation = true;
      if (explanationMatch[1]) current.explanationLines.push(explanationMatch[1].trim());
      continue;
    }

    if (collectingExplanation && line) current.explanationLines.push(line);
  }
  finish();
  return questions;
}

function validate(questions) {
  if (questions.length !== 250) throw new Error(`250 questions attendues, ${questions.length} trouvées`);
  questions.forEach((question, index) => {
    const expected = index + 1;
    if (question.number !== expected) throw new Error(`Numérotation incorrecte : ${question.number} au lieu de ${expected}`);
    if (!question.chapter || !question.topicName || !question.prompt || !question.why) throw new Error(`Champ vide à la question ${question.number}`);
    if (question.o.length !== 4) throw new Error(`La question ${question.number} contient ${question.o.length} réponses`);
    if (new Set(question.o).size !== 4) throw new Error(`Réponses dupliquées à la question ${question.number}`);
    if (!Number.isInteger(question.ans) || question.ans < 0 || question.ans > 3) throw new Error(`Bonne réponse invalide à la question ${question.number}`);
    if (question.visual && !fs.existsSync(path.join(root, question.visual.src))) throw new Error(`Image manquante : ${question.visual.src}`);
    question.text = question.prompt;
    question.sourceText = question.why;
    question.curated = true;
  });
}

const markdown = fs.readFileSync(sourcePath, 'utf8');
const questions = parseMarkdown(markdown);
validate(questions);
const payload = Buffer.from(JSON.stringify(questions), 'utf8');
const encoded = zlib.gzipSync(payload, { level: 9, mtime: 0 }).toString('base64');
fs.writeFileSync(outputPath, `${encoded}\n`);

const illustrated = questions.filter(question => question.visual).length;
console.log(`Banque générée : ${questions.length} questions, ${illustrated} questions illustrées.`);
