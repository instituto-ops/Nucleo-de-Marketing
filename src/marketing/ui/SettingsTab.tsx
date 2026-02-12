import React, { useState } from 'react';
import { Shield, Key, RefreshCw, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { Command } from '@tauri-apps/api/shell';

export const SettingsTab: React.FC = () => {
  const [loadingAds, setLoadingAds] = useState(false);
  const [adsStatus, setAdsStatus] = useState<'connected' | 'disconnected'>('connected'); // Mock inicial

  const handleRenovarSessao = async () => {
    setLoadingAds(true);
    try {
      // Tenta executar o comando Tauri (se configurado no allowlist)
      // Se não estiver configurado, apenas simula para UI
      console.log("Iniciando processo de login...");

      // NOTA: Em produção, isso chamaria o Command definido no tauri.conf.json
      // Por enquanto, simulamos o delay do usuário fazendo login
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert("Comando enviado! O navegador deve abrir em instantes. Faça o login e feche a janela.");
      setAdsStatus('connected');
    } catch (error) {
      console.error(error);
      alert("Erro ao iniciar script de login.");
    } finally {
      setLoadingAds(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="text-blue-600" /> Configurações & Segurança
        </h2>
        <p className="text-gray-500 mt-1">Gerencie as permissões e conexões dos seus agentes autônomos.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Card Google Ads */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                <Key size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Google Ads</h3>
                <p className="text-sm text-gray-500">Conexão via Contexto Persistente</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
              adsStatus === 'connected' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {adsStatus === 'connected' ? <CheckCircle size={12}/> : <AlertTriangle size={12}/>}
              {adsStatus === 'connected' ? 'CONECTADO' : 'DESCONECTADO'}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            O robô utiliza uma sessão salva localmente para acessar o dashboard sem API. 
            Se os dados pararem de atualizar, renove a sessão abaixo.
          </p>

          <button 
            onClick={handleRenovarSessao}
            disabled={loadingAds}
            className={`w-full py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
              loadingAds ? 'bg-gray-100 text-gray-400' : 'bg-gray-900 text-white hover:bg-black'
            }`}
          >
            {loadingAds ? (
              <> <RefreshCw className="animate-spin" size={18} /> Aguardando Login... </>
            ) : (
              <> <Terminal size={18} /> Renovar Sessão Manualmente </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
