// src/marketing/services/AIRuntime.ts
import { TemplateProvider } from "./providers/TemplateProvider";
import { OllamaProvider } from "./providers/OllamaProvider";
import { IARequest, IAResponse } from "./types/IAContracts";

/**
 * Runtime Central de IA.
 * Executa uma cadeia de providers em sequência até obter sucesso.
 * Projetado para ser inquebrável (nunca lança exceptions).
 */
export class AIRuntime {
  /**
   * Executa a requisição de IA passando pela cadeia de providers.
   * A ordem é sequencial e com fallback garantido.
   * @param request O objeto de requisição `IARequest`.
   * @returns Uma `Promise<IAResponse>` que sempre resolve.
   */
  static async run(request: IARequest): Promise<IAResponse> {
    
    // Nível 1: Tentar OllamaProvider (provider primário)
    const ollamaResult = await OllamaProvider.run(request);

    // Se o provider primário retornou um output válido, a execução termina com sucesso.
    if (ollamaResult.output) {
      return ollamaResult;
    }

    // Se Ollama falhou (ollamaResult.output é null), o runtime loga o erro
    // e automaticamente aciona o próximo nível da cadeia (fallback).
    console.warn(`AIRuntime: OllamaProvider failed (${ollamaResult.error}). Falling back to TemplateProvider.`);

    // Nível 2: Fallback para TemplateProvider (provider de segurança)
    // Este provider é projetado para nunca falhar e sempre retornar uma resposta.
    const templateResult = await TemplateProvider.run(request);
    
    return templateResult;
  }
}

