import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import ServerControls from "../../components/ServerControls";
import { dashboardTabs } from "./dashboardTabConfig";
import { useServerControls } from "../../contexts/MirServerControlsContext";
import { MirPlayersOnlineProvider } from "../../contexts/MirPlayersOnlineContext";

export const DashboardView = () => {
  const tabs = dashboardTabs;
  const [params, setParams] = useSearchParams();
  const tabKey = params.get("tab") ?? tabs[0].key;
  const activeTabIndex = tabs.findIndex((t) => t.key === tabKey);
  const value = activeTabIndex < 0 ? 0 : activeTabIndex;

  const { serverLogs, chatLogs, debugLogs } = useServerControls();

  const onChange = (_: React.SyntheticEvent, newValue: number) => {
    const key = tabs[newValue].key;
    setParams({ tab: key });
  };

  const renderActiveTab = () => {
    const activeTab = tabs[value];

    switch (activeTab.key) {
      case "server":
        return <activeTab.Component logs={serverLogs} logType="Server" />;
      case "chat":
        return <activeTab.Component logs={chatLogs} logType="Chat" />;
      case "debug":
        return <activeTab.Component logs={debugLogs} logType="Debug" />;
      default:
        return (
          <MirPlayersOnlineProvider>
            <activeTab.Component />
          </MirPlayersOnlineProvider>
        );
    }
  };

  return (
    <>
      <ServerControls />
      <Box>
        <Tabs value={value} onChange={onChange}>
          {tabs.map((t) => (
            <Tab key={t.key} label={t.label} />
          ))}
        </Tabs>
        <Box sx={{ mt: 3 }}>{renderActiveTab()}</Box>
      </Box>
    </>
  );
};
