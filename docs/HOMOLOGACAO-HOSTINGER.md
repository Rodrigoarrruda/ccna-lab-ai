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

## Diagnóstico dos HTTP 503
As rotas `/api/progress` e `/api/study` retornam HTTP 503 somente para falhas de persistência ou inicialização do MySQL. A resposta inclui um `requestId` para correlação com os logs da aplicação, sem expor o erro bruto.

O log server-side registra somente este formato seguro:

```text
[mysql] route=/api/study stage=save_study request_id=<id> code=ER_ACCESS_DENIED_ERROR errno=1045 sql_state=28000
```

Não são registrados host, usuário, senha, SQL, mensagem de erro, payload ou resposta da OpenAI.

Interpretação operacional dos códigos mais úteis:

| Código | Verificação no hPanel |
|---|---|
| `CONFIG_MISSING` | Alguma das variáveis obrigatórias está vazia ou ausente. |
| `ENOTFOUND`, `ECONNREFUSED`, `ETIMEDOUT` | `MYSQL_HOST`, `MYSQL_PORT` ou acesso de rede incorreto. |
| `ER_ACCESS_DENIED_ERROR` | `MYSQL_USER`, `MYSQL_PASSWORD` ou permissões do usuário. |
| `ER_BAD_DB_ERROR` | `MYSQL_DATABASE` não existe nesse servidor ou o usuário não tem acesso a ela. |
| `ER_TABLEACCESS_DENIED_ERROR` | O usuário conecta, mas não tem permissão para criar/ler/gravar as tabelas do aplicativo. |

## Orientação específica para olive-fox
- `MYSQL_HOST` deve ser o hostname MySQL exibido no hPanel para o banco de homologação. Não use `olive-fox-987195.hostingersite.com`, o domínio público do app, como host do banco. Não substitua o valor por `localhost` sem confirmação explícita do hPanel.
- `MYSQL_DATABASE` deve ser o nome exato do banco MySQL de homologação criado e associado ao usuário configurado. Se o painel mostrar `ccna_teste`, use `ccna_teste`; se mostrar `ccna_lab`, use `ccna_lab`. Não escolha pelo nome da URL.
- `MYSQL_USER` deve ser o usuário MySQL associado a esse mesmo banco, com permissão de criação, leitura e gravação.
- `MYSQL_PORT` deve ser `3306`, salvo se o hPanel informar outra porta.
- `MYSQL_PASSWORD` deve ser preenchida somente no campo secreto do hPanel. Nunca envie o valor no chat, no GitHub, no ZIP ou em logs.

Após salvar as variáveis, reinicie apenas o aplicativo de homologação e execute um GET em `/api/study` e `/api/progress`. Se ainda houver 503, correlacione o `requestId` ao código do log. Não altere variáveis de produção durante esse diagnóstico.

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
