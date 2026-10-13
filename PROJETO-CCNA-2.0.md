# Projeto CCNA Lab AI 2.0 — simulador orientado à certificação

## Problema observado
A missão era apresentada como uma frase curta, com instruções dispersas, console grande e critérios pouco contextualizados. O aluno precisava inferir o cenário e o que seria avaliado.

## Objetivo
Transformar cada laboratório em uma tarefa de troubleshooting/configuração baseada em cenário, topologia, requisitos verificáveis e evidências CLI. O simulador não afirma reproduzir fielmente o Cisco IOS ou o Packet Tracer.

## Entregue nesta atualização
- Cabeçalho de missão com cenário, objetivo, contagem dinâmica de critérios e duração estimada.
- Substituição de “Configuração esperada” por “Critérios de aprovação”.
- Atalhos iniciais Cisco IOS: `en`, `conf t`, `int gi0/1`, `sh vlan br`, `sh int tr`, `sh run`, `sh ip int br`, `sh etherchannel sum`, `sw mo acc`, `sw mo tr`, `sw acc vlan N`.
- Preservação do motor determinístico e da API existente.

## Critérios de aceite da atualização
1. Ao abrir o laboratório, o cenário e a missão aparecem acima da topologia e do console.
2. Os critérios concluídos atualizam ao executar comandos.
3. Comandos completos e abreviados equivalentes produzem o mesmo estado.
4. Abreviações desconhecidas continuam rejeitadas; não há execução por aproximação insegura.
5. `npm test` e `npm run build` precisam passar antes da publicação.

## Roadmap priorizado
1. **CLI mais fiel:** parser de abreviações únicas por modo, `?` contextual, Tab, histórico ↑/↓, Ctrl+C; testes de ambiguidade.
2. **Cenários avaliativos:** banco de missões com enunciado, topologia, restrições, estado inicial, evidências esperadas e rubrica. Separar modo estudo de modo prova.
3. **Simulação L2:** aprendizado MAC dinâmico e testes de conectividade por caminho; depois STP e LACP. Não confundir estado administrativo com link operacional.

## Riscos e limites
- A prova CCNA 200-301 inclui conteúdos além de VLAN/trunk: roteamento, serviços IP, segurança, automação e fundamentos. Esta entrega não cobre a matriz completa.
- Não foi implementado um parser IOS genérico: os atalhos incluídos são explicitamente suportados.
- A validação do build de produção depende de dependências instaladas e ambiente compatível.


## Reposicionamento: CCNA Exam Coach

A interface passa a priorizar preparação para a certificação, sem tentar substituir o Packet Tracer.

- Banco inicial de questões autorais por domínio, assunto e dificuldade.
- Correção determinística da alternativa escolhida e explicação pedagógica.
- Sessão separada da avaliação dos laboratórios: questões não alteram a nota do CLI.
- Laboratório recomendado quando a questão exigir prática de configuração.
- Não reproduzir questões confidenciais, vazadas ou atribuídas à prova sem fonte pública verificável.

### Critérios de aceite

1. O aluno consegue iniciar uma sessão de questões diretamente pela Home.
2. Cada questão informa domínio, assunto e dificuldade.
3. A resposta correta e a explicação aparecem somente após a submissão.
4. Questões autorais não alteram histórico ou pontuação dos laboratórios.
5. A navegação continua responsiva e o build Webpack permanece preservado.

## Blueprint e pacote de estudo — v1.1

O conteúdo de preparação passou a usar `lib/blueprint.ts` como fonte versionada do CCNA 200-301 v1.1. Os seis domínios e seus pesos ficam registrados, enquanto o pacote inicial libera conteúdo estudável para:

- **1.0 Network Fundamentals — 20%:** objetivos 1.1 a 1.13.
- **2.0 Network Access — 20%:** objetivos 2.1 a 2.9.
- **3.0 IP Connectivity — 25%:** objetivos 3.1 a 3.5.

Cada unidade em `lib/study-content.ts` contém resumo, pontos-chave, erro comum e uma questão autoral determinística vinculada ao objetivo. Os domínios 4.0, 5.0 e 6.0 permanecem versionados como planejados, sem fingir cobertura que ainda não foi produzida.

A sessão de questões deixa de percorrer um banco fixo de seis itens. O progresso local registra acertos, erros e última resposta por questão; a seleção prioriza itens inéditos, depois itens errados, depois baixa precisão e, por fim, itens já dominados. Isso mantém o avaliador determinístico e não depende da disponibilidade do MySQL.

### Limites pedagógicos

O blueprint organiza o estudo, mas não autoriza reproduzir questões confidenciais ou vazadas da certificação. O pacote é autoral e deve crescer por objetivo, com revisão técnica e questões de cenários antes de ser tratado como preparação completa para a prova.


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
