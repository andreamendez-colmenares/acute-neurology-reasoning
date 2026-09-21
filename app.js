"use strict";

const KEY = "acute_neurology_reasoning_v17";
const ONBOARD_KEY = "acute_neurology_reasoning_onboarded";
const THEMES = {
  all:"All presentations",
  focal:"Focal weakness / language change",
  found:"Found down / unclear onset",
  dizzy:"Dizziness / imbalance",
  hand:"Isolated limb dysfunction",
  seizure:"Seizure-like activity",
  ams:"Altered mental status",
  headache:"Headache / vomiting",
  legs:"Bilateral leg weakness"
};
const CASE_THEMES = {
  c1:["focal"], c2:["focal","found"], c3:["focal","found"], c4:["focal","found"],
  c5:["focal"], c6:["dizzy"], c7:["hand","focal"], c8:["focal"],
  c9:["headache","focal"], c10:["seizure","ams","focal"],
  c11:["legs"], c12:["ams"]
};

function freshState(){
  return {
    view:"home", caseId:null, startedAt:0, elapsed:0, timerRunning:false,
    tempo:null, localization:null, syndrome:null, hypothesisLevels:{}, reasoningUpdates:[], modelFramed:false,
    lastModelUpdateDataCount:0, reexamCount:0, actionsTaken:[], revealed:{}, pathwayChoice:null, finalDiagnosis:"", timeline:[], history:[], theme:"all"
  };
}
let S = freshState();
const $ = s => document.querySelector(s);

function load(){
  try{
    const old = localStorage.getItem(KEY);
    if(old) S = {...freshState(), ...JSON.parse(old)};
  }catch(_e){}
}
function save(){ try{localStorage.setItem(KEY, JSON.stringify(S));}catch(_e){} }
function getCase(){ return CASES.find(c=>c.id===S.caseId); }
function findAction(id){ return Object.values(ACTIONS).flat().find(a=>a.id===id); }
function fmtElapsed(ms){ const sec=Math.max(0,Math.floor(ms/1000)); return `${String(Math.floor(sec/60)).padStart(2,"0")}:${String(sec%60).padStart(2,"0")}`; }
function currentElapsed(){ return S.timerRunning ? S.elapsed + (Date.now()-S.startedAt) : S.elapsed; }
function stamp(){ return fmtElapsed(currentElapsed()); }
let timerId=null;
function startTimer(){ if(S.timerRunning) return; S.timerRunning=true; S.startedAt=Date.now(); save(); tick(); }
function stopTimer(){ if(!S.timerRunning) return; S.elapsed=currentElapsed(); S.timerRunning=false; clearInterval(timerId); timerId=null; save(); tick(); }
function tick(){ const el=$("#timer"); if(el) el.textContent=fmtElapsed(currentElapsed()); if(S.timerRunning&&!timerId) timerId=setInterval(()=>{const t=$("#timer");if(t)t.textContent=fmtElapsed(currentElapsed());},1000); }
function resetCaseTimer(){ S.elapsed=0;S.startedAt=0;S.timerRunning=false;clearInterval(timerId);timerId=null;tick(); }
function htmlSafe(v){ const d=document.createElement("div"); d.textContent=String(v??""); return d.innerHTML; }
function titleFor(list,id){ return (list.find(x=>x.id===id)||{}).title || "Not recorded"; }
function probLabel(id){ return (PROB_LEVELS.find(x=>x.id===id)||{}).label || "Not set"; }

function setView(view){ S.view=view; save(); render(); }
function render(){
  const app=$("#app"), mobile=$("#mobileActions"), label=$("#caseLabel");
  if(mobile) mobile.hidden = true;
  if(S.view==="home"){
    label.textContent="Home"; resetCaseTimer(); renderHome(app);
  }else if(S.view==="case"){
    const c=getCase(); if(!c){S.view="home";return render();}
    label.textContent=`Case ${c.n}`; renderCase(app,c); tick();
  }else{
    const c=getCase(); label.textContent=c?`Case ${c.n}`:"Debrief"; renderDebrief(app,c);
  }
}

function renderHome(app){
  const filtered=S.theme==="all"?CASES:CASES.filter(c=>(CASE_THEMES[c.id]||[]).includes(S.theme));
  app.innerHTML=`
    <section class="hero minimal-home">
      <h1>ACUTE NEUROLOGY REASONING</h1>
      <p>Interactive cases for practicing neurologic reasoning in acute consultation.</p>
      <div class="home-sequence" aria-label="Case workflow"><span>Understand</span><i>→</i><span>Frame</span><i>→</i><span>Gather</span><i>→</i><span>Update</span><i>→</i><span>Finalize</span></div>
      <div class="home-cta"><button class="primary" id="randomCase">Start a case</button><button class="secondary" id="resumeCase" ${S.caseId?'':'hidden'}>Resume case</button><button class="ghost" id="howItWorks">How it works</button></div>
    </section>
    <div class="home-toolbar">
      <label class="filter-control"><span>Filter by presentation</span><select id="themeSelect">${Object.entries(THEMES).map(([id,label])=>`<option value="${id}" ${S.theme===id?'selected':''}>${label}</option>`).join('')}</select></label>
    </div>
    <div class="section-title">Cases</div>
    <div class="case-grid">${filtered.map(c=>`<button class="case-card" data-case="${c.id}"><span class="case-kicker">Case ${c.n}</span><h3>${caseName(c)}</h3></button>`).join('')}</div>`;
  $("#randomCase").onclick=()=>startCase(filtered[Math.floor(Math.random()*filtered.length)].id);
  const resume=$("#resumeCase"); if(resume) resume.onclick=()=>{S.view="case"; if(!S.timerRunning){S.startedAt=Date.now();S.timerRunning=true;} save();render();};
  $("#themeSelect").onchange=e=>{S.theme=e.target.value;save();render();};
  $("#howItWorks").onclick=()=>openOnboardingSheet(false);
  app.querySelectorAll("[data-case]").forEach(b=>b.onclick=()=>startCase(b.dataset.case));
}
function caseName(c){
  const names={
    c1:"Sudden loss of speech and right-sided weakness",
    c2:"Found unable to speak with right-sided weakness",
    c3:"Unable to speak with right-sided weakness, onset unclear",
    c4:"Found with left-sided weakness and poor attention to the left",
    c5:"Sudden somnolence, abnormal eye position, and weakness",
    c6:"Sudden severe vertigo and inability to sit",
    c7:"Sudden loss of right-hand function",
    c8:"Sudden loss of speech and right-sided weakness with severe hypertension",
    c9:"Sudden severe headache, vomiting, and weakness",
    c10:"Weakness after a witnessed convulsion",
    c11:"New bilateral leg weakness after critical illness",
    c12:"Fluctuating confusion in the hospital"
  };
  return names[c.id]||`Case ${c.n}`;
}
function openOnboardingSheet(markSeen=true){
  showSheet("","How each case works",`<div class="onboard-steps">
    <div><b>1</b><span><strong>Understand</strong><small>Read the reason for consultation, context, and presentation.</small></span></div>
    <div><b>2</b><span><strong>Frame</strong><small>Define pace, localization, syndrome, and an initial differential.</small></span></div>
    <div><b>3</b><span><strong>Gather</strong><small>Choose targeted history, examination, or tests that could change your model.</small></span></div>
    <div><b>4</b><span><strong>Update</strong><small>Revise the model when new information meaningfully changes it.</small></span></div>
    <div><b>5</b><span><strong>Finalize</strong><small>State your working interpretation and management. Uncertainty is allowed.</small></span></div>
  </div><div class="sheet-actions"><button class="primary" id="beginCase">${S.view==="case"?'Begin case':'Close'}</button></div>`);
  $("#beginCase").onclick=()=>{if(markSeen){try{localStorage.setItem(ONBOARD_KEY,"1");}catch(_e){}}closeSheet();};
}

function startCase(id){
  const history=S.history||[]; const theme=S.theme||"all";
  S=freshState(); S.history=history; S.theme=theme; S.caseId=id; S.view="case"; S.timeline=[];
  save(); startTimer(); render();
  try{ if(!localStorage.getItem(ONBOARD_KEY)) openOnboardingSheet(true); }catch(_e){}
}

function dataCount(){ return S.actionsTaken.length + S.reexamCount; }
function hasNewData(){ return S.modelFramed && dataCount()>S.lastModelUpdateDataCount; }
function canFinalize(){ return S.modelFramed && dataCount()>0; }
function workflowHTML(){
  const gathered=dataCount()>0, updated=S.reasoningUpdates.length>0;
  let active=0;
  if(!S.modelFramed) active=0;
  else if(!gathered) active=2;
  else if(hasNewData()) active=3;
  else active=2;
  const steps=[
    {label:"Understand",done:S.modelFramed},
    {label:"Frame",done:S.modelFramed},
    {label:"Gather",done:gathered},
    {label:"Update",done:updated&&!hasNewData()},
    {label:"Finalize",done:false}
  ];
  return `<div class="workflow-strip">${steps.map((x,i)=>`<div class="workflow-step ${x.done?'done':''} ${i===active?'active':''}"><span>${x.done?'✓':i+1}</span><b>${x.label}</b></div>`).join('')}</div>`;
}
function nextStepHTML(){
  if(!S.modelFramed) return `<section class="next-step-card"><div><div class="eyebrow">Start here</div><h2>Frame the neurologic problem</h2><p>Use only what is available now. Define the pace, localization, syndrome, and initial differential before gathering more data.</p></div><button class="primary" id="nextFrame">Frame the syndrome</button></section>`;
  if(dataCount()===0) return `<section class="next-step-card"><div><div class="eyebrow">Next step</div><h2>Test your working model</h2><p>Choose targeted history, examination, or testing that could meaningfully change the localization or differential.</p></div><button class="primary" id="nextGather">Gather data</button></section>`;
  if(hasNewData()) return `<section class="next-step-card"><div><div class="eyebrow">New information</div><h2>Does this change your model?</h2><p>Update the differential if the new finding changes its relative likelihood. Revise the full frame if localization or syndrome has changed.</p></div><div class="next-step-actions"><button class="primary" id="nextUpdate">Update model</button><button class="secondary" id="nextGather">Gather more data</button>${canFinalize()?'<button class="ghost" id="nextFinalize">Finalize instead</button>':''}</div></section>`;
  return `<section class="next-step-card"><div><div class="eyebrow">Working model updated</div><h2>Continue or finalize</h2><p>Gather more information if it could change your model. If the assessment is sufficiently developed, finalize it.</p></div><div class="next-step-actions"><button class="secondary" id="nextGather">Gather more data</button>${canFinalize()?'<button class="primary" id="nextFinalize">Finalize assessment</button>':''}</div></section>`;
}
function wireNextStep(){
  const f=$("#nextFrame"); if(f)f.onclick=()=>openModelSheet(true);
  const g=$("#nextGather"); if(g)g.onclick=()=>openSheet("gather");
  const u=$("#nextUpdate"); if(u)u.onclick=openUpdateSheet;
  const z=$("#nextFinalize"); if(z)z.onclick=openFinalizeSheet;
}

function renderCase(app,c){
  const r=reasoningFor(c);
  app.innerHTML=`<section class="case-flow">
    ${workflowHTML()}
    <div class="patient-banner">
      <div class="case-kicker">Case ${c.n}</div>
      <div class="activation-line"><span>Reason for consultation</span><strong>${htmlSafe(c.activation||caseName(c))}</strong></div>
      <div class="context-line"><span>Context</span><p>${htmlSafe(c.context||"")}</p></div>
      <div class="presentation-line"><span>Presentation</span><p>${htmlSafe(c.presentation||c.arrival)}</p></div>
    </div>
    ${nextStepHTML()}
    ${S.modelFramed?`<section class="case-body">
      <div class="timeline-panel">
        <div class="timeline-head"><h2>Clinical timeline</h2></div>
        <div class="timeline">${S.timeline.map(renderEvent).join('')}</div>
      </div>
      <aside class="workspace-side">
        <div class="panel model-panel">
          <div class="panel-head"><div><div class="eyebrow">Working model</div></div><button class="ghost" id="editModel">Revise</button></div>
          ${workingModelHTML(r)}
        </div>
      </aside>
    </section>`:''}
  </section>`;
  const edit=$("#editModel"); if(edit)edit.onclick=()=>openModelSheet(false);
  wireNextStep();
}

function renderEvent(e){ return `<article class="event ${e.kind||''}"><div class="event-meta"><span class="event-time">${htmlSafe(e.time)}</span><span class="event-type">${htmlSafe(e.type)}</span></div><h3>${htmlSafe(e.title)}</h3><p>${e.text||''}</p></article>`; }
function workingModelHTML(r){
  if(!S.modelFramed) return `<p class="empty-model">Not yet framed.</p>`;
  const rows=[
    S.tempo?`<div class="model-row"><span>Pace</span><b>${htmlSafe(titleFor(TEMPOS,S.tempo))}</b></div>`:'',
    S.localization?`<div class="model-row"><span>Localization</span><b>${htmlSafe(titleFor(LOCALIZATIONS,S.localization))}</b></div>`:'',
    S.syndrome?`<div class="model-row"><span>Syndrome</span><b>${htmlSafe(titleFor(SYNDROMES,S.syndrome))}</b></div>`:''
  ].join('');
  const diffs=r.hypotheses.filter(h=>S.hypothesisLevels[h]).map(h=>`<div class="diff-row"><span>${htmlSafe(h)}</span><span class="prob">${probLabel(S.hypothesisLevels[h])}</span></div>`).join('');
  return `<div class="model-rows">${rows}</div>${diffs?`<div class="diff-list"><div class="model-subhead">Differential</div>${diffs}</div>`:''}`;
}

function openSheet(kind){
  if(kind==="gather") return openActionSheet("Gather data",[["history","Ask"],["bedside","Examine"],["imaging","Imaging"],["other","Other tests / resources"]]);
  if(kind==="ask") return openActionSheet("Ask",[["history","History and collateral"]]);
  if(kind==="examine") return openActionSheet("Examine",[["bedside","Bedside examination"]]);
  if(kind==="test") return openActionSheet("Tests",[["imaging","Imaging"],["other","Other tests / resources"]]);
}
function showSheet(eyebrow,title,html){
  $("#sheetEyebrow").textContent=eyebrow||""; $("#sheetTitle").textContent=title; $("#sheetBody").innerHTML=html; const d=$("#sheet"); if(!d.open)d.showModal();
}
function closeSheet(){ const d=$("#sheet"); if(d.open)d.close(); }

function openActionSheet(title,sections){
  const c=getCase();
  const html=sections.map(([key,label])=>{
    const available=ACTIONS[key].filter(a=>Object.prototype.hasOwnProperty.call(c.r,a.id) || a.id==="reexam");
    if(!available.length) return "";
    return `<section class="sheet-section"><h3>${label}</h3><div class="action-list">${available.map(a=>actionButtonHTML(a,c)).join('')}</div></section>`;
  }).join('');
  showSheet("",title,html);
  $("#sheetBody").querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>doAction(b.dataset.action));
}
function actionButtonHTML(a,c){
  const used=!a.repeatable&&S.actionsTaken.includes(a.id); const available=Object.prototype.hasOwnProperty.call(c.r,a.id) || a.id==="reexam";
  return `<button class="action-card ${used?'used':''}" data-action="${a.id}" ${used||!available?'disabled':''}>${a.label}${used?'<small>Already reviewed</small>':(!available?'<small>Not available in this case</small>':'')}</button>`;
}
function doAction(id){
  if(id==="reexam") return doReexam();
  const c=getCase(), a=findAction(id); if(!c||!a||S.actionsTaken.includes(id)) return;
  const text=c.r[id]||"No additional information is available.";
  S.actionsTaken.push(id); S.revealed[id]=text; S.timeline.push({time:stamp(),type:actionType(id),title:a.label,text:text}); save(); closeSheet(); render();
}
function actionType(id){ if(ACTIONS.history.some(a=>a.id===id))return"History"; if(ACTIONS.imaging.some(a=>a.id===id))return"Imaging"; if(ACTIONS.other.some(a=>a.id===id))return id==="eeg"?"EEG":"Other"; return"Examination"; }
function doReexam(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  const idx=Math.min(S.reexamCount,Math.max(0,r.reexam.length-1)); const text=r.reexam[idx]||"No major interval change on repeat examination.";
  S.reexamCount++; S.timeline.push({time:stamp(),type:"Re-examination",title:`Repeat neurologic examination${S.reexamCount>1?` #${S.reexamCount}`:''}`,text}); save(); closeSheet(); render();
}

function openModelSheet(first){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  const locs=(r.localizationOptions||LOCALIZATIONS.map(x=>x.id)).map(id=>LOCALIZATIONS.find(x=>x.id===id)).filter(Boolean);
  const syns=(r.syndromeOptions||SYNDROMES.map(x=>x.id)).map(id=>SYNDROMES.find(x=>x.id===id)).filter(Boolean);
  showSheet("",first?"Frame the syndrome":"Working model",`
    <section class="sheet-section"><h3>How did this happen?</h3><div class="choice-list">${TEMPOS.map(x=>radioHTML("tempo",x.id,x.title,x.desc,S.tempo)).join('')}</div></section>
    <section class="sheet-section"><h3>Where is it?</h3><div class="choice-list">${locs.map(x=>radioHTML("localization",x.id,x.title,x.desc,S.localization)).join('')}</div></section>
    <section class="sheet-section"><h3>What syndrome does that produce?</h3><div class="choice-list">${syns.map(x=>radioHTML("syndrome",x.id,x.title,x.desc,S.syndrome)).join('')}</div></section>
    <section class="sheet-section"><h3>What causes that syndrome in this context?</h3>${probBoardHTML(r.hypotheses,S.hypothesisLevels,"modelprob")}</section>
    <div class="sheet-actions"><button class="secondary" id="cancelModel">Close</button><button class="primary" id="saveModel">Save working model</button></div>`);
  $("#cancelModel").onclick=closeSheet;
  $("#sheetBody").querySelectorAll("[data-prob-group]").forEach(wireProbGroup);
  $("#saveModel").onclick=()=>{
    const tempo=getChecked("tempo"), loc=getChecked("localization"), syn=getChecked("syndrome");
    const levels=readProbGroups("modelprob");
    let warn=$("#modelWarning");
    if(!warn){ warn=document.createElement("div"); warn.id="modelWarning"; warn.className="note warning"; $("#saveModel").closest(".sheet-actions").before(warn); }
    if(!tempo||!loc||!syn||!Object.keys(levels).length){ warn.textContent="Complete pace, localization, syndrome, and at least one differential estimate before continuing."; return; }
    warn.remove();
    S.tempo=tempo;S.localization=loc;S.syndrome=syn; S.hypothesisLevels={...S.hypothesisLevels,...levels};
    const wasFramed=S.modelFramed; S.modelFramed=true;
    if(wasFramed){S.lastModelUpdateDataCount=dataCount();S.reasoningUpdates.push({time:stamp(),levels:{...S.hypothesisLevels}});}
    S.timeline.push({time:stamp(),type:"Reasoning",title:first?"Initial working model":"Working model revised",text:reasoningSummaryText(r),kind:"reasoning"}); save();closeSheet();render();
  };
}
function radioHTML(name,id,title,desc,selected){return `<label class="choice-option"><input type="radio" name="${name}" value="${id}" ${selected===id?'checked':''}><b>${title}</b><span>${desc}</span></label>`;}
function getChecked(name){const el=document.querySelector(`input[name="${name}"]:checked`);return el?el.value:null;}
function probBoardHTML(hypotheses,levels,prefix){return `<div class="prob-board">${hypotheses.map((h,i)=>`<div class="prob-group" data-prob-group="${prefix}-${i}" data-hyp="${htmlSafe(h)}"><div class="prob-label">${htmlSafe(h)}</div><div class="prob-choices">${PROB_LEVELS.map(p=>`<button type="button" class="prob-choice ${levels[h]===p.id?'selected':''}" data-level="${p.id}">${p.label}</button>`).join('')}</div></div>`).join('')}</div>`;}
function wireProbGroup(group){ group.querySelectorAll(".prob-choice").forEach(b=>b.onclick=()=>{group.querySelectorAll(".prob-choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");}); }
function readProbGroups(prefix){ const out={}; document.querySelectorAll(`[data-prob-group^="${prefix}-"]`).forEach(g=>{const b=g.querySelector(".prob-choice.selected");if(b)out[g.dataset.hyp]=b.dataset.level;});return out; }
function reasoningSummaryText(r){
  const parts=[]; if(S.tempo)parts.push(`Pace: ${titleFor(TEMPOS,S.tempo)}`); if(S.localization)parts.push(`Localization: ${titleFor(LOCALIZATIONS,S.localization)}`); if(S.syndrome)parts.push(`Syndrome: ${titleFor(SYNDROMES,S.syndrome)}`);
  const d=r.hypotheses.filter(h=>S.hypothesisLevels[h]).map(h=>`${h}: ${probLabel(S.hypothesisLevels[h])}`); if(d.length)parts.push(`Differential: ${d.join("; ")}`); return htmlSafe(parts.join(" · "));
}

function shiftLevel(level,dir){
  const ids=PROB_LEVELS.map(x=>x.id); let i=Math.max(0,ids.indexOf(level));
  if(dir==="up") i=Math.min(ids.length-1,i+1);
  if(dir==="down") i=Math.max(0,i-1);
  return ids[i];
}
function openUpdateSheet(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  const rows=r.hypotheses.filter(h=>S.hypothesisLevels[h]).map((h,i)=>`<div class="update-row" data-update-hyp="${htmlSafe(h)}"><div><b>${htmlSafe(h)}</b><span>${probLabel(S.hypothesisLevels[h])}</span></div><div class="update-actions"><button type="button" data-dir="down">↓ less likely</button><button type="button" data-dir="same" class="selected">— unchanged</button><button type="button" data-dir="up">↑ more likely</button></div></div>`).join('');
  showSheet("","Update model",`<div class="note">If the new information changes the localization or syndrome, revise the full working model rather than only changing diagnostic likelihoods.</div><div class="update-frame-link"><button class="secondary" id="reviseFrame">Revise pace / localization / syndrome</button></div>${rows}<div class="sheet-actions"><button class="secondary" id="cancelUpdate">Close</button><button class="primary" id="saveUpdate">Save update</button></div>`);
  $("#cancelUpdate").onclick=closeSheet;
  $("#reviseFrame").onclick=()=>{closeSheet();openModelSheet(false);};
  $("#sheetBody").querySelectorAll(".update-row").forEach(row=>row.querySelectorAll("[data-dir]").forEach(b=>b.onclick=()=>{row.querySelectorAll("[data-dir]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");}));
  $("#saveUpdate").onclick=()=>{
    const prev={...S.hypothesisLevels}; const next={...S.hypothesisLevels}; const changes=[];
    $("#sheetBody").querySelectorAll(".update-row").forEach(row=>{const h=row.dataset.updateHyp; const dir=row.querySelector("[data-dir].selected")?.dataset.dir||"same"; if(!next[h]) next[h]="low"; const shifted=shiftLevel(next[h],dir); if(shifted!==next[h]) changes.push(`${h}: ${probLabel(next[h])} → ${probLabel(shifted)}`); next[h]=shifted;});
    S.hypothesisLevels=next; S.lastModelUpdateDataCount=dataCount(); S.reasoningUpdates.push({time:stamp(),levels:{...next}}); S.timeline.push({time:stamp(),type:"Reasoning update",title:"Working model updated",text:changes.length?changes.join("; "):"Differential unchanged.",kind:"reasoning"}); save();closeSheet();render();
  };
}

function openFinalizeSheet(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  if(!canFinalize()){ showSheet("","Before finalizing",`<div class="note">Frame the syndrome and gather at least one targeted piece of additional information before finalizing the case.</div><div class="sheet-actions"><button class="primary" id="backToCase">Return to case</button></div>`); $("#backToCase").onclick=closeSheet; return; }
  const dxOptions=[...r.hypotheses,"Diagnosis remains uncertain / more than one process may contribute"];
  const management=(c.managementOptions||PATHWAYS.map(x=>x.id)).map(id=>PATHWAYS.find(x=>x.id===id)).filter(Boolean);
  showSheet("","Finalize assessment",`
    <div class="sheet-section"><h3>Working interpretation</h3><div class="choice-list">${dxOptions.map((x,i)=>radioHTML("finalDiagnosis",`dx-${i}`,x,"",S.finalDiagnosis===x?`dx-${i}`:null)).join('')}</div></div>
    <div class="sheet-section"><h3>Management</h3><div class="choice-list">${management.map(p=>radioHTML("pathway",p.id,p.title,p.desc,S.pathwayChoice)).join('')}</div></div>
    <div class="sheet-actions"><button class="secondary" id="returnCase">Return to case</button><button class="primary" id="finishCase">Finish case</button></div>`);
  $("#returnCase").onclick=closeSheet;
  $("#finishCase").onclick=()=>{
    const p=getChecked("pathway"); if(p)S.pathwayChoice=p;
    const dx=getChecked("finalDiagnosis"); if(dx){const idx=Number(dx.replace("dx-","")); S.finalDiagnosis=dxOptions[idx]||"";}
    save(); finishCase();
  };
}

function finishCase(){ stopTimer(); if(!S.pathwayChoice){const p=getChecked("pathway"); if(p)S.pathwayChoice=p;} const c=getCase(); if(c){S.history.push({caseId:c.id,completedAt:Date.now(),elapsedSec:Math.round(S.elapsed/1000)});} S.view="debrief"; save();closeSheet();render(); }

function openFactsSheet(){
  const c=getCase(); if(!c)return;
  const rows=[...KUC_FIELDS.map(f=>{let state="Unknown"; if(!c.unknowns.includes(f.id))state="Known on arrival"; if(Object.keys(S.revealed).some(id=>(ACTION_UPDATES[id]||[]).includes(f.id)))state="Reviewed"; return `<div class="diff-row"><span>${f.label}</span><span>${state}</span></div>`;})];
  showSheet("","Case facts",`<div class="diff-list">${rows.join('')}</div>`);
}

function renderDebrief(app,c){
  if(!c){S.view="home";return render();}
  const r=reasoningFor(c); const chosenPath=PATHWAYS.find(x=>x.id===S.pathwayChoice), refPath=PATHWAYS.find(x=>x.id===c.pathway);
  const trajectory=S.reasoningUpdates.map((u,i)=>`<div class="trajectory-item"><span class="trajectory-time">${u.time}</span><div>${r.hypotheses.filter(h=>u.levels[h]).map(h=>`${htmlSafe(h)} — ${probLabel(u.levels[h])}`).join('<br>')}</div></div>`).join('');
  app.innerHTML=`<section class="debrief"><div class="case-kicker">Case ${c.n}</div><h1>Debrief</h1>
    <div class="debrief-section"><h2>Clinical synthesis</h2><p>${c.syndromeStory}</p></div>
    ${trajectory?`<div class="debrief-section"><h2>Reasoning trajectory</h2><div class="trajectory-list">${trajectory}</div></div>`:''}
    <div class="debrief-section"><h2>Final assessment</h2><div class="final-summary">
      <div><span>Diagnosis</span><b>${htmlSafe(S.finalDiagnosis||"Not recorded")}</b></div>
      <div><span>Management</span><b>${htmlSafe(chosenPath?chosenPath.title:"Not recorded")}</b></div>
    </div></div>
    <div class="debrief-section"><h2>Reasoning frame</h2>
      <div class="reasoning-frame">
        <div><span>Context</span><b>${htmlSafe(c.context||"")}</b></div>
        <div><span>Pace</span><b>${htmlSafe(titleFor(TEMPOS,r.tempo))}</b></div>
        <div><span>Localization</span><b>${htmlSafe(titleFor(LOCALIZATIONS,r.localization))}</b></div>
        <div><span>Syndrome</span><b>${htmlSafe(titleFor(SYNDROMES,c.syndrome))}</b></div>
      </div>
    </div>
    ${c.competing?`<div class="debrief-section"><h2>Competing explanations</h2><div class="competing-list">${c.competing.map(x=>`<div><b>${htmlSafe(x.label)}</b><p>${x.text}</p></div>`).join('')}</div></div>`:''}
    ${c.whatChanged?`<div class="debrief-section"><h2>What changed the model</h2><p>${c.whatChanged}</p></div>`:''}
    ${c.uncertainty?`<div class="debrief-section"><h2>What remains uncertain</h2><p>${c.uncertainty}</p></div>`:''}
    <div class="debrief-section"><h2>Key findings</h2><ul class="plain-list">${c.teach.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="debrief-section"><h2>Clinical reasoning point</h2><p>${c.trap}</p></div>
    <div class="debrief-section"><h2>Evidence</h2><p>${(c.citations||[]).map(htmlSafe).join(' · ')||'No references listed.'}</p></div>
    <div class="debrief-actions"><button class="primary" id="another">Another case</button><button class="secondary" id="homeDebrief">Home</button></div></section>`;
  $("#another").onclick=()=>{S.caseId=null;S.timeline=[];S.view="home";save();render();}; $("#homeDebrief").onclick=()=>{S.caseId=null;S.timeline=[];S.view="home";save();render();};
}

$("#closeSheet").onclick=closeSheet;
$("#sheet").addEventListener("click",e=>{ if(e.target===$("#sheet")) closeSheet(); });
$("#homeBtn").onclick=()=>{ if(S.view==="case"){ stopTimer(); } S.view="home"; save(); render(); };
$("#mobileActions").querySelectorAll("[data-sheet]").forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet));

load(); render(); if(S.view==="case"&&S.caseId){S.startedAt=Date.now();S.timerRunning=true;save();tick();}
