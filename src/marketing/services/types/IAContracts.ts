// src/marketing/services/types/IAContracts.ts

/**
 * Contrato de entrada para qualquer requisição ao Runtime de IA.
 * Garante que todos os providers recebam um formato de dados consistente.
 */
export interface IARequest {
  systemPrompt: string;
  userPrompt: string;
}

/**
 * Contrato de saída para qualquer resposta do Runtime de IA e seus providers.
 * Garante que o sistema possa lidar com sucesso e falha de forma padronizada,
 * sem o uso de exceptions.
 */
export interface IAResponse {
  output: string | null;
  providerUsed: 'ollama' | 'template' | null;
  fallbackLevel: number; // 0 para sucesso primário, >0 para níveis de fallback, -1 para falha total
  error?: string; // Mensagem de erro controlada, caso ocorra
}
