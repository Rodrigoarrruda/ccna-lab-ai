# Testes — CCNA Lab AI Cisco L2.1

## 1. Testes automatizados

Na raiz do projeto:

```bash
npm ci
npm test
npm run build
```

**Aceite:** todos os testes passam e o build Next.js termina sem erros de TypeScript. Avisos de fallback SWC/WASM, por si só, não equivalem a falha; avalie o código de saída do processo.

## 2. CLI e topologia (manual)

- Selecionar SW1 e SW2 individualmente; confirmar que o prompt acompanha o dispositivo e o modo.
- Em cada switch, executar os comandos abaixo e verificar o estado na interface:

```text
enable
configure terminal
vlan 10
exit
interface gi0/1
switchport access vlan 10
exit
interface gi0/24
switchport mode trunk
switchport trunk allowed vlan 10,20
end
```

- No SW1, executar `ping PC2`; esperar sucesso **simulado**.
- No SW2, executar `ping PC1`; esperar sucesso **simulado**.
- Executar `show mac address-table`; conferir entradas coerentes com a topologia.
- Em SW2, executar `configure terminal`, `interface gi0/24`, `switchport trunk allowed vlan 20`; no SW1, repetir `ping PC2`; esperar falha por VLAN 10 não permitida.
- Desligar uma porta de acesso usada e verificar que o ping falha; restaurar configuração e verificar retorno da conectividade.
- Reiniciar o laboratório e conferir retorno ao estado inicial.

## 3. Avaliação e tutor (manual)

- Conferir critérios de correção antes e depois da configuração: somente o estado determinístico deve determinar a pontuação.
- Solicitar dica inicial, dica detalhada e solução.
- Sem `OPENAI_API_KEY`, conferir que a resposta do tutor é identificada como **local**; o aplicativo não deve exibir resposta local como se fosse da OpenAI.
- Se a OpenAI falhar, conferir que a avaliação continua funcional.

## 4. Hostinger e segurança (manual)

- Confirmar `APP_PASSWORD` incorreta bloqueando aplicação e API.
- Salvar tentativa, recarregar página e verificar histórico no MySQL.
- Confirmar que `.env` e credenciais não estão presentes no pacote publicado.
- Confirmar acesso via HTTPS e execução do comando `npm run build` (`next build --webpack`).

## 5. Limites dos testes

O motor não encaminha quadros Ethernet reais nem executa ARP, STP ou negociação LACP. Ping e tabela MAC são representações didáticas. Testes automatizados não substituem testes de navegação e deploy na Hostinger.

## Teste manual L2.2
1. Selecione PC1 e execute ipconfig e ping PC2; sem configuração adequada, deve falhar.
2. Configure VLAN 10 nos dois switches, Gi0/1 access VLAN 10 em ambos, e Gi0/24 trunk com VLAN 10 permitida.
3. Execute ping PC2 novamente e confirme sucesso.
4. Desative Gi0/24 e confirme falha; alterne entre SW1, SW2, PC1 e PC2 sem perder a configuração.

## Fluxo de conclusão
1. Abra um laboratório e clique em Verificar e salvar após executar comandos.
2. Com critérios pendentes, confirme que Finalizar laboratório está bloqueado.
3. Complete todos os critérios e salve; confirme que Finalizar laboratório é habilitado.
4. Finalize e selecione Iniciar próxima situação; confira que o título, os comandos e o estado foram reiniciados.
5. Simule falha no endpoint de progresso; confirme que o laboratório não pode ser finalizado sem persistência.

## Banco de missões 2.2
Execute `node --experimental-strip-types tests/mission-bank.mjs`. Confirme que as soluções de referência aprovam ambos os switches e que configurações parciais não são aprovadas.

## 6. UX da missão e tutor contextual (manual)

- Abrir Laboratórios e confirmar três zonas visíveis no desktop: missão/topologia, console e Tutor contextual.
- Confirmar que o tutor permanece visível sem clicar em um botão escondido no fim da página.
- Alternar Dica inicial, Dica detalhada e Solução; confirmar que o nível selecionado aparece ativo.
- Enviar uma pergunta e confirmar que a resposta é identificada como local ou generativa sem alterar a nota.
- Reduzir a janela para celular; confirmar que as zonas passam a uma coluna, o console continua utilizável e o tutor permanece acessível.
