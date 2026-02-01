import React, { useState, useMemo } from 'react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisModal: React.FC<AnalysisModalProps> = ({ isOpen, onClose }) => {
  const [investment, setInvestment] = useState('');
  const [revenue, setRevenue] = useState('');

  const result = useMemo(() => {
    const inv = parseFloat(investment);
    const rev = parseFloat(revenue);
    if (isNaN(inv) || isNaN(rev) || inv <= 0) {
      return { roi: '0.00', profit: '0.00', color: 'text-gray-700' };
    }
    const roi = ((rev - inv) / inv) * 100;
    const profit = rev - inv;
    const color = profit >= 0 ? 'text-green-600' : 'text-red-600';
    return { roi: roi.toFixed(2), profit: profit.toFixed(2), color };
  }, [investment, revenue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md animate-fade-in" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Análise de Cenário (ROI)</h2>
        <div className="space-y-4">
          <input
            type="number"
            value={investment}
            onChange={e => setInvestment(e.target.value)}
            placeholder="Investimento Estimado (R$)"
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="number"
            value={revenue}
            onChange={e => setRevenue(e.target.value)}
            placeholder="Receita Estimada (R$)"
            className="w-full p-3 border rounded-lg"
          />
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
          <h3 className="text-sm font-semibold text-gray-500">RESULTADO</h3>
          <div className={`text-4xl font-bold mt-2 ${result.color}`}>{result.roi}%</div>
          <div className="text-md text-gray-600 mt-1">Lucro de R$ {result.profit}</div>
        </div>
        <div className="mt-6 text-right">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-800">Fechar</button>
        </div>
      </div>
    </div>
  );
};
