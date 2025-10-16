// src/App.tsx

import { useState, useEffect } from "react";
import { InventoryTable, InventoryItem } from "./components/InventoryTable";
import { ChatAssistant } from "./components/ChatAssistant";
import { PurchaseRequests } from "./components/PurchaseRequests";
import { PurchaseHistory } from "./components/PurchaseHistory";
import { PurchaseSuggestions } from "./components/PurchaseSuggestions";
import { Settings as SettingsComponent } from "./components/Settings";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { Badge } from "./components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import {
  Package,
  Search,
  Download,
  Filter,
  Settings as SettingsIcon,
  ShoppingCart,
  History,
  Lightbulb,
  TrendingUp,
  AlertCircle,
  Plus,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { login, getProducts, Produto } from "./services/apiService";

// Tipos
type ViewType =
  | "inventory"
  | "purchase-requests"
  | "purchase-history"
  | "suggestions"
  | "settings";

// Função Helper para converter o Produto da API para o formato do Frontend
// Esta função agora é mais segura e previne erros de dados ausentes
const mapProdutoToInventoryItem = (produto: Produto): InventoryItem => {
  return {
    id_item: produto.id,
    codigo_item: produto.codigo || '', // Garante que seja uma string
    descricao_item: produto.descricao || '', // Garante que seja uma string
    categoria: produto.tipo || 'Não definida', // Garante que tenha um valor
    unidade_medida: produto.unidade_medida || 'UN',
    estoque_atual: produto.saldo_total || 0, // Garante que seja um número
    estoque_minimo: 50, // Padrão, já que a API não fornece
    estoque_maximo: 200, // Padrão, já que a API não fornece
    consumo_medio_mensal: produto.cmm || 0,
    consumo_ultimo_mes: 0, // Padrão, já que a API não fornece
    consumo_tendencia: 'estavel', // Lógica a ser implementada se necessário
    cobertura_em_dias: produto.cobertura || 0,
    previsao_reposicao: "A definir",
    quantidade_ideal_compra: 0,
    status_critico: (produto.status || 'normal').toLowerCase() as InventoryItem['status_critico'], // Garante que o status exista e seja minúsculo
    localizacao_estoque: produto.localizacao || 'N/A',
    em_transito: produto.em_transito || 0,
    reservado: produto.reservado || 0,
    data_ultima_compra: "A definir",
    preco_medio_unitario: produto.preco_medio || 0,
    fornecedor_principal: produto.fornecedor_principal || 'Não definido',
  };
};


export default function App() {
  // Estados de Autenticação e Dados da API
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [dataError, setDataError] = useState<string | null>(null);
  
  // Estados de UI e Formulários
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [activeView, setActiveView] = useState<ViewType>("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  
  // Lógica de Login e Logout
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError(null);
    try {
      const data = await login({ email, senha });
      localStorage.setItem('authToken', data.token);
      setToken(data.token);
    } catch (error: any) {
      setLoginError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem('authToken');
      setToken(null);
      setInventoryData([]); // Limpa os dados ao sair
    }
  };

  // Efeito para buscar dados da API quando o token existir
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
          // Se o token for inválido, desloga o usuário
          if (error.message.includes('inválido')) {
            handleLogout();
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
        setLoading(false); // Garante que o loading pare se não houver token
    }
  }, [token]);

  // Lógica de filtro mais robusta para prevenir erros
  const filteredData = inventoryData.filter((item) => {
    // Garante que o item existe antes de tentar acessar suas propriedades
    if (!item) {
        return false;
    }

    const matchesSearch =
      (item.descricao_item || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.codigo_item || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || item.categoria === categoryFilter;
      
    const matchesStatus =
      statusFilter === "all" || item.status_critico === statusFilter;
      
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Funções de CRUD (Create, Remove)
  // TODO: Implementar a lógica de API para estas funções
  const handleAddItem = () => { /* setIsAddDialogOpen(true) */ alert("Funcionalidade a ser implementada."); };
  const handleRemoveItem = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      setInventoryData((prev) => prev.filter((item) => item.id_item !== id));
      // Exemplo de como seria a chamada da API:
      // deleteProduct(token, id).catch(err => console.error(err));
    }
  };

  // Renderização condicional: Tela de Login se não houver token
  if (!token) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">NEXUM</h1>
            <p className="text-gray-500">Faça login para continuar</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            {loginError && <p className="text-sm text-red-600">{loginError}</p>}
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Renderização Principal (Dashboard)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
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

        <nav className="flex-1 p-4 space-y-2">
          {/* Botões do menu de navegação */}
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

      {/* Conteúdo Principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === "inventory" && (
            // A lógica da tela de inventário foi movida para seu próprio componente (InventoryView) 
            // para manter este arquivo limpo, mas mantendo a arquitetura, vamos deixar aqui.
            // O ideal seria componentizar, mas respeitando a sua decisão:
          <>
            <header className="bg-white border-b border-gray-200 px-8 py-4">
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
            
            <div className="px-8 py-6 bg-gray-50">
              <div className="flex items-center gap-4">
                  <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input placeholder="Buscar por descrição ou código..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-10 bg-white" />
                  </div>
                  {/* Filtros */}
              </div>
            </div>
            
            <div className="flex-1 px-8 pb-8 overflow-auto">
              {loading && <p className="text-center p-4">Carregando dados...</p>}
              {dataError && <p className="text-center p-4 text-red-600">{dataError}</p>}
              {!loading && !dataError && (
                <InventoryTable data={filteredData} onRemoveItem={handleRemoveItem} />
              )}
            </div>
          </>
        )}
        
        {activeView === "purchase-requests" && <div className="p-8"><PurchaseRequests /></div>}
        {activeView === "purchase-history" && <div className="p-8"><PurchaseHistory /></div>}
        {activeView === "suggestions" && <div className="p-8"><PurchaseSuggestions /></div>}
        {activeView === "settings" && <div className="p-8"><SettingsComponent /></div>}
      </main>
      
      {/* Chat Assistant */}
      {!isChatCollapsed && <ChatAssistant onToggle={() => setIsChatCollapsed(true)} />}
      {isChatCollapsed && (
        <button onClick={() => setIsChatCollapsed(false)} className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-6 rounded-l-lg shadow-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}