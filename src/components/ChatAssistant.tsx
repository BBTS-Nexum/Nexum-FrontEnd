// src/components/ChatAssistant.tsx

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { gerarPlanoDeCompra } from "../services/aiAgentService"; // Importe o agente
import { InventoryItem } from "./InventoryTable"; // Importe o tipo

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatAssistantProps {
  onToggle: () => void;
  inventoryData: InventoryItem[]; // Recebe os dados do inventário
}

// Interface para o plano de compra que a IA retorna
interface PurchasePlanItem {
    codigo: string;
    acao_sugerida: string;
    quantidade_acao: number;
    justificativa_curta: string;
}

export function ChatAssistant({ onToggle, inventoryData }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Olá! Sou o assistente de IA da NEXUM. Digite 'gerar plano de compras' para receber sugestões de aquisição.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    const aiResponse = await generateAIResponse(input);
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const generateAIResponse = async (userInput: string): Promise<string> => {
    const lowerInput = userInput.toLowerCase();

    if (lowerInput.includes("gerar plano de compras")) {
      try {
        const plan = await gerarPlanoDeCompra(inventoryData);

        if (plan.erro) {
            return `Ocorreu um erro ao contatar o Agente de IA: ${plan.erro}`;
        }
        
        if (plan.mensagem) {
          return plan.mensagem;
        }

        let formattedResponse = "✅ Plano de Compras Gerado pelo Agente de IA:\n\n";
        (plan as PurchasePlanItem[]).forEach(item => {
            formattedResponse += `Código: ${item.codigo}\n`;
            formattedResponse += `  Ação: ${item.acao_sugerida}\n`;
            if (item.quantidade_acao > 0) {
                formattedResponse += `  Quantidade: ${item.quantidade_acao}\n`;
            }
            formattedResponse += `  Justificativa: ${item.justificativa_curta}\n\n`;
        });
        return formattedResponse;

      } catch (error: any) {
        console.error("Erro ao chamar o serviço do agente:", error);
        return `Não foi possível processar a solicitação: ${error.message}`;
      }
    }

    if (lowerInput.includes("crítico")) {
      return "Para uma análise detalhada e sugestões, digite 'gerar plano de compras'.";
    }

    return "Entendi sua pergunta. Para gerar um plano de ação, digite 'gerar plano de compras'.";
  };
  
  // O resto do seu componente JSX continua aqui (sem alterações)
  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="w-6 h-6" />
              <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-semibold">Assistente IA</h3>
              <p className="text-xs text-blue-100">{isLoading ? "Processando..." : "Online"}</p>
            </div>
          </div>
          <button
            onClick={onToggle}
            className="hover:bg-blue-600 rounded p-1 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === "user" ? "flex-row-reverse" : ""
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === "assistant"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-5 h-5" />
                ) : (
                  <User className="w-5 h-5" />
                )}
              </div>
              <div
                className={`flex-1 ${
                  message.role === "user" ? "flex justify-end" : ""
                }`}
              >
                <div
                  className={`px-4 py-2 rounded-lg inline-block max-w-[85%] ${
                    message.role === "assistant"
                      ? "bg-blue-50 text-gray-800"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.role === "assistant"
                        ? "text-gray-500"
                        : "text-blue-100"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex gap-2">
          <Input
            placeholder="Pergunte algo..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Powered by NEXUM AI
        </p>
      </div>
    </div>
  );
}