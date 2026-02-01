import React, { useEffect, useState } from 'react';
import { getRadarDataBySource } from '../db/client';
import { ArrowRight, AlertTriangle, TrendingUp, ShieldCheck } from 'lucide-react';

interface InsightCard {
  type: 'warning' | 'success' | 'neutral';
  title: string;
  message: string;
  actionLabel?: string;
  actionTarget?: string;
}

export const RadarTab: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<InsightCard[]>([]);
  const [statusGeral, setStatusGeral] = useState<{label: string, color: string}>({label: 'Analisando...', color: 'text-gray-500'});

  useEffect(() => {
    const processarInteligencia = async () => {
      const docData = await getRadarDataBySource('doctoralia');
      
      // Lógica de Negócio OODA (Hardcoded Analysis)
      const atual = docData.length > 0 ? docData[docData.length-1].views : 23; 
      const pico = 110; 
      const recuperacao = (atual / pico) * 100;

      const novosInsights: InsightCard[] = [];

      if (recuperacao < 50) {
        setStatusGeral({ label: '⚠️ MODO RECUPERAÇÃO', color: 'text-red-600' });
        novosInsights.push({
          type: 'warning',
          title: 'Queda de Autoridade Detectada',
          message: `Operando a ${recuperacao.toFixed(0)}% da capacidade histórica. Perda de tração detectada.`,
          actionLabel: 'Ativar Plano de Resgate',
          actionTarget: 'factory'
        });
      } else if (recuperacao >= 50 && recuperacao < 80) {
        setStatusGeral({ label: '🔄 MODO MANUTENÇÃO', color: 'text-yellow-600' });
        novosInsights.push({
          type: 'neutral',
          title: 'Estabilidade Sólida',
          message: 'Audiência base retida. Momento ideal para testar novos temas.',
          actionLabel: 'Explorar Biblioteca',
          actionTarget: 'library'
        });
      } else {
        setStatusGeral({ label: '🚀 MODO ESCALA', color: 'text-green-600' });
        novosInsights.push({
          type: 'success',
          title: 'Alta Demanda',
          message: 'Autoridade próxima do pico. Considere aumentar o valor da sessão.',
          actionLabel: 'Ajustar Triagem',
          actionTarget: 'factory' // Placeholder, could be a different target
        });
      }
      setInsights(novosInsights);
      setLoading(false);
    };
    processarInteligencia();
  }, []);

  const handleNavigation = (targetId: string) => {
    // This is a "controlled break" from React's paradigm for simplicity,
    // relying on the parent dashboard's DOM structure.
    const tab = document.getElementById(`nav-item-${targetId}`);
    if (tab) tab.click();
  };

  if (loading) return <div className="p-10 text-center text-gray-500">🧠 O NeuroStrategy está analisando seus dados...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4 md:p-6">
      {/* Header de Situação */}
      <div className="bg-white p-6 rounded-xl border-l-8 border-blue-600 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">Diagnóstico Estratégico</h2>
          <div className={`text-2xl md:text-3xl font-bold ${statusGeral.color} flex items-center gap-3`}>
            {statusGeral.label}
          </div>
        </div>
        <div className="text-right opacity-70">
           <p className="text-xs font-bold text-gray-400 uppercase">Referência (Jul/25)</p>
           <p className="text-2xl font-mono text-gray-700">{110} <span className="text-sm">views</span></p>
        </div>
      </div>

      {/* Cards de Ação */}
      <div className="grid gap-4">
        {insights.map((card, idx) => (
          <div key={idx} className={`p-6 rounded-xl border-2 transition-all hover:shadow-lg ${
            card.type === 'warning' ? 'bg-red-50 border-red-100' : 
            card.type === 'success' ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'
          }`}>
            <div className="flex gap-5 items-start">
              <div className={`p-3 rounded-full ${
                card.type === 'warning' ? 'bg-red-200 text-red-700' : 
                card.type === 'success' ? 'bg-green-200 text-green-700' : 'bg-gray-100 text-gray-600'
              }`}>
                {card.type === 'warning' ? <AlertTriangle size={24}/> : card.type === 'success' ? <TrendingUp size={24}/> : <ShieldCheck size={24}/>}
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-xl mb-2 text-gray-800">{card.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{card.message}</p>

                {card.actionLabel && (
                  <button 
                    onClick={() => handleNavigation(card.actionTarget!)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm shadow-sm transition-transform active:scale-95 ${
                      card.type === 'warning' ? 'bg-red-600 hover:bg-red-700 text-white' : 
                      card.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-800 hover:bg-black text-white'
                    }`}
                  >
                    {card.actionLabel} <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
