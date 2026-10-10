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
