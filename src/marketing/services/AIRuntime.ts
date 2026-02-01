// src/marketing/services/AIRuntime.ts
import { GeminiRealProvider } from "./providers/GeminiRealProvider";
import { TemplateProvider } from "./providers/TemplateProvider";
import { OllamaProvider } from "./providers/OllamaProvider";
import { IARequest, IAResponse } from "./types/IAContracts";

/**
 * Runtime Central de IA.
 * Executa uma cadeia de providers em sequência até obter sucesso.
 * Projetado para ser inquebrável (nunca lança exceptions).
 */
export class AIRuntime {
  private providers: any[];

  constructor() {
    // A ordem define a prioridade de execução.
    this.providers = [
      GeminiRealProvider,
      OllamaProvider,
      TemplateProvider,
    ];
  }

  /**
   * Executa a requisição de IA passando pela cadeia de providers.
   * A ordem é sequencial e com fallback garantido.
   * @param request O objeto de requisição `IARequest`.
   * @returns Uma `Promise<IAResponse>` que sempre resolve.
   */
  async execute(request: IARequest): Promise<IAResponse> {
    for (const provider of this.providers) {
      try {
        // Cada provider agora é uma classe com um método estático `run`.
        const result = await provider.run(request);
        
        // A condição de sucesso é um output válido.
        // O fallbackLevel < 0 é a marca de falha de um provider.
        if (result && result.output && result.fallbackLevel >= 0) {
          return result;
        }
        
        console.warn(`AIRuntime: ${provider.name} failed or returned no output. Falling back.`);
      } catch (error) {
        const providerName = provider.name;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`AIRuntime: Unhandled exception in ${providerName}: ${errorMessage}. Falling back.`);
      }
    }

    // Fallback final e garantido se todos os outros falharem.
    // O TemplateProvider é projetado para nunca falhar.
    console.log("AIRuntime: All providers failed. Using final fallback TemplateProvider.");
    return TemplateProvider.run(request);
  }

  // Método estático para manter a compatibilidade com o código existente
  static async run(request: IARequest): Promise<IAResponse> {
    const runtime = new AIRuntime();
    return runtime.execute(request);
  }
}

