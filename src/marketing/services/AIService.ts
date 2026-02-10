// src/marketing/services/AIService.ts

import { invoke } from '@tauri-apps/api/core'
import { NeuroContext } from '../types'
import { getContextString } from './NeuroLibrary'

/**
 * Resposta padrão da IA para o frontend
 * IA é sempre assistiva (nunca decisora)
 */
interface AIResponse {
  text: string | null
  source: 'Ollama 🦙 (Local)' | 'Template JS'
}

export interface AdCopy {
  titles: string
  descriptions: string
  negatives: string
  source: AIResponse['source']
}

/**
 * AIService
 * Camada de orquestração de IA (sem decisão estratégica)
 */
export class AIService {
  /**
   * Chamada central de IA via Tauri (Ollama local)
   * NÃO contém lógica de negócio
   */
  private async callAI(
    systemPrompt: string,
    userPrompt: string
  ): Promise<AIResponse> {
    const fullPrompt = `
[SYSTEM]
${systemPrompt}

[USER]
${userPrompt}
`.trim()

    try {
      const result = await invoke<{ output: string }>('generate_response', {
        request: { prompt: fullPrompt },
      })

      return {
        text: result.output,
        source: 'Ollama 🦙 (Local)',
      }
    } catch (error) {
      console.error('[AIService] Falha ao chamar Ollama:', error)

      return {
        text: null,
        source: 'Template JS',
      }
    }
  }

  /**
   * NeuroCopy — Geração de copy para Google Ads
   * IA sugere. NeuroEngine valida.
   */
  async generateAdCopy(theme: string): Promise<AdCopy> {
    const systemPrompt = `
ATUE COMO:
Estrategista de Marketing Clínico especializado em Google Ads para psicólogos.

REGRAS ÉTICAS OBRIGATÓRIAS:
- NÃO prometer cura
- NÃO usar urgência ou escassez
- NÃO usar termos milagrosos
- NÃO usar linguagem sensacionalista
- Linguagem profissional, acolhedora e clara
`.trim()

    const userPrompt = `
TEMA DO ANÚNCIO:
${theme}

TAREFA:
Gerar cópia FINAL para Google Ads.

FORMATO DE SAÍDA (OBRIGATÓRIO — NÃO EXPLICAR NADA):

TÍTULOS:
1. <título curto, clínico e direto>
2. <título curto, clínico e direto>
3. <título curto, clínico e direto>

DESCRIÇÕES:
1. <descrição acolhedora, ética e profissional>
2. <descrição acolhedora, ética e profissional>

CONTEXTO FIXO:
- Psicólogo clínico
- Atendimento para adultos
- Cidade: Goiânia
- Público sensível (saúde mental)

PROIBIDO:
- Markdown
- Emojis
- Explicações
- Comentários técnicos
`.trim()

    const response = await this.callAI(systemPrompt, userPrompt)
    return this.processAdText(response)
  }

  /**
   * Pós-processamento defensivo do texto da IA
   * Garante contrato mínimo sempre
   */
  private processAdText(response: AIResponse): AdCopy {
    const fallback: AdCopy = {
      titles: 'Atendimento Psicológico em Goiânia',
      descriptions: 'Acompanhamento ético e profissional para adultos.',
      negatives: '-cura, -rápido, -grátis, -milagre',
      source: response.source,
    }

    if (!response.text) {
      return fallback
    }

    const lines = response.text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)

    const titles: string[] = []
    const descriptions: string[] = []

    for (const line of lines) {
      const clean = line
        .replace(/^\d+\.\s*/, '')
        .replace(/^(t[íi]tulos?|descri[çc][ãa]o)s?:/i, '')
        .replace(/["*]/g, '')
        .trim()

      if (!clean) continue

      if (clean.length <= 30 && titles.length < 3) {
        titles.push(clean)
      } else if (clean.length <= 90 && descriptions.length < 2) {
        descriptions.push(clean)
      }
    }

    if (titles.length === 0 || descriptions.length === 0) {
      return fallback
    }

    return {
      titles: titles.join('\n'),
      descriptions: descriptions.join('\n'),
      negatives: '-cura, -rápido, -grátis, -milagre',
      source: response.source,
    }
  }

  /**
   * Mensagem estratégica (modo consultivo)
   */
  async sendMessage(
    userMessage: string,
    contextData: NeuroContext
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(contextData)
    return this.callAI(systemPrompt, userMessage)
  }

  /**
   * Prompt estratégico com contexto ampliado
   */
  private buildSystemPrompt(contextData: NeuroContext): string {
    return `
ATUE COMO:
Sócio Estratégico do Psicólogo Victor Lawrence.

TOM:
Direto, ético, analítico e acionável.

CONTEXTO ATUAL:
${JSON.stringify(contextData, null, 2)}

BASE DE CONHECIMENTO:
${getContextString()}

OBJETIVO:
- Diagnosticar situação
- Sugerir ações práticas
- Priorizar marketing ético e sustentável
`.trim()
  }
}
