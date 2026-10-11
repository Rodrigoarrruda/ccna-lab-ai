# Roteador no laboratório livre

Escopo: roteador com Gi0/0, Gi0/1 e Gi0/2, IPv4 /24, gateway nos PCs, rotas estáticas /24 e rota padrão. Modelo determinístico, sem protocolos dinâmicos, subinterfaces, NAT, DHCP ou pacotes reais.

- Adicionar, arrastar, conectar, excluir e persistir roteadores.
- Interfaces iniciam em shutdown; configurar por CLI com modos Cisco.
- Mostrar interfaces, rotas conectadas/estáticas e configuração atual.
- Ping entre PCs depende de gateway, VLAN/cabos, interfaces up, rota de ida e volta.
- Rejeitar IP duplicado, máscara não suportada, rede inválida e comandos no modo errado.
- Tutor explica a falha observada sem alterar a configuração.
- Topologias L2 salvas na versão anterior continuam válidas.
- Testes positivos/negativos/limites/regressão e aceitação móvel/desktop.
