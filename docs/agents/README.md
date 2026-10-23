# Multiagent project

Status: foundation only; no autonomous agent runner is installed by these documents.

## Work queue
GitHub Issues are the source of truth. Each issue must identify one owner role, severity, acceptance criteria and test evidence.

## Workflow
Coordinator scopes issue -> Developer opens PR -> QA validates -> CCNA reviewer checks networking semantics -> Human approves merge and deployment.

## First mission
Validate topology editor: used interfaces must be unavailable, links must render between the correct endpoints, and links must be removable. Include regression tests for connecting switches.

## Production safety
Never give an agent Hostinger production credentials. Keep deployments separate from code review. Use least-privilege tokens and explicit environment approval.

## Implementation backlog
1. Inspect existing test/build scripts and deployment configuration.
2. Configure CI using the repository's actual package manager and scripts.
3. Set branch protection and production environment approval in GitHub settings.
4. Connect an agent executor and independent reviewer with limited scopes.
