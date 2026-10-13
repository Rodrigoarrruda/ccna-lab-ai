# CCNA Lab AI — Cisco L2.1

Aplicação educacional Next.js 16.3.8 para prática de configuração Cisco L2, com topologia interativa, console por switch, tutor contextual e avaliação determinística.

## Funcionalidades

- Seleção de SW1/SW2 na topologia e execução de comandos Cisco no console.
- Configuração simulada de VLANs, portas access, trunks e EtherChannel, conforme comandos reconhecidos pelo motor.
- Teste de conectividade **simulada** entre PC1 (SW1 Gi0/1, `192.168.10.11`) e PC2 (SW2 Gi0/1, `192.168.10.12`).
- `ping PC2` no console SW1 e `ping PC1` no console SW2; `show mac address-table` exibe entradas calculadas a partir da topologia.
- Tutor em três níveis (dica inicial, detalhada e solução) com fallback local identificado quando a OpenAI estiver indisponível.
- Avaliação de laboratório baseada em regras, independente do tutor IA.

**Limites:** não há emulação real de Ethernet, ARP, STP, aprendizagem dinâmica de MAC ou negociação LACP; as respostas de ping e a tabela MAC são calculadas pelo estado simulado. Não equivale ao Packet Tracer completo.

## Instalação e deploy na Hostinger

1. Crie uma aplicação Node.js/Next.js no hPanel com Node.js compatível (`>=22.13.0`).
2. Extraia os arquivos do ZIP na raiz do projeto e instale dependências com `npm ci`.
3. Configure as variáveis de ambiente **no painel da hospedagem**, nunca no ZIP ou no código publicado. Use `.env.example` apenas como lista de nomes.
4. Execute `npm test` e `npm run build` (que utiliza `next build --webpack`).
5. Inicie com `npm start`; mantenha a porta `PORT` gerenciada pela Hostinger e HTTPS habilitado.
6. Confirme autenticação, banco MySQL, persistência e funcionamento do tutor e da CLI.

### Variáveis de ambiente

| Nome | Finalidade |
|---|---|
| `APP_PASSWORD` | Senha de acesso exclusiva, preferencialmente com 16+ caracteres |
| `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` | Conexão com banco MySQL |
| `OPENAI_API_KEY` | Opcional; habilita tutor IA quando disponível |
| `OPENAI_MODEL` | Modelo do tutor; exemplo em `.env.example` |

Sem chave OpenAI, o tutor deve responder com fallback local identificado. As credenciais permanecem exclusivamente no servidor. As tabelas MySQL são criadas no primeiro acesso conforme implementação atual. O banco D1 do projeto original **não é migrado automaticamente**.

## Comandos de desenvolvimento

```bash
npm ci
npm test
npm run build
npm start
```

## Verificação rápida

1. Abra um lab e selecione SW1; execute `enable` e `configure terminal` e confira a mudança do prompt.
2. Configure VLAN 10, `Gi0/1` como access VLAN 10 e `Gi0/24` como trunk com VLAN 10 permitida **em SW1 e SW2**.
3. No console SW1, execute `ping PC2`: a conectividade simulada deverá funcionar.
4. Remova VLAN 10 da lista permitida em uma ponta do trunk e repita o ping: deverá falhar.
5. Consulte `show mac address-table`; confira a representação simulada.
6. Teste os três níveis do tutor, a correção por critérios, reset e persistência após recarregar.

Consulte [TESTES.md](TESTES.md) para roteiro completo e [CHANGELOG.md](CHANGELOG.md) para histórico.

## Compatibilidade e ressalva de homologação

`next.config.mjs` foi preservado, a dependência Next.js está fixada em `16.3.8` e o script de build usa `next build --webpack`. A documentação não comprova homologação em produção: execute o build no ambiente de destino antes de publicar.

## Terminais dos PCs (Cisco L2.2)
Na topologia, selecione PC1 ou PC2. Comandos disponíveis: ipconfig, ping PC1, ping PC2, ping 192.168.10.11, ping 192.168.10.12 e help. IPs fixos. Simulação por regras, sem pacotes reais. Comandos de PC não afetam a nota.

## Fluxo de finalização (2.1)
Após configurar, clique em **Verificar e salvar**. Se todos os critérios forem atendidos e o servidor confirmar o registro, **Finalizar laboratório** fica disponível. Depois, **Iniciar próxima situação** abre o laboratório seguinte e limpa o estado da tentativa. Se o salvamento falhar, a finalização não é liberada.


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
