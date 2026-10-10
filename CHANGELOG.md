## Próxima versão

- Reposiciona a Home como preparação para o CCNA.
- Adiciona sessão de questões autorais com domínio, dificuldade, correção e explicação.
- Mantém os laboratórios como prática complementar e preserva a avaliação determinística.

# Histórico de versões — CCNA Lab AI

## UX da missão e tutor contextual — 2026-10-10
- Tutor contextual visível junto ao laboratório, com níveis de dica, contexto do prompt e correções pendentes.
- Workspace reorganizado em contexto, console e orientação, com hierarquia visual menos rígida e responsividade preservada.
- Direção inspirada em padrões observados no Packet Tracer, GNS3 e plataformas de trilhas práticas.

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
- Estado determinístico de VLANs, interfaces, trunks e EtherChannel.
- Integração com avaliação e reinício de laboratório.

## Tutor contextual — 2026-10-09
- Dica inicial, dica detalhada e solução com contexto da tentativa.
- Fallback local identificado quando a API da OpenAI não estiver disponível.
- Correção TS5097: imports TypeScript sem extensão `.ts` no código do projeto.

> Histórico resumido das alterações presentes nas versões fornecidas. Datas baseadas nos artefatos desta conversa; não substituem um histórico Git.

## Cisco L2.2 — terminais dos PCs
- Seleção de PC1/PC2 e console independente com ipconfig, ping e help.
- Ping calculado a partir do estado determinístico da rede.

## 2.1 — Finalização de missões
- Painel de resultado após avaliação.
- Finalização condicionada a critérios completos e salvamento confirmado.
- Próxima situação e repetição da missão, com reset de estado.

## 2.2 — Banco de missões L2
- Dois cenários novos com VLANs 30/40 e 50/60, critérios próprios e nomes obrigatórios.
- Progressão do botão Próxima situação percorre agora oito laboratórios.
