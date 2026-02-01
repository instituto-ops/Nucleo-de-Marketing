async function carregarModulo(nomeModulo) {
    console.log(`Carregando módulo: ${nomeModulo}...`);
    const palco = document.getElementById('palco-principal');
    
    try {
        // 1. Carrega o CSS do Módulo
        const linkCSS = document.createElement('link');
        linkCSS.rel = 'stylesheet';
        linkCSS.href = `../${nomeModulo}/style.css`;
        document.head.appendChild(linkCSS);

        // 2. Carrega o HTML (Template)
        const resposta = await fetch(`../${nomeModulo}/index.html`);
        if (!resposta.ok) throw new Error(`Erro ao carregar HTML: ${resposta.status}`);
        const html = await resposta.text();
        palco.innerHTML = html;

        // 3. Carrega o JS do Módulo (Lógica)
        const script = document.createElement('script');
        script.src = `../${nomeModulo}/app.js`;
        document.body.appendChild(script);
        
    } catch (erro) {
        console.error("Falha na injeção do módulo:", erro);
        palco.innerHTML = `<p style="color:red; padding:20px;">Erro ao carregar módulo ${nomeModulo}. Verifique o console.</p>`;
    }
}

// Inicialização Automática
document.addEventListener('DOMContentLoaded', () => {
    if (window.Config && window.Config.MODULES && window.Config.MODULES.length > 0) {
        carregarModulo(window.Config.MODULES[0]);
    }
});
