# QA-001 — switching learners could discard an unsaved assessment

**Context:** source-inspection finding during development of this portfolio demo.  
**Affected area:** Coursebook assessment form.  
**Severity:** Medium in this local exercise; impact would depend on workload in a real system.  
**Priority:** High for the demo's core editing workflow.  
**Resolution:** navigation now requires a discard decision while the form is dirty.

## Preconditions

Open Coursebook with sample data. Avery Tan / Term 1 is selected.

## Reproduction of the earlier behavior

1. Change Vocabulary from 65 to 99.
2. Do not save.
3. Select Jamie Noor.
4. Return to Avery Tan.

The earlier source rendered the new learner immediately and rebuilt the form from the saved record. The unsaved 99 was discarded. This finding was identified by reading the event handler; it is not presented as an independently observed production incident.

## Expected behavior

Before changing context, show a choice to keep editing or discard changes. Keeping the edits should leave Avery selected and retain the unsaved value. Discarding should continue to the requested learner or term.

## Fix

Track whether the form has unsaved edits and defer navigation. A modal confirmation either cancels the navigation or applies it after an explicit discard. Publication remains disabled until the edited form is saved.

## Regression evidence

`CM-05` checks that the confirmation appears and that choosing Keep editing preserves the value and learner. The execution record documents whether that automation has run. The repository does not manufacture a historical customer ticket or backdated commit to represent this finding.
