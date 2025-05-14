import { Logs } from "./tabs/Logs";
import { Guilds } from "./tabs/Guilds";
import PlayersOnline from "./tabs/PlayersOnline";

export const dashboardTabs = [
  { key: "server", label: "Server Log", Component: Logs },
  { key: "debug", label: "Debug Log", Component: Logs },
  { key: "chat", label: "Chat Log", Component: Logs },
  { key: "players", label: "Players Online", Component: PlayersOnline },
  { key: "guilds", label: "Guilds", Component: Guilds },
] as const;
