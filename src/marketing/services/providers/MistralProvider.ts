// src/marketing/services/providers/MistralProvider.ts

import { IAProvider, IAResponse } from '../types/IAContracts'

/**
 * MistralProvider — Cloud Principal
 *
 * Modelo:
 * - mistral-large-latest
 *
 * Características:
 * - Free tier estável
 * - Boa obediência a instruções
 * - Latência aceitável
 *
 * IMPORTANTE:
 * - NÃO faz fallback
 * - NÃO captura erro silenciosamente
 * - Se falhar, lança exceção
 */
export class MistralProvider implements IAProvider {
  private readonly apiUrl = 'https://api.mistral.ai/v1/chat/completions'
  private readonly apiKey: string

  constructor() {
    const key = import.meta.env.VITE_MISTRAL_API_KEY

    if (!key) {
      throw new Error(
        'MistralProvider: VITE_MISTRAL_API_KEY não definida'
      )
    }

    this.apiKey = key
  }

  async generate(prompt: string): Promise<IAResponse> {
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          { role: 'user', content: prompt },
        ],
        temperature: 0.4,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(
        `MistralProvider failed: ${response.status} ${errorText}`
      )
    }

    const data = await response.json()

    const output =
      data?.choices?.[0]?.message?.content

    if (!output) {
      throw new Error(
        'MistralProvider: empty response'
      )
    }

    return { output }
  }
}
