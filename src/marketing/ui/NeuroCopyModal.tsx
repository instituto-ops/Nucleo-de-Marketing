import React, { useState } from 'react';
import { AIService, AdCopy } from '../services/AIService';
import { Sparkles, Loader, Send } from 'lucide-react';

interface NeuroCopyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseCopy: (copy: { theme: string; titles: string; descriptions: string; }) => void;
}

const aiService = new AIService();

export const NeuroCopyModal: React.FC<NeuroCopyModalProps> = ({ isOpen, onClose, onUseCopy }) => {
  const [theme, setTheme] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<AdCopy | null>(null);

  const handleGenerate = async () => {
    if (!theme) return;
    setIsLoading(true);
    setGeneratedCopy(null);
    const result = await aiService.generateAdCopy(theme);
    setGeneratedCopy(result);
    setIsLoading(false);
  };

  const handleUseCopy = () => {
    if (!generatedCopy) return;
    onUseCopy({
        theme,
        titles: generatedCopy.titles,
        descriptions: generatedCopy.descriptions,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-6">
            <Sparkles className="text-purple-500" size={28} />
            <h2 className="text-2xl font-bold text-gray-800">NeuroCopy: Gerador de Anúncios</h2>
        </div>
        
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={theme}
            onChange={e => setTheme(e.target.value)}
            placeholder="Digite o tema (Ex: Ansiedade, TEA Adulto)"
            className="w-full p-3 border rounded-lg"
            disabled={isLoading}
          />
          <button onClick={handleGenerate} disabled={isLoading} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 disabled:bg-purple-300">
            {isLoading ? <Loader size={20} className="animate-spin" /> : 'Gerar'}
          </button>
        </div>

        {generatedCopy && (
          <div className="space-y-4 animate-fade-in">
            <div>
              <h3 className="font-bold text-sm uppercase text-gray-500">Títulos Sugeridos</h3>
              <textarea readOnly value={generatedCopy.titles} rows={3} className="w-full p-2 mt-1 bg-gray-50 rounded-md border" />
            </div>
            <div>
                <h3 className="font-bold text-sm uppercase text-gray-500">Descrições Sugeridas</h3>
                <textarea readOnly value={generatedCopy.descriptions} rows={3} className="w-full p-2 mt-1 bg-gray-50 rounded-md border" />
            </div>
             <div className="text-xs text-gray-400 text-right">Fonte: {generatedCopy.source}</div>
          </div>
        )}
        
        <div className="mt-8 flex justify-between items-center">
            <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200">
                Fechar
            </button>
            {generatedCopy && (
                <button onClick={handleUseCopy} className="flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700 font-bold">
                    <Send size={16} />
                    <span>Inserir na Campanha</span>
                </button>
            )}
        </div>
      </div>
    </div>
  );
};
