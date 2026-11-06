# Local execution record

Date: 6 November 2026. Scope: the initial portfolio implementation in these three repositories.

| Suite | Result |
|---|---|
| Helpdesk domain rules | 9 passed, 0 failed |
| Coursebook domain rules | 9 passed, 0 failed |
| Browser regression suite | 16 passed, 0 failed |

## Environment and commands

Linux, Node.js 24.22.1, Playwright 1.62.1. Browser checks used the Chromium executable distributed by `@sparticuz/chromium` 153.0.0, supplied through `BROWSER_EXECUTABLE`. The usual Playwright browser download was unavailable in this execution environment; this alternative is recorded so the result is reproducible without implying the default download was tested successfully.

```bash
# From the parent folder:
node --test it-helpdesk-demo/tests/*.test.mjs course-management-demo/tests/*.test.mjs
# From qa-testing-portfolio, using the installed Chromium path:
BROWSER_EXECUTABLE=/path/to/chromium npm test
BROWSER_EXECUTABLE=/path/to/chromium npm run screenshots
```

For a normal developer machine, use the standard installation commands in the README. The optional browser path only overrides the executable; the committed checks remain the same.

The suite launched the real local applications and used isolated browser contexts. Desktop screenshots used a 1440 px viewport; mobile screenshots used 390 px. Compressed WebP copies are included in each demo README.

## Limits

This record describes local automated execution, not a third-party certification or an employer assessment. It does not claim production load testing, backend security testing, full accessibility conformance, physical hardware troubleshooting, or Safari/Firefox coverage. GitHub Actions is configured separately; consult its actual run status for CI results.
