import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // Check for mantine packages first
            if (id.includes("@mantine") || id.includes("mantine-react-table")) {
              return "mantine-vendor";
            }
            // Next, group React libraries
            if (id.includes("react") || id.includes("react-dom")) {
              return "react-vendor";
            }
            // Group recharts separately
            if (id.includes("recharts")) {
              return "recharts-vendor";
            }
            // Everything else goes into vendor.
            return "vendor";
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
});
