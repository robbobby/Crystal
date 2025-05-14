import { useRoutes } from "react-router-dom";
import { ErrorBoundary } from "./components/error/ErrorBoundary";
import { appRoutes } from "./Routes";

function Home() {
  const routing = useRoutes(appRoutes);

  return <ErrorBoundary>{routing}</ErrorBoundary>;
}

export default Home;
