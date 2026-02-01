// src/marketing/types.ts

/**
 * =================================================================
 * CORE INTERFACES
 * =================================================================
 */

/**
 * Interface canônica para uma campanha de marketing, alinhada com o contrato do backend (n8n).
 * Esta é a fonte da verdade para a estrutura de dados de uma campanha.
 */
export interface Campaign {
  id: string;
  nome: string;
  plataforma: 'google' | 'meta' | 'organico' | 'outro';
  investimento: number;
  receita: number | null;
  roi: number | null;
  status: 'Rascunho' | 'Planejada' | 'Ativa' | 'Pausada' | 'Encerrada';
  origem_dados: 'manual' | 'navegador_ai' | 'importado';
  atualizado_em: string;
}


/**
 * Níveis de severidade para logs de auditoria.
 */
export enum LogSeverity {
  INFO = 'Info',
  WARNING = 'Warning',
  CRITICAL = 'Critical',
}

/**
 * Métricas agregadas para exibição no dashboard principal.
 */
export interface MarketingMetrics {
  totalLeads: number;
  cpa: number; // Custo por Aquisição
  taxaConversao: number; // Em percentual
  roi: number; // Retorno sobre o Investimento, em percentual
}

/**
 * Representa o contexto de dados e conhecimento utilizado pelo Chatbot (NeuroStrategist).
 * Agrega dados de performance, tendências e a base de conhecimento estratégico.
 */
export interface NeuroContext {
  visibilidade: {
    doctoraliaViews: number;
    tendencia: {
      direcao: 'up' | 'down';
      variacaoPercentual: number;
    };
  };
  interesseReal: {
    topServices: string[];
  };
  alcance: {
    instagramReach: number;
  };
  baseConhecimento: KnowledgeBaseItem[];
}

/**
 * Item individual da base de conhecimento (NeuroLibrary).
 */
export interface KnowledgeBaseItem {
    id: string;
    title: string;
    icon: string;
    content: string;
}

/**
 * Entrada de log para o sistema de auditoria e segurança.
 * Registra ações importantes do sistema, especialmente as automáticas.
 */
export interface AuditLogEntry {
  id: string; // ex: new Date().toISOString() ou um UUID
  timestamp: Date;
  action: string; // Descrição da ação
  user: string; // 'System', 'Victor Lawrence', etc.
  severity: LogSeverity;
  details?: Record<string, any>; // Contexto adicional
}