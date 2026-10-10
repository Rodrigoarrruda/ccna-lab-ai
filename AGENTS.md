# CCNA Lab AI — Engineering Agent

## Mission
Build a deterministic, pedagogically accurate Cisco CCNA 200-301 lab simulator. Preserve working behavior, avoid regressions, and never claim production readiness without evidence.

## Non-negotiable constraints
- Keep Next.js pinned to 16.3.8 unless a separately approved migration is planned.
- Preserve `next.config.mjs` and `next build --webpack`.
- Keep assessment deterministic. LLM tutor output must never alter grading.
- Provide explicit, labelled local fallback when OpenAI is unavailable.
- Do not commit API keys, .env files, passwords, database dumps, or deployment credentials.
- Match Cisco CLI command modes, syntax, abbreviations, and error semantics as closely as the supported command subset allows.
- Model switch/port/VLAN/trunk/LACP and PC state in a single authoritative engine. UI, topology, ping, and assessment must derive from that state.
- Do not advertise unsupported Cisco IOS capabilities.

## Required development workflow
1. Read the existing code, tests, and current lab specifications.
2. Write an acceptance checklist and identify affected modules.
3. Implement on a feature branch with minimal scoped changes.
4. Add positive, negative, boundary, and regression tests for new behavior.
5. Run `npm ci`, `npm test`, `npx tsc --noEmit`, and `npm run build`.
6. Review UI behavior for the main lab flow: mission, CLI, evaluation, finish, next scenario.
7. Update README, CHANGELOG, TESTES, and project specification when applicable.
8. Open a PR with evidence of checks. Do not merge or deploy if any required check fails.
9. Produce Hostinger ZIP only from an approved commit; omit node_modules, .next, .git, .env* and credentials.

## Architecture targets
- `lib/`: pure network engine, CLI parser, connectivity, scoring, tutor context.
- `app/`: view components and API routes, without duplicate network-state logic.
- `tests/`: deterministic scenarios and regressions.
- `docs/`: exam-domain coverage, architecture decisions, acceptance criteria.

## Release gate
A release is BLOCKED if tests, type checking, Webpack build, secrets scan, or lab acceptance checks fail or were not executed. Record each result explicitly; never infer success.
