import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export interface InventoryItem {
  id_item: number;
  codigo_item: string;
  descricao_item: string;
  categoria: string;
  unidade_medida: string;
  estoque_atual: number;
  estoque_minimo: number;
  estoque_maximo: number;
  consumo_medio_mensal: number;
  consumo_ultimo_mes: number;
  consumo_tendencia: "alta" | "baixa" | "estavel";
  cobertura_em_dias: number;
  previsao_reposicao: string;
  quantidade_ideal_compra: number;
  status_critico: "critico" | "atencao" | "normal" | "excesso";
  localizacao_estoque: string;
  em_transito: number;
  reservado: number;
  data_ultima_compra: string;
  preco_medio_unitario: number;
  fornecedor_principal: string;
  observacoes?: string;
}

interface InventoryTableProps {
  data: InventoryItem[];
  onAddItem?: () => void;
  onRemoveItem?: (id: number) => void;
}

export function InventoryTable({ data, onAddItem, onRemoveItem }: InventoryTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "critico":
        return "bg-red-500 hover:bg-red-600 text-white";
      case "atencao":
        return "bg-yellow-500 hover:bg-yellow-600 text-white";
      case "normal":
        return "bg-green-500 hover:bg-green-600 text-white";
      case "excesso":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-500 hover:bg-gray-600 text-white";
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "alta":
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case "baixa":
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case "estavel":
        return <Minus className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="text-white min-w-[80px]">ID</TableHead>
              <TableHead className="text-white min-w-[120px]">Código</TableHead>
              <TableHead className="text-white min-w-[250px]">Descrição</TableHead>
              <TableHead className="text-white min-w-[120px]">Categoria</TableHead>
              <TableHead className="text-white min-w-[100px]">Unidade</TableHead>
              <TableHead className="text-white min-w-[120px]">Estoque Atual</TableHead>
              <TableHead className="text-white min-w-[120px]">Estoque Mín.</TableHead>
              <TableHead className="text-white min-w-[120px]">Estoque Máx.</TableHead>
              <TableHead className="text-white min-w-[150px]">Consumo Médio/Mês</TableHead>
              <TableHead className="text-white min-w-[150px]">Consumo Último Mês</TableHead>
              <TableHead className="text-white min-w-[120px]">Tendência</TableHead>
              <TableHead className="text-white min-w-[140px]">Cobertura (dias)</TableHead>
              <TableHead className="text-white min-w-[160px]">Previsão Reposição</TableHead>
              <TableHead className="text-white min-w-[180px]">Qtd. Ideal Compra</TableHead>
              <TableHead className="text-white min-w-[120px]">Status</TableHead>
              <TableHead className="text-white min-w-[150px]">Localização</TableHead>
              <TableHead className="text-white min-w-[120px]">Em Trânsito</TableHead>
              <TableHead className="text-white min-w-[100px]">Reservado</TableHead>
              <TableHead className="text-white min-w-[150px]">Última Compra</TableHead>
              <TableHead className="text-white min-w-[140px]">Preço Médio</TableHead>
              <TableHead className="text-white min-w-[200px]">Fornecedor</TableHead>
              <TableHead className="text-white min-w-[250px]">Observações</TableHead>
              <TableHead className="text-white min-w-[120px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item, index) => (
              <TableRow
                key={item.id_item}
                className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
              >
                <TableCell>{item.id_item}</TableCell>
                <TableCell className="font-mono">{item.codigo_item}</TableCell>
                <TableCell>{item.descricao_item}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    {item.categoria}
                  </Badge>
                </TableCell>
                <TableCell>{item.unidade_medida}</TableCell>
                <TableCell className="text-center">
                  <span className={item.estoque_atual < item.estoque_minimo ? "text-red-600" : ""}>
                    {item.estoque_atual}
                  </span>
                </TableCell>
                <TableCell className="text-center text-gray-600">{item.estoque_minimo}</TableCell>
                <TableCell className="text-center text-gray-600">{item.estoque_maximo}</TableCell>
                <TableCell className="text-center">{item.consumo_medio_mensal}</TableCell>
                <TableCell className="text-center">{item.consumo_ultimo_mes}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {getTrendIcon(item.consumo_tendencia)}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <span className={item.cobertura_em_dias < 30 ? "text-red-600" : ""}>
                    {item.cobertura_em_dias}
                  </span>
                </TableCell>
                <TableCell>{item.previsao_reposicao}</TableCell>
                <TableCell className="text-center">{item.quantidade_ideal_compra}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(item.status_critico)}>
                    {item.status_critico === "critico" && <AlertTriangle className="w-3 h-3 mr-1" />}
                    {item.status_critico.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{item.localizacao_estoque}</TableCell>
                <TableCell className="text-center">{item.em_transito}</TableCell>
                <TableCell className="text-center">{item.reservado}</TableCell>
                <TableCell>{item.data_ultima_compra}</TableCell>
                <TableCell>R$ {item.preco_medio_unitario.toFixed(2)}</TableCell>
                <TableCell>{item.fornecedor_principal}</TableCell>
                <TableCell className="text-gray-600">{item.observacoes || "-"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {onAddItem && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-300 hover:bg-green-50"
                        onClick={onAddItem}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    )}
                    {onRemoveItem && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-300 hover:bg-red-50"
                        onClick={() => onRemoveItem(item.id_item)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
