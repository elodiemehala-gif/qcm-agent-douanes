import fs from 'fs';
import zlib from 'zlib';
import vm from 'vm';

globalThis.window=globalThis;
function load(path){const code=fs.readFileSync(path,'utf8');vm.runInThisContext(code,{filename:path});}
load('knowledge-engine.js');
load('chapter-map.js');
load('qcm-engine-v8.js');
load('source-hygiene-v27.js');
load('qcm-quality-guard.js');
load('pedagogy-v11.js');
load('formulation-v13.js');
load('strict-qcm-v25.js');
load('structured-qcm-v26.js');

const chunks=[];for(let i=1;i<=12;i++)chunks.push(fs.readFileSync(`bank-${String(i).padStart(2,'0')}.txt`,'utf8').trim());
const p=JSON.parse(zlib.gunzipSync(Buffer.from(chunks.join(''),'base64')).toString('utf8'));
const cats=p.c,pref=['HIS','GEO','EMC','ACT','ORG','MAT','LOG','CG'],n=Array(cats.length).fill(0);
const raw=p.k.map(([ci,page,text])=>({ci,page,text,cat:cats[ci],id:`${pref[ci]}-${String(++n[ci]).padStart(4,'0')}`}));
const K=window.QSMART.enrich(raw);
const sourceBase=window.QSMART_SOURCE_BASE||K;

function rng(seed){let x=(seed>>>0)||1;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return((x>>>0)%1000000)/1000000}}
function helper(seed){const R=rng(seed),r=(a,b)=>Math.floor(R()*(b-a+1))+a,pick=a=>a[r(0,a.length-1)],sh=a=>{a=[...a];for(let i=a.length-1;i;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};return{r,pick,sh,gcd:(a,b)=>{while(b)[a,b]=[b,a%b];return Math.abs(a)},fmt:n=>String(Math.round(n*100)/100).replace('.',',')}}
const clean=s=>String(s??'').replace(/[\u00a0\u202f]/g,' ').replace(/\s+/g,' ').trim();
const wc=s=>clean(s).split(/\s+/).filter(Boolean).length;
const norm=s=>clean(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,"'");
const rootId=id=>(String(id||'').match(/^[A-Z]+-\d{4}/)||[String(id||'')])[0];
const banned=/\b(?:dans|selon) le cours\b|mentionné(?:e|es|s)? dans le cours|quelle (?:année|date|valeur|personne|période|information) (?:complète|complète correctement)|quel élément correspond à l[’']affirmation|quelle notion correspond à cette définition|quelle information complète|que faut-il associer|quelle proposition complète|_{3,}/i;
const meta=/^(?:quelle proposition (?:est correcte|décrit correctement|caractérise correctement|correspond)|quelle définition correspond|quel élément correspond|quelle information|quelle affirmation)/i;
function optType(v){const s=clean(v),t=s.replace(/(\d)\s(?=\d{3}\b)/g,'$1'),l=s.toLowerCase();if(/^(?:vers|en|à partir de)\s*[~−-]?\s*\d{1,5}\s*(?:av\.?\s*j\.?-?c\.?|apr\.?\s*j\.?-?c\.?)$/i.test(t))return'year';if(/^[-−]?\d{3,5}$/.test(t))return'year';if(/^[-−]?\d{1,5}\s*(?:av\.?\s*j\.?-?c\.?|apr\.?\s*j\.?-?c\.?)$/i.test(t))return'year';if(/^\s*(?:de\s+)?[-−]?\d{1,4}\s*[–—‑-]\s*[-−]?\d{1,4}\s*$/.test(t))return'period';if(/^\d+(?:[,.]\d+)?\s*%$/.test(t))return'percent';if(/^\d+(?:[,.]\d+)?(?:\s*(?:millions?|milliards?|milliers?|ans|km|m|cm|mm|€|euros?|habitants?|°c|kg|g|l))?$/i.test(t))return'number';if(/^(?:à|en|au|aux|dans|sur|entre|autour de)\s+/i.test(s)&&wc(s)<=12)return'place';if(/^(?:la|le|les|l’|l')?\s*(?:dgfip|dgddi|dgccrf|tracfin|insee|aft|bce|fmi|onu|otan|omc|ocde|arcom|cnil|anssi|dinum|conseil|cour|assemblée|sénat|parlement|gouvernement|commission|banque|agence|direction|ministère)/i.test(l)&&wc(s)<=12)return'institution';if(/^[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+(?:\s+[A-ZÀ-ÖØ-Ý][A-Za-zÀ-ÿ'’.-]+){1,3}$/.test(s))return'person';if(wc(s)<=5)return'term';if(/[.;:]$/.test(s)||wc(s)>=10)return'sentence';return'phrase';}
function issueList(q,x){const issues=[];if(!q){issues.push('no_question');return issues}const p=clean(q.prompt),o=Array.isArray(q.o)?q.o.map(clean):[];if(!p||!p.endsWith('?'))issues.push('prompt_not_question');if(banned.test(p))issues.push('banned_formulation');if(meta.test(p))issues.push('meta_formulation');if(o.length!==4)issues.push('not_four_options');if(new Set(o.map(norm)).size!==o.length)issues.push('duplicate_options');if(!(Number.isInteger(q.ans)&&q.ans>=0&&q.ans<o.length))issues.push('bad_answer_index');if(o.length===4){const types=o.map(optType),correct=types[q.ans],others=types.filter((_,i)=>i!==q.ans);if(others.some(t=>t!==correct))issues.push('mixed_semantic_types');const lens=o.map(wc),med=[...lens].sort((a,b)=>a-b)[1]||1,cl=lens[q.ans]||1;if(cl>Math.max(8,med*2.2)||cl*2.8<med)issues.push('correct_length_gives_clue');if(Math.max(...lens)>Math.max(12,Math.min(...lens)*3.2))issues.push('option_length_imbalance');const ca=o[q.ans],punctProbe=ca.replace(/J\.-C\./gi,'JC').replace(/\b(?:av|apr)\./gi,'');if(wc(ca)>24||/;\s*\S|[.!?]\s+\S/.test(punctProbe))issues.push('answer_too_broad');const source=norm(x.sourceText||x.text);if(!source.includes(norm(ca))&&wc(ca)<=12)issues.push('answer_not_literal_in_source');}
if(/\n/.test(String(q.prompt||'')))issues.push('multiline_prompt');return [...new Set(issues)];}

const grouped=new Map();
for(const x of K){const k=rootId(x.id);if(!grouped.has(k))grouped.set(k,[]);grouped.get(k).push(x)}
const rows=[];const issueCounts={};const byCat={};
for(let idx=0;idx<sourceBase.length;idx++){
 const r=sourceBase[idx],xs=grouped.get(rootId(r.id))||[],c=byCat[r.cat]||(byCat[r.cat]={facts:0,pass:0,noQuestion:0,flagged:0,sourceRejected:0});c.facts++;
 if(!xs.length){
   const issues=['source_rejected_or_removed'];issueCounts.source_rejected_or_removed=(issueCounts.source_rejected_or_removed||0)+1;c.flagged++;c.noQuestion++;c.sourceRejected++;
   rows.push({id:r.id,cat:r.cat,page:r.page,chapter:r.chapter||null,topic:r.topicName||null,source:r.sourceText||r.text,allPass:false,anyQuestion:false,issues,sourceRejected:true,variants:[]});
   continue;
 }
 const variants=[];let sourceAllPass=true,sourceAnyQuestion=false;const sourceIssues=[];
 for(let xi=0;xi<xs.length;xi++){
   const x=xs[xi],attempts=[];
   for(let a=0;a<4;a++){
     let q=null;try{q=window.QSMART.make(x,K,helper((idx+1)*7919+(xi+1)*131071+a*104729))}catch(e){attempts.push({error:String(e),issues:['exception']});continue}
     const issues=issueList(q,x);attempts.push({q:q?{prompt:q.prompt,o:q.o,ans:q.ans}:null,issues});
   }
   const union=[...new Set(attempts.flatMap(a=>a.issues))],allPass=attempts.every(a=>a.issues.length===0),anyQuestion=attempts.some(a=>a.q);
   sourceAllPass=sourceAllPass&&allPass;sourceAnyQuestion=sourceAnyQuestion||anyQuestion;sourceIssues.push(...union);
   variants.push({id:x.id,chapter:x.chapter,topic:x.topicName,source:x.sourceText||x.text,allPass,anyQuestion,issues:union,attempts});
 }
 const union=[...new Set(sourceIssues)];for(const z of union)issueCounts[z]=(issueCounts[z]||0)+1;
 if(sourceAllPass)c.pass++;else c.flagged++;if(!sourceAnyQuestion)c.noQuestion++;
 rows.push({id:r.id,cat:r.cat,page:r.page,chapter:variants[0]?.chapter||r.chapter||null,topic:variants[0]?.topic||r.topicName||null,source:r.sourceText||r.text,allPass:sourceAllPass,anyQuestion:sourceAnyQuestion,issues:union,sourceRejected:false,variants});
}
const summary={generatedAt:new Date().toISOString(),rawFragments:raw.length,sourceFacts:sourceBase.length,enrichedFacts:K.length,auditedSourceFacts:rows.length,categories:cats,byCat,issueCounts,fullyCompliant:rows.filter(r=>r.allPass).length,flagged:rows.filter(r=>!r.allPass).length,noQuestion:rows.filter(r=>!r.anyQuestion).length,withQuestion:rows.filter(r=>r.anyQuestion).length,sourceRejected:rows.filter(r=>r.sourceRejected).length};
fs.writeFileSync('audit-report.json',JSON.stringify({summary,rows},null,2));
fs.writeFileSync('audit-summary.json',JSON.stringify(summary,null,2));
console.log(JSON.stringify(summary,null,2));
