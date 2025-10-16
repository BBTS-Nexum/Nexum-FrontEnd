import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  Lightbulb,
  DollarSign,
} from "lucide-react";

interface Suggestion {
  id: string;
  item_codigo: string;
  item_descricao: string;
  estoque_atual: number;
  cobertura_dias: number;
  quantidade_sugerida: number;
  preco_estimado: number;
  valor_total: number;
  prioridade: "alta" | "média" | "baixa";
  motivo_ia: string;
  economia_potencial?: number;
  tendencia: string;
}

export function PurchaseSuggestions() {
  const suggestions: Suggestion[] = [
    {
      id: "SUG-001",
      item_codigo: "MT-2024-001",
      item_descricao: "Resistor 10K Ohm 1/4W",
      estoque_atual: 250,
      cobertura_dias: 16,
      quantidade_sugerida: 1500,
      preco_estimado: 0.15,
      valor_total: 225.0,
      prioridade: "alta",
      motivo_ia:
        "Estoque crítico com apenas 16 dias de cobertura. Consumo em alta (+15%). Risco de ruptura iminente.",
      tendencia: "Consumo crescente",
    },
    {
      id: "SUG-002",
      item_codigo: "CB-2024-033",
      item_descricao: "Cabo Flexível 0.5mm² Vermelho",
      estoque_atual: 280,
      cobertura_dias: 14,
      quantidade_sugerida: 2000,
      preco_estimado: 1.2,
      valor_total: 2400.0,
      prioridade: "alta",
      motivo_ia:
        "Crítico para produção. Tendência de consumo em alta. Fornecedor possui lead time de 15 dias.",
      tendencia: "Consumo crescente",
    },
    {
      id: "SUG-003",
      item_codigo: "MT-2024-003",
      item_descricao: "LED Vermelho 5mm",
      estoque_atual: 650,
      cobertura_dias: 48,
      quantidade_sugerida: 1000,
      preco_estimado: 0.25,
      valor_total: 250.0,
      prioridade: "média",
      motivo_ia:
        "Oportunidade de compra combinada para otimizar frete. Estoque em nível de atenção.",
      economia_potencial: 45.0,
      tendencia: "Consumo estável",
    },
    {
      id: "SUG-004",
      item_codigo: "SM-2024-089",
      item_descricao: "Sensor de Temperatura DS18B20",
      estoque_atual: 95,
      cobertura_dias: 28,
      quantidade_sugerida: 300,
      preco_estimado: 8.75,
      valor_total: 2625.0,
      prioridade: "alta",
      motivo_ia:
        "Tendência de alta no consumo (+37%). IA prevê aumento de demanda nos próximos 60 dias.",
      tendencia: "Consumo crescente",
    },
    {
      id: "SUG-005",
      item_codigo: "TR-2024-067",
      item_descricao: "Transformador 12V 2A",
      estoque_atual: 180,
      cobertura_dias: 45,
      quantidade_sugerida: 200,
      preco_estimado: 18.9,
      valor_total: 3780.0,
      prioridade: "média",
      motivo_ia:
        "Pedido em trânsito chegará em breve. Sugestão preventiva para manter estoque de segurança.",
      tendencia: "Consumo estável",
    },
    {
      id: "SUG-006",
      item_codigo: "FE-2024-025",
      item_descricao: "Parafuso M3x10mm Inox",
      estoque_atual: 4500,
      cobertura_dias: 54,
      quantidade_sugerida: 5000,
      preco_estimado: 0.08,
      valor_total: 400.0,
      prioridade: "baixa",
      motivo_ia:
        "Preço favorável detectado. Compra em volume maior pode garantir economia de 12%.",
      economia_potencial: 48.0,
      tendencia: "Consumo crescente",
    },
  ];

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "média":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "baixa":
        return "bg-green-500 hover:bg-green-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const totalSugestoes = suggestions.length;
  const valorTotalSugerido = suggestions.reduce(
    (acc, s) => acc + s.valor_total,
    0
  );
  const economiaPotencial = suggestions
    .filter((s) => s.economia_potencial)
    .reduce((acc, s) => acc + (s.economia_potencial || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Sugestões de Compras</h2>
        <p className="text-gray-500">
          Recomendações inteligentes baseadas em análise preditiva de IA
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Sugestões Ativas</p>
              <p className="text-3xl mt-1">{totalSugestoes}</p>
            </div>
            <Lightbulb className="w-10 h-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Valor Total Sugerido</p>
              <p className="text-3xl mt-1">
                R$ {(valorTotalSugerido / 1000).toFixed(1)}k
              </p>
            </div>
            <ShoppingCart className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Economia Potencial</p>
              <p className="text-3xl mt-1">R$ {economiaPotencial.toFixed(0)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-green-200" />
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="bg-purple-100 rounded-full p-3">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg mb-2 text-gray-900">Insights da IA</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>
                  <strong>2 itens críticos</strong> necessitam compra urgente nas
                  próximas 72 horas para evitar ruptura de estoque
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>
                  Comprando em conjunto, você pode{" "}
                  <strong>economizar R$ 93,00 em frete</strong> consolidado
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>
                  <strong>3 itens</strong> apresentam tendência de alta no consumo
                  - considere aumentar estoque de segurança
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-blue-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-600">
                <TableHead className="text-white">Código</TableHead>
                <TableHead className="text-white">Descrição</TableHead>
                <TableHead className="text-white">Estoque Atual</TableHead>
                <TableHead className="text-white">Cobertura</TableHead>
                <TableHead className="text-white">Qtd Sugerida</TableHead>
                <TableHead className="text-white">Preço Unit.</TableHead>
                <TableHead className="text-white">Valor Total</TableHead>
                <TableHead className="text-white">Prioridade</TableHead>
                <TableHead className="text-white">Análise IA</TableHead>
                <TableHead className="text-white">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suggestions.map((suggestion, index) => (
                <TableRow
                  key={suggestion.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <TableCell className="font-mono">
                    {suggestion.item_codigo}
                  </TableCell>
                  <TableCell>{suggestion.item_descricao}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        suggestion.cobertura_dias < 30 ? "text-red-600" : ""
                      }
                    >
                      {suggestion.estoque_atual}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        suggestion.cobertura_dias < 30 ? "text-red-600" : ""
                      }
                    >
                      {suggestion.cobertura_dias} dias
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    {suggestion.quantidade_sugerida}
                  </TableCell>
                  <TableCell>R$ {suggestion.preco_estimado.toFixed(2)}</TableCell>
                  <TableCell>
                    <div>
                      <div>R$ {suggestion.valor_total.toFixed(2)}</div>
                      {suggestion.economia_potencial && (
                        <div className="text-xs text-green-600">
                          Economiza R$ {suggestion.economia_potencial.toFixed(2)}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(suggestion.prioridade)}>
                      {suggestion.prioridade === "alta" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {suggestion.prioridade === "média" && (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      )}
                      {suggestion.prioridade.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-sm">
                    <div className="space-y-1">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-600">
                          {suggestion.motivo_ia}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <TrendingUp className="w-3 h-3" />
                        {suggestion.tendencia}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                      <ShoppingCart className="w-3 h-3" />
                      Criar Requisição
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
