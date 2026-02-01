/**
 * NOTE: Este arquivo requer a instalação do XState: `npm install xstate`
 */

import { setup, assign, fromPromise } from 'xstate';
import { Campaign, MarketingChannel } from '../types';

// --- Helpers e Lógica de Negócio ---

/**
 * Lógica extraída de `NeuroOODA.verificarSeguranca`.
 * Simula uma verificação de segurança assíncrona para uma campanha.
 * @param campaign A campanha a ser analisada.
 * @returns Uma promessa que resolve se a campanha é segura ou rejeita com um erro se não for.
 */
const runOODACheck = async (campaign: Campaign): Promise<Campaign> => {
  const BENCHMARK_CPC: Record<MarketingChannel, number> = {
    [MarketingChannel.GOOGLE_SEARCH]: 2.50,
    [MarketingChannel.META_ADS]: 1.00,
    [MarketingChannel.GOOGLE_PMAX]: 1.50,
  };

  const cpcMedio = BENCHMARK_CPC[campaign.canal] || 1.50;
  
  // A lógica original assume `cliques = leads * 10`. Mantendo para consistência.
  const cliquesEstimados = campaign.leads * 10;
  const cpcAtual = cliquesEstimados > 0 ? (campaign.investimento / cliquesEstimados) : 0;

  console.log(`[OODA Check] CPC Atual: R$${cpcAtual.toFixed(2)}, Benchmark: R$${cpcMedio.toFixed(2)}`);

  // Simula uma chamada de API ou processamento demorado
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (cpcAtual > (cpcMedio * 1.4)) {
    const errorMessage = `CPC (R$${cpcAtual.toFixed(2)}) 40% acima do benchmark (R$${cpcMedio.toFixed(2)}). Ativação bloqueada.`;
    throw new Error(errorMessage);
  }

  // Outras verificações de segurança poderiam ser adicionadas aqui.
  
  return campaign;
};


// --- Máquina de Estado XState ---

export const campaignMachine = setup({
  types: {
    context: {} as { campaign: Campaign; error?: string },
    events: {} as
      | { type: 'SUBMIT' }
      | { type: 'APPROVE' }
      | { type: 'REJECT'; error: string }
      | { type: 'PAUSE' }
      | { type: 'RESUME' }
      | { type: 'EDIT'; campaign: Partial<Campaign> }
      | { type: 'ARCHIVE' },
  },
  actors: {
    runOODACheck: fromPromise(({ input }: { input: Campaign }) => runOODACheck(input)),
  },
  actions: {
    updateCampaign: assign({
      campaign: ({ context, event }) => {
        if (event.type !== 'EDIT') return context.campaign;
        return { ...context.campaign, ...event.campaign };
      },
    }),
    setError: assign({
      error: ({ event }) => {
        if (event.type !== 'REJECT') return undefined;
        return event.error;
      },
    }),
    clearError: assign({
      error: undefined,
    }),
  },
}).createMachine({
  id: 'campaign',
  context: ({ input }: { input: { campaign: Campaign } }) => ({
    campaign: input.campaign,
    error: undefined,
  }),
  initial: 'draft',
  states: {
    draft: {
      on: {
        // Permite a edição dos dados da campanha enquanto está em rascunho.
        EDIT: {
          actions: 'updateCampaign',
        },
        // Inicia o processo de validação para ativar a campanha.
        SUBMIT: {
          target: 'analyzing',
        },
      },
    },
    analyzing: {
      // Invoca o serviço de verificação de segurança (NeuroOODA).
      invoke: {
        id: 'ooda-check',
        src: 'runOODACheck',
        input: ({ context }) => context.campaign,
        // Em caso de sucesso na verificação, dispara o evento APPROVE.
        onDone: {
          target: 'active',
          actions: 'clearError',
        },
        // Em caso de falha, dispara o evento REJECT com a mensagem de erro.
        onError: {
          target: 'paused',
          actions: assign({
            error: ({ event }) => event.error.message,
          }),
        },
      },
    },
    active: {
      on: {
        // Pausa a campanha, movendo para o estado 'paused'.
        PAUSE: {
          target: 'paused',
        },
        // Arquiva a campanha, movendo para o estado final.
        ARCHIVE: {
          target: 'archived',
        },
      },
    },
    paused: {
      on: {
        // Retoma a campanha, voltando ao estado 'active'.
        RESUME: {
          target: 'active',
          actions: 'clearError', // Limpa o erro ao retomar
        },
        // Permite edições para corrigir o problema que causou a pausa.
        EDIT: {
            target: 'draft', // Volta para o rascunho para re-submissão
            actions: 'updateCampaign',
        },
        // Arquiva a campanha, movendo para o estado final.
        ARCHIVE: {
          target: 'archived',
        },
      },
    },
    archived: {
      // Estado terminal. Nenhuma outra ação é possível.
      type: 'final',
    },
  },
});
