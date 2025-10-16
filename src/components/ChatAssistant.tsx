// src/components/ChatAssistant.tsx (Sugestão de melhoria)

// ... (imports e interfaces)

// Lógica de respostas separada para facilitar a manutenção
const responses: { keywords: string[]; response: string }[] = [
  {
    keywords: ["crítico", "critico"],
    response: "Atualmente temos 2 itens em status crítico:\n\n• Resistor 10K Ohm - Apenas 16 dias de cobertura\n• Cabo Flexível 0.5mm² - Apenas 14 dias de cobertura\n\nRecomendo criar requisições de compra urgentes para estes itens.",
  },
  {
    keywords: ["compra", "requisição", "requisicao"],
    response: "Baseado na análise preditiva, sugiro as seguintes compras prioritárias:\n\n1. Resistor 10K Ohm - Qtd: 1.000 un\n2. Cabo Flexível - Qtd: 1.000 m\n3. LED Vermelho - Qtd: 1.000 un\n\nTotal estimado: R$ 1.650,00\nTempo de cobertura após compra: 90-120 dias",
  },
  // ... (outras respostas)
];

const defaultResponse = "Entendi sua pergunta. Posso ajudá-lo com:\n\n• Análise de itens críticos\n• Previsões de compra\n• Sugestões de economia\n• Tendências de consumo\n• Otimização de estoque\n\nO que você gostaria de saber?";

const generateAIResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  const foundResponse = responses.find(r => r.keywords.some(k => lowerInput.includes(k)));
  return foundResponse ? foundResponse.response : defaultResponse;
};


export function ChatAssistant({ onToggle }: ChatAssistantProps) {
    // ... (resto do componente sem alterações)
}
