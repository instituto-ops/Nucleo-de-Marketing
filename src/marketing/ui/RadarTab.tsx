import React, { useEffect, useState } from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

interface RankingItem {
  termo_pesquisado: string;
  ranking_pos: number;
  status: string;
  timestamp: string;
}

export const RadarTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<RankingItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRankingData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:5678/webhook/doctoralia');
        if (!response.ok) {
          throw new Error(`A resposta da rede não foi 'ok': ${response.statusText}`);
        }
        const data = await response.json();
        // Ordena os dados: ranqueados primeiro, em ordem crescente. Não-ranqueados depois.
        const sortedData = [...data].sort((a, b) => {
          if (a.ranking_pos > 0 && b.ranking_pos > 0) {
            return a.ranking_pos - b.ranking_pos;
          }
          if (a.ranking_pos > 0) return -1;
          if (b.ranking_pos > 0) return 1;
          return a.termo_pesquisado.localeCompare(b.termo_pesquisado);
        });
        setRankingData(sortedData);
      } catch (e: any) {
        console.error('Falha ao buscar dados de ranking:', e);
        setError('Falha ao buscar dados do ranking. Verifique se a API (n8n) está rodando e o console para mais detalhes.');
      } finally {
        setLoading(false);
      }
    };

    fetchRankingData();
  }, []);

  if (loading) return <div className="p-10 text-center text-gray-500">📊 Carregando dados de ranking do NeuroAPI...</div>;
  if (error) return <div className="p-10 text-center text-red-500 flex items-center justify-center gap-3"><AlertTriangle /> {error}</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      <div className="bg-white p-6 rounded-xl border-l-8 border-blue-600 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Monitor de Ranking (Doctoralia)</h2>
          <div className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-3">
            Posicionamento dos Termos
          </div>
        </div>
        <div className="text-right">
           <p className="text-xs font-bold text-gray-400 uppercase">Termos Ranqueados</p>
           <p className="text-2xl font-mono text-gray-700">
             {rankingData.filter(item => item.ranking_pos > 0).length} / {rankingData.length}
           </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {rankingData.map((item, index) => (
            <li key={index} className="p-4 flex justify-between items-center hover:bg-gray-50/50 transition-colors duration-150">
              <div className="flex items-center gap-4">
                 <div className={`flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold ${
                    item.ranking_pos > 0 && item.ranking_pos <= 10 ? 'bg-green-100 text-green-700' :
                    item.ranking_pos > 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                 }`}>
                    {item.ranking_pos > 0 ? `#${item.ranking_pos}` : '-'}
                </div>
                <div>
                    <p className="font-semibold text-gray-800">{item.termo_pesquisado}</p>
                    <p className="text-sm text-gray-500">Verificado em: {new Date(item.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
              <div className={`text-right px-3 py-1 rounded-full text-xs font-medium ${
                  item.status === 'sucesso' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'
              }`}>
                {item.status}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
