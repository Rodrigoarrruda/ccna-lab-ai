# Laboratório livre — aceitação

Escopo: editor de PCs/switches, portas Ethernet, VLAN/access/trunk e ping L2 por regras.
- [x] Arrastar e adicionar por toque; selecionar equipamentos e portas; excluir cabos/equipamentos.
- [x] Rejeitar porta ocupada, equipamento inexistente, self-link, PC-PC e loops (STP não implementado).
- [x] Topologia e CLI derivam do mesmo estado; VLAN, allowed list e shutdown alteram ping.
- [x] Salvar/reabrir localmente com validação de formato; sem substituir histórico de questões/missões.
- [x] Tutor local explica evidências e próxima verificação sem entregar comandos de solução inicialmente.
- [x] Testes positivo/negativo/limite/regressão, npm ci/test, tsc, webpack, scan de segredos.
- [x] Chromium mobile/desktop e fluxo de missão existente; capturas inspecionadas.
- [x] Documentação e PR draft, sem merge/deploy automático.

Limites explícitos: até 8 equipamentos, 4 portas por switch (Gi0/1,2,23,24); PC /24; enlaces entre switches precisam ser trunks configurados em ambas as pontas. Sem roteamento, STP, negociação de cabos ou pacotes reais. Persistência somente neste navegador.

Evidência: npm ci/test, tsc, webpack aprovados localmente; CI run 38112331713 aprovou Chromium mobile/desktop, questões e missão existente. Capturas do editor inspecionadas. Ajuste final de históricos separados por switch e limite de nome VLAN será revalidado pela CI no PR. APIs de missão usam fixtures; não atesta MySQL da Hostinger. Sem merge/deploy.
