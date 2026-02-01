// src/marketing/services/providers/TemplateProvider.ts
import { generateAdFromTemplate } from '../TemplateEngine';
import { IARequest, IAResponse } from '../types/IAContracts';

/**
 * Provider de fallback baseado em templates.
 * Nível final na cadeia de execução, projetado para NUNCA falhar.
 */
export class TemplateProvider {
  static async run(request: IARequest): Promise<IAResponse> {
    try {
      // A lógica de extração de tema é mantida para compatibilidade.
      const themeMatch = request.userPrompt.match(/sobre: (.+)/i);
      const theme = themeMatch ? themeMatch[1] : 'um tema genérico';

      const result = generateAdFromTemplate(theme);
      
      // Sucesso garantido
      return {
        output: result.text,
        providerUsed: 'template',
        fallbackLevel: 2, // Nível de fallback final e explícito
      };
    } catch (error: any) {
      // Este bloco SÓ deve ser atingido se generateAdFromTemplate falhar,
      // o que não deve ocorrer. Mesmo assim, garantimos um retorno válido.
      const errorMessage = `CRITICAL: TemplateProvider failed unexpectedly: ${error.message}`;
      console.error(errorMessage);
      return {
        output: "Ocorreu um erro crítico no sistema de templates.",
        providerUsed: 'template',
        fallbackLevel: 2,
        error: errorMessage,
      };
    }
  }
}

