# Test cases

Each browser case starts with a clean context and fictional sample data.

| ID | Risk | Steps / input | Expected outcome |
|---|---|---|---|
| HD-01 | Lost ticket | Create a valid ticket; reload | Ticket persists; active count includes it |
| HD-02 | Misleading empty view | Search a nonexistent phrase | No-match message and recovery instruction |
| HD-03 | Unusable resolution | Resolve using `Done` | Change blocked; resolution guidance shown |
| HD-04 | Incorrect history | Resolve with a specific note | Count increments and note appears in history |
| HD-05 | HTML injection | Put an image-like tag in summary | Literal text; no inserted image or handler execution |
| HD-06 | Accidental reset | Open reset; choose keep changes | Dialog closes and current state remains |
| CM-01 | Draft leakage | Change score; save; reload | Draft persists; published average is unchanged |
| CM-02 | Stale publication | Edit score; save; publish | Publishing disabled until save; new snapshot appears |
| CM-03 | Invalid score | Enter 101; try saving | Browser rejects value; old saved value survives reload |
| CM-04 | Wrong period | Select Term 2 | No published report; print unavailable |
| CM-05 | Lost unsaved edits | Edit; select another learner; keep editing | Confirmation appears; original edits remain |
| CM-06 | Vague learning note | Save `Good`; publish | Publication blocked with actionable message |
| UI-01/02 | Mobile overflow | Open each app at 390 × 844 | Page width does not exceed viewport |
| STORE-01/02 | Corrupt persistence | Replace saved JSON with malformed input; reload | Fixtures and visible recovery warning |

## Domain boundary cases

Scores 0 and 100 are accepted; -1, 101, decimal, blank, null and nonnumeric values are rejected. A blank score must not become zero. Record keys differ across both learners and periods. Published data is a deep copy, so later draft edits cannot mutate it. Ticket validation rejects blank summaries, missing requesters and unknown priorities.

## Human review still to perform

Screen-reader announcements, keyboard traversal of complete workflows, real-device behavior, print-preview readability and whether messages make sense to a first-time user. These are not marked passed by automated viewport checks.
