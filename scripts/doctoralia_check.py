import asyncio
import json
import re
import random
import time
import sys
from datetime import datetime
from urllib.parse import quote
from playwright.async_api import async_playwright

SEARCH_TERMS = [
    # TEA em adultos / autismo em adultos
    'psicólogo especialista em autismo em adultos',
    'psicólogo especialista em TEA em adultos',
    'psicólogo online especialista em autismo em adultos',
    'psicólogo online especialista em TEA em adultos',
    'psicólogo TEA em adultos online',
    'psicólogo online para adultos autistas',
    'psicólogo TEA adulto Goiânia',
    'psicólogo em Goiânia especialista em autismo',
    'avaliação de autismo em adultos',
    'tratamento psicológico para adultos com autismo',
    'acompanhamento psicológico para TEA em adultos',
    'terapia para autismo leve em adultos',
    'psicólogo para autismo nível 1',
    'psicólogo especialista em autismo de alto funcionamento em adultos',
    'psicólogo online para TEA nível 1',
    'psicólogo online especializado em autismo feminino em adultas',
    'psicólogo que entende autismo em adultos',
    'terapia para adulto que descobriu autismo tarde',
    'psicólogo para adultos com suspeita de TEA que não fecham diagnóstico',
    'como saber se tenho autismo em adulto',

    # Queixas relacionais / burnout autista
    'psicólogo online para ansiedade social em adultos',
    'dificuldade de relacionamento em adultos com possível autismo',
    'psicólogo online para pessoas que se sentem diferentes desde a infância',
    'terapia online para quem sente exaustão social burnout autista',
    'tratamento psicológico online para ansiedade social em autistas adultos',

    # Hipnose clínica / hipnose ericksoniana
    'hipnose clínica ericksoniana online',
    'hipnose clínica Goiânia',
    'hipnose clínica para ansiedade em adultos',
    'hipnose clínica para depressão em adultos',
    'hipnose clínica para TEA em adultos',
    'hipnoterapia para ansiedade online',
    'hipnoterapia para TEA em adultos',
    'hipnose clínica para traumas',
    'hipnose clínica para traumas emocionais em adultos',
    'hipnose ericksoniana para transtornos emocionais',
    'hipnose ericksoniana para compulsões e hábitos disfuncionais',
    'hipnose para quem já tentou de tudo na terapia',
    'hipnose ericksoniana é segura',
    'hipnose online funciona para ansiedade',
    'diferença entre hipnose clínica e hipnose de palco',
    'psicólogo com hipnose ericksoniana',
    'psicólogo hipnose clínica online',

    # Psicoterapia breve / sintomas gerais online
    'psicoterapia breve estratégica com hipnose',
    'psicoterapia online para adultos',
    'psicólogo online especialista em TEA',
    'psicólogo online ansiedade e depressão',
    'psicólogo online ansiedade',
    'psicólogo online depressão',
    'psicólogo online fobia social',
    'psicólogo online baixa autoestima',
    'atendimento psicológico online Brasil'
]

async def get_reviews_count(page):
    """Extrai a contagem de reviews do perfil específico."""
    try:
        await page.goto("https://www.doctoralia.com.br/victor-lawrence-bernardes-santana/psicologo-terapeuta-complementar/goiania", wait_until="domcontentloaded")
        await page.wait_for_timeout(3000)
        content = await page.content()
        review_match = re.search(r'(\d+)\s+opiniões', content, re.IGNORECASE)
        if review_match:
            return int(review_match.group(1))
    except Exception:
        return 0
    return 0

async def main(batch_index):
    BATCH_SIZE = 5
    start_index = batch_index * BATCH_SIZE
    batch = SEARCH_TERMS[start_index : start_index + BATCH_SIZE]

    if not batch:
        print(json.dumps([]))
        return

    batch_results = []
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
            viewport={'width': 1920, 'height': 1080}
        )
        page = await context.new_page()

        reviews_count = await get_reviews_count(page)

        for term in batch:
            result_data = {
                "termo_pesquisado": term,
                "status": "erro",
                "ranking_pos": -1,
                "reviews_count": reviews_count,
                "timestamp": datetime.now().isoformat()
            }
            
            try:
                search_base = f"https://www.doctoralia.com.br/pesquisa?q={quote(term)}&loc=Goi%C3%A2nia"
                found = False
                
                for p_idx in range(1, 13):
                    if found: break
                    await page.goto(f"{search_base}&page={p_idx}", wait_until="domcontentloaded")
                    await page.wait_for_timeout(2000)
                    
                    selectors = ['span[data-qa-id="doctor-name"]', 'h3 a', '.card-body']
                    
                    for selector in selectors:
                        if found: break
                        elements = await page.locator(selector).all_inner_texts()
                        for i, text in enumerate(elements):
                            if "Victor Lawrence" in text:
                                result_data["ranking_pos"] = ((p_idx - 1) * 20) + (i + 1)
                                result_data["status"] = "sucesso"
                                found = True
                                break
                
                if not found:
                    safe_filename = "".join([c for c in term if c.isalnum() or c in " _-"]).rstrip()
                    await page.screenshot(path=f"scripts/debug_{safe_filename[:50]}.png")

            except Exception as e:
                result_data["error_details"] = str(e)
            
            finally:
                batch_results.append(result_data)
                time.sleep(random.uniform(5, 12))

        await browser.close()
        print(json.dumps(batch_results))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python doctoralia_check.py <batch_index>")
        sys.exit(1)
    
    try:
        batch_index = int(sys.argv[1])
    except ValueError:
        print("Batch index must be an integer.")
        sys.exit(1)
        
    asyncio.run(main(batch_index))
