import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface PurchaseRequest {
  id: string;
  item_codigo: string;
  item_descricao: string;
  quantidade_solicitada: number;
  preco_estimado: number;
  valor_total: number;
  urgencia: "alta" | "média" | "baixa";
  status: "pendente" | "aprovada" | "rejeitada";
  previsao_ia: string;
  justificativa: string;
  data_solicitacao: string;
  solicitante: string;
}

export function PurchaseRequests() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([
    {
      id: "REQ-001",
      item_codigo: "MT-2024-001",
      item_descricao: "Resistor 10K Ohm 1/4W",
      quantidade_solicitada: 1000,
      preco_estimado: 0.15,
      valor_total: 150.0,
      urgencia: "alta",
      status: "pendente",
      previsao_ia:
        "IA prevê ruptura de estoque em 12 dias. Tendência de consumo em alta (+15%). Recomenda compra urgente.",
      justificativa: "Estoque crítico - apenas 16 dias de cobertura",
      data_solicitacao: "2025-10-15",
      solicitante: "Sistema IA",
    },
    {
      id: "REQ-002",
      item_codigo: "CB-2024-033",
      item_descricao: "Cabo Flexível 0.5mm² Vermelho",
      quantidade_solicitada: 1000,
      preco_estimado: 1.2,
      valor_total: 1200.0,
      urgencia: "alta",
      status: "pendente",
      previsao_ia:
        "IA indica risco de paralisação da produção em 10 dias. Consumo acima da média. Compra urgente necessária.",
      justificativa: "Estoque crítico para produção",
      data_solicitacao: "2025-10-15",
      solicitante: "Sistema IA",
    },
    {
      id: "REQ-003",
      item_codigo: "MT-2024-003",
      item_descricao: "LED Vermelho 5mm",
      quantidade_solicitada: 1000,
      preco_estimado: 0.25,
      valor_total: 250.0,
      urgencia: "média",
      status: "pendente",
      previsao_ia:
        "Estoque adequado por 48 dias. IA sugere compra preventiva para otimizar custos de frete compartilhado.",
      justificativa: "Otimização de pedido",
      data_solicitacao: "2025-10-14",
      solicitante: "Sistema IA",
    },
    {
      id: "REQ-004",
      item_codigo: "SM-2024-089",
      item_descricao: "Sensor de Temperatura DS18B20",
      quantidade_solicitada: 200,
      preco_estimado: 8.75,
      valor_total: 1750.0,
      urgencia: "média",
      status: "aprovada",
      previsao_ia:
        "Tendência de alta no consumo (+37%). IA recomenda aumentar estoque de segurança.",
      justificativa: "Demanda crescente identificada",
      data_solicitacao: "2025-10-13",
      solicitante: "Sistema IA",
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({
    item_codigo: "",
    item_descricao: "",
    quantidade: "",
    preco: "",
  });

  const getUrgencyColor = (urgencia: string) => {
    switch (urgencia) {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pendente":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "aprovada":
        return "bg-green-100 text-green-800 border-green-300";
      case "rejeitada":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pendente":
        return <Clock className="w-3 h-3" />;
      case "aprovada":
        return <CheckCircle className="w-3 h-3" />;
      case "rejeitada":
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const handleApprove = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "aprovada" as const } : req))
    );
  };

  const handleReject = (id: string) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: "rejeitada" as const } : req))
    );
  };

  const handleCreateRequest = () => {
    const request: PurchaseRequest = {
      id: `REQ-${String(requests.length + 1).padStart(3, "0")}`,
      item_codigo: newRequest.item_codigo,
      item_descricao: newRequest.item_descricao,
      quantidade_solicitada: parseInt(newRequest.quantidade),
      preco_estimado: parseFloat(newRequest.preco),
      valor_total: parseInt(newRequest.quantidade) * parseFloat(newRequest.preco),
      urgencia: "média",
      status: "pendente",
      previsao_ia: "Requisição manual. IA aguardando dados históricos para análise.",
      justificativa: "Requisição manual do usuário",
      data_solicitacao: new Date().toISOString().split("T")[0],
      solicitante: "Usuário",
    };

    setRequests((prev) => [...prev, request]);
    setNewRequest({ item_codigo: "", item_descricao: "", quantidade: "", preco: "" });
    setIsDialogOpen(false);
  };

  const pendingCount = requests.filter((r) => r.status === "pendente").length;
  const totalValue = requests
    .filter((r) => r.status === "pendente")
    .reduce((acc, r) => acc + r.valor_total, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl text-gray-900">Requisições de Compras</h2>
          <p className="text-gray-500">
            Análises preditivas e sugestões geradas por IA
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <ShoppingCart className="w-4 h-4" />
              Nova Requisição
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Requisição de Compra</DialogTitle>
              <DialogDescription>
                Criar uma nova requisição de compra manual
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="codigo">Código do Item</Label>
                <Input
                  id="codigo"
                  value={newRequest.item_codigo}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, item_codigo: e.target.value })
                  }
                  placeholder="Ex: MT-2024-001"
                />
              </div>
              <div>
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={newRequest.item_descricao}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, item_descricao: e.target.value })
                  }
                  placeholder="Ex: Resistor 10K Ohm"
                />
              </div>
              <div>
                <Label htmlFor="quantidade">Quantidade</Label>
                <Input
                  id="quantidade"
                  type="number"
                  value={newRequest.quantidade}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, quantidade: e.target.value })
                  }
                  placeholder="Ex: 1000"
                />
              </div>
              <div>
                <Label htmlFor="preco">Preço Unitário (R$)</Label>
                <Input
                  id="preco"
                  type="number"
                  step="0.01"
                  value={newRequest.preco}
                  onChange={(e) =>
                    setNewRequest({ ...newRequest, preco: e.target.value })
                  }
                  placeholder="Ex: 0.15"
                />
              </div>
              <Button
                onClick={handleCreateRequest}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Criar Requisição
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Requisições Pendentes</p>
              <p className="text-3xl mt-1">{pendingCount}</p>
            </div>
            <Clock className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Valor Total Pendente</p>
              <p className="text-3xl mt-1">R$ {totalValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Sugestões IA</p>
              <p className="text-3xl mt-1">{requests.filter(r => r.solicitante === "Sistema IA").length}</p>
            </div>
            <Sparkles className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-blue-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-600">
                <TableHead className="text-white">ID</TableHead>
                <TableHead className="text-white">Código</TableHead>
                <TableHead className="text-white">Descrição</TableHead>
                <TableHead className="text-white">Quantidade</TableHead>
                <TableHead className="text-white">Preço Unit.</TableHead>
                <TableHead className="text-white">Valor Total</TableHead>
                <TableHead className="text-white">Urgência</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Análise IA</TableHead>
                <TableHead className="text-white">Data</TableHead>
                <TableHead className="text-white">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request, index) => (
                <TableRow
                  key={request.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <TableCell>{request.id}</TableCell>
                  <TableCell className="font-mono">{request.item_codigo}</TableCell>
                  <TableCell>{request.item_descricao}</TableCell>
                  <TableCell className="text-center">
                    {request.quantidade_solicitada}
                  </TableCell>
                  <TableCell>R$ {request.preco_estimado.toFixed(2)}</TableCell>
                  <TableCell>R$ {request.valor_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={getUrgencyColor(request.urgencia)}>
                      {request.urgencia === "alta" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {request.urgencia.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(request.status)}
                    >
                      {getStatusIcon(request.status)}
                      <span className="ml-1">{request.status.toUpperCase()}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-600">{request.previsao_ia}</p>
                    </div>
                  </TableCell>
                  <TableCell>{request.data_solicitacao}</TableCell>
                  <TableCell>
                    {request.status === "pendente" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 border-green-300 hover:bg-green-50"
                        >
                          Aprovar
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          Rejeitar
                        </Button>
                      </div>
                    )}
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
