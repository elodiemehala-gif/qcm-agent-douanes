import fs from 'fs';

const source=fs.readFileSync('audit-qcm.mjs','utf8');
const hygieneMarker="load('source-hygiene-v27.js');";
const qcmMarker="load('structured-qcm-v26.js');";
if(!source.includes(hygieneMarker)||!source.includes(qcmMarker))throw new Error('Audit loader marker not found');
let patched=source.replace(hygieneMarker,`${hygieneMarker}\nload('source-hygiene-v28.js');\nload('source-hygiene-v28b.js');\nload('source-hygiene-v28c.js');\nload('source-hygiene-v28d.js');\nload('source-hygiene-v28e.js');\nload('source-hygiene-v28f.js');\nload('source-hygiene-v28g.js');\nload('source-hygiene-v28h.js');`);
patched=patched.replace(qcmMarker,`${qcmMarker}\nload('qcm-rescue-v29.js');`);
const runtime='.audit-qcm-v29-runtime.mjs';
fs.writeFileSync(runtime,patched);
try{
  await import(`./${runtime}?t=${Date.now()}`);
}finally{
  fs.rmSync(runtime,{force:true});
}
