"use strict";

const KEY = "stroke_code_v14";
const THEMES = {
  all:"All cases",
  focal:"Acute focal deficit",
  found:"Found down / unclear onset",
  posterior:"Posterior circulation",
  lownih:"Low NIHSS / disability",
  seizure:"Seizure vs stroke",
  ams:"Altered mental status",
  htn:"Hypertension + neurologic symptoms",
  hemorrhage:"Hemorrhage"
};
const CASE_THEMES = {
  c1:["focal"], c2:["focal","found"], c3:["focal","found"], c4:["focal"],
  c5:["posterior"], c6:["posterior"], c7:["focal","lownih"], c8:["focal","htn"],
  c9:["hemorrhage","htn"], c10:["seizure","ams","focal"]
};

function freshState(){
  return {
    view:"home", caseId:null, startedAt:0, elapsed:0, timerRunning:false,
    tempo:null, localization:null, syndrome:null, hypothesisLevels:{}, reasoningUpdates:[],
    reexamCount:0, actionsTaken:[], revealed:{}, pathwayChoice:null, finalDiagnosis:"", finalConfidence:"", timeline:[], history:[], theme:"all"
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
  mobile.hidden = S.view !== "case";
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
      <h1>STROKE CODE</h1>
      <p>Interactive cases in acute neurologic reasoning.</p>
      <div class="home-cta"><button class="primary" id="randomCase">Start a case</button><button class="secondary" id="resumeCase" ${S.caseId&&S.timeline.length?'':'hidden'}>Resume case</button></div>
    </section>
    <div class="section-title">Cases</div>
    <div class="theme-row">${Object.entries(THEMES).map(([id,label])=>`<button class="theme-chip ${S.theme===id?'active':''}" data-theme="${id}">${label}</button>`).join('')}</div>
    <div class="case-grid">${filtered.map(c=>`<button class="case-card" data-case="${c.id}"><span class="case-kicker">Case ${c.n}</span><h3>${caseName(c)}</h3></button>`).join('')}</div>`;
  $("#randomCase").onclick=()=>startCase(filtered[Math.floor(Math.random()*filtered.length)].id);
  const resume=$("#resumeCase"); if(resume) resume.onclick=()=>{S.view="case"; if(!S.timerRunning){S.startedAt=Date.now();S.timerRunning=true;} save();render();};
  app.querySelectorAll("[data-theme]").forEach(b=>b.onclick=()=>{S.theme=b.dataset.theme;save();render();});
  app.querySelectorAll("[data-case]").forEach(b=>b.onclick=()=>startCase(b.dataset.case));
}
function caseName(c){
  const names={c1:"Hyperacute dominant-hemisphere syndrome",c2:"Wake-up cortical syndrome",c3:"Unknown onset, no collateral",c4:"Large-core anterior circulation stroke",c5:"Crossed brainstem findings",c6:"Acute vestibular syndrome",c7:"Isolated dominant-hand weakness",c8:"Severe hypertension with focal deficit",c9:"Headache, vomiting, and weakness",c10:"Seizure, weakness, and altered mental status"};
  return names[c.id]||`Case ${c.n}`;
}

function startCase(id){
  const history=S.history||[]; const theme=S.theme||"all";
  S=freshState(); S.history=history; S.theme=theme; S.caseId=id; S.view="case"; S.timeline=[{time:"00:00",type:"Arrival",title:"Initial presentation",text:getCase().presentation||getCase().arrival}];
  save(); startTimer(); render();
}

function renderCase(app,c){
  const r=reasoningFor(c);
  app.innerHTML=`<section class="workspace">
    <div class="patient-banner">
      <div class="case-kicker">Case ${c.n}</div>
      <div class="activation-line"><span>Stroke code</span><strong>${htmlSafe(c.activation||caseName(c))}</strong></div>
      <div class="context-line"><span>Context</span><p>${htmlSafe(c.context||"")}</p></div>
      <div class="presentation-line"><span>Presentation</span><p>${htmlSafe(c.presentation||c.arrival)}</p></div>
    </div>
    <section class="timeline-panel">
      <div class="timeline-head"><h2>Clinical timeline</h2></div>
      <div class="timeline">${S.timeline.map(renderEvent).join('')}</div>
      <button class="reexam-button" id="reexamBtn">↻ Re-examine patient</button>
    </section>
    <aside class="workspace-side">
      <div class="panel model-panel">
        <div class="panel-head"><div><div class="eyebrow">Working model</div></div><button class="ghost" id="editModel">Edit</button></div>
        ${workingModelHTML(r)}
      </div>
      <div class="panel desktop-actions"><button class="secondary" data-sheet="ask">Ask</button><button class="secondary" data-sheet="examine">Examine</button><button class="secondary" data-sheet="test">Tests</button><button class="secondary" data-sheet="update">Update</button></div>
      <button class="primary finalize-button" id="finalizeBtn">Finalize assessment</button>
    </aside>
  </section>`;
  $("#reexamBtn").onclick=doReexam; $("#editModel").onclick=()=>openModelSheet(false); $("#finalizeBtn").onclick=openFinalizeSheet;
  app.querySelectorAll("[data-sheet]").forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet));
}
function renderEvent(e){ return `<article class="event ${e.kind||''}"><div class="event-meta"><span class="event-time">${htmlSafe(e.time)}</span><span class="event-type">${htmlSafe(e.type)}</span></div><h3>${htmlSafe(e.title)}</h3><p>${e.text||''}</p></article>`; }
function workingModelHTML(r){
  if(!S.tempo&&!S.localization&&!S.syndrome&&!Object.keys(S.hypothesisLevels).length) return `<button class="secondary" onclick="openModelSheet(true)">Frame the syndrome</button>`;
  const rows=[
    S.tempo?`<div class="model-row"><span>Pace</span><b>${htmlSafe(titleFor(TEMPOS,S.tempo))}</b></div>`:'',
    S.localization?`<div class="model-row"><span>Localization</span><b>${htmlSafe(titleFor(LOCALIZATIONS,S.localization))}</b></div>`:'',
    S.syndrome?`<div class="model-row"><span>Syndrome</span><b>${htmlSafe(titleFor(SYNDROMES,S.syndrome))}</b></div>`:''
  ].join('');
  const diffs=r.hypotheses.filter(h=>S.hypothesisLevels[h]).map(h=>`<div class="diff-row"><span>${htmlSafe(h)}</span><span class="prob">${probLabel(S.hypothesisLevels[h])}</span></div>`).join('');
  return `<div class="model-rows">${rows}</div>${diffs?`<div class="diff-list"><div class="model-subhead">Differential</div>${diffs}</div>`:''}`;
}

function openSheet(kind){
  if(kind==="ask") return openActionSheet("Ask",[
    ["history","History and collateral"]
  ]);
  if(kind==="examine") return openActionSheet("Examine",[["bedside","Bedside examination"]]);
  if(kind==="test") return openActionSheet("Test",[["imaging","Imaging"],["other","Other tests / resources"]]);
  if(kind==="update") return openUpdateSheet();
}
function showSheet(eyebrow,title,html){
  $("#sheetEyebrow").textContent=eyebrow||""; $("#sheetTitle").textContent=title; $("#sheetBody").innerHTML=html; const d=$("#sheet"); if(!d.open)d.showModal();
}
function closeSheet(){ const d=$("#sheet"); if(d.open)d.close(); }

function openActionSheet(title,sections){
  const c=getCase();
  const html=sections.map(([key,label])=>`<section class="sheet-section"><h3>${label}</h3><div class="action-list">${ACTIONS[key].map(a=>actionButtonHTML(a,c)).join('')}</div></section>`).join('');
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
  showSheet("",first?"Frame the syndrome":"Working model",`
    <section class="sheet-section"><h3>Pace</h3><div class="choice-list">${TEMPOS.map(x=>radioHTML("tempo",x.id,x.title,x.desc,S.tempo)).join('')}</div></section>
    <section class="sheet-section"><h3>Localization</h3><div class="choice-list">${LOCALIZATIONS.map(x=>radioHTML("localization",x.id,x.title,x.desc,S.localization)).join('')}</div></section>
    <section class="sheet-section"><h3>Syndrome</h3><div class="choice-list">${SYNDROMES.map(x=>radioHTML("syndrome",x.id,x.title,x.desc,S.syndrome)).join('')}</div></section>
    <section class="sheet-section"><h3>Initial differential</h3>${probBoardHTML(r.hypotheses,S.hypothesisLevels,"modelprob")}</section>
    <div class="sheet-actions"><button class="secondary" id="cancelModel">Close</button><button class="primary" id="saveModel">Save working model</button></div>`);
  $("#cancelModel").onclick=closeSheet;
  $("#sheetBody").querySelectorAll("[data-prob-group]").forEach(wireProbGroup);
  $("#saveModel").onclick=()=>{
    const tempo=getChecked("tempo"), loc=getChecked("localization"), syn=getChecked("syndrome");
    if(tempo)S.tempo=tempo;if(loc)S.localization=loc;if(syn)S.syndrome=syn;
    const levels=readProbGroups("modelprob"); S.hypothesisLevels={...S.hypothesisLevels,...levels};
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

function openUpdateSheet(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  showSheet("","Update differential",`${probBoardHTML(r.hypotheses,S.hypothesisLevels,"updateprob")}<label class="field-label" for="updateNote">What changed your thinking? <span style="font-weight:500;color:#98a2b3">Optional</span></label><textarea class="text-input" id="updateNote" rows="3" placeholder="A finding, trajectory, or test result..."></textarea><div class="sheet-actions"><button class="secondary" id="cancelUpdate">Close</button><button class="primary" id="saveUpdate">Save update</button></div>`);
  $("#sheetBody").querySelectorAll("[data-prob-group]").forEach(wireProbGroup); $("#cancelUpdate").onclick=closeSheet;
  $("#saveUpdate").onclick=()=>{ const next=readProbGroups("updateprob"); const prev={...S.hypothesisLevels}; S.hypothesisLevels={...S.hypothesisLevels,...next}; const note=$("#updateNote").value.trim(); const changes=r.hypotheses.filter(h=>next[h]&&next[h]!==prev[h]).map(h=>`${h}: ${probLabel(prev[h])} → ${probLabel(next[h])}`); const text=[changes.length?changes.join("; "):"No probability level changed.", note?`Reason noted: ${htmlSafe(note)}`:""].filter(Boolean).join(" "); S.reasoningUpdates.push({time:stamp(),levels:{...S.hypothesisLevels},note}); S.timeline.push({time:stamp(),type:"Reasoning update",title:"Diagnostic model updated",text,kind:"reasoning"}); save();closeSheet();render(); };
}

function openFinalizeSheet(){
  const c=getCase(); if(!c)return;
  showSheet("","Finalize assessment",`
    <label class="field-label" for="finalDiagnosis">Working diagnosis</label>
    <input class="text-input" id="finalDiagnosis" value="${htmlSafe(S.finalDiagnosis)}" placeholder="Your final working diagnosis">
    <div class="sheet-section" style="margin-top:16px"><h3>Management</h3><div class="choice-list">${PATHWAYS.map(p=>radioHTML("pathway",p.id,p.title,p.desc,S.pathwayChoice)).join('')}</div></div>
    <div class="sheet-section"><h3>Confidence</h3><div class="confidence-row">
      ${["Low","Moderate","High"].map(x=>`<button type="button" class="confidence-choice ${S.finalConfidence===x?'selected':''}" data-confidence="${x}">${x}</button>`).join('')}
    </div></div>
    <div class="sheet-actions"><button class="secondary" id="returnCase">Return to case</button><button class="primary" id="finishCase">Finish case</button></div>`);
  $("#returnCase").onclick=closeSheet;
  $("#sheetBody").querySelectorAll("[data-confidence]").forEach(b=>b.onclick=()=>{$("#sheetBody").querySelectorAll("[data-confidence]").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");});
  $("#finishCase").onclick=()=>{
    const p=getChecked("pathway"); if(p)S.pathwayChoice=p;
    S.finalDiagnosis=$("#finalDiagnosis").value.trim();
    const conf=$("#sheetBody").querySelector(".confidence-choice.selected"); S.finalConfidence=conf?conf.dataset.confidence:"";
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
  const trajectory=S.reasoningUpdates.map((u,i)=>`<div class="trajectory-item"><span class="trajectory-time">${u.time}</span><div>${r.hypotheses.filter(h=>u.levels[h]).map(h=>`${htmlSafe(h)} — ${probLabel(u.levels[h])}`).join('<br>')}${u.note?`<div class="trajectory-note">${htmlSafe(u.note)}</div>`:''}</div></div>`).join('');
  app.innerHTML=`<section class="debrief"><div class="case-kicker">Case ${c.n}</div><h1>Debrief</h1>
    <div class="debrief-section"><h2>Clinical synthesis</h2><p>${c.syndromeStory}</p></div>
    ${trajectory?`<div class="debrief-section"><h2>Reasoning trajectory</h2><div class="trajectory-list">${trajectory}</div></div>`:''}
    <div class="debrief-section"><h2>Final assessment</h2><div class="final-summary">
      <div><span>Diagnosis</span><b>${htmlSafe(S.finalDiagnosis||"Not recorded")}</b></div>
      <div><span>Management</span><b>${htmlSafe(chosenPath?chosenPath.title:"Not recorded")}</b></div>
      <div><span>Confidence</span><b>${htmlSafe(S.finalConfidence||"Not recorded")}</b></div>
    </div></div>
    <div class="debrief-section"><h2>Reasoning frame</h2>
      <div class="reasoning-frame">
        <div><span>Context</span><b>${htmlSafe(c.context||"")}</b></div>
        <div><span>Pace</span><b>${htmlSafe(titleFor(TEMPOS,r.tempo))}</b></div>
        <div><span>Localization</span><b>${htmlSafe(titleFor(LOCALIZATIONS,r.localization))}</b></div>
        <div><span>Syndrome</span><b>${htmlSafe(titleFor(SYNDROMES,c.syndrome))}</b></div>
      </div>
    </div>
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
