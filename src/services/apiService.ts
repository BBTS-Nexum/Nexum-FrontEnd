// src/services/apiService.ts

// A URL base da sua API
const API_BASE_URL = 'https://nexum-back-end.vercel.app';

// --- INTERFACES (Tipos que sua API usa) ---

// O que a API espera no corpo da requisição de login
export interface LoginCredentials {
  email: string;
  senha: string;
}

// O que a API retorna após um login bem-sucedido
export interface LoginResponse {
  token: string;
}

// A estrutura de um produto, baseada no seu 'InventoryItem'
// Ajuste os campos se a sua API retornar algo diferente
export interface Produto {
    id: number; // A API de produtos provavelmente retorna um 'id'
    codigo: string;
    descricao: string;
    tipo: string;
    abc: string;
    unidade_medida: string;
    saldo_estoque: number;
    saldo_manut: number;
    saldo_total: number;
    cmm: number; // Consumo Médio Mensal
    cobertura: number;
    status: 'CRITICO' | 'EXCESSO' | 'NORMAL' | 'ATENCAO';
    localizacao: string;
    em_transito: number;
    reservado: number;
    preco_medio: number;
    fornecedor_principal: string;
    // Adicione ou remova campos conforme o retorno da sua API GET /api/products
}


// --- FUNÇÕES DE CHAMADA DA API ---

/**
 * Função para realizar o login.
 * Envia email e senha e retorna o token.
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    // Se a API retornar um erro (ex: 401 Unauthorized), lança uma exceção
    const errorData = await response.json();
    throw new Error(errorData.message || 'Falha na autenticação');
  }

  return response.json();
};

/**
 * Função para buscar a lista de produtos.
 * Requer um token JWT para autorização.
 */
export const getProducts = async (token: string): Promise<Produto[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Header de autorização com o token
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
        throw new Error('Token inválido ou expirado. Faça o login novamente.');
    }
    throw new Error('Não foi possível buscar os produtos.');
  }

  return response.json();
};