use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct GroqRequest {
    pub system_prompt: String,
    pub user_prompt: String,
}

#[derive(Serialize)]
pub struct GroqResponse {
    pub text: String,
}

#[tauri::command]
pub async fn call_groq(request: GroqRequest) -> Result<GroqResponse, String> {
    let api_key = std::env::var("GROQ_API_KEY")
        .map_err(|_| "GROQ_API_KEY not set")?;

    let client = reqwest::Client::new();

    let response = client
        .post("https://api.groq.com/openai/v1/chat/completions")
        .bearer_auth(api_key)
        .json(&serde_json::json!({
            "model": "llama3-8b-8192",
            "messages": [
                { "role": "system", "content": request.system_prompt },
                { "role": "user", "content": request.user_prompt }
            ]
        }))
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        let error_body = response.text().await.map_err(|e| e.to_string())?;
        return Err(format!("Groq API request failed: {}", error_body));
    }

    let json: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;

    let text = json["choices"][0]["message"]["content"]
        .as_str()
        .unwrap_or("")
        .to_string();

    if text.is_empty() {
        return Err("Groq response empty".to_string());
    }

    Ok(GroqResponse { text })
}
