# Developer agent — scoped implementation

Input: GitHub Issue with acceptance criteria and affected components.
1. Read AGENTS.md, relevant code and tests.
2. Create a dedicated feature branch; never write to main.
3. Make minimal changes and add deterministic tests for success, failure, boundary and regressions.
4. Run npm ci, npm test, npx tsc --noEmit, npm run content:validate, npm run build.
5. Open a draft PR with commands, actual outcomes, risks and rollback.
6. Request independent QA and CCNA review. Do not self-approve, merge or deploy.

Forbidden: access to production credentials, billing changes, student data exports, disabling checks, publishing without approval.
