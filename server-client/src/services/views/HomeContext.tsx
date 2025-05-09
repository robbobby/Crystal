import {createContext, useContext, ReactNode, useEffect, useRef, useState} from 'react';
import {WsLog} from "../../model/WsLog";
import {SignalRService} from "../signalr";
import {ServerStatus} from "../../model/ServerStatus";

type HomeContextType = {
    startServer: () => void;
    stopServer: () => void;
    serverStatus: ServerStatus;
    logs: WsLog[];
    clearLogs: () => void;
    error: string;
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const HomeProvider = ({children}: { children: ReactNode }) => {
    const [logs, setLogs] = useState<WsLog[]>([]);
    const signalRRef = useRef<SignalRService | null>(null);
    const [serverStatus, setServerStatus] = useState<ServerStatus>('Not running');
    const [error, setError] = useState<string>("");

    const addLog = (log: WsLog): void => {
        setLogs(prev => [...prev, log]);
    };

    useEffect(() => {
        const service = new SignalRService({onLogReceived: addLog, setServerStatus});

        signalRRef.current = service;
        service.startConnection().then(statusCode => {
            if (statusCode === 401) {
                setError('You are not authorized to access this resource, have you set the REACT_APP_WS_API_KEY environment variable? in .env to be the same as WsApiKey in the server appsettings.json?');
            } else if (statusCode === 500) {
                setError('Internal server error, has the WS Api Key been set on the server?');
            } else {
                setError('');
            }
        });

        return () => {
            service.stopConnection();
        };
    }, []);

    async function startServer(): Promise<void> {
        if (signalRRef.current) {
            signalRRef.current.startServer();
        }
    }

    async function stopServer(): Promise<void> {
        if (signalRRef.current) {
            await signalRRef.current.stopConnection()
        }
    }

    function clearLogs() {
        setLogs([]);
    }

    const value: HomeContextType = {
        logs,
        clearLogs,
        serverStatus,
        startServer,
        stopServer,
        error
    };

    return (
        <HomeContext.Provider value={value}>
            {children}
        </HomeContext.Provider>
    );
};

export const useHome = (): HomeContextType => {
    const context = useContext(HomeContext);
    if (!context) {
        throw new Error('useHome must be used within a HomeProvider');
    }
    return context;
};
