#[tauri::command]
pub fn create_automation_structure() -> Result<String, String> {
    Ok("Estrutura de automação pronta".into())
}
