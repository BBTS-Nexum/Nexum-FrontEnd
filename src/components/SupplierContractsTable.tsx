import { Badge } from "./ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { SupplierContract } from "./mockSupplierContracts";

interface SupplierContractsTableProps {
  data: SupplierContract[];
}

export function SupplierContractsTable({ data }: SupplierContractsTableProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "vigente":
        return "bg-green-500 text-white";
      case "vencendo":
        return "bg-yellow-500 text-white";
      case "vencido":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div className="rounded-lg border border-blue-200 bg-white overflow-hidden mt-8">
      <div className="p-4 font-semibold text-lg text-blue-900">Contratos de Fornecedores</div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-blue-600 hover:bg-blue-600">
              <TableHead className="text-white">Fornecedor</TableHead>
              <TableHead className="text-white">Contrato</TableHead>
              <TableHead className="text-white">Objeto</TableHead>
              <TableHead className="text-white">Validade</TableHead>
              <TableHead className="text-white">Status</TableHead>
              <TableHead className="text-white">Valor (R$)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell>{contract.fornecedor}</TableCell>
                <TableCell>{contract.numeroContrato}</TableCell>
                <TableCell>{contract.objeto}</TableCell>
                <TableCell>{contract.validade}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contract.status)}>{contract.status}</Badge>
                </TableCell>
                <TableCell>R$ {contract.valor.toLocaleString("pt-BR")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
