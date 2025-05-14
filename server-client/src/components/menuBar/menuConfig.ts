import { MirMenuItemDefinition } from "../../model/mirMenuItemDefinition";

type Actions = {
  startServer: () => void;
  stopServer: () => void;
  rebootServer: () => void;
};

const buildMenuItems = (controls: Actions): MirMenuItemDefinition[] => {
  const { startServer, stopServer, rebootServer } = controls;
  return [
    {
      label: "Control",
      children: [
        { label: "Start Server", action: startServer },
        { label: "Stop Server", action: stopServer },
        { label: "Reboot Server", action: rebootServer },
        {
          label: "Clear Blocked IPs",
          action: () => console.log("Clear Blocked IPs"),
        },
        { label: "Close Server", action: () => console.log("Close Server") },
        { label: "Reload", action: () => console.log("Reload") },
      ],
    },
    {
      label: "Account",
      children: [
        { label: "Accounts", action: () => console.log("Accounts") },
        { label: "Market", action: () => console.log("Market") },
        { label: "Namelists", action: () => console.log("Namelists") },
      ],
    },
    {
      label: "Database",
      children: [
        { label: "Map", action: () => console.log("Map") },
        { label: "Item", action: () => console.log("Item") },
        { label: "Monster", action: () => console.log("Monster") },
        { label: "NPC", action: () => console.log("NPC") },
        { label: "Quest", action: () => console.log("Quest") },
        { label: "Magic", action: () => console.log("Magic") },
        { label: "Gameshop", action: () => console.log("Gameshop") },
        { label: "Recipe", action: () => console.log("Recipe") },
      ],
    },
    {
      label: "Config",
      children: [
        { label: "Server", action: () => console.log("Server") },
        { label: "Balance", action: () => console.log("Balance") },
        {
          label: "System",
          children: [
            { label: "Dragon", action: () => console.log("Dragon") },
            { label: "Mining", action: () => console.log("Mining") },
            { label: "Guild", action: () => console.log("Guild") },
            { label: "Fishing", action: () => console.log("Fishing") },
            { label: "Mail", action: () => console.log("Mail") },
            { label: "Goods", action: () => console.log("Goods") },
            { label: "Refining", action: () => console.log("Refining") },
            {
              label: "Relationship",
              action: () => console.log("Relationship"),
            },
            { label: "Mentor", action: () => console.log("Mentor") },
            { label: "Gem", action: () => console.log("Gem") },
            { label: "Conquest", action: () => console.log("Conquest") },
            { label: "Spawntick", action: () => console.log("Spawntick") },
            { label: "Heroes", action: () => console.log("Heroes") },
          ],
        },
        { label: "Monster Tuner", action: () => console.log("Monster Tuner") },
        { label: "Drop Builder", action: () => console.log("Drop Builder") },
      ],
    },
    {
      label: "Characters",
      action: () => console.log("Characters"),
    },
  ];
};

export default buildMenuItems;
