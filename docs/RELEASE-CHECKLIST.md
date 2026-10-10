# Release checklist

- [ ] Candidate source imported from the latest confirmed Hostinger deployment.
- [ ] No credentials, environment files, or generated directories committed.
- [ ] Lockfile exists and `npm ci` succeeds.
- [ ] `npm test` passes, including new positive/negative cases.
- [ ] `npx tsc --noEmit` succeeds.
- [ ] `npm run build` invokes `next build --webpack` and succeeds.
- [ ] Browser smoke test: select SW1/SW2 and PC1/PC2; run CLI commands; inspect topology; verify; save; finalize; next mission; reset.
- [ ] Mission-specific connectivity matches VLANs/ports/trunks; no hardcoded VLAN 10 assumption for other missions.
- [ ] Tutor 3 levels and labelled local fallback checked without changing grading.
- [ ] CHANGELOG and test evidence updated.
- [ ] PR reviewed and approved; tagged commit used to generate Hostinger ZIP.
- [ ] Production deployment verified; rollback version recorded.

Release status: BLOCKED until all items are verified.
