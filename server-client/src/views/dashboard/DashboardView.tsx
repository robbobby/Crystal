import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ServerControls from "../../components/ServerControls";
import { dashboardTabs } from "./dashboardTabConfig";
import { useServerControls } from "../../contexts/MirServerControlsContext";
import { LogType, ServerLog } from "../../model/serverLog";

export const DashboardView = () => {
  const tabs = dashboardTabs;
  const [params, setParams] = useSearchParams();
  const tabKey = params.get("tab") ?? tabs[0].key;
  const activeTabIndex = tabs.findIndex((t) => t.key === tabKey);
  const value = activeTabIndex < 0 ? 0 : activeTabIndex;

  const {serverLogs, chatLogs, debugLogs} = useServerControls();

  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    const key = tabs[newValue].key;
    setParams({ tab: key });
  };

  let logs: ServerLog[] = [];
  let type: LogType = "Server";
  switch (tabs[value].key) {
    case "server":
      logs = serverLogs;
      break;
    case "chat":
      logs = chatLogs;
      type = "Chat";
      break;
    case "debug":
      logs = debugLogs;
      type = "Debug";
      break;
    default:
      break;
  }

  const Active = tabs[value].Component;

  return (
    <>
      <ServerControls />
      <Box>
        <Tabs value={value} onChange={onChange}>
          {tabs.map((t) => (
            <Tab key={t.key} label={t.label} />
          ))}
        </Tabs>
        <Box sx={{ mt: 3 }}>
          <Active logs={logs} logType={type} />
        </Box>
      </Box>
    </>
  );
};
