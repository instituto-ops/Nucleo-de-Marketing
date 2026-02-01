import Dexie, { Table } from 'dexie';
import { 
  Campaign, 
  AuditLogEntry, 
  LogSeverity 
} from '../types';

// Interface para a tabela de configurações
export interface ISetting {
  key: string;
  value: any;
}

/**
 * NOTE: Este arquivo requer a instalação do Dexie: `npm install dexie`
 */

export class NeuroDatabase extends Dexie {
  // Declaração das tabelas com tipagem forte
  public campaigns!: Table<Campaign, number>; // number é o tipo da chave primária (id)
  public audit_logs!: Table<AuditLogEntry, number>;
  public settings!: Table<ISetting, string>; // string é o tipo da chave primária (key)

  constructor() {
    super('NeuroStrategyDatabase');
    this.version(1).stores({
      // A sintaxe '++id' indica um ID auto-incrementado.
      // Os campos seguintes são índices para busca rápida.
      campaigns: '++id, plataforma, status',
      audit_logs: '++id, timestamp, severity',
      settings: 'key', // 'key' é a chave primária
    });
  }

  /**
   * Insere um registro de auditoria no banco de dados.
   * @param action - A descrição da ação realizada.
   * @param severity - O nível de severidade do log.
   * @param details - Dados contextuais adicionais.
   */
  public async logAction(
    action: string,
    severity: LogSeverity,
    details?: Record<string, any>
  ): Promise<void> {
    try {
      const logEntry: Omit<AuditLogEntry, 'id'> = {
        timestamp: new Date(),
        action,
        user: 'System', // Por enquanto, todas as ações são do sistema
        severity,
        details,
      };
      await this.audit_logs.add(logEntry as AuditLogEntry);
    } catch (error) {
      console.error("Falha ao registrar ação no AuditLog:", error);
    }
  }

  /**
   * Popula o banco de dados com dados iniciais se estiver vazio.
   * Garante que o sistema tenha um estado base para funcionar na primeira execução.
   */
  public async seedInitialData(): Promise<void> {
    // Transação para garantir a atomicidade da operação
    await this.transaction('rw', this.settings, this.campaigns, async () => {
      const hasBeenSeeded = await this.settings.get('db_seeded');
      if (hasBeenSeeded) {
        console.log("Banco de dados já populado. Ignorando seeding.");
        return;
      }

      console.log("Populando banco de dados com dados iniciais...");

      // 1. Salvar o Histórico do Doctoralia
      const historicoDoctoralia = [
        { mes: 'Jan/25', views: 15 }, { mes: 'Fev/25', views: 25 },
        { mes: 'Mar/25', views: 10 }, { mes: 'Abr/25', views: 25 },
        { mes: 'Mai/25', views: 25 }, { mes: 'Jun/25', views: 25 },
        { mes: 'Jul/25', views: 110, label: 'Mês de Ouro' },
        { mes: 'Ago/25', views: 50 }, { mes: 'Set/25', views: 50 },
        { mes: 'Out/25', views: 50 }, { mes: 'Nov/25', views: 50 },
        { mes: 'Dez/25', views: 50 }, { mes: 'Jan/26', views: 23 }
      ];
      await this.settings.put({ key: 'historical_data', value: historicoDoctoralia });

      // 2. Adicionar a campanha padrão
      const defaultCampaign: Omit<Campaign, 'id'> = {
        nome: "TEA Adulto (Diagnóstico)",
        investimento: 1500,
        receita: 4500,
        plataforma: 'google',
        status: 'Ativa',
        origem_dados: 'manual',
        atualizado_em: new Date().toISOString(),
        // Valores computados baseados na lógica de app.js
        roi: 200, // ((4500 - 1500) / 1500) * 100
      };
      await this.campaigns.add(defaultCampaign as Campaign);
      
      // 3. Marcar o banco como populado para evitar repetições
      await this.settings.put({ key: 'db_seeded', value: true });
      
      await this.logAction("Banco de dados populado com dados iniciais.", LogSeverity.INFO);
    });
  }
}

// Exporta uma instância singleton do banco de dados para ser usada em toda a aplicação
export const db = new NeuroDatabase();
