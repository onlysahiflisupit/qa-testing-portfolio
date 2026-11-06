# QA portfolio — test the workflow, explain the risk

A practical testing portfolio covering a helpdesk queue and a course reporting demo. The focus is on reproducible steps, useful assertions and clearly stated limits.

**Portfolio owner: Only Sahifli Supit · Manual test design · JavaScript · Playwright · Node.js**

## Start here

| Artifact | What to review |
|---|---|
| [Test strategy](docs/test-strategy.md) | Scope, priorities and what a passing result means |
| [Test cases](docs/test-cases.md) | Inputs, steps and expected behavior |
| [Issue investigation](docs/bug-report-001.md) | Unsaved-assessment navigation finding and regression coverage |
| [Execution record](reports/execution.md) | Commands actually run, environment and limitations |
| [Browser tests](tests/browser.test.mjs) | Automated checks against working demos |
| [AI evaluation starter](ai-evaluation/README.md) | Rubric and original practice examples; not an employer assessment |

## Run the checks

Clone the three repositories into the same parent folder:

```bash
git clone https://github.com/onlysahiflisupit/it-helpdesk-demo.git
git clone https://github.com/onlysahiflisupit/course-management-demo.git
git clone https://github.com/onlysahiflisupit/qa-testing-portfolio.git
cd qa-testing-portfolio
npm ci
npx playwright install chromium
npm test
```

Use Node.js 22 or later. Tests start temporary servers on available loopback ports and use isolated browser contexts. They do not touch a live client site or require credentials. On Linux, browser system dependencies may require `npx playwright install --with-deps chromium`.

Run the domain tests from either demo with `npm test`. Run `npm run screenshots` here to capture desktop and mobile views into the demos' `docs/` folders.

## What the suite protects

- Requests persist after reload and filters handle empty results.
- A ticket cannot be resolved with an unhelpfully short note.
- User-entered markup is displayed as text.
- Assessment drafts cannot alter an already published report.
- Invalid grades are rejected; learners and terms stay separate.
- Unsaved edits require an explicit decision before navigation.
- Corrupt stored data produces a visible recovery message.
- Both interfaces fit a 390 px viewport without horizontal page overflow.

## Read results with their limits

These are portfolio exercises, not customer acceptance results or professional employment history. Automated execution is distinct from a human exploratory review. A viewport check does not establish accessibility compliance. The demos intentionally have no production login or backend, so this suite does not establish authentication, tenant isolation or database security.

[GitHub profile](https://github.com/onlysahiflisupit)
