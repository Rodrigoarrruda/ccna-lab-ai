export type BlueprintObjective = {id:string,title:string,items:string[]};
export type BlueprintDomain = {id:string,title:string,weight:number,objectives:BlueprintObjective[],contentStatus:'available'|'planned'};
export type Blueprint = {id:string,exam:string,version:string,validThrough:string,sourceUrl:string,domains:BlueprintDomain[]};

export const ccnaBlueprintV11: Blueprint = {
  id:'ccna-200-301-v1.1',
  exam:'200-301',
  version:'v1.1',
  validThrough:'2027-02-02',
  sourceUrl:'https://learningcontent.cisco.com/documents/marketing/exam-topics/200-301-CCNA-v1.1.pdf',
  domains:[
    {id:'1.0',title:'Network Fundamentals',weight:20,contentStatus:'available',objectives:[
      {id:'1.1',title:'Função dos componentes de rede',items:['Roteadores','Switches Layer 2 e Layer 3','Firewalls de próxima geração e IPS','Access points','Controladoras','Endpoints','Servidores','PoE']},
      {id:'1.2',title:'Arquiteturas de topologia',items:['Dois níveis','Três níveis','Spine-leaf','WAN','SOHO','On-premises e cloud']},
      {id:'1.3',title:'Interfaces físicas e cabeamento',items:['Fibra monomodo','Fibra multimodo','Cobre','Meio compartilhado Ethernet','Conexão ponto a ponto']},
      {id:'1.4',title:'Problemas de interface e cabo',items:['Colisões','Erros','Duplex incompatível','Velocidade incompatível']},
      {id:'1.5',title:'TCP versus UDP',items:['Confiabilidade','Ordenação','Controle de conexão','Uso de datagramas']},
      {id:'1.6',title:'Endereçamento e subnetting IPv4',items:['Configuração','Verificação','Máscara','Hosts e broadcast']},
      {id:'1.7',title:'Endereçamento IPv4 privado',items:['Faixa 10.0.0.0/8','Faixa 172.16.0.0/12','Faixa 192.168.0.0/16']},
      {id:'1.8',title:'Endereçamento e prefixo IPv6',items:['Configuração','Verificação','Prefixo /64']},
      {id:'1.9',title:'Tipos de endereço IPv6',items:['Global unicast','Unique local','Link-local','Anycast','Multicast','Modified EUI-64']},
      {id:'1.10',title:'Parâmetros IP em sistemas clientes',items:['Windows','macOS','Linux','Gateway','DNS','Máscara']},
      {id:'1.11',title:'Princípios de redes sem fio',items:['Canais não sobrepostos','SSID','RF','Criptografia']},
      {id:'1.12',title:'Fundamentos de virtualização',items:['Virtualização de servidores','Containers','VRFs']},
      {id:'1.13',title:'Conceitos de switching',items:['Aprendizado e aging MAC','Comutação de frames','Flooding','Tabela MAC']}
    ]},
    {id:'2.0',title:'Network Access',weight:20,contentStatus:'available',objectives:[
      {id:'2.1',title:'VLANs em múltiplos switches',items:['Portas access','VLAN de dados e voz','VLAN padrão','Conectividade inter-VLAN']},
      {id:'2.2',title:'Conectividade entre switches',items:['Trunk','802.1Q','Native VLAN']},
      {id:'2.3',title:'Descoberta Layer 2',items:['CDP','LLDP','Verificação de vizinhos']},
      {id:'2.4',title:'EtherChannel com LACP',items:['Layer 2','Layer 3','Channel-group','Port-channel']},
      {id:'2.5',title:'Rapid PVST+',items:['Root port','Root bridge','Estados e papéis','PortFast','Root guard','Loop guard','BPDU filter','BPDU guard']},
      {id:'2.6',title:'Arquiteturas sem fio Cisco',items:['Arquitetura centralizada','Arquitetura distribuída','Modos de AP']},
      {id:'2.7',title:'Conexões de infraestrutura WLAN',items:['AP','WLC','Portas access e trunk','LAG']},
      {id:'2.8',title:'Acesso de gerenciamento',items:['Telnet','SSH','HTTP e HTTPS','Console','TACACS+ e RADIUS','Cloud managed']},
      {id:'2.9',title:'Configuração WLAN pela GUI',items:['Criação de WLAN','Segurança','QoS','Configurações avançadas']}
    ]},
    {id:'3.0',title:'IP Connectivity',weight:25,contentStatus:'available',objectives:[
      {id:'3.1',title:'Componentes da tabela de roteamento',items:['Código do protocolo','Prefixo','Máscara','Next hop','Distância administrativa','Métrica','Gateway of last resort']},
      {id:'3.2',title:'Decisão de encaminhamento',items:['Longest prefix match','Distância administrativa','Métrica do protocolo']},
      {id:'3.3',title:'Rotas estáticas IPv4 e IPv6',items:['Default route','Network route','Host route','Floating static']},
      {id:'3.4',title:'OSPFv2 de área única',items:['Adjacências','Point-to-point','Broadcast','DR e BDR','Router ID']},
      {id:'3.5',title:'Protocolos de redundância de primeiro salto',items:['Gateway virtual','Alta disponibilidade','Default gateway redundante']}
    ]},
    {id:'4.0',title:'IP Services',weight:10,contentStatus:'planned',objectives:[
      {id:'4.1',title:'NAT inside source',items:['NAT estático','Pools']},{id:'4.2',title:'NTP',items:['Cliente','Servidor']},{id:'4.3',title:'DHCP e DNS',items:['Função na rede']},{id:'4.4',title:'SNMP',items:['Operações de rede']},{id:'4.5',title:'Syslog',items:['Facilities','Severidades']},{id:'4.6',title:'DHCP client e relay',items:['Configuração','Verificação']},{id:'4.7',title:'QoS PHB',items:['Classificação','Marcação','Filas','Congestionamento','Policing','Shaping']},{id:'4.8',title:'Acesso remoto SSH',items:['Configuração','Verificação']},{id:'4.9',title:'TFTP e FTP',items:['Capacidades','Funções']}
    ]},
    {id:'5.0',title:'Security Fundamentals',weight:15,contentStatus:'planned',objectives:[
      {id:'5.1',title:'Conceitos de segurança',items:['Ameaças','Vulnerabilidades','Exploits','Mitigação']},{id:'5.2',title:'Elementos de programa de segurança',items:['Conscientização','Treinamento','Acesso físico']},{id:'5.3',title:'Controle de acesso local',items:['Senhas','Verificação']},{id:'5.4',title:'Política de senhas',items:['Complexidade','MFA','Certificados','Biometria']},{id:'5.5',title:'IPsec VPN',items:['Acesso remoto','Site-to-site']},{id:'5.6',title:'ACLs',items:['Configuração','Verificação']},{id:'5.7',title:'Segurança Layer 2',items:['DHCP snooping','DAI','Port security']},{id:'5.8',title:'AAA',items:['Authentication','Authorization','Accounting']},{id:'5.9',title:'Segurança sem fio',items:['WPA','WPA2','WPA3']},{id:'5.10',title:'WLAN com WPA2 PSK',items:['Configuração','Verificação']}
    ]},
    {id:'6.0',title:'Automation and Programmability',weight:10,contentStatus:'planned',objectives:[
      {id:'6.1',title:'Impacto da automação',items:['Gerenciamento de rede']},{id:'6.2',title:'Redes tradicionais e controller-based',items:['Comparação']},{id:'6.3',title:'Arquitetura SDN',items:['Overlay','Underlay','Fabric','Control plane','Data plane','APIs northbound e southbound']},{id:'6.4',title:'IA e machine learning',items:['IA generativa','IA preditiva','Operações de rede']},{id:'6.5',title:'APIs REST',items:['Autenticação','CRUD','Verbos HTTP','Encoding']},{id:'6.6',title:'Gerenciamento de configuração',items:['Ansible','Terraform']},{id:'6.7',title:'JSON',items:['Componentes','Estrutura']}
    ]}
  ]
};

export const blueprintDomains = ccnaBlueprintV11.domains;
