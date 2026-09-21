# Stroke Code Simulator

Stroke Code Simulator is a lightweight, mobile-first educational web app for neurology trainees. It uses evolving stroke-code presentations to teach real-time neurologic reasoning under uncertainty.

Learners characterize the time course, localize the syndrome, build a working differential, request additional information, repeat the neurologic examination, and update diagnostic probabilities as new data emerge. The central question is not simply “Is this a stroke?” but how the neurologic model changes as the history, examination, imaging, EEG, and clinical trajectory become clearer.

Cases include vascular syndromes and common stroke-code alternatives, including posterior circulation presentations, altered mental status, seizure versus stroke, low-NIHSS but potentially disabling deficits, severe hypertension with neurologic symptoms, and hemorrhage.

## Design principles

- Present observations rather than diagnostic labels.
- Keep the clinical timeline at the center of the interface.
- Treat re-examination as new data.
- Separate stroke probability from treatment eligibility.
- Make diagnostic updating visible without forcing certainty.
- Use neutral debrief language rather than grades or “gotcha” feedback.
- Remain easy to use on a phone and easy to host on GitHub Pages.

## Files

- `index.html` — page shell and accessible dialog/bottom-sheet structure
- `styles.css` — mobile-first responsive layout
- `app.js` — case state, timeline, reasoning updates, navigation, and debrief logic
- `cases.js` — case content and reasoning metadata

## Running locally

Open `index.html` directly in a browser, or serve the folder with any static web server. No build step or package manager is required.

## GitHub Pages

The app uses only relative paths and static HTML/CSS/JavaScript, so it can be deployed directly from the repository root with GitHub Pages.

## Educational use

This project is for education only. It does not replace clinical guidelines, attending supervision, or local stroke protocols.
