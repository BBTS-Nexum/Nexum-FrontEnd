// src/App.tsx

import { useState, useEffect } from "react";
// Componentes da sua UI
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

// 1. IMPORTAR FUNÇÕES E TIPOS DO NOSSO apiService
import { login, getProducts, Produto } from "./services/apiService";

// Tipos que já existiam
type NewItem = {
  codigo: string;
  descricao: string;
  categoria: string;
  estoque_atual: string;
  estoque_minimo: string;
  preco: string;
};

type ViewType =
  | "inventory"
  | "purchase-requests"
  | "purchase-history"
  | "suggestions"
  | "settings";

// Função para converter o Produto da API para o InventoryItem do seu componente
const mapProdutoToInventoryItem = (produto: Produto): InventoryItem => {
  return {
    id_item: produto.id,
    codigo_item: produto.codigo || '', // Garante que seja uma string
    descricao_item: produto.descricao || '', // Garante que seja uma string
    categoria: produto.tipo || '', // Garante que seja uma string
    unidade_medida: produto.unidade_medida || '',
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
    localizacao_estoque: produto.localizacao || '',
    em_transito: produto.em_transito || 0,
    reservado: produto.reservado || 0,
    data_ultima_compra: "A definir",
    preco_medio_unitario: produto.preco_medio || 0,
    fornecedor_principal: produto.fornecedor_principal || '',
  };
};

export default function App() {
  // 2. ESTADOS DE AUTENTICAÇÃO E DADOS
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [loginError, setLoginError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  
  const [activeView, setActiveView] = useState<ViewType>("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Inicia vazio, será preenchido pela API
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [dataError, setDataError] = useState<string | null>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    codigo: "",
    descricao: "",
    categoria: "",
    estoque_atual: "",
    estoque_minimo: "",
    preco: "",
  });

  // 3. LÓGICA DE LOGIN e LOGOUT
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

  // 4. EFEITO PARA BUSCAR DADOS QUANDO O TOKEN EXISTIR
  useEffect(() => {
    if (token) {
      const fetchProducts = async () => {
        setLoading(true);
        setDataError(null);
        try {
          const produtosDaApi = await getProducts(token);
          // Mapeia os dados da API para o formato que o seu componente de tabela espera
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
    }
  }, [token]); // Roda sempre que o token mudar


  // Filtrar dados
  const filteredData = inventoryData.filter((item) => {
    const matchesSearch =
      item.descricao_item.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo_item.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.categoria === categoryFilter;
    const matchesStatus =
      statusFilter === "all" || item.status_critico === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Estatísticas (já existentes)
  const totalItems = inventoryData.length;
  const criticalItems = inventoryData.filter(
    (item) => item.status_critico === "critico"
  ).length;
  const attentionItems = inventoryData.filter(
    (item) => item.status_critico === "atencao"
  ).length;
  const totalValue = inventoryData.reduce(
    (acc, item) => acc + item.estoque_atual * item.preco_medio_unitario,
    0
  );

  const handleAddItem = () => setIsAddDialogOpen(true);

  const handleRemoveItem = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      setInventoryData((prev) => prev.filter((item) => item.id_item !== id));
      // Aqui você chamaria uma função para deletar na API:
      // deleteProduct(token, id).then(...).catch(...)
    }
  };

  const handleCreateItem = () => {
    // Lógica para criar o item (aqui você chamaria a API)
    // createProduct(token, newInventoryItem).then(...)
    console.log("Criando item:", newItem);
    setIsAddDialogOpen(false);
  };
  
  // 5. RENDERIZAÇÃO CONDICIONAL (TELA DE LOGIN)
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

  // 6. RENDERIZAÇÃO PRINCIPAL (SE ESTIVER LOGADO)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar (seu código original) */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-blue-900 text-white flex flex-col transition-all duration-300 relative`}
      >
          {/* ... seu código da sidebar aqui, só precisa garantir que o botão "Sair" chame handleLogout */}
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

        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 bg-blue-800 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-colors z-10"
        >
          {isSidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView("inventory")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "inventory"
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Estoque Completo" : ""}
          >
            <Package className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Estoque Completo</span>}
          </button>
          <button
            onClick={() => setActiveView("purchase-requests")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "purchase-requests"
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Requisições de Compras" : ""}
          >
            <ShoppingCart className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Requisições de Compras</span>}
          </button>
          <button
            onClick={() => setActiveView("purchase-history")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "purchase-history"
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Histórico de Compras" : ""}
          >
            <History className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Histórico de Compras</span>}
          </button>
          <button
            onClick={() => setActiveView("suggestions")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "suggestions"
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Sugestões de Compras" : ""}
          >
            <Lightbulb className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sugestões de Compras</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800 space-y-2">
          <button
            onClick={() => setActiveView("settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "settings"
                ? "bg-blue-800 text-white"
                : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Configurações" : ""}
          >
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />{" "}
            {/* use o ícone renomeado */}
            {!isSidebarCollapsed && <span>Configurações</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } hover:bg-red-700 text-blue-100`}
            title={isSidebarCollapsed ? "Sair" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Sair</span>}
          </button>
        </div>
      </aside>

      {/* Main Content (seu código original) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === "inventory" && (
          <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-gray-900">
                    Gerenciamento de Estoque
                  </h2>
                  <p className="text-gray-500">
                    Controle completo do inventário e análise de consumo
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                  <Button
                    onClick={handleAddItem}
                    className="gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Novo Item
                  </Button>
                </div>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="px-8 py-6 bg-white border-b border-gray-200">
               {/*...seu código de stats...*/}
            </div>

            {/* Filters */}
            <div className="px-8 py-6 bg-gray-50">
                {/*...seu código de filtros...*/}
            </div>

            {/* Table */}
            <div className="flex-1 px-8 pb-8 overflow-auto">
              {loading && <p className="text-center p-4">Carregando dados da API...</p>}
              {dataError && <p className="text-center p-4 text-red-600">{dataError}</p>}
              {!loading && !dataError && (
                <InventoryTable
                  data={filteredData}
                  onAddItem={handleAddItem}
                  onRemoveItem={handleRemoveItem}
                />
              )}
            </div>
          </>
        )}
        
        {/* ...outras views... */}

      </main>
      
      {/* ...seu código do Chat e do Dialog... */}
    </div>
  );
}
