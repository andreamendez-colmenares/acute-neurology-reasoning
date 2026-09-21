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
  {id:'spinal_cord', title:'Spinal cord', desc:'A myelopathic pattern involving long tracts, a sensory level, or autonomic dysfunction.'},
  {id:'conus_roots', title:'Conus / cauda equina / lumbosacral roots', desc:'Leg weakness with root, saddle sensory, sphincter, or lower-motor-neuron features.'},
  {id:'pns', title:'Peripheral nerve / plexus', desc:'Length-dependent, multifocal, or nerve-distribution motor and sensory findings.'},
  {id:'nmj_pns', title:'NMJ / muscle', desc:'Fatigable, bulbar, ocular, or proximal weakness without a sensory level.'},
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
  {id:'paraparesis_mixed', title:'Bilateral lower-extremity weakness with mixed localizing features', desc:'A bilateral leg motor syndrome in which brain, cord, roots, or peripheral nervous system remain plausible.'},
  {id:'acute_confusional', title:'Acute fluctuating cognitive-attentional syndrome', desc:'Acute change in attention, arousal, and cognition with fluctuation and no stable focal syndrome.'},
  {id:'fatigable_bulbar', title:'Fluctuating fatigable bulbar motor syndrome', desc:'Speech, chewing, swallowing, facial, ocular, or proximal motor function worsens with sustained activity and improves with rest, without a sensory syndrome.'},
  {id:'structural_fluctuating_ams', title:'Fluctuating cerebral dysfunction in structural brain disease', desc:'Impaired awareness or cognition fluctuates in a patient with focal structural cerebral disease, leaving both diffuse and focal cortical mechanisms plausible.'},
  {id:'mimic', title:'Diffuse, nonfocal, or uncertain syndrome', desc:'The observations do not yet form a coherent focal syndrome, or the localization remains uncertain.'}
];

// ============================================================
// K/U/C fields
// ============================================================
const KUC_FIELDS = [
  {id:'identity', label:'Identity'},
  {id:'lkw', label:'LKW'},
  {id:'baseline', label:'Baseline'},
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
    {id:'nihss', label:'Score NIHSS'},
    {id:'focused_exam', label:'Targeted neurologic examination'},
    {id:'attention_exam', label:'Assess attention and arousal'},
    {id:'fatigability_exam', label:'Test fatigability at the bedside'},
    {id:'respiratory_bulbar_exam', label:'Assess bulbar and respiratory function'},
    {id:'reexam', label:'Repeat neurologic examination', repeatable:true}
  ],
  history:[
    {id:'collateral', label:'Call collateral'},
    {id:'ems_timeline', label:'Ask EMS for timeline'},
    {id:'meds', label:'Review medications'},
    {id:'baseline', label:'Clarify baseline function'},
    {id:'seizure_hx', label:'Ask seizure history'},
    {id:'osh', label:'Search OSH records'}
  ],
  imaging:[
    {id:'ncct', label:'Order CT head'},
    {id:'cta', label:'Order CTA'},
    {id:'ctp', label:'Order CTP'},
    {id:'mri', label:'Order MRI DWI/FLAIR'},
    {id:'mri_tspine', label:'Review / obtain MRI thoracic spine'},
    {id:'mri_lspine', label:'Obtain MRI lumbar spine / conus'}
  ],
  other:[
    {id:'labs', label:'Review targeted laboratory data'},
    {id:'eeg', label:'Order rapid EEG'},
    {id:'emg', label:'Plan EMG / nerve conduction studies'},
    {id:'lp', label:'Consider CSF studies'},
    {id:'achr_musk', label:'Order MG antibody testing'},
    {id:'rns', label:'Order repetitive nerve stimulation'},
    {id:'ceeg', label:'Start continuous EEG'}
  ]
};

// Map each action to which K/U/C fields it updates when revealed
const ACTION_PURPOSE = {
  glucose:'Exclude a rapidly reversible metabolic mimic.',
  bp:'Determine whether blood pressure changes immediate treatment or helps explain the syndrome.',
  nihss:'Describe the current focal deficit; do not let the score substitute for localization.',
  focused_exam:'Test the localization suggested by the presentation.',
  attention_exam:'Define whether impaired attention/arousal is actually present.',
  fatigability_exam:'Ask whether sustained activation converts a vague symptom into objective fatigable weakness.',
  respiratory_bulbar_exam:'Determine whether bulbar or respiratory weakness changes the urgency of the neuromuscular problem.',
  reexam:'Use change over time as diagnostic information.',
  collateral:'Clarify baseline, timing, trajectory, and relevant context.',
  ems_timeline:'Separate last-known-well, discovery time, and observed onset.',
  meds:'Review medications only when a drug exposure could plausibly explain the syndrome or change the next decision.',
  baseline:'Understand pre-illness function and what the current deficit means for this patient.',
  seizure_hx:'Assess whether seizure is a plausible competing explanation.',
  osh:'Recover prior neurologic information that could change the current model.',
  ncct:'Exclude hemorrhage and look for structural clues that change acute management.',
  cta:'Ask whether a vascular lesion explains the syndrome and changes reperfusion options.',
  ctp:'Ask whether tissue information would change an extended-window reperfusion decision.',
  mri:'Look for a structural correlate when MRI can resolve a remaining diagnostic question.',
  mri_tspine:'Ask whether a thoracic cord lesion matches the bedside localization and excludes compression.',
  mri_lspine:'Evaluate conus, cauda equina, or lower structural disease when the phenotype remains lower than the known lesion.',
  labs:'Look for systemic or metabolic contributors that plausibly explain the phenotype.',
  eeg:'Ask whether persistent or episodic impaired awareness could be ictal.',
  emg:'Characterize peripheral nervous system involvement when central and peripheral localizations remain in competition.',
  lp:'Ask whether CSF can clarify an inflammatory or infectious mechanism.',
  achr_musk:'Ask whether serology supports an autoimmune neuromuscular-junction disorder.',
  rns:'Ask whether there is physiologic evidence of impaired neuromuscular transmission.',
  ceeg:'Ask whether ongoing electrographic seizures are contributing to fluctuating or persistently impaired awareness.'
};

const ACTION_UPDATES = {
  glucose:['glucose'], bp:['bp'], nihss:['nihss','identity'], reexam:['nihss'],
  collateral:['collateral','lkw','baseline','seizure','identity'],
  ems_timeline:['lkw'], meds:[], baseline:['baseline'], seizure_hx:['seizure'],
  osh:['baseline'], ncct:['ncct'], cta:['cta'], ctp:['ctp'], mri:['mri'],
  eeg:[]
};

// ============================================================
// Pathways (confidence language)
// ============================================================
const PATHWAYS = [
  {id:'reperfusion', title:'Reperfusion candidate', desc:'Call attending. Acute ischemic stroke that may benefit from IV tenecteplase (TNK), endovascular thrombectomy (EVT), or both. These cases use TNK to mirror Duke practice. Page neuro-IR promptly when an EVT target is present.'},
  {id:'dapt', title:'DAPT (minor nondisabling stroke)', desc:'Call attending. For appropriate minor noncardioembolic, nondisabling ischemic stroke in which IV thrombolysis is not indicated, short-course dual antiplatelet therapy is preferred. The exact regimen depends on timing, NIHSS, mechanism, bleeding risk, and local protocol.'},
  {id:'hemorrhage', title:'Hemorrhage pathway', desc:'Call attending. CT head shows hemorrhage. Stop reperfusion thinking. Lower SBP toward 130 to under 140 smoothly, avoid overshoot below 130. Reverse anticoagulation if applicable. Page NSGY. NICU disposition.'},
  {id:'mimic_unclear', title:'Mimic or unclear', desc:'Call attending. Stroke is not the working diagnosis or it is unclear. Treat the trigger when there is one and continue targeted evaluation when the syndrome remains unresolved.'},
  {id:'spinal_eval', title:'Continue spinal / peripheral localization', desc:'Use serial examination and targeted testing to distinguish cord, conus/roots, peripheral nerve, and multifocal processes; escalate urgently if a compressive syndrome remains plausible.'},
  {id:'delirium_eval', title:'Treat precipitants and delirium care', desc:'Address likely systemic precipitants and supportive delirium measures; add neurologic testing when focal findings, persistent unexplained impairment, or the trajectory make another process plausible.'},
  {id:'nmj_eval', title:'Confirm NMJ dysfunction and assess severity', desc:'Use the clinical pattern, targeted serology/electrophysiology, and repeated bulbar/respiratory assessment to confirm a neuromuscular-junction disorder and identify impending respiratory or airway risk.'},
  {id:'ncse_eval', title:'Treat electrographic seizures and the structural trigger', desc:'Address ongoing electrographic seizures while also treating the underlying structural cerebral process and edema; use continuous EEG to confirm control and detect recurrence.'}
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
 context:'Older adult; identity, baseline, collateral history is initially unavailable.',
 presentation:'EMS reports sudden loss of speech, persistent leftward gaze, and loss of movement in the right arm and leg while eating at a restaurant.',
 unknowns:['identity','lkw','baseline','seizure','collateral','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 118.',
  bp:'BP 168/92.',
  nihss:'NIHSS 15. Forced left gaze (gaze 2), global aphasia (language 3), right facial droop (facial 2), dense right arm and leg plegia (arm 4, leg 4).',
  ncct:'CT head: no hemorrhage. Subtle early ischemic change involves the left caudate and lentiform nuclei, with possible additional insular/cortical MCA involvement; ASPECTS is therefore reduced.',
  cta:'CTA: left M1 occlusion. Cervical vessels patent.',
  ctp:'CTP: small core, large penumbra (mismatch).',
  mri:'MRI not pursued. CTA is diagnostic.',
  collateral:'Daughter located 8 minutes in: last seen well at 1:30 PM (about 90 minutes ago). She is independent at baseline. No seizures. No known DOAC or warfarin use.',
  ems_timeline:'EMS scene call at 2 PM. Patient was symptomatic on arrival. Onset around 1:30 PM per witness.',
  baseline:'mRS 0. Independent, working part time.',
  seizure_hx:'No seizure history.',
  eeg:'Not indicated for this presentation.',
  osh:'No outside hospital records.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','collateral'],
 syndromeStory:'This patient suddenly stopped talking, kept staring to the left, and lost movement of the right arm and leg. That bedside pattern is a left dominant hemispheric cortical syndrome, classic for a left middle cerebral artery (M1) occlusion. On the very first non-contrast CT head, the L M1 may already show a <b>hyperdense MCA sign</b>, a bright linear thrombus visible before any contrast is given (the bright structure in the L Sylvian fissure on the Radiopaedia example). Recognizing it can strengthen the working diagnosis while IV thrombolysis eligibility is assessed; vascular imaging should proceed in parallel and should not unnecessarily delay otherwise indicated thrombolysis. CTA then confirmed the L M1 occlusion, matching the syndrome. Within 90 minutes of onset, this is a reperfusion candidate: IV tenecteplase plus paging IR to discuss MT in parallel.',
 teach:[
   'Recognize dominant hemispheric cortical dysfunction at the bedside: aphasia, forced gaze deviation toward the lesion, and dense contralateral face-arm-leg weakness point to a proximal anterior-circulation LVO until proven otherwise.',
   'Within 4.5 hours, do not delay eligible TNK for additional multimodal imaging. Noncontrast CT is used to exclude hemorrhage; CTA should proceed rapidly in parallel when LVO is suspected.',
   'Run IV thrombolysis and EVT workflows in parallel. Do not wait to see whether the lytic works before activating thrombectomy.',
   'When IV thrombolysis is indicated, these cases use TNK to match Duke practice. The treatment dose used in the 2026 AHA/ASA guideline is 0.25 mg/kg (maximum 25 mg); 0.4 mg/kg is not recommended.',
   'Before TNK, recent DOAC exposure matters. The 2026 guideline treats DOAC exposure within 48 hours as a relative contraindication: use an individualized benefit-risk assessment rather than an automatic yes/no rule.',
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
 unknowns:['lkw','baseline','seizure','collateral','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 124.',
  bp:'BP 178/94.',
  nihss:'NIHSS 16. Mute (language 3), right hemianopia (vision 2), right facial droop (facial 2), right arm and leg plegia (arm 4, leg 4), forced left gaze (gaze 2).',
  ncct:'CT head: no hemorrhage, no early ischemic changes. ASPECTS 10.',
  cta:'CTA: left ICA terminus occlusion (a "T occlusion": both M1 and A1 origins involved).',
  ctp:'CTP: large mismatch, modest core with very large penumbra.',
  mri:'MRI DWI positive, FLAIR negative (mismatch present). This is an imaging-selection concept for selected unknown-onset stroke. These cases use TNK for IV thrombolysis decisions to match Duke practice.',
  collateral:'Family says last seen normal at 10 PM (about 8.5 hours by discovery). Independent baseline. No known DOAC or warfarin use.',
  ems_timeline:'Discovery at 6:30 AM. No witness to onset.',
  baseline:'mRS 0. Lives alone, independent.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior records.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','ctp','collateral'],
 syndromeStory:'Found down at 6:30 AM, last seen normal at 10 PM. She is mute, is not blinking to threat on her right, and is not moving the right side. That is a dense left dominant hemispheric cortical syndrome. CTA showed a left ICA terminus (T) occlusion. Wake-up presentation is not an automatic exclusion. CTA already establishes a proximal LVO, and her noncontrast CT remains favorable. Under the 2026 guideline, appropriate proximal ICA/M1 occlusions can qualify for EVT from 6 to 24 hours using clinical features plus CT/ASPECTS; CTP can add tissue information and may matter for an extended-window IV-thrombolysis question, but it should not become a mandatory hurdle to EVT.',
 teach:[
   'Recognize a wake-up stroke as an imaging-selection problem, not an automatic exclusion.',
   'Localize first, then let imaging decide treatment. Dense aphasia, hemianopia, gaze deviation, and hemiplegia still point to a left hemispheric LVO even when onset is unknown. When onset is unknown or unconfirmed, treat the case as a wake-up stroke.',
   'Separate discovery time from tissue status. Discovery at 6:30 AM does not tell you whether salvageable penumbra remains.',
   'For unknown-onset or extended-window IV thrombolysis, MRI DWI-FLAIR mismatch or perfusion mismatch can identify selected patients who may benefit. These cases use TNK for IV thrombolysis decisions to match Duke practice.',
   'The 2026 guideline now supports EVT for proximal ICA/M1 occlusion from 6 to 24 hours in appropriate patients with NIHSS at least 6, prestroke mRS 0 to 1, and ASPECTS at least 6. Perfusion imaging can be useful, but a favorable CTP is no longer the only way to identify a late-window EVT candidate.'
 ],
 citations:['WAKE-UP trial', 'DAWN trial', 'DEFUSE 3 trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Calling a wake-up stroke "outside the window" before doing imaging selection.'
},

{id:'c3', n:3,
 arrival:'Adult brought in by EMS from a bus stop. Not talking. Right arm and leg are not moving. No ID, no phone, no family with her. A bystander says she just collapsed; he is not sure when.',
 activation:'Acute aphasia and right-sided weakness with unclear onset',
 context:'Adult found in public with no identification, phone, or immediately available collateral.',
 presentation:'A bystander reports a collapse at a bus stop. On EMS assessment she is not speaking and is not moving the right arm or leg; the exact onset is uncertain.',
 unknowns:['identity','lkw','baseline','seizure','collateral','glucose','bp','nihss','ncct','cta','ctp','mri'],
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
  baseline:'Family says mRS 1 (mild knee arthritis, ambulatory).',
  seizure_hx:'No known seizure history per family.',
  eeg:'Not indicated.',
  osh:'No records found in 10 minutes.',
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
 unknowns:['baseline','seizure','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'nondominant_mca',
 r:{
  glucose:'Glucose 138.',
  bp:'BP 170/92.',
  nihss:'NIHSS 17. Right gaze preference (gaze 2), left hemianopia (vision 2), left facial droop (facial 2), left arm plegia (arm 4), left leg paresis (leg 3), left hemisensory extinction (extinction 2), dysarthria (dys 2).',
  ncct:'CT head: subtle early ischemic changes in right MCA territory (caudate, lentiform, insular ribbon, M1 cortex, M2 cortex affected). ASPECTS 4 because more than half of the MCA territory shows early ischemic change.',
  cta:'CTA: right M1 occlusion.',
  ctp:'CTP: established large core (matched) with limited penumbra. Some salvageable tissue still present.',
  mri:'Not pursued. CTP is adequate.',
  collateral:'Last seen well at 8 AM (about 11 hours). Independent baseline (mRS 1). No seizure history. No known DOAC or warfarin use.',
  ems_timeline:'Family found her at 7 PM in unusual state.',
  baseline:'mRS 1.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior records relevant.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','ctp','collateral'],
 syndromeStory:'Eleven hours from last known well. Right gaze deviation, left face/arm/leg weakness, and left-sided extinction. That pattern is a right nondominant hemispheric cortical syndrome. CTA confirmed a right M1 occlusion. ASPECTS is 4 because more than half of the MCA territory shows early ischemic change on CT head. Older logic would have called that too large for thrombectomy. Current evidence (SELECT2, ANGEL ASPECT, TESLA) supports thrombectomy in selected patients with ASPECTS 3 to 5, age under 80, and NIHSS at least 6. Tenecteplase at 11 hours is out of standard window.',
 teach:[
   'Recognize nondominant MCA cortex from the exam: gaze preference toward the lesion (right gaze), contralateral hemiparesis, hemianopia, and extinction or neglect are cortical findings, not a lacunar pattern.',
   'Score ASPECTS carefully but not fatalistically. Low ASPECTS predicts worse absolute prognosis, but it does not prove futility.',
   'A large core on CTP does not necessarily exclude someone from thrombectomy. Discuss with neuro-IR and your attending/fellow.',
   'Pooled lesson: a meta-analysis of six randomized large-core trials found better 90-day mRS (generalized OR 1.6) and more independent ambulation (RR 1.9), with higher symptomatic ICH (RR 1.7).',
   'The 2026 AHA/ASA guideline gives a Class 1 recommendation for selected proximal ICA/M1 occlusions 6 to 24 hours from onset with age under 80, NIHSS at least 6, prestroke mRS 0 to 1, ASPECTS 3 to 5, and no significant mass effect. It also makes EVT reasonable in selected ASPECTS 0 to 2 patients within 6 hours.'
 ],
 citations:['SELECT2 trial', 'LASTE trial', 'Large-core RCT meta-analysis', '2026 AHA/ASA AIS Guideline'],
 trap:'Excluding from MT based on outdated ASPECTS logic.'
},

{id:'c5', n:5,
 arrival:'58 year old man. About two hours ago he became suddenly sleepy at home. His family noticed his left eye is sitting down and out, the left pupil is big, and his eyelid is drooping. The right arm and leg are weak. His speech is slurred.',
 activation:'Somnolence, ocular findings, and right-sided weakness',
 context:'58-year-old man with abrupt symptoms at home approximately two hours before arrival.',
 presentation:'He becomes suddenly sleepy. The left eyelid droops, the left pupil appears enlarged, the left eye rests down and out, the right arm and leg are weak, and speech is slurred.',
 unknowns:['lkw','baseline','seizure','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'posterior_brainstem',
 r:{
  glucose:'Glucose 112.',
  bp:'BP 150/85.',
  nihss:'NIHSS 12. Decreased LOC (1a 2, 1b 2, 1c 2), left CN III findings (pupil dilated, ptosis, eye down and out), right arm and leg paresis (arm 2, leg 2), dysarthria 2. No aphasia, no neglect.',
  ncct:'CT head: no hemorrhage. Hyperdense basilar sign suggested.',
  cta:'CTA: basilar tip occlusion.',
  ctp:'CTP: limited utility for posterior circulation but reviewed.',
  mri:'Not pursued. CTA diagnostic.',
  collateral:'Wife says last seen well 1.5 hours ago. mRS 0, no seizure history, no known DOAC or warfarin use.',
  ems_timeline:'EMS scene call 1 hour ago.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior strokes.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','collateral'],
 syndromeStory:'He became suddenly sleepy. The left pupil is blown, the eyelid droops, and the eye sits down and out. The right arm and leg are weak. That bedside pattern is an ipsilateral oculomotor (CN III) palsy plus contralateral hemiparesis, which localizes to the left midbrain. The classic name is Weber syndrome. CTA confirmed a basilar tip occlusion, the vascular emergency that explains the syndrome. Within 4.5 hours of onset, this is a reperfusion candidate: IV tenecteplase plus paging IR to discuss MT. Basilar thrombectomy is Class 1 within 24 hours when NIHSS is at least 10.',
 teach:[
   'Perform a cranial nerve exam immediately in suspected posterior-circulation stroke. The NIHSS does not adequately capture brainstem signs, and CN findings are often the localization clue that changes management.',
   'Recognize crossed brainstem findings: ipsilateral CN III palsy with contralateral hemiparesis localizes to the midbrain and should trigger urgent posterior-circulation vascular imaging.',
   'A brainstem localization can still represent a basilar thrombectomy lesion.',
   'Use the basilar EVT trial numbers. In ATTENTION, mRS 0 to 3 at 90 days occurred in 46% vs 23% with EVT vs medical therapy, and mortality was 37% vs 55%. In BAOCHE, mRS 0 to 3 was 46% vs 24% in the 6 to 24 hour window.',
   'The 2026 AHA/ASA guideline gives a strong recommendation for EVT within 24 hours for basilar artery occlusion when baseline mRS is 0 to 1, NIHSS is at least 10, and pc-ASPECTS is at least 6.'
 ],
 citations:['ATTENTION trial', 'BAOCHE trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Calling it "just a brainstem stroke" and missing that it could be a thrombectomy lesion. NIHSS undercounts posterior strokes.'
},

{id:'c6', n:6,
 arrival:'62 year old man, brought in 90 minutes after sudden severe spinning. He cannot sit upright, he is vomiting, and his speech is slurred. There is no obvious weakness on one side.',
 activation:'Acute vertigo with inability to sit unsupported',
 context:'62-year-old man with sudden, continuous vestibular symptoms beginning about 90 minutes before arrival.',
 presentation:'He has severe continuous spinning, repeated vomiting, slurred speech, and cannot sit upright without support. There is no obvious unilateral limb weakness.',
 unknowns:['lkw','baseline','seizure','glucose','bp','nihss','ncct','cta','ctp','mri'],
 syndrome:'cerebellar_vestibular',
 r:{
  glucose:'Glucose 95.',
  bp:'BP 158/88.',
  nihss:'NIHSS 4, driven by dysarthria and limb ataxia; no clear hemiparesis. The score does not capture his inability to sit unsupported.',
  focused_exam:'While he remains continuously symptomatic, spontaneous horizontal nystagmus beats to the left in primary gaze and remains left-beating on gaze right and left, with greater amplitude looking left. Alternate cover testing shows no vertical refixation. A rapid head impulse to the right produces a corrective saccade; impulse to the left does not. He remains unable to sit unsupported and speech remains slurred.',
  ncct:'CT head: no hemorrhage. Posterior fossa imaging often degraded by artifact.',
  cta:'CTA: distal basilar narrowing with thrombus.',
  ctp:'CTP: limited posterior coverage.',
  mri:'MRI DWI: acute posterior circulation infarcts (cerebellar plus pontine).',
  collateral:'Wife reports last seen well 2 hours ago. mRS 0, no seizure history, no known DOAC or warfarin use.',
  ems_timeline:'EMS arrival 90 minutes after symptom onset.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior strokes.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','mri','collateral'],
 syndromeStory:'Sudden severe spinning, vomiting, slurred speech, and inability to sit up. The bedside eye findings are not a classic central HINTS pattern, but the severe truncal instability and dysarthria remain discordant with a simple peripheral explanation. NIHSS is misleadingly low at 4. The bedside pattern is a cerebellar/vestibular posterior circulation syndrome, and CTA confirmed a distal basilar thrombus. MRI showed acute infarcts in cerebellum and pons. We treat the syndrome, not the score. Within 4.5 hours, the disabling posterior-circulation syndrome remains an IV TNK question. The distal basilar thrombus warrants an urgent neuro-IR discussion, but his NIHSS of 4 does not meet the strong 2026 guideline criterion for basilar EVT; the thrombectomy evidence at this severity is uncertain.',
 teach:[
   'Take the acute vestibular syndrome seriously. Do not call this peripheral vertigo until you have actively tried to prove it is peripheral.',
   'Interpret the individual bedside findings rather than accepting a label such as “HINTS positive” or “HINTS negative.” The examination only has meaning in the correct acute vestibular syndrome context.',
   'Here, the nystagmus remains left-beating in both gaze directions, there is no skew, and the rightward head impulse produces a corrective saccade. Those findings decrease the probability of a central vestibular lesion, but they must be reconciled with the rest of the syndrome rather than treated as an absolute rule-out.',
   'Cranial nerve and oculomotor findings are not fully represented in the NIHSS.',
   'Pair syndrome recognition with vessel imaging. Sudden inability to sit upright, vomiting, dysarthria, severe truncal ataxia, and dangerous HINTS findings justify a low CTA threshold for posterior circulation stroke.',
   'Use posterior EVT data to reinforce why this matters: in ATTENTION and BAOCHE, favorable outcome rates were about 46% vs 24% with EVT vs medical therapy in basilar occlusion.',
   'For basilar occlusion with NIHSS 6 to 9, the 2026 guideline states that EVT effectiveness is not well established. With still milder deficits, the evidence is even less certain, so vessel anatomy and clinical severity should trigger an individualized neuro-IR discussion rather than an automatic EVT assumption.'
 ],
 citations:['ATTENTION trial', 'BAOCHE trial', '2026 AHA/ASA AIS Guideline'],
 trap:'Sending the patient down the vertigo or inner ear pathway because NIHSS is low.'
},

{id:'c7', n:7,
 arrival:'43 year old right-handed dentist. About 90 minutes ago, after a meeting, he noticed his right hand stopped working. He cannot make a fist or tap his fingers. The face and leg look fine.',
 activation:'Isolated right-hand weakness',
 context:'43-year-old right-handed dentist, independent at baseline, with abrupt onset about 90 minutes before evaluation.',
 presentation:'After a meeting he notices that the right hand no longer works normally: he cannot make a fist or rapidly tap his fingers. Face, speech, and leg function appear preserved.',
 unknowns:['baseline','seizure','collateral','glucose','bp','ncct','cta','ctp','mri'],
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
  baseline:'mRS 0. Active dentist.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No prior records.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','mri','collateral'],
 syndromeStory:'He cannot make a fist or tap his fingers with the dominant hand, but the face and leg look fine. The MRI showed a small infarct in the hand area of the left motor cortex (the hand knob). NIHSS is 1. Ask him directly: "Do you consider this deficit disabling to you?" He says yes. Patient self-assessment of disability is what drives the decision in mild stroke, more than the NIHSS number or even the occupation alone. Current guidance supports IV tenecteplase for any disabling deficit regardless of NIHSS. DAPT (clopidogrel plus aspirin for 21 days, then aspirin alone, based on CHANCE and POINT) is reserved for nondisabling minor stroke (NIHSS 0 to 5) when reperfusion is not chosen, supported by PRISMS data.',
 teach:[
   'Recognize that isolated hand weakness can be cortical stroke, especially when fine finger movements fail disproportionately.',
   'Ask the patient directly whether the deficit is disabling to them to further decide on treatment.',
   'Separate minor disabling from minor nondisabling stroke; that distinction changes treatment more than the raw NIHSS number.',
   'The 2026 guideline separates disability from NIHSS: eligible patients with disabling deficits should receive rapid IV thrombolysis regardless of NIHSS, while IV thrombolysis is not recommended for mild nondisabling deficits within 4.5 hours; DAPT is preferred in the appropriate noncardioembolic minor-stroke population.',
   'For minor noncardioembolic AIS with NIHSS at most 3 or high-risk TIA, the 2026 guideline recommends early aspirin plus clopidogrel for 21 days when IV thrombolysis was not given. Selected NIHSS 4 to 5 atherosclerotic events also have an expanded DAPT pathway.',
   'Do not let the NIHSS decide whether a deficit is disabling. The treatment question is whether the new deficit meaningfully prevents the patient from performing normal activities or work; then apply the thrombolysis criteria and local stroke protocol.'
 ],
 citations:['ARAMIS trial', 'AHA DAPT evidence review', 'INSPIRES trial', 'TEMPO-2 trial'],
 trap:'Calling it minor stroke and not treating because NIHSS is 1.'
},

{id:'c8', n:8,
 arrival:'72 year old man. About 2 hours ago he suddenly stopped speaking, his eyes pulled to the left, and his right arm and leg stopped moving. EMS keeps getting blood pressures around 212/118.',
 activation:'Acute aphasia and right hemiparesis with severe hypertension',
 context:'72-year-old man with markedly elevated blood pressure recorded repeatedly by EMS.',
 presentation:'About two hours earlier he suddenly stopped speaking, developed leftward gaze deviation, and stopped moving the right arm and leg.',
 unknowns:['baseline','seizure','collateral','glucose','nihss','ncct','cta','ctp','mri'],
 syndrome:'dominant_mca',
 r:{
  glucose:'Glucose 132.',
  bp:'BP 212/118 confirmed on bedside repeat. Two cycles of labetalol underway.',
  nihss:'NIHSS 18. LOC 1, gaze 2, hemianopia 2, right facial 2, right arm 4, right leg 4, language 3.',
  ncct:'CT head: no hemorrhage. ASPECTS 9 (subtle insular involvement only).',
  cta:'CTA: left M1 occlusion.',
  ctp:'CTP: mismatch.',
  mri:'Not needed.',
  collateral:'Wife: last seen well 2 hours ago. mRS 0. Hypertension poorly controlled. No known DOAC or warfarin use.',
  ems_timeline:'EMS scene call 90 minutes ago.',
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No relevant prior records.',
 },
 pathway:'reperfusion',
 ideal:['glucose','bp','nihss','ncct','cta','collateral'],
 syndromeStory:'Concordant left dominant hemispheric cortical syndrome with a concordant left M1 occlusion on CTA. The catch is BP 212/118. The job is to lower BP just enough to be eligible for reperfusion (under 185/110), not to normalize it. Aggressive BP lowering before reperfusion can reduce collateral perfusion and worsen outcome. After successful EVT, the standard ceiling stays at or under 180/105, and pushing SBP below 140 is harmful (Class III).',
 teach:[
   'Before TNK, BP must be below 185/110. After IV thrombolysis, maintain BP below 180/105 for at least 24 hours; after EVT, a ceiling at or below 180/105 is reasonable.',
   'Do not try to normalize BP before reperfusion. Excessive early reduction can compromise collateral flow.',
   'The 2026 guideline specifically advises against intensive SBP lowering below 140 after IV thrombolysis and warns that intensive lowering after EVT may be harmful, even after complete reperfusion.',
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
 unknowns:['baseline','seizure','collateral','glucose','nihss','cta','ctp','mri'],
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
  baseline:'mRS 0.',
  seizure_hx:'No history.',
  eeg:'Not indicated.',
  osh:'No relevant prior records.',
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
 unknowns:['baseline','collateral','glucose','bp','nihss','ncct','cta','mri','seizure'],
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
  meds:'Lamotrigine. Hypertension, diabetes.',
  baseline:'mRS 1.',
  seizure_hx:'Known epilepsy, recently subtherapeutic.',
  eeg:'Rapid EEG: no ongoing ictal activity, postictal slowing only.',
  osh:'No recent strokes documented.',
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
,

{id:'c11', n:11,
 arrival:'56-year-old man in the ICU after massive hemoptysis requiring bronchial artery embolization, intubation, shock, and neuromuscular blockade. After paralytics are stopped and he begins to awaken, he follows commands with both arms but does not move either leg.',
 activation:'New bilateral lower-extremity weakness after critical illness',
 context:'History of pulmonary sarcoidosis and a presumed right upper-lobe aspergilloma. Recent shock/hypotension and severe respiratory illness. Several weeks before admission he had burning/numb feet, gait difficulty, and a prior evaluation for bilateral leg weakness.',
 presentation:'Once neuromuscular blockade has cleared, he reliably follows commands with both upper extremities but initially has no voluntary movement of either leg. The team has already identified small acute multifocal cerebral infarcts on MRI brain and an abnormal thoracic cord signal whose age is uncertain.',
 unknowns:['baseline','collateral','nihss','mri'],
 syndrome:'paraparesis_mixed',
 managementOptions:['spinal_eval','mimic_unclear'],
 r:{
  collateral:'Family reports progressive burning pain and numbness in both feet with worsening gait for several weeks before this admission. He was still ambulatory before the acute respiratory illness, though less steadily than usual.',
  meds:'Neuromuscular blockade was discontinued several hours ago. Sedation has been lightened. No ongoing paralytic exposure.',
  baseline:'Before this hospitalization he walked independently but had recently become slower and less steady because of distal sensory symptoms.',
  focused_exam:'Awake enough to follow commands. Cranial nerves are grossly symmetric. Upper extremity strength is antigravity and symmetric. Lower extremities show only trace proximal movement and no reliable distal movement. Tone is difficult to interpret because the legs remain markedly tense/guarded. Knee reflexes are reduced; ankle reflexes are absent. Plantar responses are mute. Pinprick is reduced distally in both feet without a clear thoracic sensory level. Saddle sensation is not clearly abnormal. Rectal tone has not yet been assessed.',
  nihss:'NIHSS is difficult to interpret because bilateral leg weakness accounts for much of the score. There is no aphasia, neglect, gaze deviation, or convincing cortical sensory deficit.',
  ncct:'Head CT shows no hemorrhage.',
  cta:'CTA head/neck shows no proximal large-vessel occlusion.',
  mri:'MRI brain shows several small acute infarcts in more than one vascular territory. None are grossly in a bilateral ACA distribution and the lesion burden does not convincingly explain the profound symmetric leg weakness.',
  mri_tspine:'MRI thoracic spine shows a focal intramedullary T2 signal abnormality. There is no major compressive lesion. The appearance is not specific enough to establish whether this is acute, chronic, inflammatory, or vascular, and the examination does not cleanly map to that level.',
  mri_lspine:'MRI lumbar spine/conus shows no large compressive cauda equina lesion. Degenerative changes are present but do not provide a single structural explanation for the severity of weakness.',
  labs:'CK is not markedly elevated. Electrolyte abnormalities do not explain the degree of weakness. Systemic inflammatory and infectious data remain abnormal in the setting of severe critical illness.',
  emg:'EMG/NCS can test the peripheral branch of the localization: polyneuropathy, polyradiculopathy, focal root/plexus disease, myopathy, or a mixed process. It can distinguish axonal from demyelinating physiology and may show whether the pre-hospital distal symptoms represent a meaningful concurrent peripheral process. In very acute weakness, some abnormalities may not yet be fully expressed, so a nondiagnostic early study would not by itself close the peripheral hypothesis.',
  lp:'CSF would address etiology more than anatomic localization. Cell count, protein, glucose, IgG index/oligoclonal bands, and targeted infectious studies could support or weaken inflammatory or infectious myelopathy/myeloradiculitis. A bland CSF would not prove a vascular process, and an inflammatory CSF would still need to be reconciled with the tempo, MRI pattern, and examination.',
  eeg:'No episodic altered awareness or motor activity suggests an ictal explanation for the isolated leg weakness.'
 },
 pathway:'spinal_eval',
 ideal:['focused_exam','mri','mri_tspine','mri_lspine','collateral','labs'],
 syndromeStory:'This case does not resolve into one clean lesion. The acute cerebral infarcts are real but do not anatomically account for the profound bilateral leg weakness. The thoracic cord abnormality is also real, but its age and causal relevance are uncertain, and the examination contains lower-motor-neuron/peripheral features without a convincing thoracic sensory level. The useful reasoning move is to keep the localization open across spinal cord, conus/roots, and peripheral nervous system while using the history and serial examination to decide which tests actually discriminate among them.',
 competing:[
  {label:'Cerebral ischemia', text:'The multifocal acute infarcts establish a vascular process, but their distribution and lesion burden do not adequately explain the symmetric bilateral leg syndrome.'},
  {label:'Spinal cord / conus process', text:'Recent hypotension, pulmonary sarcoidosis, and an intramedullary thoracic signal abnormality make vascular or inflammatory myelopathy plausible. The mismatch between the imaging level and bedside pattern prevents premature closure.'},
  {label:'Peripheral process', text:'Weeks of distal neuropathic symptoms, reduced reflexes, and absent ankle jerks support a peripheral contribution. Critical illness may worsen pre-existing peripheral dysfunction, but that explanation should still fit the trajectory and examination.'},
  {label:'Infectious / inflammatory process', text:'The pulmonary and systemic context keeps inflammatory or infectious mechanisms in the etiologic differential, but context alone does not establish localization.'}
 ],
 whatChanged:'The most important updates are not a single positive test but the mismatches: the brain lesions do not explain the syndrome, the thoracic lesion does not perfectly fit the examination, and the pre-hospital neuropathic history shifts probability toward a pre-existing or concurrent peripheral process.',
 uncertainty:'A single final diagnosis may not be justified during the initial consultation. The immediate goal is to define the neural level or levels involved, exclude a compressive emergency, and decide whether subsequent testing should pursue vascular, inflammatory/infectious, or peripheral mechanisms.',
 teach:[
   'Start with the time course: an acute deterioration can occur on top of a subacute neurologic process, and both time scales may matter.',
   'Localize before assigning causality to MRI abnormalities. A lesion can be real and still be incompletely explanatory.',
   'In acute severe myelopathy, reflexes may initially be reduced, so a lower-motor-neuron-appearing examination does not by itself exclude spinal cord disease.',
   'When the examination and available imaging conflict, targeted imaging of the remaining plausible neural levels and serial examination are more useful than forcing an early label.',
   'Use EMG/NCS when the unresolved question is peripheral localization or physiology: it can characterize neuropathic, radicular, plexus, or myopathic involvement, but timing matters and an early nondiagnostic study does not erase a clinically plausible peripheral process.',
   'Use LP when the unresolved question is mechanism rather than level: CSF can support inflammatory or infectious disease, but it must be interpreted with the tempo, examination, and MRI rather than treated as a stand-alone answer.'
 ],
 citations:['WFNS Spine Committee recommendations on cauda equina/conus syndromes (2024)','Tan & Manohararaj, isolated conus medullaris infarction (2021)'],
 trap:'Prematurely deciding that whichever abnormal MRI was found first must explain the weakness.'
},

{id:'c12', n:12,
 arrival:'79-year-old woman develops intermittent confusion on hospital day 4. Nursing reports that she was sleepy and inattentive this morning, more conversant around noon, and confused again later in the afternoon. A stroke code is activated because the change seems abrupt.',
 activation:'Fluctuating confusion and decreased responsiveness',
 context:'Older hospitalized adult with substantial cerebrovascular disease and chronic small-vessel ischemic change, prolonged hospitalization for systemic illness, poor sleep, pain, reduced mobility, renal dysfunction, anemia, and several medication changes. Family says she was cognitively independent before admission but becomes confused easily when ill.',
 presentation:'Her mental status has waxed and waned over hours. At the time of neurology evaluation she is awake and conversational but easily loses the thread of conversation. No persistent unilateral weakness, gaze deviation, aphasia, or visual field deficit has been reported.',
 unknowns:['baseline','collateral','glucose','bp','nihss','ncct','mri'],
 syndrome:'acute_confusional',
 managementOptions:['delirium_eval','mimic_unclear'],
 r:{
  glucose:'Glucose is normal.',
  bp:'Blood pressure is elevated but similar to recent inpatient values; there is no abrupt hypertensive surge associated with the episodes.',
  collateral:'Family confirms an acute change from her pre-hospital baseline and describes fluctuation throughout the day rather than a fixed deficit. She slept poorly overnight and has had limited oral intake.',
  meds:'Medication review shows recent exposure to several centrally acting agents used for pain, sleep, and nausea. No single medication clearly explains the entire syndrome, but cumulative medication burden is relevant.',
  baseline:'Before admission she managed her own basic activities and conversations normally. Family reports no established dementia diagnosis.',
  attention_exam:'She is awake and oriented to name and hospital. She cannot sustain months of the year backward, becomes distractible during multi-step commands, and gives inconsistent answers when the task is repeated several minutes later. Arousal varies subtly during the encounter.',
  focused_exam:'Cranial nerves are symmetric. Speech is fluent without aphasia. No gaze preference or visual field deficit is identified. Strength is symmetric within the limits of pain and deconditioning. Sensation is symmetric. There is no new focal neurologic deficit.',
  nihss:'No reproducible focal NIHSS deficit is identified. Errors are driven by attention and participation rather than a stable focal syndrome.',
  ncct:'CT head shows no acute hemorrhage or large territorial infarct; chronic atrophy and small-vessel ischemic changes are present.',
  mri:'MRI is not immediately obtained because the examination remains nonfocal and the mental status improves with treatment of systemic contributors. It would become more useful if a persistent focal syndrome emerged or the course stopped fitting delirium.',
  labs:'The chart shows several plausible precipitants: renal dysfunction, anemia, poor intake/dehydration, ongoing systemic illness, and sleep disruption. There is no single laboratory abnormality that fully explains the presentation.',
  eeg:'Rapid EEG is not initially obtained because there are no stereotyped spells, abnormal movements, or persistent unexplained depressed awareness. It would move up the workup if impaired awareness became sustained or episodic in a way not explained by the systemic course.'
 },
 pathway:'delirium_eval',
 ideal:['collateral','attention_exam','focused_exam','meds','labs'],
 syndromeStory:'The defining pattern is an acute, fluctuating disturbance of attention and cognition in a vulnerable hospitalized patient without a stable focal neurologic syndrome. The systemic context is not background noise; it meaningfully raises the prior probability of delirium. The neurologic task is to verify the phenotype, look for findings that would require a different localization, and avoid ordering increasingly broad neurologic tests simply because the initial consult was labeled as a possible stroke.',
 competing:[
  {label:'Multifactorial delirium', text:'Acute fluctuation, inattention, variable arousal, systemic illness, sleep disruption, renal dysfunction, anemia, poor intake, and medication burden all support this syndrome.'},
  {label:'Acute stroke', text:'Cerebrovascular disease raises baseline risk, but repeated examinations do not identify a stable focal cortical or subcortical syndrome.'},
  {label:'Nonconvulsive seizure', text:'It remains a consideration in unexplained altered awareness, but the current fluctuation and examination do not provide a strong ictal signal. The threshold for EEG should change if the trajectory changes.'}
 ],
 whatChanged:'Collateral establishing fluctuation, direct testing of attention, and repeated nonfocal examinations strengthen a diffuse delirium model. No single result proves delirium; the coherence of the time course, phenotype, and context does the work.',
 uncertainty:'Delirium does not eliminate the possibility of a concurrent neurologic disorder. New focal findings, persistent unexplained depressed consciousness, stereotyped episodes, or failure to improve with correction of precipitants should reopen the differential.',
 teach:[
   'Delirium is an acute disorder of attention and cognition that typically fluctuates; attention testing and collateral about baseline and trajectory are central to recognizing it.',
   'Context changes prior probability. In a vulnerable hospitalized older adult, several modest physiologic and environmental stressors may together be sufficient to produce delirium.',
   'A nonfocal examination repeated over time supports diffuse cerebral dysfunction, but the model should be reopened if a stable focal syndrome or unexplained trajectory emerges.',
   'Good reasoning is not synonymous with more testing. Additional imaging or EEG should answer a clinical question created by the phenotype or trajectory.'
 ],
 citations:['Oh et al., JAMA review of delirium in older persons (2017)','Inouye et al., delirium in elderly people (Lancet 2013)','Ahmed et al., delirium risk factors meta-analysis (Age and Ageing 2014)'],
 trap:'Assuming that every acute change in a patient with vascular disease requires a hidden focal lesion—or, conversely, declaring delirium without first establishing an acute fluctuating attentional syndrome and checking for focal findings.'
}
,
{id:'c13', n:13,
 arrival:'62-year-old woman presents with several days of worsening fatigue and intermittent slurred speech. Her family says she sounds normal in the morning but becomes harder to understand after long conversations and near the end of meals.',
 activation:'Progressive fatigue and intermittent dysarthria',
 context:'Previously independent adult without a known neuromuscular diagnosis. No recent stroke history. Family has noticed that speech and chewing seem worse later in the day, but the patient mainly describes the problem as "fatigue."',
 presentation:'She reports generalized tiredness and intermittent slurred speech. Brief strength testing is initially close to normal. There is no numbness, hemisensory complaint, fixed diplopia, or persistent unilateral weakness.',
 unknowns:['baseline','collateral','nihss','mri'],
 syndrome:'fatigable_bulbar',
 managementOptions:['nmj_eval','mimic_unclear'],
 r:{
  collateral:'Her spouse reports that her voice becomes quieter and more nasal after prolonged talking. She sometimes pauses halfway through dinner because chewing feels harder, then improves after resting. The pattern has been reproducible over several days rather than steadily progressive hour by hour.',
  baseline:'She was fully independent and had no baseline speech, swallowing, or mobility limitation.',
  meds:'No recent sedative escalation or new dopamine-blocking medication. Medication review does not provide a clear toxic explanation for the fluctuating bulbar symptoms.',
  focused_exam:'Mental status and language are normal. Sensation is intact. Reflexes are preserved. There is no limb ataxia. On brief testing, limb strength is near full. Facial activation is mildly weak but symmetric. Speech is mildly dysarthric without aphasia.',
  fatigability_exam:'After sustained upgaze, mild bilateral ptosis becomes more apparent. Repeated eyelid closure and prolonged smiling reveal increasing facial weakness. During continuous counting, speech becomes progressively more nasal and imprecise, then partially improves after a short rest. Repeated shoulder abduction produces mild proximal fatigability.',
  respiratory_bulbar_exam:'She can manage secretions and remains able to speak in full sentences, but chewing and speech fatigue are objective. Bedside respiratory assessment does not show overt respiratory failure. Because bulbar weakness can evolve, respiratory and swallowing function require serial reassessment rather than a one-time reassuring examination.',
  nihss:'There is no coherent focal NIHSS syndrome. Dysarthria is present, but language, visual fields, gaze, sensation, and limb strength are otherwise nonfocal on brief testing.',
  mri:'Brain MRI shows no acute infarct or brainstem lesion that explains the fluctuating bulbar pattern.',
  labs:'Routine metabolic studies do not explain the symptoms; CK is not markedly elevated.',
  achr_musk:'Serologic testing supports autoimmune myasthenia gravis. Antibody status helps confirm and phenotype the disease, but the fluctuating fatigable examination remains central to the diagnosis and severity assessment.',
  rns:'Repetitive nerve stimulation demonstrates a reproducible decrement consistent with impaired neuromuscular transmission. The study supports a postsynaptic neuromuscular-junction disorder when interpreted with the clinical pattern.',
  eeg:'There is no episodic impaired awareness or stereotyped cortical event to make EEG a useful first test.'
 },
 pathway:'nmj_eval',
 ideal:['collateral','focused_exam','fatigability_exam','respiratory_bulbar_exam','achr_musk','rns'],
 syndromeStory:'The initial complaint of "fatigue" and intermittent dysarthria is nonspecific. What changes the localization is demonstrating objective, activity-dependent weakness: ptosis appears with sustained upgaze, facial and bulbar function worsen with repetition, and speech deteriorates during prolonged counting before improving after rest. Normal sensation and preserved reflexes further support a neuromuscular-junction localization. Serology and repetitive nerve stimulation then confirm the physiologic model rather than creating it.',
 competing:[
  {label:'Neuromuscular-junction disorder', text:'Fluctuation, reproducible fatigability, ocular/facial/bulbar involvement, preserved sensation, and supportive electrophysiology make this the best current localization.'},
  {label:'Brainstem or cortical lesion', text:'Dysarthria can be central, but there is no fixed crossed, long-tract, language, sensory, or imaging correlate, and the deficit worsens with sustained activation rather than remaining fixed.'},
  {label:'Generalized fatigue / systemic illness', text:'Subjective fatigue is common and nonspecific, but it does not explain the reproducible activity-dependent focal motor deterioration seen on examination.'}
 ],
 whatChanged:'The decisive information is not the word "fatigue"; it is the conversion of a vague complaint into objective fatigable weakness during a deliberately provocative examination. Serology and RNS then test the neuromuscular-junction hypothesis.',
 uncertainty:'The diagnosis may be supported before every confirmatory test returns, but the immediate clinical uncertainty is severity: bulbar symptoms require repeated assessment for swallowing and respiratory deterioration even when the first respiratory examination is reassuring.',
 teach:[
   'Separate generalized fatigue from neuromuscular fatigability. In MG, sustained or repeated activation can reveal weakness that is absent on a brief one-time strength examination.',
   'Dysarthria is a symptom, not a localization. Language, cranial nerves, sensory findings, reflexes, fluctuation, and provocative testing determine whether the syndrome is central, neuromuscular, or systemic.',
   'The bedside examination should create a testable hypothesis before antibody testing or electrophysiology is ordered.',
   'AChR/MuSK serology and electrodiagnostic testing can confirm MG, but a negative single test does not substitute for reassessing a convincing clinical phenotype.',
   'Bulbar weakness changes urgency because swallowing and respiratory function can worsen even when limb strength and a single respiratory assessment look relatively preserved.'
 ],
 citations:['Juel, Autoimmune Myasthenia Gravis, Continuum (2025)','Guidon et al., Myasthenia Gravis Core Exam (2021)','International consensus guidance for management of myasthenia gravis','Tankisi et al., electrodiagnostic criteria for neuromuscular transmission disorders (2025)'],
 trap:'Treating "fatigue" as either diagnostic of myasthenia or too nonspecific to matter. The useful step is to test whether the patient has objective fatigable weakness and then localize the motor syndrome.'
},

{id:'c14', n:14,
 arrival:'65-year-old man with metastatic lung cancer and multiple known brain metastases becomes progressively less interactive over several hours. Imaging already shows extensive vasogenic edema around several supratentorial lesions. No generalized convulsion has been witnessed.',
 activation:'Increasing confusion and reduced responsiveness in a patient with brain metastases',
 context:'Hospitalized patient with multiple supratentorial brain metastases and substantial surrounding vasogenic edema. He has received several medications that could affect alertness and has significant structural cerebral disease. Nursing has noticed brief periods of staring and inconsistent command following.',
 presentation:'Over several hours he becomes less conversational, intermittently mute, and variably follows commands. There is no sustained generalized convulsion. The examination seems to fluctuate more than expected from a fixed structural deficit.',
 unknowns:['baseline','collateral','glucose','bp','nihss','ncct','mri'],
 syndrome:'structural_fluctuating_ams',
 managementOptions:['ncse_eval','delirium_eval','mimic_unclear'],
 r:{
  glucose:'Glucose is normal.',
  bp:'Blood pressure is not sufficiently abnormal to explain the change in awareness.',
  collateral:'Family and nursing confirm that he was conversant earlier in the day. Since then he has alternated between following commands and staring without responding. No prolonged tonic-clonic event has been seen.',
  meds:'Medication review identifies sedating exposures that could contribute to reduced arousal, but the episodic staring and abrupt within-hour fluctuations are not fully explained by the medication timeline.',
  baseline:'Before this deterioration he was conversational and followed commands despite known metastatic disease.',
  attention_exam:'Arousal fluctuates. At times he tracks and follows a one-step command; minutes later he stares and fails to respond despite appearing awake. The pattern is not simply sustained somnolence.',
  focused_exam:'There is no new dense hemiplegia. During one episode he becomes briefly mute with subtle right facial twitching and a leftward gaze tendency, then partially recovers. These findings are transient and easy to miss.',
  nihss:'The score fluctuates because language and command-following vary over minutes. There is no stable new hemispheric syndrome that explains the entire course.',
  ncct:'Repeat CT shows the known metastatic lesions and extensive surrounding vasogenic edema without a new large hemorrhage or major new mass-effect change that clearly accounts for the abrupt fluctuations.',
  mri:'MRI confirms multiple supratentorial metastases with substantial vasogenic edema. There is no new large territorial infarct. The structural disease is clinically important but does not by itself explain why awareness and language fluctuate so abruptly over minutes.',
  labs:'Routine metabolic evaluation shows no single severe derangement that accounts for the episodic pattern.',
  eeg:'A short EEG captures frequent lateralized epileptiform discharges and brief focal electrographic seizures arising from cortex near the dominant metastatic burden. Because the abnormality is intermittent and the clinical state continues to fluctuate, a short recording does not fully define seizure burden.',
  ceeg:'Continuous EEG shows recurrent focal electrographic seizures with little or no consistent motor correlate, accumulating into nonconvulsive status epilepticus. Clinical responsiveness improves as the electrographic seizure burden is controlled, while the underlying edema and tumor burden remain important concurrent contributors.'
 },
 pathway:'ncse_eval',
 ideal:['collateral','attention_exam','focused_exam','mri','eeg','ceeg'],
 syndromeStory:'The patient has an obvious structural explanation for neurologic dysfunction—multiple metastases with extensive vasogenic edema—but the abrupt within-hour fluctuation, transient mutism, staring, and subtle focal motor/ocular signs are not fully explained by a fixed edema burden. EEG tests the missing physiologic question. A short study reveals an ictal signal, and continuous EEG demonstrates recurrent largely subclinical focal seizures meeting criteria for nonconvulsive status. The final model is not "edema versus seizure"; structural disease and edema provide both direct dysfunction and an epileptogenic substrate.',
 competing:[
  {label:'Nonconvulsive seizures / status', text:'Fluctuating awareness, transient focal features, epileptiform activity, and recurrent electrographic seizures support an ongoing ictal contribution.'},
  {label:'Vasogenic edema / tumor-related cerebral dysfunction', text:'The metastatic burden and edema remain clinically important and may directly impair cognition while also increasing cortical irritability. They are not displaced from the model by the EEG result.'},
  {label:'Medication or toxic-metabolic encephalopathy', text:'These can contribute to reduced arousal, but they fit the abrupt stereotyped fluctuations and focal ictal findings less well.'}
 ],
 whatChanged:'The key update is recognizing that a striking MRI abnormality may be a substrate rather than a complete explanation. The clinical fluctuation creates an ictal question; EEG answers it, and continuous monitoring defines the burden and response over time.',
 uncertainty:'Even after NCSE is established, improvement may be incomplete because edema, tumor progression, medication effects, and systemic illness can coexist. The neurologic model should remain multifactorial rather than expecting seizure treatment to normalize the entire examination.',
 teach:[
   'In patients with structural brain disease, do not ask only whether imaging is abnormal; ask whether the abnormality adequately explains the phenotype and its time course.',
   'Nonconvulsive status often presents as altered mental status without sustained convulsive activity. Subtle gaze, facial, language, or behavioral fluctuations may be the only clinical clues.',
   'A routine EEG can reveal an ictal signal, but continuous EEG is more useful when seizure burden is intermittent, treatment response must be followed, or altered awareness persists.',
   'Brain tumors and surrounding edema can be both the cause of cerebral dysfunction and the substrate for seizures. The two mechanisms can coexist.',
   'The diagnostic sequence is phenotype → structural context → targeted EEG question → serial electroclinical reassessment, not "abnormal MRI therefore explained."'
 ],
 citations:['Herman et al., ACNS consensus statement on continuous EEG indications (2015)','Marcuse et al., Nonconvulsive status epilepticus in patients with brain tumors (2014)','ASCO/SNO endorsement of CNS brain metastasis supportive-care guidelines (2019)','Continuum review of status epilepticus / EEG in persistent altered consciousness'],
 trap:'Anchoring on the dramatic vasogenic edema as a complete explanation for altered mental status and failing to ask whether the fluctuation itself implies a superimposed cortical process.'
}


];


// ============================================================
// Universal bedside presentation metadata
// Baseline and the initial neurologic examination are shown before any diagnostic framing.
// Findings are intentionally written as raw observations rather than interpretive labels.
// ============================================================
const CASE_BEDSIDE = {
  c1:{baseline:'Not yet established.',initialExam:{mental:'Awake. No intelligible verbal output. Does not reliably follow spoken commands.',cranial:'Eyes are persistently deviated to the left. Blink to threat is reduced on the right. Right lower facial movement is reduced.',motor:'Left arm and leg move spontaneously against gravity. No purposeful movement is seen in the right arm or right leg.',sensory:'Formal sensory testing is limited by the language deficit.',coordination:'Cannot be meaningfully tested on the weak side.',gait:'Deferred because of the acute deficit.'},strokeTools:['nihss']},
  c2:{baseline:'Not yet established.',initialExam:{mental:'Awake but mute. Does not reliably follow spoken commands.',cranial:'Eyes are deviated to the left. Blink to threat is absent on the right. Right lower facial movement is reduced.',motor:'No purposeful movement is seen in the right arm or right leg; left limbs move against gravity.',sensory:'Formal testing is limited by impaired communication.',gait:'Deferred.'},strokeTools:['nihss']},
  c3:{baseline:'Unknown on arrival.',initialExam:{mental:'Awake but nonverbal. Does not reliably follow spoken commands.',cranial:'Persistent leftward gaze. Reduced blink to threat on the right. Right lower facial movement is reduced.',motor:'Right arm and leg do not move purposefully; left arm and leg move against gravity.',sensory:'Formal testing is limited by impaired communication.',gait:'Deferred.'},strokeTools:['nihss']},
  c4:{baseline:'Not yet established.',initialExam:{mental:'Awake. Answers simple questions but repeatedly fails to attend to people or stimuli on the left.',cranial:'Eyes tend to rest to the right. Blink to threat is reduced on the left. Left lower facial movement is reduced.',motor:'Left arm and leg are weaker than the right.',sensory:'Light touch is detected bilaterally when tested separately, but left-sided stimuli are missed during simultaneous bilateral stimulation.',coordination:'Testing on the left is limited by weakness and inattention.',gait:'Deferred.'},strokeTools:['nihss']},
  c5:{baseline:'Not yet established.',initialExam:{mental:'Somnolent but arouses to voice. Speech is slurred.',cranial:'Left eyelid is ptotic. Left pupil is larger and poorly reactive. Left eye rests down and out. Right facial movement is symmetric.',motor:'Right arm and leg are weaker than the left.',sensory:'Responds to stimulation on both sides.',gait:'Deferred.'},strokeTools:['nihss']},
  c6:{baseline:'Not yet established.',initialExam:{mental:'Alert and conversational. Speech is mildly slurred.',cranial:'Spontaneous horizontal left-beating nystagmus is visible in primary gaze. Facial movement is symmetric.',motor:'No clear unilateral arm or leg weakness.',coordination:'He is unable to sit upright without support. Limb testing is limited by severe nausea and vertigo.',gait:'Unable to stand safely because of severe truncal instability.'},strokeTools:['nihss']},
  c7:{baseline:'Independent; works as a dentist and normally has full use of the dominant right hand.',initialExam:{mental:'Alert, oriented, and fluent.',cranial:'Visual fields, eye movements, and facial movement are symmetric.',motor:'No pronator drift. Proximal arm and leg strength is full. Right finger tapping is markedly slow and irregular; he cannot rapidly open and close the right hand or perform precise finger sequencing.',sensory:'Pinprick and proprioception are symmetric in both hands.',coordination:'Finger-to-nose is accurate bilaterally; fine distal right-hand movements are disproportionately impaired.',gait:'Normal casual gait.'},strokeTools:['nihss']},
  c8:{baseline:'Not yet established.',initialExam:{mental:'Awake but produces no meaningful speech and does not reliably follow spoken commands.',cranial:'Eyes are deviated to the left. Blink to threat is reduced on the right. Right lower facial movement is reduced.',motor:'No purposeful movement is seen in the right arm or leg; left limbs move against gravity.',sensory:'Formal testing is limited by impaired communication.',gait:'Deferred.'},strokeTools:['nihss']},
  c9:{baseline:'Not yet established.',initialExam:{mental:'Awake but uncomfortable and intermittently drowsy after vomiting. Speech is understandable.',cranial:'Pupils are symmetric and reactive. Left lower facial movement is reduced.',motor:'Left arm and leg drift downward and cannot sustain full antigravity effort. Right limbs are stronger.',sensory:'Pinprick is reduced on the left compared with the right.',gait:'Deferred because of acute weakness and severe headache.'},strokeTools:['nihss']},
  c10:{baseline:'Not yet established.',initialExam:{mental:'Sleepy but opens eyes to voice. Answers slowly and is confused about recent events.',cranial:'No persistent gaze deviation. Facial movement is symmetric.',motor:'Mild downward drift of the right arm; legs move symmetrically.',sensory:'Responds to touch on both sides.',coordination:'Testing is slowed by somnolence.',gait:'Deferred.'},strokeTools:['nihss']},
  c11:{baseline:'Before this hospitalization he walked independently, although family had recently noticed slower gait and distal sensory symptoms.',initialExam:{mental:'Awake enough to follow commands with both upper extremities.',cranial:'Face is symmetric. Eye movements are full. Speech cannot be fully assessed while intubated.',motor:'Upper extremities move symmetrically against gravity. Lower extremities show only trace proximal movement and no reliable distal movement. The legs remain markedly tense during examination, making tone difficult to interpret.',sensory:'Pinprick is reduced distally in both feet. No definite truncal sensory level is identified on the first examination.',reflexes:'Knee reflexes are reduced. Ankle reflexes are absent. Plantar responses are mute.',gait:'Not testable.'}},
  c12:{baseline:'Before admission she managed basic activities and normal conversation independently; family reports no established dementia diagnosis.',initialExam:{mental:'Awake and conversational. Oriented to name and hospital. Easily distracted and loses the thread of conversation. Performance on multi-step commands is inconsistent.',cranial:'Visual fields, eye movements, facial sensation, and facial movement are symmetric.',motor:'No pronator drift. Strength is symmetric within the limits of pain and deconditioning.',sensory:'Light touch is symmetric.',coordination:'Finger-to-nose is accurate bilaterally.',gait:'Not tested during the initial bedside assessment.'}},
  c13:{baseline:'Fully independent with normal speech, swallowing, and mobility before this illness.',initialExam:{mental:'Alert, oriented, attentive, and fluent. Language is normal.',cranial:'Pupils are symmetric and reactive. Extraocular movements are full on brief testing. Facial sensation is intact. Facial activation is mildly weak but symmetric. Speech is mildly slurred. Tongue is midline without atrophy.',motor:'Normal bulk and tone. No pronator drift or fasciculations. Limb strength is near full on brief confrontation testing.',sensory:'Pinprick, vibration, and proprioception are intact.',coordination:'Finger-to-nose and finger taps are accurate on brief testing.',reflexes:'Biceps, triceps, brachioradialis, patellar, and ankle reflexes are 2+ and symmetric. Plantar responses are flexor.',gait:'Casual gait is normal.'}},
  c14:{baseline:'Earlier in the day he was conversational and consistently followed commands despite known metastatic disease.',initialExam:{mental:'Opens eyes to voice. At times tracks and follows a one-step command; several minutes later he may stare without responding while remaining awake.',cranial:'Pupils are symmetric and reactive. No persistent gaze deviation is present between episodes. Facial movement is grossly symmetric.',motor:'No new dense unilateral weakness is identified. All four limbs move against gravity when he participates.',sensory:'Withdraws or localizes to stimulation on both sides.',coordination:'Formal testing is limited by fluctuating participation.',gait:'Not tested.'}}
};
CASES.forEach(c=>Object.assign(c,CASE_BEDSIDE[c.id]||{}));

// ============================================================
// Case-specific educational design
// Universal reasoning is constant; the clinical decision varies by case.
// ============================================================
const CASE_DESIGN = {
  c1:{
    clinicalQuestion:'Is this a disabling acute ischemic stroke for which reperfusion should proceed now?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Acute stroke decision',
    actionPurpose:{cta:'Confirm whether a proximal arterial occlusion creates a thrombectomy pathway without delaying otherwise indicated IV thrombolysis.'},
    activeQuestions:{
      cta:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a proximal arterial occlusion that changes the endovascular pathway?',correct:true},
        {label:'Can CTA determine whether the current deficit is disabling?'},
        {label:'Can CTA exclude every important stroke mimic?'}],
        feedback:'CTA is being used to identify the vascular lesion and determine whether EVT should run in parallel. The clinical examination and functional impact establish the syndrome and disability; CTA should not replace them.'}
    }
  },
  c2:{
    clinicalQuestion:'With an unknown onset, what information can establish whether reperfusion still has a biologic target?',
    finalManagementLabel:'Reperfusion decision',
    debriefDecisionTitle:'Unknown-onset stroke: what does imaging add?',
    activeQuestions:{
      ctp:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there salvageable tissue that could make extended-window reperfusion reasonable?',correct:true},
        {label:'What exact clock time did the stroke begin?'},
        {label:'Does the patient definitely have a cortical syndrome?'}],
        feedback:'Perfusion imaging does not recover the missing clock time. It asks a tissue question: whether there is a favorable core/penumbra pattern that could change an extended-window reperfusion decision.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there an imaging mismatch that can help select an unknown-onset stroke for treatment?',correct:true},
        {label:'Can MRI prove the patient was normal at 10 PM?'},
        {label:'Can MRI replace the bedside localization?'}],
        feedback:'DWI/FLAIR mismatch is a treatment-selection concept in appropriately selected unknown-onset stroke. It complements the clinical syndrome; it does not reconstruct the exact onset or replace localization.'}
    }
  },
  c3:{
    clinicalQuestion:'How much uncertainty about timing and identity can remain while still making a safe, evidence-based reperfusion decision?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Acting despite incomplete collateral'
  },
  c4:{
    clinicalQuestion:'Does a large established infarct burden make thrombectomy futile, or is there still a reasonable EVT pathway?',
    finalManagementLabel:'Endovascular treatment decision',
    debriefDecisionTitle:'Large-core thrombectomy reasoning',
    activeQuestions:{ctp:{prompt:'What question are you trying to answer?',options:[
      {label:'How much tissue is already infarcted and how much remains potentially salvageable?',correct:true},
      {label:'Whether the patient has neglect'},
      {label:'Whether the occlusion is in the right or left hemisphere'}],
      feedback:'CT perfusion can refine tissue status, but it should be interpreted alongside NCCT/ASPECTS, the vascular lesion, time, and the patient—not as an automatic futility test.'}}
  },
  c5:{
    clinicalQuestion:'Do the crossed cranial-nerve and long-tract findings indicate a posterior-circulation vascular emergency?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Posterior-circulation reperfusion reasoning'
  },
  c6:{
    clinicalQuestion:'Does the whole acute vestibular syndrome fit a peripheral lesion, or is there enough discordance to pursue a central vascular cause?',
    finalManagementLabel:'Acute management decision',
    debriefDecisionTitle:'Using HINTS within the syndrome, not as a shortcut',
    actionPurpose:{nihss:'Quantify deficits captured by the NIHSS while recognizing that the score underrepresents truncal, gait, and ocular-motor abnormalities.'},
    activeQuestions:{
      focused_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Do the eye movement and balance findings cohere with a peripheral vestibular lesion, or is there discordance suggesting a central process?',correct:true},
        {label:'Can the NIHSS determine whether this is peripheral vertigo?'},
        {label:'Does any corrective saccade exclude posterior circulation stroke?'}],
        feedback:'Interpret the individual ocular motor and postural findings in the context of a continuous acute vestibular syndrome. The goal is not to obtain a HINTS label; it is to decide whether the observed findings cohere with one localization.'},
      nihss:{prompt:'What question are you trying to answer?',options:[
        {label:'Which deficits are captured by the NIHSS, and what important findings does it miss?',correct:true},
        {label:'Can a low NIHSS rule out posterior circulation stroke?'},
        {label:'Can NIHSS distinguish vestibular neuritis from cerebellar stroke by itself?'}],
        feedback:'NIHSS describes some deficits but does not settle an acute vestibular localization. Eye findings, truncal stability, cranial nerves, tempo, and associated symptoms remain essential.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a structural posterior-fossa correlate for the central features that remain unexplained?',correct:true},
        {label:'Can a negative early MRI always rule out posterior circulation stroke?'},
        {label:'Is bedside examination unnecessary whenever MRI is available?'}],
        feedback:'MRI may provide a structural correlate, but bedside findings and imaging should be reconciled rather than treated as competing absolute tests.'}
    }
  },
  c7:{
    clinicalQuestion:'Is a numerically minor deficit functionally disabling for this patient, and how should that change treatment?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Disability is not the NIHSS score',
    activeQuestions:{
      collateral:{prompt:'What question are you trying to answer?',options:[
        {label:'What does this deficit prevent this patient from doing in his normal life?',correct:true},
        {label:'Can occupation alone prove that thrombolysis is required?'},
        {label:'Can collateral determine the infarct location?'}],
        feedback:'Functional disability is patient-specific. The useful question is what the new deficit prevents the patient from doing—not whether the NIHSS is low or whether a job title automatically determines treatment.'}
    }
  },
  c8:{
    clinicalQuestion:'How should severe hypertension be handled without losing sight of an otherwise time-sensitive reperfusion candidate?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Blood pressure as a treatment constraint, not a competing diagnosis'
  },
  c9:{
    clinicalQuestion:'Does the presentation represent hemorrhage, and what immediate pathway follows once imaging establishes it?',
    finalManagementLabel:'Immediate management',
    debriefDecisionTitle:'Hemorrhage recognition and acute priorities'
  },
  c10:{
    clinicalQuestion:'Does the trajectory fit a resolving postictal deficit, persistent ischemia, or ongoing ictal activity?',
    finalManagementLabel:'Next management step',
    debriefDecisionTitle:'Serial examination as diagnostic data',
    activeQuestions:{
      eeg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is persistent or recurrent impaired awareness being driven by ongoing ictal activity?',correct:true},
        {label:'Did the witnessed convulsion definitely cause the weakness?'},
        {label:'Can EEG exclude acute ischemic stroke?'}],
        feedback:'EEG answers an ictal question. It is most useful when impaired awareness or focal deficits remain unexplained or fluctuate in a way that raises concern for ongoing seizure; it does not substitute for structural evaluation when stroke remains plausible.'}
    }
  },
  c11:{
    clinicalQuestion:'Which neural level—or combination of levels—best explains the bilateral leg weakness, and which test would reduce the remaining localization or etiologic uncertainty?',
    finalInterpretationLabel:'Best current neurologic model',
    finalInterpretationHelp:'A single diagnosis is not required. Choose the model that best represents the current localization and competing processes.',
    finalManagementLabel:'Most useful next direction',
    finalManagementHelp:'Choose the next direction that best addresses the unresolved high-stakes uncertainty.',
    debriefDecisionTitle:'Competing localizations and choosing the next test',
    actionPurpose:{
      mri_tspine:'Does the thoracic abnormality actually match the bedside syndrome, and is there an urgent compressive lesion?',
      mri_lspine:'Is there a conus/cauda or lower structural process that better matches the examination?',
      emg:'Is there a meaningful peripheral neuropathic, radicular, plexus, or myopathic contribution?',
      lp:'If inflammation or infection remains plausible, does CSF provide evidence for that mechanism?'
    },
    activeQuestions:{
      focused_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Which level of the neuraxis best explains the pattern of weakness, sensation, and reflexes?',correct:true},
        {label:'Can one abnormal MRI substitute for localization?'},
        {label:'Does reduced reflexes prove the process is peripheral?'}],
        feedback:'The targeted examination is meant to discriminate among cord, conus/roots, peripheral nerve, and multifocal disease. Strength distribution, reflexes, sensory level, sacral findings, and serial change are more informative together than any single sign.'},
      mri_tspine:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a thoracic cord lesion that anatomically explains the syndrome, and is it compressive?',correct:true},
        {label:'Does any thoracic MRI abnormality automatically establish the cause of weakness?'},
        {label:'Can thoracic MRI exclude a peripheral process?'}],
        feedback:'The MRI must be tested against the phenotype. A real thoracic lesion can be incidental, chronic, or only partly explanatory; compression, lesion distribution, tempo, and the examination determine its significance.'},
      mri_lspine:{prompt:'What question are you trying to answer?',options:[
        {label:'Could a conus/cauda or lower structural process explain findings not accounted for by the thoracic lesion?',correct:true},
        {label:'Can lumbar MRI determine whether the brain infarcts are acute?'},
        {label:'Will degenerative changes necessarily explain profound bilateral weakness?'}],
        feedback:'Lumbar/conus imaging is useful because the bedside localization remains lower or mixed. The goal is not to find any abnormality; it is to find a lesion that actually accounts for the syndrome and excludes a high-stakes compressive process.'},
      emg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is a peripheral neuropathic, radicular, plexus, or myopathic process contributing to the weakness?',correct:true},
        {label:'Is there CSF inflammation supporting myelitis?'},
        {label:'Are the cerebral infarcts in an ACA distribution?'}],
        feedback:'EMG/NCS tests the peripheral branch of the localization. It can characterize axonal versus demyelinating physiology and patterns such as neuropathy, radiculopathy, plexopathy, or myopathy. Timing matters: an early nondiagnostic study may not yet exclude a clinically plausible peripheral process.'},
      lp:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there CSF evidence supporting an inflammatory or infectious neurologic mechanism?',correct:true},
        {label:'Where exactly along the neuraxis is the weakness localized?'},
        {label:'Does CSF prove the thoracic lesion is acute?'}],
        feedback:'LP is primarily an etiologic test here, not a localization test. Cell count, protein, glucose, IgG index/oligoclonal bands, and targeted infectious studies can support or weaken inflammatory or infectious mechanisms, but the result still has to fit the tempo, examination, and MRI.'}
    }
  },
  c12:{
    clinicalQuestion:'Is there a stable focal or ictal neurologic syndrome that needs targeted neurologic testing, or does the pattern cohere as diffuse fluctuating cerebral dysfunction?',
    finalInterpretationLabel:'Syndrome interpretation',
    finalManagementLabel:'What would you do now?',
    debriefDecisionTitle:'When additional neurologic testing would actually change the model',
    activeQuestions:{
      attention_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there an acute disturbance of attention or arousal that fluctuates over time?',correct:true},
        {label:'Can orientation alone establish or exclude delirium?'},
        {label:'Does inattention by itself localize to one cerebral hemisphere?'}],
        feedback:'Direct attention testing converts a vague report of confusion into an observable cognitive phenotype. Pattern and fluctuation matter more than a single orientation question.'},
      focused_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a reproducible focal neurologic deficit that requires a different localization?',correct:true},
        {label:'Can a normal single examination prove there is no neurologic disease?'},
        {label:'Does chronic small-vessel disease explain the current fluctuation?'}],
        feedback:'The focal examination looks for a stable localizing syndrome that would change the model. Repetition matters when the complaint itself fluctuates.'},
      eeg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is the unexplained alteration in awareness persistent or stereotyped enough to suspect ictal activity?',correct:true},
        {label:'Can EEG confirm multifactorial delirium?'},
        {label:'Can EEG rule out a small ischemic stroke?'}],
        feedback:'EEG is useful when the phenotype creates an ictal question—persistent unexplained impaired awareness, stereotyped episodes, or fluctuations not explained by the systemic course. It is not a routine confirmation test for delirium.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Has a persistent focal syndrome or unexplained trajectory emerged that now warrants structural imaging?',correct:true},
        {label:'Does every episode of inpatient confusion require MRI?'},
        {label:'Can MRI establish delirium as the diagnosis?'}],
        feedback:'MRI should answer a structural question created by the phenotype or trajectory. More testing is not automatically more rigorous.'}
    }
  },
  c13:{
    clinicalQuestion:'Is this nonspecific fatigue with dysarthria, or is there objective fatigable weakness that localizes the syndrome to the neuromuscular junction?',
    finalInterpretationLabel:'Best current localization and syndrome',
    finalManagementLabel:'Most important next step',
    debriefDecisionTitle:'Turning "fatigue" into a localizable neurologic finding',
    activeQuestions:{
      fatigability_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Does sustained activation reveal objective fatigable weakness?',correct:true},
        {label:'Does the patient report feeling tired? '},
        {label:'Is dysarthria always caused by a brainstem lesion?'}],
        feedback:'The point of the provocative examination is to convert a vague symptom into an observable physiologic pattern. Reproducible worsening with sustained activation changes the localization far more than the word "fatigue" alone.'},
      respiratory_bulbar_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Is bulbar or respiratory weakness severe enough to change the urgency and level of monitoring?',correct:true},
        {label:'Can a normal brief limb exam exclude myasthenia? '},
        {label:'Does dysarthria severity identify the antibody subtype?'}],
        feedback:'Bulbar symptoms are not just diagnostic clues; they are a severity question. Swallowing, secretion management, speech endurance, and respiratory function need deliberate serial assessment.'},
      achr_musk:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there serologic evidence supporting autoimmune myasthenia gravis?',correct:true},
        {label:'How weak is the patient right now?'},
        {label:'Can antibody testing replace the bedside examination?'}],
        feedback:'Antibody testing can confirm and phenotype autoimmune MG, but it does not measure current respiratory/bulbar severity and a negative result does not automatically erase a convincing fatigable clinical syndrome.'},
      rns:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there physiologic evidence of impaired neuromuscular transmission?',correct:true},
        {label:'Is there cortical ischemia causing the dysarthria?'},
        {label:'Is the patient subjectively fatigued?'}],
        feedback:'RNS tests the neuromuscular-junction hypothesis physiologically. Its interpretation should remain anchored to the distribution and reproducibility of weakness on examination.'}
    }
  },
  c14:{
    clinicalQuestion:'Is the reduced responsiveness adequately explained by structural disease and edema, or is there ongoing cortical electrical activity that cannot be recognized from the examination alone?',
    finalInterpretationLabel:'Best current neurologic model',
    finalManagementLabel:'Most important next step',
    debriefDecisionTitle:'When an obvious structural abnormality is not the whole explanation',
    activeQuestions:{
      attention_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Is awareness persistently depressed, or does responsiveness fluctuate over minutes?',correct:true},
        {label:'Can a single GCS-like snapshot distinguish edema from seizure?'},
        {label:'Does known metastatic disease make serial examination unnecessary?'}],
        feedback:'The time series is the finding. Abrupt within-encounter changes in responsiveness create a different physiologic question than sustained somnolence.'},
      focused_exam:{prompt:'What question are you trying to answer?',options:[
        {label:'Do transient focal motor, ocular, or language findings accompany the fluctuations?',correct:true},
        {label:'Does the absence of dense hemiplegia exclude seizures?'},
        {label:'Can the examination determine the tumor histology?'}],
        feedback:'Subtle transient focal observations can be the clue that altered mental status has a dynamic cortical component. The goal is to observe the event, not label it before EEG.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Has the structural disease changed enough to explain the new neurologic trajectory?',correct:true},
        {label:'Can MRI exclude nonconvulsive status epilepticus? '},
        {label:'Does any amount of edema automatically explain fluctuating awareness?'}],
        feedback:'Imaging establishes the structural substrate and can reveal progression, hemorrhage, infarction, or mass effect. It cannot determine whether fluctuating cortical electrical activity is simultaneously present.'},
      eeg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is ongoing ictal activity contributing to the fluctuating mental status?',correct:true},
        {label:'Is the vasogenic edema real?'},
        {label:'Can a short EEG quantify the entire future seizure burden?'}],
        feedback:'The phenotype creates an ictal question. A routine EEG can reveal seizures or high-risk epileptiform patterns, but intermittent abnormalities may require longer monitoring.'},
      ceeg:{prompt:'What question are you trying to answer?',options:[
        {label:'What is the ongoing electrographic seizure burden, and does it respond to treatment over time?',correct:true},
        {label:'Can continuous EEG determine the histology of the metastases?'},
        {label:'Can continuous EEG distinguish vasogenic from cytotoxic edema?'}],
        feedback:'Continuous EEG is used because the process is dynamic. It detects intermittent or subclinical seizures and provides a time series for response and recurrence when the bedside examination alone is insufficient.'}
    }
  }
};
CASES.forEach(c=>Object.assign(c,CASE_DESIGN[c.id]||{}));


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
  ]},
  c11:{tempo:'acute', localization:'multifocal_unclear', localizationOptions:['spinal_cord','conus_roots','pns','cortex','multifocal_unclear'], syndromeOptions:['paraparesis_mixed','aca','mimic'], hypotheses:['Spinal cord / conus process','Peripheral neuropathic or neuromuscular process','Cerebral ischemia','Inflammatory or infectious neurologic process','Critical-illness related weakness'], reexam:[
    'On repeat examination he continues to follow commands with both arms. There is now trace hip flexion bilaterally but no reliable ankle movement. Knee reflexes remain reduced and ankle reflexes absent. No definite sensory level is found.',
    'Later, proximal leg movement improves slightly while distal weakness and sensory complaints persist. The examination still does not collapse into a single clean central or peripheral localization.'
  ]},
  c12:{tempo:'fluctuating', localization:'diffuse', localizationOptions:['diffuse','cortex','subcortical','multifocal_unclear'], syndromeOptions:['acute_confusional','mimic','dominant_mca','nondominant_mca'], hypotheses:['Multifactorial delirium','Acute ischemic stroke','Nonconvulsive seizure / status','Medication effect','Other toxic-metabolic encephalopathy'], reexam:[
    'Thirty minutes later she is more attentive and answers orientation questions correctly, though she still loses track during longer tasks. There is no focal motor, language, visual, or sensory deficit.',
    'Later in the afternoon she is again drowsier and inattentive but arouses to voice and remains symmetric on focal neurologic examination.'
  ]},
  c13:{tempo:'progressive', localization:'nmj_pns', localizationOptions:['nmj_pns','brainstem','cortex','pns','multifocal_unclear'], syndromeOptions:['fatigable_bulbar','posterior_brainstem','mimic'], hypotheses:['Neuromuscular-junction disorder','Brainstem or cortical lesion','Myopathy','Medication or toxic-metabolic process','Generalized fatigue without focal neurologic weakness'], reexam:[
    'After several minutes of conversation, dysarthria is more apparent and mild ptosis has returned. After a brief period of rest, both improve partially.',
    'Later examination again shows preserved sensation and reflexes with reproducible facial, bulbar, and proximal fatigability rather than a fixed focal deficit.'
  ]},
  c14:{tempo:'acute', localization:'multifocal_unclear', localizationOptions:['diffuse','cortex','multifocal_unclear'], syndromeOptions:['structural_fluctuating_ams','acute_confusional','mimic'], hypotheses:['Nonconvulsive seizure / status','Vasogenic edema / tumor-related dysfunction','Medication effect','Other toxic-metabolic encephalopathy','Acute ischemic or hemorrhagic event'], reexam:[
    'Ten minutes later he opens his eyes and follows a command with both hands. Several minutes after that he stares, becomes mute, and has a brief subtle right facial twitch before again becoming partially responsive.',
    'The examination continues to fluctuate without a new fixed hemiparesis. This time series increases concern for a dynamic cortical process superimposed on the structural disease.'
  ]}
};

function reasoningFor(c){ return CASE_REASONING[c.id] || {tempo:'unclear', localization:'multifocal_unclear', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other neurologic process'], reexam:['No major interval change on repeat examination.']}; }
