#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;
use commands::groq::call_groq;
use commands::gemini::call_gemini;
use dotenvy;

fn main() {
    dotenvy::dotenv().expect("Failed to load .env file");
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            call_groq
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}