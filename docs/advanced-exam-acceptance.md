# Aceitação: treino avançado CCNA v1.1

Escopo: lib/exam-advanced.ts, lib/exam.ts, app/page.tsx, CSS e testes de questões.

- [x] 40 questões autorais com cenários, evidências e alternativas plausíveis; pesos 8/8/10/4/6/4 por domínio.
- [x] Treino avançado padrão; revisão de 134 questões preservada e selecionável.
- [x] Histórico preservado; IDs novos; troca de banco limpa resposta e feedback.
- [x] Consistência exige três tentativas e 80% por questão, para todas as questões do objetivo no banco. Não promete aprovação.
- [x] Testes positivos, negativos, limite e regressão; npm ci/test, TypeScript e Webpack.
- [x] Revisão visual das capturas mobile/desktop e fluxo completo do laboratório via Chromium no GitHub Actions. APIs com fixtures; não atesta MySQL da Hostinger.
- [x] Documentação, scan de segredos e PR #17 draft; sem merge/deploy.

Fontes: blueprint Cisco 200-301 v1.1; Cisco Learning performance-based lab items; relatos públicos r/ccna usados qualitativamente, sem questões reais.

Evidência: npm ci/test, npx tsc --noEmit, npm run build (Next 16.3.8 webpack) aprovados; git diff --check sem erros; scan de padrões de tokens/chaves sem achados. UI executada e capturas inspecionadas: run 38110300884, commit 9a0309954e2758852b67e731151cebaa3e0b625e. Ambos os viewports aprovados. Corrigido overflow mobile. Acesso Hostinger indisponível; publicação e integração real de backend pendentes.
