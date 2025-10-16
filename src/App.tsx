// src/App.tsx (Versão Final Corrigida)

import { useState, useEffect } from "react";
import { InventoryTable, InventoryItem } from "./components/InventoryTable";
import { ChatAssistant } from "./components/ChatAssistant";
import { PurchaseRequests } from "./components/PurchaseRequests";
import { PurchaseHistory } from "./components/PurchaseHistory";
import { PurchaseSuggestions } from "./components/PurchaseSuggestions";
import { Settings as SettingsComponent } from "./components/Settings";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";
import {
  Package,
  Settings as SettingsIcon,
  ShoppingCart,
  History,
  Lightbulb,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Plus,
} from "lucide-react";
import { login, getProducts, Produto } from "./services/apiService";

// Tipos
type ViewType =
  | "inventory"
  | "purchase-requests"
  | "purchase-history"
  | "suggestions"
  | "settings";

// Função Helper segura para mapear dados da API
const mapProdutoToInventoryItem = (produto: Produto): InventoryItem => {
  return {
    id_item: produto.id,
    codigo_item: produto.codigo || '',
    descricao_item: produto.descricao || '',
    categoria: produto.tipo || 'Não definida',
    unidade_medida: produto.unidade_medida || 'UN',
    estoque_atual: produto.saldo_total || 0,
    estoque_minimo: 50,
    estoque_maximo: 200,
    consumo_medio_mensal: produto.cmm || 0,
    consumo_ultimo_mes: 0,
    consumo_tendencia: 'estavel',
    cobertura_em_dias: produto.cobertura || 0,
    previsao_reposicao: "A definir",
    quantidade_ideal_compra: 0,
    status_critico: (produto.status || 'normal').toLowerCase() as InventoryItem['status_critico'],
    localizacao_estoque: produto.localizacao || 'N/A',
    em_transito: produto.em_transito || 0,
    reservado: produto.reservado || 0,
    data_ultima_compra: "A definir",
    preco_medio_unitario: produto.preco_medio || 0,
    fornecedor_principal: produto.fornecedor_principal || 'Não definido',
  };
};

export default function App() {
  // Estados
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  const [email, setEmail] = useState('admin@nexum.com');
  const [senha, setSenha] = useState('Admin@123');
  const [activeView, setActiveView] = useState<ViewType>("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  // Lógica de Autenticação
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      const data = await login({ email, senha });
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (error: any) {
      console.error("Erro detalhado do login:", error);
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem('authToken');
      setToken(null);
      setInventoryData([]);
    }
  };

  // Efeito para buscar dados da API
  useEffect(() => {
    if (token) {
      const fetchProducts = async () => {
        setLoading(true);
        setDataError(null);
        try {
          const produtosDaApi = await getProducts(token);
          const itemsFormatados = produtosDaApi.map(mapProdutoToInventoryItem);
          setInventoryData(itemsFormatados);
        } catch (error: any) {
          setDataError(error.message);
          if (error.message.includes('inválido')) handleLogout();
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Filtro de dados
  const filteredData = inventoryData.filter((item) => {
    if (!item) return false;
    return (item.descricao_item || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
           (item.codigo_item || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddItem = () => alert("Funcionalidade a ser implementada.");
  const handleRemoveItem = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      setInventoryData((prev) => prev.filter((item) => item.id_item !== id));
    }
  };

  // Tela de Login
  if (!token) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200">
                <div className="text-center">
                    <Package className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-gray-900">NEXUM</h1>
                    <p className="text-gray-500 mt-2">Acesse seu painel de controle</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Label htmlFor="email">Usuário</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            readOnly
                            className="bg-gray-100 h-10 cursor-not-allowed"
                        />
                    </div>
                    {loginError && <p className="text-sm text-red-600 pt-1">{loginError}</p>}
                    <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 h-10 text-base font-semibold">
                        {loading ? 'Verificando...' : 'Entrar'}
                    </Button>
                </form>
            </div>
        </div>
    );
  }

  // Dashboard Principal
  return (
    <div className="flex items-center justify-center w-full min-h-screen bg-gray-200 p-4 lg:p-8">
        <div className="w-full max-w-7xl h-[90vh] flex bg-gray-50 rounded-xl shadow-2xl border border-gray-300 overflow-hidden">
            <aside className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-blue-900 text-white flex flex-col transition-all duration-300 relative`}>
                <div className="p-6 border-b border-blue-800">
                    <div className="flex items-center gap-3">
                        <Package className="w-8 h-8 text-blue-300 flex-shrink-0" />
                        {!isSidebarCollapsed && (
                        <div>
                            <h1 className="text-xl">NEXUM</h1>
                            <p className="text-blue-300 text-sm">Planejador</p>
                        </div>
                        )}
                    </div>
                </div>
                <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="absolute -right-3 top-20 bg-blue-800 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-colors z-10">
                    {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {[
                        { id: "inventory", label: "Estoque", icon: Package },
                        { id: "purchase-requests", label: "Requisições", icon: ShoppingCart },
                        { id: "purchase-history", label: "Histórico", icon: History },
                        { id: "suggestions", label: "Sugestões IA", icon: Lightbulb },
                    ].map(({ id, label, icon: Icon }) => (
                        <button key={id} onClick={() => setActiveView(id as ViewType)} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${isSidebarCollapsed ? "justify-center" : "text-left"} ${activeView === id ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"}`} title={isSidebarCollapsed ? label : ""}>
                            <Icon className="w-5 h-5 flex-shrink-0" />
                            {!isSidebarCollapsed && <span>{label}</span>}
                        </button>
                    ))}
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
                {activeView === "inventory" && (
                <>
                    <header className="bg-white border-b border-gray-200 px-8 py-4 shrink-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl text-gray-900">Gerenciamento de Estoque</h2>
                                <p className="text-gray-500">Controle completo do inventário</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="outline" className="gap-2"> <Download className="w-4 h-4" /> Exportar </Button>
                                <Button onClick={handleAddItem} className="gap-2 bg-blue-600 hover:bg-blue-700"> <Plus className="w-4 h-4" /> Novo Item </Button>
                            </div>
                        </div>
                    </header>
                    <div className="px-8 py-6 bg-gray-50 shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input placeholder="Buscar por descrição ou código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 px-8 pb-8 overflow-auto">
                        {loading && <p className="text-center p-4">Carregando dados...</p>}
                        {dataError && <p className="text-center p-4 text-red-600">{dataError}</p>}
                        {!loading && !dataError && <InventoryTable data={filteredData} onRemoveItem={handleRemoveItem} />}
                    </div>
                </>
                )}
                {activeView === "purchase-requests" && <div className="p-8 overflow-auto"><PurchaseRequests /></div>}
                {activeView === "purchase-history" && <div className="p-8 overflow-auto"><PurchaseHistory /></div>}
                {activeView === "suggestions" && <div className="p-8 overflow-auto"><PurchaseSuggestions /></div>}
                {activeView === "settings" && <div className="p-8 overflow-auto"><SettingsComponent /></div>}
            </main>
            {!isChatCollapsed && <ChatAssistant onToggle={() => setIsChatCollapsed(true)} />}
            {isChatCollapsed && (
                <button onClick={() => setIsChatCollapsed(false)} className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-4 rounded-l-lg shadow-lg z-20">
                    <ChevronLeft className="w-5 h-5" />
                </button>
            )}
        </div>
    </div>
  );
}
