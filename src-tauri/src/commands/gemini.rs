use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GeminiRequest {
    pub system_prompt: String,
    pub user_prompt: String,
}

#[derive(Serialize)]
pub struct GeminiResponse {
    pub text: String,
}

#[tauri::command]
pub async fn call_gemini(request: GeminiRequest) -> Result<GeminiResponse, String> {
    let api_key = std::env::var("GEMINI_API_KEY")
        .map_err(|_| "GEMINI_API_KEY not set")?;

    let client = reqwest::Client::new();

    let response = client
        .post("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent")
        .query(&[("key", api_key)])
        .json(&serde_json::json!({
            "contents": [
                {
                    "role": "user",
                    "parts": [
                        { "text": format!("{}\n\n{}", request.system_prompt, request.user_prompt) }
                    ]
                }
            ]
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let text = json["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .unwrap_or("")
        .to_string();

    if text.is_empty() {
        return Err("Gemini response empty".into());
    }

    Ok(GeminiResponse { text })
}
