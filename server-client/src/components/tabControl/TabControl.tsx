import React from "react";
import { Tabs, Tab, Box, Typography } from "@mui/material";

export type TabControlProps = {
  tabs: { label: string; content: React.ReactNode }[];
  initialTab?: number;
};

type TabPanelProps = {
  children?: React.ReactNode;
  index: number;
  value: number;
};

const TabPanel: React.FC<TabPanelProps> = ({
  children,
  value,
  index,
  ...other
}) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tab-panel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 2 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
};

const TabControl: React.FC<TabControlProps> = ({ tabs, initialTab = 0 }) => {
  const [value, setValue] = React.useState<number>(initialTab);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="Tab Control"
        variant="scrollable"
        scrollButtons="auto"
      >
        {tabs.map((tab, idx) => (
          <Tab
            key={idx}
            label={tab.label}
            id={`tab-${idx}`}
            aria-controls={`tab-panel-${idx}`}
          />
        ))}
      </Tabs>
      {tabs.map((tab, idx) => (
        <TabPanel key={idx} value={value} index={idx}>
          {tab.content}
        </TabPanel>
      ))}
    </Box>
  );
};

export default TabControl;
