import React, { createContext, useContext, useEffect, useState } from "react";
import { useMirServerConnection } from "./MirServerConnectionContext";
import { MirClass } from "../model/serverStuff/mirClass";
import { MirGender } from "../model/serverStuff/mirGender";
import { LoadingSpinner } from "../components/Loading";

export type Character = {
  id: number;
  name: string;
  level: number;
  class: MirClass;
  gender: MirGender;
}

interface MirPlayersOnlineContextType {
  characters: Character[];
}

const MirPlayersOnlineContext = createContext<MirPlayersOnlineContextType | undefined>(undefined);

export const MirPlayersOnlineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { connection } = useMirServerConnection();

  const value = {
    characters,
  };

  useEffect(() => {
    setLoading(true);
    setCharacters([]);

    const addPlayers = (playerList: Character[]) => {
      setLoading(false);
      setCharacters((prev) => [...prev, ...playerList]);
    }

    const removePlayer = (playerList: Character) => {
      setCharacters((prev) => prev.filter((player) => player.name !== playerList.name));
    }

    connection.handlers.registerPlayerHandler({
      onPlayerListReceived: addPlayers,
      onPlayerRemoved: removePlayer,
    });

    connection.request.playerList();

  }, [connection]);

  if (loading) {
    return (
      <div>
        <LoadingSpinner/>
      </div>
    );
  }

  return (
    <MirPlayersOnlineContext.Provider value={value}>
      {children}
    </MirPlayersOnlineContext.Provider>
  );
};

export const useMirPlayersOnline = () => {
  const context = useContext(MirPlayersOnlineContext);
  if (context === undefined) {
    throw new Error('usePlayersOnline must be used within a PlayersOnlineProvider');
  }
  return context;
};
