"use strict";

const KEY = "stroke_code_v12";
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
    reexamCount:0, actionsTaken:[], revealed:{}, pathwayChoice:null, timeline:[], history:[], theme:"all"
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
    <section class="hero">
      <h1>Think through the stroke code.</h1>
      <p>Build the syndrome from time course and examination, localize before labeling, and update your differential as the patient and data evolve.</p>
      <div class="home-cta"><button class="primary" id="randomCase">Start a case</button><button class="secondary" id="resumeCase" ${S.caseId&&S.timeline.length?'':'hidden'}>Resume current case</button></div>
    </section>
    <div class="section-title">Reasoning themes</div>
    <div class="theme-row">${Object.entries(THEMES).map(([id,label])=>`<button class="theme-chip ${S.theme===id?'active':''}" data-theme="${id}">${label}</button>`).join('')}</div>
    <div class="section-title">Cases</div>
    <div class="case-grid">${filtered.map(c=>`<button class="case-card" data-case="${c.id}"><span class="case-kicker">Case ${c.n}</span><h3>${caseName(c)}</h3><p>${htmlSafe(c.arrival)}</p></button>`).join('')}</div>`;
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
  S=freshState(); S.history=history; S.theme=theme; S.caseId=id; S.view="case"; S.timeline=[{time:"00:00",type:"Arrival",title:"Initial presentation",text:getCase().arrival}];
  save(); startTimer(); render(); setTimeout(()=>openModelSheet(true),120);
}

function renderCase(app,c){
  const r=reasoningFor(c);
  app.innerHTML=`<section class="workspace">
    <div class="patient-banner"><div class="eyebrow">Stroke-code presentation</div><p>${htmlSafe(c.arrival)}</p></div>
    <section class="timeline-panel">
      <div class="timeline-head"><h2>Clinical timeline</h2><button class="ghost" id="factsBtn">Case facts</button></div>
      <div class="timeline">${S.timeline.map(renderEvent).join('')}</div>
      <button class="reexam-button" id="reexamBtn">↻ Re-examine patient</button>
    </section>
    <aside class="workspace-side">
      <div class="panel">
        <div class="panel-head"><div><div class="eyebrow">Current working model</div><h3>Reasoning summary</h3></div><button class="ghost" id="editModel">Edit</button></div>
        ${workingModelHTML(r)}
      </div>
      <div class="panel desktop-actions"><button class="secondary" data-sheet="ask">Ask</button><button class="secondary" data-sheet="examine">Examine</button><button class="secondary" data-sheet="test">Test</button><button class="secondary" data-sheet="update">Update</button><button class="primary" data-sheet="manage">Manage</button></div>
    </aside>
  </section>`;
  $("#reexamBtn").onclick=doReexam; $("#editModel").onclick=()=>openModelSheet(false); $("#factsBtn").onclick=openFactsSheet;
  app.querySelectorAll("[data-sheet]").forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet));
}
function renderEvent(e){ return `<article class="event ${e.kind||''}"><div class="event-meta"><span class="event-time">${htmlSafe(e.time)}</span><span class="event-type">${htmlSafe(e.type)}</span></div><h3>${htmlSafe(e.title)}</h3><p>${e.text||''}</p></article>`; }
function workingModelHTML(r){
  if(!S.tempo&&!S.localization&&!S.syndrome&&!Object.keys(S.hypothesisLevels).length) return `<div class="model-empty">No working model recorded yet. Frame the time course, localization, syndrome, and initial differential when you are ready.</div><button class="primary" style="margin-top:10px" onclick="openModelSheet(true)">Frame working model</button>`;
  const chips=[S.tempo?titleFor(TEMPOS,S.tempo):null,S.localization?titleFor(LOCALIZATIONS,S.localization):null,S.syndrome?titleFor(SYNDROMES,S.syndrome):null].filter(Boolean);
  const diffs=r.hypotheses.filter(h=>S.hypothesisLevels[h]).map(h=>`<div class="diff-row"><span>${htmlSafe(h)}</span><span class="prob">${probLabel(S.hypothesisLevels[h])}</span></div>`).join('');
  return `<div class="model-summary">${chips.map(x=>`<span class="model-chip">${htmlSafe(x)}</span>`).join('')}</div>${diffs?`<div class="diff-list">${diffs}</div>`:`<div class="model-empty" style="margin-top:9px">Differential probability has not been recorded yet.</div>`}`;
}

function openSheet(kind){
  if(kind==="ask") return openActionSheet("Ask",[
    ["history","History and collateral"]
  ]);
  if(kind==="examine") return openActionSheet("Examine",[["bedside","Bedside examination"]]);
  if(kind==="test") return openActionSheet("Test",[["imaging","Imaging"],["other","Other tests / resources"]]);
  if(kind==="update") return openUpdateSheet();
  if(kind==="manage") return openManageSheet();
}
function showSheet(eyebrow,title,html){
  $("#sheetEyebrow").textContent=eyebrow||""; $("#sheetTitle").textContent=title; $("#sheetBody").innerHTML=html; const d=$("#sheet"); if(!d.open)d.showModal();
}
function closeSheet(){ const d=$("#sheet"); if(d.open)d.close(); }

function openActionSheet(title,sections){
  const c=getCase();
  const html=sections.map(([key,label])=>`<section class="sheet-section"><h3>${label}</h3><div class="action-list">${ACTIONS[key].map(a=>actionButtonHTML(a,c)).join('')}</div></section>`).join('');
  showSheet("Clinical workspace",title,html);
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
  showSheet(first?"Initial reasoning":"Working model",first?"Frame the syndrome":"Revise the working model",`
    <section class="sheet-section"><h3>Time course</h3><div class="choice-list">${TEMPOS.map(x=>radioHTML("tempo",x.id,x.title,x.desc,S.tempo)).join('')}</div></section>
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
  const parts=[]; if(S.tempo)parts.push(`Tempo: ${titleFor(TEMPOS,S.tempo)}`); if(S.localization)parts.push(`Localization: ${titleFor(LOCALIZATIONS,S.localization)}`); if(S.syndrome)parts.push(`Syndrome: ${titleFor(SYNDROMES,S.syndrome)}`);
  const d=r.hypotheses.filter(h=>S.hypothesisLevels[h]).map(h=>`${h}: ${probLabel(S.hypothesisLevels[h])}`); if(d.length)parts.push(`Differential: ${d.join("; ")}`); return htmlSafe(parts.join(" · "));
}

function openUpdateSheet(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  showSheet("Diagnostic updating","How has your thinking changed?",`${probBoardHTML(r.hypotheses,S.hypothesisLevels,"updateprob")}<label class="field-label" for="updateNote">What changed your thinking? <span style="font-weight:500;color:#98a2b3">Optional</span></label><textarea class="text-input" id="updateNote" rows="3" placeholder="A finding, trajectory, or test result..."></textarea><div class="sheet-actions"><button class="secondary" id="cancelUpdate">Close</button><button class="primary" id="saveUpdate">Save update</button></div>`);
  $("#sheetBody").querySelectorAll("[data-prob-group]").forEach(wireProbGroup); $("#cancelUpdate").onclick=closeSheet;
  $("#saveUpdate").onclick=()=>{ const next=readProbGroups("updateprob"); const prev={...S.hypothesisLevels}; S.hypothesisLevels={...S.hypothesisLevels,...next}; const note=$("#updateNote").value.trim(); const changes=r.hypotheses.filter(h=>next[h]&&next[h]!==prev[h]).map(h=>`${h}: ${probLabel(prev[h])} → ${probLabel(next[h])}`); const text=[changes.length?changes.join("; "):"No probability level changed.", note?`Reason noted: ${htmlSafe(note)}`:""].filter(Boolean).join(" "); S.reasoningUpdates.push({time:stamp(),levels:{...S.hypothesisLevels},note}); S.timeline.push({time:stamp(),type:"Reasoning update",title:"Diagnostic model updated",text,kind:"reasoning"}); save();closeSheet();render(); };
}

function openManageSheet(){
  const c=getCase(); if(!c)return;
  showSheet("Management","What would you do at this point?",`<div class="choice-list">${PATHWAYS.map(p=>radioHTML("pathway",p.id,p.title,p.desc,S.pathwayChoice)).join('')}</div><div class="note" style="margin-top:12px">A management choice is provisional. You can close this panel, continue evaluating the patient, and revise it later.</div><div class="sheet-actions"><button class="secondary" id="continueEval">Continue evaluating</button><button class="primary" id="saveManage">Save management</button></div><button class="ghost" id="finishCase" style="width:100%;margin-top:9px">Finish case and debrief</button>`);
  $("#continueEval").onclick=closeSheet; $("#saveManage").onclick=()=>{const p=getChecked("pathway");if(!p)return;S.pathwayChoice=p;const meta=PATHWAYS.find(x=>x.id===p);S.timeline.push({time:stamp(),type:"Management",title:"Management approach recorded",text:htmlSafe(meta.title),kind:"management"});save();closeSheet();render();}; $("#finishCase").onclick=finishCase;
}
function finishCase(){ stopTimer(); if(!S.pathwayChoice){const p=getChecked("pathway"); if(p)S.pathwayChoice=p;} const c=getCase(); if(c){S.history.push({caseId:c.id,completedAt:Date.now(),elapsedSec:Math.round(S.elapsed/1000)});} S.view="debrief"; save();closeSheet();render(); }

function openFactsSheet(){
  const c=getCase(); if(!c)return;
  const rows=[...KUC_FIELDS.map(f=>{let state="Unknown"; if(!c.unknowns.includes(f.id))state="Known on arrival"; if(Object.keys(S.revealed).some(id=>(ACTION_UPDATES[id]||[]).includes(f.id)))state="Reviewed"; return `<div class="diff-row"><span>${f.label}</span><span>${state}</span></div>`;})];
  showSheet("Case facts","What has been established?",`<div class="note">This is a compact reference, not a checklist. Unknown information can remain unknown if it does not change the current decision.</div><div class="diff-list" style="margin-top:14px">${rows.join('')}</div>`);
}

function renderDebrief(app,c){
  if(!c){S.view="home";return render();}
  const r=reasoningFor(c); const chosenPath=PATHWAYS.find(x=>x.id===S.pathwayChoice), refPath=PATHWAYS.find(x=>x.id===c.pathway);
  const trajectory=S.reasoningUpdates.map((u,i)=>`<li><b>Update ${i+1} (${u.time})</b>: ${r.hypotheses.filter(h=>u.levels[h]).map(h=>`${htmlSafe(h)} — ${probLabel(u.levels[h])}`).join('; ')}${u.note?`<br><span style="color:#667085">${htmlSafe(u.note)}</span>`:''}</li>`).join('');
  app.innerHTML=`<section class="debrief"><div class="eyebrow">Case ${c.n}</div><h1>Debrief</h1><p class="lede">A reconstruction of the reasoning path, not a score.</p>
    <div class="debrief-section"><h2>Reasoning frame</h2><div class="compare">
      <div class="compare-box"><b>Your recorded interpretation</b>${htmlSafe(titleFor(TEMPOS,S.tempo))}<br>${htmlSafe(titleFor(LOCALIZATIONS,S.localization))}<br>${htmlSafe(titleFor(SYNDROMES,S.syndrome))}</div>
      <div class="compare-box"><b>Reference framing for this case</b>${htmlSafe(titleFor(TEMPOS,r.tempo))}<br>${htmlSafe(titleFor(LOCALIZATIONS,r.localization))}<br>${htmlSafe(titleFor(SYNDROMES,c.syndrome))}</div>
    </div></div>
    <div class="debrief-section"><h2>Management framing</h2><div class="compare"><div class="compare-box"><b>Your recorded approach</b>${htmlSafe(chosenPath?chosenPath.title:"Not recorded")}</div><div class="compare-box"><b>Reference approach in this case</b>${htmlSafe(refPath?refPath.title:"Not specified")}</div></div></div>
    ${trajectory?`<div class="debrief-section"><h2>How your differential evolved</h2><ul class="plain-list">${trajectory}</ul></div>`:''}
    <div class="debrief-section"><h2>Clinical synthesis</h2><p style="font-size:13.5px;line-height:1.55;margin:0">${c.syndromeStory}</p></div>
    <div class="debrief-section"><h2>Reasoning points</h2><ul class="plain-list">${c.teach.map(t=>`<li>${t}</li>`).join('')}</ul></div>
    <div class="debrief-section"><h2>Potential source of diagnostic error</h2><p style="font-size:13.5px;line-height:1.55;margin:0">${c.trap}</p></div>
    <div class="debrief-section"><h2>Evidence to review</h2><p style="font-size:13px;line-height:1.5;margin:0">${(c.citations||[]).map(htmlSafe).join(' · ')||'No references listed for this case.'}</p></div>
    <div class="debrief-actions"><button class="primary" id="another">Choose another case</button><button class="secondary" id="homeDebrief">Home</button></div></section>`;
  $("#another").onclick=()=>{S.caseId=null;S.timeline=[];S.view="home";save();render();}; $("#homeDebrief").onclick=()=>{S.caseId=null;S.timeline=[];S.view="home";save();render();};
}

$("#closeSheet").onclick=closeSheet;
$("#sheet").addEventListener("click",e=>{ if(e.target===$("#sheet")) closeSheet(); });
$("#homeBtn").onclick=()=>{ if(S.view==="case"){ stopTimer(); } S.view="home"; save(); render(); };
$("#mobileActions").querySelectorAll("[data-sheet]").forEach(b=>b.onclick=()=>openSheet(b.dataset.sheet));

load(); render(); if(S.view==="case"&&S.caseId){S.startedAt=Date.now();S.timerRunning=true;save();tick();}
