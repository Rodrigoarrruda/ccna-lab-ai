# CCNA Lab AI — bootstrap

Status: repository initialized for engineering governance. **The application source is not yet imported.**

## Source of truth
The latest available candidate is the CCNA Lab AI 2.2 bank-of-missions ZIP. Do not treat this as production-confirmed until the Hostinger version is compared.

## Import checklist
1. Extract the candidate ZIP locally. Upload the **extracted files and folders** (not the ZIP) to the repository root, preserving paths: app/, lib/, tests/, public/, package.json, package-lock.json, tsconfig.json, next.config.mjs, proxy.ts, and documentation.
2. Keep AGENTS.md and .github/workflows/quality.yml intact.
3. Never upload .env files, credentials, node_modules, .next, or database dumps.
4. Verify the workflow run on GitHub Actions. Correct all failures before deployment.
5. Confirm the deployed Hostinger version matches the selected commit.

## Release definition
- Unit and regression tests pass.
- TypeScript passes.
- Next.js Webpack production build passes.
- UI acceptance scenarios pass.
- No secrets are committed.
- Deployment approved explicitly.

See AGENTS.md for permanent engineering rules.
