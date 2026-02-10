// src/marketing/services/providers/OllamaProvider.ts

import { invoke } from '@tauri-apps/api/core'
import { IAProvider, IAResponse } from '../types/IAContracts'

/**
 * OllamaProvider
 *
 * Provider local de IA via Ollama,
 * executado através do backend Tauri (Rust).
 *
 * ✔ Sem CORS
 * ✔ Sem fetch direto
 * ✔ Compatível com AIRuntime canônico
 */
export class OllamaProvider implements IAProvider {
  async generate(prompt: string): Promise<IAResponse> {
    try {
      const result = await invoke<{
        output: string
      }>('generate_response', {
        request: {
          prompt,
        },
      })

      if (!result?.output || typeof result.output !== 'string') {
        throw new Error('Ollama retornou resposta vazia')
      }

      return {
        output: result.output,
      }
    } catch (error: any) {
      // Importante: lançar erro para o AIRuntime fazer fallback
      throw new Error(
        `OllamaProvider failed: ${
          error?.message ?? error?.toString() ?? 'unknown error'
        }`
      )
    }
  }
}
