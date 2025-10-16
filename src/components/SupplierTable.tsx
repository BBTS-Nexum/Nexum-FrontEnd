import React from "react";

export function SupplierTable({ data }: { data: any[] }) {
	return (
		<table className="w-full text-left table-auto">
			<thead className="bg-blue-50 text-blue-700">
				<tr>
					<th className="px-3 py-2">Nome</th>
					<th className="px-3 py-2">CNPJ</th>
					<th className="px-3 py-2">Categoria</th>
					<th className="px-3 py-2">Status</th>
				</tr>
			</thead>
			<tbody>
				{data && data.length > 0 ? (
					data.map((s) => (
						<tr key={s.id} className="border-t">
							<td className="px-3 py-2">{s.nome}</td>
							<td className="px-3 py-2">{s.cnpj}</td>
							<td className="px-3 py-2">{s.categoria}</td>
							<td className="px-3 py-2">{s.status}</td>
						</tr>
					))
				) : (
					<tr>
						<td colSpan={4} className="px-3 py-6 text-center text-gray-500">
							Nenhum fornecedor encontrado
						</td>
					</tr>
				)}
			</tbody>
		</table>
	);
}

export default SupplierTable;
