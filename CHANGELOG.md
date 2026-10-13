
## Blueprint e seleção adaptativa — 2026-10-10

- Versiona o blueprint CCNA 200-301 v1.1 com seis domínios e pesos oficiais.
- Entrega o primeiro pacote autoral de estudo para Network Fundamentals, Network Access e IP Connectivity.
- Vincula cada unidade a objetivo, resumo, pontos-chave, erro comum e questão determinística.
- Substitui o fluxo fixo de seis questões por seleção adaptativa persistida localmente.
- Mantém os domínios restantes explícitos como planejados para evitar falsa sensação de cobertura.

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


## Treino avançado CCNA v1.1 (PR draft)

40 cenários autorais em inglês, explicações em português e alternativas plausíveis. Banco avançado padrão; banco de fundamentos (134 itens) preservado no seletor. Pesos por domínio: 8/8/10/4/6/4. Cenários incluem evidências de CLI, VLSM, LPM versus AD, OSPF, LACP, trunk, ACL, DHCP snooping, DAI e REST/JSON. Revisão agora abre o objetivo correspondente em vez de encaminhar qualquer questão para VLAN.

IDs separados preservam o histórico. “Objetivos consistentes neste banco” exige todas as questões do objetivo com pelo menos três tentativas e 80% de acertos; não é indicador validado de prontidão para a prova. Seleção prioriza questões inéditas e depois itens sem consistência. Repetir um item não substitui novos cenários.

Validação: npm ci, npm test, TypeScript e Webpack; testes cobrem gabaritos/distratores, IDs, proporções, objetivo válido, limites de consistência e regressão do banco original. Aceitação em Chromium mobile (390×844) e desktop (1365×900), mais inspeção visual das quatro capturas, aprovadas no GitHub Actions #63 (run 38110300884). scripts/verify-ui.mjs verifica resposta certa/errada, troca de banco, histórico após reload, revisão do objetivo e missão/CLI/avaliação/finalização/próxima situação. O teste usa fixtures nas APIs; não valida MySQL da Hostinger. Overflow mobile encontrado pela checagem foi corrigido. Publicação na Hostinger e integração real com MySQL permanecem pendentes; sem merge/deploy.

Fontes: [Cisco blueprint v1.1](https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf), [Cisco performance-based labs](https://blogs.cisco.com/learning/new-performance-based-lab-exam-items-build-opportunities), [relatos públicos qualitativos](https://www.reddit.com/r/ccna/comments/1kdm0xt/biweekly_rccna_exam_passfail_discussion/). Não usamos questões reais ou vazadas. Não há promessa de equivalência exata em dificuldade nem cobertura de todos os subobjetivos nestes 40 itens.


## Laboratório livre — editor inicial

Nova aba para adicionar e arrastar PCs/switches, criar/excluir cabos por portas, configurar switching via CLI, definir IPv4 dos PCs e salvar/reabrir topologia neste navegador. Até 8 equipamentos, quatro portas por switch (Gi0/1,2,23,24), PCs /24 e enlaces switch-switch em trunk. Estado de rede em lib/free-network.ts; CLI reutiliza lib/labs.ts. Ping percorre os enlaces reais do desenho e respeita VLANs existentes, access/trunk, allowed list e shutdown. Tutor local explica o resultado atual e sugere verificação, sem alterar a configuração.

Rejeita porta ocupada, self-link, PC-PC e loops. Sem STP, roteamento, EtherChannel ou pacotes reais; não é emulação completa do Packet Tracer. A persistência valida versão, equipamentos, IPs, portas, enlaces e configurações antes de reabrir.

Testes em tests/free-network.mjs; aceitação mobile/desktop estendida em scripts/verify-ui.mjs. Resultado da CI registrado no PR; manter draft até todos os checks e inspeção visual.


Correção do editor livre: exclusão junto ao desenho, seleção por toque e cabos ligados a interfaces visíveis e identificadas. Equipamento B não permite selecionar o próprio equipamento A.


### Roteador no laboratório livre
Paleta com roteador de três interfaces Gi0/0–2, IPv4 /24, gateway nos PCs, rotas estáticas /24 e rota padrão. Configuração por CLI com modos Cisco, interfaces em shutdown inicialmente, show ip interface brief, show ip route e show running-config. Ping determinístico verifica VLANs/cabos, gateway, próximo salto e caminhos de ida/volta; tutor lê o mesmo estado. Persistência compatível com topologias L2 anteriores. Limites: 8 equipamentos, 32 rotas por roteador, próximo salto diretamente conectado, uma rota por prefixo, sem ECMP, IPv6, OSPF, NAT, DHCP, subinterfaces ou pacotes reais. A tabela identifica rotas estáticas configuradas; o teste de ping verifica a acessibilidade do próximo salto.
Verificação: tests/free-routing.mjs e aceitação móvel/desktop em scripts/verify-ui.mjs; checklist docs/free-router-acceptance.md.


Seletores de enlace mostram apenas portas livres, limpam a seleção após conectar e indicam Sem portas disponíveis. Excluir cabo/equipamento libera interfaces imediatamente; estado restaurado respeita a ocupação. Verificação unitária e móvel/desktop no checklist docs/free-ports-acceptance.md.



### Retomar trabalho e terminal móvel
Laboratório livre salva automaticamente topologia, configurações, posição, seleção, histórico CLI e rascunho de comando no navegador; sair da aba ou recarregar restaura o trabalho. Migra o salvamento manual anterior; falhas de armazenamento ficam visíveis. O botão Salvar permanece para tentar novamente. Na retomada, o modo CLI volta ao usuário; a configuração é preservada. O terminal móvel é compacto, com modo foco baseado no visualViewport e botão Ocultar teclado. Nenhum estado de avaliação é alterado. QA em viewport reduzido simula espaço disponível, sem comprovar teclado Android real. Checklist docs/autosave-mobile-acceptance.md.


### Área de trabalho integrada
Desktop reúne desenho e configuração/tutor lado a lado; celular alterna Rede, Terminal e Tutor sem desmontar o editor. Zoom de 25% a 200%, Enquadrar toda a rede e rolagem. Drag/drop convertem coordenadas pela escala; cabos permanecem nas interfaces. Inspeção mostra ligações, access VLAN/trunk/allowed list, shutdown e IPv4 diretamente do estado da rede. A visualização não altera configuração ou avaliação. Salvamento automático permanece. Ver rede no terminal móvel retorna ao desenho. Primeira entrega de usabilidade; modos guiados/diagnóstico ampliados e 3D são etapas posteriores. Checklist docs/integrated-workspace-acceptance.md.


## Arraste com zoom reduzido — 2026-10-13

Aceite: ocupar o espaço visível abaixo e à direita com zoom de 33%; manter interfaces e cabos alinhados; recuperar posições além dos limites antigos após recarregar; preservar limites e navegação da página. O canvas acompanha o viewport e as posições salvas, até 3600 × 2400 unidades. O limite de arraste reserva espaço para equipamento, interfaces e cabos. Testes puros cobrem escala, bordas e restauração; aceite de UI cobre arraste vertical com zoom reduzido e recarga, além da regressão do laboratório principal.
