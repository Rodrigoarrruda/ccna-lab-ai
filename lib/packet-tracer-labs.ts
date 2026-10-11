export type PacketTracerLab={objectiveId:string;title:string;goal:string;topology:string;tasks:string[];verification:string[];difficulty:'Básico'|'Intermediário'|'Avançado';format:string};

export const packetTracerLabs:Record<string,PacketTracerLab>={
  '2.2':{objectiveId:'2.2',title:'Trunk: acrescentar sem interromper',goal:'Transportar VLAN 30 preservando as VLANs 10 e 20. CAI NO CCNA.',topology:'PC1 — SW1 Gi0/1; SW1 Gi0/24 — SW2 Gi0/24; SW2 Gi0/1 — PC2. PCs na VLAN 30, rede 192.168.30.0/24.',tasks:['Crie as três VLANs nos dois switches e coloque os PCs em access VLAN 30.','Configure trunk: SW1 permite 10,20,30; SW2 permite 10,20. Registre a falha de ping.','Diagnostique e acrescente a VLAN ausente sem substituir as existentes.','Compare a configuração com uma atribuição sem add e explique o impacto sobre 10 e 20.'],verification:['show vlan brief','show interfaces trunk','Ping PC1 → PC2 após convergência; confirme que 10 e 20 continuam permitidas.'],difficulty:'Avançado',format:'Roteiro Packet Tracer'},
  '2.4':{objectiveId:'2.4',title:'LACP: quem inicia a negociação?',goal:'Diagnosticar passive/passive e validar um Port-channel L2. CAI NO CCNA.',topology:'SW1 Gi0/23 e Gi0/24 ligados às mesmas portas de SW2; Port-channel 1 em trunk.',tasks:['Configure membros compatíveis e mode passive nos dois lados. Observe o resultado.','Altere somente uma ponta para iniciar a negociação LACP.','Configure Port-channel em trunk e verifique quais membros estão agregados.','Desligue um membro e observe a continuidade pelo outro.'],verification:['show etherchannel summary','show interfaces port-channel 1','show interfaces trunk','Diferencie membro configurado de membro efetivamente agregado.'],difficulty:'Avançado',format:'Roteiro Packet Tracer'},
  '3.3':{objectiveId:'3.3',title:'Rota flutuante: backup do OSPF',goal:'Manter OSPF como principal e ativar estática somente após retirada da rota OSPF. CAI NO CCNA: 3.3.d.',topology:'R1 — R2 enlace principal 10.0.12.0/30; R1 — R3 backup 10.0.13.0/30; ambos alcançam 192.168.80.0/24. R3 permanece alcançável.',tasks:['Prepare o enlace principal com OSPF em área única; confirme 192.168.80.0/24 no R1.','Configure no R1 uma estática para o mesmo prefixo via 10.0.13.2 com AD apropriada.','Compare running-config e tabela de rotas antes da falha.','Desligue o enlace principal; aguarde retirada da rota OSPF e confirme a estática.','Restaure o enlace e confirme retorno ao OSPF; explique por que AD 1 e 255 não atendem ao requisito.'],verification:['show ip route 192.168.80.0','show running-config','show ip ospf neighbor','Ping ao host remoto antes/depois da falha; registre AD e próximo salto em cada etapa.'],difficulty:'Avançado',format:'Roteiro Packet Tracer'},
  "4.1": {
    "objectiveId": "4.1",
    "title": "NAT estático e PAT de saída",
    "goal": "Publicar um servidor interno e permitir saída compartilhada.",
    "topology": "R1 entre LAN 192.168.10.0/24 e ISP; PC, Server e nuvem ISP.",
    "tasks": [
      "Configure inside/outside e uma rota default.",
      "Crie NAT estático para o Server e PAT para a LAN.",
      "Teste publicação do Server e navegação de dois PCs."
    ],
    "verification": [
      "show ip nat translations",
      "show ip nat statistics",
      "Confirme que sessões usam portas distintas."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.2": {
    "objectiveId": "4.2",
    "title": "Hierarquia NTP",
    "goal": "Sincronizar R2 e R3 a um servidor de tempo.",
    "topology": "R1 como NTP server lógico; R2 e R3 como clientes.",
    "tasks": [
      "Defina a origem de tempo no R1.",
      "Configure R2/R3 como clientes e aguarde sincronismo.",
      "Compare relógio, associação e stratum."
    ],
    "verification": [
      "show clock detail",
      "show ntp associations",
      "Explique qual dispositivo é a fonte."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.3": {
    "objectiveId": "4.3",
    "title": "DHCP e DNS no campus",
    "goal": "Entregar configuração IP e resolver um nome de intranet.",
    "topology": "R1/DHCP, Server/DNS e duas VLANs de usuários.",
    "tasks": [
      "Crie pools DHCP por VLAN.",
      "Cadastre um registro A no Server.",
      "Teste endereço recebido e resolução por nome."
    ],
    "verification": [
      "ipconfig /all no PC",
      "show ip dhcp binding",
      "nslookup intranet.lab"
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.4": {
    "objectiveId": "4.4",
    "title": "Monitoramento SNMP",
    "goal": "Observar a diferença entre agente e gerente em uma topologia pequena.",
    "topology": "R1 e switch de acesso conectados a um servidor de monitoramento.",
    "tasks": [
      "Ative a configuração SNMP compatível com o exercício.",
      "Gere tráfego e observe contadores.",
      "Documente quais dados exigiriam MIB/OID."
    ],
    "verification": [
      "show snmp",
      "Compare contadores antes/depois",
      "Registre limitações do emulador frente a um NMS real."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.5": {
    "objectiveId": "4.5",
    "title": "Syslog centralizado",
    "goal": "Enviar eventos de interfaces para um servidor de logs.",
    "topology": "R1, SW1 e Server Syslog na mesma rede de gestão.",
    "tasks": [
      "Configure timestamps e host de logging.",
      "Desative/ative uma interface em laboratório.",
      "Correlacione o evento no servidor."
    ],
    "verification": [
      "show logging",
      "Timestamp comum nos dispositivos",
      "Identifique a severidade observada."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.6": {
    "objectiveId": "4.6",
    "title": "DHCP relay entre VLANs",
    "goal": "Provar que clientes de duas VLANs recebem leases de um servidor remoto.",
    "topology": "R1 com subinterfaces, Server DHCP em outra rede e dois PCs.",
    "tasks": [
      "Configure router-on-a-stick.",
      "Use ip helper-address nas interfaces de cliente.",
      "Valide pools separados e gateway correto."
    ],
    "verification": [
      "show ip interface",
      "show ip dhcp binding",
      "PCs recebem redes diferentes."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.7": {
    "objectiveId": "4.7",
    "title": "QoS com congestionamento",
    "goal": "Classificar voz e dados e observar tratamento sob carga.",
    "topology": "R1–R2 com enlace limitado, PC de voz lógico e servidor de dados.",
    "tasks": [
      "Crie classes para tráfego prioritário e best effort.",
      "Aplique uma policy de saída.",
      "Compare contadores com tráfego concorrente."
    ],
    "verification": [
      "show policy-map interface",
      "Registre drops/bytes por classe",
      "Explique policing versus shaping."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.8": {
    "objectiveId": "4.8",
    "title": "Gerenciamento SSH",
    "goal": "Substituir Telnet por SSH em um roteador.",
    "topology": "PC de administração ligado à interface de gestão de R1.",
    "tasks": [
      "Configure hostname, domínio, usuário e chave RSA.",
      "Restrinja VTY a SSH e teste do PC.",
      "Confirme que Telnet não é aceito."
    ],
    "verification": [
      "show ip ssh",
      "show users",
      "Teste SSH e falha de Telnet."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "4.9": {
    "objectiveId": "4.9",
    "title": "Backup TFTP/FTP",
    "goal": "Transferir configuração e validar o backup.",
    "topology": "R1 conectado a Server com serviços TFTP/FTP.",
    "tasks": [
      "Salve running-config em startup-config.",
      "Copie o arquivo ao servidor e confira o nome.",
      "Simule restauração em um dispositivo de laboratório."
    ],
    "verification": [
      "show file systems",
      "Arquivo aparece no serviço",
      "Compare hash/conteúdo quando disponível."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.1": {
    "objectiveId": "5.1",
    "title": "Mapa de ameaças e mitigação",
    "goal": "Relacionar exposição Layer 2 a controles concretos.",
    "topology": "SW1 com portas de usuários, servidor e enlace de gestão.",
    "tasks": [
      "Liste ameaça, vulnerabilidade, exploit e impacto.",
      "Escolha uma mitigação para cada exposição.",
      "Valide o efeito sem interromper o enlace de gestão."
    ],
    "verification": [
      "Tabela de risco preenchida",
      "show port-security",
      "Explique residual risk."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.2": {
    "objectiveId": "5.2",
    "title": "Programa de segurança",
    "goal": "Transformar um cenário de laboratório em controles técnicos e físicos.",
    "topology": "Topologia de acesso com console, gestão e usuários.",
    "tasks": [
      "Defina quem pode acessar console e sala.",
      "Associe treinamento a três riscos observados.",
      "Documente evidência que seria auditada."
    ],
    "verification": [
      "Checklist de conscientização",
      "Checklist de acesso físico",
      "Registre lacunas não simuláveis no Packet Tracer."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.3": {
    "objectiveId": "5.3",
    "title": "Contas e acesso local",
    "goal": "Configurar acesso local individual e verificar privilégios.",
    "topology": "PC de administração ligado ao console/VTY de R1.",
    "tasks": [
      "Crie dois usuários com privilégios distintos.",
      "Configure login local em console/VTY.",
      "Teste acesso privilegiado e não privilegiado."
    ],
    "verification": [
      "show running-config | section username",
      "show privilege",
      "Demonstre que contas são individuais."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.4": {
    "objectiveId": "5.4",
    "title": "Política de credenciais",
    "goal": "Exercitar complexidade, bloqueio e fatores fora do dispositivo.",
    "topology": "R1 de gestão e uma planilha de política de identidade.",
    "tasks": [
      "Defina comprimento e tentativas de bloqueio.",
      "Configure controles suportados pelo IOS do laboratório.",
      "Registre MFA/certificado como controle complementar."
    ],
    "verification": [
      "show login",
      "Política documentada",
      "Liste o que o emulador não representa."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.5": {
    "objectiveId": "5.5",
    "title": "VPN site-to-site",
    "goal": "Criar um túnel lógico entre duas LANs de filiais.",
    "topology": "R1 e R2 com rede transitória e LANs distintas.",
    "tasks": [
      "Defina ACL de tráfego interessante.",
      "Configure parâmetros IPsec compatíveis.",
      "Gere tráfego e compare contadores."
    ],
    "verification": [
      "show crypto isakmp sa",
      "show crypto ipsec sa",
      "Ping entre hosts das filiais."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.6": {
    "objectiveId": "5.6",
    "title": "ACL por cenário",
    "goal": "Permitir suporte e bloquear uma rede de usuários conforme o requisito.",
    "topology": "R1 entre rede de usuários, suporte e servidor.",
    "tasks": [
      "Escreva a política antes da ACL.",
      "Aplique na interface e direção corretas.",
      "Teste permit, deny e deny implícito."
    ],
    "verification": [
      "show access-lists",
      "show ip interface",
      "Cada contador corresponde a um teste."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.7": {
    "objectiveId": "5.7",
    "title": "Proteção da borda Layer 2",
    "goal": "Combinar port security, DHCP snooping e inspeção ARP.",
    "topology": "SW1 com PCs, servidor DHCP e uplink ao R1.",
    "tasks": [
      "Marque uplink como trusted quando apropriado.",
      "Limite MACs nas portas de acesso.",
      "Observe o comportamento de DHCP/ARP inválido."
    ],
    "verification": [
      "show ip dhcp snooping binding",
      "show port-security interface",
      "Documente causa de cada bloqueio."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.8": {
    "objectiveId": "5.8",
    "title": "AAA e fallback local",
    "goal": "Comparar autenticação centralizada e contingência local.",
    "topology": "R1, servidor AAA e PC administrativo.",
    "tasks": [
      "Modele o servidor AAA e o método local de fallback.",
      "Teste sucesso, falha e indisponibilidade.",
      "Separe autenticação, autorização e accounting."
    ],
    "verification": [
      "show aaa servers",
      "show users",
      "Roteiro registra o fallback usado."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.9": {
    "objectiveId": "5.9",
    "title": "Comparar WPA2 e WPA3",
    "goal": "Escolher segurança WLAN conforme compatibilidade e risco.",
    "topology": "AP/WLC lógico, dois clientes e rede de gestão.",
    "tasks": [
      "Crie perfis com políticas distintas se o dispositivo suportar.",
      "Associe clientes e observe autenticação.",
      "Documente trade-off de compatibilidade."
    ],
    "verification": [
      "show wlan summary",
      "Estado de associação",
      "Explique por que SSID oculto não substitui criptografia."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "5.10": {
    "objectiveId": "5.10",
    "title": "WLAN WPA2 PSK",
    "goal": "Configurar uma WLAN segura e encaminhá-la à VLAN correta.",
    "topology": "AP, switch trunk, R1 com subinterface e cliente sem fio.",
    "tasks": [
      "Crie SSID e WPA2 PSK.",
      "Mapeie SSID para a VLAN e configure trunk.",
      "Valide associação, DHCP e gateway."
    ],
    "verification": [
      "show vlan brief",
      "show interfaces trunk",
      "Cliente recebe endereço da VLAN esperada."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.1": {
    "objectiveId": "6.1",
    "title": "Automação idempotente",
    "goal": "Simular mudança em lote com estado esperado e verificação.",
    "topology": "Três switches de acesso com a mesma política de VLAN.",
    "tasks": [
      "Defina estado desejado em uma tabela.",
      "Aplique a mesma mudança nos três dispositivos.",
      "Rode a verificação duas vezes e compare o resultado."
    ],
    "verification": [
      "show vlan brief",
      "Diff esperado versus observado",
      "Explique por que repetição segura importa."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.2": {
    "objectiveId": "6.2",
    "title": "Tradicional versus controller-based",
    "goal": "Comparar configuração local com política centralizada conceitual.",
    "topology": "Dois switches configurados manualmente e um painel de política representado no roteiro.",
    "tasks": [
      "Faça uma alteração local e identifique divergência.",
      "Modele uma intenção única para os três switches.",
      "Liste dependências e fallback do controlador."
    ],
    "verification": [
      "show running-config",
      "Tabela de conformidade",
      "Registre o que é conceito e o que o emulador não implementa."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.3": {
    "objectiveId": "6.3",
    "title": "Underlay e overlay",
    "goal": "Diagnosticar um overlay começando pela conectividade de transporte.",
    "topology": "Dois VTEPs lógicos sobre uma rede IP underlay.",
    "tasks": [
      "Valide rotas e reachability do underlay.",
      "Modele a rede lógica do overlay no roteiro.",
      "Associe control/data plane e APIs ao fluxo."
    ],
    "verification": [
      "show ip route",
      "Ping entre loopbacks",
      "Mapa underlay/overlay preenchido."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.4": {
    "objectiveId": "6.4",
    "title": "AIOps baseado em evidência",
    "goal": "Criar uma linha de base e classificar anomalias de interface.",
    "topology": "R1/R2 com tráfego normal e uma interface com erros simulados.",
    "tasks": [
      "Colete contadores em três momentos.",
      "Classifique tendência versus incidente.",
      "Escreva uma ação sugerida e um guardrail humano."
    ],
    "verification": [
      "show interfaces counters errors",
      "Tabela de baseline",
      "Ação não é aplicada sem validação."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.5": {
    "objectiveId": "6.5",
    "title": "REST/CRUD como roteiro complementar",
    "goal": "Mapear operações REST a recursos de rede sem fingir suporte nativo do Packet Tracer.",
    "topology": "Topologia Packet Tracer para validar o estado; exercício textual de API ao lado.",
    "tasks": [
      "Observe no Packet Tracer o estado que uma API consultaria.",
      "Mapeie GET/POST/PATCH/DELETE para CRUD.",
      "Classifique respostas 2xx, 4xx e 5xx no roteiro."
    ],
    "verification": [
      "Estado CLI documentado",
      "Matriz verbo/recurso/status",
      "Ressalve que API real requer plataforma externa."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.6": {
    "objectiveId": "6.6",
    "title": "Ansible/Terraform como roteiro complementar",
    "goal": "Separar configuração de dispositivos e provisionamento declarativo.",
    "topology": "Topologia pequena no Packet Tracer e inventário/estado em arquivos de exercício.",
    "tasks": [
      "Defina inventário e variáveis para os dispositivos.",
      "Escreva um plano de mudança esperado.",
      "Compare execução repetida e drift conceitual."
    ],
    "verification": [
      "show running-config",
      "Planilha de estado desejado",
      "Packet Tracer valida resultado; Ansible/Terraform exigem ambiente próprio."
    ],
    "difficulty": "Intermediário",
    "format": "Roteiro Packet Tracer"
  },
  "6.7": {
    "objectiveId": "6.7",
    "title": "JSON de inventário e payload",
    "goal": "Ler uma representação JSON de dispositivos e validar tipos.",
    "topology": "Topologia Packet Tracer acompanhada por um inventário JSON.",
    "tasks": [
      "Crie objetos para dispositivos, interfaces e endereços.",
      "Valide chaves, arrays e tipos com um linter externo.",
      "Relacione uma mudança JSON ao estado observado no lab."
    ],
    "verification": [
      "Inventário JSON válido",
      "Correspondência JSON/CLI",
      "Anote campos ausentes e tipos incorretos."
    ],
    "difficulty": "Básico",
    "format": "Roteiro Packet Tracer"
  }
};
