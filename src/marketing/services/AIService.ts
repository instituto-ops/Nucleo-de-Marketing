// src/marketing/services/AIService.ts

import { NeuroContext } from "../types";
import { getContextString } from "./NeuroLibrary";
import { AIRuntime } from "./AIRuntime";

/**
 * Resposta padrão da IA para o AIService
 * (mantém compatibilidade com a UI)
 */
interface AIResponse {
  text: string | null;
  source: 'Ollama 🦙 (Local)' | 'Template JS';
}

export interface AdCopy {
  titles: string;
  descriptions: string;
  negatives: string;
  source: AIResponse['source'];
}

/**
 * Serviço de Inteligência Artificial.
 * Encapsula a lógica de negócio e delega
 * a execução e fallback ao AIRuntime canônico.
 */
export class AIService {
  private readonly runtime: AIRuntime;

  constructor() {
    this.runtime = new AIRuntime();
  }

  /**
   * Chamada central de IA.
   * NÃO escolhe provider.
   * NÃO faz fallback manual.
   */
  private async _callAI(
    systemPrompt: string,
    userPrompt: string
  ): Promise<AIResponse> {
    const fullPrompt = `
[SYSTEM]
${systemPrompt}

[USER]
${userPrompt}
    `.trim();

    const result = await this.runtime.run(fullPrompt);

    let source: AIResponse['source'] = 'Template JS';
    if (result.runtimeLevel === 'ollama') {
      source = 'Ollama 🦙 (Local)';
    }

    return {
      text: result.output ?? null,
      source,
    };
  }

  /**
   * Gera cópia de anúncio (Google Ads).
   */
  public async generateAdCopy(theme: string): Promise<AdCopy> {
    const systemPrompt =
      'ATUE COMO: Estrategista de Marketing Clínico Ético (Google PMM). ' +
      'REGRAS: Sem promessas de cura, sem escassez, sem urgência artificial. ' +
      'Foque em validação, acolhimento e clareza.';

    const userPrompt =
      `Crie 3 títulos (máx. 30 caracteres cada) e ` +
      `2 descrições (máx. 90 caracteres cada) para um anúncio ` +
      `no Google Ads sobre: ${theme}.`;

    const response = await this._callAI(systemPrompt, userPrompt);
    return this._processAdText(response);
  }

  /**
   * Processa o texto bruto da IA em estrutura de anúncio.
   */
  private _processAdText(response: AIResponse): AdCopy {
    if (!response.text) {
      return {
        titles: `Terapia para ${'tema'}`,
        descriptions: 'Atendimento psicológico especializado.',
        negatives: "-cura, -rápido, -grátis, -imediato",
        source: response.source,
      };
    }

    const lines = response.text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const titles: string[] = [];
    const descriptions: string[] = [];

    for (const line of lines) {
      const clean = line
        .replace(/^\d+\.\s*/, '')
        .replace(/["*]/g, '')
        .replace(/t[íi]tulo:/i, '')
        .replace(/descri[çc][ãa]o:/i, '')
        .trim();

      if (!clean) continue;

      if (clean.length <= 30 && titles.length < 3) {
        titles.push(clean);
      } else if (clean.length <= 90 && descriptions.length < 2) {
        descriptions.push(clean);
      }
    }

    return {
      titles: titles.join('\n'),
      descriptions: descriptions.join('\n'),
      negatives: "-cura, -rápido, -grátis, -imediato",
      source: response.source,
    };
  }

  /**
   * Envia mensagem estratégica ao "Sócio IA".
   */
  public async sendMessage(
    userMessage: string,
    contextData: NeuroContext
  ): Promise<AIResponse> {
    const systemPrompt = this.buildSystemPrompt(contextData);
    return this._callAI(systemPrompt, userMessage);
  }

  /**
   * Constrói o system prompt estratégico com base no contexto.
   */
  private buildSystemPrompt(contextData: NeuroContext): string {
    const { visibilidade, interesseReal, alcance } = contextData;

    const dadosDoMomento = `
[DADOS DO MOMENTO]
- Visibilidade (Doctoralia): ${visibilidade.doctoraliaViews} views
- Interesse Real: ${interesseReal.topServices.join(', ') || 'Nenhum'}
- Alcance Instagram: ${alcance.instagramReach || 0}
    `.trim();

    const bibliotecaMental = `
[SUA BIBLIOTECA MENTAL]
${getContextString()}
    `.trim();

    return `
ATUE COMO: Sócio Estratégico do Psicólogo Victor Lawrence.
TOM DE VOZ: Direto, estratégico, humano e ético.

${dadosDoMomento}

${bibliotecaMental}

OBJETIVO:
Responder de forma acionável.
Se visibilidade caiu → sugerir TOC ou Copy.
Se está alta → sugerir conversão e autoridade.
Use tom de parceiro: "Victor, a situação é..."
    `.trim();
  }
}
