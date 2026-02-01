import React, { useState, useRef, useEffect } from 'react';
import { AIService } from '../services/AIService';
import { NeuroContext } from '../types';

// --- STYLES ---
const styles: { [key: string]: React.CSSProperties } = {
  chatInterface: {
    display: 'flex',
    flexDirection: 'column',
    height: '70vh',
    maxWidth: '800px',
    margin: '0 auto',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#fff',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  },
  chatWindow: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f4f6f7',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  inputArea: {
    padding: '20px',
    backgroundColor: '#fff',
    borderTop: '1px solid #ddd',
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    fontSize: '1rem',
  },
  sendButton: {
    padding: '12px 25px',
    border: 'none',
    borderRadius: '8px',
    background: '#2c3e50',
    color: 'white',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  message: {
    padding: '12px 18px',
    borderRadius: '18px',
    maxWidth: '80%',
    lineHeight: 1.5,
    fontSize: '0.95rem',
  },
  userMessage: {
    backgroundColor: '#3498db',
    color: 'white',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '4px',
  },
  botMessage: {
    backgroundColor: '#e0e0e0',
    color: '#2c3e50',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '4px',
  },
  sourceTag: {
    fontSize: '0.7rem',
    color: '#7f8c8d',
    marginTop: '5px',
    textAlign: 'right',
  },
};

// --- TYPES ---
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  source?: string;
}

interface StrategyViewProps {
  neuroContext: NeuroContext;
}

const aiService = new AIService();

// --- COMPONENT ---
export const StrategyView = ({ neuroContext }: StrategyViewProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: "Olá, Victor. Sou seu <strong>NeuroStrategist</strong>.<br>Já analisei seus dados de hoje. O que deseja alinhar?",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(inputValue, neuroContext);
      const botMessage: Message = {
        id: Date.now() + 1,
        text: response.text || "Desculpe, não consegui processar sua solicitação.",
        sender: 'bot',
        source: response.source,
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error communicating with AI service:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Ocorreu um erro ao conectar com a IA. Verifique o console para mais detalhes.",
        sender: 'bot',
        source: 'FALHA',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        handleSendMessage();
    }
  };

  return (
    <div style={styles.chatInterface}>
      <div ref={chatWindowRef} style={styles.chatWindow}>
        {messages.map(msg => (
          <div key={msg.id} style={{ ...styles.message, ...(msg.sender === 'user' ? styles.userMessage : styles.botMessage) }}>
            <span dangerouslySetInnerHTML={{ __html: msg.text }} />
            {msg.source && <div style={styles.sourceTag}>{msg.source}</div>}
          </div>
        ))}
        {isLoading && (
          <div style={{...styles.message, ...styles.botMessage}}>
            Thinking...
          </div>
        )}
      </div>
      <div style={styles.inputArea}>
        <input
          type="text"
          style={styles.textInput}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ex: O que faço com a queda de views?"
          disabled={isLoading}
        />
        <button style={styles.sendButton} onClick={handleSendMessage} disabled={isLoading}>
          {isLoading ? '...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};
