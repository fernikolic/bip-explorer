import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  root: path.resolve("client"),
  build: {
    outDir: path.resolve("dist"),
    emptyOutDir: true,
    // Performance optimizations for SEO
    minify: 'esbuild',
    cssMinify: true,
    rollupOptions: {
      output: {
        // Enable code splitting for better caching
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog'],
          query: ['@tanstack/react-query'],
          router: ['wouter']
        }
      }
    },
    // Compress assets
    assetsInlineLimit: 4096, // Inline small assets as base64
    chunkSizeWarningLimit: 500,
    // Source maps for production debugging (optional)
    sourcemap: false
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "..", "shared"),
    },
  },
  // Performance optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query']
  },
  // Server optimizations for development
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
});