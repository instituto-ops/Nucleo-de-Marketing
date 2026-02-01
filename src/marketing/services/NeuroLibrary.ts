import { KnowledgeBaseItem } from '../types';

/**
 * Array contendo a base de conhecimento sobre modelos mentais e estratégias.
 * Extraído do objeto `NeuroLibrary` original.
 */
export const knowledgeBase: KnowledgeBaseItem[] = [
  {
    id: 'pmm',
    title: "Clinical PMM (Product-Market Fit)",
    icon: "🩺",
    content: "O produto é a 'Aliança Terapêutica'. O foco é Matching (ressonância), não venda. O paciente não compra cura, compra segurança e compreensão. Ajuste a linguagem para acolhimento técnico."
  },
  {
    id: 'ooda',
    title: "Ciclo OODA Clínico",
    icon: "🔄",
    content: "Protocolo de decisão rápida (24h-48h): Observar (Sintomas) -> Orientar (Histórico) -> Decidir (Triagem) -> Agir (Agendar/Encaminhar). Evite a paralisia por análise."
  },
  {
    id: 'toc',
    title: "Teoria das Restrições (TOC)",
    icon: "⛓️",
    content: "Identifique o gargalo único. Se Leads > Capacidade de Triagem = O gargalo é Triagem (Automatize). Se Triagem > Agendamento = O gargalo é Confiança (Melhore o Pacing)."
  },
  {
    id: 'copy',
    title: "Copywriting Ericksoniano",
    icon: "✍️",
    content: "Uso de Pacing & Leading em vez de escassez. Comece validando a dor do paciente (Pacing) para depois guiar para a solução (Leading). Ex: 'Eu sei que você já tentou muito...' (Pacing) '...e por isso merece uma abordagem nova' (Leading)."
  },
  {
    id: 'geo',
    title: "GEO (Generative Engine Optimization)",
    icon: "🤖",
    content: "Escreva para ser citado por IAs. Estrutura: Pergunta Clara -> Resposta Direta (Definição) -> Evidência Científica -> Nuance Clínica (Experiência do Victor)."
  }
];

/**
 * Formata a base de conhecimento em uma única string de texto,
 * pronta para ser injetada em um system prompt de IA.
 * @returns Uma string contendo todos os modelos mentais.
 */
export function getContextString(): string {
  return knowledgeBase
    .map(item => `- ${item.title}: ${item.content}`)
    .join('\n');
}
