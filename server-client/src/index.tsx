import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import { MirServerControlProvider } from "./contexts/MirServerControlsContext";
import { theme } from "./Theme";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { MirServerStatsProvider } from "./contexts/MirServerStatsContext";
import { MirServerConnectionProvider } from "./contexts/MirServerConnectionContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <React.StrictMode>
    <MirServerConnectionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <MirServerControlProvider>
            <MirServerStatsProvider>
              <Home />
            </MirServerStatsProvider>
          </MirServerControlProvider>
        </BrowserRouter>
      </ThemeProvider>
    </MirServerConnectionProvider>
  </React.StrictMode>,
);
