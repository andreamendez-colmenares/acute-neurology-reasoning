"use strict";

const KEY = "acute_neurology_reasoning_v21";
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
  legs:"Bilateral leg weakness",
  bulbar:"Bulbar / fatigable weakness",
  cancer_ams:"Cancer / altered mental status"
};
const CASE_THEMES = {
  c1:["focal"], c2:["focal","found"], c3:["focal","found"], c4:["focal","found"],
  c5:["focal"], c6:["dizzy"], c7:["hand","focal"], c8:["focal"],
  c9:["headache","focal"], c10:["seizure","ams","focal"],
  c11:["legs"], c12:["ams"], c13:["bulbar"], c14:["ams","cancer_ams","seizure"]
};

function freshState(){
  return {
    view:"home", caseId:null, startedAt:0, elapsed:0, timerRunning:false,
    tempo:null, localization:null, syndrome:null, hypothesisLevels:{}, reasoningUpdates:[], modelFramed:false,
    lastModelUpdateDataCount:0, reexamCount:0, actionsTaken:[], revealed:{}, pathwayChoice:null, finalDiagnosis:"", timeline:[], history:[], theme:"all", questionAnswers:{}
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
      <div class="home-sequence" aria-label="Case workflow"><span>See the patient</span><i>→</i><span>Frame</span><i>→</i><span>Clarify</span><i>→</i><span>Update</span><i>→</i><span>Finalize</span></div>
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
    c12:"Fluctuating confusion in the hospital",
    c13:"Progressive fatigue and slurred speech",
    c14:"Increasing confusion in a patient with metastatic cancer"
  };
  return names[c.id]||`Case ${c.n}`;
}
function openOnboardingSheet(markSeen=true){
  showSheet("","How each case works",`<div class="onboard-steps">
    <div><b>1</b><span><strong>See the patient</strong><small>Read the presentation, establish baseline, and inspect the neurologic examination.</small></span></div>
    <div><b>2</b><span><strong>Frame</strong><small>Define pace, localization, syndrome, and an initial differential.</small></span></div>
    <div><b>3</b><span><strong>Clarify</strong><small>Examine further, ask focused questions, or order a test only when it addresses a specific uncertainty.</small></span></div>
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
  const clarified=dataCount()>0, updated=S.reasoningUpdates.length>0;
  let active=0;
  if(!S.modelFramed) active=0;
  else if(!clarified) active=2;
  else if(hasNewData()) active=3;
  else active=2;
  const steps=[
    {label:"Patient",done:S.modelFramed},
    {label:"Frame",done:S.modelFramed},
    {label:"Clarify",done:clarified},
    {label:"Update",done:updated&&!hasNewData()},
    {label:"Finalize",done:false}
  ];
  return `<div class="workflow-strip">${steps.map((x,i)=>`<div class="workflow-step ${x.done?'done':''} ${i===active?'active':''}"><span>${x.done?'✓':i+1}</span><b>${x.label}</b></div>`).join('')}</div>`;
}
function clarifyButtonsHTML(includeFinalize=false){
  return `<div class="clarify-actions">
    <button class="primary clarify-exam" id="nextExamine"><span>Examine further</span><small>Refine localization or characterize the syndrome</small></button>
    <button class="secondary" id="nextAsk"><span>Ask</span><small>Clarify history, baseline, or trajectory</small></button>
    <button class="secondary" id="nextTest"><span>Test</span><small>Resolve a specific diagnostic or management uncertainty</small></button>
    ${includeFinalize?'<button class="ghost" id="nextFinalize">Finalize assessment</button>':''}
  </div>`;
}
function nextStepHTML(){
  if(!S.modelFramed) return `<section class="next-step-card"><div><div class="eyebrow">From the bedside</div><h2>Frame the neurologic problem</h2><p>Use the presentation, baseline, and raw examination findings. Define pace, localization, syndrome, and an initial differential before seeking more information.</p></div><button class="primary" id="nextFrame">Frame the problem</button></section>`;
  if(dataCount()===0) return `<section class="next-step-card"><div><div class="eyebrow">Clarify the model</div><h2>What uncertainty matters now?</h2><p>Examine further first when the bedside examination can answer the question. Use history or testing when they address a specific unresolved point.</p></div>${clarifyButtonsHTML(false)}</section>`;
  if(hasNewData()) return `<section class="next-step-card"><div><div class="eyebrow">New information</div><h2>What changed?</h2><p>Update the model if the new observation meaningfully changes localization, syndrome, or the relative likelihood of your hypotheses.</p></div><div class="next-step-actions"><button class="primary" id="nextUpdate">Update model</button>${clarifyButtonsHTML(canFinalize())}</div></section>`;
  return `<section class="next-step-card"><div><div class="eyebrow">Model updated</div><h2>What still needs clarification?</h2><p>Continue only if another bedside maneuver, question, or test could change the model or the clinical decision.</p></div>${clarifyButtonsHTML(canFinalize())}</section>`;
}
function wireNextStep(){
  const f=$("#nextFrame"); if(f)f.onclick=()=>openModelSheet(true);
  const e=$("#nextExamine"); if(e)e.onclick=()=>openSheet("examine");
  const a=$("#nextAsk"); if(a)a.onclick=()=>openSheet("ask");
  const t=$("#nextTest"); if(t)t.onclick=()=>openSheet("test");
  const u=$("#nextUpdate"); if(u)u.onclick=openUpdateSheet;
  const z=$("#nextFinalize"); if(z)z.onclick=openFinalizeSheet;
}
function baselineText(c){
  return S.revealed.baseline || c.baseline || "Not yet established.";
}
function examSection(label,text){
  if(!text) return "";
  return `<div class="exam-row"><span>${htmlSafe(label)}</span><p>${htmlSafe(text)}</p></div>`;
}
function additionalExamHTML(c){
  const ids=['focused_exam','attention_exam','fatigability_exam','respiratory_bulbar_exam'];
  const items=ids.filter(id=>S.revealed[id]).map(id=>{
    const a=findAction(id); return `<div class="exam-update"><b>${htmlSafe(a?a.label:'Additional examination')}</b><p>${S.revealed[id]}</p></div>`;
  });
  if(S.reexamCount){
    const repeats=S.timeline.filter(x=>x.type==='Re-examination');
    repeats.forEach(x=>items.push(`<div class="exam-update"><b>${htmlSafe(x.title)}</b><p>${x.text}</p></div>`));
  }
  return items.length?`<div class="exam-updates"><div class="eyebrow">Additional examination findings</div>${items.join('')}</div>`:'';
}
function neurologicExamHTML(c){
  const x=c.initialExam||{};
  return `<section class="neurologic-exam-card">
    <div class="exam-head"><div><div class="eyebrow">Neurologic examination</div><h2>Initial bedside examination</h2></div>${S.modelFramed?'<button class="primary compact" id="examFurtherTop">Examine further</button>':''}</div>
    <div class="exam-grid">
      ${examSection('Mental status',x.mental)}
      ${examSection('Cranial nerves',x.cranial)}
      ${examSection('Motor',x.motor)}
      ${examSection('Sensory',x.sensory)}
      ${examSection('Coordination',x.coordination)}
      ${examSection('Reflexes',x.reflexes)}
      ${examSection('Gait',x.gait)}
    </div>
    ${additionalExamHTML(c)}
  </section>`;
}
function renderCase(app,c){
  const r=reasoningFor(c);
  app.innerHTML=`<section class="case-flow">
    ${workflowHTML()}
    <section class="patient-summary">
      <div class="case-kicker">Case ${c.n}</div>
      <div class="activation-line"><span>Reason for consultation</span><strong>${htmlSafe(c.activation||caseName(c))}</strong></div>
      <div class="presentation-line"><span>Presentation</span><p>${htmlSafe(c.presentation||c.arrival)}</p></div>
      <div class="case-context-line"><span>Relevant context</span><p>${htmlSafe(c.context||'')}</p></div>
      <div class="baseline-line"><span>Baseline</span><p>${htmlSafe(baselineText(c))}</p></div>
    </section>
    ${neurologicExamHTML(c)}
    ${S.modelFramed && c.clinicalQuestion?`<section class="clinical-question-card"><div class="eyebrow">Clinical question</div><p>${htmlSafe(c.clinicalQuestion)}</p></section>`:''}
    ${nextStepHTML()}
    ${S.modelFramed?`<section class="case-body">
      <div class="timeline-panel">
        <div class="timeline-head"><h2>New information</h2></div>
        <div class="timeline">${S.timeline.length?S.timeline.map(renderEvent).join(''):'<p class="timeline-empty">No additional information gathered yet.</p>'}</div>
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
  const eTop=$("#examFurtherTop"); if(eTop)eTop.onclick=()=>openSheet("examine");
  wireNextStep();
}

function renderEvent(e){ return `<article class="event ${e.kind||''}"><div class="event-meta"><span class="event-type">${htmlSafe(e.type)}</span></div><h3>${htmlSafe(e.title)}</h3><p>${e.text||''}</p></article>`; }
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
  if(kind==="ask") return openActionSheet("Ask",[["history","History and collateral"]]);
  if(kind==="examine") return openActionSheet("Examine further",[["bedside","Targeted bedside examination"]]);
  if(kind==="test") return openActionSheet("Test",[["imaging","Imaging"],["other","Other tests / resources"]]);
}
function showSheet(eyebrow,title,html){
  $("#sheetEyebrow").textContent=eyebrow||""; $("#sheetTitle").textContent=title; $("#sheetBody").innerHTML=html; const d=$("#sheet"); if(!d.open)d.showModal();
}
function closeSheet(){ const d=$("#sheet"); if(d.open)d.close(); }

function openActionSheet(title,sections){
  const c=getCase();
  const html=sections.map(([key,label])=>{
    const available=ACTIONS[key].filter(a=>{
      if(a.id==="nihss" && !(c.strokeTools||[]).includes("nihss")) return false;
      return Object.prototype.hasOwnProperty.call(c.r,a.id) || a.id==="reexam";
    });
    if(!available.length) return "";
    return `<section class="sheet-section"><h3>${label}</h3><div class="action-list">${available.map(a=>actionButtonHTML(a,c)).join('')}</div></section>`;
  }).join('');
  showSheet("",title,html);
  $("#sheetBody").querySelectorAll("[data-action]").forEach(b=>b.onclick=()=>doAction(b.dataset.action));
}
function actionButtonHTML(a,c){
  const used=!a.repeatable&&S.actionsTaken.includes(a.id); const available=(a.id!=="nihss" || (c.strokeTools||[]).includes("nihss")) && (Object.prototype.hasOwnProperty.call(c.r,a.id) || a.id==="reexam");
  const purpose=(c.actionPurpose&&c.actionPurpose[a.id]) || ACTION_PURPOSE[a.id] || "";
  const label=(c.actionLabel&&c.actionLabel[a.id]) || a.label;
  return `<button class="action-card ${used?'used':''}" data-action="${a.id}" ${used||!available?'disabled':''}><b>${htmlSafe(label)}</b>${used?'<small>Already reviewed</small>':(!available?'<small>Not available in this case</small>':(purpose?`<small>${htmlSafe(purpose)}</small>`:''))}</button>`;
}
function doAction(id){
  if(id==="reexam") return doReexam();
  const c=getCase(), a=findAction(id); if(!c||!a||S.actionsTaken.includes(id)) return;
  const q=c.activeQuestions&&c.activeQuestions[id];
  if(q) return openQuestionBeforeAction(id,q);
  revealAction(id);
}
function revealAction(id){
  const c=getCase(), a=findAction(id); if(!c||!a||S.actionsTaken.includes(id)) return;
  const text=c.r[id]||"No additional information is available.";
  S.actionsTaken.push(id); S.revealed[id]=text; S.timeline.push({time:stamp(),type:actionType(id),title:a.label,text:text}); save(); closeSheet(); render();
}
function openQuestionBeforeAction(id,q){
  const a=findAction(id);
  showSheet("Before you reveal the result",q.prompt||"What question are you trying to answer?",`
    <div class="active-question-intro">Choose the reason that best matches your current uncertainty. This is not scored.</div>
    <div class="choice-list active-question-options">${(q.options||[]).map((opt,i)=>`<button type="button" class="choice-option active-question-option" data-qopt="${i}"><b>${htmlSafe(opt.label||opt)}</b>${opt.desc?`<span>${htmlSafe(opt.desc)}</span>`:''}</button>`).join('')}</div>
    <div id="questionFeedback"></div>
    <div class="sheet-actions"><button class="secondary" id="cancelQuestion">Back</button><button class="primary" id="revealQuestionResult" disabled>Reveal ${htmlSafe(a?a.label:'result')}</button></div>`);
  $("#cancelQuestion").onclick=()=>{closeSheet(); const type=actionType(id); openSheet(type==="Examination"?"examine":(type==="History"?"ask":"test"));};
  $("#sheetBody").querySelectorAll("[data-qopt]").forEach(b=>b.onclick=()=>{
    $("#sheetBody").querySelectorAll("[data-qopt]").forEach(x=>x.classList.remove("selected")); b.classList.add("selected");
    const idx=Number(b.dataset.qopt); const opt=(q.options||[])[idx]||{}; S.questionAnswers[`${getCase().id}:${id}`]=idx; save();
    const feedback=q.feedback || (opt.correct?"That question matches what this test can help resolve.":"Keep the purpose of the test tied to the uncertainty in your working model.");
    $("#questionFeedback").innerHTML=`<div class="active-feedback"><div class="eyebrow">Why this test?</div><p>${feedback}</p></div>`;
    $("#revealQuestionResult").disabled=false;
  });
  $("#revealQuestionResult").onclick=()=>revealAction(id);
}
function actionType(id){ if(ACTIONS.history.some(a=>a.id===id))return"History"; if(ACTIONS.imaging.some(a=>a.id===id))return"Imaging"; if(ACTIONS.other.some(a=>a.id===id))return (id==="eeg"||id==="ceeg")?"EEG":"Other"; return"Examination"; }
function doReexam(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  const idx=Math.min(S.reexamCount,Math.max(0,r.reexam.length-1)); const text=r.reexam[idx]||"No major interval change on repeat examination.";
  S.reexamCount++; S.timeline.push({time:stamp(),type:"Re-examination",title:`Repeat neurologic examination${S.reexamCount>1?` #${S.reexamCount}`:''}`,text}); save(); closeSheet(); render();
}

function openModelSheet(first){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  const locs=(r.localizationOptions||LOCALIZATIONS.map(x=>x.id)).map(id=>LOCALIZATIONS.find(x=>x.id===id)).filter(Boolean);
  const syns=(r.syndromeOptions||SYNDROMES.map(x=>x.id)).map(id=>SYNDROMES.find(x=>x.id===id)).filter(Boolean);
  let step=0;
  const steps=[
    {title:'How did this happen?',help:'Choose the tempo that best describes onset and evolution.',body:()=>`<div class="choice-list">${TEMPOS.map(x=>radioHTML("tempo",x.id,x.title,x.desc,S.tempo)).join('')}</div>`},
    {title:'Where is it?',help:'Localize from the observed neurologic examination before naming a diagnosis.',body:()=>`<div class="choice-list">${locs.map(x=>radioHTML("localization",x.id,x.title,x.desc,S.localization)).join('')}</div>`},
    {title:'What syndrome does that produce?',help:'Build the syndrome from the pattern of observed findings.',body:()=>`<div class="choice-list">${syns.map(x=>radioHTML("syndrome",x.id,x.title,x.desc,S.syndrome)).join('')}</div>`},
    {title:'What could cause this syndrome here?',help:'Set an initial qualitative differential. This is a working model, not a final answer.',body:()=>probBoardHTML(r.hypotheses,S.hypothesisLevels,"modelprob")}
  ];
  function draw(){
    const x=steps[step];
    showSheet(first?'Frame the problem':'Revise the model',x.title,`<div class="frame-progress"><span>${step+1} of ${steps.length}</span><div>${steps.map((_,i)=>`<i class="${i<=step?'on':''}"></i>`).join('')}</div></div><p class="section-help">${x.help}</p>${x.body()}<div id="modelWarning" class="note warning" hidden></div><div class="sheet-actions"><button class="secondary" id="frameBack" ${step===0?'disabled':''}>Back</button><button class="primary" id="frameNext">${step===steps.length-1?'Save working model':'Next'}</button></div>`);
    $("#sheetBody").querySelectorAll("[data-prob-group]").forEach(wireProbGroup);
    $("#frameBack").onclick=()=>{if(step>0){capture();step--;draw();}};
    $("#frameNext").onclick=()=>{
      const warn=$("#modelWarning");
      if(!validateStep()){warn.hidden=false;warn.textContent='Choose an option before continuing.';return;}
      capture();
      if(step<steps.length-1){step++;draw();return;}
      const levels=readProbGroups("modelprob");
      if(!Object.keys(levels).length){warn.hidden=false;warn.textContent='Set at least one differential estimate before continuing.';return;}
      S.hypothesisLevels=levels;
      const wasFramed=S.modelFramed; S.modelFramed=true;
      if(wasFramed){S.lastModelUpdateDataCount=dataCount();S.reasoningUpdates.push({time:stamp(),levels:{...S.hypothesisLevels}});}
      save();closeSheet();render();
    };
  }
  function capture(){
    const t=getChecked("tempo"); if(t)S.tempo=t;
    const l=getChecked("localization"); if(l)S.localization=l;
    const y=getChecked("syndrome"); if(y)S.syndrome=y;
    if(step===3){const levels=readProbGroups("modelprob"); if(Object.keys(levels).length)S.hypothesisLevels=levels;}
  }
  function validateStep(){
    if(step===0)return !!getChecked("tempo");
    if(step===1)return !!getChecked("localization");
    if(step===2)return !!getChecked("syndrome");
    return true;
  }
  draw();
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
    S.hypothesisLevels=next; S.lastModelUpdateDataCount=dataCount(); S.reasoningUpdates.push({time:stamp(),levels:{...next}}); save();closeSheet();render();
  };
}

function openFinalizeSheet(){
  const c=getCase(), r=reasoningFor(c); if(!c)return;
  if(!canFinalize()){ showSheet("","Before finalizing",`<div class="note">Frame the syndrome and gather at least one targeted piece of additional information before finalizing the case.</div><div class="sheet-actions"><button class="primary" id="backToCase">Return to case</button></div>`); $("#backToCase").onclick=closeSheet; return; }
  const dxOptions=[...r.hypotheses,"Diagnosis remains uncertain / more than one process may contribute"];
  const management=(c.managementOptions||PATHWAYS.map(x=>x.id)).map(id=>PATHWAYS.find(x=>x.id===id)).filter(Boolean);
  showSheet("","Finalize assessment",`
    <div class="sheet-section"><h3>${htmlSafe(c.finalInterpretationLabel||"Working interpretation")}</h3>${c.finalInterpretationHelp?`<p class="section-help">${htmlSafe(c.finalInterpretationHelp)}</p>`:''}<div class="choice-list">${dxOptions.map((x,i)=>radioHTML("finalDiagnosis",`dx-${i}`,x,"",S.finalDiagnosis===x?`dx-${i}`:null)).join('')}</div></div>
    <div class="sheet-section"><h3>${htmlSafe(c.finalManagementLabel||"Management")}</h3>${c.finalManagementHelp?`<p class="section-help">${htmlSafe(c.finalManagementHelp)}</p>`:''}<div class="choice-list">${management.map(p=>radioHTML("pathway",p.id,p.title,p.desc,S.pathwayChoice)).join('')}</div></div>
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
  const trajectory=S.reasoningUpdates.map((u,i)=>`<div class="trajectory-item"><span class="trajectory-time">Update ${i+1}</span><div>${r.hypotheses.filter(h=>u.levels[h]).map(h=>`${htmlSafe(h)} — ${probLabel(u.levels[h])}`).join('<br>')}</div></div>`).join('');
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
    <div class="debrief-section"><h2>${htmlSafe(c.debriefDecisionTitle||"Case-specific clinical reasoning")}</h2>${c.clinicalQuestion?`<div class="debrief-question"><span>Clinical question</span><b>${htmlSafe(c.clinicalQuestion)}</b></div>`:''}<ul class="plain-list">${c.teach.map(t=>`<li>${t}</li>`).join('')}</ul></div>
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
