import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";
import { LogType, ServerLog } from "../model/serverLog";
import { ServerStatus } from "../model/serverStatus";

type ControlListeners = {
  onServerLogReceived: (log: ServerLog, type: LogType) => void;
  setServerStatus: (status: ServerStatus) => void;
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

  private registerHandler(
    method: string,
    handler: (...args: any[]) => void,
  ): void {
    this.connection.off(method);
    this.connection.on(method, handler);
  }

  public addControlListeners(listeners: ControlListeners): void {
    this.registerHandler("ReceiveLog", (log: ServerLog, type: LogType) => {
      listeners.onServerLogReceived(log, type);
    });
    this.registerHandler("ServerStatus", (status: boolean) => {
      listeners.setServerStatus(status ? "Running" : "Not running");
    });
  }

  public addStatsListeners(listeners: StatsListeners): void {
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

  public async startServer(): Promise<void> {
    await this.connection.invoke("StartServer");
  }

  public async stopServer() {
    await this.connection.invoke("StopServer");
  }

  public async rebootServer(): Promise<void> {
    await this.connection.invoke("RebootServer");
  }
}
