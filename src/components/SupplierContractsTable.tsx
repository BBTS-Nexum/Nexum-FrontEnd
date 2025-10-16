import React from "react";

// Removed duplicate SupplierContractsTable implementation
export function SupplierContractsTable({ data }: { data: any[] }) {
  return (
    <table className="w-full text-left table-auto">
      <thead className="bg-blue-50 text-blue-700">
        <tr>
          <th className="px-3 py-2">Fornecedor</th>
          <th className="px-3 py-2">Contrato</th>
          <th className="px-3 py-2">Validade</th>
          <th className="px-3 py-2">Status</th>
          <th className="px-3 py-2">Valor (R$)</th>
        </tr>
      </thead>
      <tbody>
        {data && data.length > 0 ? (
          data.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="px-3 py-2">{c.fornecedor}</td>
              <td className="px-3 py-2">{c.numeroContrato}</td>
              <td className="px-3 py-2">{c.validade}</td>
              <td className="px-3 py-2">{c.status}</td>
              <td className="px-3 py-2">{c.valor.toLocaleString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={5} className="px-3 py-6 text-center text-gray-500">
              Nenhum contrato encontrado
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default SupplierContractsTable;
// Removed duplicate SupplierContractsTable implementation
