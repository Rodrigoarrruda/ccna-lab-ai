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
