#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use dotenvy;
use reqwest::Client;

/**
 * Request recebido do frontend (React / Vite)
 * Compatível com OllamaProvider.ts
 */
#[derive(Debug, Deserialize)]
struct OllamaRequest {
    prompt: String,
}

/**
 * Response enviada de volta ao frontend
 */
#[derive(Debug, Serialize)]
struct OllamaResponse {
    output: String,
}

/**
 * Command Tauri
 * Atua como ponte segura entre o frontend e o Ollama local
 */
#[tauri::command]
async fn call_ollama(request: OllamaRequest) -> Result<OllamaResponse, String> {
    let body = serde_json::json!({
        "model": "qwen3:8b",
        "prompt": request.prompt,
        "stream": false
    });

    let client = Client::new();

    let res = client
        .post("http://localhost:11434/api/generate")
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Erro ao conectar no Ollama: {}", e))?;

    let json: serde_json::Value = res
        .json()
        .await
        .map_err(|e| format!("Erro ao ler resposta do Ollama: {}", e))?;

    let output = json["response"]
        .as_str()
        .ok_or("Ollama retornou resposta vazia")?
        .to_string();

    Ok(OllamaResponse { output })
}

fn main() {
    // Carrega variáveis de ambiente (se existirem)
    dotenvy::dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            call_ollama
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
