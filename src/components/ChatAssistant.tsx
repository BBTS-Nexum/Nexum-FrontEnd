// src/components/ChatAssistant.tsx

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Send, Bot, User, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  onToggle: () => void;
}

// Lógica de respostas da IA agora é orientada a dados para facilitar a manutenção
const aiResponses = [
  {
    keywords: ["crítico", "critico"],
    response: "Atualmente temos 2 itens em status crítico:\n\n• Resistor 10K Ohm - Apenas 16 dias de cobertura\n• Cabo Flexível 0.5mm² - Apenas 14 dias de cobertura\n\nRecomendo criar requisições de compra urgentes para estes itens.",
  },
  {
    keywords: ["compra", "requisição", "requisicao"],
    response: "Baseado na análise preditiva, sugiro as seguintes compras prioritárias:\n\n1. Resistor 10K Ohm - Qtd: 1.000 un\n2. Cabo Flexível - Qtd: 1.000 m\n3. LED Vermelho - Qtd: 1.000 un\n\nTotal estimado: R$ 1.650,00\nTempo de cobertura após compra: 90-120 dias",
  },
  {
    keywords: ["estoque", "inventário", "inventario"],
    response: "Resumo do inventário:\n\n• Total de itens: 12\n• Itens críticos: 2\n• Itens requerendo atenção: 3\n• Valor total: R$ 42.8k\n• Cobertura média: 68 dias\n\nO estoque está 83% dentro dos parâmetros ideais.",
  },
    {
      keywords: ["previsão", "previsao", "tendência", "tendencia"],
      response: "Análise de tendências:\n\n📈 Em alta: Resistores, Cabos, Sensores\n📊 Estável: Capacitores, PCBs, Conectores\n📉 Em baixa: LEDs, Transformadores\n\nRecomendo ajustar os estoques mínimos dos itens em alta."
  },
  {
      keywords: ["economia", "economizar", "reduzir"],
      response: "Oportunidades de economia identificadas:\n\n1. PCB 10x15cm está com excesso - Economize R$ 4.500 reduzindo próximo pedido\n2. Conectores DB9 têm 138 dias de cobertura - Pode postergar compra em 2 meses\n\nEconomia potencial: R$ 5.200"
  }
];

const defaultResponse = "Não entendi sua pergunta. Posso ajudá-lo com:\n\n• Análise de itens críticos\n• Previsões de compra\n• Sugestões de economia\n• Otimização de estoque";

const generateAIResponse = (userInput: string): string => {
  const lowerInput = userInput.toLowerCase();
  const foundResponse = aiResponses.find(r => r.keywords.some(k => lowerInput.includes(k)));
  return foundResponse ? foundResponse.response : defaultResponse;
};

export function ChatAssistant({ onToggle }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial-message",
      role: "assistant",
      content: "Olá! Sou o assistente de IA do NEXUM. Como posso ajudar com análises e previsões?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simula a resposta da IA com um pequeno atraso
    setTimeout(() => {
      const aiResponse = generateAIResponse(input);
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full relative">
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-semibold">Assistente IA</h3>
              <p className="text-xs text-blue-100">Online</p>
            </div>
          </div>
          <button onClick={onToggle} className="hover:bg-blue-600 rounded p-1 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === "assistant" ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}`}>
                {message.role === "assistant" ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
              </div>
              <div className={`flex-1 ${message.role === "user" ? "flex justify-end" : ""}`}>
                <div className={`px-4 py-2 rounded-lg inline-block max-w-[85%] ${message.role === "assistant" ? "bg-blue-50 text-gray-800" : "bg-blue-600 text-white"}`}>
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className={`text-xs mt-1 text-right ${message.role === "assistant" ? "text-gray-500" : "text-blue-100"}`}>
                    {message.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Pergunte algo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-blue-600 hover:bg-blue-700">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Powered by NEXUM AI</p>
      </div>
    </div>
  );
}