import type {ExamQuestion} from './exam-types.ts';

export const studyQuestionCycle5:ExamQuestion[]=[
  {
    "id": "is-4.1-v5-q",
    "objectiveId": "4.1",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "NAT",
    "difficulty": "Intermediário",
    "prompt": "Uma empresa precisa publicar um servidor interno com o mesmo endereço global de forma permanente. Qual solução atende melhor?",
    "options": [
      "PAT usando uma porta diferente a cada sessão",
      "NAT estático entre o endereço local interno e o endereço global",
      "DHCP relay no gateway da VLAN",
      "Uma rota default apontando para o servidor"
    ],
    "answer": "NAT estático entre o endereço local interno e o endereço global",
    "explanation": "O NAT estático mantém um mapeamento um para um, adequado quando um host interno precisa ser alcançável por um endereço global fixo."
  },
  {
    "id": "is-4.2-v5-q",
    "objectiveId": "4.2",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "NTP",
    "difficulty": "Básico",
    "prompt": "Por que sincronizar os relógios dos dispositivos de rede com NTP é importante durante uma investigação?",
    "options": [
      "Para aumentar a largura de banda dos enlaces",
      "Para substituir o DNS por endereços IP",
      "Para correlacionar eventos de logs com uma linha do tempo confiável",
      "Para impedir que o switch aprenda endereços MAC"
    ],
    "answer": "Para correlacionar eventos de logs com uma linha do tempo confiável",
    "explanation": "Relógios alinhados permitem comparar syslog, autenticação e mudanças de configuração na ordem em que realmente ocorreram."
  },
  {
    "id": "is-4.3-v5-q",
    "objectiveId": "4.3",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "DHCP e DNS",
    "difficulty": "Básico",
    "prompt": "Um usuário consegue acessar um servidor pelo endereço IP, mas não pelo nome. Qual serviço deve ser investigado primeiro?",
    "options": [
      "NTP",
      "SNMP",
      "Syslog",
      "DNS"
    ],
    "answer": "DNS",
    "explanation": "O DNS resolve nomes de domínio para endereços IP. Se o acesso direto por IP funciona, a falha pode estar na resolução de nomes."
  },
  {
    "id": "is-4.4-v5-q",
    "objectiveId": "4.4",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "SNMP",
    "difficulty": "Intermediário",
    "prompt": "Em uma monitoração SNMP, qual é o papel do agente instalado em um switch?",
    "options": [
      "Expor dados do dispositivo para consultas e notificações do gerente",
      "Distribuir endereços IP aos clientes por DHCP",
      "Traduzir endereços privados em endereços públicos",
      "Criar túneis criptografados entre filiais"
    ],
    "answer": "Expor dados do dispositivo para consultas e notificações do gerente",
    "explanation": "O agente SNMP roda no dispositivo monitorado; o gerente consulta objetos MIB e pode receber traps ou informs."
  },
  {
    "id": "is-4.5-v5-q",
    "objectiveId": "4.5",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "Syslog",
    "difficulty": "Intermediário",
    "prompt": "Qual prática melhora a investigação de falhas quando vários roteadores pertencem ao mesmo ambiente?",
    "options": [
      "Armazenar todos os logs somente na memória volátil local",
      "Enviar mensagens Syslog para um servidor central e manter horários sincronizados",
      "Desativar mensagens de menor severidade em todos os equipamentos",
      "Registrar somente o endereço IP do administrador"
    ],
    "answer": "Enviar mensagens Syslog para um servidor central e manter horários sincronizados",
    "explanation": "Um repositório central e timestamps coerentes preservam evidências mesmo quando um equipamento reinicia ou perde seus logs locais."
  },
  {
    "id": "is-4.6-v5-q",
    "objectiveId": "4.6",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "DHCP relay",
    "difficulty": "Intermediário",
    "prompt": "Clientes de uma VLAN remota não recebem DHCP de um servidor localizado em outra rede. O que deve ser configurado no gateway da VLAN?",
    "options": [
      "Uma entrada ARP estática para cada cliente",
      "Port security na interface do servidor",
      "ip helper-address apontando para o servidor DHCP",
      "Uma rota host para cada endereço disponível"
    ],
    "answer": "ip helper-address apontando para o servidor DHCP",
    "explanation": "O relay encaminha a solicitação DHCP, que começa como broadcast, para o servidor em outra rede."
  },
  {
    "id": "is-4.7-v5-q",
    "objectiveId": "4.7",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "QoS",
    "difficulty": "Avançado",
    "prompt": "Durante um congestionamento, qual ação de QoS pode suavizar a saída de tráfego ao armazenar temporariamente excesso de pacotes?",
    "options": [
      "Remover a marcação DSCP de todo o tráfego",
      "Desabilitar a fila de saída",
      "Trocar o endereço IP de origem dos pacotes",
      "Aplicar traffic shaping para regular a taxa de transmissão"
    ],
    "answer": "Aplicar traffic shaping para regular a taxa de transmissão",
    "explanation": "Shaping usa buffering para liberar tráfego em uma taxa controlada; classificação e marcação ajudam a aplicar políticas diferentes."
  },
  {
    "id": "is-4.8-v5-q",
    "objectiveId": "4.8",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "Acesso remoto seguro",
    "difficulty": "Intermediário",
    "prompt": "Qual combinação é coerente com o objetivo de permitir somente administração remota segura em linhas VTY?",
    "options": [
      "transport input ssh e autenticação configurada para o usuário local",
      "transport input telnet e senha enviada em texto claro",
      "Desabilitar o hostname e usar somente o cabo console",
      "Permitir qualquer protocolo e filtrar apenas depois do login"
    ],
    "answer": "transport input ssh e autenticação configurada para o usuário local",
    "explanation": "SSH protege a sessão de gerenciamento; as linhas VTY também precisam de uma forma de autenticação, como login local."
  },
  {
    "id": "is-4.9-v5-q",
    "objectiveId": "4.9",
    "domainId": "4.0",
    "domain": "IP Services",
    "topic": "Transferência de arquivos",
    "difficulty": "Básico",
    "prompt": "Qual diferença descreve corretamente TFTP em comparação com FTP?",
    "options": [
      "TFTP exige autenticação e controle de sessão mais completo",
      "TFTP é mais simples, usa UDP e normalmente não oferece autenticação",
      "TFTP só funciona para consultas DNS",
      "TFTP cria criptografia equivalente à de SSH"
    ],
    "answer": "TFTP é mais simples, usa UDP e normalmente não oferece autenticação",
    "explanation": "TFTP é útil para transferências simples, como uma imagem ou configuração em rede controlada, mas não substitui um protocolo seguro para dados sensíveis."
  },
  {
    "id": "sec-5.1-v5-q",
    "objectiveId": "5.1",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "Conceitos de segurança",
    "difficulty": "Básico",
    "prompt": "Qual afirmação diferencia melhor uma vulnerabilidade de um exploit?",
    "options": [
      "Vulnerabilidade é sempre um ataque já executado",
      "Exploit é uma regra de firewall que corrige qualquer falha",
      "Vulnerabilidade é uma fraqueza; exploit é o uso dessa fraqueza para obter um efeito",
      "Exploit é sinônimo de backup offline"
    ],
    "answer": "Vulnerabilidade é uma fraqueza; exploit é o uso dessa fraqueza para obter um efeito",
    "explanation": "A vulnerabilidade representa a condição explorável. O exploit é a técnica ou código usado para aproveitá-la."
  },
  {
    "id": "sec-5.2-v5-q",
    "objectiveId": "5.2",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "Programa de segurança",
    "difficulty": "Intermediário",
    "prompt": "Qual medida reduz diretamente o risco de um colaborador cair em uma campanha de phishing?",
    "options": [
      "Substituir todos os switches por hubs",
      "Desativar os registros de autenticação",
      "Publicar a senha compartilhada em um local comum",
      "Treinamento periódico com simulações e procedimento claro de denúncia"
    ],
    "answer": "Treinamento periódico com simulações e procedimento claro de denúncia",
    "explanation": "Conscientização, treinamento e resposta rápida complementam os controles técnicos e reduzem o risco de engenharia social."
  },
  {
    "id": "sec-5.3-v5-q",
    "objectiveId": "5.3",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "Acesso local",
    "difficulty": "Intermediário",
    "prompt": "Em um roteador Cisco, qual comando protege melhor o acesso ao modo privilegiado usando uma senha armazenada de forma mais segura?",
    "options": [
      "enable secret",
      "no service password-encryption",
      "show running-config",
      "banner motd"
    ],
    "answer": "enable secret",
    "explanation": "enable secret usa um mecanismo de armazenamento protegido para a senha do modo privilegiado; ainda assim, o acesso deve ser combinado com controles adicionais."
  },
  {
    "id": "sec-5.4-v5-q",
    "objectiveId": "5.4",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "Políticas de senha",
    "difficulty": "Intermediário",
    "prompt": "Qual política oferece uma defesa mais forte para contas administrativas?",
    "options": [
      "Usar a mesma senha curta em todos os dispositivos",
      "Usar senhas únicas e longas, MFA e revisão periódica de acessos",
      "Trocar somente o nome de usuário a cada semestre",
      "Permitir acesso administrativo sem registro para evitar ruído"
    ],
    "answer": "Usar senhas únicas e longas, MFA e revisão periódica de acessos",
    "explanation": "Senhas fortes reduzem adivinhação e reutilização; MFA e revisão de privilégios diminuem o impacto de credenciais comprometidas."
  },
  {
    "id": "sec-5.5-v5-q",
    "objectiveId": "5.5",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "VPN e IPsec",
    "difficulty": "Intermediário",
    "prompt": "Uma matriz precisa conectar de forma segura toda a rede de uma filial pela Internet. Qual cenário descreve uma VPN site-to-site?",
    "options": [
      "Um usuário individual acessa a rede corporativa a partir de casa",
      "Um switch local aprende endereços MAC por uma porta trunk",
      "Dois gateways estabelecem um túnel que conecta as redes das duas localidades",
      "Um servidor DNS responde por um nome interno"
    ],
    "answer": "Dois gateways estabelecem um túnel que conecta as redes das duas localidades",
    "explanation": "Na VPN site-to-site, os gateways representam as redes inteiras. VPN de acesso remoto atende usuários individuais."
  },
  {
    "id": "sec-5.6-v5-q",
    "objectiveId": "5.6",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "ACL",
    "difficulty": "Avançado",
    "prompt": "Uma ACL IPv4 não possui uma regra permitindo o tráfego de um pacote. O que ocorre ao final da avaliação?",
    "options": [
      "O pacote é permitido por padrão",
      "O roteador encaminha o pacote pela interface mais rápida",
      "O pacote é convertido automaticamente para IPv6",
      "O pacote encontra o deny implícito e é descartado"
    ],
    "answer": "O pacote encontra o deny implícito e é descartado",
    "explanation": "Toda ACL possui um deny implícito ao final. As regras explícitas devem ser ordenadas para permitir o tráfego necessário antes dele."
  },
  {
    "id": "sec-5.7-v5-q",
    "objectiveId": "5.7",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "Segurança de Layer 2",
    "difficulty": "Avançado",
    "prompt": "Qual associação entre recurso e função está correta?",
    "options": [
      "DHCP snooping cria bindings; DAI usa esses bindings para validar ARP",
      "Port security distribui endereços IP por DHCP",
      "DAI substitui o protocolo Spanning Tree em todos os switches",
      "DHCP snooping cifra o conteúdo de cada pacote DHCP"
    ],
    "answer": "DHCP snooping cria bindings; DAI usa esses bindings para validar ARP",
    "explanation": "O binding de DHCP snooping relaciona IP, MAC, VLAN e porta. O Dynamic ARP Inspection pode usar essa informação para bloquear ARP inconsistente."
  },
  {
    "id": "sec-5.8-v5-q",
    "objectiveId": "5.8",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "AAA",
    "difficulty": "Intermediário",
    "prompt": "No modelo AAA, qual função registra o que um usuário fez depois de ser autenticado?",
    "options": [
      "Authorization",
      "Accounting",
      "Availability",
      "Addressing"
    ],
    "answer": "Accounting",
    "explanation": "Authentication verifica quem é o usuário, authorization define o que ele pode fazer e accounting registra o uso e as ações."
  },
  {
    "id": "sec-5.9-v5-q",
    "objectiveId": "5.9",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "Segurança wireless",
    "difficulty": "Intermediário",
    "prompt": "Uma rede Wi-Fi doméstica precisa de proteção moderna sem servidor dedicado de autenticação. Qual opção é a melhor escolha quando disponível?",
    "options": [
      "WEP com chave curta",
      "Rede aberta com filtragem apenas por SSID",
      "WPA3-Personal usando SAE",
      "Telnet sobre a rede sem fio"
    ],
    "answer": "WPA3-Personal usando SAE",
    "explanation": "WPA3-Personal usa SAE e oferece proteção superior às opções legadas. A escolha final também depende do suporte dos clientes."
  },
  {
    "id": "sec-5.10-v5-q",
    "objectiveId": "5.10",
    "domainId": "5.0",
    "domain": "Security Fundamentals",
    "topic": "WLAN",
    "difficulty": "Básico",
    "prompt": "Em uma WLAN WPA2-Personal, o que deve ser compartilhado entre o cliente e o ponto de acesso?",
    "options": [
      "O mesmo SSID sem qualquer proteção",
      "A mesma chave pré-compartilhada configurada na rede",
      "O endereço MAC do roteador como senha",
      "Uma rota estática para cada cliente"
    ],
    "answer": "A mesma chave pré-compartilhada configurada na rede",
    "explanation": "No modo Personal, a autenticação usa uma PSK comum à WLAN. Ela deve ser longa, única e trocada quando houver suspeita de exposição."
  },
  {
    "id": "auto-6.1-v5-q",
    "objectiveId": "6.1",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "Benefícios da automação",
    "difficulty": "Básico",
    "prompt": "Qual benefício é mais diretamente associado à automação de uma mudança repetitiva em muitos switches?",
    "options": [
      "Padronizar a execução e reduzir trabalho manual repetido",
      "Eliminar a necessidade de validar o resultado",
      "Garantir que qualquer comando seja seguro em qualquer dispositivo",
      "Substituir o planejamento por tentativas aleatórias"
    ],
    "answer": "Padronizar a execução e reduzir trabalho manual repetido",
    "explanation": "Automação aumenta consistência e escala, mas ainda exige validação, tratamento de erros e controle de mudanças."
  },
  {
    "id": "auto-6.2-v5-q",
    "objectiveId": "6.2",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "Controladores",
    "difficulty": "Intermediário",
    "prompt": "Qual é uma característica típica de uma arquitetura controller-based em comparação com o gerenciamento tradicional dispositivo a dispositivo?",
    "options": [
      "Cada dispositivo precisa tomar decisões sem receber política central",
      "Um controlador centraliza políticas e pode programar vários dispositivos por uma interface comum",
      "O plano de dados deixa de encaminhar pacotes",
      "Todos os equipamentos precisam compartilhar o mesmo endereço IP"
    ],
    "answer": "Um controlador centraliza políticas e pode programar vários dispositivos por uma interface comum",
    "explanation": "O controlador oferece uma visão e uma política centralizadas, enquanto os dispositivos continuam executando o encaminhamento conforme sua função."
  },
  {
    "id": "auto-6.3-v5-q",
    "objectiveId": "6.3",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "SDN e APIs",
    "difficulty": "Avançado",
    "prompt": "Em uma arquitetura SDN, qual direção de comunicação normalmente liga aplicações ao controlador?",
    "options": [
      "Southbound, sempre usando cabo console",
      "Data plane, usando apenas quadros Ethernet",
      "Northbound, normalmente por APIs expostas pelo controlador",
      "Out-of-band, exclusivamente por DNS"
    ],
    "answer": "Northbound, normalmente por APIs expostas pelo controlador",
    "explanation": "APIs northbound conectam aplicações e serviços ao controlador; APIs southbound conectam o controlador aos dispositivos ou elementos de rede."
  },
  {
    "id": "auto-6.4-v5-q",
    "objectiveId": "6.4",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "IA e machine learning",
    "difficulty": "Intermediário",
    "prompt": "Uma ferramenta analisa séries históricas de latência para sinalizar comportamento fora do padrão. Qual uso de IA ou ML isso representa?",
    "options": [
      "Detecção de anomalias para apoiar a operação",
      "Substituição automática de toda a política de segurança",
      "Conversão de IPv4 em endereços MAC",
      "Criação de um enlace físico sem hardware"
    ],
    "answer": "Detecção de anomalias para apoiar a operação",
    "explanation": "Modelos podem destacar padrões incomuns em métricas e logs. A decisão operacional ainda deve ser validada por evidências e regras de mudança."
  },
  {
    "id": "auto-6.5-v5-q",
    "objectiveId": "6.5",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "REST e JSON",
    "difficulty": "Básico",
    "prompt": "Uma aplicação precisa consultar um recurso sem alterá-lo por uma API REST. Qual método HTTP é normalmente usado?",
    "options": [
      "GET",
      "POST",
      "DELETE",
      "TRACE"
    ],
    "answer": "GET",
    "explanation": "GET consulta uma representação do recurso. POST costuma criar ou disparar uma ação, enquanto PUT ou PATCH atualizam e DELETE remove."
  },
  {
    "id": "auto-6.6-v5-q",
    "objectiveId": "6.6",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "Ansible e Terraform",
    "difficulty": "Intermediário",
    "prompt": "Qual associação é mais adequada para as ferramentas abaixo?",
    "options": [
      "Ansible é usado apenas para desenhar topologias físicas",
      "Ansible automatiza configuração; Terraform descreve e provisiona infraestrutura declarativamente",
      "Terraform é um protocolo de roteamento; Ansible é um método de criptografia",
      "As duas ferramentas são somente clientes de DNS"
    ],
    "answer": "Ansible automatiza configuração; Terraform descreve e provisiona infraestrutura declarativamente",
    "explanation": "Ansible é comum na configuração e orquestração de hosts. Terraform mantém o estado desejado de recursos de infraestrutura por código."
  },
  {
    "id": "auto-6.7-v5-q",
    "objectiveId": "6.7",
    "domainId": "6.0",
    "domain": "Automation and Programmability",
    "topic": "Estrutura JSON",
    "difficulty": "Básico",
    "prompt": "Qual estrutura JSON representa corretamente um objeto com uma chave name e uma lista de duas interfaces?",
    "options": [
      "[name: router, interfaces: [Gi0/0, Gi0/1]]",
      "{name = router; interfaces = (Gi0/0, Gi0/1)}",
      "{"name":"router","interfaces":["Gi0/0","Gi0/1"]}",
      "("name","router","interfaces","Gi0/0","Gi0/1")"
    ],
    "answer": "{"name":"router","interfaces":["Gi0/0","Gi0/1"]}",
    "explanation": "Objetos JSON usam chaves e pares chave-valor; listas usam colchetes e textos precisam estar entre aspas."
  }
];
