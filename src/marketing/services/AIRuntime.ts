// src/marketing/services/AIRuntime.ts
import { GeminiProvider } from "./providers/GeminiProvider";
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
    this.providers = [
      new GeminiProvider(),
      new OllamaProvider(),
      new TemplateProvider(),
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
        const result = await provider.generate(request);
        if (result.success && result.output) {
          return result;
        }
        console.warn(`AIRuntime: ${provider.constructor.name} failed or returned no output. Falling back.`);
      } catch (error) {
        const providerName = provider.constructor.name;
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`AIRuntime: Unhandled exception in ${providerName}: ${errorMessage}. Falling back.`);
      }
    }

    // Fallback final e garantido se todos os outros falharem.
    // O TemplateProvider é projetado para nunca falhar.
    return new TemplateProvider().generate(request);
  }

  // Método estático para manter a compatibilidade com o código existente
  static async run(request: IARequest): Promise<IAResponse> {
    const runtime = new AIRuntime();
    return runtime.execute(request);
  }
}

