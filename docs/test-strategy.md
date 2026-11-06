# Test strategy

## Purpose

Check that a small support or reporting workflow preserves the user's intended changes, rejects invalid input and explains recoverable failures. Tests run against two standalone demos; no production system is involved.

## Risk order

1. **Wrong published report:** a draft leaking into a family preview could misrepresent a learner's progress.
2. **Lost edits:** switching context should not silently discard a partially edited assessment.
3. **Poor handoff:** a resolved support request without useful context is difficult to investigate later.
4. **Unsafe rendering:** a ticket summary must remain text, including when it resembles HTML.
5. **Persistence failures:** damaged storage should not leave a blank or misleading interface.
6. **Navigation and layout:** filtering, empty states and mobile sizing should remain understandable.

## Layers

Domain tests cover value boundaries, invalid input and immutable records. Browser tests cover event wiring, storage, rendered content and workflow transitions. A human exploratory pass should still check keyboard focus, readable print output, confusing wording and behavior on real devices.

## Entry and exit

Entry: the local demos start, fictional fixtures load and the test environment has Chromium. Automated exit: all defined assertions pass and unexpected failures are investigated. This exit applies only to the portfolio demo; it does not approve production use.

## Intentionally outside scope

Authentication, server authorization, tenant isolation, payments, email/WhatsApp delivery, load testing and real school data. None is implemented by these demos. Security assertions in this suite are narrow input-rendering checks, not a penetration test.
