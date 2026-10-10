# Histórico de versões — CCNA Lab AI

## Diagnóstico MySQL no staging — 2026-10-10
- Rotas `/api/progress` e `/api/study` passaram a separar validação de entrada de falhas de persistência.
- Falhas de banco registram apenas rota, etapa, request ID e códigos técnicos seguros, sem credenciais, SQL ou mensagens de erro.
- Orientação de homologação documenta a diferença entre o domínio do app, `MYSQL_HOST` e os bancos `ccna_teste`/`ccna_lab`.

## Cisco L2.1 — 2026-10-09
- Conectividade simulada PC1 ↔ PC2, condicionada a portas access, VLANs existentes e trunk com VLAN permitida nas duas pontas.
- Comandos de ping simulado e tabela MAC calculada a partir da topologia.
- Documentação de implantação, testes e limitações atualizada.

## Cisco L2 — 2026-10-09
- Modo laboratório com topologia visual, seleção de switches e console CLI.
- Estado determinístico de VLANs, portas, trunks e EtherChannel.
- Integração com avaliação e reinício de laboratório.

## Tutor contextual — 2026-10-09
- Dica inicial, dica detalhada e solução com contexto da tentativa.
- Fallback local identificado quando a API da OpenAI não estiver disponível.
- Correção TS5097: imports TypeScript sem extensão `.ts` no código do projeto.

> Histórico resumido das alterações presentes nas versões fornecidas. Datas baseadas nos artefatos desta conversa; não substituem um histórico Git.

## Cisco L2.2 — terminais dos PCs
Na topologia, selecione PC1 ou PC2. Comandos disponíveis: ipconfig, ping PC1, ping PC2, ping 192.168.10.11, ping 192.168.10.12 e help. IPs fixos. Comandos de PC não afetam a nota.

## Fluxo de finalização (2.1)
Após configurar, clique em **Verificar e salvar**. Se todos os critérios forem atendidos e o servidor confirmar o registro, **Finalizar laboratório** fica disponível. Depois, **Iniciar próxima situação** abre o laboratório seguinte e limpa o estado da tentativa. Se o salvamento falhar, a finalização não é liberada.

## Banco de missões 2.2
- Dois cenários novos com VLANs 30/40 e 50/60, critérios próprios e nomes obrigatórios.
- Progressão do botão Próxima situação percorre agora oito laboratórios.
