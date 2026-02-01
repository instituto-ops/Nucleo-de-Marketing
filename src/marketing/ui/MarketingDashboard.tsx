import React, { useState, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { NeuroContext } from '../types';
import { Radar, BrainCircuit, Library, Factory, Settings2 as Settings, Home, DollarSign } from 'lucide-react';
import { StrategyView } from './StrategyView';
import { knowledgeBase } from '../services/NeuroLibrary';
import { RadarTab } from './RadarTab';
import { FactoryTab } from './FactoryTab';
import { LibraryTab } from './LibraryTab';
import { DataTab } from './DataTab';

type Tab = 'radar' | 'strategy' | 'library' | 'data' | 'ads';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'radar', label: 'Radar', icon: Radar },
    { id: 'strategy', label: 'Estratégia', icon: BrainCircuit },
    { id: 'library', label: 'Biblioteca', icon: Library },
    { id: 'data', label: 'Dados', icon: Settings },
    { id: 'ads', label: 'Campanhas', icon: DollarSign },
];

const NavItem: React.FC<{
  tab: { id: Tab; label: string; icon: React.ElementType };
  isActive: boolean;
  onClick: () => void;
}> = ({ tab, isActive, onClick }) => {
  const Icon = tab.icon;
  
  const baseClasses = "flex items-center w-full py-2 text-sm font-medium transition-colors duration-150 group";
  const activeClasses = "bg-cyan-50 text-cyan-700 border-l-4 border-cyan-500 font-semibold pl-3 pr-4";
  const inactiveClasses = "text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md px-4";

  return (
    <button
      id={`nav-item-${tab.id}`}
      onClick={onClick}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className={`mr-3 h-6 w-6 ${isActive ? 'text-cyan-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
      <span>{tab.label}</span>
    </button>
  );
};

export const MarketingDashboard = () => {
  const [activeTab, setActiveTab] = useState<Tab>('radar');
  const historicalData = useLiveQuery(() => db.settings.get('historical_data'), undefined);

  const neuroContext = useMemo((): NeuroContext => {
    const hist = historicalData?.value;
    let tendencia = { direcao: 'up' as 'up' | 'down', variacaoPercentual: 0 };
    if (hist && hist.length >= 2) {
      const atual = hist[hist.length - 1].views;
      const anterior = hist[hist.length - 2].views;
      const variacao = anterior > 0 ? ((atual - anterior) / anterior) * 100 : 0;
      tendencia = {
        direcao: variacao >= 0 ? 'up' : 'down',
        variacaoPercentual: parseFloat(variacao.toFixed(1)),
      };
    }

    return {
      visibilidade: {
        doctoraliaViews: hist?.slice(-1)[0]?.views || 0,
        tendencia,
      },
      interesseReal: { topServices: [] },
      alcance: { instagramReach: 0 },
      baseConhecimento: knowledgeBase,
    };
  }, [historicalData]);

  const renderContent = () => {
    switch (activeTab) {
      case 'radar': return <RadarTab />;
      case 'strategy': return <StrategyView neuroContext={neuroContext} />;
      case 'library': return <LibraryTab />;
      case 'data': return <DataTab />;
      case 'ads': return <FactoryTab />;
      default: return <RadarTab />;
    }
  };

  const activeTabLabel = TABS.find(tab => tab.id === activeTab)?.label || 'Dashboard';

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
        <div className="h-16 flex items-center px-4 border-b border-gray-200">
          <BrainCircuit className="h-8 w-8 text-cyan-500" />
          <h1 className="ml-3 text-xl font-bold text-gray-800">NeuroStrategy</h1>
        </div>
        <nav className="flex-1 px-2 py-4 space-y-1">
          {TABS.map(tab => (
            <NavItem
              key={tab.id}
              tab={tab}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </aside>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          <h2 className="text-xl font-semibold text-gray-900">{activeTabLabel}</h2>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};