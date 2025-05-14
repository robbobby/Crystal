import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { ServerConnectionService } from "../services/serverConnectionService";
import { LogType, ServerLog } from "../model/serverLog";
import { ServerStatus } from "../model/serverStatus";

type ServerConnectionContext = {
  connection: ServerConnectionService;
  error: string;
};

const MirServerConnectionContext = createContext<ServerConnectionContext | null>(null);

export const MirServerConnectionProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<string>("");

  const service = ServerConnectionService.getInstance();

  useEffect(() => {
    service.startConnection().then((statusCode) => {
      if (statusCode === 401) {
        setError(
          "You are not authorized (check REACT_APP_WS_API_KEY in .env matches server appsettings.json)"
        );
      } else if (statusCode === 500) {
        setError("Internal server error (has the WS API Key been set on the server?)");
      } else {
        setError("");
      }
    });

    return () => {
      service.closeConnection();
    };
  }, [service]);

  return (
    <MirServerConnectionContext.Provider value={{ connection: service, error }}>
      {children}
    </MirServerConnectionContext.Provider>
  );
};

export const useMirServerConnection = (): ServerConnectionContext => {
  const ctx = useContext(MirServerConnectionContext);
  if (!ctx) {
    throw new Error("useMirServerConnection must be used within a MirServerConnectionProvider");
  }
  return ctx;
};
