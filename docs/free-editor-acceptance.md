# Laboratório livre — aceitação

Escopo: editor de PCs/switches, portas Ethernet, VLAN/access/trunk e ping L2 por regras.
- [ ] Arrastar e adicionar por toque; selecionar equipamentos e portas; excluir cabos/equipamentos.
- [ ] Rejeitar porta ocupada, equipamento inexistente, self-link, PC-PC e loops (STP não implementado).
- [ ] Topologia e CLI derivam do mesmo estado; VLAN, allowed list e shutdown alteram ping.
- [ ] Salvar/reabrir localmente com validação de formato; sem substituir histórico de questões/missões.
- [ ] Tutor local explica evidências e próxima verificação sem entregar comandos de solução inicialmente.
- [ ] Testes positivo/negativo/limite/regressão, npm ci/test, tsc, webpack, scan de segredos.
- [ ] Chromium mobile/desktop e fluxo de missão existente; capturas inspecionadas.
- [ ] Documentação e PR draft, sem merge/deploy automático.

Limites explícitos: até 8 equipamentos, 4 portas por switch (Gi0/1,2,23,24); PC /24; enlaces entre switches precisam ser trunks configurados em ambas as pontas. Sem roteamento, STP, negociação de cabos ou pacotes reais. Persistência somente neste navegador.
