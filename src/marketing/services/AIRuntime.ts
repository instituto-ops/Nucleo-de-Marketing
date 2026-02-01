// src/marketing/services/AIRuntime.ts

import { IAProvider, IAResponse } from './types/IAContracts'
import { MistralProvider } from './providers/MistralProvider'
import { OllamaProvider } from './providers/OllamaProvider'
import { TemplateProvider } from './providers/TemplateProvider'

/**
 * Níveis oficiais do runtime de IA.
 * A ordem reflete a stack congelada.
 */
export type AIRuntimeLevel =
  | 'mistral'
  | 'ollama'
  | 'template'

/**
 * Registro de tentativa de execução.
 * Usado para auditoria, métricas e governança.
 */
export interface RuntimeAttempt {
  level: AIRuntimeLevel
  success: boolean
  error?: string
}

/**
 * AIRuntime — Runtime Canônico de IA
 *
 * Stack final:
 * 1. Mistral (Cloud principal)
 * 2. Ollama (Local / Resiliência)
 * 3. Template Engine (Garantia absoluta)
 *
 * Regras:
 * - Execução sequencial
 * - Fallback automático
 * - Nenhuma exceção vaza para a UI
 */
export class AIRuntime {
  private readonly chain: {
    level: AIRuntimeLevel
    provider: IAProvider
  }[]

  constructor() {
    this.chain = [
      { level: 'mistral', provider: new MistralProvider() },
      { level: 'ollama', provider: new OllamaProvider() },
      { level: 'template', provider: new TemplateProvider() },
    ]
  }

  /**
   * Executa o prompt passando pela cadeia de providers.
   * Retorna sempre a primeira resposta bem-sucedida,
   * junto com o histórico completo de tentativas.
   */
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
     * O TemplateProvider NÃO deve falhar.
     * Se chegou aqui, é erro estrutural.
     */
    throw new Error(
      'AIRuntime failed: no provider returned a valid response'
    )
  }
}
