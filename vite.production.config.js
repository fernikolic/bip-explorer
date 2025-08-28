import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: resolve("client"),
  resolve: {
    alias: {
      "@": resolve("client/src"),
      "@shared": resolve("shared"),
      "@assets": resolve("attached_assets"),
    },
  },
  build: {
    outDir: resolve("dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      }
    }
  },
  publicDir: resolve("client/public"),
});