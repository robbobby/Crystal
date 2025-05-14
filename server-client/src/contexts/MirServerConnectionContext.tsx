import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { ServerConnectionService } from "../services/serverConnectionService";
import { FatalError } from "../components/error/Error";
import { LoadingSpinner } from "../components/Loading";

type ServerConnectionContext = {
  connection: ServerConnectionService;
};

const MirServerConnectionContext =
  createContext<ServerConnectionContext | null>(null);

export const MirServerConnectionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const service = ServerConnectionService.getInstance();

  useEffect(() => {
    setLoading(true);
    service.startConnection().then((statusCode) => {
      if (statusCode === 401) {
        setError(
          "You are not authorized (check REACT_APP_WS_API_KEY in .env matches server appsettings.json)",
        );
      } else if (statusCode === 500) {
        setError(
          "Internal server error (has the WS API Key been set on the server?)",
        );
      } else {
        setError("");
      }
      setLoading(false);
    });

    return () => {
      service.closeConnection();
    };
  }, [service]);

  if (loading) {
    return (
      <LoadingSpinner
        size="large"
        message="Attempting to connect to server..."
      />
    );
  }
  if (error) {
    console.log(error);
    return (
      <>
        <FatalError error={new Error(error)} />
      </>
    );
  }

  return (
    <MirServerConnectionContext.Provider value={{ connection: service }}>
      {children}
    </MirServerConnectionContext.Provider>
  );
};

export const useMirServerConnection = (): ServerConnectionContext => {
  const ctx = useContext(MirServerConnectionContext);
  if (!ctx) {
    throw new Error(
      "useMirServerConnection must be used within a MirServerConnectionProvider",
    );
  }
  return ctx;
};
