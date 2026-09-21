// ============================================================
// Neurologic reasoning framework
// ============================================================
const TEMPOS = [
  {id:'hyperacute', title:'Hyperacute / sudden', desc:'Seconds to minutes; maximal or near-maximal early.'},
  {id:'acute', title:'Acute', desc:'Develops over minutes to hours.'},
  {id:'fluctuating', title:'Fluctuating / episodic', desc:'Waxing, waning, recurrent, or stereotyped.'},
  {id:'progressive', title:'Progressive', desc:'Builds over hours to days rather than appearing all at once.'},
  {id:'unclear', title:'Unclear', desc:'The timeline itself is uncertain or conflicting.'}
];

const LOCALIZATIONS = [
  {id:'cortex', title:'Cerebral cortex', desc:'Language, neglect, gaze, visual field, cortical sensory or motor pattern.'},
  {id:'subcortical', title:'Subcortical / deep hemisphere', desc:'Internal capsule, thalamus, deep white matter.'},
  {id:'brainstem', title:'Brainstem', desc:'Cranial nerve findings, crossed signs, long-tract pattern.'},
  {id:'cerebellar', title:'Cerebellar / vestibular network', desc:'Gait or truncal ataxia, nystagmus, dysmetria, acute vestibular syndrome.'},
  {id:'diffuse', title:'Diffuse cerebral dysfunction', desc:'Global attention/arousal disturbance without a coherent focal syndrome.'},
  {id:'nmj_pns', title:'NMJ / peripheral neuromuscular', desc:'Fatigable, bulbar, ocular, proximal, peripheral nerve, or muscle pattern.'},
  {id:'multifocal_unclear', title:'Multifocal / unclear', desc:'Findings do not yet map cleanly to one neuroanatomic site.'}
];

const PROB_LEVELS = [
  {id:'very_low', label:'Very low'},
  {id:'low', label:'Low'},
  {id:'moderate', label:'Moderate'},
  {id:'high', label:'High'}
];

// ============================================================
// Syndrome families
// ============================================================
const SYNDROMES = [
  {id:'dominant_mca', title:'Dominant hemispheric cortical syndrome', desc:'Aphasia with other cortical findings such as gaze preference, visual field loss, or contralateral weakness.'},
  {id:'nondominant_mca', title:'Nondominant hemispheric cortical syndrome', desc:'Neglect or extinction with other cortical findings such as gaze preference, visual field loss, or contralateral weakness.'},
  {id:'aca', title:'Medial frontal / leg-predominant hemispheric syndrome', desc:'Leg-predominant weakness with possible abulia or other medial frontal findings.'},
  {id:'lacunar', title:'Pure motor or sensory subcortical syndrome', desc:'Pure motor, pure sensory, or related deep-structure pattern without cortical signs.'},
  {id:'thalamic', title:'Hemisensory / deep hemispheric syndrome', desc:'Prominent hemisensory findings with possible altered arousal or other deep hemispheric features.'},
  {id:'posterior_brainstem', title:'Brainstem syndrome', desc:'Cranial nerve findings, crossed signs, long-tract findings, dysarthria, or impaired arousal.'},
  {id:'cerebellar_vestibular', title:'Acute vestibular / cerebellar syndrome', desc:'Continuous vertigo or dizziness with nystagmus, gait/truncal instability, ocular motor findings, hearing symptoms, or dysmetria.'},
  {id:'hemorrhage', title:'Acute focal syndrome with headache / vomiting / impaired arousal', desc:'A focal neurologic syndrome accompanied by severe headache, vomiting, or reduced level of consciousness.'},
  {id:'mimic', title:'Diffuse, nonfocal, or uncertain syndrome', desc:'The observations do not yet form a coherent focal syndrome, or the localization remains uncertain.'}
];

// ============================================================
// K/U/C fields
// ============================================================
const KUC_FIELDS = [
  {id:'identity', label:'Identity'},
  {id:'lkw', label:'LKW'},
  {id:'baseline', label:'Baseline mRS'},
  {id:'anticoag', label:'Anticoag hx'},
  {id:'seizure', label:'Seizure hx'},
  {id:'collateral', label:'Collateral'},
  {id:'glucose', label:'Glucose'},
  {id:'bp', label:'BP'},
  {id:'nihss', label:'NIHSS / exam'},
  {id:'ncct', label:'CT head'},
  {id:'cta', label:'CTA'},
  {id:'ctp', label:'CTP'},
  {id:'mri', label:'MRI'}
];

// ============================================================
// Action menu (categorized)
// ============================================================
const ACTIONS = {
  bedside:[
    {id:'glucose', label:'Check glucose'},
    {id:'bp', label:'Repeat BP'},
    {id:'nihss', label:'Perform NIHSS'},
    {id:'reexam', label:'Repeat neurologic examination', repeatable:true}
  ],
  history:[
    {id:'collateral', label:'Call collateral'},
    {id:'ems_timeline', label:'Ask EMS for timeline'},
    {id:'meds', label:'Ask anticoag / meds'},
    {id:'baseline', label:'Ask baseline mRS'},
    {id:'seizure_hx', label:'Ask seizure history'},
    {id:'osh', label:'Search OSH records'}
  ],
  imaging:[
    {id:'ncct', label:'Order CT head'},
    {id:'cta', label:'Order CTA'},
    {id:'ctp', label:'Order CTP'},
    {id:'mri', label:'Order MRI DWI/FLAIR'}
  ],
  other:[
    {id:'eeg', label:'Order rapid EEG'},
    {id:'pharmacy', label:'Call pharmacy'}
  ]
};

// Map each action to which K/U/C fields it updates when revealed
const ACTION_UPDATES = {
  glucose:['glucose'], bp:['bp'], nihss:['nihss','identity'], reexam:['nihss'],
  collateral:['collateral','lkw','baseline','anticoag','seizure','identity'],
  ems_timeline:['lkw'], meds:['anticoag'], baseline:['baseline'], seizure_hx:['seizure'],
  osh:['baseline','anticoag'], ncct:['ncct'], cta:['cta'], ctp:['ctp'], mri:['mri'],
  eeg:[], pharmacy:['anticoag']
};

// ============================================================
// Pathways (confidence language)
// ============================================================
const PATHWAYS = [
  {id:'reperfusion', title:'Reperfusion candidate', desc:'Call attending. Acute ischemic stroke that may benefit from IV tenecteplase, mechanical thrombectomy, or both. Page IR to discuss MT if LVO present. Specifics depend on window, occlusion location, ASPECTS, and contraindications.'},
  {id:'dapt', title:'DAPT (minor nondisabling stroke)', desc:'Call attending. Acute ischemic stroke suspected but the deficit is not disabling and NIHSS is 0 to 5. Start dual antiplatelet therapy (clopidogrel plus aspirin). No reperfusion. Full stroke workup still applies.'},
  {id:'hemorrhage', title:'Hemorrhage pathway', desc:'Call attending. CT head shows hemorrhage. Stop reperfusion thinking. Lower SBP toward 130 to under 140 smoothly, avoid overshoot below 130. Reverse anticoagulation if applicable. Page NSGY. NICU disposition.'},
  {id:'mimic_unclear', title:'Mimic or unclear', desc:'Call attending. Stroke is not the working diagnosis or it is unclear. Treat the trigger (seizure, hypoglycemia, etc.) when there is one. In some mimics there is no specific stroke intervention, only observation and workup of the underlying cause. Rapid EEG if NCSE concern.'}
];

// ============================================================
// Case illustrations (inline SVG)
// ============================================================
const CASE_IMAGES = {
  // Structured as {caseId: {actionId: {label, caseTitle, author, url, note}}}
  // Image card appears alongside the relevant action reveal in Phase B and Phase C.
  // Cases without entries get no image card.
  c1: {
    ncct: {
      label: 'View a real CT head from a similar case',
      caseTitle: '',
      author: 'Dr Andrew Murphy',
      url: 'https://radiopaedia.org/cases/left-mca-stroke-dense-mca-sign',
      note: 'Take a careful look at the MCAs and the Sylvian fissures on each side before clicking back. What stands out?'
    }
  }
  // To add more: c4 ncct (large core ASPECTS), c8 ncct (hyperdense MCA), c9 ncct (basal ganglia ICH).
  // Just add entries with the same shape and a Radiopaedia URL.
};

// ============================================================
// CASES (compact)
// ============================================================
const CASES = [

{id:'c1', n:1,
 arrival:'About 68 years old, brought in by EMS from a restaurant. EMS says the patient suddenly stopped talking mid meal, kept staring to the left, and stopped moving the right arm and leg. No ID on her, no family with her yet.',
 activation:'Acute language change and right-sided weakness',
 context:'Older adult; identity, baseline, medications, and collateral are initially unavailable.',
 presentation:'EMS reports sudden loss of speech, persistent leftward gaze, and loss of movement in the right arm and leg while eating at a restaurant.',
 unknowns:['identity','lkw','baseline','anticoag','seizure','collateral','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 118.',
  bp:'BP 168/92.',
  nihss:'NIHSS 15. Forced left gaze (gaze 2), global aphasia (language 3), right facial droop (facial 2), dense right arm and leg plegia (arm 4, leg 4).',
  ncct:'CT head: no hemorrhage, no early ischemic changes. Reduced ASPECTS due to early ischemic change in the left caudate and lentiform nuclei, with possible additional insular/cortical MCA involvement.',
  cta:'CTA: left M1 occlusion. Cervical vessels patent.',
  ctp:'CTP: small core, large penumbra (mismatch).',
  mri:'MRI not pursued. CTA is diagnostic.',
  collateral:'Daughter located 8 minutes in: last seen well at 1:30 PM (about 90 minutes ago). She is independent at baseline. No seizures. No anticoagulants.',
  ems_timeline:'EMS scene call at 2 PM. Patient was symptomatic on arrival. Onset around 1:30 PM per witness.',
  meds:'No anticoagulation. Hypertension only.',
  baseline:'mRS 0. Independent, working part time.',
  seizure_hx:'No seizure history.',
  eeg:'Not indicated for this presentation.',
  osh:'No outside hospital records.',
  pharmacy:'Preparing TNK if needed.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','collateral'],
 syndromeStory:'This patient suddenly stopped talking, kept staring to the left, and lost movement of the right arm and leg. That bedside pattern is a left dominant hemispheric cortical syndrome, classic for a left middle cerebral artery (M1) occlusion. On the very first non-contrast CT head, the L M1 may already show a <b>hyperdense MCA sign</b>, a bright linear thrombus visible before any contrast is given (the bright structure in the L Sylvian fissure on the Radiopaedia example). Recognizing it can drive immediate IV tenecteplase even before CTA confirms the occlusion. CTA then confirmed the L M1 occlusion, matching the syndrome. Within 90 minutes of onset, this is a reperfusion candidate: IV tenecteplase plus paging IR to discuss MT in parallel.',
 teach:[
   'Recognize dominant hemispheric cortical dysfunction at the bedside: aphasia, forced gaze deviation toward the lesion, and dense contralateral face-arm-leg weakness point to a proximal anterior-circulation LVO until proven otherwise.',
   'Inspect the noncontrast CT before CTA finishes. Compare both MCAs and both Sylvian fissures; a hyperdense MCA sign can support immediate reperfusion thinking even before vascular imaging returns.',
   'Run IV thrombolysis and EVT workflows in parallel. Do not wait to see whether the lytic works before activating thrombectomy.',
   'The 2026 AHA/ASA AIS guideline endorses either alteplase or tenecteplase within 4.5 hours; tenecteplase often simplifies workflow because it is a single bolus rather than a 60-minute infusion.',
   'Bridging thrombolysis still matters in eligible LVO. In BRIDGE-TNK, 90-day functional independence was 53% with tenecteplase plus thrombectomy vs 44% with thrombectomy alone, with similar safety.'
 ],
 citations:['2026 AHA/ASA Acute Ischemic Stroke Guideline', '2025 TNKase FDA label', 'BRIDGE-TNK trial'],
 trap:'Delaying reperfusion because the patient identity is not yet known. Identity sorting can happen in parallel.'
},

{id:'c2', n:2,
 arrival:'Around 74 years old, found by family on the bedroom floor at 6:30 AM. She is not speaking at all, does not seem to see anything to her right, and is not moving the right arm or leg. Family last saw her normal at 10 PM the night before.',
 activation:'Wake-up focal neurologic deficit',
 context:'Older adult found at home; last known well was the prior evening.',
 presentation:'At 6:30 AM she is found on the floor, mute, not responding to the right side of visual space, and not moving the right arm or leg.',
 unknowns:['lkw','baseline','anticoag','seizure','collateral','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 124.',
  bp:'BP 178/94.',
  nihss:'NIHSS 16. Mute (language 3), right hemianopia (vision 2), right facial droop (facial 2), right arm and leg plegia (arm 4, leg 4), forced left gaze (gaze 2).',
  ncct:'CT head: no hemorrhage, no early ischemic changes. ASPECTS 10.',
  cta:'CTA: left ICA terminus occlusion (a "T occlusion": both M1 and A1 origins involved).',
  ctp:'CTP: large mismatch, modest core with very large penumbra.',
  mri:'MRI DWI positive, FLAIR negative (mismatch present). Per WAKE-UP trial, this pattern can support IV tenecteplase in select wake-up cases. Institutional preference.',
  collateral:'Family says last seen normal at 10 PM (about 8.5 hours by discovery). Independent baseline. No anticoag.',
  ems_timeline:'Discovery at 6:30 AM. No witness to onset.',
  meds:'No anticoagulation. Hypertension, hyperlipidemia.',
  baseline:'mRS 0. Lives alone, independent.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior records.',
  pharmacy:'Preparing TNK if needed.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','ctp','collateral'],
 syndromeStory:'Found down at 6:30 AM, last seen normal at 10 PM. She is mute, is not blinking to threat on her right, and is not moving the right side. That is a dense left dominant hemispheric cortical syndrome. CTA showed a left ICA terminus (T) occlusion. Wake-up presentation is not an automatic exclusion: imaging selection drives eligibility. CTP mismatch makes her an EVT candidate, with selection out to 16 hours and in some cases 24 hours from last known well.',
 teach:[
   'Recognize a wake-up stroke as an imaging-selection problem, not an automatic exclusion.',
   'Localize first, then let imaging decide treatment. Dense aphasia, hemianopia, gaze deviation, and hemiplegia still point to a left hemispheric LVO even when onset is unknown. When onset is unknown or unconfirmed, treat the case as a wake-up stroke.',
   'Separate discovery time from tissue status. Discovery at 6:30 AM does not tell you whether salvageable penumbra remains.',
   'Use MRI DWI-FLAIR mismatch or CT/MR perfusion mismatch to decide whether reperfusion still makes sense. In WAKE-UP, alteplase improved favorable 90-day outcome (mRS 0 to 1 in 53.3% vs 41.8% with placebo) in DWI-positive / FLAIR-negative patients.',
   'The clinical trials DAWN and DEFUSE 3 established EVT benefit in selected anterior-circulation LVO up to 24 hours from last known well, it depends on whether there is salvageable tissue on imaging.'
 ],
 citations:['WAKE-UP trial', 'DAWN trial', 'DEFUSE 3 trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Calling a wake-up stroke "outside the window" before doing imaging selection.'
},

{id:'c3', n:3,
 arrival:'Adult brought in by EMS from a bus stop. Not talking. Right arm and leg are not moving. No ID, no phone, no family with her. A bystander says she just collapsed; he is not sure when.',
 activation:'Acute aphasia and right-sided weakness with unclear onset',
 context:'Adult found in public with no identification, phone, or immediately available collateral.',
 presentation:'A bystander reports a collapse at a bus stop. On EMS assessment she is not speaking and is not moving the right arm or leg; the exact onset is uncertain.',
 unknowns:['identity','lkw','baseline','anticoag','seizure','collateral','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 102.',
  bp:'BP 162/86.',
  nihss:'NIHSS 17. Forced left gaze, global aphasia, right hemianopia, right facial droop, right arm and leg plegia.',
  ncct:'CT head: no hemorrhage. ASPECTS 9 (subtle insular ribbon loss only, otherwise normal).',
  cta:'CTA: left M1 occlusion.',
  ctp:'CTP: mismatch, small core with large penumbra.',
  mri:'Not yet pursued.',
  collateral:'Initially none. Family reached at 60 minutes via phone unlock by police: family thinks last normal was around dinner, maybe 6 PM (uncertain). Independent baseline.',
  ems_timeline:'EMS arrived on scene 30 minutes ago. Bystander unsure of onset.',
  meds:'Pharmacy: no DOAC fills locally.',
  baseline:'Family says mRS 1 (mild knee arthritis, ambulatory).',
  seizure_hx:'No known seizure history per family.',
  eeg:'Not indicated.',
  osh:'No records found in 10 minutes.',
  pharmacy:'Preparing TNK if needed.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','ctp','collateral'],
 syndromeStory:'Found unresponsive at a bus stop with no ID, no phone, and no clear timeline. She has a left dominant hemispheric cortical syndrome (no speech, no movement on the right side). CTA showed a left M1 occlusion. CTP showed a mismatch. The right answer is to act on the syndrome and the imaging, not to wait for the clock to be perfect. Document the uncertainty and proceed.',
 teach:[
   'Act on concordance: dense dominant-hemisphere syndrome, proximal occlusion on CTA, and favorable perfusion mismatch together support thrombectomy even when collateral history is incomplete.',
   'The 2026 AHA/ASA AIS guideline emphasizes streamlined imaging and systems-of-care so treatment is not delayed, even when you do not have all the information about a patient.',
   'Reinforce late-window thrombectomy selection: in selected patients with favorable imaging, EVT remains indicated up to 16 hours and reasonable up to 24 hours from last known well based on DAWN and DEFUSE 3 paradigms.'
 ],
 citations:['DAWN trial', 'DEFUSE 3 trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Halting the code while waiting for collateral history or a perfect last known well time.'
},

{id:'c4', n:4,
 arrival:'61 year old woman. Family found her at 7 PM with the left side of her face drooping and the left arm and leg weak. She was last normal at 8 AM that morning. Eyes look pulled to the right, and she does not seem to notice things on the left.',
 activation:'Left-sided weakness and neglect',
 context:'61-year-old woman found symptomatic at home; last known normal earlier that morning.',
 presentation:'Family finds left facial, arm, and leg weakness. Her eyes are directed to the right and she appears not to attend to the left side.',
 unknowns:['baseline','anticoag','seizure','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'nondominant_mca',
 r:{
  glucose:'Glucose 138.',
  bp:'BP 170/92.',
  nihss:'NIHSS 17. Right gaze preference (gaze 2), left hemianopia (vision 2), left facial droop (facial 2), left arm plegia (arm 4), left leg paresis (leg 3), left hemisensory extinction (extinction 2), dysarthria (dys 2).',
  ncct:'CT head: subtle early ischemic changes in right MCA territory (caudate, lentiform, insular ribbon, M1 cortex, M2 cortex affected). ASPECTS 4 because more than half of the MCA territory shows early ischemic change.',
  cta:'CTA: right M1 occlusion.',
  ctp:'CTP: established large core (matched) with limited penumbra. Some salvageable tissue still present.',
  mri:'Not pursued. CTP is adequate.',
  collateral:'Last seen well at 8 AM (about 11 hours). Independent baseline (mRS 1). No seizure history. No anticoag.',
  ems_timeline:'Family found her at 7 PM in unusual state.',
  meds:'No anticoag. Hypertension, type 2 diabetes.',
  baseline:'mRS 1.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior records relevant.',
  pharmacy:'No DOAC fills.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','ctp','collateral'],
 syndromeStory:'Eleven hours from last known well. Right gaze deviation, left face/arm/leg weakness, and left-sided extinction. That pattern is a right nondominant hemispheric cortical syndrome. CTA confirmed a right M1 occlusion. ASPECTS is 4 because more than half of the MCA territory shows early ischemic change on CT head. Older logic would have called that too large for thrombectomy. Current evidence (SELECT2, ANGEL ASPECT, TESLA) supports thrombectomy in selected patients with ASPECTS 3 to 5, age under 80, and NIHSS at least 6. Tenecteplase at 11 hours is out of standard window.',
 teach:[
   'Recognize nondominant MCA cortex from the exam: gaze preference toward the lesion (right gaze), contralateral hemiparesis, hemianopia, and extinction or neglect are cortical findings, not a lacunar pattern.',
   'Score ASPECTS carefully but not fatalistically. Low ASPECTS predicts worse absolute prognosis, but it does not prove futility.',
   'A large core on CTP does not necessarily exclude someone from thrombectomy. Discuss with neuro-IR and your attending/fellow.',
   'Pooled lesson: a meta-analysis of six randomized large-core trials found better 90-day mRS (generalized OR 1.6) and more independent ambulation (RR 1.9), with higher symptomatic ICH (RR 1.7).',
   'Update the framing: the 2026 AHA/ASA AIS guideline expands EVT to selected patients with large-core infarction. Standard CT/ASPECTS can be used when perfusion imaging is unavailable.'
 ],
 citations:['SELECT2 trial', 'LASTE trial', 'Large-core RCT meta-analysis', '2026 AHA/ASA AIS Guideline'],
 trap:'Excluding from MT based on outdated ASPECTS logic.'
},

{id:'c5', n:5,
 arrival:'58 year old man. About two hours ago he became suddenly sleepy at home. His family noticed his left eye is sitting down and out, the left pupil is big, and his eyelid is drooping. The right arm and leg are weak. His speech is slurred.',
 activation:'Somnolence, ocular findings, and right-sided weakness',
 context:'58-year-old man with abrupt symptoms at home approximately two hours before arrival.',
 presentation:'He becomes suddenly sleepy. The left eyelid droops, the left pupil appears enlarged, the left eye rests down and out, the right arm and leg are weak, and speech is slurred.',
 unknowns:['lkw','baseline','anticoag','seizure','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'posterior_brainstem',
 r:{
  glucose:'Glucose 112.',
  bp:'BP 150/85.',
  nihss:'NIHSS 12. Decreased LOC (1a 2, 1b 2, 1c 2), left CN III findings (pupil dilated, ptosis, eye down and out), right arm and leg paresis (arm 2, leg 2), dysarthria 2. No aphasia, no neglect.',
  ncct:'CT head: no hemorrhage. Hyperdense basilar sign suggested.',
  cta:'CTA: basilar tip occlusion.',
  ctp:'CTP: limited utility for posterior circulation but reviewed.',
  mri:'Not pursued. CTA diagnostic.',
  collateral:'Wife says last seen well 1.5 hours ago. mRS 0, no seizure history, no anticoag.',
  ems_timeline:'EMS scene call 1 hour ago.',
  meds:'No anticoag.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior strokes.',
  pharmacy:'No DOAC fills.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','collateral'],
 syndromeStory:'He became suddenly sleepy. The left pupil is blown, the eyelid droops, and the eye sits down and out. The right arm and leg are weak. That bedside pattern is an ipsilateral oculomotor (CN III) palsy plus contralateral hemiparesis, which localizes to the left midbrain. The classic name is Weber syndrome. CTA confirmed a basilar tip occlusion, the vascular emergency that explains the syndrome. Within 4.5 hours of onset, this is a reperfusion candidate: IV tenecteplase plus paging IR to discuss MT. Basilar thrombectomy is Class 1 within 24 hours when NIHSS is at least 10.',
 teach:[
   'Perform a cranial nerve exam immediately in suspected posterior-circulation stroke. The NIHSS does not adequately capture brainstem signs, and CN findings are often the localization clue that changes management.',
   'Recognize crossed brainstem findings: ipsilateral CN III palsy with contralateral hemiparesis localizes to the midbrain and should trigger urgent posterior-circulation vascular imaging.',
   'A brainstem localization can still represent a basilar thrombectomy lesion.',
   'Use the basilar EVT trial numbers. In ATTENTION, mRS 0 to 3 at 90 days occurred in 46% vs 23% with EVT vs medical therapy, and mortality was 37% vs 55%. In BAOCHE, mRS 0 to 3 was 46% vs 24% in the 6 to 24 hour window.',
   'The 2026 AHA/ASA AIS guideline broadens EVT eligibility to include selected posterior-circulation occlusions.'
 ],
 citations:['ATTENTION trial', 'BAOCHE trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Calling it "just a brainstem stroke" and missing that it could be a thrombectomy lesion. NIHSS undercounts posterior strokes.'
},

{id:'c6', n:6,
 arrival:'62 year old man, brought in 90 minutes after sudden severe spinning. He cannot sit upright, he is vomiting, and his speech is slurred. There is no obvious weakness on one side.',
 activation:'Acute vertigo with inability to sit unsupported',
 context:'62-year-old man with sudden, continuous vestibular symptoms beginning about 90 minutes before arrival.',
 presentation:'He has severe continuous spinning, repeated vomiting, slurred speech, and cannot sit upright without support. There is no obvious unilateral limb weakness.',
 unknowns:['lkw','baseline','anticoag','seizure','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'cerebellar_vestibular',
 r:{
  glucose:'Glucose 95.',
  bp:'BP 158/88.',
  nihss:'NIHSS 4, driven by dysarthria and limb ataxia; no clear hemiparesis. He cannot sit unsupported. Eye examination while continuously symptomatic: spontaneous horizontal left-beating nystagmus; on right and left gaze it remains left-beating rather than reversing direction, with greater amplitude looking left. Alternate cover testing shows no vertical refixation. Rapid head impulse to the right produces a corrective saccade; impulse to the left does not.',
  ncct:'CT head: no hemorrhage. Posterior fossa imaging often degraded by artifact.',
  cta:'CTA: distal basilar narrowing with thrombus.',
  ctp:'CTP: limited posterior coverage.',
  mri:'MRI DWI: acute posterior circulation infarcts (cerebellar plus pontine).',
  collateral:'Wife reports last seen well 2 hours ago. mRS 0, no seizure history, no anticoag.',
  ems_timeline:'EMS arrival 90 minutes after symptom onset.',
  meds:'No anticoag. Hypertension.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior strokes.',
  pharmacy:'No DOAC fills.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','mri','collateral'],
 syndromeStory:'Sudden severe spinning, vomiting, slurred speech, and inability to sit up. The bedside eye findings are not a classic central HINTS pattern, but the severe truncal instability and dysarthria remain discordant with a simple peripheral explanation. NIHSS is misleadingly low at 4. The bedside pattern is a cerebellar/vestibular posterior circulation syndrome, and CTA confirmed a distal basilar thrombus. MRI showed acute infarcts in cerebellum and pons. We treat the syndrome, not the score. Within 4.5 hours, this is a reperfusion candidate: IV tenecteplase plus an IR conversation about MT. NIHSS less than 10 makes basilar MT a discussion point, but the syndrome severity argues for it.',
 teach:[
   'Take the acute vestibular syndrome seriously. Do not call this peripheral vertigo until you have actively tried to prove it is peripheral.',
   'Interpret the individual bedside findings rather than accepting a label such as “HINTS positive” or “HINTS negative.” The examination only has meaning in the correct acute vestibular syndrome context.',
   'Here, the nystagmus remains left-beating in both gaze directions, there is no skew, and the rightward head impulse produces a corrective saccade. Those findings decrease the probability of a central vestibular lesion, but they must be reconciled with the rest of the syndrome rather than treated as an absolute rule-out.',
   'Cranial nerve and oculomotor findings are not fully represented in the NIHSS.',
   'Pair syndrome recognition with vessel imaging. Sudden inability to sit upright, vomiting, dysarthria, severe truncal ataxia, and dangerous HINTS findings justify a low CTA threshold for posterior circulation stroke.',
   'Use posterior EVT data to reinforce why this matters: in ATTENTION and BAOCHE, favorable outcome rates were about 46% vs 24% with EVT vs medical therapy in basilar occlusion.',
   'Selected posterior-circulation thrombectomy is now part of the modern stroke treatment framework.'
 ],
 citations:['ATTENTION trial', 'BAOCHE trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Sending the patient down the vertigo or inner ear pathway because NIHSS is low.'
},

{id:'c7', n:7,
 arrival:'43 year old right-handed dentist. About 90 minutes ago, after a meeting, he noticed his right hand stopped working. He cannot make a fist or tap his fingers. The face and leg look fine.',
 activation:'Isolated right-hand weakness',
 context:'43-year-old right-handed dentist, independent at baseline, with abrupt onset about 90 minutes before evaluation.',
 presentation:'After a meeting he notices that the right hand no longer works normally: he cannot make a fist or rapidly tap his fingers. Face, speech, and leg function appear preserved.',
 unknowns:['baseline','anticoag','seizure','collateral','glucose','bp','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 94.',
  bp:'BP 138/82.',
  nihss:'NIHSS 1 (mild drift of the right arm 1). No facial droop, no leg weakness, no language deficit, no neglect.',
  ncct:'CT head: no hemorrhage, no early ischemic changes.',
  cta:'CTA: no LVO. Mild diffuse atherosclerotic disease, no acute occlusion.',
  ctp:'CTP: not done. No LVO suspected.',
  mri:'MRI: small acute DWI lesion in left precentral hand knob region of motor cortex.',
  collateral:'Patient is the historian. Independent baseline. When asked directly "do you consider this disabling to you," he says yes (he is a working dentist and uses the dominant hand precisely).',
  ems_timeline:'Patient self presented to ED.',
  meds:'No anticoag. No regular meds.',
  baseline:'mRS 0. Active dentist.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior records.',
  pharmacy:'No DOAC fills. Ready to prep TNK if needed'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','mri','collateral'],
 syndromeStory:'He cannot make a fist or tap his fingers with the dominant hand, but the face and leg look fine. The MRI showed a small infarct in the hand area of the left motor cortex (the hand knob). NIHSS is 1. Ask him directly: "Do you consider this deficit disabling to you?" He says yes. Patient self-assessment of disability is what drives the decision in mild stroke, more than the NIHSS number or even the occupation alone. Current guidance supports IV tenecteplase for any disabling deficit regardless of NIHSS. DAPT (clopidogrel plus aspirin for 21 days, then aspirin alone, based on CHANCE and POINT) is reserved for nondisabling minor stroke (NIHSS 0 to 5) when reperfusion is not chosen, supported by PRISMS data.',
 teach:[
   'Recognize that isolated hand weakness can be cortical stroke, especially when fine finger movements fail disproportionately.',
   'Ask the patient directly whether the deficit is disabling to them to further decide on treatment.',
   'Separate minor disabling from minor nondisabling stroke; that distinction changes treatment more than the raw NIHSS number.',
   'For minor nondisabling stroke, it is reasonable to consider DAPT instead of TNK. In ARAMIS, DAPT was noninferior to alteplase for excellent 90-day outcome (93.8% vs 91.4%) in minor nondisabling stroke. Ultimately discuss tenecteplase vs DAPT with the patient.',
   'For recurrent prevention after minor stroke or high-risk TIA, short-course DAPT lowers recurrent ischemic stroke risk (pooled RR 0.68 vs single antiplatelet therapy).',
   'The evidence for thrombolysis in minor disabling stroke is less settled than it once seemed; always discuss with your attending/fellow.'
 ],
 citations:['ARAMIS trial', 'AHA DAPT evidence review', 'INSPIRES trial', 'TEMPO-2 trial'],
 trap:'Calling it minor stroke and not treating because NIHSS is 1.'
},

{id:'c8', n:8,
 arrival:'72 year old man. About 2 hours ago he suddenly stopped speaking, his eyes pulled to the left, and his right arm and leg stopped moving. EMS keeps getting blood pressures around 212/118.',
 activation:'Acute aphasia and right hemiparesis with severe hypertension',
 context:'72-year-old man with markedly elevated blood pressure recorded repeatedly by EMS.',
 presentation:'About two hours earlier he suddenly stopped speaking, developed leftward gaze deviation, and stopped moving the right arm and leg.',
 unknowns:['baseline','anticoag','seizure','collateral','glucose','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 132.',
  bp:'BP 212/118 confirmed on bedside repeat. Two cycles of labetalol underway.',
  nihss:'NIHSS 18. LOC 1, gaze 2, hemianopia 2, right facial 2, right arm 4, right leg 4, language 3.',
  ncct:'CT head: no hemorrhage. ASPECTS 9 (subtle insular involvement only).',
  cta:'CTA: left M1 occlusion.',
  ctp:'CTP: mismatch.',
  mri:'Not needed.',
  collateral:'Wife: last seen well 2 hours ago. mRS 0. Hypertension poorly controlled. No anticoag.',
  ems_timeline:'EMS scene call 90 minutes ago.',
  meds:'Hypertension, hyperlipidemia. No anticoag.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No relevant prior records.',
  pharmacy:'No DOAC fills. Ready to prep TNK if needed.'
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','collateral'],
 syndromeStory:'Concordant left dominant hemispheric cortical syndrome with a concordant left M1 occlusion on CTA. The catch is BP 212/118. The job is to lower BP just enough to be eligible for reperfusion (under 185/110), not to normalize it. Aggressive BP lowering before reperfusion can reduce collateral perfusion and worsen outcome. After successful EVT, the standard ceiling stays at or under 180/105, and pushing SBP below 140 is harmful (Class III).',
 teach:[
   'BEFORE IV thrombolysis, lower BP just enough to reach eligibility (under 185/110). AFTER IV thrombolysis or EVT, keep BP under 180/105 for 24 hours.',
   'Do not try to normalize BP before reperfusion. Excessive early reduction can compromise collateral flow.',
   'BP after EVT: current evidence supports avoiding active reduction into the under 130 to 140 range early after successful MT.',
   'For a stroke that does not undergo reperfusion therapy, do not routinely lower BP unless it is roughly at or above 220/120, and then reduce only modestly (about 15% in 24 hours).',
   'After EVT, the patient gets BP management in the neuro-ICU.'
 ],
 citations:['2026 AHA/ASA AIS Guideline', 'Acute stroke BP comparative review (2025/2026)', 'ESO blood pressure guideline for AIS / MT'],
 trap:'Trying to normalize BP before EVT (delays reperfusion, hurts collaterals), then continuing aggressive lowering after EVT.'
},

{id:'c9', n:9,
 arrival:'66 year old man. About 90 minutes ago he suddenly developed the worst headache of his life, vomited, and the left arm and leg went weak. EMS getting blood pressures around 198/108.',
 activation:'Acute headache, vomiting, and left-sided weakness',
 context:'66-year-old man with abrupt symptoms about 90 minutes before arrival and severe hypertension in the field.',
 presentation:'He develops a sudden severe headache, vomits, and then develops weakness of the left arm and leg.',
 unknowns:['baseline','anticoag','seizure','collateral','glucose','nihss','cta','ctp','mri'],
 syndrome:'hemorrhage',
 r:{
  glucose:'Glucose 140.',
  bp:'BP 198/108 confirmed.',
  nihss:'NIHSS 9. LOC 1, right facial 2, left arm 3, left leg 2, left sensory 1.',
  ncct:'CT head: right basal ganglia ICH, about 25 mL, no IVH, mild mass effect.',
  cta:'CTA: no spot sign, no underlying vascular lesion identified.',
  ctp:'CTP: not indicated.',
  mri:'Not indicated acutely.',
  collateral:'Wife: last seen well 90 minutes ago. Hypertension, no anticoag, mRS 0.',
  ems_timeline:'EMS scene call 60 minutes ago.',
  meds:'Hypertension. No anticoag.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No relevant prior records.',
  pharmacy:'No DOAC or warfarin fills.'
 },
 pathway:'hemorrhage',
 ideal:['glucose','bp','nihss','ncct','collateral'],
 syndromeStory:'Sudden worst headache of his life, vomiting, and left-sided weakness. CT head shows a right basal ganglia hemorrhage of about 25 mL. This is a hemorrhage pathway, not a reperfusion pathway. Current ICH BP guidance is smooth, sustained reduction of SBP to 130 to under 140, avoiding overshoot below 130. No anticoagulation history here, so no reversal is needed. NSGY consult, NICU disposition.',
 teach:[
   'Recognize the switch point immediately: headache, vomiting, focal deficit, and ICH on CT means hemorrhage pathway, not reperfusion pathway.',
   'Aim for rapid, smooth, sustained BP control rather than dramatic swings.',
   'In spontaneous ICH with presenting SBP 150 to 220, lower toward about 140, but avoid overshoot below about 130 and avoid large variability.',
   'Caveat for very high presenting SBP: in ATACH-2 patients with initial SBP at or above 220, intensive lowering was associated with more neurologic deterioration and more kidney injury. Avoid aggresively lowering the pressure down.'
 ],
 citations:['INTERACT2 trial', 'ATACH-2 trial', 'ATACH-2 subgroup analysis (SBP ≥ 220)', 'Acute stroke BP comparative review (2025/2026)'],
 trap:'Treating ICH BP like a generic hypertensive emergency and overshooting below 130. Importing reperfusion BP logic onto ICH.'
},

{id:'c10', n:10,
 arrival:'67 year old man with high blood pressure, diabetes, smoking, and prior TIA. At dinner he became unresponsive, his head turned forcefully to the right, and his right face and right arm started jerking rhythmically for about a minute. After it stopped, he was confused and breathing heavily. EMS finds him sleepy, slurred speech, weak in the right arm.',
 activation:'Seizure-like activity followed by weakness and confusion',
 context:'67-year-old man with hypertension, diabetes, tobacco exposure, prior TIA, and a witnessed paroxysmal event at dinner.',
 presentation:'He becomes unresponsive, forcefully turns his head to the right, and has rhythmic jerking of the right face and arm for about a minute. Afterward he is confused and tachypneic; EMS finds sleepiness, slurred speech, and right-arm weakness.',
 unknowns:['baseline','anticoag','collateral','glucose','bp','nihss','ncct','cta','mri','seizure'],
 syndrome:'mimic',
 r:{
  glucose:'Glucose 108.',
  bp:'BP 152/88.',
  nihss:'NIHSS 3 on initial exam (LOC 1, right arm 1, dysarthria 1). Improving over 30 to 45 minutes.',
  ncct:'CT head: no hemorrhage. No acute findings.',
  cta:'CTA: no LVO. Mild atherosclerotic disease noted, no acute occlusion.',
  ctp:'CTP: not done. No LVO suspected.',
  mri:'MRI: no acute infarct on DWI (if obtained).',
  collateral:'Daughter: known epilepsy on lamotrigine, recently subtherapeutic. Last seizure 1 year ago. mRS 1.',
  ems_timeline:'EMS witnessed end of seizure activity 30 minutes ago.',
  meds:'Lamotrigine. No anticoag. Hypertension, diabetes.',
  baseline:'mRS 1.',
  seizure_hx:'Known epilepsy, recently subtherapeutic.',
  eeg:'Rapid EEG: no ongoing ictal activity, postictal slowing only.',
  osh:'No recent strokes documented.',
  pharmacy:'No DOAC fills. Ready to prep TNK if needed.'
 },
 pathway:'mimic_unclear',
 ideal:['glucose','bp','nihss','ncct','collateral','seizure_hx','cta','eeg'],
 syndromeStory:'He became unresponsive, his head turned forcefully to the right, and his right face and arm jerked for about a minute. He woke up confused. The right arm is weak but improving. The bedside sequence (forced head turn, positive motor activity, postictal confusion, improving deficit) fits Todd paralysis from a focal seizure. CTA showed no large vessel occlusion. Vascular risk factors do not erase the seizure clues. In this case the focal deficit continues to improve and the overall sequence supports a postictal deficit, so thrombolysis is not pursued. Seizure at onset itself does not exclude thrombolysis when a persistent disabling deficit is still thought to represent acute ischemic stroke; rapid EEG is reasonable if impaired awareness persists or recurs without convulsive activity.',
 teach:[
   'Reconstruct the sequence of symptoms. In stroke, symptoms usually begin with a NEGATIVE deficit (sudden loss of function). In seizure, symptoms often begin with POSITIVE motor activity and then leave a transient negative deficit.',
   'Why the gaze direction differs in a seizure: in stroke, the damaged hemisphere cannot drive the eyes anymore, so the working hemisphere wins and the eyes are PULLED TOWARD the lesion. In seizure, the active electrical firing PUSHES the eyes AWAY from the focus, toward the symptomatic side. So a left frontal seizure causes the head and eyes to turn forcefully to the right, exactly what you see here.',
   'Ask specifically about head version, eye deviation, rhythmic jerking, postictal confusion, and gradual improvement. Those details discriminate Todd paralysis from stroke better than vascular risk factors do.',
   'Do not make the opposite mistake either: seizure at onset does not exclude stroke. Use CT and CTA to rule out hemorrhage and LVO, and use EEG when persistent altered mentation raises concern for ongoing ictal activity.'
 ],
 citations:['2026 AHA/ASA AIS Guideline'],
 trap:'Letting vascular risk factors erase the seizure clues, or assuming seizure excludes stroke.'
}

];

// ============================================================
// Case reasoning metadata: expected tempo/localization, differential, trajectory
// ============================================================
const CASE_REASONING = {
  c1:{tempo:'hyperacute', localization:'cortex', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other stroke mimic'], reexam:['Exam remains stable: persistent global aphasia, forced left gaze, and dense right face-arm-leg weakness.']},
  c2:{tempo:'unclear', localization:'cortex', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other stroke mimic'], reexam:['No meaningful interval improvement. She remains mute with right hemianopia, left gaze preference, and dense right-sided weakness.']},
  c3:{tempo:'unclear', localization:'cortex', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other stroke mimic'], reexam:['The focal syndrome persists without meaningful improvement: aphasia, left gaze deviation, right visual field deficit, and right hemiplegia.']},
  c4:{tempo:'unclear', localization:'cortex', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other stroke mimic'], reexam:['Right gaze preference, left hemiparesis, left visual field deficit, and left extinction remain present.']},
  c5:{tempo:'hyperacute', localization:'brainstem', hypotheses:['Posterior circulation ischemia','Seizure/postictal deficit','Neuromuscular process','Toxic-metabolic process'], reexam:['The left ptosis, dilated poorly reactive pupil, down-and-out left eye, dysarthria, somnolence, and right hemiparesis persist.']},
  c6:{tempo:'hyperacute', localization:'cerebellar', hypotheses:['Posterior circulation ischemia','Peripheral vestibular neuritis','Vestibular migraine','Toxic-metabolic / medication effect'], reexam:['Ten minutes later he remains continuously vertiginous and cannot sit unsupported. Nystagmus is still left-beating in primary position and remains left-beating on gaze right and left. There is still no skew. Dysarthria and truncal instability are unchanged.']},
  c7:{tempo:'hyperacute', localization:'cortex', hypotheses:['Acute ischemic stroke','Peripheral nerve lesion','Functional neurologic disorder','Migraine aura'], reexam:['The deficit is unchanged: isolated loss of right-hand dexterity with impaired finger tapping and grip sequencing; face, language, sensation, and leg examination remain normal.']},
  c8:{tempo:'hyperacute', localization:'cortex', hypotheses:['Acute ischemic stroke','Intracranial hemorrhage','Seizure/postictal deficit','Hypertensive encephalopathy / PRES'], reexam:['Despite persistent severe hypertension, the focal cortical syndrome remains stable: aphasia, left gaze preference, right hemianopia, and dense right hemiparesis.']},
  c9:{tempo:'hyperacute', localization:'subcortical', hypotheses:['Intracranial hemorrhage','Acute ischemic stroke','Subarachnoid hemorrhage','Hypertensive encephalopathy / PRES'], reexam:['Headache, nausea, and left-sided weakness persist; level of alertness is slightly worse but there is no new focal finding.']},
  c10:{tempo:'hyperacute', localization:'multifocal_unclear', hypotheses:['Seizure with postictal deficit','Acute ischemic stroke','Nonconvulsive seizure / status','Toxic-metabolic encephalopathy'], reexam:[
    'Ten minutes later he is more alert, follows one-step commands, and the right arm now has only mild drift. Dysarthria is improving.',
    'Twenty minutes later language is intact, he is oriented to self and hospital, and right arm strength is nearly symmetric. He remains tired.',
    'A later examination shows no recurrent focal deficit. If mental status were to worsen again without convulsive activity, nonconvulsive seizure would move back up the differential.'
  ]}
};

function reasoningFor(c){ return CASE_REASONING[c.id] || {tempo:'unclear', localization:'multifocal_unclear', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other neurologic process'], reexam:['No major interval change on repeat examination.']}; }
