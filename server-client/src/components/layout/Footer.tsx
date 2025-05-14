import { Box } from "@mui/material";
import StatsBar from "../statsBar/StatsBar";

export const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{ p: 2, bgcolor: "background.paper", mt: "auto" }}
    >
      <StatsBar />
    </Box>
  );
};
