import fs from 'fs';

const source=fs.readFileSync('audit-qcm.mjs','utf8');
const marker="load('source-hygiene-v27.js');";
if(!source.includes(marker))throw new Error('Audit loader marker not found');
const patched=source.replace(marker,`${marker}\nload('source-hygiene-v28.js');\nload('source-hygiene-v28b.js');\nload('source-hygiene-v28c.js');\nload('source-hygiene-v28d.js');\nload('source-hygiene-v28e.js');\nload('source-hygiene-v28f.js');`);
const runtime='.audit-qcm-v28-runtime.mjs';
fs.writeFileSync(runtime,patched);
try{
  await import(`./${runtime}?t=${Date.now()}`);
}finally{
  fs.rmSync(runtime,{force:true});
}
