import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  base: "./",
  root: path.join(__dirname, "src", "renderer"),
  build: {
    outDir: path.join(__dirname, "dist", "renderer"),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.join(__dirname, "src", "renderer", "index.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5000,
  },
  optimizeDeps: {
    exclude: ["electron"],
  },
});
