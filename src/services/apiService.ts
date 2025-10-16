// src/services/apiService.ts

const API_BASE_URL = 'https://nexum-back-end.vercel.app';

// --- INTERFACES (Tipos que sua API usa) ---

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
}

export interface Produto {
    id: number;
    codigo: string;
    descricao: string;
    tipo: string;
    abc: string;
    unidade_medida: string;
    saldo_estoque: number;
    saldo_manut: number;
    saldo_total: number;
    cmm: number;
    cobertura: number;
    status: 'CRITICO' | 'EXCESSO' | 'NORMAL' | 'ATENCAO';
    localizacao: string;
    em_transito: number;
    reservado: number;
    preco_medio: number;
    fornecedor_principal: string;
}


// --- FUNÇÃO HELPER PARA TRATAR RESPOSTAS ---
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    // Tenta pegar o JSON do erro, se falhar, usa uma mensagem padrão
    const errorData = await response.json().catch(() => ({ message: 'Ocorreu um erro na comunicação com o servidor.' }));
    
    let errorMessage = errorData.message || `Erro ${response.status}: ${response.statusText}`;
    
    if (response.status === 401) {
      errorMessage = 'Token inválido ou expirado. Por favor, faça o login novamente.';
    }
    
    throw new Error(errorMessage);
  }
  return response.json();
}


// --- FUNÇÕES DE CHAMADA DA API ---

/**
 * Função para realizar o login.
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  return handleResponse<LoginResponse>(response);
};

/**
 * Função para buscar a lista de produtos.
 */
export const getProducts = async (token: string): Promise<Produto[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse<Produto[]>(response);
};