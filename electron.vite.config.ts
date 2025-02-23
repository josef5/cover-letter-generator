import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        // "@renderer": resolve("src/renderer/src"),
        "@": resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, "src/renderer/index.html"),
          "cover-letter-window": resolve(
            __dirname,
            "src/renderer/cover-letter-window.html",
          ),
        },
      },
    },
    plugins: [react()],
  },
});
