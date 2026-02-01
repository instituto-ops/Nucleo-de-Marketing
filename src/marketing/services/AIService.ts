import { invoke } from '@tauri-apps/api/core';
import { NeuroContext } from "../types";
import { getContextString } from "./NeuroLibrary";
import { generateAdFromTemplate } from './TemplateEngine';

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
 * Encapsula a lógica de chamada de API híbrida (Nuvem com Fallback Local).
 */
export class AIService {
  /**
   * Chama o cérebro digital (IA) com um prompt de sistema e de usuário.
   * Tenta a API da Groq primeiro e faz fallback para Ollama local.
   */
  private async _callAI(systemPrompt: string, userPrompt: string): Promise<AIResponse> {
    /*
    try {
      // 1️⃣ Gemini (Cloud Principal)
      return await callGemini(systemPrompt, userPrompt);
    } catch (e1) {
      console.warn('Gemini falhou, tentando Ollama', e1);
    */
      try {
        // 2️⃣ Ollama (Local)
        const response = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: "llama3.2:latest",
            messages: [
              { "role": "user", "content": userPrompt }
            ],
            stream: false
          })
        });

        if (!response.ok) {
          throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Ollama respondeu:", data);
        return { text: data.message.content, source: 'Ollama 🦙 (Local)' };

      } catch (e2) {
        console.warn('Ollama falhou, usando Template', e2);

        // 3️⃣ Template JS (Fallback Final)
        return generateAdFromTemplate(userPrompt);
      }
    /*
    }
    */
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
