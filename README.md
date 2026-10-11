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
