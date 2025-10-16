import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { CheckCircle, Package, Calendar } from "lucide-react";

interface HistoryItem {
  id: string;
  pedido_numero: string;
  data_compra: string;
  data_entrega: string;
  fornecedor: string;
  itens: {
    codigo: string;
    descricao: string;
    quantidade: number;
    preco_unitario: number;
  }[];
  valor_total: number;
  status: "entregue" | "em_transito" | "cancelada";
}

export function PurchaseHistory() {
  const history: HistoryItem[] = [
    {
      id: "HIST-001",
      pedido_numero: "PO-2025-089",
      data_compra: "2025-09-15",
      data_entrega: "2025-09-22",
      fornecedor: "TechParts Ltda",
      itens: [
        {
          codigo: "MT-2024-001",
          descricao: "Resistor 10K Ohm 1/4W",
          quantidade: 1000,
          preco_unitario: 0.15,
        },
        {
          codigo: "MT-2024-002",
          descricao: "Capacitor Eletrolítico 100uF",
          quantidade: 500,
          preco_unitario: 0.35,
        },
      ],
      valor_total: 325.0,
      status: "entregue",
    },
    {
      id: "HIST-002",
      pedido_numero: "PO-2025-092",
      data_compra: "2025-09-20",
      data_entrega: "2025-10-28",
      fornecedor: "FioMax Distribuidora",
      itens: [
        {
          codigo: "CB-2024-033",
          descricao: "Cabo Flexível 0.5mm²",
          quantidade: 1000,
          preco_unitario: 1.2,
        },
      ],
      valor_total: 1200.0,
      status: "em_transito",
    },
    {
      id: "HIST-003",
      pedido_numero: "PO-2025-085",
      data_compra: "2025-09-01",
      data_entrega: "2025-09-08",
      fornecedor: "EletroSupply",
      itens: [
        {
          codigo: "MT-2024-003",
          descricao: "LED Vermelho 5mm",
          quantidade: 1000,
          preco_unitario: 0.25,
        },
      ],
      valor_total: 250.0,
      status: "entregue",
    },
    {
      id: "HIST-004",
      pedido_numero: "PO-2025-078",
      data_compra: "2025-08-20",
      data_entrega: "2025-08-27",
      fornecedor: "PCB Solutions",
      itens: [
        {
          codigo: "MQ-2024-010",
          descricao: "Placa de Circuito Impresso PCB",
          quantidade: 1000,
          preco_unitario: 4.5,
        },
      ],
      valor_total: 4500.0,
      status: "entregue",
    },
    {
      id: "HIST-005",
      pedido_numero: "PO-2025-095",
      data_compra: "2025-09-08",
      data_entrega: "2025-10-22",
      fornecedor: "SensorTech Brasil",
      itens: [
        {
          codigo: "SM-2024-089",
          descricao: "Sensor de Temperatura DS18B20",
          quantidade: 200,
          preco_unitario: 8.75,
        },
      ],
      valor_total: 1750.0,
      status: "em_transito",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "entregue":
        return "bg-green-100 text-green-800 border-green-300";
      case "em_transito":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const totalCompras = history.filter((h) => h.status === "entregue").length;
  const valorTotal = history
    .filter((h) => h.status === "entregue")
    .reduce((acc, h) => acc + h.valor_total, 0);
  const emTransito = history.filter((h) => h.status === "em_transito").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl text-gray-900">Histórico de Compras</h2>
        <p className="text-gray-500">
          Registro completo de todas as compras realizadas
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Compras Realizadas</p>
              <p className="text-3xl mt-1">{totalCompras}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Valor Total Gasto</p>
              <p className="text-3xl mt-1">R$ {(valorTotal / 1000).toFixed(1)}k</p>
            </div>
            <Calendar className="w-10 h-10 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Em Trânsito</p>
              <p className="text-3xl mt-1">{emTransito}</p>
            </div>
            <Package className="w-10 h-10 text-orange-200" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-blue-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-blue-600 hover:bg-blue-600">
                <TableHead className="text-white">Nº Pedido</TableHead>
                <TableHead className="text-white">Data Compra</TableHead>
                <TableHead className="text-white">Data Entrega</TableHead>
                <TableHead className="text-white">Fornecedor</TableHead>
                <TableHead className="text-white">Itens</TableHead>
                <TableHead className="text-white">Valor Total</TableHead>
                <TableHead className="text-white">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => (
                <TableRow
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-blue-50"}
                >
                  <TableCell className="font-mono">{item.pedido_numero}</TableCell>
                  <TableCell>{item.data_compra}</TableCell>
                  <TableCell>{item.data_entrega}</TableCell>
                  <TableCell>{item.fornecedor}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.itens.map((subItem, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-mono text-gray-600">
                            {subItem.codigo}
                          </span>
                          {" - "}
                          <span className="text-gray-800">
                            {subItem.descricao}
                          </span>
                          <span className="text-gray-500">
                            {" "}
                            ({subItem.quantidade} un)
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>R$ {item.valor_total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={getStatusColor(item.status)}
                    >
                      {item.status === "entregue" && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {item.status === "em_transito" && (
                        <Package className="w-3 h-3 mr-1" />
                      )}
                      {item.status.replace("_", " ").toUpperCase()}
                    </Badge>
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
