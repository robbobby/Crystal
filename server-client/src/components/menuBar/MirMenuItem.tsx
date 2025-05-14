import React, { useState, useCallback } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { MirMenuItemDefinition } from "../../model/mirMenuItemDefinition";

interface MirMenuItemProps {
  menu: MirMenuItemDefinition;
  onClose?: () => void;
}

const MirMenuItem: React.FC<MirMenuItemProps> = ({ menu, onClose }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  // Toggle submenu on click
  const handleToggle = (event: React.MouseEvent<HTMLElement>) => {
    if (!MirMenuItemDefinition.isParent(menu)) {
      menu.action();
      onClose?.();
      return;
    }
    setAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
    onClose?.();
  }, [onClose]);

  return (
    <>
      <MenuItem onClick={handleToggle}>
        {menu.label}
        {MirMenuItemDefinition.isParent(menu) && (
          <ArrowRightIcon sx={{ ml: "auto" }} />
        )}
      </MenuItem>

      {MirMenuItemDefinition.isParent(menu) && (
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          slotProps={{
            paper: { onMouseLeave: handleClose },
            list: { onMouseLeave: handleClose },
          }}
        >
          {menu.children.map((child) => (
            <MirMenuItem key={child.label} menu={child} onClose={handleClose} />
          ))}
        </Menu>
      )}
    </>
  );
};

export default MirMenuItem;
