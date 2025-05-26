import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useModule } from "../contexts/ModuleContext";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { selected, setSelected, modules } = useModule();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [orgAnchorEl, setOrgAnchorEl] = React.useState<null | HTMLElement>(
    null
  );
  const navigate = useNavigate();

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleOrgMenuOpen = (event: React.MouseEvent<HTMLElement>) =>
    setOrgAnchorEl(event.currentTarget);
  const handleOrgMenuClose = () => setOrgAnchorEl(null);

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate("/login");
  };

  const handleModuleSelect = (mod: string) => {
    setSelected(mod);
    handleOrgMenuClose();
  };

  console.log("Sidebar selected module:", selected);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "linear-gradient(90deg, #7b8fff 0%, #b48cf2 100%)",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={handleOrgMenuOpen} sx={{ color: "#fff", mr: 1 }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "#fff", cursor: "pointer" }}
            onClick={handleOrgMenuOpen}
          >
            {selected}
          </Typography>
          <Menu
            anchorEl={orgAnchorEl}
            open={Boolean(orgAnchorEl)}
            onClose={handleOrgMenuClose}
          >
            {modules.map((mod) => (
              <MenuItem
                key={mod}
                onClick={() => handleModuleSelect(mod)}
                selected={mod === selected}
              >
                <Typography fontWeight={mod === selected ? 700 : 400}>
                  {mod}
                </Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton>
            <Badge color="error" variant="dot" overlap="circular">
              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen} size="small" sx={{ p: 0 }}>
            <Avatar src={user?.photoURL || undefined}>
              {user?.photoURL
                ? null
                : user?.displayName
                ? user.displayName[0]
                : null}
            </Avatar>
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>
          <Typography variant="body1" sx={{ color: "#fff", fontWeight: 500 }}>
            Hi, {user?.displayName || "User"}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
