use serde::{Deserialize, Serialize};
use reqwest::Client;

// 🔒 Modelo ativo do sistema (governança explícita)
const ACTIVE_LLM: &str = "qwen2.5:7b-instruct";

#[derive(Debug, Deserialize)]
pub struct OllamaRequest {
    pub prompt: String,
}

#[derive(Debug, Serialize)]
pub struct OllamaResponse {
    pub output: String,
}

#[tauri::command]
pub async fn call_ollama(
    request: OllamaRequest,
) -> Result<OllamaResponse, String> {
    let client = Client::new();

    let res = client
        .post("http://localhost:11434/api/generate")
        .json(&serde_json::json!({
            "model": ACTIVE_LLM,
            "prompt": request.prompt,
            "stream": false,

            // 🔥 CONTROLE DE PERFORMANCE E QUALIDADE
            "options": {
                "temperature": 0.6,
                "top_p": 0.9,
                "num_predict": 200,
                "stop": ["\n\n"]
            }
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: serde_json::Value = res
        .json()
        .await
        .map_err(|e| e.to_string())?;

    let output = json["response"]
        .as_str()
        .ok_or("Resposta inválida do Ollama")?
        .to_string();

    Ok(OllamaResponse { output })
}
