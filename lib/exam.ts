export type ExamQuestion = {
  id: string;
  domain: string;
  topic: string;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
  practice?: string;
};

export const examQuestions: ExamQuestion[] = [
  {
    id: 'subnet-01',
    domain: 'Network Fundamentals',
    topic: 'IPv4 subnetting',
    difficulty: 'Básico',
    prompt: 'Uma rede 192.168.10.0/26 precisa ser dividida em sub-redes. Qual é o endereço de broadcast da primeira sub-rede?',
    options: ['192.168.10.31', '192.168.10.63', '192.168.10.127', '192.168.10.255'],
    answer: '192.168.10.63',
    explanation: 'Um /26 possui blocos de 64 endereços. A primeira sub-rede vai de 192.168.10.0 a 192.168.10.63; o último endereço é o broadcast.',
  },
  {
    id: 'vlan-01',
    domain: 'Network Access',
    topic: 'VLAN e trunk',
    difficulty: 'Intermediário',
    prompt: 'Dois switches precisam transportar as VLANs 10 e 20 pelo mesmo enlace. Qual configuração é necessária no enlace entre eles?',
    options: ['Porta access na VLAN 10', 'Porta trunk permitindo as VLANs 10 e 20', 'Porta routed com DHCP', 'Porta shutdown para evitar broadcast'],
    answer: 'Porta trunk permitindo as VLANs 10 e 20',
    explanation: 'Uma porta trunk transporta múltiplas VLANs usando 802.1Q. Uma porta access pertence a uma única VLAN.',
    practice: 'Pratique no laboratório de VLANs e trunk.',
  },
  {
    id: 'stp-01',
    domain: 'Network Access',
    topic: 'STP',
    difficulty: 'Intermediário',
    prompt: 'Qual é o principal objetivo do Spanning Tree Protocol em uma rede com enlaces redundantes?',
    options: ['Aumentar o número de endereços IP', 'Evitar loops de camada 2', 'Criptografar quadros Ethernet', 'Distribuir endereços via DHCP'],
    answer: 'Evitar loops de camada 2',
    explanation: 'O STP mantém redundância física, mas bloqueia caminhos de camada 2 quando necessário para evitar loops e tempestades de broadcast.',
  },
  {
    id: 'routing-01',
    domain: 'IP Connectivity',
    topic: 'Tabela de roteamento',
    difficulty: 'Intermediário',
    prompt: 'Um roteador possui rotas 10.0.0.0/8 e 10.10.0.0/16. Para 10.10.20.5, qual rota será escolhida?',
    options: ['10.0.0.0/8, por ser a primeira cadastrada', '10.10.0.0/16, por ter o prefixo mais específico', 'As duas rotas ao mesmo tempo', 'Nenhuma, porque são redes privadas'],
    answer: '10.10.0.0/16, por ter o prefixo mais específico',
    explanation: 'O encaminhamento usa longest prefix match: entre rotas válidas, vence a que possui o maior prefixo correspondente ao destino.',
  },
  {
    id: 'dhcp-01',
    domain: 'IP Services',
    topic: 'DHCP',
    difficulty: 'Básico',
    prompt: 'Um cliente recebe um endereço 169.254.20.8. Qual hipótese deve ser investigada primeiro?',
    options: ['Falha na resolução DNS', 'Falha na obtenção de endereço via DHCP', 'Excesso de rotas estáticas', 'Loop de STP confirmado'],
    answer: 'Falha na obtenção de endereço via DHCP',
    explanation: 'Um endereço 169.254.0.0/16 é APIPA. Ele indica que o host não recebeu uma concessão DHCP válida; verifique conectividade, VLAN, relay e servidor.',
  },
  {
    id: 'security-01',
    domain: 'Security Fundamentals',
    topic: 'Acesso administrativo',
    difficulty: 'Intermediário',
    prompt: 'Qual prática reduz melhor o risco de acesso administrativo não autorizado a um switch?',
    options: ['Usar a mesma senha em todos os dispositivos', 'Permitir Telnet sem restrições', 'Usar SSH, autenticação individual e limitar as linhas VTY', 'Desativar o banner do dispositivo'],
    answer: 'Usar SSH, autenticação individual e limitar as linhas VTY',
    explanation: 'SSH protege a sessão em trânsito. Contas individuais, privilégio mínimo e restrição das linhas VTY melhoram rastreabilidade e controle de acesso.',
  },
];

export function getExamQuestion(index: number): ExamQuestion {
  return examQuestions[index % examQuestions.length];
}

export function isCorrect(question: ExamQuestion, answer: string): boolean {
  return question.answer === answer;
}
