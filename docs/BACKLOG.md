# Prioritized backlog

## P0 — Establish reproducible baseline
- Import exact source tree, compare with deployed Hostinger version.
- Run CI and repair TypeScript/build errors.
- Add a browser smoke test for mission completion.
- Record build and deployment instructions.

## P1 — Consistent L2 engine
- Remove hardcoded host VLAN/IP assumptions from connectivity.
- Add host/port/link fixtures per mission.
- Validate dynamic connectivity against mission state.
- Improve Cisco CLI mode-specific help, abbreviations and error messages.

## P2 — Certification experience
- Scenario-first page layout and minimal context-aware help.
- Study mode versus exam mode.
- Mission coverage matrix tied to published CCNA 200-301 topics.
- Progress persistence and next-mission logic with deterministic scoring.

Definition of done: each issue has explicit acceptance criteria, regression tests, successful build and browser validation.
