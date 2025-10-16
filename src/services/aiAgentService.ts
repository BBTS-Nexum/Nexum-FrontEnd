// src/services/aiAgentService.ts

import { GoogleGenerativeAI } from "@google/generative-ai";
import { InventoryItem } from "../components/InventoryTable";

// ATENÇÃO: A chave da API será lida das variáveis de ambiente do Vite.
// Você precisará criar um arquivo .env na raiz do seu projeto.
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL_NAME = "gemini-1.5-flash-latest";

if (!GEMINI_API_KEY) {
  throw new Error("Chave VITE_GEMINI_API_KEY não encontrada no .env");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: MODEL_NAME });

/**
 * Replica a lógica de contingência para encontrar itens críticos a partir dos dados do frontend.
 * @param inventoryData - A lista completa de itens do inventário.
 * @returns Uma lista de itens formatados para a IA.
 */
function obterSugestoesCompra(inventoryData: InventoryItem[]): Record<string, any>[] {
  console.log("📡 PERCEPÇÃO: Analisando dados do inventário no frontend...");
  const MAX_CRITICOS = 5;

  const criticos = inventoryData
    .map(item => {
      // Lógica de cálculo similar à do seu script Python
      const quantidade_a_comprar = Math.max(0, (item.consumo_medio_mensal * 2) - item.estoque_atual - item.em_transito);
      return { ...item, quantidade_a_comprar };
    })
    .filter(item => item.quantidade_a_comprar > 0);

  // Formata os dados para o prompt da IA
  const dadosParaIA = criticos.map(item => ({
    codigo: item.codigo_item,
    abc: 'A', // Valor padrão, ajuste se necessário
    estoque_atual: item.estoque_atual,
    estoque_maximo: item.estoque_maximo,
    cmm: item.consumo_medio_mensal,
    compras_em_andamento: item.em_transito,
    quantidade_a_comprar: item.quantidade_a_comprar,
  }));
  
  // Prioriza os X com maior CMM
  return dadosParaIA.sort((a, b) => b.cmm - a.cmm).slice(0, MAX_CRITICOS);
}


/**
 * Envia os dados críticos para o Gemini e obtém um plano de compra.
 * @param dados_criticos - Os dados dos itens que precisam de atenção.
 * @returns Uma string JSON com o plano de ação.
 */
async function raciocinarEPlanejar(dados_criticos: Record<string, any>[]): Promise<string> {
  const instrucao_sistema = `
Você é o Agente de Automação de Compras (AAC) da Nexum, com total autoridade para emitir ordens de compra.
Sua única saída é um PLANO DE COMPRA no formato JSON, conforme o schema.

### Lógica de Decisão Rigorosa
1.  **Priorização:** Analise e ordene os itens pelo maior **CMM**, depois pela maior **quantidade_a_comprar**.
2.  **ACÃO FINAL:** Determine a ação com base nos seguintes critérios:
    * **'ENVIAR ORDEM DE COMPRA':** Se \`quantidade_a_comprar\` for maior que 0.
    * **'INVESTIGAR DEMANDA':** Se o \`CMM\` for **acima de 0.8** E o \`estoque_atual\` for **90% ou mais** do \`estoque_maximo\`.
    * **'MONITORAR':** Para todos os outros casos (onde não há necessidade de compra).

### Formato de Saída (JSON Estruturado)
O JSON deve ser um array de objetos, onde cada objeto representa a ação para um produto.
`;

  const prompt_usuario = `
DADOS CRÍTICOS (JSON):
${JSON.stringify(dados_criticos, null, 2)}

Gere o plano de ação rigoroso em JSON, listando os itens na ordem de prioridade.
`;

  console.log("🧠 RACIOCÍNIO: Enviando dados para o Agente de IA (Gemini)...");

  const result = await model.generateContent(
      `${instrucao_sistema}\n${prompt_usuario}`
  );

  const response = result.response;
  console.log("✅ RACIOCÍNIO CONCLUÍDO.");
  return response.text();
}

/**
 * Função principal que orquestra a chamada do agente de IA.
 * @param inventoryData - A lista completa de itens do inventário.
 * @returns O plano de compras gerado pela IA.
 */
export async function gerarPlanoDeCompra(inventoryData: InventoryItem[]) {
  const dadosCriticos = obterSugestoesCompra(inventoryData);

  if (dadosCriticos.length === 0) {
    return { mensagem: "Nenhuma sugestão de compra crítica encontrada. Nenhum plano gerado." };
  }

  const planoJsonStr = await raciocinarEPlanejar(dadosCriticos);
  
  try {
    // A API pode retornar o JSON dentro de um bloco de código markdown ```json ... ```
    const cleanJson = planoJsonStr.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error("Erro ao fazer o parse da resposta da IA:", error);
    return { erro: "A resposta da IA não foi um JSON válido.", resposta_raw: planoJsonStr };
  }
}