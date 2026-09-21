// ============================================================
// Neurologic reasoning framework
// ============================================================
const TEMPOS = [
  {id:'hyperacute', title:'Hyperacute', desc:'Symptoms develop over seconds to minutes.'},
  {id:'acute', title:'Acute', desc:'Symptoms develop over minutes to hours to days.'},
  {id:'subacute', title:'Subacute', desc:'Symptoms develop over days to weeks to months.'},
  {id:'chronic', title:'Chronic', desc:'Symptoms develop over months to years.'},
  {id:'unclear', title:'Unclear', desc:'The onset or evolution cannot yet be defined reliably.'},
  {id:'acute_on_subacute', title:'Acute on a subacute background', desc:'A new acute change is superimposed on symptoms evolving over days to weeks.'}
];

const LOCALIZATIONS = [
  {id:'cortex', title:'Cerebral cortex', desc:'Language, neglect, gaze, visual field, cortical sensory or motor pattern.'},
  {id:'subcortical', title:'Subcortical / deep hemisphere', desc:'Internal capsule, thalamus, deep white matter.'},
  {id:'brainstem', title:'Brainstem', desc:'Cranial nerve findings, crossed signs, long-tract pattern.'},
  {id:'cerebellar', title:'Cerebellum / central vestibular pathways', desc:'Truncal or gait ataxia, dysmetria, central ocular-motor findings, or posterior-fossa features.'},
  {id:'peripheral_vestibular', title:'Peripheral vestibular apparatus / nerve', desc:'A vestibular pattern arising from the labyrinth or vestibular nerve without other central neurologic findings.'},
  {id:'diffuse', title:'Diffuse cerebral dysfunction', desc:'Global attention/arousal disturbance without a coherent focal syndrome.'},
  {id:'spinal_cord', title:'Spinal cord', desc:'A myelopathic pattern involving long tracts, a sensory level, or autonomic dysfunction.'},
  {id:'conus_roots', title:'Conus / cauda equina / lumbosacral roots', desc:'Leg weakness with root, saddle sensory, sphincter, or lower-motor-neuron features.'},
  {id:'pns', title:'Peripheral nerve / plexus', desc:'Length-dependent, multifocal, or nerve-distribution motor and sensory findings.'},
  {id:'nmj', title:'Neuromuscular junction', desc:'Fluctuating or fatigable ocular, bulbar, facial, axial, or limb weakness without sensory loss.'},
  {id:'muscle', title:'Muscle', desc:'Predominantly proximal or axial weakness with preserved sensation; pattern may be fixed or exercise-related depending on the process.'},
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
  focused_exam:'Re-examine the findings most likely to discriminate among the plausible localizations.',
  attention_exam:'Characterize attention and arousal more deeply than orientation alone.',
  fatigability_exam:'Add provocative maneuvers for fatigability when a neuromuscular-junction syndrome is plausible.',
  respiratory_bulbar_exam:'Add bulbar, neck, cough, and respiratory-muscle assessment when the syndrome makes them relevant.',
  reexam:'Use change over time as diagnostic information.',
  collateral:'Clarify baseline, timing, trajectory, and relevant context.',
  ems_timeline:'Separate last-known-well, discovery time, and observed onset.',
  meds:'Review medications only when a drug exposure could plausibly explain the syndrome or change the next decision.',
  baseline:'Understand pre-illness function and what the current deficit means for this patient.',
  seizure_hx:'Assess whether seizure is a plausible competing explanation.',
  osh:'Recover prior neurologic information that could change the current model.',
  ncct:'Answer the first structural question: hemorrhage or another major lesion, and in ischemic stroke assess early ischemic change when that affects reperfusion decisions.',
  cta:'Define the arterial lesion when vascular localization is plausible and determine whether the finding creates an endovascular pathway.',
  ctp:'Use perfusion imaging to characterize core and hypoperfused tissue when that information may inform reperfusion selection, prognosis, or local stroke-team decision making. Interpret it alongside the examination, NCCT/ASPECTS, and CTA.',
  mri:'Use MRI when a remaining anatomic or tissue question could change the neurologic model or management, and interpret the image against the bedside syndrome.',
  mri_tspine:'Ask whether a thoracic cord lesion matches the bedside localization and excludes compression.',
  mri_lspine:'Evaluate conus, cauda equina, or lower structural disease when the phenotype remains lower than the known lesion.',
  labs:'Test a specific systemic or metabolic hypothesis raised by the history, examination, or trajectory rather than ordering broad laboratory testing without a question.',
  eeg:'Test an ictal hypothesis when the clinical phenotype or trajectory raises concern for ongoing or recurrent cortical electrical activity.',
  emg:'Test whether the bedside syndrome has a peripheral nerve, root, plexus, neuromuscular, or muscle component and characterize the physiology when that distinction matters.',
  lp:'Use CSF to test a plausible inflammatory, infectious, malignant, or other CSF-space mechanism after the bedside localization and imaging have defined the question.',
  achr_musk:'Seek serologic support for autoimmune myasthenia once the clinical phenotype supports neuromuscular-junction dysfunction.',
  rns:'Test the neuromuscular-junction hypothesis physiologically when the examination suggests fatigable weakness and confirmation would change diagnostic confidence.',
  ceeg:'Quantify a dynamic electrographic process over time when intermittent or subclinical seizures remain plausible after the initial assessment.'
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
      note: 'Compare the MCAs and Sylvian fissures on both sides. What stands out?'
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
 syndromeStory:'This patient suddenly stopped talking, kept staring to the left, and lost movement of the right arm and leg. That bedside pattern localizes to the left dominant hemisphere and is highly concordant with a left middle cerebral artery syndrome. On the very first non-contrast CT head, the L M1 may already show a <b>hyperdense MCA sign</b>, a bright linear thrombus visible before any contrast is given (the bright structure in the L Sylvian fissure on the Radiopaedia example). Recognizing it can strengthen the working diagnosis while IV thrombolysis eligibility is assessed; vascular imaging should proceed in parallel and should not unnecessarily delay otherwise indicated thrombolysis. CTA then confirmed the L M1 occlusion, matching the syndrome. Within 90 minutes of onset, this is a reperfusion candidate: IV tenecteplase plus paging IR to discuss MT in parallel.',
 teach:[
   'Recognize dominant hemispheric cortical dysfunction at the bedside: aphasia, forced gaze deviation toward the lesion, and dense contralateral face-arm-leg weakness point to a proximal anterior-circulation LVO until proven otherwise.',
   'Within 4.5 hours, do not delay eligible TNK for additional multimodal imaging. Noncontrast CT is used to exclude hemorrhage; CTA should proceed rapidly in parallel when LVO is suspected.',
   'Run IV thrombolysis and EVT workflows in parallel. Do not wait to see whether the lytic works before activating thrombectomy.',
   'When IV thrombolysis is indicated, these cases use TNK to match Duke practice. The treatment dose used in the 2026 AHA/ASA guideline is 0.25 mg/kg (maximum 25 mg); 0.4 mg/kg is not recommended.',
   'Before TNK, recent DOAC exposure matters. The 2026 guideline treats DOAC exposure within 48 hours as a relative contraindication: use an individualized benefit-risk assessment rather than an automatic yes/no rule.',
   'Bridging thrombolysis still matters in eligible LVO. In BRIDGE-TNK, 90-day functional independence was 53% with tenecteplase plus thrombectomy vs 44% with thrombectomy alone, with similar safety.'
 ],
 citations:['2026 AHA/ASA Acute Ischemic Stroke Guideline', '2025 TNKase FDA label', 'BRIDGE-TNK trial'],
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
 syndromeStory:'Found down at 6:30 AM, last seen normal at 10 PM. She is mute, is not blinking to threat on her right, and is not moving the right side. That is a dense left dominant hemispheric cortical syndrome. CTA showed a left ICA terminus (T) occlusion. Unknown onset changes the treatment-selection question; it does not end the evaluation. CTA already establishes a proximal LVO, and her noncontrast CT remains favorable. Under the 2026 guideline, appropriate proximal ICA/M1 occlusions can qualify for EVT from 6 to 24 hours using clinical features plus CT/ASPECTS; CTP can add tissue information and may matter for an extended-window IV-thrombolysis question, but it should not become a mandatory hurdle to EVT.',
 teach:[
   'Recognize a wake-up stroke as an imaging-selection problem, not an automatic exclusion.',
   'Localize first, then let imaging decide treatment. Dense aphasia, hemianopia, gaze deviation, and hemiplegia still point to a left hemispheric LVO even when onset is unknown. When onset is unknown or unconfirmed, treat the case as a wake-up stroke.',
   'Separate discovery time from tissue status. Discovery at 6:30 AM does not tell you whether salvageable penumbra remains.',
   'For unknown-onset or extended-window IV thrombolysis, MRI DWI-FLAIR mismatch or perfusion mismatch can identify selected patients who may benefit. These cases use TNK for IV thrombolysis decisions to match Duke practice.',
   'The 2026 guideline now supports EVT for proximal ICA/M1 occlusion from 6 to 24 hours in appropriate patients with NIHSS at least 6, prestroke mRS 0 to 1, and ASPECTS at least 6. Perfusion imaging can be useful, but a favorable CTP is no longer the only way to identify a late-window EVT candidate.'
 ],
 citations:['2026 AHA/ASA Acute Ischemic Stroke Guideline','Gonzalez et al., Response on EVT imaging selection in the 6–24-hour window (Stroke 2026)','WAKE-UP trial'],
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
 syndromeStory:'Found unresponsive at a bus stop with no ID, no phone, and no clear timeline. She has a left dominant hemispheric cortical syndrome (no speech, no movement on the right side). CTA showed a left M1 occlusion. CTP showed a mismatch. The syndrome and vascular imaging remain actionable despite incomplete timing information. The uncertainty should be documented rather than treated as a reason for diagnostic paralysis.',
 teach:[
   'Act on concordance: dense dominant-hemisphere syndrome, proximal occlusion on CTA, and favorable perfusion mismatch together support thrombectomy even when collateral history is incomplete.',
   'The 2026 AHA/ASA AIS guideline emphasizes streamlined imaging and systems-of-care so treatment is not delayed, even when you do not have all the information about a patient.',
   'Use the current late-window EVT framework. In the 2026 AHA/ASA guideline, selected proximal ICA/M1 occlusions from 6 to 24 hours can qualify for EVT using clinical features plus CT/CTA and ASPECTS; advanced perfusion imaging can also be useful when immediately available and remains part of many center-specific workflows.'
 ],
 citations:['2026 AHA/ASA Acute Ischemic Stroke Guideline','Gonzalez et al., Response on EVT imaging selection in the 6–24-hour window (Stroke 2026)'],
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
 syndromeStory:'Eleven hours from last known well. Right gaze deviation, left face/arm/leg weakness, and left-sided extinction. That pattern is a right nondominant hemispheric cortical syndrome. CTA confirmed a right M1 occlusion. ASPECTS is 4 because more than half of the MCA territory shows early ischemic change on CT head. Older logic would have called that too large for thrombectomy. Current evidence (SELECT2, ANGEL ASPECT, TESLA) supports thrombectomy in selected patients with ASPECTS 3 to 5, age under 80, and NIHSS at least 6. At 11 hours with a proximal LVO and a clear EVT pathway, the central reperfusion question is thrombectomy; any extended-window IV-thrombolysis consideration is imaging-selected and should not delay EVT.',
 teach:[
   'Recognize nondominant MCA cortex from the exam: gaze preference toward the lesion (right gaze), contralateral hemiparesis, hemianopia, and extinction or neglect are cortical findings, not a lacunar pattern.',
   'Score ASPECTS carefully but not fatalistically. Low ASPECTS predicts worse absolute prognosis, but it does not prove futility.',
   'CTP can help characterize the extent of established injury and residual hypoperfused tissue, and many stroke teams incorporate it into late-window decision making. Its findings should be integrated with CTA, ASPECTS, the examination, baseline function, and the broader clinical context rather than interpreted in isolation.',
   'Pooled lesson: a meta-analysis of six randomized large-core trials found better 90-day mRS (generalized OR 1.6) and more independent ambulation (RR 1.9), with higher symptomatic ICH (RR 1.7).',
   'The 2026 AHA/ASA guideline gives a Class 1 recommendation for selected proximal ICA/M1 occlusions 6 to 24 hours from onset with age under 80, NIHSS at least 6, prestroke mRS 0 to 1, ASPECTS 3 to 5, and no significant mass effect. It also makes EVT reasonable in selected ASPECTS 0 to 2 patients within 6 hours.'
 ],
 citations:['2026 AHA/ASA Acute Ischemic Stroke Guideline','SELECT2 trial','LASTE trial','Large-core RCT meta-analysis'],
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
 syndromeStory:'He became suddenly sleepy. The left pupil is enlarged and poorly reactive, the eyelid droops, and the eye rests down and out. The right arm and leg are weak. That bedside pattern is an ipsilateral oculomotor (CN III) palsy plus contralateral hemiparesis, which localizes to the left midbrain. CTA confirmed a basilar tip occlusion, the vascular emergency that explains the syndrome. Within 4.5 hours of onset, this is a reperfusion candidate: IV tenecteplase plus paging IR to discuss MT. Basilar thrombectomy is Class 1 within 24 hours when NIHSS is at least 10.',
 teach:[
   'Perform a cranial nerve exam immediately in suspected posterior-circulation stroke. The NIHSS does not adequately capture brainstem signs, and CN findings are often the localization clue that changes management.',
   'Recognize crossed brainstem findings: ipsilateral CN III palsy with contralateral hemiparesis localizes to the midbrain and should trigger urgent posterior-circulation vascular imaging.',
   'A brainstem localization can still represent a basilar thrombectomy lesion.',
   'Use the basilar EVT trial numbers. In ATTENTION, mRS 0 to 3 at 90 days occurred in 46% vs 23% with EVT vs medical therapy, and mortality was 37% vs 55%. In BAOCHE, mRS 0 to 3 was 46% vs 24% in the 6 to 24 hour window.',
   'The 2026 AHA/ASA guideline gives a strong recommendation for EVT within 24 hours for basilar artery occlusion when baseline mRS is 0 to 1, NIHSS is at least 10, and pc-ASPECTS is at least 6.'
 ],
 citations:['ATTENTION trial', 'BAOCHE trial', '2026 AHA/ASA AIS Guideline'],
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
 syndromeStory:'Sudden severe spinning, vomiting, slurred speech, and inability to sit up. The bedside eye findings are not a classic central HINTS pattern, but the severe truncal instability and dysarthria remain discordant with a simple peripheral explanation. NIHSS is misleadingly low at 4. The bedside pattern is a cerebellar/vestibular posterior circulation syndrome, and CTA confirmed a distal basilar thrombus. MRI showed acute infarcts in cerebellum and pons. A low NIHSS does not capture the severity of the truncal and ocular-motor findings. Within 4.5 hours, the disabling posterior-circulation syndrome remains an IV TNK question. The distal basilar thrombus warrants an urgent neuro-IR discussion, but his NIHSS of 4 does not meet the strong 2026 guideline criterion for basilar EVT; the thrombectomy evidence at this severity is uncertain.',
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
 syndromeStory:'Concordant left dominant hemispheric cortical syndrome with a concordant left M1 occlusion on CTA. Blood pressure is 212/118. The treatment question is whether it can be lowered enough to meet reperfusion eligibility without attempting rapid normalization. Aggressive BP lowering before reperfusion can reduce collateral perfusion and worsen outcome. After successful EVT, the standard ceiling stays at or under 180/105, and pushing SBP below 140 is harmful (Class III).',
 teach:[
   'Before TNK, BP must be below 185/110. After IV thrombolysis, maintain BP below 180/105 for at least 24 hours; after EVT, a ceiling at or below 180/105 is reasonable.',
   'Do not try to normalize BP before reperfusion. Excessive early reduction can compromise collateral flow.',
   'The 2026 guideline specifically advises against intensive SBP lowering below 140 after IV thrombolysis and warns that intensive lowering after EVT may be harmful, even after complete reperfusion.',
   'For a stroke that does not undergo reperfusion therapy, do not routinely lower BP unless it is roughly at or above 220/120, and then reduce only modestly (about 15% in 24 hours).',
   'After EVT, the patient gets BP management in the neuro-ICU.'
 ],
 citations:['2026 AHA/ASA AIS Guideline', 'Acute stroke BP comparative review (2025/2026)', 'ESO blood pressure guideline for AIS / MT'],
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
 syndromeStory:'Sudden worst headache of his life, vomiting, and left-sided weakness. CT head shows a right basal ganglia hemorrhage of about 25 mL. The CT establishes intracerebral hemorrhage and shifts management away from ischemic reperfusion. Current ICH BP guidance is smooth, sustained reduction of SBP to 130 to under 140, avoiding overshoot below 130. No anticoagulation history here, so no reversal is needed. Neurosurgical and neurocritical-care evaluation follow from the hemorrhage phenotype and clinical severity.',
 teach:[
   'Recognize the switch point immediately: headache, vomiting, focal deficit, and ICH on CT means hemorrhage pathway, not reperfusion pathway.',
   'Aim for rapid, smooth, sustained BP control rather than dramatic swings.',
   'In spontaneous ICH with presenting SBP 150 to 220, lower toward about 140, but avoid overshoot below about 130 and avoid large variability.',
   'Caveat for very high presenting SBP: in ATACH-2 patients with initial SBP at or above 220, intensive lowering was associated with more neurologic deterioration and more kidney injury. Avoid aggresively lowering the pressure down.'
 ],
 citations:['INTERACT2 trial', 'ATACH-2 trial', 'ATACH-2 subgroup analysis (SBP ≥ 220)', 'Acute stroke BP comparative review (2025/2026)'],
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
  focused_exam:'A localization-focused repeat confirms reduced knee reflexes and absent ankle reflexes. Pinprick, vibration, and proprioception are compared side-to-side and distally-to-proximally; distal sensory loss remains more convincing than a truncal sensory level. Saddle sensation is not clearly abnormal. The strength pattern remains profound in both legs without a clean single-root distribution. These additions are used to discriminate cord, conus/roots, peripheral nerve, and multifocal disease rather than to replace the complete neurologic examination.',
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
},

{id:'c12', n:12,
 arrival:'79-year-old woman develops intermittent confusion on hospital day 4. Nursing reports that she was sleepy and inattentive this morning, more conversant around noon, and confused again later in the afternoon. Neurology is consulted because the change seems abrupt.',
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
  respiratory_bulbar_exam:'She can manage secretions and speak in full sentences, with no accessory-muscle use or paradoxical breathing. Cough is effective. A baseline NIF and vital capacity are obtained and are not severely reduced. These measurements are effort- and technique-dependent and do not replace the examination. The useful information is the trend: repeat NIF/vital capacity together with speech endurance, neck flexion, cough, secretion handling, swallowing, work of breathing, and gas exchange if the clinical picture worsens.',
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
   'Bulbar weakness changes urgency. NIF and vital capacity are useful serial respiratory measures, but no single value reliably predicts decompensation; trend them with the history and bedside examination, especially speech endurance, neck flexion, cough, secretion handling, swallowing, and work of breathing.'
 ],
 citations:['Juel, Autoimmune Myasthenia Gravis, Continuum (2025)','McKenzie et al., acute neuromuscular respiratory failure risk stratification (Crit Care Med 2024)','Association of British Neurologists autoimmune MG guideline update (2025)','Tankisi et al., electrodiagnostic criteria for neuromuscular transmission disorders (2025)'],
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
}


];


// ============================================================
// Universal bedside presentation metadata
// Baseline and the initial neurologic examination are shown before any diagnostic framing.
// Findings are intentionally written as raw observations rather than interpretive labels.
// ============================================================
const CASE_BEDSIDE = {
  c1:{baseline:'Not yet established.',initialExam:{mental:'Awake. No intelligible verbal output. Does not reliably follow spoken commands.',cranial:'Eyes are persistently deviated to the left. Blink to threat is reduced on the right. Pupils are symmetric and reactive. Right lower facial movement is reduced; tongue assessment is limited by inability to follow commands.',motor:'Left arm and leg move spontaneously against gravity. No purposeful movement is seen in the right arm or right leg. Bulk is preserved; no abnormal movements are seen.',sensory:'Light touch and pinprick testing are limited by the language deficit; reliable vibration and proprioception testing cannot be obtained.',coordination:'Left finger-to-nose is without clear dysmetria. Testing on the right is limited by weakness.',reflexes:'Deep tendon reflexes are present and roughly symmetric; plantar responses are not clearly asymmetric.',gait:'Deferred because of the acute deficit.'},strokeTools:['nihss']},
  c2:{baseline:'Not yet established.',initialExam:{mental:'Awake but mute. Does not reliably follow spoken commands.',cranial:'Eyes are deviated to the left. Blink to threat is absent on the right. Pupils are symmetric and reactive. Right lower facial movement is reduced.',motor:'No purposeful movement is seen in the right arm or right leg; left limbs move against gravity. No abnormal movements are seen.',sensory:'Light touch and pinprick testing are limited by impaired communication; vibration and proprioception cannot be assessed reliably.',coordination:'Left finger-to-nose shows no clear dysmetria; right-sided testing is limited by weakness.',reflexes:'Deep tendon reflexes are present bilaterally; plantar responses are not clearly asymmetric.',gait:'Deferred.'},strokeTools:['nihss']},
  c3:{baseline:'Unknown on arrival.',initialExam:{mental:'Awake but nonverbal. Does not reliably follow spoken commands.',cranial:'Persistent leftward gaze. Reduced blink to threat on the right. Pupils are symmetric and reactive. Right lower facial movement is reduced.',motor:'Right arm and leg do not move purposefully; left arm and leg move against gravity. No abnormal movements are seen.',sensory:'Light touch and pinprick testing are limited by impaired communication; vibration and proprioception cannot be assessed reliably.',coordination:'Left finger-to-nose shows no clear dysmetria; right-sided testing is limited by weakness.',reflexes:'Deep tendon reflexes are present bilaterally; plantar responses are not clearly asymmetric.',gait:'Deferred.'},strokeTools:['nihss']},
  c4:{baseline:'Not yet established.',initialExam:{mental:'Awake. Answers simple questions but repeatedly fails to attend to people or stimuli on the left.',cranial:'Eyes tend to rest to the right. Blink to threat is reduced on the left. Pupils are symmetric and reactive. Left lower facial movement is reduced.',motor:'Left arm and leg are weaker than the right; no abnormal movements are seen.',sensory:'Light touch and pinprick are detected bilaterally when tested separately, but left-sided stimuli are missed during simultaneous bilateral stimulation. Proprioception is grossly preserved where participation allows.',coordination:'Testing on the left is limited by weakness and inattention; right finger-to-nose is accurate.',reflexes:'Deep tendon reflexes are present bilaterally; plantar responses are not clearly asymmetric.',gait:'Deferred.'},strokeTools:['nihss']},
  c5:{baseline:'Not yet established.',initialExam:{mental:'Somnolent but arouses to voice. Speech is slurred.',cranial:'Left eyelid is ptotic. Left pupil is larger and poorly reactive. Left eye rests down and out. Facial movement is otherwise symmetric.',motor:'Right arm and leg are weaker than the left; bulk is preserved and no abnormal movements are seen.',sensory:'Light touch and pinprick are appreciated on both sides; detailed vibration and proprioception testing is limited by somnolence.',coordination:'Left finger-to-nose is without clear dysmetria; right-sided testing is limited by weakness.',reflexes:'Deep tendon reflexes are present bilaterally; plantar responses are not clearly asymmetric.',gait:'Deferred.'},strokeTools:['nihss']},
  c6:{baseline:'Not yet established.',initialExam:{mental:'Alert and conversational. Speech is mildly slurred.',cranial:'Pupils are symmetric and reactive. Spontaneous horizontal left-beating nystagmus is visible in primary gaze. Extraocular movements are full. Facial sensation and movement are symmetric; hearing is grossly intact.',motor:'Normal bulk and tone. No pronator drift or clear unilateral arm or leg weakness.',sensory:'Light touch, pinprick, vibration, and proprioception are symmetric in the limbs.',coordination:'Finger-to-nose and heel-to-shin show no clear appendicular dysmetria, but he is unable to sit upright without support.',reflexes:'Deep tendon reflexes are 2+ and symmetric; plantar responses are flexor.',gait:'Unable to stand safely because of severe truncal instability.'},strokeTools:['nihss']},
  c7:{baseline:'Independent; works as a dentist and normally has full use of the dominant right hand.',initialExam:{mental:'Alert, oriented, attentive, and fluent.',cranial:'Pupils, visual fields, eye movements, facial sensation, facial movement, palate, and tongue are symmetric.',motor:'Normal bulk and tone. No pronator drift. Proximal arm and leg strength is full. Right finger tapping is markedly slow and irregular; he cannot rapidly open and close the right hand or perform precise finger sequencing.',sensory:'Light touch, pinprick, vibration, and proprioception are symmetric in both hands and feet.',coordination:'Finger-to-nose and heel-to-shin are accurate bilaterally; fine distal right-hand movements are disproportionately impaired.',reflexes:'Deep tendon reflexes are 2+ and symmetric; plantar responses are flexor.',gait:'Normal casual and tandem gait.'},strokeTools:['nihss']},
  c8:{baseline:'Not yet established.',initialExam:{mental:'Awake but produces no meaningful speech and does not reliably follow spoken commands.',cranial:'Eyes are deviated to the left. Blink to threat is reduced on the right. Pupils are symmetric and reactive. Right lower facial movement is reduced.',motor:'No purposeful movement is seen in the right arm or leg; left limbs move against gravity. No abnormal movements are seen.',sensory:'Light touch and pinprick testing are limited by impaired communication; vibration and proprioception cannot be assessed reliably.',coordination:'Left finger-to-nose shows no clear dysmetria; right-sided testing is limited by weakness.',reflexes:'Deep tendon reflexes are present bilaterally; plantar responses are not clearly asymmetric.',gait:'Deferred.'},strokeTools:['nihss']},
  c9:{baseline:'Not yet established.',initialExam:{mental:'Awake but uncomfortable and intermittently drowsy after vomiting. Speech is understandable.',cranial:'Pupils are symmetric and reactive. Extraocular movements are full. Left lower facial movement is reduced.',motor:'Left arm and leg drift downward and cannot sustain full antigravity effort. Right limbs are stronger; no abnormal movements are seen.',sensory:'Light touch and pinprick are reduced on the left compared with the right; vibration and proprioception are grossly preserved.',coordination:'Right finger-to-nose is accurate; left-sided testing is limited by weakness.',reflexes:'Deep tendon reflexes are present bilaterally; plantar responses are not clearly asymmetric.',gait:'Deferred because of acute weakness and severe headache.'},strokeTools:['nihss']},
  c10:{baseline:'Not yet established.',initialExam:{mental:'Sleepy but opens eyes to voice. Answers slowly and is confused about recent events.',cranial:'Pupils are symmetric and reactive. No persistent gaze deviation. Extraocular movements are full when he participates. Facial movement is symmetric.',motor:'Normal bulk. Mild downward drift of the right arm; legs move symmetrically. No ongoing rhythmic movements are seen.',sensory:'Light touch and pinprick are appreciated on both sides; detailed vibration and proprioception testing is limited by somnolence.',coordination:'Finger-to-nose is slowed by somnolence without clear dysmetria.',reflexes:'Deep tendon reflexes are present and symmetric; plantar responses are flexor.',gait:'Deferred.'},strokeTools:['nihss']},
  c11:{baseline:'Before this hospitalization he walked independently, although family had recently noticed slower gait and distal sensory symptoms.',initialExam:{mental:'Awake enough to follow commands with both upper extremities.',cranial:'Pupils are symmetric and reactive. Eye movements are full. Face is symmetric. Speech cannot be fully assessed while intubated.',motor:'Upper extremities move symmetrically against gravity. Lower extremities show only trace proximal movement and no reliable distal movement. The legs remain markedly tense during examination, making tone difficult to interpret. No fasciculations are seen.',sensory:'Pinprick is reduced distally in both feet. Vibration is reduced at the toes and proprioception is difficult to assess reliably. No definite truncal sensory level is identified on the first examination.',coordination:'Finger-to-nose is accurate in both upper extremities. Lower-extremity coordination cannot be tested because of weakness.',reflexes:'Biceps, triceps, and brachioradialis reflexes are present. Knee reflexes are reduced. Ankle reflexes are absent. Plantar responses are mute.',gait:'Not testable.'}},
  c12:{baseline:'Before admission she managed basic activities and normal conversation independently; family reports no established dementia diagnosis.',initialExam:{mental:'Awake and conversational. Oriented to name and hospital. Easily distracted and loses the thread of conversation. Performance on multi-step commands is inconsistent.',cranial:'Pupils are symmetric and reactive. Visual fields, eye movements, facial sensation, facial movement, palate, and tongue are symmetric.',motor:'Normal bulk and tone. No pronator drift or abnormal movements. Strength is symmetric within the limits of pain and deconditioning.',sensory:'Light touch, pinprick, vibration, and proprioception are symmetric where cooperation is reliable.',coordination:'Finger-to-nose and finger taps are accurate bilaterally.',reflexes:'Deep tendon reflexes are present and symmetric; plantar responses are flexor.',gait:'Not tested during the initial bedside assessment.'}},
  c13:{baseline:'Fully independent with normal speech, swallowing, and mobility before this illness.',initialExam:{mental:'Alert, oriented, attentive, and fluent. Language is normal.',cranial:'Pupils are symmetric and reactive. Extraocular movements are full on brief testing. Facial sensation is intact. Facial activation is mildly weak but symmetric. Speech is mildly slurred. Tongue is midline without atrophy.',motor:'Normal bulk and tone. No pronator drift or fasciculations. Limb strength is near full on brief confrontation testing.',sensory:'Pinprick, vibration, and proprioception are intact.',coordination:'Finger-to-nose and finger taps are accurate on brief testing.',reflexes:'Biceps, triceps, brachioradialis, patellar, and ankle reflexes are 2+ and symmetric. Plantar responses are flexor.',gait:'Casual gait is normal.'}},
  c14:{baseline:'Earlier in the day he was conversational and consistently followed commands despite known metastatic disease.',initialExam:{mental:'Opens eyes to voice. At times tracks and follows a one-step command; several minutes later he may stare without responding while remaining awake.',cranial:'Pupils are symmetric and reactive. No persistent gaze deviation is present between episodes. Extraocular movements are grossly full when he participates. Facial movement is grossly symmetric.',motor:'No new dense unilateral weakness is identified. All four limbs move against gravity when he participates. No continuous convulsive activity is seen.',sensory:'Withdraws or localizes to light touch and pinprick on both sides; higher-order sensory testing is limited by fluctuating participation.',coordination:'Formal finger-to-nose testing is intermittently possible and does not show a consistent lateralized dysmetria.',reflexes:'Deep tendon reflexes are present bilaterally without a clear new asymmetry; plantar responses are not clearly asymmetric.',gait:'Not tested.'}}
};
CASES.forEach(c=>Object.assign(c,CASE_BEDSIDE[c.id]||{}));

// ============================================================
// Case-specific educational design
// Universal reasoning is constant; the clinical decision varies by case.
// ============================================================
const CASE_DESIGN = {
  c1:{
    availableActions:['nihss','ncct','cta','collateral','reexam'],
    clinicalQuestion:'Is this a disabling acute ischemic stroke for which reperfusion should proceed now?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Acute stroke decision',
    actionPurpose:{cta:'Confirm whether a proximal arterial occlusion creates a thrombectomy pathway without delaying otherwise indicated IV thrombolysis.'},
    activeQuestions:{
      cta:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a proximal arterial occlusion that changes the endovascular pathway?',correct:true},
        {label:'Is there already enough noncontrast CT change to estimate infarct burden?'},
        {label:'Would perfusion imaging add tissue information beyond the vessel study?'}],
        feedback:'CTA is being used to identify the vascular lesion and determine whether EVT should run in parallel. The clinical examination and functional impact establish the syndrome and disability; CTA should not replace them.'}
    }
  },
  c2:{
    availableActions:['nihss','ncct','cta','ctp','mri','reexam'],
    clinicalQuestion:'With an unknown onset, what information can establish whether reperfusion still has a biologic target?',
    finalManagementLabel:'Reperfusion decision',
    debriefDecisionTitle:'Unknown-onset stroke: what does imaging add?',
    activeQuestions:{
      ctp:{prompt:'Why are you ordering CTP?',options:[
        {label:'Is there salvageable tissue that could make extended-window reperfusion reasonable?',correct:true},
        {label:'Is there a proximal arterial occlusion that would create an EVT pathway?'},
        {label:'Is there hemorrhage or extensive established infarction on the noncontrast CT?'}],
        feedback:'CTP answers a tissue-status question rather than determining the exact onset time. In the 2026 AHA/ASA guideline, perfusion imaging can be useful for extended-window IV thrombolysis and for EVT evaluation when immediately available. Its role varies with the clinical scenario and local workflow; interpret it together with the examination, CT/CTA, and ASPECTS.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there an imaging mismatch that can help select an unknown-onset stroke for treatment?',correct:true},
        {label:'Is there a proximal occlusion that requires vascular imaging and EVT planning?'},
        {label:'Is there hemorrhage that would change the immediate pathway?'}],
        feedback:'DWI/FLAIR mismatch is a treatment-selection concept in appropriately selected unknown-onset stroke. It complements the clinical syndrome; it does not reconstruct the exact onset or replace localization.'}
    }
  },
  c3:{
    availableActions:['nihss','ncct','cta','ctp','collateral','reexam'],
    clinicalQuestion:'How much uncertainty about timing and identity can remain while still making a safe, evidence-based reperfusion decision?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Acting despite incomplete collateral',
    activeQuestions:{
      ctp:{prompt:'Why are you ordering CTP?',options:[
        {label:'To characterize tissue status when the time window is uncertain and ask whether that information changes reperfusion options.',correct:true},
        {label:'To define the occlusion site and vascular anatomy for thrombectomy planning.'},
        {label:'To exclude hemorrhage and estimate early ischemic change on the noncontrast CT.'}],
        feedback:'CTP characterizes core and hypoperfused tissue when that information may refine treatment selection. It does not reconstruct onset. Some stroke teams incorporate perfusion imaging routinely in late-window evaluation, while current guideline pathways also allow selected patients to be assessed using the clinical syndrome, CT/CTA, and ASPECTS.'}
    }
  },
  c4:{
    availableActions:['nihss','ncct','cta','ctp','reexam'],
    clinicalQuestion:'Does a large established infarct burden make thrombectomy futile, or is there still a reasonable EVT pathway?',
    finalManagementLabel:'Endovascular treatment decision',
    debriefDecisionTitle:'Large-core thrombectomy reasoning',
    activeQuestions:{
      ctp:{prompt:'Why are you ordering CTP?',options:[
        {label:'To characterize core and hypoperfused tissue and see whether that information adds to the EVT discussion.',correct:true},
        {label:'To determine whether the examination localizes to the right hemisphere.'},
        {label:'To identify the occlusion site and vascular anatomy for thrombectomy planning.'}],
        feedback:'CTP can add useful tissue information in a late-window large-core presentation and is incorporated into many stroke-team workflows. It should be interpreted as one part of the treatment-selection picture alongside the examination, CTA, ASPECTS, baseline function, and the rest of the clinical context; a large estimated core does not by itself establish futility.'}
    }
  },
  c5:{
    availableActions:['nihss','ncct','cta','reexam'],
    clinicalQuestion:'Do the crossed cranial-nerve and long-tract findings indicate a posterior-circulation vascular emergency?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Posterior-circulation reperfusion reasoning'
  },
  c6:{
    availableActions:['focused_exam','nihss','ncct','cta','mri','reexam'],
    clinicalQuestion:'Does the whole acute vestibular syndrome fit a peripheral lesion, or is there enough discordance to pursue a central vascular cause?',
    finalManagementLabel:'Acute management decision',
    debriefDecisionTitle:'Using HINTS within the syndrome, not as a shortcut',
    actionPurpose:{nihss:'Quantify deficits captured by the NIHSS while recognizing that the score underrepresents truncal, gait, and ocular-motor abnormalities.'},
    activeQuestions:{
      nihss:{prompt:'What question are you trying to answer?',options:[
        {label:'Which deficits are captured by the NIHSS, and what important findings does it miss?',correct:true},
        {label:'How disabling is the gait or truncal deficit for this patient despite a low score?'},
        {label:'Do the ocular-motor findings form a coherent central or peripheral vestibular pattern?'}],
        feedback:'NIHSS describes some deficits but does not settle an acute vestibular localization. Eye findings, truncal stability, cranial nerves, tempo, and associated symptoms remain essential.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a structural posterior-fossa correlate for the central features that remain unexplained?',correct:true},
        {label:'Is there a vascular lesion on CTA that already explains the posterior-circulation syndrome?'},
        {label:'Has the bedside ocular-motor and gait examination changed on reassessment?'}],
        feedback:'MRI may provide a structural correlate, but bedside findings and imaging should be reconciled rather than treated as competing absolute tests.'}
    }
  },
  c7:{
    availableActions:['collateral','nihss','ncct','cta','mri','reexam'],
    clinicalQuestion:'Is a numerically minor deficit functionally disabling for this patient, and how should that change treatment?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Disability is not the NIHSS score',
    activeQuestions:{
      collateral:{prompt:'What question are you trying to answer?',options:[
        {label:'What does this deficit prevent this patient from doing in his normal life?',correct:true},
        {label:'What was the exact last-known-well and how certain is that history?'},
        {label:'Was there a witnessed seizure or other event that would change the competing diagnosis?'}],
        feedback:'Functional disability is patient-specific. The useful question is what the new deficit prevents the patient from doing—not whether the NIHSS is low or whether a job title automatically determines treatment.'}
    }
  },
  c8:{
    availableActions:['bp','nihss','ncct','cta','reexam'],
    clinicalQuestion:'How should severe hypertension be handled without losing sight of an otherwise time-sensitive reperfusion candidate?',
    finalManagementLabel:'Acute treatment decision',
    debriefDecisionTitle:'Blood pressure as a treatment constraint, not a competing diagnosis'
  },
  c9:{
    availableActions:['bp','ncct','reexam'],
    clinicalQuestion:'Does the presentation represent hemorrhage, and what immediate pathway follows once imaging establishes it?',
    finalManagementLabel:'Immediate management',
    debriefDecisionTitle:'Hemorrhage recognition and acute priorities'
  },
  c10:{
    availableActions:['collateral','seizure_hx','nihss','ncct','cta','eeg','reexam'],
    clinicalQuestion:'Does the trajectory fit a resolving postictal deficit, persistent ischemia, or ongoing ictal activity?',
    finalManagementLabel:'Next management step',
    debriefDecisionTitle:'Serial examination as diagnostic data',
    activeQuestions:{
      eeg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is persistent or recurrent impaired awareness being driven by ongoing ictal activity?',correct:true},
        {label:'Has the focal deficit continued to improve on serial examination, supporting a postictal trajectory?'},
        {label:'Is there a structural or vascular lesion that still needs to be excluded in parallel?'}],
        feedback:'EEG answers an ictal question. It is most useful when impaired awareness or focal deficits remain unexplained or fluctuate in a way that raises concern for ongoing seizure; it does not substitute for structural evaluation when stroke remains plausible.'}
    }
  },
  c11:{
    availableActions:['focused_exam','collateral','mri','mri_tspine','mri_lspine','labs','emg','lp','reexam'],
    clinicalQuestion:'Which neural level—or combination of levels—best explains the bilateral leg weakness, and which test would reduce the remaining localization or etiologic uncertainty?',
    finalInterpretationLabel:'Best current neurologic model',
    finalInterpretationHelp:'A single diagnosis is not required. Choose the model that best represents the current localization and competing processes.',
    finalManagementLabel:'Most useful next direction',
    finalManagementHelp:'Choose the next direction that best addresses the unresolved high-stakes uncertainty.',
    debriefDecisionTitle:'Competing localizations and choosing the next test',
    actionPurpose:{
      focused_exam:'Complete the full neurologic examination first. For bilateral leg weakness, deliberately re-check strength distribution, reflexes, pinprick, vibration, proprioception, sensory level, and sacral findings because those observations discriminate among cord, conus/roots, peripheral nerve, and multifocal disease.',
      mri_tspine:'Does the thoracic abnormality actually match the bedside syndrome, and is there an urgent compressive lesion?',
      mri_lspine:'Is there a conus/cauda or lower structural process that better matches the examination?',
      emg:'Is there a meaningful peripheral neuropathic, radicular, plexus, or myopathic contribution?',
      lp:'If inflammation or infection remains plausible, does CSF provide evidence for that mechanism?'
    },
    activeQuestions:{
      mri_tspine:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there a thoracic cord lesion that anatomically explains the syndrome, and is it compressive?',correct:true},
        {label:'Could a lower conus/cauda process better explain the pattern on examination?'},
        {label:'Is the weakness predominantly peripheral and better addressed with electrodiagnostic testing?'}],
        feedback:'The MRI must be tested against the phenotype. A real thoracic lesion can be incidental, chronic, or only partly explanatory; compression, lesion distribution, tempo, and the examination determine its significance.'},
      mri_lspine:{prompt:'What question are you trying to answer?',options:[
        {label:'Could a conus/cauda or lower structural process explain findings not accounted for by the thoracic lesion?',correct:true},
        {label:'Does the thoracic lesion already provide a complete anatomic explanation for the examination?'},
        {label:'Would electrodiagnostic testing better address a suspected diffuse peripheral process?'}],
        feedback:'Lumbar/conus imaging is useful because the bedside localization remains lower or mixed. The goal is not to find any abnormality; it is to find a lesion that actually accounts for the syndrome and excludes a high-stakes compressive process.'},
      emg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is a peripheral neuropathic, radicular, plexus, or myopathic process contributing to the weakness?',correct:true},
        {label:'Is there a compressive spinal lesion that requires urgent imaging rather than electrodiagnostic characterization?'},
        {label:'Is there an inflammatory or infectious mechanism that would be better tested with CSF?'}],
        feedback:'EMG/NCS tests the peripheral branch of the localization. It can characterize axonal versus demyelinating physiology and patterns such as neuropathy, radiculopathy, plexopathy, or myopathy. Timing matters: an early nondiagnostic study may not yet exclude a clinically plausible peripheral process.'},
      lp:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there CSF evidence supporting an inflammatory or infectious neurologic mechanism?',correct:true},
        {label:'Is there a structural spinal lesion that requires MRI characterization or decompression?'},
        {label:'Is there a peripheral physiologic pattern that would be better tested with EMG/NCS?'}],
        feedback:'LP is primarily an etiologic test here, not a localization test. Cell count, protein, glucose, IgG index/oligoclonal bands, and targeted infectious studies can support or weaken inflammatory or infectious mechanisms, but the result still has to fit the tempo, examination, and MRI.'}
    }
  },
  c12:{
    availableActions:['collateral','attention_exam','focused_exam','eeg','mri','reexam'],
    clinicalQuestion:'Is there a stable focal or ictal neurologic syndrome that needs targeted neurologic testing, or does the pattern cohere as diffuse fluctuating cerebral dysfunction?',
    finalInterpretationLabel:'Syndrome interpretation',
    finalManagementLabel:'What would you do now?',
    debriefDecisionTitle:'When additional neurologic testing would actually change the model',
    activeQuestions:{
      eeg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is the unexplained alteration in awareness persistent or stereotyped enough to suspect ictal activity?',correct:true},
        {label:'Has a persistent focal syndrome emerged that would make structural imaging the higher-yield next test?'},
        {label:'Is the fluctuation tightly linked to systemic illness, medications, sleep, or other delirium precipitants?'}],
        feedback:'EEG is useful when the phenotype creates an ictal question—persistent unexplained impaired awareness, stereotyped episodes, or fluctuations not explained by the systemic course. It is not a routine confirmation test for delirium.'},
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Has a persistent focal syndrome or unexplained trajectory emerged that now warrants structural imaging?',correct:true},
        {label:'Is there a stereotyped or persistent alteration in awareness that would make EEG the higher-yield test?'},
        {label:'Is the examination still nonfocal and the trajectory still explained by systemic delirium precipitants?'}],
        feedback:'MRI should answer a structural question created by the phenotype or trajectory. More testing is not automatically more rigorous.'}
    }
  },
  c13:{
    availableActions:['collateral','fatigability_exam','respiratory_bulbar_exam','achr_musk','rns','reexam'],
    clinicalQuestion:'Is this nonspecific fatigue with dysarthria, or is there objective fatigable weakness that localizes the syndrome to the neuromuscular junction?',
    finalInterpretationLabel:'Best current localization and syndrome',
    finalManagementLabel:'Most important next step',
    debriefDecisionTitle:'Turning "fatigue" into a localizable neurologic finding',
    actionPurpose:{
      fatigability_exam:'The complete neurologic exam is already done. Add sustained upgaze, repeated facial activation, prolonged speech, and repetitive proximal testing because fatigability is syndrome-specific.',
      respiratory_bulbar_exam:'Add neck flexion, speech endurance, cough, secretion handling, swallowing, work of breathing, and respiratory measurements because the syndrome raises a bulbar/respiratory severity question.'
    },
    activeQuestions:{
      achr_musk:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there serologic evidence supporting autoimmune myasthenia gravis?',correct:true},
        {label:'Is there physiologic decrement on repetitive stimulation supporting impaired neuromuscular transmission?'},
        {label:'Is current bulbar or respiratory function worsening enough to change the level of monitoring?'}],
        feedback:'Antibody testing can confirm and phenotype autoimmune MG, but it does not measure current respiratory/bulbar severity and a negative result does not automatically erase a convincing fatigable clinical syndrome.'},
      rns:{prompt:'What question are you trying to answer?',options:[
        {label:'Is there physiologic evidence of impaired neuromuscular transmission?',correct:true},
        {label:'Is there serologic evidence supporting autoimmune MG?'},
        {label:'Is the current bulbar or respiratory weakness severe enough to require escalation?'}],
        feedback:'RNS tests the neuromuscular-junction hypothesis physiologically. Its interpretation should remain anchored to the distribution and reproducibility of weakness on examination.'}
    }
  },
  c14:{
    availableActions:['collateral','attention_exam','focused_exam','mri','eeg','ceeg','reexam'],
    clinicalQuestion:'Is the reduced responsiveness adequately explained by structural disease and edema, or is there ongoing cortical electrical activity that cannot be recognized from the examination alone?',
    finalInterpretationLabel:'Best current neurologic model',
    finalManagementLabel:'Most important next step',
    debriefDecisionTitle:'When an obvious structural abnormality is not the whole explanation',
    activeQuestions:{
      mri:{prompt:'What question are you trying to answer?',options:[
        {label:'Has the structural disease changed enough to explain the new neurologic trajectory?',correct:true},
        {label:'Is there a dynamic cortical process that requires EEG because imaging cannot measure electrical activity?'},
        {label:'Is the current examination and trajectory stable enough that serial bedside reassessment may be more informative than repeat imaging?'}],
        feedback:'Imaging establishes the structural substrate and can reveal progression, hemorrhage, infarction, or mass effect. It cannot determine whether fluctuating cortical electrical activity is simultaneously present.'},
      eeg:{prompt:'What question are you trying to answer?',options:[
        {label:'Is ongoing ictal activity contributing to the fluctuating mental status?',correct:true},
        {label:'Has structural disease progressed enough to explain the neurologic change without an additional ictal process?'},
        {label:'Would a brief study be insufficient because the episodes are intermittent or the initial EEG shows high-risk epileptiform activity?'}],
        feedback:'The phenotype creates an ictal question. A routine EEG can reveal seizures or high-risk epileptiform patterns, but intermittent abnormalities may require longer monitoring.'},
      ceeg:{prompt:'What question are you trying to answer?',options:[
        {label:'What is the ongoing electrographic seizure burden, and does it respond to treatment over time?',correct:true},
        {label:'Has structural imaging shown progression, hemorrhage, or mass effect that requires separate treatment?'},
        {label:'Has the bedside examination normalized enough that ongoing electrographic monitoring would no longer answer a meaningful question?'}],
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
  c11:{tempo:'acute_on_subacute', tempoOptions:['acute_on_subacute','acute','subacute','unclear'], localization:'multifocal_unclear', localizationOptions:['spinal_cord','conus_roots','pns','cortex','multifocal_unclear'], syndromeOptions:['paraparesis_mixed','aca','mimic'], hypotheses:['Spinal cord / conus process','Peripheral neuropathic or neuromuscular process','Cerebral ischemia','Inflammatory or infectious neurologic process','Critical-illness related weakness'], reexam:[
    'On repeat examination he continues to follow commands with both arms. There is now trace hip flexion bilaterally but no reliable ankle movement. Knee reflexes remain reduced and ankle reflexes absent. No definite sensory level is found.',
    'Later, proximal leg movement improves slightly while distal weakness and sensory complaints persist. The examination still does not collapse into a single clean central or peripheral localization.'
  ]},
  c12:{tempo:'acute', localization:'diffuse', localizationOptions:['diffuse','cortex','subcortical','multifocal_unclear'], syndromeOptions:['acute_confusional','mimic','dominant_mca','nondominant_mca'], hypotheses:['Multifactorial delirium','Acute ischemic stroke','Nonconvulsive seizure / status','Medication effect','Other toxic-metabolic encephalopathy'], reexam:[
    'Thirty minutes later she is more attentive and answers orientation questions correctly, though she still loses track during longer tasks. There is no focal motor, language, visual, or sensory deficit.',
    'Later in the afternoon she is again drowsier and inattentive but arouses to voice and remains symmetric on focal neurologic examination.'
  ]},
  c13:{tempo:'acute', localization:'nmj', localizationOptions:['nmj','muscle','brainstem','cortex','pns','multifocal_unclear'], syndromeOptions:['fatigable_bulbar','posterior_brainstem','mimic'], hypotheses:['Neuromuscular-junction disorder','Brainstem or cortical lesion','Myopathy','Medication or toxic-metabolic process','Generalized fatigue without focal neurologic weakness'], reexam:[
    'After several minutes of conversation, dysarthria is more apparent and mild ptosis has returned. After a brief period of rest, both improve partially.',
    'Later examination again shows preserved sensation and reflexes with reproducible facial, bulbar, and proximal fatigability rather than a fixed focal deficit.'
  ]},
  c14:{tempo:'acute', localization:'multifocal_unclear', localizationOptions:['diffuse','cortex','multifocal_unclear'], syndromeOptions:['structural_fluctuating_ams','acute_confusional','mimic'], hypotheses:['Nonconvulsive seizure / status','Vasogenic edema / tumor-related dysfunction','Medication effect','Other toxic-metabolic encephalopathy','Acute ischemic or hemorrhagic event'], reexam:[
    'Ten minutes later he opens his eyes and follows a command with both hands. Several minutes after that he stares, becomes mute, and has a brief subtle right facial twitch before again becoming partially responsive.',
    'The examination continues to fluctuate without a new fixed hemiparesis. This time series increases concern for a dynamic cortical process superimposed on the structural disease.'
  ]}
};

function reasoningFor(c){ return CASE_REASONING[c.id] || {tempo:'unclear', localization:'multifocal_unclear', hypotheses:['Acute ischemic stroke','Seizure/postictal deficit','Toxic-metabolic process','Other neurologic process'], reexam:['No major interval change on repeat examination.']}; }
