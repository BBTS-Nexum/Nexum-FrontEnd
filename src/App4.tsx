import { useState } from "react";
import { InventoryTable } from "./components/InventoryTable";
import { ChatAssistant } from "./components/ChatAssistant";
import { Settings as SettingsComponent } from "./components/Settings";
import { mockInventoryData } from "./components/mockData";
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
  History,
  Users,
  Truck,
  FileWarning,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Settings as SettingsIcon,
  Download,
  Filter,
  Plus,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

type InventoryItem = import("./components/InventoryTable").InventoryItem;
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
  | "purchase-history"
  | "suppliers"
  | "delivery-status"
  | "occurrences"
  | "settings";

export default function App4() {
  const [activeView, setActiveView] = useState<ViewType>("inventory");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);

  // Estoque states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>(
    (mockInventoryData as InventoryItem[]) || []
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    codigo: "",
    descricao: "",
    categoria: "",
    estoque_atual: "",
    estoque_minimo: "",
    preco: "",
  });

  // Filtrar dados
  const filteredData = (inventoryData || []).filter((item) => {
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

  const handleAddItem = () => {
    setIsAddDialogOpen(true);
  };

  const handleRemoveItem = (id: number) => {
    if (confirm("Tem certeza que deseja remover este item?")) {
      setInventoryData((prev) => prev.filter((item) => item.id_item !== id));
    }
  };

  const handleCreateItem = () => {
    const nextId =
      inventoryData && inventoryData.length > 0
        ? Math.max(...inventoryData.map((i) => i.id_item)) + 1
        : 1;

    const estoqueAtual = parseInt(newItem.estoque_atual || "0", 10) || 0;
    const estoqueMinimo = parseInt(newItem.estoque_minimo || "0", 10) || 0;
    const precoUnit = parseFloat(newItem.preco || "0") || 0;

    const newInventoryItem: InventoryItem = {
      id_item: nextId,
      codigo_item: newItem.codigo,
      descricao_item: newItem.descricao,
      categoria: newItem.categoria,
      unidade_medida: "UN",
      estoque_atual: estoqueAtual,
      estoque_minimo: estoqueMinimo,
      estoque_maximo: estoqueMinimo * 3,
      consumo_medio_mensal: 100,
      consumo_ultimo_mes: 100,
      consumo_tendencia: "estavel",
      cobertura_em_dias: 30,
      previsao_reposicao: "2025-11-30",
      quantidade_ideal_compra: 200,
      status_critico: "normal",
      localizacao_estoque: "A-01-1",
      em_transito: 0,
      reservado: 0,
      data_ultima_compra: new Date().toISOString().split("T")[0],
      preco_medio_unitario: precoUnit,
      fornecedor_principal: "A definir",
    };

    setInventoryData((prev) => [...prev, newInventoryItem]);
    setNewItem({
      codigo: "",
      descricao: "",
      categoria: "",
      estoque_atual: "",
      estoque_minimo: "",
      preco: "",
    });
    setIsAddDialogOpen(false);
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      alert("Logout realizado com sucesso!");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${isSidebarCollapsed ? "w-16" : "w-64"} bg-blue-900 text-white flex flex-col transition-all duration-300 relative`}
      >
        <div className="p-6 border-b border-blue-800">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-300 flex-shrink-0" />
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-xl">NEXUM</h1>
                <p className="text-blue-300 text-sm">Gestor</p>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="absolute -right-3 top-20 bg-blue-800 hover:bg-blue-700 text-white rounded-full p-1 shadow-lg transition-colors z-10"
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveView("inventory")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "inventory" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Estoque" : ""}
          >
            <Package className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Estoque</span>}
          </button>

          <button
            onClick={() => setActiveView("purchase-history")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "purchase-history" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Histórico de Compras" : ""}
          >
            <History className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Histórico de Compras</span>}
          </button>

          <button
            onClick={() => setActiveView("suppliers")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "suppliers" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Fornecedores" : ""}
          >
            <Users className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Fornecedores</span>}
          </button>

          <button
            onClick={() => setActiveView("delivery-status")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "delivery-status" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Situação de Entregas" : ""}
          >
            <Truck className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Situação de Entregas</span>}
          </button>

          <button
            onClick={() => setActiveView("occurrences")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "occurrences" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Ocorrências" : ""}
          >
            <FileWarning className="w-5 h-5 flex-shrink-0" />
            {!isSidebarCollapsed && <span>Ocorrências</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-blue-800 space-y-2">
          <button
            onClick={() => setActiveView("settings")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full ${
              isSidebarCollapsed ? "justify-center" : "text-left"
            } ${
              activeView === "settings" ? "bg-blue-800 text-white" : "hover:bg-blue-800 text-blue-100"
            }`}
            title={isSidebarCollapsed ? "Configurações" : ""}
          >
            <SettingsIcon className="w-5 h-5 flex-shrink-0" />
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activeView === "inventory" && (
          <>
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl text-gray-900">Gerenciamento de Estoque</h2>
                  <p className="text-gray-500">Controle completo do inventário e análise de consumo</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" className="gap-2">
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                  <Button onClick={handleAddItem} className="gap-2 bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4" />
                    Novo Item
                  </Button>
                </div>
              </div>
            </header>

            {/* Stats Cards */}
            <div className="px-8 py-6 bg-white border-b border-gray-200">
              <div className="grid grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total de Itens</p>
                      <p className="text-3xl mt-1">{totalItems}</p>
                    </div>
                    <Package className="w-10 h-10 text-blue-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-100 text-sm">Itens Críticos</p>
                      <p className="text-3xl mt-1">{criticalItems}</p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-red-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-100 text-sm">Requer Atenção</p>
                      <p className="text-3xl mt-1">{attentionItems}</p>
                    </div>
                    <AlertCircle className="w-10 h-10 text-yellow-200" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Valor Total</p>
                      <p className="text-3xl mt-1">R$ {(totalValue / 1000).toFixed(1)}k</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-green-200" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="px-8 py-6 bg-gray-50">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" /></svg>
                  <Input
                    placeholder="Buscar por descrição ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-[220px] bg-white">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas Categorias</SelectItem>
                    <SelectItem value="Componentes Eletrônicos">Componentes Eletrônicos</SelectItem>
                    <SelectItem value="Materiais Base">Materiais Base</SelectItem>
                    <SelectItem value="Ferragens">Ferragens</SelectItem>
                    <SelectItem value="Cabos e Fios">Cabos e Fios</SelectItem>
                    <SelectItem value="Circuitos Integrados">Circuitos Integrados</SelectItem>
                    <SelectItem value="Embalagens">Embalagens</SelectItem>
                    <SelectItem value="Fontes e Energia">Fontes e Energia</SelectItem>
                    <SelectItem value="Conectores">Conectores</SelectItem>
                    <SelectItem value="Sensores">Sensores</SelectItem>
                    <SelectItem value="Materiais Auxiliares">Materiais Auxiliares</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    <SelectItem value="critico">Crítico</SelectItem>
                    <SelectItem value="atencao">Atenção</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="excesso">Excesso</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Mais Filtros
                </Button>
              </div>

              {(categoryFilter !== "all" || statusFilter !== "all") && (
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-sm text-gray-600">Filtros ativos:</span>
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700">
                      Categoria: {categoryFilter}
                      <button onClick={() => setCategoryFilter("all")} className="ml-1 hover:text-blue-900">×</button>
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="gap-1 bg-blue-100 text-blue-700">
                      Status: {statusFilter}
                      <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-blue-900">×</button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* Table */}
            <div className="flex-1 px-8 pb-8 overflow-auto">
              <InventoryTable data={filteredData} onAddItem={handleAddItem} onRemoveItem={handleRemoveItem} />
            </div>
          </>
        )}

        {activeView === "purchase-history" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="text-xl font-semibold mb-4">Histórico de Compras</div>
            <div className="bg-white p-6 rounded shadow">(Funcionalidade de histórico de compras aqui)</div>
          </div>
        )}

        {activeView === "suppliers" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="text-xl font-semibold mb-4">Fornecedores</div>
            <div className="bg-white p-6 rounded shadow">(Funcionalidade de fornecedores aqui)</div>
          </div>
        )}

        {activeView === "delivery-status" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="text-xl font-semibold mb-4">Situação de Entregas</div>
            <div className="bg-white p-6 rounded shadow">(Funcionalidade de situação de entregas aqui)</div>
          </div>
        )}

        {activeView === "occurrences" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <div className="text-xl font-semibold mb-4">Ocorrências</div>
            <div className="bg-white p-6 rounded shadow">(Funcionalidade de ocorrências aqui)</div>
          </div>
        )}

        {activeView === "settings" && (
          <div className="flex-1 overflow-auto px-8 py-6">
            <SettingsComponent />
          </div>
        )}
      </main>

      {/* Chat Assistant */}
      {!isChatCollapsed && <ChatAssistant onToggle={() => setIsChatCollapsed(true)} />}

      {isChatCollapsed && (
        <button
          onClick={() => setIsChatCollapsed(false)}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-6 rounded-l-lg shadow-lg transition-colors z-10"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Novo Item</DialogTitle>
            <DialogDescription>Cadastrar um novo item no inventário</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="codigo">Código do Item</Label>
              <Input
                id="codigo"
                value={newItem.codigo}
                onChange={(e) => setNewItem({ ...newItem, codigo: e.target.value })}
                placeholder="Ex: MT-2024-999"
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={newItem.descricao}
                onChange={(e) => setNewItem({ ...newItem, descricao: e.target.value })}
                placeholder="Ex: Resistor 10K Ohm"
              />
            </div>
            <div>
              <Label htmlFor="categoria">Categoria</Label>
              <Select value={newItem.categoria} onValueChange={(value: string) => setNewItem({ ...newItem, categoria: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
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
