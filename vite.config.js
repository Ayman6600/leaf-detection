import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    // Improve build performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor dependencies into separate chunks
          vendor: ["react", "react-dom"],
          animations: ["framer-motion", "gsap"],
          ui: ["bootstrap", "bootstrap-icons"],
          pdf: ["jspdf"],
        },
      },
    },
    // Reduce bundle size
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log statements in production
        drop_debugger: true, // Remove debugger statements in production
      },
    },
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "framer-motion",
      "gsap",
      "bootstrap",
      "jspdf",
    ],
  },
});
