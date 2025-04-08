import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Mantine
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

import { theme } from "./theme.ts";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MantineProvider theme={{ ...theme }} defaultColorScheme="auto">
      <App />
    </MantineProvider>
  </StrictMode>
);
