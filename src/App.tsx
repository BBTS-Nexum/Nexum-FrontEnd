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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// 1. IMPORTAR FUNÇÕES E TIPOS DO NOSSO apiService
import { getProducts, Produto } from "./services/apiService";

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
    codigo_item: produto.codigo,
    descricao_item: produto.descricao,
    categoria: produto.tipo,
    unidade_medida: produto.unidade_medida,
    estoque_atual: produto.saldo_total,
    estoque_minimo: 50, // Padrão, já que a API não fornece
    estoque_maximo: 200, // Padrão, já que a API não fornece
    consumo_medio_mensal: produto.cmm,
    consumo_ultimo_mes: 0, // Padrão, já que a API não fornece
    consumo_tendencia: 'estavel',
    cobertura_em_dias: produto.cobertura,
    previsao_reposicao: "A definir",
    quantidade_ideal_compra: 0,
    status_critico: produto.status.toLowerCase() as InventoryItem['status_critico'],
    localizacao_estoque: produto.localizacao,
    em_transito: produto.em_transito,
    reservado: produto.reservado,
    data_ultima_compra: "A definir",
    preco_medio_unitario: produto.preco_medio,
    fornecedor_principal: produto.fornecedor_principal,
  };
};


export default function App() {
  const [activeView, setActiveView] = useState<ViewType>("inventory");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]); 
  const [loading, setLoading] = useState<boolean>(true); // Inicia como true
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

  // Efeito para buscar dados diretamente ao carregar o app
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setDataError(null);
      try {
        // ATENÇÃO: O token agora está fixo no código.
        // O ideal é pegar um token válido do seu backend e colocar aqui.
        const adminToken = "SEU_TOKEN_DE_ADMIN_AQUI"; 
        
        if (!adminToken || adminToken === "SEU_TOKEN_DE_ADMIN_AQUI") {
            console.error("TOKEN NÃO CONFIGURADO: Por favor, adicione um token de teste válido.");
            setDataError("Erro de configuração: Token de administrador não foi definido.");
            return;
        }

        const produtosDaApi = await getProducts(adminToken);
        const itemsFormatados = produtosDaApi.map(mapProdutoToInventoryItem);
        setInventoryData(itemsFormatados);
      } catch (error: any) {
        setDataError(`Falha ao buscar dados: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []); // O array vazio [] faz com que isso rode apenas uma vez, quando o componente é montado.


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

  // Estatísticas
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
      // Lógica para chamar a API de deleção aqui...
    }
  };

  const handleCreateItem = () => {
    console.log("Criando item:", newItem);
    // Lógica para chamar a API de criação aqui...
    setIsAddDialogOpen(false);
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarCollapsed ? "w-16" : "w-64"
        } bg-blue-900 text-white flex flex-col transition-all duration-300 relative`}
      >
           <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-300 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl">NEXUM</h1>
                <p className="text-blue-300 text-sm">Administrador</p>
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
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Configurações</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === "inventory" && (
          <>
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

            <div className="px-8 py-6 bg-white border-b border-gray-200">
              {/* Stats Cards */}
            </div>

            <div className="px-8 py-6 bg-gray-50">
                {/* Filters */}
            </div>

            <div className="flex-1 px-8 pb-8 overflow-auto">
              {loading && <p className="text-center p-4">Carregando dados...</p>}
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
        
        {activeView === "purchase-requests" && (
          <div className="flex-1 overflow-auto px-8 py-6"><PurchaseRequests /></div>
        )}

        {activeView === "purchase-history" && (
          <div className="flex-1 overflow-auto px-8 py-6"><PurchaseHistory /></div>
        )}

        {activeView === "suggestions" && (
          <div className="flex-1 overflow-auto px-8 py-6"><PurchaseSuggestions /></div>
        )}

        {activeView === "settings" && (
          <div className="flex-1 overflow-auto px-8 py-6"><SettingsComponent /></div>
        )}
      </main>
      
      {!isChatCollapsed && <ChatAssistant onToggle={() => setIsChatCollapsed(true)} />}

      {isChatCollapsed && (
        <button onClick={() => setIsChatCollapsed(false)} className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-6 rounded-l-lg shadow-lg transition-colors z-10">
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
            <DialogDescription>Cadastrar um novo item no inventário</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="codigo">Código do Item</Label>
              <Input id="codigo" value={newItem.codigo} onChange={(e) => setNewItem({ ...newItem, codigo: e.target.value })} placeholder="Ex: MT-2024-999" />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input id="descricao" value={newItem.descricao} onChange={(e) => setNewItem({ ...newItem, descricao: e.target.value })} placeholder="Ex: Resistor 10K Ohm" />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={newItem.categoria} onValueChange={(value: string) => setNewItem({ ...newItem, categoria: value })}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Componentes Eletrônicos">Componentes Eletrônicos</SelectItem>
                  <SelectItem value="Materiais Base">Materiais Base</SelectItem>
                  <SelectItem value="Ferragens">Ferragens</SelectItem>
                  <SelectItem value="Cabos e Fios">Cabos e Fios</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="estoque">Estoque Atual</Label>
              <Input id="estoque" type="number" value={newItem.estoque_atual} onChange={(e) => setNewItem({ ...newItem, estoque_atual: e.target.value })} placeholder="Ex: 1000" />
            </div>
            <div>
              <Label htmlFor="minimo">Estoque Mínimo</Label>
              <Input id="minimo" type="number" value={newItem.estoque_minimo} onChange={(e) => setNewItem({ ...newItem, estoque_minimo: e.target.value })} placeholder="Ex: 500" />
            </div>
            <div>
              <Label htmlFor="preco">Preço Unitário (R$)</Label>
              <Input id="preco" type="number" step="0.01" value={newItem.preco} onChange={(e) => setNewItem({ ...newItem, preco: e.target.value })} placeholder="Ex: 0.15" />
            </div>
            <Button onClick={handleCreateItem} className="w-full bg-blue-600 hover:bg-blue-700">Adicionar Item</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
