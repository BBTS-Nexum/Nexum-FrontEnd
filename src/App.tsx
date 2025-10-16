// src/App.tsx (Refatorado)

import { useState, useEffect } from "react";
import { MainLayout } from "./components/layout/MainLayout"; // Layout principal
import { LoginView } from "./views/LoginView"; // Tela de Login
import { InventoryView } from "./views/InventoryView";
import { PurchaseRequests } from "./components/PurchaseRequests";
import { PurchaseHistory } from "./components/PurchaseHistory";
import { PurchaseSuggestions } from "./components/PurchaseSuggestions";
import { Settings as SettingsComponent } from "./components/Settings";
import { getProducts, Produto } from "./services/apiService";
import { InventoryItem } from "./components/InventoryTable";

// A função de mapeamento permanece aqui ou pode ser movida para um arquivo de "helpers"
const mapProdutoToInventoryItem = (produto: Produto): InventoryItem => {
  // ... (mesmo código de antes)
};

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeView, setActiveView] = useState("inventory");

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("authToken", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    if (confirm("Tem certeza que deseja sair?")) {
      localStorage.removeItem("authToken");
      setToken(null);
      setInventoryData([]);
    }
  };

  useEffect(() => {
    if (token) {
      const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
          const produtosDaApi = await getProducts(token);
          const itemsFormatados = produtosDaApi.map(mapProdutoToInventoryItem);
          setInventoryData(itemsFormatados);
        } catch (err: any) {
          setError(err.message);
          if (err.message.includes("inválido")) {
            handleLogout();
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (!token) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  const renderActiveView = () => {
    switch (activeView) {
      case "inventory":
        return <InventoryView initialData={inventoryData} loading={loading} error={error} />;
      case "purchase-requests":
        return <PurchaseRequests />;
      case "purchase-history":
        return <PurchaseHistory />;
      case "suggestions":
        return <PurchaseSuggestions />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <InventoryView initialData={inventoryData} loading={loading} error={error} />;
    }
  };

  return (
    <MainLayout
      activeView={activeView}
      setActiveView={setActiveView}
      onLogout={handleLogout}
    >
      {renderActiveView()}
    </MainLayout>
  );
}
