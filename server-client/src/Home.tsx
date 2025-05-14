import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./Theme";
import { FatalError } from "./components/error/Error";
import { useRoutes } from "react-router-dom";
import { appRoutes } from "./Routes";
import { useMirServerConnection } from "./contexts/MirServerConnectionContext";

function Home() {
  const { error } = useMirServerConnection();
  const routing = useRoutes(appRoutes);

  if (error) {
    return (
      <>
        <FatalError error={error} />
      </>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default Home;
