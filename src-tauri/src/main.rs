#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

use dotenvy;


fn main() {
    // Carrega variáveis de ambiente (se existirem)
    dotenvy::dotenv().ok();

    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            commands::ollama::generate_response,
            commands::automation::create_automation_structure
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

