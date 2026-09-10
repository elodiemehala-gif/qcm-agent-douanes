import fs from 'fs';

const source=fs.readFileSync('audit-qcm.mjs','utf8');
const hygieneMarker="load('source-hygiene-v27.js');";
const qcmMarker="load('structured-qcm-v26.js');";
if(!source.includes(hygieneMarker)||!source.includes(qcmMarker))throw new Error('Audit loader marker not found');
let patched=source.replace(hygieneMarker,`${hygieneMarker}\nload('source-hygiene-v28.js');\nload('source-hygiene-v28b.js');\nload('source-hygiene-v28c.js');\nload('source-hygiene-v28d.js');\nload('source-hygiene-v28e.js');\nload('source-hygiene-v28f.js');\nload('source-hygiene-v28g.js');\nload('source-hygiene-v28h.js');\nload('source-hygiene-v28i.js');\nload('source-hygiene-v28j.js');`);
patched=patched.replace(qcmMarker,`${qcmMarker}\nload('qcm-rescue-v29.js');\nload('qcm-rescue-v30.js');`);
const semanticLegacy="if(wc(s)<=5)return'term';if(/[.;:]$/.test(s)||wc(s)>=10)return'sentence';return'phrase';";
if(!patched.includes(semanticLegacy))throw new Error('Semantic audit marker not found');
patched=patched.replace(semanticLegacy,"return'text';");
const initialLegacy="const ca=o[q.ans],punctProbe=ca.replace(/J\\.-C\\./gi,'JC').replace(/\\b(?:av|apr)\\./gi,'');";
if(!patched.includes(initialLegacy))throw new Error('Broad-answer audit marker not found');
patched=patched.replace(initialLegacy,"const ca=o[q.ans],punctProbe=ca.replace(/J\\.-C\\./gi,'JC').replace(/\\b(?:av|apr)\\./gi,'').replace(/\\b[A-Z]\\.(?=\\s+[A-ZÀ-ÖØ-Ý])/g,'');");
const runtime='.audit-qcm-v30-runtime.mjs';
fs.writeFileSync(runtime,patched);
try{
  await import(`./${runtime}?t=${Date.now()}`);
}finally{
  fs.rmSync(runtime,{force:true});
}
