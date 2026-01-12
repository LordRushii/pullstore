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
    define: {
      // Make env variables available to the app
      'process.env.VITE_MONGO_URI': JSON.stringify(env.VITE_MONGO_URI),
      'process.env.VITE_BETTER_AUTH_SECRET': JSON.stringify(env.VITE_BETTER_AUTH_SECRET),
      'process.env.VITE_APP_URL': JSON.stringify(env.VITE_APP_URL),
    },
  };
});   