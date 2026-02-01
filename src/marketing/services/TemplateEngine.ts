export interface TemplateResult {
  text: string;
  source: 'Template JS';
}

/**
 * Motor de Templates Inquebrável (Nível 3 da Tríade de IA)
 * Gera anúncios baseados em regras heurísticas quando IA falha.
 */
export function generateAdFromTemplate(theme: string): TemplateResult {
  return {
    text: `
Título: Atendimento especializado em ${theme}
Título: Terapia focada em ${theme}
Título: Apoio profissional para ${theme}

Descrição: Atendimento ético, humano e individualizado.
Descrição: Profissional com experiência em ${theme}.
    `.trim(),
    source: 'Template JS'
  };
}
