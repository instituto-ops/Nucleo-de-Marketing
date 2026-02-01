import React, { useState, useEffect, useCallback } from 'react';
import { Campaign } from '../types';
import { BrainCircuit, Sparkles, RefreshCw, Server, WifiOff, AlertTriangle } from 'lucide-react';
import { AnalysisModal } from './AnalysisModal';
import { NeuroCopyModal } from './NeuroCopyModal';

// Tipos de Erro para uma melhor distinção na UI
type FetchError = 'network' | 'parsing' | null;

// Mapeamento de Status da Campanha para Estilos de UI
const statusStyles: Record<Campaign['status'], string> = {
    'Ativa': 'bg-green-100 text-green-800',
    'Planejada': 'bg-blue-100 text-blue-800',
    'Pausada': 'bg-yellow-100 text-yellow-800',
    'Encerrada': 'bg-gray-100 text-gray-700',
    'Rascunho': 'bg-orange-100 text-orange-800',
};

// Componente para renderizar uma única linha de campanha
const CampaignRow: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
    return (
        <div className="group bg-white border border-cyan-200 rounded-lg mb-2 flex items-center justify-between p-3 pr-4 hover:shadow-md transition-shadow duration-200">
            {/* Nome e Plataforma */}
            <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{campaign.nome}</p>
                    <span title={`Origem: ${campaign.origem_dados}`} className="text-[10px] bg-cyan-50 text-cyan-600 px-1.5 py-0.5 rounded border border-cyan-100">
                        {campaign.origem_dados === 'navegador_ai' ? 'AUTO' : 'IMPORT'}
                    </span>
                </div>
                <p className="text-sm text-gray-500">{campaign.plataforma.toLocaleUpperCase()}</p>
            </div>

            {/* Status */}
            <div className="flex-none w-48 pr-4">
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusStyles[campaign.status] || 'bg-gray-100 text-gray-800'}`}>
                    {campaign.status}
                </span>
            </div>

            {/* Métricas Financeiras */}
            <div className="hidden md:flex flex-none w-48 items-center text-sm text-gray-800 pr-4">
                <span>R$ {campaign.investimento.toFixed(0)}</span>
                <span className="mx-2 text-gray-300">|</span>
                {campaign.roi !== null ? (
                    <span className={`${campaign.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ROI {campaign.roi.toFixed(1)}%
                    </span>
                ) : (
                    <span className="text-gray-400">ROI N/A</span>
                )}
            </div>

            {/* Ícone de gerenciamento remoto */}
            <div className="flex items-center">
                <span title="Gerenciado pelo NeuroEngine (n8n)" className="p-2 text-cyan-400 cursor-help"><Server size={16} /></span>
            </div>
        </div>
    );
};

// Parser estrito para o array de campanhas
const adaptNeuroEnginePayload = (data: any) => {
    if (!Array.isArray(data)) data = [data];

    return data.map((item: any) => {
        const now = new Date().toISOString();

        let plataforma = item.plataforma;
        if (!plataforma && typeof item.canal === 'string') {
            const canal = item.canal.toLowerCase();
            if (canal.includes('google')) plataforma = 'google';
            else if (canal.includes('meta') || canal.includes('facebook')) plataforma = 'meta';
            else plataforma = 'outro';
        }

        return {
            ...item,
            plataforma,
            receita: typeof item.receita === 'number' ? item.receita : null,
            origem_dados: item.origem_dados ?? 'importado',
            atualizado_em: typeof item.atualizado_em === 'string' ? item.atualizado_em : now,
            status: typeof item.status === 'string'
                ? item.status.charAt(0).toUpperCase() + item.status.slice(1).toLowerCase()
                : 'Rascunho',
        };
    });
};

const parseCampaigns = (data: any): Campaign[] => {
    if (!Array.isArray(data)) {
        // Se a API retorna um objeto único em vez de um array
        if (data && typeof data === 'object') {
            data = [data];
        } else {
            throw new Error('Formato de dados inesperado. Um array de campanhas era esperado.');
        }
    }

    return data.map((item: any, index: number) => {
        // Validação de tipo e existência para cada campo
        if (!item || typeof item !== 'object') throw new Error(`Item inválido no índice ${index}.`);
        if (typeof item.id !== 'string') throw new Error(`ID inválido para o item no índice ${index}.`);
        if (typeof item.nome !== 'string') throw new Error(`Nome inválido para o item no índice ${index}.`);
        if (!['google', 'meta', 'organico', 'outro'].includes(item.plataforma)) throw new Error(`Plataforma inválida para o item no índice ${index}.`);
        if (typeof item.investimento !== 'number') throw new Error(`Investimento inválido para o item no índice ${index}.`);
        if (item.receita !== null && typeof item.receita !== 'number') throw new Error(`Receita inválida para o item no índice ${index}.`);
        if (item.roi !== null && typeof item.roi !== 'number') throw new Error(`ROI inválido para o item no índice ${index}.`);
        if (!['Rascunho', 'Planejada', 'Ativa', 'Pausada', 'Encerrada'].includes(item.status)) throw new Error(`Status inválido para o item no índice ${index}.`);
        if (!['manual', 'navegador_ai', 'importado'].includes(item.origem_dados)) throw new Error(`Origem de dados inválida para o item no índice ${index}.`);
        if (typeof item.atualizado_em !== 'string') throw new Error(`Data de atualização inválida para o item no índice ${index}.`);

        return {
            id: item.id,
            nome: item.nome,
            plataforma: item.plataforma,
            investimento: item.investimento,
            receita: item.receita,
            roi: item.roi,
            status: item.status,
            origem_dados: item.origem_dados,
            atualizado_em: item.atualizado_em,
        };
    });
};

export const FactoryTab: React.FC = () => {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<FetchError>(null);
    
    // Estado para os modais não relacionados com dados de campanha
    const [analysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [neuroCopyModalOpen, setNeuroCopyModalOpen] = useState(false);

    const syncWithNeuroEngine = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setCampaigns([]); // Limpa os dados antigos antes de buscar novos

        try {
            const response = await fetch('http://localhost:5678/webhook/campanhas');

            if (!response.ok) {
                throw new Error('network');
            }

            const text = await response.text();

            if (!text) {
                throw new Error('Resposta vazia do NeuroEngine');
            }

            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error('Resposta inválida do NeuroEngine:', text);
                throw err;
            }

            const adaptedData = adaptNeuroEnginePayload(data);
            const parsedData = parseCampaigns(adaptedData);
            setCampaigns(parsedData);

        } catch (e: any) {
             if (e.message === 'network') {
                console.error("Erro de rede ao conectar com NeuroEngine:", e);
                setError('network');
            } else {
                console.error("Erro de parsing nos dados do NeuroEngine:", e);
                setError('parsing');
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        syncWithNeuroEngine();
    }, [syncWithNeuroEngine]);

    const SecondaryButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({onClick, children}) => (
        <button onClick={onClick} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 text-sm font-medium">
            {children}
        </button>
    );

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="text-center py-20 text-gray-500">
                    <RefreshCw size={24} className="mx-auto animate-spin mb-3" />
                    <h3 className="text-lg font-medium text-gray-800">Sincronizando com o NeuroEngine...</h3>
                    <p className="mt-1">Buscando os dados mais recentes das campanhas.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="text-center py-20 text-red-500 bg-red-50 border border-dashed border-red-200 rounded-lg">
                    {error === 'network' ? <WifiOff size={24} className="mx-auto mb-3" /> : <AlertTriangle size={24} className="mx-auto mb-3" />}
                    <h3 className="text-lg font-medium text-red-800">
                        {error === 'network' ? 'Erro de Conexão' : 'Erro de Dados'}
                    </h3>
                    <p className="mt-1 text-red-700">
                        {error === 'network' 
                            ? 'Não foi possível conectar ao n8n. Verifique se o serviço está rodando.'
                            : 'Os dados recebidos do n8n estão malformados ou inconsistentes.'
                        }
                    </p>
                </div>
            );
        }

        if (campaigns.length === 0) {
            return (
                <div className="text-center py-20 text-gray-500 bg-white border border-dashed rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800">Nenhuma campanha encontrada</h3>
                    <p className="mt-1">O NeuroEngine não retornou nenhuma campanha. Clique em "Sincronizar" para tentar novamente.</p>
                </div>
            );
        }

        return (
            <div className="space-y-1">
                {campaigns.map(c => <CampaignRow key={c.id} campaign={c} />)}
            </div>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    Fábrica de Campanhas
                    {!isLoading && !error && (
                        <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full border border-green-200">
                            ONLINE
                        </span>
                    )}
                </h1>
                <div className="flex items-center gap-3">
                    <SecondaryButton onClick={syncWithNeuroEngine}>
                        <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                        <span>{isLoading ? "Sincronizando..." : "Sincronizar"}</span>
                    </SecondaryButton>
                    <SecondaryButton onClick={() => setAnalysisModalOpen(true)}>
                        <BrainCircuit size={16} /><span>Análise ROI</span>
                    </SecondaryButton>
                    <SecondaryButton onClick={() => setNeuroCopyModalOpen(true)}>
                        <Sparkles size={16} /><span>NeuroCopy</span>
                    </SecondaryButton>
                </div>
            </div>

            {renderContent()}

            <AnalysisModal isOpen={analysisModalOpen} onClose={() => setAnalysisModalOpen(false)} />
            <NeuroCopyModal 
                isOpen={neuroCopyModalOpen} 
                onClose={() => setNeuroCopyModalOpen(false)} 
                onUseCopy={() => { /* Funcionalidade de criar campanha local removida */ }} 
            />
        </div>
    );
};
