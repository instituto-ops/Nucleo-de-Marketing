// src/marketing/services/providers/OllamaProvider.ts
import { IARequest, IAResponse } from "../types/IAContracts";

/**
 * Provider para o modelo de IA local via Ollama.
 * Nível 1 na cadeia de execução.
 */
export class OllamaProvider {
  static async run(request: IARequest): Promise<IAResponse> {
    try {
      const response = await fetch('http://localhost:11434/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: "llama3.2:latest", // Pode ser parametrizado via request no futuro
          messages: [
            { "role": "system", "content": request.systemPrompt },
            { "role": "user", "content": request.userPrompt }
          ],
          stream: false
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        const errorMessage = `Ollama API error: ${response.status} ${response.statusText} - ${errorText}`;
        console.warn(errorMessage);
        return {
          output: null,
          providerUsed: null,
          fallbackLevel: -1,
          error: errorMessage,
        };
      }
      
      const data = await response.json();
      if (!data.message?.content) {
        const errorMessage = 'Ollama returned empty message content';
        console.warn(errorMessage);
        return {
          output: null,
          providerUsed: null,
          fallbackLevel: -1,
          error: errorMessage,
        };
      }

      // Sucesso
      return {
        output: data.message.content,
        providerUsed: 'ollama',
        fallbackLevel: 0, // Sucesso no nível 0 (primário)
      };

    } catch (error: any) {
      const errorMessage = `OllamaProvider fetch failed: ${error.message}`;
      console.error(errorMessage);
      // Retorna erro controlado SEMPRE, nunca lança exception
      return {
        output: null,
        providerUsed: null,
        fallbackLevel: -1,
        error: errorMessage,
      };
    }
  }
}

