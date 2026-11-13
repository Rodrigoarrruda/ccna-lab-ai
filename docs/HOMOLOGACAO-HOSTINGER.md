# Ambiente de homologação — CCNA Lab AI

## Objetivo
Manter a produção existente intocada enquanto validamos releases da branch de desenvolvimento. O ambiente de homologação **ainda precisa ser criado na Hostinger**.

## Isolamento obrigatório
- Aplicativo Node.js separado, com domínio/subdomínio distinto (ex.: `teste.seudominio`) ou URL temporária exclusiva.
- Banco MySQL **exclusivo de homologação**. Nunca apontar staging para `MYSQL_DATABASE` de produção.
- Credenciais do ambiente configuradas exclusivamente no painel da Hostinger, nunca no repositório ou no ChatGPT.
- Variáveis opcionais da OpenAI somente no backend; permitir tutor local quando ausentes.
- Restringir acesso ao staging por senha/autenticação ou outra proteção apropriada; evitar exposição e indexação pública.
- Implantação inicial manual, a partir do commit validado; **sem deploy automático para produção**.
- Conservar versão atualmente publicada e cópia de segurança para rollback.

## Build
Versões exigidas: Node >=22.13.0 e Next.js 16.3.8.
```sh
npm ci
npm test
npx tsc --noEmit
npm run build
npm run start
```
O script `build` executa `next build --webpack`.

## Variáveis de banco (apenas exemplos de nomes)
`MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`.
Configure valores diferentes daqueles de produção.

## Aceitação funcional
1. Abrir tela, navegar entre missões e selecionar SW1/SW2 e PC1/PC2.
2. Configurar VLANs/access/trunk e confirmar estado e falha/êxito de ping correspondente.
3. Validar tentativa incompleta (não pode finalizar).
4. Validar tentativa completa: salvar, finalizar, abrir próxima missão e confirmar reset do estado.
5. Recarregar e conferir histórico persistido no banco de staging.
6. Verificar tutor local e IA com fallback devidamente identificado.
7. Revisar layout e usabilidade em desktop e mobile.

## Critérios para publicar em produção
- GitHub Actions verde no commit exato.
- Evidências do roteiro anterior na URL de staging.
- PR revisada e aprovada.
- Backup e rollback preparados.
- Autorização explícita para atualização da produção.

## Pendente
Precisamos identificar se o plano Hostinger permite um segundo aplicativo Node.js e um banco independente, e qual URL/subdomínio será utilizado.
