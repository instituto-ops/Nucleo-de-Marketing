import { invoke } from '@tauri-apps/api/core';
import { NeuroContext } from "../types";
import { getContextString } from "./NeuroLibrary";
import { generateAdFromTemplate } from './TemplateEngine';
import { AIRuntime } from './AIRuntime'; // Importa o novo Runtime

interface AIResponse {
  text: string | null;
  source: 'Gemini ⚡ (Cloud)' | 'Groq ⚡ (Llama 3)' | 'Ollama 🦙 (Local)' | 'Template JS';
}

export interface AdCopy {
    titles: string;
    descriptions: string;
    negatives: string;
    source: AIResponse['source'];
}

// A função callGemini não é mais usada diretamente aqui, mas pode ser mantida
// para futuras integrações ou por ser usada em outro lugar.
async function callGemini(systemPrompt: string, userPrompt: string) {
  const result = await invoke<{ text: string }>('call_gemini', {
    request: {
      system_prompt: systemPrompt,
      user_prompt: userPrompt,
    },
  });

  if (!result?.text) {
    throw new Error('Gemini returned empty response');
  }

  return {
    text: result.text,
    source: 'Gemini ⚡ (Cloud)',
  };
}

/**
 * Serviço de Inteligência Artificial.
 * Encapsula a lógica de chamada de IA, agora delegando para o AIRuntime.
 */
export class AIService {
  /**
   * Chama o cérebro digital (IA) através do Runtime Central.
   * O Runtime gerencia a lógica de fallback entre providers.
   */
  private async _callAI(systemPrompt: string, userPrompt: string): Promise<AIResponse> {
    const runtimeResponse = await AIRuntime.run({ systemPrompt, userPrompt });

    // Mapeia a resposta do Runtime para o formato esperado pelo resto da classe.
    let source: AIResponse['source'] = 'Template JS'; // Default
    if (runtimeResponse.providerUsed === 'Ollama') {
      source = 'Ollama 🦙 (Local)';
    }
    // Adicionar outros providers aqui se necessário no futuro.

    return {
      text: runtimeResponse.output,
      source: source,
    };
  }

  /**
   * Gera cópia de anúncio (títulos e descrições) para um determinado tema.
   * @param theme O tema do anúncio.
   */
  public async generateAdCopy(theme: string): Promise<AdCopy> {
    const systemPrompt = `ATUE COMO: Estrategista de Marketing Clínico Ético (Google PMM). REGRAS: Sem promessas de cura, sem escassez. Foque em validação e acolhimento.`;
    const userPrompt = `Crie 3 títulos (máximo 30 caracteres cada) e 2 descrições (máximo 90 caracteres cada) para um anúncio no Google Ads sobre: ${theme}.`;
    
    const response = await this._callAI(systemPrompt, userPrompt);
    return this._processAdText(response);
  }

  /**
   * Processa o texto bruto da IA e o formata em uma estrutura de AdCopy.
   */
  private _processAdText(response: AIResponse): AdCopy {
    if (!response.text) {
      return { titles: `Terapia para ${'tema'}`, descriptions: 'Atendimento especializado.', negatives: "-grátis", source: response.source };
    }
    
    const lines = response.text.split('\n').filter(l => l.trim().length > 0);
    const titles: string[] = [];
    const descriptions: string[] = [];
    
    lines.forEach(line => {
      const clean = line.replace(/^\d+\.\s*/, '').replace(/["*]/g, '').replace(/t[íi]tulo:/i, '').replace(/descri[çc][ãa]o:/i, '').trim();
      if (clean.length === 0) return;
      if (clean.length < 50 && titles.length < 3) {
        titles.push(clean);
      } else if (descriptions.length < 2) {
        descriptions.push(clean);
      }
    });

    return {
      titles: titles.join('\n'),
      descriptions: descriptions.join('\n'),
      negatives: "-cura, -rápido, -grátis, -imediato",
      source: response.source
    };
  }

  /**
   * Envia uma mensagem do usuário para o Sócio Estratégico (IA).
   * @param userMessage A mensagem do usuário.
   * @param contextData O contexto atual do sistema.
   */
  public async sendMessage(userMessage: string, contextData: NeuroContext): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(contextData);
    return this._callAI(systemPrompt, userMessage);
  }

  /**
   * Constrói o System Prompt dinâmico para o Sócio Estratégico.
   */
  private buildSystemPrompt(contextData: NeuroContext): string {
    const { visibilidade, interesseReal, alcance } = contextData;
    const dadosDoMomento = `
[DADOS DO MOMENTO]
- Visibilidade (Doctoralia): ${visibilidade.doctoraliaViews} views (${visibilidade.tendencia.direcao === 'up' ? '📈' : '📉'} ${visibilidade.tendencia.variacaoPercentual}%)
- Interesse Real: ${interesseReal.topServices.join(', ') || 'Nenhum'}
- Alcance Instagram: ${alcance.instagramReach || 0}
    `.trim();

    const bibliotecaMental = `
[SUA BIBLIOTECA MENTAL (Modelos de Decisão)]
${getContextString()}
    `.trim();

    return `
ATUE COMO: Sócio Estratégico do Psicólogo Victor Lawrence.
TOM DE VOZ: Breve, direto ao ponto, estratégico e baseado nos dados fornecidos.
${dadosDoMomento}
${bibliotecaMental}
OBJETIVO: Responda ao seu sócio (Victor) de forma acionável. Se a visibilidade caiu, sugira ações da TOC ou Copy. Se está alta, sugira focar em conversão e autoridade. Use o tom: "Parceiro, vi que..." ou "Victor, a situação é...".
    `.trim();
  }
}
