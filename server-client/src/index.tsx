import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import { MirServerControlProvider } from "./contexts/MirServerControlsContext";
import { theme } from "./Theme";
import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { MirServerStatsProvider } from "./contexts/MirServerStatsContext";
import { MirServerConnectionProvider } from "./contexts/MirServerConnectionContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <MirServerConnectionProvider>
      <React.StrictMode>
        <BrowserRouter>
          <MirServerControlProvider>
            <MirServerStatsProvider>
              <Home />
            </MirServerStatsProvider>
          </MirServerControlProvider>
        </BrowserRouter>
      </React.StrictMode>
    </MirServerConnectionProvider>
  </ThemeProvider>,
);
