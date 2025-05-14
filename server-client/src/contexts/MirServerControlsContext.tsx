import {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { LogType, ServerLog } from "../model/serverLog";
import { ServerStatus } from "../model/serverStatus";
import { useMirServerConnection } from "./MirServerConnectionContext";

type MirServerControls = {
  startServer: () => void;
  stopServer: () => void;
  serverStatus: ServerStatus;
  rebootServer: () => void;
  serverLogs: ServerLog[];
  chatLogs: ServerLog[];
  debugLogs: ServerLog[];
  clearLogs: (type: LogType) => void;
};

const MirServerControlContext = createContext<MirServerControls | undefined>(
  undefined,
);

export const MirServerControlProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [serverLogs, setServerServerLogs] = useState<ServerLog[]>([]);
  const [chatLogs, setChatLogs] = useState<ServerLog[]>([]);
  const [debugLogs, setDebugLogs] = useState<ServerLog[]>([]);
  const [serverStatus, setServerStatus] = useState<ServerStatus>("Not running");

  const { connection } = useMirServerConnection();

  useEffect(() => {

    connection.addControlListeners({
      onServerLogReceived: addServerLog,
      setServerStatus,
    });
  }, []);


  const addServerLog = (log: ServerLog, type: LogType): void => {
    switch (type) {
      case "Server":
        setServerServerLogs((prev) => [...prev, log]);
        break;
      case "Chat":
        setChatLogs((prev) => [...prev, log]);
        break;
      case "Debug":
        setDebugLogs((prev) => [...prev, log]);
        break;
    }
  };


  async function startServer(): Promise<void> {
    if (connection) {
      connection.startServer();
    }
  }

  async function stopServer(): Promise<void> {
    if (connection) {
      await connection.stopServer();
    }
  }

  async function rebootServer(): Promise<void> {
    if (connection) {
      await connection.rebootServer();
    }
  }

  function clearLogs(type: LogType): void {
    switch (type) {
      case "Server":
        setServerServerLogs([]);
        break;
      case "Chat":
        setChatLogs([]);
        break;
      case "Debug":
        setDebugLogs([]);
        break;
      default:
        break;
    }
  }

  const value: MirServerControls = {
    serverLogs,
    chatLogs,
    debugLogs,
    clearLogs,
    serverStatus,
    startServer,
    stopServer,
    rebootServer,
  };

  return (
    <MirServerControlContext.Provider value={value}>
      {children}
    </MirServerControlContext.Provider>
  );
};

export const useServerControls = (): MirServerControls => {
  const context = useContext(MirServerControlContext);
  if (!context) {
    throw new Error("useHome must be used within a HomeProvider");
  }
  return context;
};
