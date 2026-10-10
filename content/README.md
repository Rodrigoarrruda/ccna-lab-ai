# Pipeline de conteúdo CCNA

Este diretório separa **geração**, **validação** e **publicação**. O objetivo é aumentar o banco continuamente sem permitir que perguntas repetidas ou malformadas cheguem ao aplicativo.

## Fluxo aprovado

1. O gerador recebe um objetivo do blueprint **ccna-200-301-v1.1** e produz um arquivo JSON de rascunho no contrato de **content/pipeline.ts**.
2. Execute **npm run content:validate -- caminho/para/lote.json**. O validador compara o lote com o blueprint e com o banco atual.
3. Corrija os erros e faça revisão humana: precisão técnica, dificuldade, clareza, distribuição das respostas e referência de origem.
4. O lote entra em uma branch e em um PR. O pipeline executa os testes; só o merge em **main** atualiza o staging.
5. Depois de observar métricas de acerto por objetivo, erros recorrentes e duplicatas, prepare o próximo lote.

## Regras de conteúdo

- Usar o blueprint Cisco e material próprio, autorizado ou devidamente licenciado como fonte.
- Não copiar questões reais da certificação, dumps, material vazado ou conteúdo sem licença.
- Cada questão deve declarar objetivo, dificuldade, explicação, referência de origem e data de geração.
- Cada questão precisa ter quatro alternativas distintas e a resposta correta deve aparecer entre elas.
- O lote é rejeitado se repetir IDs ou enunciados existentes, apontar para objetivo inexistente, incluir campos com aparência de segredo ou concentrar todas as respostas na mesma posição.
- O gerador não publica diretamente, não grava no MySQL e não altera produção.

## Operação recomendada

A geração automática pode ser conectada depois a um provedor autorizado, mas deve produzir apenas rascunhos JSON. O contrato e o validador permanecem independentes do provedor. Assim, trocar o modelo ou a fonte não muda o aplicativo nem cria um caminho de publicação sem revisão.

A próxima evolução é adicionar um painel interno de revisão com estados **draft**, **approved** e **rejected**; até lá, o PR é a barreira de aprovação.
