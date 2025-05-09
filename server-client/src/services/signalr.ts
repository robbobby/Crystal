import {HubConnection, HubConnectionBuilder, LogLevel} from "@microsoft/signalr";
import {WsLog} from "../model/WsLog";
import {ServerStatus} from "../model/ServerStatus";

type ConstructorParams = {
    onLogReceived: (log: WsLog) => void;
    setServerStatus: (status: ServerStatus) => void;
}

export class SignalRService {
    private readonly connection: HubConnection;
    private readonly onLogReceived: (log: WsLog) => void;
    private readonly setServerStatus: (status: ServerStatus) => void;

    constructor(args: ConstructorParams) {
        this.onLogReceived = args.onLogReceived;
        this.setServerStatus = args.setServerStatus;

        this.connection = new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_WS_URL}/ws/signalrHub`, {
                headers: {
                    "x-api-key": process.env.REACT_APP_WS_API_KEY || "",
                },
                withCredentials: true,
            })
            .configureLogging(LogLevel.Information)
            .build();

        this.addListeners();
    }

    private addListeners() {
        this.connection.on("ReceiveLog", (log: WsLog) => {
            this.onLogReceived(log);
        });

        this.connection.on("ServerStatus", (status: string) => {
            console.log("Server status:", status);
            if (status) {
                this.setServerStatus("Running");
            } else {
                this.setServerStatus("Not running");
            }
        });
    }

    public async startConnection(): Promise<number> {
        try {
            await this.connection.start();

            console.log("SignalR connection started");
            return 200;
        } catch (err) {
            console.error("Error starting SignalR connection:", err);

            if (err instanceof Error && err.message.includes('401')) {
                return 401;
            }

            return 500;
        }
    }

    public async stopConnection(): Promise<void> {
        try {
            await this.connection.stop();
            console.log("SignalR connection stopped");
        } catch (err) {
            console.error("Error stopping SignalR connection:", err);
        }
    }

    startServer() {
        this.connection.invoke("StartServer")
            .then(() => {
                console.log("Server started");
            })
            .catch(err => {
                console.error("Error starting server:", err);
            });
    }

}
