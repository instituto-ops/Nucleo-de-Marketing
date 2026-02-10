// src/marketing/services/AIRuntime.ts

import { IAProvider, IAResponse } from './types/IAContracts'
import { OllamaProvider } from './providers/OllamaProvider'
import { TemplateProvider } from './providers/TemplateProvider'

export type AIRuntimeLevel =
  | 'ollama'
  | 'template'

export interface RuntimeAttempt {
  level: AIRuntimeLevel
  success: boolean
  error?: string
}

/**
 * AIRuntime — Runtime Canônico de IA
 *
 * Stack ativa (temporária):
 * 1. Ollama (Local)
 * 2. Template Engine (Garantia)
 *
 * Mistral permanece implementado,
 * mas desativado até liberação da API.
 */
export class AIRuntime {
  private readonly chain: {
    level: AIRuntimeLevel
    provider: IAProvider
  }[]

  constructor() {
    this.chain = [
      { level: 'ollama', provider: new OllamaProvider() },
      { level: 'template', provider: new TemplateProvider() },
    ]
  }

  async run(
    prompt: string
  ): Promise<
    IAResponse & {
      runtimeLevel: AIRuntimeLevel
      attempts: RuntimeAttempt[]
    }
  > {
    const attempts: RuntimeAttempt[] = []

    for (const entry of this.chain) {
      try {
        const response = await entry.provider.generate(prompt)

        attempts.push({
          level: entry.level,
          success: true,
        })

        return {
          ...response,
          runtimeLevel: entry.level,
          attempts,
        }
      } catch (error: any) {
        attempts.push({
          level: entry.level,
          success: false,
          error: error?.message ?? 'unknown error',
        })
      }
    }

    /**
     * REGRA DE SEGURANÇA ABSOLUTA
     * TemplateProvider NÃO deve falhar.
     */
    throw new Error(
      'AIRuntime failed: no provider returned a valid response'
    )
  }
}
