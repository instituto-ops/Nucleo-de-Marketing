import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // O root agora é o diretório do projeto, o padrão do Vite.
  
  // Configuração para o build final
  build: {
    // Onde o Vite vai gerar os arquivos de build
    outDir: './dist', 
    // Garante que o diretório de saída seja limpo antes de cada build
    emptyOutDir: true,
  },

  plugins: [react()],

  // Opcional, mas útil: Define um alias '@' para o diretório 'src'
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js']
  },
  
  // Necessário para o HMR do Tauri funcionar corretamente
  server: {
    strictPort: true,
    port: 1420
  }
})
