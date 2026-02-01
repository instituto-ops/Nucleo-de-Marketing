import React from 'react';
import { knowledgeBase } from '../services/NeuroLibrary';
import { BookOpen } from 'lucide-react';

export const LibraryTab: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BookOpen size={24} className="text-gray-500" />
        <h1 className="text-xl font-semibold text-gray-800">Base de Conhecimento</h1>
      </div>
      
      {/* Container de Conteúdo */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        {knowledgeBase.map((model, index) => (
          <div 
            key={model.id} 
            className={`p-6 ${index < knowledgeBase.length - 1 ? 'border-b border-gray-100' : ''}`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl text-gray-500 mt-1">{model.icon}</span>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{model.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{model.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};