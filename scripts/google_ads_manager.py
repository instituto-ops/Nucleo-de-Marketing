import sys
import json
import argparse
import time
import os
from playwright.sync_api import sync_playwright

# Caminhos
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
USER_DATA_DIR = os.path.join(BASE_DIR, "user_data_google_ads")

def run_login_mode():
    print(f"🔵 ABRINDO NAVEGADOR (MODO FURTIVO) PARA LOGIN...")
    print(f"📂 Perfil: {USER_DATA_DIR}")
    print("⚠️  DICA: Se der erro novamente, tente logar primeiro em 'accounts.google.com' e depois ir para o Ads.")

    with sync_playwright() as p:
        # Argumentos para esconder que é um robô
        args = [
            "--disable-blink-features=AutomationControlled",
            "--start-maximized",
            "--no-sandbox",
            "--disable-infobars"
        ]

        browser = p.chromium.launch_persistent_context(
            user_data_dir=USER_DATA_DIR,
            channel="chrome", # Usa o Chrome Real instalado no Windows
            headless=False,
            args=args,
            ignore_default_args=["--enable-automation"], # Remove aviso "controlado por automação"
            viewport=None # Permite maximizar
        )
        
        page = browser.pages[0]
        
        # Mascarar propriedade webdriver
        page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        page.goto("https://accounts.google.com/")
        
        print("⏳ NAVEGADOR ABERTO. Faço o login manual.")
        print("➡️  1. Faça login na conta Google.")
        print("➡️  2. Navegue para https://ads.google.com/aw/overview")
        print("➡️  3. Espere o painel carregar.")
        print("➡️  4. Feche o navegador para salvar.")
        
        try:
            # Mantém aberto indefinidamente até o usuário fechar
            page.wait_for_timeout(99999999)
        except:
            print("✅ Navegador fechado. Sessão salva com camuflagem.")

def run_scrape_mode():
    if not os.path.exists(USER_DATA_DIR):
        print(json.dumps({"error": "Sessão não encontrada. Execute --login primeiro."}))
        return

    with sync_playwright() as p:
        try:
            # Argumentos Furtivos também no modo Scrape
            args = ["--disable-blink-features=AutomationControlled"]
            
            browser = p.chromium.launch_persistent_context(
                user_data_dir=USER_DATA_DIR,
                channel="chrome",
                headless=True, # Invisível, mas usando Chrome real
                args=args,
                ignore_default_args=["--enable-automation"]
            )
            
            page = browser.pages[0]
            page.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            # Navegação direta
            page.goto("https://ads.google.com/aw/overview", timeout=60000)
            page.wait_for_load_state("networkidle")
            time.sleep(8) # Espera extra para renderização pesada do Ads
            
            screenshot_path = os.path.join(BASE_DIR, "ads_evidence.png")
            page.screenshot(path=screenshot_path)
            
            # Resultado Mockado (Prova de Acesso)
            result = {
                "status": "success",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "mensaje": "Acesso Furtivo Confirmado",
                "evidence": screenshot_path
            }
            
            print(json.dumps([result]))
            browser.close()
            
        except Exception as e:
            # Retorna JSON de erro para o n8n não quebrar
            print(json.dumps({"error": str(e), "type": "StealthError"}))

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--login", action="store_true", help="Modo Login Furtivo")
    args = parser.parse_args()

    if args.login:
        run_login_mode()
    else:
        # O modo padrão agora é scrape
        run_scrape_mode()
