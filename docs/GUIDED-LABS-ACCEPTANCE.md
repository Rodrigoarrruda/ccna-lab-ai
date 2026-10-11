# Laboratórios guiados: critérios de aceitação

Referências visuais fornecidas por Rodrigo: topologia com portas identificadas, CLI junto do diagrama e objetivos verificáveis.

## Escopo desta alteração
- Motor único: distinguir substituir, adicionar e remover VLANs permitidas, inclusive lista vazia após remoção.
- LACP: registrar active/passive e verificar compatibilidade por par de interfaces; não anunciar negociação real.
- Missão de recuperação de trunk que preserva VLANs 10 e 20 ao incluir VLAN 30.
- Roteiros Packet Tracer para objetivos 2.2, 2.4 e 3.3: configurar, verificar e diagnosticar.
- Estado da topologia e conectividade simulada derivados do mesmo motor.

## Aceitação
1. Uma atribuição sem add substitui a lista; add preserva itens; remove não transforma lista vazia em all.
2. Rejeitar VLANs fora de 1–4094 e sintaxe inválida sem modificar estado.
3. Passive/passive não atende LACP; active/passive e active/active atendem quando as demais configurações são compatíveis.
4. Porta down e grupo divergente impedem aprovação e conectividade pelo canal simulado.
5. Soluções e diagnósticos existentes continuam funcionando; pontuação vem do estado final.
6. A nova missão começa incompleta e só passa mantendo as três VLANs solicitadas.
7. Roteiros não afirmam que testes Packet Tracer foram executados pelo aplicativo.

## Módulos afetados
lib/labs.ts, lib/connectivity.ts, app/NetworkTopology.tsx, lib/packet-tracer-labs.ts, testes e documentação.

## Limites
Sem IOS real, pacotes LACP, STP ou rotas OSPF em execução. Rota flutuante é prática externa no Packet Tracer. Nenhuma credencial ou progresso pessoal é alterado por esta mudança.
