const { chromium } = require('playwright');

async function scrapeGoogle() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://www.google.com/search?q=Hipnose+Cl%C3%ADnica+Goi%C3%A2nia');

    // Wait for the main results container to be visible
    await page.waitForSelector('#rso', { state: 'visible', timeout: 10000 });

    const resultsContainer = await page.$('#rso');
    if (!resultsContainer) {
      throw new Error('Div de resultados orgânicos (#rso) não encontrada.');
    }

    let innerText = await resultsContainer.innerText();

    // Clean and truncate the text
    let cleanedText = innerText.replace(/\s\s+/g, ' ').trim();
    if (cleanedText.length > 2000) {
      cleanedText = cleanedText.substring(0, 2000);
    }

    return {
      conteudo: cleanedText,
      status: 'sucesso'
    };

  } catch (error) {
    return {
      conteudo: null,
      status: `falha: ${error.message}`
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

(async () => {
  const result = await scrapeGoogle();
  console.log(JSON.stringify(result, null, 2));
})();
