import React, { createContext, useContext, useState, ReactNode } from "react";
import { useMirServerConnection } from "./MirServerConnectionContext";

export type StatsBarProps = {
  players: number;
  monsters: number;
  connections: number;
  blockedIps: number;
  cycleDelays: [string, string, string];

  adminConnections: number;
  userConnections: number;
};

type MirServerStatsContextValue = StatsBarProps;

const defaultStats: StatsBarProps = {
  players: 0,
  monsters: 0,
  connections: 0,
  blockedIps: 0,
  cycleDelays: ["0", "0", "0"],

  adminConnections: 0,
  userConnections: 0,
};

const MirServerStatsContext = createContext<
  MirServerStatsContextValue | undefined
>(undefined);

export const MirServerStatsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [playerCount, setPlayerCount] = useState<number>(defaultStats.players);
  const [monsterCount, setMonsterCount] = useState<number>(
    defaultStats.monsters,
  );
  const [connectionCount, setConnectionCount] = useState<number>(
    defaultStats.connections,
  );
  const [blockedIpCount, setBlockedIpCount] = useState<number>(
    defaultStats.blockedIps,
  );
  const [cycleDelays, setCycleDelays] = useState<[string, string, string]>(
    defaultStats.cycleDelays,
  );
  const [adminConnectionCount, setAdminConnectionCount] = useState<number>(
    defaultStats.adminConnections,
  );
  const [userConnectionCount, setUserConnectionCount] = useState<number>(
    defaultStats.userConnections,
  );

  const { connection } = useMirServerConnection();

  connection.addStatsListeners({
    setPlayerCount,
    setMonsterCount,
    setConnectionCount,
    setBlockedIpCount,
    setCycleDelays,
    setAdminConnectionCount,
    setUserConnectionCount,
  });

  return (
    <MirServerStatsContext.Provider
      value={{
        players: playerCount,
        monsters: monsterCount,
        connections: connectionCount,
        blockedIps: blockedIpCount,
        cycleDelays: cycleDelays,

        adminConnections: adminConnectionCount,
        userConnections: userConnectionCount,
      }}
    >
      {children}
    </MirServerStatsContext.Provider>
  );
};

export const useMirServerStats = (): MirServerStatsContextValue => {
  const context = useContext(MirServerStatsContext);
  if (!context) {
    throw new Error(
      "useMirServerStats must be used within a MirServerStatsProvider",
    );
  }
  return context;
};
