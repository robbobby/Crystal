import { Logs } from "./tabs/Logs";
import { DebugLogs } from "./tabs/DebugLogs";
import { ChatLogs } from "./tabs/ChatLogs";
import { PlayersOnline } from "../PlayersOnline";
import { Guilds } from "./tabs/Guilds";

export const dashboardTabs = [
  { key: "server", label: "Server Log", Component: Logs },
  { key: "debug", label: "Debug Log", Component: Logs },
  { key: "chat", label: "Chat Log", Component: Logs },
  { key: "players", label: "Players Online", Component: PlayersOnline },
  { key: "guilds", label: "Guilds", Component: Guilds },
] as const;
