import type {StudyLesson} from './study-lessons.ts';

export const extendedStudyLessons:Record<string,StudyLesson>={
  "4.1": {
    "objectiveId": "4.1",
    "overview": "NAT inside source traduz endereços internos quando o tráfego atravessa limites de rede.",
    "whyItMatters": "A prova cobra a diferença entre tradução 1:1, pool e overload, além da direção inside/outside.",
    "concepts": [
      "NAT estático mantém um mapeamento previsível para um host interno.",
      "NAT dinâmico escolhe endereços de um pool por tempo limitado.",
      "PAT/overload compartilha um endereço usando portas de transporte."
    ],
    "commands": [
      "ip nat inside",
      "ip nat outside",
      "show ip nat translations",
      "show ip nat statistics"
    ],
    "scenario": "Uma aplicação publicada precisa de um endereço estável; uma rede de usuários precisa sair por poucos endereços públicos. Escolha estático para a publicação e overload para a saída compartilhada.",
    "checkPrompt": "Qual técnica permite muitos hosts privados compartilharem um único endereço público?",
    "checkOptions": [
      "NAT estático",
      "PAT/overload",
      "Rota flutuante",
      "DHCP relay"
    ],
    "checkAnswer": "PAT/overload",
    "checkExplanation": "A tradução usa portas TCP/UDP para diferenciar sessões que compartilham o mesmo endereço externo."
  },
  "4.2": {
    "objectiveId": "4.2",
    "overview": "NTP mantém relógios coerentes usando uma hierarquia de fontes de tempo.",
    "whyItMatters": "Horário consistente é essencial para logs, troubleshooting, autenticação e correlação de incidentes.",
    "concepts": [
      "Servidor NTP fornece referência; cliente sincroniza o relógio.",
      "Stratum indica distância lógica até a fonte de referência.",
      "A origem, o estado de sincronismo e a hora devem ser verificados."
    ],
    "commands": [
      "ntp server <address>",
      "show clock detail",
      "show ntp associations",
      "show ntp status"
    ],
    "scenario": "Os eventos de dois roteadores parecem fora de ordem. Antes de comparar logs, verifique se ambos estão sincronizados com a mesma fonte NTP.",
    "checkPrompt": "O que o NTP resolve primeiro em uma rede?",
    "checkOptions": [
      "Endereços duplicados",
      "Coerência de horário",
      "VLAN nativa",
      "MTU de túnel"
    ],
    "checkAnswer": "Coerência de horário",
    "checkExplanation": "NTP não substitui DNS ou DHCP; ele mantém os relógios comparáveis."
  },
  "4.3": {
    "objectiveId": "4.3",
    "overview": "DHCP distribui parâmetros IP; DNS converte nomes em endereços e não substitui o gateway.",
    "whyItMatters": "A distinção entre concessão de configuração e resolução de nomes aparece em cenários de falha.",
    "concepts": [
      "DHCP entrega endereço, máscara, gateway e opções.",
      "DNS responde consultas de nomes para registros.",
      "Um cliente pode ter IP válido e ainda falhar ao resolver nomes."
    ],
    "commands": [
      "show ip dhcp binding",
      "show ip dhcp pool",
      "nslookup <name>",
      "show hosts"
    ],
    "scenario": "O ping para um endereço IP funciona, mas o acesso por nome falha. O próximo passo é verificar DNS, não renovar a VLAN sem evidência.",
    "checkPrompt": "Qual serviço resolve um nome como intranet.exemplo em um endereço IP?",
    "checkOptions": [
      "DHCP",
      "DNS",
      "NTP",
      "SNMP"
    ],
    "checkAnswer": "DNS",
    "checkExplanation": "DNS resolve nomes; DHCP apenas entrega parâmetros de configuração ao cliente."
  },
  "4.4": {
    "objectiveId": "4.4",
    "overview": "SNMP permite monitorar estado e contadores por meio de agentes, gerentes e objetos MIB.",
    "whyItMatters": "Monitoramento evita depender apenas de acesso manual e revela tendência de erro, uso e disponibilidade.",
    "concepts": [
      "Manager consulta ou recebe notificações; agent expõe dados no dispositivo.",
      "OID identifica um objeto na MIB.",
      "SNMPv3 adiciona autenticação e privacidade; comunidades legadas exigem cuidado."
    ],
    "commands": [
      "show snmp",
      "show snmp engineID",
      "snmp-server group <name> v3",
      "snmp-server host <address> version 3"
    ],
    "scenario": "A equipe quer alertas de interface sem conceder acesso administrativo completo. Separe telemetria de configuração e use credenciais SNMP adequadas.",
    "checkPrompt": "Qual componente identifica um objeto monitorado na MIB?",
    "checkOptions": [
      "OID",
      "SSID",
      "VLAN ID",
      "AS number"
    ],
    "checkAnswer": "OID",
    "checkExplanation": "O Object Identifier localiza o objeto hierárquico que o manager consulta."
  },
  "4.5": {
    "objectiveId": "4.5",
    "overview": "Syslog centraliza mensagens com facility, severidade e timestamp para investigação.",
    "whyItMatters": "Logs locais podem desaparecer após reinício; centralização permite correlação e retenção.",
    "concepts": [
      "Severidade 0 é emergência e 7 é debug.",
      "Facility categoriza a origem lógica da mensagem.",
      "O servidor deve ter horário consistente e política de retenção."
    ],
    "commands": [
      "logging host <address>",
      "logging trap warnings",
      "show logging",
      "service timestamps log datetime"
    ],
    "scenario": "Após uma alteração, várias interfaces oscilam. Compare logs do switch, roteador e firewall pelo horário antes de concluir que são falhas independentes.",
    "checkPrompt": "Qual severidade Syslog representa uma condição de emergência?",
    "checkOptions": [
      "0",
      "3",
      "5",
      "7"
    ],
    "checkAnswer": "0",
    "checkExplanation": "Na escala Syslog, 0 é emergency e 7 é debugging."
  },
  "4.6": {
    "objectiveId": "4.6",
    "overview": "DHCP client e relay conectam clientes a um serviço DHCP que está em outra sub-rede.",
    "whyItMatters": "O broadcast DHCP não atravessa roteadores sozinho; o relay converte a necessidade local em encaminhamento unicast.",
    "concepts": [
      "Cliente usa DHCP para obter parâmetros.",
      "ip helper-address encaminha solicitações para o servidor.",
      "O gateway do relay identifica a sub-rede de origem para o escopo correto."
    ],
    "commands": [
      "ip address dhcp",
      "ip helper-address <server>",
      "show ip dhcp relay information trusted",
      "show ip interface <id>"
    ],
    "scenario": "O cliente da VLAN 30 não recebe endereço, mas o servidor DHCP está alcançável em outra rede. Verifique relay na interface Layer 3 da VLAN 30.",
    "checkPrompt": "Qual configuração encaminha DHCP entre sub-redes?",
    "checkOptions": [
      "ip helper-address",
      "switchport trunk native",
      "router-id",
      "ntp server"
    ],
    "checkAnswer": "ip helper-address",
    "checkExplanation": "O helper encaminha os broadcasts DHCP para o servidor configurado."
  },
  "4.7": {
    "objectiveId": "4.7",
    "overview": "QoS PHB organiza o tratamento de tráfego por classificação, marcação, filas e controle de congestionamento.",
    "whyItMatters": "A prova avalia o caminho completo: identificar, marcar, enfileirar e aplicar policing ou shaping.",
    "concepts": [
      "Classificação identifica o tráfego; marcação transporta a decisão.",
      "Policing descarta ou remarca excedente; shaping suaviza e armazena.",
      "PHB define o comportamento esperado em congestionamento."
    ],
    "commands": [
      "show policy-map interface",
      "class-map match-any <name>",
      "policy-map <name>",
      "service-policy output <name>"
    ],
    "scenario": "Voz sofre jitter enquanto backup ocupa o enlace. Classifique voz, marque-a e aplique uma política de fila; não tente resolver congestionamento apenas aumentando banda imaginada.",
    "checkPrompt": "Qual ação normalmente armazena excesso e transmite em ritmo controlado?",
    "checkOptions": [
      "Policing",
      "Shaping",
      "Flooding",
      "NAT estático"
    ],
    "checkAnswer": "Shaping",
    "checkExplanation": "Shaping usa buffer para suavizar a taxa; policing aplica limite e trata o excedente imediatamente."
  },
  "4.8": {
    "objectiveId": "4.8",
    "overview": "SSH fornece administração remota autenticada e cifrada para dispositivos Cisco.",
    "whyItMatters": "Telnet expõe credenciais e sessão; SSH reduz o risco e é parte recorrente da configuração inicial segura.",
    "concepts": [
      "O dispositivo precisa de hostname, domínio, chave RSA e autenticação.",
      "As linhas VTY devem aceitar apenas SSH quando essa for a política.",
      "Verifique versão, sessões e reachability antes de culpar a chave."
    ],
    "commands": [
      "hostname R1",
      "ip domain-name lab.local",
      "crypto key generate rsa modulus 2048",
      "transport input ssh",
      "show ip ssh"
    ],
    "scenario": "Um administrador consegue pingar o roteador, mas não abre SSH. Confira chave, usuário local, VTY e transporte permitido.",
    "checkPrompt": "Qual comando restringe as linhas VTY a SSH?",
    "checkOptions": [
      "transport input ssh",
      "switchport mode trunk",
      "ip helper-address",
      "logging host"
    ],
    "checkAnswer": "transport input ssh",
    "checkExplanation": "A configuração das VTY define quais protocolos de acesso remoto são aceitos."
  },
  "4.9": {
    "objectiveId": "4.9",
    "overview": "TFTP e FTP transferem arquivos, mas diferem em controle, autenticação e robustez.",
    "whyItMatters": "Backup de configuração e cópia de imagens exigem escolher o serviço compatível com o risco e o fluxo.",
    "concepts": [
      "TFTP é simples e não oferece a mesma autenticação do FTP.",
      "FTP usa sessão de controle e autenticação.",
      "O arquivo de origem, destino, espaço e conectividade devem ser verificados."
    ],
    "commands": [
      "copy running-config tftp:",
      "copy startup-config tftp:",
      "copy tftp: flash:",
      "show file systems"
    ],
    "scenario": "Antes de atualizar uma imagem, faça backup verificável e confirme espaço na flash; não trate uma cópia interrompida como backup válido.",
    "checkPrompt": "Qual serviço é mais simples e normalmente não fornece autenticação como FTP?",
    "checkOptions": [
      "TFTP",
      "HTTPS",
      "SFTP",
      "SSH"
    ],
    "checkAnswer": "TFTP",
    "checkExplanation": "TFTP é leve e simples, mas tem menos controles de segurança e transferência."
  },
  "5.1": {
    "objectiveId": "5.1",
    "overview": "Segurança começa separando ameaça, vulnerabilidade, exploit e mitigação.",
    "whyItMatters": "Essa linguagem organiza análise de risco e evita tratar qualquer evento como o mesmo tipo de problema.",
    "concepts": [
      "Ameaça é um agente ou evento potencialmente danoso.",
      "Vulnerabilidade é uma fraqueza explorável.",
      "Exploit é a técnica ou código que aproveita a fraqueza; mitigação reduz probabilidade ou impacto."
    ],
    "commands": [
      "show login",
      "show ip access-lists",
      "show port-security",
      "show version"
    ],
    "scenario": "Uma porta de acesso permite MACs ilimitados e não tem proteção. A exposição é a vulnerabilidade; usar port security é uma mitigação.",
    "checkPrompt": "O que é uma vulnerabilidade?",
    "checkOptions": [
      "Uma fraqueza explorável",
      "O agente atacante",
      "O código de exploração",
      "O plano de recuperação"
    ],
    "checkAnswer": "Uma fraqueza explorável",
    "checkExplanation": "Vulnerabilidade descreve a condição que pode ser aproveitada por uma ameaça."
  },
  "5.2": {
    "objectiveId": "5.2",
    "overview": "Programa de segurança combina conscientização, treinamento e controle de acesso físico.",
    "whyItMatters": "Tecnologia não elimina phishing, credencial compartilhada ou acesso indevido à sala de equipamentos.",
    "concepts": [
      "Conscientização muda comportamento cotidiano.",
      "Treinamento desenvolve resposta prática e repetível.",
      "Controle físico protege console, equipamentos, mídia e áreas críticas."
    ],
    "commands": [
      "show users",
      "show login",
      "show running-config | section line con",
      "show archive"
    ],
    "scenario": "Um atacante não precisa explorar a rede se consegue conectar um notebook ao console. Inclua segurança física no desenho do programa.",
    "checkPrompt": "Qual medida pertence diretamente ao controle físico?",
    "checkOptions": [
      "Trancar e registrar acesso à sala",
      "Alterar métrica OSPF",
      "Marcar DSCP",
      "Criar registro DNS"
    ],
    "checkAnswer": "Trancar e registrar acesso à sala",
    "checkExplanation": "A proteção física reduz acesso direto a equipamentos e interfaces administrativas."
  },
  "5.3": {
    "objectiveId": "5.3",
    "overview": "Controle local usa identidade, método de verificação e autorização adequada no próprio dispositivo.",
    "whyItMatters": "Configurar apenas uma senha de enable não garante política consistente para console e VTY.",
    "concepts": [
      "username secret armazena credencial local protegida.",
      "login local faz a linha consultar a base local.",
      "Enable secret protege o modo privilegiado, mas não substitui identidade individual."
    ],
    "commands": [
      "username admin privilege 15 secret <value>",
      "login local",
      "enable secret <value>",
      "show running-config | section username"
    ],
    "scenario": "Dois administradores precisam de rastreabilidade. Use contas individuais e login local, evitando uma senha compartilhada em todas as linhas.",
    "checkPrompt": "Qual comando faz a linha usar a base local de usuários?",
    "checkOptions": [
      "login local",
      "login",
      "password 0",
      "enable"
    ],
    "checkAnswer": "login local",
    "checkExplanation": "login local associa a autenticação da linha à base local de usuários."
  },
  "5.4": {
    "objectiveId": "5.4",
    "overview": "Política de senha combina complexidade, fatores e ciclo de vida de credenciais.",
    "whyItMatters": "Senha forte reduz risco, mas MFA, certificados e biometria podem adicionar fatores independentes.",
    "concepts": [
      "Complexidade e comprimento dificultam adivinhação.",
      "MFA combina fatores diferentes, não duas senhas.",
      "Certificado e biometria têm propriedades e riscos operacionais próprios."
    ],
    "commands": [
      "security passwords min-length 12",
      "login block-for 120 attempts 3 within 60",
      "show login"
    ],
    "scenario": "Uma senha longa vazou. A resposta madura é revogar a credencial, investigar o uso e adicionar fator independente, não apenas trocar por outra senha parecida.",
    "checkPrompt": "O que caracteriza MFA?",
    "checkOptions": [
      "Dois fatores de categorias diferentes",
      "Duas senhas idênticas",
      "Uma senha muito curta",
      "Um SSID oculto"
    ],
    "checkAnswer": "Dois fatores de categorias diferentes",
    "checkExplanation": "MFA combina algo que você sabe, tem ou é, em vez de repetir o mesmo fator."
  },
  "5.5": {
    "objectiveId": "5.5",
    "overview": "IPsec protege tráfego entre pares por autenticação, integridade e/ou confidencialidade.",
    "whyItMatters": "A prova diferencia acesso remoto de usuário e túnel site-to-site entre redes.",
    "concepts": [
      "Site-to-site conecta redes por um túnel entre gateways.",
      "Remote access conecta um usuário ou cliente à rede.",
      "As propostas precisam coincidir em autenticação, criptografia, integridade e parâmetros de túnel."
    ],
    "commands": [
      "show crypto isakmp sa",
      "show crypto ipsec sa",
      "crypto map <name>",
      "tunnel protection ipsec profile <name>"
    ],
    "scenario": "O túnel negocia, mas os contadores de encapsulamento não crescem. Verifique ACL de tráfego interessante, rotas e aplicação do crypto map.",
    "checkPrompt": "Qual cenário descreve uma VPN site-to-site?",
    "checkOptions": [
      "Dois gateways conectando redes",
      "Um usuário trocando senha local",
      "Um AP escolhendo canal",
      "Um switch aprendendo MAC"
    ],
    "checkAnswer": "Dois gateways conectando redes",
    "checkExplanation": "Site-to-site cria proteção entre redes por seus dispositivos de borda."
  },
  "5.6": {
    "objectiveId": "5.6",
    "overview": "ACLs filtram tráfego por endereço, protocolo e porta em uma interface e direção específicas.",
    "whyItMatters": "A ordem das entradas e o deny implícito explicam muitos bloqueios acidentais.",
    "concepts": [
      "ACL é processada de cima para baixo.",
      "A primeira correspondência encerra a avaliação.",
      "Existe deny implícito ao final; aplicar na direção errada muda o resultado."
    ],
    "commands": [
      "access-list 10 permit <network> <wildcard>",
      "ip access-group <acl> in",
      "show access-lists",
      "show ip interface <id>"
    ],
    "scenario": "A rede de suporte perdeu acesso depois de um deny amplo colocado acima da exceção. Reordene a lógica e verifique contadores antes de ampliar permissões.",
    "checkPrompt": "O que ocorre quando uma ACL não encontra correspondência?",
    "checkOptions": [
      "O tráfego é permitido sempre",
      "O deny implícito é aplicado",
      "A ACL reinicia",
      "O roteador cria uma rota"
    ],
    "checkAnswer": "O deny implícito é aplicado",
    "checkExplanation": "Toda ACL termina com uma negação implícita, salvo regras explícitas que permitam o tráfego."
  },
  "5.7": {
    "objectiveId": "5.7",
    "overview": "Segurança Layer 2 protege a borda contra DHCP rogue, ARP spoofing e MACs não autorizados.",
    "whyItMatters": "A rede local é um ponto de ataque; controles devem ser aplicados na porta e validados pelos estados do switch.",
    "concepts": [
      "DHCP snooping constrói bindings confiáveis.",
      "DAI valida ARP usando bindings e políticas.",
      "Port security limita e trata MACs na porta de acesso."
    ],
    "commands": [
      "ip dhcp snooping vlan <id>",
      "ip arp inspection vlan <id>",
      "switchport port-security",
      "show port-security interface <id>"
    ],
    "scenario": "Após habilitar DHCP snooping, o servidor legítimo parou de responder porque sua porta não foi marcada como trusted. Valide o caminho antes de desativar a proteção.",
    "checkPrompt": "Qual recurso cria bindings usados pelo DAI?",
    "checkOptions": [
      "DHCP snooping",
      "NTP",
      "STP",
      "NAT"
    ],
    "checkAnswer": "DHCP snooping",
    "checkExplanation": "O snooping registra associação IP-MAC-porta para ajudar o DAI e outras validações."
  },
  "5.8": {
    "objectiveId": "5.8",
    "overview": "AAA separa autenticação, autorização e accounting para controlar e rastrear acesso.",
    "whyItMatters": "A separação permite limitar comandos e atribuir responsabilidade sem depender de uma senha compartilhada.",
    "concepts": [
      "Authentication valida quem é o usuário.",
      "Authorization define o que ele pode fazer.",
      "Accounting registra o que ocorreu; RADIUS e TACACS+ têm diferenças de transporte e escopo."
    ],
    "commands": [
      "aaa new-model",
      "aaa authentication login default local",
      "aaa authorization exec default local",
      "show aaa servers"
    ],
    "scenario": "O servidor AAA está indisponível durante uma emergência. Configure fallback local controlado sem abandonar o rastreamento quando o serviço retornar.",
    "checkPrompt": "Qual parte do AAA registra ações e sessões?",
    "checkOptions": [
      "Accounting",
      "Authentication",
      "Authorization",
      "Addressing"
    ],
    "checkAnswer": "Accounting",
    "checkExplanation": "Accounting registra uso, sessões e eventos para auditoria."
  },
  "5.9": {
    "objectiveId": "5.9",
    "overview": "WPA, WPA2 e WPA3 representam gerações de proteção para WLAN, com diferenças de criptografia e autenticação.",
    "whyItMatters": "A escolha da segurança sem fio afeta clientes, exposição e compatibilidade.",
    "concepts": [
      "WPA2 e WPA3 melhoram a proteção em relação ao WPA legado.",
      "PSK é apropriada para redes pequenas; enterprise usa autenticação centralizada.",
      "Compatibilidade não deve justificar manter um protocolo inseguro sem mitigação."
    ],
    "commands": [
      "show wireless stats",
      "show wlan summary",
      "show running-config | section wlan"
    ],
    "scenario": "Uma rede corporativa precisa de identidades individuais e revogação por usuário. Prefira autenticação enterprise em vez de uma PSK compartilhada.",
    "checkPrompt": "Qual opção representa a geração mais recente entre as listadas?",
    "checkOptions": [
      "WEP",
      "WPA",
      "WPA2",
      "WPA3"
    ],
    "checkAnswer": "WPA3",
    "checkExplanation": "WPA3 é a geração mais nova entre as opções e oferece mecanismos atualizados de proteção."
  },
  "5.10": {
    "objectiveId": "5.10",
    "overview": "WLAN com WPA2 PSK exige SSID, política de segurança, chave compartilhada e associação correta ao AP.",
    "whyItMatters": "A configuração deve ser verificada no cliente e na infraestrutura, não apenas salva na GUI.",
    "concepts": [
      "SSID identifica a WLAN; PSK autentica o cliente.",
      "O AP precisa estar ligado à VLAN e ao caminho correto.",
      "Falha de associação, autenticação e DHCP são etapas diferentes."
    ],
    "commands": [
      "show wlan summary",
      "show wireless client summary",
      "show vlan brief",
      "show interfaces trunk"
    ],
    "scenario": "O cliente autentica, mas recebe endereço de outra VLAN. A senha está correta; investigue mapeamento WLAN-VLAN e trunk.",
    "checkPrompt": "Depois da autenticação WPA2 PSK, qual etapa ainda pode falhar?",
    "checkOptions": [
      "DHCP e entrega de VLAN",
      "Criação de chave RSA",
      "Eleição de root bridge",
      "NTP do servidor"
    ],
    "checkAnswer": "DHCP e entrega de VLAN",
    "checkExplanation": "Autenticação bem-sucedida não garante que o cliente esteja na VLAN ou receba DHCP."
  },
  "6.1": {
    "objectiveId": "6.1",
    "overview": "Automação reduz tarefas repetitivas, mas exige fonte de verdade, validação e controle de mudança.",
    "whyItMatters": "O ganho de escala só é real quando o processo é idempotente, auditável e reversível.",
    "concepts": [
      "Automação diminui variação e tempo operacional.",
      "Idempotência permite repetir sem efeitos inesperados.",
      "Guardrails, revisão e rollback reduzem o blast radius."
    ],
    "commands": [
      "show running-config",
      "show archive",
      "show configuration commit list"
    ],
    "scenario": "Antes de alterar cem switches, valide a intenção em laboratório, aplique em lote pequeno e compare estado esperado com estado observado.",
    "checkPrompt": "Qual propriedade permite repetir uma automação com resultado estável?",
    "checkOptions": [
      "Idempotência",
      "Flooding",
      "Broadcast",
      "NAT overload"
    ],
    "checkAnswer": "Idempotência",
    "checkExplanation": "Uma operação idempotente converge para o mesmo estado quando repetida."
  },
  "6.2": {
    "objectiveId": "6.2",
    "overview": "Redes tradicionais distribuem decisões por dispositivos; modelos controller-based centralizam intenção e política.",
    "whyItMatters": "A comparação envolve controle, telemetria, consistência e pontos de falha, não apenas “manual versus automático”.",
    "concepts": [
      "Modelo tradicional configura cada dispositivo localmente.",
      "Controller-based usa uma visão de política e traduz intenção.",
      "Controlador adiciona dependência e precisa de alta disponibilidade."
    ],
    "commands": [
      "show running-config",
      "show platform software yang-management process",
      "show management interface"
    ],
    "scenario": "Uma política de acesso deve ser igual em muitos switches. Um controlador reduz divergência, mas o plano de fallback e a saúde do controlador precisam ser projetados.",
    "checkPrompt": "O que caracteriza um modelo controller-based?",
    "checkOptions": [
      "Política centralizada traduzida aos dispositivos",
      "Cada porta configurada sem padrão",
      "Ausência de telemetria",
      "Uso obrigatório de hubs"
    ],
    "checkAnswer": "Política centralizada traduzida aos dispositivos",
    "checkExplanation": "O controlador concentra intenção/política e automatiza sua aplicação na infraestrutura."
  },
  "6.3": {
    "objectiveId": "6.3",
    "overview": "SDN separa planos e usa underlay, overlay, fabric e APIs para escalar políticas.",
    "whyItMatters": "A prova testa se você sabe onde cada função vive e como aplicações conversam com a rede.",
    "concepts": [
      "Underlay fornece conectividade IP; overlay cria a rede lógica sobre ela.",
      "Control plane calcula decisões; data plane encaminha.",
      "Northbound liga aplicações ao controlador; southbound liga controlador a dispositivos."
    ],
    "commands": [
      "show ip route",
      "show lisp session",
      "show vxlan tunnel",
      "show platform software fed switch active"
    ],
    "scenario": "Um overlay não sobe porque os endpoints não têm reachability no underlay. Valide a base física e IP antes de depurar a política lógica.",
    "checkPrompt": "Qual camada transporta o tráfego base sobre o qual o overlay é construído?",
    "checkOptions": [
      "Underlay",
      "Northbound API",
      "Data model",
      "MIB"
    ],
    "checkAnswer": "Underlay",
    "checkExplanation": "O underlay fornece a conectividade de transporte para o overlay."
  },
  "6.4": {
    "objectiveId": "6.4",
    "overview": "IA generativa, ML preditivo e AIOps apoiam operações, mas não substituem evidência e governança.",
    "whyItMatters": "O valor está em detectar anomalias, resumir sinais e sugerir ações com segurança.",
    "concepts": [
      "ML preditivo aprende padrões para antecipar eventos.",
      "IA generativa cria ou resume conteúdo e configurações.",
      "Ação automática precisa de validação, limites e explicabilidade suficiente."
    ],
    "commands": [
      "show logging",
      "show interfaces counters errors",
      "show processes cpu sorted"
    ],
    "scenario": "Um modelo sugere desligar uma interface com pico de erros. Antes da ação, confirme topologia, janela de mudança e impacto.",
    "checkPrompt": "Qual é um uso preditivo de ML em operações?",
    "checkOptions": [
      "Antecipar anomalia de latência",
      "Trocar um cabo fisicamente",
      "Criar uma VLAN manualmente",
      "Desligar logs"
    ],
    "checkAnswer": "Antecipar anomalia de latência",
    "checkExplanation": "Modelos preditivos identificam padrões que podem indicar falhas futuras."
  },
  "6.5": {
    "objectiveId": "6.5",
    "overview": "REST expõe recursos por HTTP, autenticação e representação de dados; CRUD mapeia operações a intenções.",
    "whyItMatters": "Automação segura depende de método correto, código de retorno, autenticação e validação do payload.",
    "concepts": [
      "GET consulta; POST cria; PUT/PATCH atualiza; DELETE remove.",
      "Autenticação e autorização são distintas.",
      "JSON é uma representação comum; status HTTP ajuda a diagnosticar o resultado."
    ],
    "commands": [
      "GET /restconf/data/...",
      "POST /restconf/data/...",
      "PATCH /restconf/data/...",
      "DELETE /restconf/data/..."
    ],
    "scenario": "Uma integração recebe 401 antes de avaliar o payload. Corrija autenticação; um 400 depois disso aponta para corpo ou modelo inválido.",
    "checkPrompt": "Qual verbo normalmente consulta um recurso sem alterá-lo?",
    "checkOptions": [
      "GET",
      "POST",
      "PATCH",
      "DELETE"
    ],
    "checkAnswer": "GET",
    "checkExplanation": "GET é usado para recuperar uma representação do recurso."
  },
  "6.6": {
    "objectiveId": "6.6",
    "overview": "Ansible e Terraform automatizam infraestrutura, mas trabalham com modelos e ciclos diferentes.",
    "whyItMatters": "Escolher a ferramenta certa reduz drift e evita misturar configuração de estado com execução imperativa.",
    "concepts": [
      "Ansible usa playbooks e módulos para tarefas/configuração.",
      "Terraform declara recursos e mantém estado para provisionamento.",
      "Inventário, variáveis, revisão e plano devem ser controlados."
    ],
    "commands": [
      "ansible-playbook --check site.yml",
      "terraform plan",
      "terraform apply"
    ],
    "scenario": "Uma mudança de rede deve ser revisada antes de criar recursos. Gere plano, revise diff e aplique com estado remoto protegido quando necessário.",
    "checkPrompt": "Qual comando mostra a prévia de mudanças do Terraform?",
    "checkOptions": [
      "terraform plan",
      "terraform destroy",
      "ansible-pull",
      "show ip route"
    ],
    "checkAnswer": "terraform plan",
    "checkExplanation": "terraform plan calcula e apresenta as mudanças antes da aplicação."
  },
  "6.7": {
    "objectiveId": "6.7",
    "overview": "JSON organiza dados em objetos e arrays com pares chave-valor e tipos explícitos.",
    "whyItMatters": "Ler JSON é necessário para APIs, automação, inventários e troubleshooting de payloads.",
    "concepts": [
      "Objeto usa chaves; array usa colchetes.",
      "Strings, números, booleanos e null têm tipos distintos.",
      "Vírgulas e aspas precisam respeitar a sintaxe; JSON não aceita comentários."
    ],
    "commands": [
      "jq . payload.json",
      "curl -s <url> | jq .",
      "python -m json.tool payload.json"
    ],
    "scenario": "Uma API rejeita o payload com erro 400. Valide a sintaxe, nomes de campos e tipos antes de depurar a rede.",
    "checkPrompt": "Qual estrutura JSON representa uma lista ordenada?",
    "checkOptions": [
      "Array com colchetes",
      "Objeto com chaves",
      "String isolada",
      "Comentário"
    ],
    "checkAnswer": "Array com colchetes",
    "checkExplanation": "Arrays usam colchetes e podem conter valores ou objetos em ordem."
  }
};
