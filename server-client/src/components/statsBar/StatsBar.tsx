import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import BugReportIcon from '@mui/icons-material/BugReport';
import WifiIcon from '@mui/icons-material/Wifi';
import BlockIcon from '@mui/icons-material/Block';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import TimerIcon from '@mui/icons-material/Timer';
import { styled } from '@mui/material/styles';
import { useMirServerStats } from '../../contexts/MirServerStatsContext';

const Group = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StatsBar: React.FC = () => {
  const stats = useMirServerStats();

  const serverStats = [
    { icon: PeopleIcon, label: 'Players', value: stats.players },
    { icon: BugReportIcon, label: 'Monsters', value: stats.monsters },
    { icon: WifiIcon, label: 'Connections', value: stats.connections },
    { icon: BlockIcon, label: 'Blocked IPs', value: stats.blockedIps },
  ];

  const websiteStats = [
    { icon: AdminPanelSettingsIcon, label: 'Admin Connections', value: stats.adminConnections },
    { icon: PersonIcon, label: 'User Connections', value: stats.userConnections },
  ];

  console.log(stats.adminConnections);
  return (
    <Paper
      elevation={2}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        flexWrap: 'wrap',
        gap: 2,
      }}
    >
      <Group>
        <Typography variant="subtitle2">Server Stats</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {serverStats.map(({ icon: Icon, label, value }) => (
            <Group key={label}>
              <Icon fontSize="small" color="action" />
              <Typography variant="body2"><strong>{value}</strong> {label}</Typography>
            </Group>
          ))}
        </Box>
      </Group>

      <Divider orientation="vertical" flexItem />

      <Group>
        <Typography variant="subtitle2">Website Stats</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {websiteStats.map(({ icon: Icon, label, value }) => (
            <Group key={label}>
              <Icon fontSize="small" color="action" />
              <Typography variant="body2"><strong>{value}</strong> {label}</Typography>
            </Group>
          ))}
        </Box>
      </Group>

      <Divider orientation="vertical" flexItem />

      <Group>
        <Typography variant="subtitle2">Cycle Delays</Typography>
        <Group>
          <TimerIcon fontSize="small" color="action" />
          <Typography variant="body2">{stats.cycleDelays.join(' | ')}</Typography>
        </Group>
      </Group>
    </Paper>
  );
};

export default StatsBar;
