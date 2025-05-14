import { useServerControls } from "../../../contexts/MirServerControlsContext";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import MessageList from "../../../components/MessageList";
import { LogType, ServerLog } from "../../../model/serverLog";

type Props = {
  logType: LogType;
  logs: ServerLog[];
}
export const Logs = ({ logType, logs }: Props) => {
  const { clearLogs } = useServerControls();
  return (
    <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Typography variant="h6" gutterBottom>
          {logType} Logs
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => clearLogs(logType)}
          sx={{ mb: 2 }}
        >
          Clear Logs
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />
      <MessageList messages={logs} />
    </Paper>
  );
};
