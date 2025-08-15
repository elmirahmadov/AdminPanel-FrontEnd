import { defineConfig } from "vite";
import path from "path";

import react from "@vitejs/plugin-react-swc";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    "import.meta.env": process.env,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./app"),
    },
  },
});
