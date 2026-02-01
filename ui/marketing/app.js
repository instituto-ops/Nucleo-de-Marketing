/**
 * --- START OF FILE app.js ---
 * NeuroStrategy OS - Marketing Module
 * Architecture: Clinical PMM, OODA Loop, Active Security & Authority Analytics (Historical Data).
 */

// 0. INJEÇÃO DE ESTILOS (CSS-in-JS)
const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes security-pulse { 0% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(231, 76, 60, 0); } 100% { box-shadow: 0 0 0 0 rgba(231, 76, 60, 0); } }
  .security-breach { border: 2px solid #e74c3c !important; animation: security-pulse 2s infinite; }
  .automation-log { background: #2c3e50; color: #2ecc71; padding: 15px; margin-top: 20px; border-radius: 8px; font-family: monospace; font-size: 0.9rem; border-left: 5px solid #2ecc71; }
  /* Estilos Orgânicos & Éticos */
  .whatsapp-box { background: #dcf8c6; color: #075e54; padding: 15px; border-radius: 8px; border-left: 5px solid #25d366; margin-top: 10px; font-family: sans-serif; white-space: pre-wrap; }
  .tech-box { background: #f0f0f0; color: #333; padding: 10px; border-radius: 4px; font-size: 0.85rem; margin-bottom: 10px; border-left: 3px solid #666; }
  .golden-rule-banner { background: #fff3cd; color: #856404; border: 1px solid #ffeeba; padding: 10px; margin-bottom: 15px; border-radius: 4px; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }
  /* Estilos Dashboard de Autoridade */
  .authority-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
  .authority-card { background: #fff; padding: 15px; border-radius: 8px; text-align: center; border: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
  .authority-val { font-weight: bold; font-size: 1.4rem; color: #2980b9; display: block; margin-top: 5px; }
  .radar-interest { margin-top: 20px; background: #f9f9f9; padding: 15px; border-radius: 8px; border: 1px dashed #ccc; }
  /* Sparkline Chart (CSS Only) */
  .sparkline-container { display: flex; align-items: flex-end; height: 60px; gap: 4px; margin-top: 15px; padding-bottom: 5px; border-bottom: 1px solid #ddd; }
  .spark-bar { background: #3498db; width: 100%; border-radius: 2px 2px 0 0; position: relative; transition: height 0.5s; }
  .spark-bar.peak { background: #f1c40f; } /* Mês de Ouro */
  .spark-bar:hover::after { content: attr(data-val); position: absolute; top: -20px; left: 50%; transform: translateX(-50%); font-size: 0.7rem; color: #333; }
  /* Estilos Importador */
  .import-tabs { display: flex; gap: 10px; margin-bottom: 15px; border-bottom: 1px solid #ddd; padding-bottom: 10px; }
  .import-tab { padding: 8px 15px; cursor: pointer; border-radius: 4px; background: #eee; }
  .import-tab.active { background: #3498db; color: white; font-weight: bold; }
  .file-drop-zone { border: 2px dashed #ccc; padding: 30px; text-align: center; color: #666; margin-bottom: 15px; cursor: pointer; }
  .file-drop-zone:hover { border-color: #3498db; background: #f0f8ff; }
  
  /* UTILS */
  .hidden { display: none !important; }
  .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
  .modal-content { background: white; padding: 20px; border-radius: 8px; max-width: 600px; width: 90%; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 5px 15px rgba(0,0,0,0.3); }
  .modal-close { position: absolute; top: 10px; right: 10px; cursor: pointer; font-weight: bold; font-size: 1.2rem; color: #7f8c8d; }
  .modal-close:hover { color: #c0392b; }

  /* NOVOS ESTILOS - NAVEGAÇÃO E ABAS */
  .nav-bar { display: flex; background: #2c3e50; padding: 10px; gap: 10px; overflow-x: auto; margin-bottom: 20px; border-radius: 8px; }
  .nav-item { color: #ecf0f1; padding: 10px 20px; cursor: pointer; border-radius: 4px; transition: background 0.3s; white-space: nowrap; display: flex; align-items: center; gap: 8px; }
  .nav-item:hover { background: #34495e; }
  .nav-item.active { background: #3498db; font-weight: bold; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
  
  .tab-view { display: none; animation: fadeIn 0.4s ease-in-out; }
  .tab-view.active { display: block; }
  @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

  /* ESTILOS CHATBOT */
  .chat-interface { display: flex; flex-direction: column; height: 500px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; background: #fff; }
  .chat-window { flex: 1; padding: 20px; overflow-y: auto; background: #f4f6f7; display: flex; flex-direction: column; gap: 15px; }
  .chat-input-area { padding: 20px; background: #fff; border-top: 1px solid #ddd; display: flex; gap: 10px; align-items: center; }
  .chat-message { padding: 12px 18px; border-radius: 18px; max-width: 80%; line-height: 1.5; font-size: 0.95rem; position: relative; }
  .chat-message.user { background: #3498db; color: white; align-self: flex-end; border-bottom-right-radius: 4px; }
  .chat-message.bot { background: #e0e0e0; color: #2c3e50; align-self: flex-start; border-bottom-left-radius: 4px; }
  .chat-message strong { color: inherit; }

  /* ESTILOS NEUROLIBRARY */
  .library-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; }
  .library-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px; transition: all 0.3s; position: relative; overflow: hidden; }
  .library-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); border-color: #3498db; }
  .library-card::before { content: ''; position: absolute; top: 0; left: 0; width: 4px; height: 100%; background: #bdc3c7; transition: background 0.3s; }
  .library-card:hover::before { background: #3498db; }
  .library-icon { font-size: 2.5rem; margin-bottom: 15px; display: block; }
  .library-title { font-weight: bold; font-size: 1.2rem; color: #2c3e50; margin-bottom: 10px; }
  .library-content { font-size: 0.9rem; color: #555; line-height: 1.6; }
`;
document.head.appendChild(styleSheet);

// 1. INFRAESTRUTURA: Mock do EventBus
if (!window.EventBus) {
    window.EventBus = {
        listeners: {},
        emit: function(event, data) { if (this.listeners[event]) this.listeners[event].forEach(cb => cb(data)); },
        on: function(event, callback) { if (!this.listeners[event]) this.listeners[event] = []; this.listeners[event].push(callback); }
    };
}

// --- MÓDULOS DE DADOS (VISIBILIDADE & AUTORIDADE) ---

const NeuroImporter = {
    _dataKey: 'neuro_authority_data',

    // DADOS HISTÓRICOS REAIS (Doctoralia Jan/25 - Jan/26)
    HistoricoDoctoralia: [
        { mes: 'Jan/25', views: 15 },
        { mes: 'Fev/25', views: 25 },
        { mes: 'Mar/25', views: 10 },
        { mes: 'Abr/25', views: 25 },
        { mes: 'Mai/25', views: 25 },
        { mes: 'Jun/25', views: 25 },
        { mes: 'Jul/25', views: 110, label: 'Mês de Ouro' }, // Pico
        { mes: 'Ago/25', views: 50 },
        { mes: 'Set/25', views: 50 },
        { mes: 'Out/25', views: 50 },
        { mes: 'Nov/25', views: 50 },
        { mes: 'Dez/25', views: 50 },
        { mes: 'Jan/26', views: 23 } // Atual
    ],

    getData: function() {
        // Mescla dados do LocalStorage com o Histórico Hardcoded
        const stored = JSON.parse(localStorage.getItem(this._dataKey)) || { 
            doctoralia: { views: 0, phone_clicks: 0, top_services: [] },
            instagram: { reach: 0, saves: 0, top_themes: [] },
            analytics: { sessions: 0, traffic_source: {} }
        };
        
        // Atualiza views do Doctoralia com o último mês do histórico se estiver zerado
        if (stored.doctoralia.views === 0) {
            stored.doctoralia.views = this.HistoricoDoctoralia[this.HistoricoDoctoralia.length - 1].views;
        }
        
        return stored;
    },

    saveData: function(data) {
        localStorage.setItem(this._dataKey, JSON.stringify(data));
        window.EventBus.emit('dados-reais-atualizados');
    },

    getTendenciaAutoridade: function() {
        const hist = this.HistoricoDoctoralia;
        const atual = hist[hist.length - 1].views;
        const anterior = hist[hist.length - 2].views;
        const variacao = ((atual - anterior) / anterior) * 100;
        return {
            variacao: variacao.toFixed(1),
            direcao: variacao >= 0 ? 'up' : 'down',
            meta: 110 // Meta baseada no pico de Julho
        };
    },

    // 1. DOCTORALIA (Foco em Visibilidade)
    importarDoctoralia: function(csvText) {
        const lines = csvText.split('\n');
        let totalViews = 0;
        let totalClicks = 0;
        let servicesMap = {};

        for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',');
            if (cols.length < 2) continue;
            
            const views = parseInt(cols[1]) || 0;
            const clicks = parseInt(cols[2]) || 0;
            const service = cols[3] ? cols[3].trim() : "Geral";

            totalViews += views;
            totalClicks += clicks;

            if (service !== "Geral") {
                servicesMap[service] = (servicesMap[service] || 0) + views;
            }
        }

        const topServices = Object.entries(servicesMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        const currentData = this.getData();
        currentData.doctoralia = {
            views: totalViews,
            phone_clicks: totalClicks,
            top_services: topServices
        };
        this.saveData(currentData);
        return { status: 'success', msg: `Importado: ${totalViews} Views | Top Interesse: ${topServices[0] || 'N/A'}` };
    },

    // 2. INSTAGRAM (Foco em Autoridade/Salvamentos)
    importarInstagram: function(csvText) {
        const lines = csvText.split('\n');
        let totalReach = 0;
        let totalSaves = 0;
        let themesMap = {};

        for(let i=1; i<lines.length; i++) {
            const cols = lines[i].split(',');
            if(cols.length < 3) continue;
            
            const theme = cols[0].split(' ')[0] || "Geral"; 
            const reach = parseInt(cols[1]) || 0;
            const saves = parseInt(cols[2]) || 0;
            
            totalReach += reach;
            totalSaves += saves;

            if (saves > 5) {
                themesMap[theme] = (themesMap[theme] || 0) + saves;
            }
        }

        const topThemes = Object.entries(themesMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(entry => entry[0]);

        const currentData = this.getData();
        currentData.instagram = {
            reach: totalReach,
            saves: totalSaves,
            top_themes: topThemes
        };
        this.saveData(currentData);
        return { status: 'success', msg: `Alcance: ${totalReach} | Top Tema: ${topThemes[0] || 'N/A'}` };
    },

    // 3. GOOGLE ANALYTICS (Tráfego Proprietário)
    conectarAnalytics: async function(propertyId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const mockData = {
                    sessions: 1250,
                    traffic_source: { 'Organic Search': 60, 'Direct': 30, 'Social': 10 }
                };
                
                const currentData = this.getData();
                currentData.analytics = mockData;
                this.saveData(currentData);
                
                resolve({ status: 'success', msg: 'Analytics Conectado: ' + propertyId });
            }, 1500);
        });
    }
};

// --- MÓDULO DE CONHECIMENTO (NOVO) ---
const NeuroLibrary = {
    seedFiles: [
        { id: 'pmm', title: "Clinical PMM (Product-Market Fit)", icon: "🩺", content: "O produto é a 'Aliança Terapêutica'. O foco é Matching (ressonância), não venda. O paciente não compra cura, compra segurança e compreensão. Ajuste a linguagem para acolhimento técnico." },
        { id: 'ooda', title: "Ciclo OODA Clínico", icon: "🔄", content: "Protocolo de decisão rápida (24h-48h): Observar (Sintomas) -> Orientar (Histórico) -> Decidir (Triagem) -> Agir (Agendar/Encaminhar). Evite a paralisia por análise." },
        { id: 'toc', title: "Teoria das Restrições (TOC)", icon: "⛓️", content: "Identifique o gargalo único. Se Leads > Capacidade de Triagem = O gargalo é Triagem (Automatize). Se Triagem > Agendamento = O gargalo é Confiança (Melhore o Pacing)." },
        { id: 'copy', title: "Copywriting Ericksoniano", icon: "✍️", content: "Uso de Pacing & Leading em vez de escassez. Comece validando a dor do paciente (Pacing) para depois guiar para a solução (Leading). Ex: 'Eu sei que você já tentou muito...' (Pacing) '...e por isso merece uma abordagem nova' (Leading)." },
        { id: 'geo', title: "GEO (Generative Engine Optimization)", icon: "🤖", content: "Escreva para ser citado por IAs. Estrutura: Pergunta Clara -> Resposta Direta (Definição) -> Evidência Científica -> Nuance Clínica (Experiência do Victor)." }
    ],
    getKnowledge: function() { return this.seedFiles; },
    findRelated: function(query) { 
        return this.seedFiles.filter(f => 
            query.toLowerCase().includes(f.title.toLowerCase()) || 
            f.content.toLowerCase().includes(query.toLowerCase())
        ); 
    }
};

// --- MÓDULOS DE INTELIGÊNCIA ---

const NeuroOODA = {
    analisar: function(campanha) {
        const alerta = this.verificarSeguranca(campanha);
        if (alerta) return alerta;

        const roi = parseFloat(MarketingAnalytics.calcularROI(campanha.investimento, campanha.receita));
        const taxaConv = parseFloat(MarketingAnalytics.calcularConversao(campanha.leads, campanha.conversoes));
        
        if (campanha.leads > 100 && campanha.conversoes < 5) {
            return { status: "🔴 GARGALO TOC", cor: "#c0392b", acao: "AUTOMATIZAR TRIAGEM", msg: `Fluxo bloqueado. Volume alto (${campanha.leads}) mas agendamento falho.` };
        }
        if (roi > 0 && taxaConv < 1.0) {
            return { status: "🟡 ALERTA: CURIOSOS", cor: "#f39c12", acao: "FILTRAR COPY", msg: `Muitos cliques, pouca ação. Copy atraindo curiosos (Fase See).` };
        }
        if (roi < -10) return { status: "SANGRAMENTO", cor: "#e74c3c", acao: "PAUSAR", msg: `Prejuízo crítico.` };
        if (roi >= -10 && roi < 20) return { status: "ATENÇÃO", cor: "#95a5a6", acao: "OTIMIZAR", msg: `Break-even. Otimize a LP.` };
        return { status: "UNICÓRNIO 🦄", cor: "#8e44ad", acao: "ESCALAR", msg: `Alta eficiência. Aumente o orçamento.` };
    },

    verificarSeguranca: function(campanha) {
        const BENCHMARK_CPC = { google_search: 2.50, meta_ads: 1.00, google_pmax: 1.50 };
        const cpcMedio = BENCHMARK_CPC[campanha.canal] || 1.50;
        const cliquesEst = campanha.leads * 10; 
        const cpcAtual = cliquesEst > 0 ? (campanha.investimento / cliquesEst) : 0;

        if (cpcAtual > (cpcMedio * 1.4)) {
            window.EventBus.emit('automacao-log', `⛔ PAUSA AUTOMÁTICA: Campanha "${campanha.nome}". CPC R$${cpcAtual.toFixed(2)} alto.`);
            return { status: "⛔ BLOQUEIO DE SEGURANÇA", cor: "#e74c3c", acao: "PAUSA AUTOMÁTICA", msg: `CPC disparou (+40%). Pausa preventiva.`, classeExtra: "security-breach" };
        }
        
        const retencaoSimulada = (campanha.receita / (campanha.investimento + 1)) * 10;
        if (retencaoSimulada < 50 && campanha.conversoes > 10) {
             return { status: "⚠️ RISCO CLÍNICO", cor: "#d35400", acao: "REVISAR EXPECTATIVA", msg: `Alta rotatividade. Pacientes não ficam.` };
        }
        return null;
    }
};

const NeuroFilter = {
    analisar: (dados) => {
        let score = 100;
        let tecnico = "";
        let humanizado = "";
        
        if (dados.queixa === 'crise_aguda') {
            return { 
                score: 0, veredito: "INCOMPATÍVEL (EMERGÊNCIA)", cor: "#e74c3c",
                roteiro: {
                    tecnico: "Encaminhamento imediato para emergência.",
                    humanizado: "Sinto muito que esteja passando por esse momento difícil. Como meu atendimento é ambulatorial, não tenho os recursos para te dar a segurança necessária agora. \n\nPor favor, vá ao Pronto Socorro mais próximo ou ligue 188 (CVV)."
                }
            };
        }

        if (dados.tempo === 'indefinido' || dados.historico === 'abandonou_varios') {
            return {
                score: 30, veredito: "PRÉ-CONTEMPLAÇÃO (NUTRIÇÃO)", cor: "#e67e22",
                roteiro: {
                    tecnico: "Lead frio/confuso. Não agendar. Enviar material educativo.",
                    humanizado: "Percebo que você ainda está entendendo como a terapia funciona ou teve experiências difíceis. \n\nAntes de agendarmos, quero que se sinta seguro. Vou te enviar um guia sobre como eu trabalho. Leia sem pressa e conversamos depois, ok?"
                }
            };
        }

        if (dados.tempo === 'imediato') {
            score -= 50; 
            tecnico += "Busca cura rápida. Risco de frustração. ";
            humanizado += "Entendo sua urgência, mas preciso ser transparente: a terapia é um processo de construção, não mágica. ";
        } else {
            humanizado += "Fico feliz que entenda que é um processo. ";
        }

        if (score >= 80) {
            return { 
                score, veredito: "ALTA COMPATIBILIDADE (AÇÃO)", cor: "#27ae60",
                roteiro: {
                    tecnico: tecnico + "Lead qualificado. Agendar.",
                    humanizado: humanizado + "Seu perfil é exatamente o que eu atendo. Tenho um horário na terça às 14h. Vamos iniciar?"
                }
            };
        } else {
            return { 
                score, veredito: "MÉDIA/BAIXA (ALINHAR)", cor: "#f39c12",
                roteiro: {
                    tecnico: tecnico + "Necessário triagem de voz.",
                    humanizado: humanizado + "Sugiro uma breve conversa de 10 minutos para alinhamento. Podemos agendar?"
                }
            };
        }
    }
};

const NeuroGen = {
    GROQ_KEY: "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", 
    
    _conectarCerebro: async function(systemPrompt, userPrompt) {
        try {
            if (!this.GROQ_KEY || this.GROQ_KEY.includes("INSIRA")) throw new Error("Sem Key");
            const controller = new AbortController();
            setTimeout(() => controller.abort(), 6000);

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.GROQ_KEY}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }]
                }),
                signal: controller.signal
            });
            
            if (!response.ok) throw new Error("Groq Error");
            const data = await response.json();
            return { text: data.choices[0].message.content, source: "Via Groq ⚡ (Llama 3.3)" };

        } catch (e) {
            try {
                const response = await fetch('http://localhost:11434/api/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ model: "llama3.2", prompt: systemPrompt + "\n" + userPrompt, stream: false })
                });
                if (!response.ok) throw new Error("Ollama Error");
                const data = await response.json();
                return { text: data.response, source: "Via Ollama 🦙 (Local)" };
            } catch (e2) {
                return { text: null, source: "FALHA" };
            }
        }
    },

    gerar: async function(tema) {
        const sys = `ATUE COMO: Estrategista de Marketing Clínico Ético (Google PMM). REGRAS: Sem promessas de cura, sem escassez.`;
        const res = await this._conectarCerebro(sys, `Crie 3 títulos (max 30 chars) e 2 descrições (max 90 chars) sobre: ${tema}.`);
        if (!res.text) return { titulos: `Terapia para ${tema}`, descricoes: `Atendimento especializado.`, fonte: "Sistema", negativas: "-grátis" };
        return this._processarTextoAd(res.text, res.source);
    },

    gerarConteudo: async function(tema, plataforma) {
        let sys = `ATUE COMO: Victor Lawrence, Psicólogo Clínico (CRP), especialista em Hipnose Moderna e TEA Adulto.
        TOM DE VOZ: Sóbrio, técnico, acolhedor, baseado em evidências, Ericksoniano (uso de metáforas sutis).
        REGRA DE OURO: Nunca diga no marketing o que não diria em sessão.`;

        // Inteligência de Demanda: Verifica se o tema está em alta nos dados importados
        const data = NeuroImporter.getData();
        const topService = data.doctoralia.top_services[0] || "";
        const topInsta = data.instagram.top_themes[0] || "";
        
        if (tema.toLowerCase().includes(topService.toLowerCase()) || tema.toLowerCase().includes(topInsta.toLowerCase())) {
            sys += `\nNOTA DE ESTRATÉGIA: Este tema está em ALTA DEMANDA (Validado por dados reais). Foque em converter essa atenção em autoridade.`;
        }

        let promptEspecifico = "";

        switch(plataforma) {
            case 'Instagram':
                sys += `\nOBJETIVO: Roteiro de Reels (@hipnolawrence). Foco em Autoridade Técnica.`;
                promptEspecifico = `Crie um roteiro de 30s sobre "${tema}".
                ESTRUTURA:
                1. Gancho: Descreva um sintoma/situação sem sensacionalismo.
                2. Validação: "Isso é comum em quadros de..."
                3. Técnica: Explicação neurocientífica simplificada.
                4. CTA Suave: "Se faz sentido, leia a legenda."`;
                break;
            
            case 'WhatsApp':
                sys += `\nOBJETIVO: Texto para Canal de Transmissão (TEA Adulto). Foco em Contemplação/Educação.`;
                promptEspecifico = `Escreva uma mensagem curta e reflexiva para o canal sobre "${tema}".
                ESTILO: Como uma mensagem pessoal do Victor. Comece com "Olá, pessoal". Termine com uma pergunta reflexiva, sem vender nada.`;
                break;

            case 'Blog':
                sys += `\nOBJETIVO: Esboço de Artigo para Site (hipnolawrence.com). Foco em SEO Semântico (GEO).`;
                promptEspecifico = `Crie a estrutura de um artigo sobre "${tema}".
                ESTRUTURA:
                - H1 (Termo Técnico + Termo Popular)
                - Introdução (Empatia com a dor)
                - O que a ciência diz (Mecanismo)
                - Como a Hipnose/Terapia ajuda (Sem promessa de cura)`;
                break;

            case 'Doctoralia':
                sys += `\nOBJETIVO: Texto de Diferenciação para Perfil Profissional. Foco em Retenção e Ética.`;
                promptEspecifico = `Escreva um parágrafo sobre minha abordagem em "${tema}" para colocar no perfil.
                DESTAQUE: Atendimento baseado em evidências, alinhamento de expectativas e foco em autonomia do paciente.`;
                break;
        }

        const res = await this._conectarCerebro(sys, promptEspecifico);
        return { conteudo: res.text || "Erro na geração.", fonte: res.source };
    },

    _processarTextoAd: function(rawText, fonteName) {
        const lines = rawText.split('\n').filter(l => l.trim().length > 0);
        const titulos = []; const descricoes = [];
        lines.forEach(line => {
            const clean = line.replace(/^\d+\.\s*/, '').replace(/["*]/g, '').trim();
            if (clean.length < 50) titulos.push(clean); else descricoes.push(clean);
        });
        return { titulos: titulos.join('\n'), descricoes: descricoes.join('\n'), fonte: fonteName, negativas: "-cura, -rápido, -grátis" };
    }
};

// --- CHATBOT ORQUESTRADOR (NOVO) ---
const NeuroStrategist = {
    chat: async function(userMsg) {
        const data = NeuroImporter.getData();
        const library = NeuroLibrary.getKnowledge().map(k => `- ${k.title}: ${k.content}`).join('\n');
        const tendencia = NeuroImporter.getTendenciaAutoridade();
        
        const systemPrompt = `ATUE COMO: Sócio Estratégico do Psicólogo Victor Lawrence.
        
        [DADOS DO MOMENTO]
        - Visibilidade (Doctoralia): ${data.doctoralia.views} views (${tendencia.direcao} ${tendencia.variacao}%)
        - Interesse Real: ${data.doctoralia.top_services.join(', ')}
        - Alcance Instagram: ${data.instagram.reach}
        
        [SUA BIBLIOTECA MENTAL (Modelos de Decisão)]
        ${library}
        
        OBJETIVO: Responda ao sócio (Victor) de forma breve, estratégica e baseada em dados. Se a visibilidade caiu, sugira ações da TOC ou Copy. Se está alta, sugira conversão.
        Use o tom: "Parceiro, vi que..." ou "Victor, a situação é..."`;

        // UI Feedback
        const res = await NeuroGen._conectarCerebro(systemPrompt, userMsg);
        return res;
    }
};

// --- CORE ANALYTICS & MANAGER ---
const MarketingAnalytics = {
    calcularCTR: (i, c) => (!i ? '0.00' : ((c / i) * 100).toFixed(2)),
    calcularConversao: (c, conv) => (!c ? '0.00' : ((conv / c) * 100).toFixed(2)),
    calcularROI: (inv, rec) => (!inv ? '0.00' : (((rec - inv) / inv) * 100).toFixed(2)),
    calcularCPA: (custo, aq) => (!aq ? '0.00' : (custo / aq).toFixed(2))
};

const CampaignManager = {
    _storageKey: 'neurostrategy_campanhas',
    getCampanhas: function() { try { return JSON.parse(localStorage.getItem(this._storageKey)) || []; } catch (e) { return []; } },
    salvarCampanhas: function(c) { localStorage.setItem(this._storageKey, JSON.stringify(c)); window.EventBus.emit('campanhas-atualizadas'); },
    adicionarCampanha: function(c) { const l = this.getCampanhas(); l.push({ id: Date.now(), ...c }); this.salvarCampanhas(l); },
    atualizarCampanha: function(id, d) { const l = this.getCampanhas().map(c => c.id === id ? { ...c, ...d } : c); this.salvarCampanhas(l); },
    excluirCampanha: function(id) { const l = this.getCampanhas().filter(c => c.id !== id); this.salvarCampanhas(l); }
};

// --- UI & RENDERIZAÇÃO ---

function renderizarCampanhas() {
    const container = document.getElementById('lista-campanhas');
    if (!container) return; // Se não estiver na tela, ignora
    const campanhas = CampaignManager.getCampanhas();
    const badges = { google_search: "Google Search", google_pmax: "PMax", meta_ads: "Meta Ads" };

    if (campanhas.length === 0) { container.innerHTML = `<div class="card"><p>Nenhuma campanha ativa.</p></div>`; return; }

    container.innerHTML = campanhas.map(c => {
        const roi = MarketingAnalytics.calcularROI(c.investimento, c.receita);
        const ooda = NeuroOODA.analisar(c);
        const extraClass = ooda.classeExtra || "";

        return `
            <div class="card ${extraClass}" style="border-left: 5px solid ${ooda.cor};">
                <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                    <span class="campaign-badge" style="background:#eee; color:#333;">${badges[c.canal] || 'Outros'}</span>
                    <span style="font-weight:bold; color:${ooda.cor}; border: 1px solid ${ooda.cor}; padding: 2px 6px; border-radius: 4px; font-size: 0.8rem;">${ooda.status}</span>
                </div>
                <h3 style="margin: 5px 0;">${c.nome}</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; font-size: 0.9rem;">
                    <div><strong>Invest:</strong> R$${c.investimento}</div>
                    <div><strong>ROI:</strong> ${roi}%</div>
                </div>
                <div style="background: rgba(0,0,0,0.03); padding: 8px; border-radius: 4px; font-size: 0.85rem; color: #444;">
                    <strong>💡 NeuroInsight:</strong> ${ooda.msg}
                </div>
                <div class="card-actions">
                    <button class="btn-edit" data-id="${c.id}">Editar</button>
                    <button class="btn-delete" data-id="${c.id}">Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

function atualizarDashboard() {
    // Verifica se os elementos existem antes de tentar atualizar
    const elLeads = document.getElementById('kpi-leads');
    if (!elLeads) return;

    const campanhas = CampaignManager.getCampanhas();
    const realData = NeuroImporter.getData();
    const tendencia = NeuroImporter.getTendenciaAutoridade();

    const totais = campanhas.reduce((acc, c) => ({
        investimento: acc.investimento + (c.investimento || 0),
        receita: acc.receita + (c.receita || 0),
        leads: acc.leads + (c.leads || 0),
        conversoes: acc.conversoes + (c.conversoes || 0)
    }), { investimento: 0, receita: 0, leads: 0, conversoes: 0 });

    elLeads.innerText = totais.leads;
    document.getElementById('kpi-conversao').innerText = `${MarketingAnalytics.calcularConversao(totais.leads, totais.conversoes)}%`;
    document.getElementById('kpi-roi').innerText = `${MarketingAnalytics.calcularROI(totais.investimento, totais.receita)}%`;
    document.getElementById('kpi-cpa').innerText = `R$${MarketingAnalytics.calcularCPA(totais.investimento, totais.conversoes)}`;
    
    // Injeção do Container de Logs
    let logContainer = document.getElementById('log-automacao-container');
    if (!logContainer) {
        logContainer = document.createElement('div');
        logContainer.id = 'log-automacao-container';
        document.getElementById('kpis').appendChild(logContainer);
    }

    // Injeção do Monitor de Autoridade
    let authorityContainer = document.getElementById('authority-monitor');
    if (!authorityContainer) {
        authorityContainer = document.createElement('div');
        authorityContainer.id = 'authority-monitor';
        document.getElementById('kpis').appendChild(authorityContainer);
    }

    const indiceAutoridade = realData.doctoralia.views + realData.instagram.reach + realData.analytics.sessions;
    const sparklineHTML = NeuroImporter.HistoricoDoctoralia.map(d => {
        const height = (d.views / 110) * 100;
        const isPeak = d.views === 110 ? 'peak' : '';
        return `<div class="spark-bar ${isPeak}" style="height:${height}%" data-val="${d.mes}: ${d.views}"></div>`;
    }).join('');

    authorityContainer.innerHTML = `
        <h3 style="margin-top: 20px; font-size: 1rem; color: #666;">Radar de Autoridade Digital (Histórico Doctoralia)</h3>
        <div class="sparkline-container">${sparklineHTML}</div>
        <div style="font-size:0.8rem; text-align:center; color:#666; margin-bottom:15px;">
            Tendência: <span style="color:${tendencia.direcao === 'up' ? 'green' : 'red'}">${tendencia.variacao}%</span> (Meta Recuperação: ${tendencia.meta} views)
        </div>
        <div class="authority-grid">
            <div class="authority-card"><span style="font-size:0.8rem; color:#7f8c8d;">Doctoralia Views</span><span class="authority-val">${realData.doctoralia.views}</span></div>
            <div class="authority-card"><span style="font-size:0.8rem; color:#7f8c8d;">Alcance Insta</span><span class="authority-val">${realData.instagram.reach}</span></div>
            <div class="authority-card"><span style="font-size:0.8rem; color:#7f8c8d;">Sessões Site</span><span class="authority-val">${realData.analytics.sessions}</span></div>
        </div>
        <div class="radar-interest">
            <h4 style="margin:0 0 10px 0; font-size:0.9rem; color:#2c3e50;">🔥 Temas em Alta (Demanda Real)</h4>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                ${realData.doctoralia.top_services.map(s => `<span style="background:#e8f6f3; color:#16a085; padding:4px 8px; border-radius:12px; font-size:0.8rem;">🩺 ${s}</span>`).join('')}
                ${realData.instagram.top_themes.map(t => `<span style="background:#fce4ec; color:#c2185b; padding:4px 8px; border-radius:12px; font-size:0.8rem;">📸 ${t}</span>`).join('')}
            </div>
            <div style="margin-top:10px; font-size:0.8rem; color:#7f8c8d;">Índice de Autoridade Total: <strong>${indiceAutoridade}</strong> pontos</div>
        </div>
        <div style="text-align:right; margin-top:5px;"><button id="btn-sync-data" style="font-size:0.8rem; cursor:pointer; background:none; border:none; color:#3498db; text-decoration:underline;">🔄 Importar Métricas</button></div>
    `;

    const btnSync = document.getElementById('btn-sync-data');
    if(btnSync) btnSync.onclick = () => document.getElementById('nav-item-dados').click(); // Redireciona para aba Dados
}

window.EventBus.on('automacao-log', (msg) => {
    const container = document.getElementById('log-automacao-container');
    if (container) {
        const logEntry = document.createElement('div');
        logEntry.className = 'automation-log';
        logEntry.innerText = `🤖 [${new Date().toLocaleTimeString()}] ${msg}`;
        container.prepend(logEntry);
    }
});

// --- NAVIGATION & VIEWS SYSTEM (NOVO) ---
function setupNavigation() {
    // 1. Criar Barra de Navegação
    const header = document.querySelector('header');
    if (!header) return;

    const navBar = document.createElement('nav');
    navBar.className = 'nav-bar';
    navBar.innerHTML = `
        <div class="nav-item active" id="nav-item-radar" data-target="view-radar">📡 Radar</div>
        <div class="nav-item" id="nav-item-strategy" data-target="view-strategy">🧠 Estratégia</div>
        <div class="nav-item" id="nav-item-library" data-target="view-library">📚 Biblioteca</div>
        <div class="nav-item" id="nav-item-factory" data-target="view-factory">🛠️ Fábrica</div>
        <div class="nav-item" id="nav-item-dados" data-target="view-data">⚙️ Dados</div>
    `;
    
    // Inserir após o header (ou dentro, dependendo do layout, vou inserir após o H1 do header ou no topo do container principal)
    // Assumindo estrutura padrão, insere após o header existente
    header.parentNode.insertBefore(navBar, header.nextSibling);

    // 2. Reestruturar DOM - Criar Views
    // Criar containers
    const mainContainer = document.createElement('div');
    mainContainer.id = 'main-views-container';
    
    // VIEW RADAR (Move elementos existentes)
    const viewRadar = document.createElement('div');
    viewRadar.id = 'view-radar';
    viewRadar.className = 'tab-view active';
    
    // Mover elementos do dashboard atual para o viewRadar
    const kpis = document.getElementById('kpis');
    const listaCampanhas = document.getElementById('lista-campanhas');
    
    // Se os elementos existirem, move-os. Se não (primeira execução ou HTML limpo), cria a estrutura.
    // O script original assume que esses IDs já existem no HTML. Eu vou movê-los.
    if (kpis) viewRadar.appendChild(kpis);
    if (listaCampanhas) viewRadar.appendChild(listaCampanhas);
    
    mainContainer.appendChild(viewRadar);

    // VIEW ESTRATÉGIA (Chatbot)
    const viewStrategy = document.createElement('div');
    viewStrategy.id = 'view-strategy';
    viewStrategy.className = 'tab-view';
    mainContainer.appendChild(viewStrategy);

    // VIEW BIBLIOTECA
    const viewLibrary = document.createElement('div');
    viewLibrary.id = 'view-library';
    viewLibrary.className = 'tab-view';
    mainContainer.appendChild(viewLibrary);

    // VIEW FÁBRICA
    const viewFactory = document.createElement('div');
    viewFactory.id = 'view-factory';
    viewFactory.className = 'tab-view';
    mainContainer.appendChild(viewFactory);

    // VIEW DADOS
    const viewData = document.createElement('div');
    viewData.id = 'view-data';
    viewData.className = 'tab-view';
    mainContainer.appendChild(viewData);

    // Inserir o container principal onde estavam os KPIs
    navBar.parentNode.insertBefore(mainContainer, navBar.nextSibling);

    // 3. Lógica de Troca de Abas
    navBar.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-item')) {
            // Remove active
            document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-view').forEach(el => el.classList.remove('active'));
            
            // Add active
            e.target.classList.add('active');
            const targetId = e.target.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        }
    });
}

// --- SETUP DE FUNCIONALIDADES (MODIFIED FOR TABS) ---

function setupContentFactory() {
    // Agora renderiza dentro da aba #view-factory
    const container = document.getElementById('view-factory');
    if (!container) return;

    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <h2>📱 Fábrica de Conteúdo Multi-Canal</h2>
            <div class="card">
                <div class="form-group">
                    <label>Tema do Conteúdo</label>
                    <input type="text" id="conteudo-tema" placeholder="Ex: Hiperfoco no TEA, Ansiedade Social..." style="width:100%; padding:10px; margin-bottom:10px;">
                </div>
                <div class="form-group">
                    <label>Plataforma de Destino</label>
                    <select id="conteudo-plataforma" style="width:100%; padding:10px; margin-bottom:10px;">
                        <option value="Instagram">Instagram (@hipnolawrence) - Reels</option>
                        <option value="WhatsApp">WhatsApp (Canal TEA) - Educativo</option>
                        <option value="Blog">Site/Blog - SEO Semântico</option>
                        <option value="Doctoralia">Doctoralia - Perfil Profissional</option>
                    </select>
                </div>
                <button id="btn-gerar-conteudo" class="btn-primary" style="background-color: #8e44ad; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">🧠 Criar com Voz do Victor</button>
                
                <div id="resultado-conteudo" class="hidden" style="margin-top: 20px;">
                    <div class="golden-rule-banner">
                        🛡️ <strong>Validação Ética:</strong> Você diria isso pessoalmente em uma sessão? Se não, descarte.
                    </div>
                    <textarea id="texto-conteudo" rows="12" style="width:100%; padding:10px; border:1px solid #ccc; border-radius:4px; font-family: sans-serif;"></textarea>
                    <div id="conteudo-source" style="font-size:0.8rem; color:#666; text-align:right;"></div>
                </div>
            </div>
        </div>`;

    const btnGerar = document.getElementById('btn-gerar-conteudo');
    if (btnGerar) btnGerar.onclick = async () => {
        const tema = document.getElementById('conteudo-tema').value;
        const plat = document.getElementById('conteudo-plataforma').value;
        if (!tema) return alert("Digite um tema.");

        const originalText = btnGerar.innerText;
        btnGerar.innerText = "⏳ Acessando Cérebro Digital...";
        btnGerar.disabled = true;

        const res = await NeuroGen.gerarConteudo(tema, plat);
        
        document.getElementById('texto-conteudo').value = res.conteudo;
        document.getElementById('conteudo-source').innerText = `Fonte: ${res.fonte}`;
        document.getElementById('resultado-conteudo').classList.remove('hidden');
        
        btnGerar.innerText = originalText;
        btnGerar.disabled = false;
    };
}

function setupImporterModal() {
    // Agora renderiza dentro da aba #view-data
    const container = document.getElementById('view-data');
    if (!container) return;

    container.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
            <h2>🔄 Central de Dados & Sincronização</h2>
            <div class="card">
                <div class="import-tabs">
                    <div class="import-tab active">Doctoralia (Estatísticas)</div>
                    <div class="import-tab">Instagram (Insights)</div>
                    <div class="import-tab">Analytics</div>
                </div>
                <div id="import-area">
                    <div class="file-drop-zone" id="drop-zone">
                        📂 Arraste seu CSV de Estatísticas aqui<br>
                        <small>Foco: Views, Cliques e Serviços</small>
                    </div>
                    <input type="file" id="file-input" style="display:none;">
                </div>
                <div id="import-log" style="margin-top:10px; font-size:0.9rem; color:#666;"></div>
            </div>
        </div>`;

    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    if(dropZone) dropZone.onclick = () => fileInput.click();
    
    if(fileInput) fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if(!file) return;
        
        const reader = new FileReader();
        reader.onload = (evt) => {
            const text = evt.target.result;
            if(file.name.toLowerCase().includes('doctoralia') || text.includes('Serviço')) {
                const res = NeuroImporter.importarDoctoralia(text);
                document.getElementById('import-log').innerText = "✅ " + res.msg;
            } else {
                const res = NeuroImporter.importarInstagram(text);
                document.getElementById('import-log').innerText = "✅ " + res.msg;
            }
            atualizarDashboard();
        };
        reader.readAsText(file);
    };
}

function setupStrategyTab() {
    const container = document.getElementById('view-strategy');
    if (!container) return;

    container.innerHTML = `
        <div class="chat-interface">
            <div class="chat-window" id="chat-window">
                <div class="chat-message bot">
                    Olá, Victor. Sou seu <strong>NeuroStrategist</strong>.<br>
                    Já analisei seus dados de hoje. O que deseja alinhar?
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Ex: O que faço com a queda de views?" style="flex:1; padding:10px; border:1px solid #ddd; border-radius:4px;">
                <button id="btn-chat-send" class="btn-primary" style="background:#2c3e50; color:white; border:none; padding:10px 20px; border-radius:4px; cursor:pointer;">Enviar</button>
            </div>
        </div>
    `;

    const btnSend = document.getElementById('btn-chat-send');
    const input = document.getElementById('chat-input');
    const windowChat = document.getElementById('chat-window');

    const sendMessage = async () => {
        const msg = input.value;
        if (!msg.trim()) return;

        // User Msg
        windowChat.innerHTML += `<div class="chat-message user">${msg}</div>`;
        input.value = '';
        windowChat.scrollTop = windowChat.scrollHeight;

        // Bot Loading
        const loadingId = Date.now();
        windowChat.innerHTML += `<div class="chat-message bot" id="msg-${loadingId}">Thinking...</div>`;
        windowChat.scrollTop = windowChat.scrollHeight;

        // Call Intelligence
        const res = await NeuroStrategist.chat(msg);
        
        // Replace Loading
        document.getElementById(`msg-${loadingId}`).innerHTML = res.text ? res.text.replace(/\n/g, '<br>') : "Desculpe, falha na conexão neural.";
        windowChat.scrollTop = windowChat.scrollHeight;
    };

    btnSend.onclick = sendMessage;
    input.onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
}

function setupLibraryTab() {
    const container = document.getElementById('view-library');
    if (!container) return;

    const cards = NeuroLibrary.getKnowledge().map(item => `
        <div class="library-card">
            <span class="library-icon">${item.icon}</span>
            <div class="library-title">${item.title}</div>
            <div class="library-content">${item.content}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <h2 style="margin-bottom:20px;">📚 Biblioteca de Modelos Mentais</h2>
        <div class="library-grid">
            ${cards}
        </div>
    `;
}

function setupTriagemModal() {
    const modal = document.getElementById("modal-triagem");
    if (!modal) return;
    document.getElementById("btn-triagem").onclick = () => modal.classList.remove("hidden");
    document.getElementById("btn-close-triagem").onclick = () => modal.classList.add("hidden");
    const btnCopiar = document.getElementById("btn-copiar-roteiro");
    
    document.getElementById("btn-analisar-lead").onclick = () => {
        const res = NeuroFilter.analisar({
            queixa: document.getElementById('triagem-queixa').value,
            tempo: document.getElementById('triagem-tempo').value,
            historico: document.getElementById('triagem-historico').value
        });
        const containerRes = document.getElementById('triagem-resultado');
        const containerAcao = document.getElementById('triagem-acao');
        containerRes.innerText = res.veredito;
        containerRes.style.color = res.cor;
        containerAcao.innerHTML = `
            <div class="tech-box"><strong>📋 Veredito Técnico:</strong><br>${res.roteiro.tecnico}</div>
            <div class="whatsapp-box"><strong>💬 WhatsApp (Copiar):</strong><br>${res.roteiro.humanizado}</div>
        `;
        btnCopiar.classList.remove('hidden');
        btnCopiar.onclick = () => { navigator.clipboard.writeText(res.roteiro.humanizado); alert("Mensagem de WhatsApp copiada!"); };
    };
}

// Funções de Setup padrão (Preservadas e ajustadas)
function setupEventListeners() {
    const container = document.getElementById('lista-campanhas');
    if (!container) return;
    container.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-delete')) { if (confirm('Excluir?')) CampaignManager.excluirCampanha(parseInt(e.target.getAttribute('data-id'))); }
        if (e.target.classList.contains('btn-edit')) { handleEdit(parseInt(e.target.getAttribute('data-id'))); }
    });
}
function handleEdit(id) {
    const c = CampaignManager.getCampanhas().find(x => x.id === id);
    if (!c) return;
    document.getElementById('campanha-id').value = c.id;
    document.getElementById('nome-campanha').value = c.nome;
    document.getElementById('campanha-canal').value = c.canal;
    document.getElementById('campanha-estagio').value = c.estagio;
    document.getElementById('investimento-campanha').value = c.investimento;
    document.getElementById('receita-campanha').value = c.receita;
    document.getElementById('leads-campanha').value = c.leads;
    document.getElementById('conversoes-campanha').value = c.conversoes;
    document.getElementById('campanha-criativo').value = c.criativo || '';
    document.getElementById('modal-titulo').innerText = "Editar Campanha";
    document.getElementById('campanha-canal').dispatchEvent(new Event('change'));
    document.getElementById("modal-nova-campanha").classList.remove("hidden");
}
function setupAnalysisModal() {
    const modal = document.getElementById("modal-analise");
    if (!modal) return;
    document.getElementById("btn-analise").onclick = () => modal.classList.remove("hidden");
    document.getElementById("btn-close-analise").onclick = () => modal.classList.add("hidden");
    document.getElementById('btn-calcular-cenario').onclick = () => {
        const inv = parseFloat(document.getElementById('investimento-estimado').value);
        const rec = parseFloat(document.getElementById('receita-estimada').value);
        if (inv > 0) {
            const roi = MarketingAnalytics.calcularROI(inv, rec);
            const lucro = (rec - inv).toFixed(2);
            document.getElementById('resultado-analise').innerHTML = `<p>ROI: <strong>${roi}%</strong> | Lucro: R$${lucro}</p>`;
        }
    };
}
function setupNewCampaignModal() {
    const modal = document.getElementById("modal-nova-campanha");
    const form = document.getElementById("form-nova-campanha");
    if (!modal) return;
    document.getElementById("btn-nova-campanha").onclick = () => {
        form.reset(); document.getElementById('campanha-id').value = ''; document.getElementById('modal-titulo').innerText = "Nova Campanha"; document.getElementById("neuro-feedback").innerHTML = ""; modal.classList.remove("hidden");
    };
    document.getElementById("btn-close-nova-campanha").onclick = () => modal.classList.add("hidden");
    document.getElementById("campanha-canal").addEventListener('change', (e) => {
        const fb = document.getElementById("neuro-feedback"); fb.className = 'feedback-box';
        if (e.target.value === 'google_search') { fb.innerHTML = "✅ Google Search: Alta intenção."; fb.style.color = "green"; }
        else if (e.target.value === 'meta_ads') { fb.innerHTML = "⚠️ Meta Ads: Interrupção."; fb.style.color = "#d35400"; } else fb.innerHTML = "";
    });
    form.onsubmit = (e) => {
        e.preventDefault();
        const dados = {
            nome: document.getElementById('nome-campanha').value, canal: document.getElementById('campanha-canal').value, estagio: document.getElementById('campanha-estagio').value,
            investimento: parseFloat(document.getElementById('investimento-campanha').value), receita: parseFloat(document.getElementById('receita-campanha').value),
            leads: parseInt(document.getElementById('leads-campanha').value), conversoes: parseInt(document.getElementById('conversoes-campanha').value), criativo: document.getElementById('campanha-criativo').value
        };
        const id = document.getElementById('campanha-id').value;
        if (id) CampaignManager.atualizarCampanha(parseInt(id), dados); else CampaignManager.adicionarCampanha(dados);
        modal.classList.add("hidden");
    };
}
function setupAdGeneratorModal() {
    const modal = document.getElementById("modal-gerador");
    const btnGerar = document.getElementById("btn-gerar-copy");
    const btnUsar = document.getElementById("btn-usar-copy");
    if (!modal) return;
    document.getElementById("btn-gerador-ads").onclick = () => modal.classList.remove("hidden");
    document.getElementById("btn-close-gerador").onclick = () => modal.classList.add("hidden");
    btnGerar.onclick = async () => {
        const tema = document.getElementById("tema-anuncio").value;
        if (!tema) return alert("Digite um tema.");
        btnGerar.innerText = "🧠 Pensando..."; btnGerar.disabled = true; document.getElementById('resultado-copy').classList.add('hidden');
        const res = await NeuroGen.gerar(tema);
        document.getElementById('copy-titulos').innerText = res.titulos; document.getElementById('copy-descricoes').innerText = res.descricoes; document.getElementById('copy-negativas').innerText = res.negativas;
        let badge = document.getElementById('ai-source-badge'); if (!badge) { badge = document.createElement('div'); badge.id = 'ai-source-badge'; badge.style.cssText = "font-size: 0.8rem; color: #666; margin-top: 5px; text-align: right; font-style: italic;"; document.getElementById('resultado-copy').insertBefore(badge, document.getElementById('btn-usar-copy')); }
        badge.innerText = `Fonte: ${res.fonte}`;
        document.getElementById('resultado-copy').classList.remove('hidden'); btnGerar.innerText = "Gerar Estrutura Segura"; btnGerar.disabled = false;
    };
    btnUsar.onclick = () => {
        const tema = document.getElementById("tema-anuncio").value;
        const copyFull = `TEMA: ${tema}\n\n[TÍTULOS]\n${document.getElementById('copy-titulos').innerText}\n\n[DESCRIÇÕES]\n${document.getElementById('copy-descricoes').innerText}`;
        modal.classList.add("hidden");
        const modalCampanha = document.getElementById("modal-nova-campanha");
        document.getElementById("form-nova-campanha").reset(); document.getElementById("nome-campanha").value = `Campanha: ${tema}`; document.getElementById("campanha-criativo").value = copyFull; document.getElementById('modal-titulo').innerText = "Nova Campanha (Gerada)"; modalCampanha.classList.remove("hidden");
    };
}
function seedInitialData() {
    if (CampaignManager.getCampanhas().length === 0) { CampaignManager.adicionarCampanha({ nome: "TEA Adulto (Diagnóstico)", investimento: 1500, receita: 4500, leads: 300, conversoes: 20, canal: 'google_search', estagio: 'do' }); }
}

// --- INIT ---
console.log("NeuroStrategy OS: Authority & Visibility Loaded.");
window.EventBus.on('campanhas-atualizadas', renderizarCampanhas);
window.EventBus.on('campanhas-atualizadas', atualizarDashboard);
window.EventBus.on('dados-reais-atualizados', atualizarDashboard);

// Setup Order
setupNavigation(); // Creates Tabs and Containers
seedInitialData();
renderizarCampanhas(); // Renders into #view-radar
atualizarDashboard(); // Updates KPIs in #view-radar

// Setup Tabs Content
setupStrategyTab();
setupLibraryTab();
setupContentFactory(); // Now renders into #view-factory
setupImporterModal(); // Now renders into #view-data (renamed modal to tab content essentially)

// Setup Modals (Popups)
setupEventListeners();
setupAnalysisModal();
setupNewCampaignModal();
setupAdGeneratorModal();
setupTriagemModal();
