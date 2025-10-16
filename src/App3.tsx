import { useState } from "react";
import { ChatAssistant } from "./components/ChatAssistant";
import { Settings as SettingsComponent } from "./components/Settings";
import { SupplierTable } from "./components/SupplierTable";
import { SupplierContractsTable } from "./components/SupplierContractsTable";
import { mockSupplierData } from "./components/mockSupplierData";
import { mockSupplierContracts } from "./components/mockSupplierContracts";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Package, Users, FileWarning, Settings as SettingsIcon, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

type ViewType = "fornecedores" | "contratos" | "relatorios" | "settings";

export default function App3() {
  const [activeView, setActiveView] = useState<ViewType>("fornecedores");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  const [search, setSearch] = useState("");

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) alert("Logout realizado com sucesso!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-blue-900 text-white flex flex-col transition-all duration-300 relative`}>
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-300 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl">NEXUM</h1>
                <p className="text-blue-300 text-sm">Fiscal</p>
              </div>
            )}
          </div>
        </div>

        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-3 top-20 bg-blue-800 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-colors z-10">
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveView("fornecedores")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${isSidebarCollapsed ? "justify-center" : "text-left"} ${activeView === "fornecedores" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"}`}>
            <Users className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Fornecedores</span>}
          </button>

          <button onClick={() => setActiveView("contratos")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${isSidebarCollapsed ? "justify-center" : "text-left"} ${activeView === "contratos" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"}`}>
            <FileWarning className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Contratos</span>}
          </button>

          <button onClick={() => setActiveView("relatorios")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${isSidebarCollapsed ? "justify-center" : "text-left"} ${activeView === "relatorios" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"}`}>
            <Package className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Relatórios</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800 space-y-2">
          <button onClick={() => setActiveView("settings")} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${isSidebarCollapsed ? "justify-center" : "text-left"} ${activeView === "settings" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"}`}>
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Configurações</span>}
          </button>
          <button onClick={handleLogout} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${isSidebarCollapsed ? "justify-center" : "text-left"} hover:bg-red-700 text-blue-100`}>
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === "fornecedores" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold">Fornecedores</h2>
                <p className="text-gray-500">Lista e contratos relacionados aos fornecedores</p>
              </div>
              <div className="flex items-center gap-2">
                <Input placeholder="Buscar fornecedor..." value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button variant="outline">Novo Fornecedor</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white p-4 rounded shadow">
                {/* Supplier table (uses component if available) */}
                {typeof SupplierTable === "function" ? (
                  <SupplierTable data={mockSupplierData} />
                ) : (
                  <div>Fornecedores - componente indisponível</div>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Contratos</h3>
                {typeof SupplierContractsTable === "function" ? (
                  <SupplierContractsTable data={mockSupplierContracts} />
                ) : (
                  <div>Contratos - componente indisponível</div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeView === "contratos" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <h2 className="text-2xl font-semibold mb-4">Contratos</h2>
            <div className="bg-white p-6 rounded shadow">(Visão detalhada de contratos)</div>
          </div>
        )}

        {activeView === "relatorios" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <h2 className="text-2xl font-semibold mb-4">Relatórios</h2>
            <div className="bg-white p-6 rounded shadow">(Relatórios fiscais e análises)</div>
          </div>
        )}

        {activeView === "settings" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <SettingsComponent />
          </div>
        )}
      </main>

      {!isChatCollapsed && <ChatAssistant onToggle={() => setIsChatCollapsed(true)} />}
      {isChatCollapsed && (
        <button onClick={() => setIsChatCollapsed(false)} className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-6 rounded-l-lg shadow-lg transition-colors z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
