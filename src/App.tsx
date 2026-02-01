import React, { useEffect, useState } from 'react';
import { db } from './marketing/db';
import { MarketingDashboard } from './marketing/ui/MarketingDashboard';
import { invoke } from '@tauri-apps/api/core';

function App() {
  const [isDbInitialized, setIsDbInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Popula o banco de dados com dados iniciais se necessário.
        await db.seedInitialData();
        console.log("Banco de dados inicializado com sucesso.");
        setIsDbInitialized(true);
      } catch (error) {
        console.error("Falha ao inicializar o banco de dados:", error);
      }
    };

    const setupAutomation = async () => {
      try {
        await invoke('create_automation_structure');
        console.log('Automation structure created successfully.');
      } catch (error) {
        console.error('Failed to create automation structure:', error);
      }
    };

    initialize();
    setupAutomation();
  }, []); // O array vazio garante que isso rode apenas uma vez.

  // Mostra um loader enquanto o DB está sendo verificado/populado
  if (!isDbInitialized) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'sans-serif',
        backgroundColor: '#f4f6f8'
      }}>
        Iniciando NeuroStrategy OS...
      </div>
    );
  }

  return <MarketingDashboard />;
}

export default App;