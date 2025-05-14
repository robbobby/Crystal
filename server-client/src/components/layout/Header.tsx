import { AppBar, Toolbar, Typography, Chip } from "@mui/material";
import { useServerControls } from "../../contexts/MirServerControlsContext";

const Header = () => {
  const { serverStatus } = useServerControls();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          SignalR Server Control
        </Typography>
        <Chip
          label={serverStatus}
          color={serverStatus.toLowerCase() === "running" ? "success" : "error"}
          variant="outlined"
        />
      </Toolbar>
    </AppBar>
  );
};

export default Header;
