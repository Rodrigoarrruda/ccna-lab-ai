import type {ExamQuestion} from './exam-types.ts';

export const studyQuestionCycle4:ExamQuestion[]=[
  {
    "id": "nf-1.1-v4-q",
    "objectiveId": "1.1",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Componentes",
    "difficulty": "Básico",
    "prompt": "Qual recurso permite a um switch Layer 3 encaminhar entre VLANs?",
    "options": [
      "SVI com roteamento habilitado",
      "Cabo console",
      "Hub",
      "Servidor DNS"
    ],
    "answer": "SVI com roteamento habilitado",
    "explanation": "Uma SVI e o roteamento Layer 3 permitem encaminhamento entre VLANs."
  },
  {
    "id": "nf-1.2-v4-q",
    "objectiveId": "1.2",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Topologias",
    "difficulty": "Básico",
    "prompt": "Qual característica pertence ao desenho spine-leaf?",
    "options": [
      "Um único enlace compartilhado",
      "Cada leaf conectado a vários spines",
      "Apenas uma camada de acesso",
      "Nenhum caminho redundante"
    ],
    "answer": "Cada leaf conectado a vários spines",
    "explanation": "A malha spine-leaf cria caminhos previsíveis e redundantes."
  },
  {
    "id": "nf-1.3-v4-q",
    "objectiveId": "1.3",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Cabeamento",
    "difficulty": "Básico",
    "prompt": "Qual meio é mais resistente à interferência eletromagnética?",
    "options": [
      "Cobre UTP",
      "Cabo console",
      "Fibra óptica",
      "Coaxial"
    ],
    "answer": "Fibra óptica",
    "explanation": "A fibra usa luz e não sofre interferência eletromagnética como meios metálicos."
  },
  {
    "id": "nf-1.4-v4-q",
    "objectiveId": "1.4",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Interface e duplex",
    "difficulty": "Básico",
    "prompt": "Qual sintoma sugere incompatibilidade de duplex?",
    "options": [
      "Colisões e perda sob carga",
      "Criação de VLAN",
      "Novo endereço DHCP",
      "Aumento de potência PoE"
    ],
    "answer": "Colisões e perda sob carga",
    "explanation": "Full-duplex de um lado e half-duplex do outro degradam o enlace."
  },
  {
    "id": "nf-1.5-v4-q",
    "objectiveId": "1.5",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "TCP versus UDP",
    "difficulty": "Básico",
    "prompt": "Qual característica é típica do UDP?",
    "options": [
      "Handshake obrigatório",
      "Ordenação garantida",
      "Retransmissão nativa",
      "Menor overhead sem conexão"
    ],
    "answer": "Menor overhead sem conexão",
    "explanation": "UDP não estabelece conexão nem fornece a mesma confiabilidade do TCP."
  },
  {
    "id": "nf-1.6-v4-q",
    "objectiveId": "1.6",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Subnetting IPv4",
    "difficulty": "Básico",
    "prompt": "Qual é o broadcast de 192.168.20.128/26?",
    "options": [
      "192.168.20.129",
      "192.168.20.190",
      "192.168.20.191",
      "192.168.20.255"
    ],
    "answer": "192.168.20.191",
    "explanation": "O bloco /26 vai de .128 a .191."
  },
  {
    "id": "nf-1.7-v4-q",
    "objectiveId": "1.7",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "IPv4 privado",
    "difficulty": "Básico",
    "prompt": "Qual faixa é RFC1918?",
    "options": [
      "100.64.0.0/10",
      "169.254.0.0/16",
      "172.16.0.0/12",
      "198.18.0.0/15"
    ],
    "answer": "172.16.0.0/12",
    "explanation": "172.16.0.0/12 é uma das três faixas IPv4 privadas."
  },
  {
    "id": "nf-1.8-v4-q",
    "objectiveId": "1.8",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "IPv6",
    "difficulty": "Básico",
    "prompt": "Qual prefixo é comum em uma LAN IPv6?",
    "options": [
      "/32",
      "/48",
      "/64",
      "/128"
    ],
    "answer": "/64",
    "explanation": "/64 é o prefixo usado em muitas LANs IPv6."
  },
  {
    "id": "nf-1.9-v4-q",
    "objectiveId": "1.9",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Tipos IPv6",
    "difficulty": "Básico",
    "prompt": "Qual endereço é link-local?",
    "options": [
      "2001:db8::1",
      "FC00::1",
      "FF02::1",
      "FE80::1"
    ],
    "answer": "FE80::1",
    "explanation": "FE80::/10 identifica endereços link-local."
  },
  {
    "id": "nf-1.10-v4-q",
    "objectiveId": "1.10",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Parâmetros IP",
    "difficulty": "Básico",
    "prompt": "Qual parâmetro indica o próximo salto para redes remotas?",
    "options": [
      "DNS",
      "Máscara",
      "Gateway default",
      "SSID"
    ],
    "answer": "Gateway default",
    "explanation": "O gateway default encaminha tráfego fora da sub-rede local."
  },
  {
    "id": "nf-1.11-v4-q",
    "objectiveId": "1.11",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Wireless",
    "difficulty": "Básico",
    "prompt": "Qual prática reduz interferência em 2,4 GHz?",
    "options": [
      "Canais não sobrepostos e potência planejada",
      "Ocultar o SSID",
      "Usar potência máxima sempre",
      "Repetir o mesmo canal em APs vizinhos"
    ],
    "answer": "Canais não sobrepostos e potência planejada",
    "explanation": "Planejamento de canal e potência melhora a reutilização do espectro."
  },
  {
    "id": "nf-1.12-v4-q",
    "objectiveId": "1.12",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Virtualização",
    "difficulty": "Básico",
    "prompt": "Qual recurso separa tabelas de roteamento no mesmo dispositivo?",
    "options": [
      "Container",
      "VRF",
      "PoE",
      "SSID"
    ],
    "answer": "VRF",
    "explanation": "VRF cria contextos de roteamento independentes."
  },
  {
    "id": "nf-1.13-v4-q",
    "objectiveId": "1.13",
    "domainId": "1.0",
    "domain": "Network Fundamentals",
    "topic": "Switching",
    "difficulty": "Básico",
    "prompt": "Como o switch aprende um MAC?",
    "options": [
      "Consultando DNS",
      "Observando o MAC de origem",
      "Recebendo OSPF",
      "Lendo o gateway"
    ],
    "answer": "Observando o MAC de origem",
    "explanation": "O MAC de origem é associado à porta e à VLAN de entrada."
  },
  {
    "id": "na-2.1-v4-q",
    "objectiveId": "2.1",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "VLAN",
    "difficulty": "Básico",
    "prompt": "Qual modo atende normalmente um PC em uma única VLAN?",
    "options": [
      "Trunk",
      "Access",
      "Passive",
      "Routed-only"
    ],
    "answer": "Access",
    "explanation": "Porta access associa o endpoint a uma única VLAN."
  },
  {
    "id": "na-2.2-v4-q",
    "objectiveId": "2.2",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "Trunk",
    "difficulty": "Intermediário",
    "prompt": "Qual tecnologia identifica VLANs em um trunk?",
    "options": [
      "NTP",
      "802.1Q",
      "FTP",
      "GRE"
    ],
    "answer": "802.1Q",
    "explanation": "802.1Q transporta a identificação de VLAN no trunk."
  },
  {
    "id": "na-2.3-v4-q",
    "objectiveId": "2.3",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "Descoberta",
    "difficulty": "Básico",
    "prompt": "Qual protocolo de descoberta é padrão aberto?",
    "options": [
      "CDP",
      "DTP",
      "LLDP",
      "VTP"
    ],
    "answer": "LLDP",
    "explanation": "LLDP é aberto; CDP é proprietário Cisco."
  },
  {
    "id": "na-2.4-v4-q",
    "objectiveId": "2.4",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "EtherChannel",
    "difficulty": "Intermediário",
    "prompt": "Qual combinação pode formar LACP?",
    "options": [
      "Passive com passive",
      "Active com passive",
      "Auto com auto",
      "Access com trunk incompatível"
    ],
    "answer": "Active com passive",
    "explanation": "Pelo menos uma ponta deve iniciar a negociação em active."
  },
  {
    "id": "na-2.5-v4-q",
    "objectiveId": "2.5",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "STP",
    "difficulty": "Intermediário",
    "prompt": "Como o root bridge é eleito?",
    "options": [
      "Maior Bridge ID",
      "Menor Bridge ID",
      "Maior número de portas",
      "Maior endereço IP"
    ],
    "answer": "Menor Bridge ID",
    "explanation": "A eleição usa o menor Bridge ID."
  },
  {
    "id": "na-2.6-v4-q",
    "objectiveId": "2.6",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "Arquitetura wireless",
    "difficulty": "Básico",
    "prompt": "Qual componente centraliza APs em uma WLAN tradicional?",
    "options": [
      "Hub",
      "WLC",
      "Patch panel",
      "TFTP"
    ],
    "answer": "WLC",
    "explanation": "A WLC centraliza políticas e gerenciamento dos APs."
  },
  {
    "id": "na-2.7-v4-q",
    "objectiveId": "2.7",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "Infraestrutura WLAN",
    "difficulty": "Intermediário",
    "prompt": "O enlace entre switch e AP precisa transportar várias WLANs. Qual modo é esperado?",
    "options": [
      "Access em uma VLAN apenas",
      "Trunk compatível com VLANs",
      "Console",
      "Loopback"
    ],
    "answer": "Trunk compatível com VLANs",
    "explanation": "O trunk transporta as VLANs associadas às WLANs."
  },
  {
    "id": "na-2.8-v4-q",
    "objectiveId": "2.8",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "Gerenciamento",
    "difficulty": "Básico",
    "prompt": "Qual protocolo é preferível para gerenciamento remoto cifrado?",
    "options": [
      "Telnet",
      "TFTP",
      "SSH",
      "FTP"
    ],
    "answer": "SSH",
    "explanation": "SSH protege a sessão de gerenciamento com criptografia."
  },
  {
    "id": "na-2.9-v4-q",
    "objectiveId": "2.9",
    "domainId": "2.0",
    "domain": "Network Access",
    "topic": "WLAN GUI",
    "difficulty": "Intermediário",
    "prompt": "O que coloca clientes de uma WLAN no segmento correto?",
    "options": [
      "Mapeamento WLAN-VLAN",
      "Limpeza da tabela MAC",
      "Troca do router ID",
      "Alteração do hostname"
    ],
    "answer": "Mapeamento WLAN-VLAN",
    "explanation": "O mapeamento associa a WLAN à VLAN correspondente."
  },
  {
    "id": "ip-3.1-v4-q",
    "objectiveId": "3.1",
    "domainId": "3.0",
    "domain": "IP Connectivity",
    "topic": "Tabela de roteamento",
    "difficulty": "Intermediário",
    "prompt": "Qual campo indica o próximo roteador?",
    "options": [
      "SSID",
      "Next hop",
      "Native VLAN",
      "Port security"
    ],
    "answer": "Next hop",
    "explanation": "Next hop indica o próximo destino no encaminhamento."
  },
  {
    "id": "ip-3.2-v4-q",
    "objectiveId": "3.2",
    "domainId": "3.0",
    "domain": "IP Connectivity",
    "topic": "Decisão de encaminhamento",
    "difficulty": "Intermediário",
    "prompt": "Qual regra é aplicada primeiro entre prefixos diferentes?",
    "options": [
      "Maior métrica",
      "Longest prefix match",
      "Maior distância administrativa",
      "Ordem alfabética"
    ],
    "answer": "Longest prefix match",
    "explanation": "A rota mais específica vence pelo longest prefix match."
  },
  {
    "id": "ip-3.3-v4-q",
    "objectiveId": "3.3",
    "domainId": "3.0",
    "domain": "IP Connectivity",
    "topic": "Rotas estáticas",
    "difficulty": "Básico",
    "prompt": "Qual rota atende destinos sem rota mais específica?",
    "options": [
      "Host route",
      "Default route",
      "Floating host",
      "Local route"
    ],
    "answer": "Default route",
    "explanation": "A default route é usada quando nenhuma rota mais específica existe."
  },
  {
    "id": "ip-3.4-v4-q",
    "objectiveId": "3.4",
    "domainId": "3.0",
    "domain": "IP Connectivity",
    "topic": "OSPF",
    "difficulty": "Intermediário",
    "prompt": "Quais papéis reduzem adjacências em uma rede broadcast?",
    "options": [
      "Active e passive",
      "Root e designated VLAN",
      "DR e BDR",
      "Client e server"
    ],
    "answer": "DR e BDR",
    "explanation": "DR e BDR representam o segmento multiacesso."
  },
  {
    "id": "ip-3.5-v4-q",
    "objectiveId": "3.5",
    "domainId": "3.0",
    "domain": "IP Connectivity",
    "topic": "FHRP",
    "difficulty": "Básico",
    "prompt": "Qual é a finalidade de um FHRP?",
    "options": [
      "Gateway virtual redundante",
      "Distribuição de DNS",
      "Criptografia SSH",
      "Aprendizado MAC"
    ],
    "answer": "Gateway virtual redundante",
    "explanation": "FHRP mantém um gateway virtual disponível quando um roteador falha."
  }
];
