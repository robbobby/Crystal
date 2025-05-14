import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { LogType, ServerLog } from "../model/serverLog";
import { ServerStatus } from "../model/serverStatus";
import { Character } from "../contexts/MirPlayersOnlineContext";

type ControlListeners = {
  onServerLogReceived: (log: ServerLog, type: LogType) => void;
  setServerStatus: (status: ServerStatus) => void;
};

type PlayerListeners = {
  onPlayerListReceived: (playerList: Character[]) => void;
  onPlayerRemoved: (playerList: Character) => void;
};

type StatsListeners = {
  setPlayerCount: (count: number) => void;
  setMonsterCount: (count: number) => void;
  setConnectionCount: (count: number) => void;
  setBlockedIpCount: (count: number) => void;
  setCycleDelays: (delay: [string, string, string]) => void;
  setAdminConnectionCount: (count: number) => void;
  setUserConnectionCount: (count: number) => void;
};

export class ServerConnectionService {
  private readonly connection: HubConnection;
  private static instance: ServerConnectionService;
  public readonly request: Request;
  public readonly handlers: Handlers;

  public static getInstance(): ServerConnectionService {
    if (!ServerConnectionService.instance) {
      ServerConnectionService.instance = new ServerConnectionService();
    }
    return ServerConnectionService.instance;
  }

  private constructor() {
    this.connection = new HubConnectionBuilder()
      .withUrl(`${process.env.REACT_APP_WS_URL}/ws/signalrHub`, {
        transport: HttpTransportType.WebSockets,
        accessTokenFactory: () => process.env.REACT_APP_WS_API_KEY || "",
        withCredentials: true,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    this.request = new Request(this.connection);
    this.handlers = new Handlers(this.connection);

    this.connection.on("GroupTest", (message: string) => {
      console.log("[SignalR Group Test]", message);
    });

  }

  public async startConnection(): Promise<number> {
    if (this.connection.state === HubConnectionState.Connected) {
      return 200;
    }
    try {
      await this.connection.start();
      return 200;
    } catch (err: any) {
      console.error("Error starting SignalR connection:", err);
      return err.message?.includes("401") ? 401 : 500;
    }
  }

  public async closeConnection(): Promise<void> {
    if (this.connection.state === HubConnectionState.Connected) {
      await this.connection.stop();
      console.log("SignalR connection stopped");
    }
  }
}

class Request {
  private connection: HubConnection;
  constructor(connection: HubConnection) {
    this.connection = connection;
  }

  public async initialState() {
    await this.connection.invoke("InitialState");
  }

  public async startServer(): Promise<void> {
    await this.connection.invoke("StartServer");
  }

  public async stopServer() {
    await this.connection.invoke("StopServer");
  }

  public async rebootServer(): Promise<void> {
    await this.connection.invoke("RebootServer");
  }

  public async playerList() {
    await this.connection.invoke("PlayerList");
  }
}

class Handlers {
  private connection: HubConnection;

  constructor(connection: HubConnection) {
    this.connection = connection;
  }


  public registerControlHandler(listeners: ControlListeners): void {
    this.registerHandler("ReceiveLog", (log: ServerLog, type: LogType) => {
      listeners.onServerLogReceived(log, type);
    });
    this.registerHandler("ServerStatus", (status: boolean) => {
      listeners.setServerStatus(status ? "Running" : "Not running");
    });
  }

  public registerPlayerHandler(param: PlayerListeners) {
    this.registerHandler("PlayerAdded", (playerList: Character[]) => {
      param.onPlayerListReceived(playerList);
    });
    this.registerHandler("PlayerRemoved", (playerList: Character) => {
      param.onPlayerRemoved(playerList);
    });
  }

  public registerStatsHandler(listeners: StatsListeners): void {
    this.registerHandler("PlayerCount", (count: number) =>
      listeners.setPlayerCount(count),
    );
    this.registerHandler("MonsterCount", (count: number) =>
      listeners.setMonsterCount(count),
    );
    this.registerHandler("ConnectionCount", (count: number) =>
      listeners.setConnectionCount(count),
    );
    this.registerHandler("BlockedIpCount", (count: number) =>
      listeners.setBlockedIpCount(count),
    );
    this.registerHandler("CycleDelay", (delay: [string, string, string]) =>
      listeners.setCycleDelays(delay),
    );
    this.registerHandler("AdminConnectionCount", (count: number) =>
      listeners.setAdminConnectionCount(count),
    );
    this.registerHandler("UserConnectionCount", (count: number) =>
      listeners.setUserConnectionCount(count),
    );
  }

  private registerHandler(method: string, handler: (...args: any[]) => void): void {
    this.connection.off(method);
    this.connection.on(method, handler);
  }
}
