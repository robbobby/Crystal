import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useServerControls } from "../../contexts/MirServerControlsContext";
import { MirMenuItemDefinition } from "../../model/mirMenuItemDefinition";
import MirMenuItem from "./MirMenuItem";
import buildMenuItems from "./menuConfig";

const MirMenuBar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const controls = useServerControls();

  const menuItems: MirMenuItemDefinition[] = buildMenuItems(controls);

  const handleOpen = (
    event: React.MouseEvent<HTMLButtonElement>,
    idx: number,
  ) => {
    setAnchorEl(event.currentTarget);
    setOpenIndex(idx);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setOpenIndex(null);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        {menuItems.map((menu, idx) => (
          <React.Fragment key={menu.label}>
            <Button
              color="inherit"
              onClick={(e) =>
                MirMenuItemDefinition.isParent(menu)
                  ? handleOpen(e, idx)
                  : menu.action?.()
              }
              endIcon={
                MirMenuItemDefinition.isParent(menu) ? (
                  <ArrowRightIcon />
                ) : undefined
              }
            >
              {menu.label}
            </Button>

            {MirMenuItemDefinition.isParent(menu) && (
              <Menu
                anchorEl={anchorEl}
                open={openIndex === idx}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                {menu.children.map((child) => (
                  <MirMenuItem
                    key={child.label}
                    menu={child}
                    onClose={handleClose}
                  />
                ))}
              </Menu>
            )}
          </React.Fragment>
        ))}
        <Typography variant="caption" sx={{ ml: "auto" }}>
          Uptime: 0d:0h:2m:30s
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default MirMenuBar;
