use serde::{Deserialize, Serialize};

// Struct para o request do comando Tauri (imutável)
#[derive(Deserialize)]
pub struct GeminiRequest {
    pub system_prompt: String,
    pub user_prompt: String,
}

// Struct para a resposta do comando Tauri (imutável)
#[derive(Serialize)]
pub struct GeminiResponse {
    pub text: String,
}

// --- Structs para a API Gemini (privadas ao módulo) ---

#[derive(Serialize)]
struct GeminiApiRequest {
    contents: [GeminiApiContent; 1],
}

#[derive(Serialize)]
struct GeminiApiContent {
    role: String,
    parts: [GeminiApiPart; 1],
}

#[derive(Serialize)]
struct GeminiApiPart {
    text: String,
}

#[derive(Deserialize)]
struct GeminiApiResponse {
    candidates: Vec<GeminiApiCandidate>,
}

#[derive(Deserialize)]
struct GeminiApiCandidate {
    content: GeminiApiContentResponse,
}

#[derive(Deserialize)]
struct GeminiApiContentResponse {
    parts: Vec<GeminiApiPartResponse>,
}

#[derive(Deserialize)]
struct GeminiApiPartResponse {
    text: String,
}

#[tauri::command]
pub async fn call_gemini(request: GeminiRequest) -> Result<GeminiResponse, String> {
    // 1. Obter a chave da API de forma segura
    let api_key = std::env::var("GEMINI_API_KEY")
        .map_err(|_| "Erro Interno: A chave da API Gemini não foi configurada no backend.".to_string())?;

    // 2. Construir o corpo do request para a API
    let request_body = GeminiApiRequest {
        contents: [
            GeminiApiContent {
                role: "user".to_string(),
                parts: [
                    GeminiApiPart {
                        text: format!("{}\n\n{}", request.system_prompt, request.user_prompt)
                    }
                ]
            }
        ]
    };
    
    // 3. Executar a chamada HTTP
    let client = reqwest::Client::new();
    let response_result = client
        .post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent")
        .query(&[("key", api_key)])
        .json(&request_body)
        .send()
        .await;

    let response = match response_result {
        Ok(res) => res,
        Err(e) => return Err(format!("Erro de Rede: Falha ao conectar com a API Gemini. Detalhes: {}", e)),
    };

    // 4. Verificar se a resposta HTTP foi bem-sucedida
    if !response.status().is_success() {
        let status = response.status();
        let error_body = response.text().await.unwrap_or_else(|_| "Não foi possível ler o corpo do erro.".to_string());
        return Err(format!("Erro da API Gemini: Status {} - {}", status, error_body));
    }

    // 5. Desserializar a resposta JSON de forma segura para as structs
    let parsed_response = match response.json::<GeminiApiResponse>().await {
        Ok(parsed) => parsed,
        Err(e) => return Err(format!("Erro de Parsing: A resposta da API Gemini não pôde ser compreendida. Detalhes: {}", e)),
    };

    // 6. Extrair o texto da resposta de forma segura, sem `unwrap` ou `panic`
    let text = parsed_response
        .candidates
        .into_iter()
        .next()
        .and_then(|candidate| candidate.content.parts.into_iter().next())
        .map(|part| part.text)
        .unwrap_or_default();

    if text.is_empty() {
        return Err("Erro de Conteúdo: A resposta da API Gemini veio vazia ou em formato inesperado.".into());
    }

    Ok(GeminiResponse { text })
}
