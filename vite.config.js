"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
// https://vitejs.dev/config/
exports.default = (0, vite_1.defineConfig)({
    // O root agora é o diretório do projeto, o padrão do Vite.
    // Configuração para o build final
    build: {
        // Onde o Vite vai gerar os arquivos de build
        outDir: './dist',
        // Garante que o diretório de saída seja limpo antes de cada build
        emptyOutDir: true,
    },
    plugins: [(0, plugin_react_1.default)()],
    // Opcional, mas útil: Define um alias '@' para o diretório 'src'
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, './src'),
        },
    },
    // Necessário para o HMR do Tauri funcionar corretamente
    server: {
        strictPort: true,
        port: 1420
    }
});
//# sourceMappingURL=vite.config.js.map