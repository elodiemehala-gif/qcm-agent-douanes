import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bankPath = path.join(root, 'history-curated-bank.txt');

const timelineByChapter = new Map([
  ['I. Les fondements de la civilisation', '01-fondements-civilisation.svg'],
  ['II. La France des origines à la Révolution', '02-france-origines-revolution.svg'],
  ['III. Révolution française et Empire', '03-revolution-empire.svg'],
  ['IV. Le XIXe siècle', '04-xixe-siecle.svg'],
  ['V. Les guerres mondiales et les totalitarismes', '05-guerres-totalitarismes.svg'],
  ['VI. La France contemporaine', '06-france-contemporaine.svg'],
  ["VII. Présidents et hommes d’État à connaître", '07-presidents-hommes-etat.svg'],
  ['VIII. Révolutions, indépendances et monde contemporain', '08-revolutions-independances-monde.svg'],
  ['IX. Culture, arts et littérature', '09-culture-arts-litterature.svg'],
  ['X. Repères chronologiques fondamentaux', '10-reperes-chronologiques.svg']
]);

const encoded = fs.readFileSync(bankPath, 'utf8').trim();
const questions = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')).toString('utf8'));
if (questions.length !== 500) throw new Error(`500 questions attendues, ${questions.length} trouvées`);

const before = questions.map(question => JSON.stringify(question, (key, value) => key === 'visual' ? undefined : value));
for (const question of questions) {
  const filename = timelineByChapter.get(question.chapter);
  if (!filename) throw new Error(`Aucune frise pour le chapitre : ${question.chapter}`);
  const src = `assets/history/timelines/${filename}`;
  if (!fs.existsSync(path.join(root, src))) throw new Error(`Frise manquante : ${src}`);
  question.visual = {
    kind: 'timeline',
    src,
    alt: `Frise chronologique du chapitre ${question.chapter}`,
    caption: `Frise de repérage — ${question.chapter}`
  };
}

const after = questions.map(question => JSON.stringify(question, (key, value) => key === 'visual' ? undefined : value));
if (before.some((value, index) => value !== after[index])) throw new Error('Le contenu d’une question a été modifié');
if (new Set(questions.map(question => question.visual.src)).size !== 10) throw new Error('Les dix frises ne sont pas toutes utilisées');

const payload = Buffer.from(JSON.stringify(questions), 'utf8');
const output = zlib.gzipSync(payload, { level: 9, mtime: 0 }).toString('base64');
fs.writeFileSync(bankPath, `${output}\n`);
console.log('500 questions inchangées ; 10 frises chronologiques associées.');
