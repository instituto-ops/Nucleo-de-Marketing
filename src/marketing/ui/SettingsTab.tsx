import React, { useState } from 'react';
import { Shield, Key, RefreshCw, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { Command } from '@tauri-apps/plugin-shell';

export const SettingsTab: React.FC = () => {
  const [loadingAds, setLoadingAds] = useState(false);
  const [adsStatus, setAdsStatus] = useState<'connected' | 'disconnected'>('connected'); 

  const handleRenovarSessao = async () => {
    setLoadingAds(true);
    try {
      console.log("🚀 Iniciando subsistema de login via Python...");
      
      // Cria o comando usando a sintaxe V2
      const command = await Command.create('python', [
        'scripts/google_ads_manager.py', 
        '--login'
      ]);

      const child = await command.execute();
      
      if (child.code === 0) {
        alert("✅ Sessão renovada! O robô capturou os cookies com sucesso.");
        setAdsStatus('connected');
      } else {
        console.error("Erro stderr:", child.stderr);
        alert(`⚠️ O script rodou mas reportou erro: ${child.stderr}`);
        setAdsStatus('disconnected');
      }

    } catch (error) {
      console.error("Falha crítica ao lançar comando:", error);
      alert("❌ Erro de Execução: Verifique o console e se o App foi reiniciado.");
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