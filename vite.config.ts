import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    server: {
      host: true, // Listen on all addresses
      port: 8080,
      strictPort: false, // Allow fallback to next available port
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    // Only expose safe environment variables to the client
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_APP_TITLE': JSON.stringify(env.VITE_APP_TITLE),
      // Add other safe environment variables prefixed with VITE_
      // Example: 'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
    },
  };
});
