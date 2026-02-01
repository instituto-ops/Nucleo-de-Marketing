import React, { useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { Download, Upload, ListChecks } from 'lucide-react';
import { LogSeverity } from '../types';

// Helper function to format dates
const formatDate = (date: Date) => 
  new Date(date).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });

const severityStyles: { [key in LogSeverity]: string } = {
    [LogSeverity.INFO]: 'bg-blue-100 text-blue-800',
    [LogSeverity.WARNING]: 'bg-yellow-100 text-yellow-800',
    [LogSeverity.CRITICAL]: 'bg-red-100 text-red-800',
};

const ActionButton: React.FC<{ onClick: () => void; icon: React.ReactNode; label: string }> = ({ onClick, icon, label }) => (
    <button 
        onClick={onClick} 
        className="flex items-center justify-center gap-2 py-2 px-4 bg-[#00bcd4] text-white rounded-md shadow-sm hover:bg-[#00acc1] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 text-sm font-medium"
    >
        {icon}
        <span>{label}</span>
    </button>
);

export const DataTab: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logs = useLiveQuery(() => db.audit_logs.orderBy('timestamp').reverse().limit(100).toArray(), []);

  const handleExport = async () => {
    try {
      const campaigns = await db.campaigns.toArray();
      const settings = await db.settings.toArray();
      
      const backupData = {
        campaigns,
        settings,
        exportDate: new Date().toISOString(),
      };

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `neurostrategy_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      await db.logAction('Backup exportado com sucesso', LogSeverity.INFO);
    } catch (error) {
      console.error('Falha ao exportar backup:', error);
      await db.logAction('Falha ao exportar backup', LogSeverity.CRITICAL);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!window.confirm('Tem certeza? A importação substituirá todos os dados existentes.')) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);

        if (!data.campaigns || !data.settings) {
            throw new Error('Arquivo de backup inválido.');
        }

        await db.transaction('rw', db.campaigns, db.settings, async () => {
          await db.campaigns.clear();
          await db.settings.clear();
          await db.campaigns.bulkAdd(data.campaigns);
          await db.settings.bulkAdd(data.settings);
        });

        alert('Backup importado com sucesso!');
        await db.logAction('Backup importado com sucesso', LogSeverity.INFO);
      } catch (error) {
        console.error('Falha ao importar backup:', error);
        alert('Falha ao importar o arquivo de backup.');
        await db.logAction('Falha ao importar backup', LogSeverity.CRITICAL);
      }
    };
    reader.readAsText(file);
    // Reset file input
    if(event.target) event.target.value = '';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Card de Gerenciamento de Dados */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Gerenciamento de Dados</h2>
        <div className="flex items-center gap-4">
          <ActionButton onClick={handleExport} icon={<Download className="w-4 h-4" />} label="Exportar Backup" />
          <ActionButton onClick={handleImportClick} icon={<Upload className="w-4 h-4" />} label="Importar Backup" />
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        </div>
      </div>

      {/* Card de Logs do Sistema */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <ListChecks size={20} className="text-gray-500"/>
          <h2 className="text-lg font-semibold text-gray-900">Logs do Sistema (Audit Trail)</h2>
        </div>
        
        {/* Container da Lista de Logs */}
        <div className="bg-gray-50 rounded border border-gray-200 max-h-96 overflow-y-auto">
          <div className="font-mono text-xs">
            {logs?.map((log, index) => (
              <div key={log.id} className={`flex items-center justify-between py-2 px-3 ${logs && index < logs.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${severityStyles[log.severity] || 'bg-gray-100 text-gray-800'}`}>
                    {log.severity}
                  </span>
                  <span className="text-gray-600">{log.action}</span>
                </div>
                <span className="text-gray-400">{formatDate(log.timestamp)}</span>
              </div>
            ))}
            {(!logs || logs.length === 0) && (
                <div className="text-center py-10 text-sm text-gray-500">Nenhum log encontrado.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};