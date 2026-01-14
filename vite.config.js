import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { authPlugin } from "./vite-plugin-auth.js";
import { apiPlugin } from "./vite-plugin-api.js";

export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss(), authPlugin(), apiPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    optimizeDeps: {
      exclude: ["better-auth", "mongodb", "bcryptjs"],
    },
    // IMPORTANT:
    // Do not inject server secrets into the client bundle via `define`.
    // Only keep public, client-safe values in `import.meta.env.VITE_*`.
  };
});   