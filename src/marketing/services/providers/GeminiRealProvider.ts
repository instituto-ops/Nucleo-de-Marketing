// src/marketing/services/providers/GeminiRealProvider.ts
import { invoke } from "@tauri-apps/api/core";
import { IARequest, IAResponse } from "../types/IAContracts";

/**
 * Provider para o modelo de IA real via backend Tauri.
 * Nível 0 na cadeia de execução.
 */
export class GeminiRealProvider {
  static async run(request: IARequest): Promise<IAResponse> {
    try {
      const result = await invoke<{ output: string }>('call_gemini', { request });

      if (result && result.output) {
        return {
          output: result.output,
          providerUsed: null, // Contrato atual não permite 'gemini-real'. Usando null.
          fallbackLevel: 0, // Sucesso no nível primário
        };
      }
      
      const errorMessage = 'GeminiRealProvider: A chamada Tauri retornou um resultado vazio.';
      console.warn(errorMessage);
      return {
        output: null,
        providerUsed: null,
        fallbackLevel: -1, // Sinaliza falha
        error: errorMessage,
      };

    } catch (error: any) {
      const errorMessage = `GeminiRealProvider Tauri invoke failed: ${error.message || String(error)}`;
      console.error(errorMessage);
      // Retorna erro controlado SEMPRE, nunca lança exception para ativar o fallback.
      return {
        output: null,
        providerUsed: null,
        fallbackLevel: -1, // Sinaliza falha
        error: errorMessage,
      };
    }
  }
}