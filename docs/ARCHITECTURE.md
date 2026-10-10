# Architecture — CCNA Lab AI

## Design principle
The network-state engine is authoritative. The topology, CLI, connectivity, evaluation, and tutor must read the same state; no UI-side duplicated networking rules.

## Modules
- `lib/labs.ts`: current deterministic Cisco IOS subset and grading; refactor only with characterization tests.
- `lib/connectivity.ts`: derive PC-to-PC connectivity from VLAN/access/trunk/link state.
- `lib/tutor.ts`: contextual hints and explicit local fallback; must not change grading.
- `app/page.tsx`: presentation and lab lifecycle. Extract components after baseline CI passes.
- `app/api/*`: server-only persistence and AI access.

## Future separation
1. CLI lexer/parser: resolve full and unambiguous abbreviated commands per mode; distinguish invalid syntax, wrong mode, and unsupported commands.
2. State transitions: pure command execution, immutable inputs, explicit errors.
3. Network topology: nodes, links, switch ports, host IP/MAC, VLAN membership, trunk propagation.
4. Assessment: criteria evaluate final state only; tutor is advisory.
5. Mission catalog: typed mission definitions, expected topology and acceptance checks.
6. UI: scenario header, topology, terminal, tutor, submit/finish/next.

## Guardrails
- Cisco IOS is simulated, not emulated. Document unsupported protocols.
- No client-side OpenAI API key or DB secrets.
- Never treat an HTTP 200 or an old unit-test pass as proof of deployment readiness.
- Do not add L3 until L2 mission completion, ping, and topology agree on the same model.

## Known gaps to verify
- New VLAN 30/40 and 50/60 scenarios have grading checks but host connectivity may still be hardcoded to VLAN 10.
- CLI help and command abbreviations are incomplete.
- End-to-end lab completion and persistence require browser tests.
- GitHub CI must pass on the imported source before any release.
