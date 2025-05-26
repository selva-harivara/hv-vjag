import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Toolbar,
  Collapse,
  IconButton,
  Divider,
  ListItemButton,
  Popover,
} from "@mui/material";
import {
  MonetizationOn,
  Info,
  List as ListIcon,
  PhoneIphone,
  Settings as SettingsIcon,
  AccountTree,
  AccountBalance,
  Store,
  Gavel,
  Dashboard as DashboardIcon,
  ChevronLeft,
  ChevronRight,
  Update as UpdateIcon,
  ExpandLess,
  ExpandMore,
  Business,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useModule } from "../contexts/ModuleContext";

const drawerWidth = 260;
const collapsedDrawerWidth = 65;

// Type definitions
interface SubMenuItem {
  text: string;
  path: string;
  icon: React.ReactNode | null;
  enabled: boolean;
}

interface MainMenuItem {
  text: string;
  path: string;
  icon: React.ReactNode;
  subMenus?: SubMenuItem[];
}

interface ParentMenu {
  text: string;
  icon: React.ReactNode;
  subMenus: SubMenuItem[];
}

interface OrganizationMenu {
  parent: ParentMenu;
  mainMenus: MainMenuItem[];
}

type OrganizationMenus = {
  [key: string]: OrganizationMenu;
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selected } = useModule();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Replace multiple open* states with a single openMenuKey
  const [openMenuKey, setOpenMenuKey] = React.useState<string | null>(null);

  // Popover state for collapsed sidebar
  const [submenuPopoverAnchor, setSubmenuPopoverAnchor] =
    React.useState<null | HTMLElement>(null);
  const [submenuPopoverMenuKey, setSubmenuPopoverMenuKey] = React.useState<
    string | null
  >(null);

  // Helper to open popover for a parent menu
  const handleParentMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    menuKey: string
  ) => {
    setSubmenuPopoverAnchor(event.currentTarget);
    setSubmenuPopoverMenuKey(menuKey);
  };
  const handlePopoverClose = () => {
    setSubmenuPopoverAnchor(null);
    setSubmenuPopoverMenuKey(null);
  };

  // Define menus for each organization
  const organizationMenus: OrganizationMenus = {
    "Harivara One": {
      parent: {
        text: "Harivara One",
        icon: <AccountTree fontSize="medium" />,
        subMenus: [
          {
            text: "Currency",
            path: "/organization/harivaraone/currency",
            icon: <MonetizationOn color="primary" />,
            enabled: true,
          },
          {
            text: "Currency - Intl",
            path: "/currency-intl",
            icon: null,
            enabled: false,
          },
          {
            text: "Country - Intl",
            path: "/country-intl",
            icon: null,
            enabled: false,
          },
          { text: "Entity", path: "/entity", icon: null, enabled: false },
        ],
      },
      mainMenus: [],
    },
    Harivara: {
      parent: {
        text: "Harivara",
        icon: <AccountTree fontSize="medium" />,
        subMenus: [],
      },
      mainMenus: [
        {
          text: "Dashboard",
          path: "/harivara-dashboard",
          icon: <DashboardIcon color="primary" />,
        },
        {
          text: "Settings",
          path: "/harivara-settings",
          icon: <SettingsIcon color="primary" />,
        },
      ],
    },
    "E-Puja": {
      parent: {
        text: "E-Puja",
        icon: <AccountTree fontSize="medium" />,
        subMenus: [],
      },
      mainMenus: [
        {
          text: "Dashboard",
          path: "/epuja-dashboard",
          icon: <DashboardIcon color="primary" />,
        },
        {
          text: "Settings",
          path: "/epuja-settings",
          icon: <SettingsIcon color="primary" />,
        },
      ],
    },
    "Temple Tour": {
      parent: {
        text: "Temple Tour",
        icon: <AccountTree fontSize="medium" />,
        subMenus: [],
      },
      mainMenus: [
        {
          text: "Dashboard",
          path: "/temple-tour-dashboard",
          icon: <DashboardIcon color="primary" />,
        },
        {
          text: "Settings",
          path: "/temple-tour-settings",
          icon: <SettingsIcon color="primary" />,
        },
      ],
    },
    "Temple Service": {
      parent: {
        text: "Temple Service",
        icon: <AccountTree fontSize="medium" />,
        subMenus: [],
      },
      mainMenus: [
        {
          text: "Dashboard",
          path: "/temple-service-dashboard",
          icon: <DashboardIcon color="primary" />,
        },
        {
          text: "Settings",
          path: "/temple-service-settings",
          icon: <SettingsIcon color="primary" />,
        },
      ],
    },
  };

  const currentMenu =
    organizationMenus[selected] || organizationMenus["Harivara One"];

  const lastPathnameRef = React.useRef(location.pathname);

  React.useEffect(() => {
    if (isCollapsed) {
      setOpenMenuKey(null);
      lastPathnameRef.current = location.pathname;
      return;
    }
    // Only update openMenuKey if the route actually changed
    if (lastPathnameRef.current !== location.pathname) {
      if (location.pathname.startsWith("/company-info")) {
        setOpenMenuKey("CompanyInfo");
      } else if (location.pathname.startsWith("/tax-settings")) {
        setOpenMenuKey("TaxSettings");
      } else if (location.pathname.startsWith("/web-app-menus")) {
        setOpenMenuKey("WebAppMenus");
      } else if (location.pathname.startsWith("/mobile-app-settings-ca")) {
        setOpenMenuKey("MobileAppSettCA");
      } else if (location.pathname.startsWith("/mobile-app-settings-va")) {
        setOpenMenuKey("MobileAppSettVA");
      } else if (
        currentMenu.parent.subMenus.some((sub) =>
          location.pathname.startsWith(sub.path)
        )
      ) {
        setOpenMenuKey("HarivaraOne");
      } else {
        setOpenMenuKey(null);
      }
      lastPathnameRef.current = location.pathname;
    }
  }, [location.pathname, isCollapsed, currentMenu.parent.subMenus]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
        flexShrink: 0,
        transition: "width 0.2s ease-in-out",
        [`& .MuiDrawer-paper`]: {
          width: isCollapsed ? collapsedDrawerWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#fff",
          transition: "width 0.2s ease-in-out",
        },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          mt: 2,
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 64px)", // Subtract toolbar height
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          {/* Harivara One parent menu */}
          <ListItem disablePadding>
            <ListItemButton
              selected={currentMenu.parent.subMenus.some((sub) =>
                location.pathname.startsWith(sub.path)
              )}
              onClick={
                isCollapsed
                  ? (e) => handleParentMenuClick(e, "HarivaraOne")
                  : () =>
                      setOpenMenuKey(
                        openMenuKey === "HarivaraOne" ? null : "HarivaraOne"
                      )
              }
              sx={{
                color: currentMenu.parent.subMenus.some((sub) =>
                  location.pathname.startsWith(sub.path)
                )
                  ? "#5F79D9"
                  : "#7B7B93",
                fontWeight: currentMenu.parent.subMenus.some((sub) =>
                  location.pathname.startsWith(sub.path)
                )
                  ? 700
                  : 400,
                background: currentMenu.parent.subMenus.some((sub) =>
                  location.pathname.startsWith(sub.path)
                )
                  ? "#f0f4ff"
                  : "transparent",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                {currentMenu.parent.icon}
              </ListItemIcon>
              <ListItemText primary={currentMenu.parent.text} />
              {openMenuKey === "HarivaraOne" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          {/* Harivara One submenus (inline if expanded, popover if collapsed) */}
          {!isCollapsed && (
            <Collapse
              in={openMenuKey === "HarivaraOne"}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{ ml: 5, borderLeft: "3px solid #e3e8f0", pl: 2, mb: 2 }}
              >
                <List disablePadding>
                  {currentMenu.parent.subMenus.map((item: SubMenuItem) => {
                    const isSelected = location.pathname.startsWith(item.path);
                    return (
                      <ListItem disablePadding key={item.text}>
                        <ListItemButton
                          selected={isSelected}
                          onClick={() => navigate(item.path)}
                          sx={{
                            color: isSelected ? "#5F79D9" : "#7B7B93",
                            fontWeight: isSelected ? 700 : 400,
                            background: isSelected ? "#f0f4ff" : "transparent",
                            pl: 0,
                            mb: 0.5,
                          }}
                        >
                          {item.icon && (
                            <ListItemIcon sx={{ color: "inherit" }}>
                              {item.icon}
                            </ListItemIcon>
                          )}
                          <ListItemText
                            primary={
                              <Typography
                                fontWeight={isSelected ? 700 : 400}
                                color={isSelected ? "#5F79D9" : "#7B7B93"}
                              >
                                {item.text}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
            </Collapse>
          )}
          {/* Harivara One submenus popover for collapsed sidebar */}
          <Popover
            open={
              isCollapsed &&
              submenuPopoverMenuKey === "HarivaraOne" &&
              Boolean(submenuPopoverAnchor)
            }
            anchorEl={submenuPopoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 180, p: 1 } }}
          >
            <List>
              {currentMenu.parent.subMenus.map((item: SubMenuItem) => {
                const isSelected = location.pathname.startsWith(item.path);
                return (
                  <ListItem disablePadding key={item.text}>
                    <ListItemButton
                      selected={isSelected}
                      onClick={() => {
                        navigate(item.path);
                        handlePopoverClose();
                      }}
                      sx={{
                        color: isSelected ? "#5F79D9" : "#7B7B93",
                        fontWeight: isSelected ? 700 : 400,
                        background: isSelected ? "#f0f4ff" : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      {item.icon && (
                        <ListItemIcon sx={{ color: "inherit" }}>
                          {item.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={isSelected ? 700 : 400}
                            color={isSelected ? "#5F79D9" : "#7B7B93"}
                          >
                            {item.text}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Popover>

          {/* App/Web Menus parent menu (only for Harivara One) */}
          {selected === "Harivara One" && (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname.startsWith("/app-web-menus")}
                  onClick={() => navigate("/app-web-menus")}
                  sx={{
                    color: location.pathname.startsWith("/app-web-menus")
                      ? "#5F79D9"
                      : "#7B7B93",
                    fontWeight: location.pathname.startsWith("/app-web-menus")
                      ? 700
                      : 400,
                    background: location.pathname.startsWith("/app-web-menus")
                      ? "#f0f4ff"
                      : "transparent",
                    borderRadius: 2,
                    mb: 1,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText primary="App/Web Menus" />
                </ListItemButton>
              </ListItem>
              {/* App/Web Menus submenus (inline if expanded, popover if collapsed) */}
              {!isCollapsed && (
                <Collapse
                  in={openMenuKey === "WebAppMenus"}
                  timeout="auto"
                  unmountOnExit
                >
                  <Box
                    sx={{
                      ml: 5,
                      borderLeft: "3px solid #e3e8f0",
                      pl: 2,
                      mb: 2,
                    }}
                  >
                    <List disablePadding>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={
                            location.pathname === "/app-web-menus/horizontal-ca"
                          }
                          onClick={() =>
                            navigate("/app-web-menus/horizontal-ca")
                          }
                          sx={{
                            color:
                              location.pathname ===
                              "/app-web-menus/horizontal-ca"
                                ? "#5F79D9"
                                : "#7B7B93",
                            fontWeight:
                              location.pathname ===
                              "/app-web-menus/horizontal-ca"
                                ? 700
                                : 400,
                            background:
                              location.pathname ===
                              "/app-web-menus/horizontal-ca"
                                ? "#f0f4ff"
                                : "transparent",
                            pl: 0,
                            mb: 0.5,
                          }}
                        >
                          <ListItemIcon sx={{ color: "inherit" }}>
                            <ListIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                fontWeight={
                                  location.pathname ===
                                  "/app-web-menus/horizontal-ca"
                                    ? 700
                                    : 400
                                }
                                color={
                                  location.pathname ===
                                  "/app-web-menus/horizontal-ca"
                                    ? "#5F79D9"
                                    : "#7B7B93"
                                }
                              >
                                Horizontal Menus (CA)
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={
                            location.pathname === "/app-web-menus/vertical-ca"
                          }
                          onClick={() => navigate("/app-web-menus/vertical-ca")}
                          sx={{
                            color:
                              location.pathname === "/app-web-menus/vertical-ca"
                                ? "#5F79D9"
                                : "#7B7B93",
                            fontWeight:
                              location.pathname === "/app-web-menus/vertical-ca"
                                ? 700
                                : 400,
                            background:
                              location.pathname === "/app-web-menus/vertical-ca"
                                ? "#f0f4ff"
                                : "transparent",
                            pl: 0,
                            mb: 0.5,
                          }}
                        >
                          <ListItemIcon sx={{ color: "inherit" }}>
                            <ListIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                fontWeight={
                                  location.pathname ===
                                  "/app-web-menus/vertical-ca"
                                    ? 700
                                    : 400
                                }
                                color={
                                  location.pathname ===
                                  "/app-web-menus/vertical-ca"
                                    ? "#5F79D9"
                                    : "#7B7B93"
                                }
                              >
                                Vertical Menus (CA)
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          selected={
                            location.pathname === "/app-web-menus/vertical-va"
                          }
                          onClick={() => navigate("/app-web-menus/vertical-va")}
                          sx={{
                            color:
                              location.pathname === "/app-web-menus/vertical-va"
                                ? "#5F79D9"
                                : "#7B7B93",
                            fontWeight:
                              location.pathname === "/app-web-menus/vertical-va"
                                ? 700
                                : 400,
                            background:
                              location.pathname === "/app-web-menus/vertical-va"
                                ? "#f0f4ff"
                                : "transparent",
                            pl: 0,
                            mb: 0.5,
                          }}
                        >
                          <ListItemIcon sx={{ color: "inherit" }}>
                            <ListIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              <Typography
                                fontWeight={
                                  location.pathname ===
                                  "/app-web-menus/vertical-va"
                                    ? 700
                                    : 400
                                }
                                color={
                                  location.pathname ===
                                  "/app-web-menus/vertical-va"
                                    ? "#5F79D9"
                                    : "#7B7B93"
                                }
                              >
                                Vertical Menus (VA)
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    </List>
                  </Box>
                </Collapse>
              )}
            </>
          )}

          {/* Tax Settings parent menu */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith("/tax-settings")}
              onClick={
                isCollapsed
                  ? (e) => handleParentMenuClick(e, "TaxSettings")
                  : () =>
                      setOpenMenuKey(
                        openMenuKey === "TaxSettings" ? null : "TaxSettings"
                      )
              }
              sx={{
                color: location.pathname.startsWith("/tax-settings")
                  ? "#5F79D9"
                  : "#7B7B93",
                fontWeight: location.pathname.startsWith("/tax-settings")
                  ? 700
                  : 400,
                background: location.pathname.startsWith("/tax-settings")
                  ? "#f0f4ff"
                  : "transparent",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Tax Settings" />
              {openMenuKey === "TaxSettings" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          {!isCollapsed && (
            <Collapse
              in={openMenuKey === "TaxSettings"}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{ ml: 5, borderLeft: "3px solid #e3e8f0", pl: 2, mb: 2 }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={location.pathname === "/tax-settings/tds"}
                      onClick={() => navigate("/tax-settings/tds")}
                      sx={{
                        color:
                          location.pathname === "/tax-settings/tds"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/tax-settings/tds" ? 700 : 400,
                        background:
                          location.pathname === "/tax-settings/tds"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <Gavel />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname === "/tax-settings/tds"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname === "/tax-settings/tds"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            TDS
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Collapse>
          )}
          <Popover
            open={
              isCollapsed &&
              submenuPopoverMenuKey === "TaxSettings" &&
              Boolean(submenuPopoverAnchor)
            }
            anchorEl={submenuPopoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 180, p: 1 } }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/tax-settings/tds"}
                  onClick={() => {
                    navigate("/tax-settings/tds");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/tax-settings/tds"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/tax-settings/tds" ? 700 : 400,
                    background:
                      location.pathname === "/tax-settings/tds"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <Gavel />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/tax-settings/tds" ? 700 : 400
                        }
                        color={
                          location.pathname === "/tax-settings/tds"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        TDS
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>

          {/* Company Info parent menu */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith("/company-info")}
              onClick={
                isCollapsed
                  ? (e) => handleParentMenuClick(e, "CompanyInfo")
                  : () =>
                      setOpenMenuKey(
                        openMenuKey === "CompanyInfo" ? null : "CompanyInfo"
                      )
              }
              sx={{
                color: location.pathname.startsWith("/company-info")
                  ? "#5F79D9"
                  : "#7B7B93",
                fontWeight: location.pathname.startsWith("/company-info")
                  ? 700
                  : 400,
                background: location.pathname.startsWith("/company-info")
                  ? "#f0f4ff"
                  : "transparent",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <Info />
              </ListItemIcon>
              <ListItemText primary="Company Info" />
              {openMenuKey === "CompanyInfo" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          {/* Company Info submenus (inline if expanded, popover if collapsed) */}
          {!isCollapsed && (
            <Collapse
              in={openMenuKey === "CompanyInfo"}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{ ml: 5, borderLeft: "3px solid #e3e8f0", pl: 2, mb: 2 }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname === "/company-info/business-details"
                      }
                      onClick={() => navigate("/company-info/business-details")}
                      sx={{
                        color:
                          location.pathname === "/company-info/business-details"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/company-info/business-details"
                            ? 700
                            : 400,
                        background:
                          location.pathname === "/company-info/business-details"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <Business />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname ===
                              "/company-info/business-details"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname ===
                              "/company-info/business-details"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Business Details
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname === "/company-info/gst-settings"
                      }
                      onClick={() => navigate("/company-info/gst-settings")}
                      sx={{
                        color:
                          location.pathname === "/company-info/gst-settings"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/company-info/gst-settings"
                            ? 700
                            : 400,
                        background:
                          location.pathname === "/company-info/gst-settings"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <AccountBalance />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname === "/company-info/gst-settings"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname === "/company-info/gst-settings"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            GST Settings
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={location.pathname === "/company-info/branches"}
                      onClick={() => navigate("/company-info/branches")}
                      sx={{
                        color:
                          location.pathname === "/company-info/branches"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/company-info/branches"
                            ? 700
                            : 400,
                        background:
                          location.pathname === "/company-info/branches"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <Store />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname === "/company-info/branches"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname === "/company-info/branches"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Branches
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Collapse>
          )}
          <Popover
            open={
              isCollapsed &&
              submenuPopoverMenuKey === "CompanyInfo" &&
              Boolean(submenuPopoverAnchor)
            }
            anchorEl={submenuPopoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 180, p: 1 } }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    location.pathname === "/company-info/business-details"
                  }
                  onClick={() => {
                    navigate("/company-info/business-details");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/company-info/business-details"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/company-info/business-details"
                        ? 700
                        : 400,
                    background:
                      location.pathname === "/company-info/business-details"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <Business />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/company-info/business-details"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname === "/company-info/business-details"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Business Details
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/company-info/gst-settings"}
                  onClick={() => {
                    navigate("/company-info/gst-settings");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/company-info/gst-settings"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/company-info/gst-settings"
                        ? 700
                        : 400,
                    background:
                      location.pathname === "/company-info/gst-settings"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <AccountBalance />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/company-info/gst-settings"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname === "/company-info/gst-settings"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        GST Settings
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/company-info/branches"}
                  onClick={() => {
                    navigate("/company-info/branches");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/company-info/branches"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/company-info/branches"
                        ? 700
                        : 400,
                    background:
                      location.pathname === "/company-info/branches"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <Store />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/company-info/branches"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname === "/company-info/branches"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Branches
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>

          {/* Web and App Menus parent menu */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith("/web-app-menus")}
              onClick={
                isCollapsed
                  ? (e) => handleParentMenuClick(e, "WebAppMenus")
                  : () =>
                      setOpenMenuKey(
                        openMenuKey === "WebAppMenus" ? null : "WebAppMenus"
                      )
              }
              sx={{
                color: location.pathname.startsWith("/web-app-menus")
                  ? "#5F79D9"
                  : "#7B7B93",
                fontWeight: location.pathname.startsWith("/web-app-menus")
                  ? 700
                  : 400,
                background: location.pathname.startsWith("/web-app-menus")
                  ? "#f0f4ff"
                  : "transparent",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <ListIcon />
              </ListItemIcon>
              <ListItemText primary="Web and App Menus" />
              {openMenuKey === "WebAppMenus" ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
          </ListItem>
          {/* Web and App Menus submenus (inline if expanded, popover if collapsed) */}
          {!isCollapsed && (
            <Collapse
              in={openMenuKey === "WebAppMenus"}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{
                  ml: 5,
                  borderLeft: "3px solid #e3e8f0",
                  pl: 2,
                  mb: 2,
                }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname === "/web-app-menus/horizontal-ca"
                      }
                      onClick={() => navigate("/web-app-menus/horizontal-ca")}
                      sx={{
                        color:
                          location.pathname === "/web-app-menus/horizontal-ca"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/web-app-menus/horizontal-ca"
                            ? 700
                            : 400,
                        background:
                          location.pathname === "/web-app-menus/horizontal-ca"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <ListIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname ===
                              "/web-app-menus/horizontal-ca"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname ===
                              "/web-app-menus/horizontal-ca"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Horizontal Menus (CA)
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname === "/web-app-menus/vertical-ca"
                      }
                      onClick={() => navigate("/web-app-menus/vertical-ca")}
                      sx={{
                        color:
                          location.pathname === "/web-app-menus/vertical-ca"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/web-app-menus/vertical-ca"
                            ? 700
                            : 400,
                        background:
                          location.pathname === "/web-app-menus/vertical-ca"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <ListIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname === "/web-app-menus/vertical-ca"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname === "/web-app-menus/vertical-ca"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Vertical Menus (CA)
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname === "/web-app-menus/vertical-va"
                      }
                      onClick={() => navigate("/web-app-menus/vertical-va")}
                      sx={{
                        color:
                          location.pathname === "/web-app-menus/vertical-va"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname === "/web-app-menus/vertical-va"
                            ? 700
                            : 400,
                        background:
                          location.pathname === "/web-app-menus/vertical-va"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <ListIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname === "/web-app-menus/vertical-va"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname === "/web-app-menus/vertical-va"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Vertical Menus (VA)
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Collapse>
          )}
          <Popover
            open={
              isCollapsed &&
              submenuPopoverMenuKey === "WebAppMenus" &&
              Boolean(submenuPopoverAnchor)
            }
            anchorEl={submenuPopoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 180, p: 1 } }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    location.pathname === "/web-app-menus/horizontal-ca"
                  }
                  onClick={() => {
                    navigate("/web-app-menus/horizontal-ca");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/web-app-menus/horizontal-ca"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/web-app-menus/horizontal-ca"
                        ? 700
                        : 400,
                    background:
                      location.pathname === "/web-app-menus/horizontal-ca"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/web-app-menus/horizontal-ca"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname === "/web-app-menus/horizontal-ca"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Horizontal Menus (CA)
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/web-app-menus/vertical-ca"}
                  onClick={() => {
                    navigate("/web-app-menus/vertical-ca");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/web-app-menus/vertical-ca"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/web-app-menus/vertical-ca"
                        ? 700
                        : 400,
                    background:
                      location.pathname === "/web-app-menus/vertical-ca"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/web-app-menus/vertical-ca"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname === "/web-app-menus/vertical-ca"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Vertical Menus (CA)
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === "/web-app-menus/vertical-va"}
                  onClick={() => {
                    navigate("/web-app-menus/vertical-va");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname === "/web-app-menus/vertical-va"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname === "/web-app-menus/vertical-va"
                        ? 700
                        : 400,
                    background:
                      location.pathname === "/web-app-menus/vertical-va"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <ListIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname === "/web-app-menus/vertical-va"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname === "/web-app-menus/vertical-va"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Vertical Menus (VA)
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>

          {/* Mobile App Sett...(CA) parent menu */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith("/mobile-app-settings-ca")}
              onClick={
                isCollapsed
                  ? (e) => handleParentMenuClick(e, "MobileAppSettCA")
                  : () =>
                      setOpenMenuKey(
                        openMenuKey === "MobileAppSettCA"
                          ? null
                          : "MobileAppSettCA"
                      )
              }
              sx={{
                color: location.pathname.startsWith("/mobile-app-settings-ca")
                  ? "#5F79D9"
                  : "#7B7B93",
                fontWeight: location.pathname.startsWith(
                  "/mobile-app-settings-ca"
                )
                  ? 700
                  : 400,
                background: location.pathname.startsWith(
                  "/mobile-app-settings-ca"
                )
                  ? "#f0f4ff"
                  : "transparent",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <PhoneIphone />
              </ListItemIcon>
              <ListItemText primary="Mobile App Sett...(CA)" />
              {openMenuKey === "MobileAppSettCA" ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
          </ListItem>
          {/* Mobile App Sett...(CA) submenus (inline if expanded, popover if collapsed) */}
          {!isCollapsed && (
            <Collapse
              in={openMenuKey === "MobileAppSettCA"}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{ ml: 5, borderLeft: "3px solid #e3e8f0", pl: 2, mb: 2 }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname ===
                        "/mobile-app-settings-ca/publish-settings"
                      }
                      onClick={() =>
                        navigate("/mobile-app-settings-ca/publish-settings")
                      }
                      sx={{
                        color:
                          location.pathname ===
                          "/mobile-app-settings-ca/publish-settings"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname ===
                          "/mobile-app-settings-ca/publish-settings"
                            ? 700
                            : 400,
                        background:
                          location.pathname ===
                          "/mobile-app-settings-ca/publish-settings"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname ===
                              "/mobile-app-settings-ca/publish-settings"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname ===
                              "/mobile-app-settings-ca/publish-settings"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Publish Settings
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname ===
                        "/mobile-app-settings-ca/update-maintenance"
                      }
                      onClick={() =>
                        navigate("/mobile-app-settings-ca/update-maintenance")
                      }
                      sx={{
                        color:
                          location.pathname ===
                          "/mobile-app-settings-ca/update-maintenance"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname ===
                          "/mobile-app-settings-ca/update-maintenance"
                            ? 700
                            : 400,
                        background:
                          location.pathname ===
                          "/mobile-app-settings-ca/update-maintenance"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <UpdateIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname ===
                              "/mobile-app-settings-ca/update-maintenance"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname ===
                              "/mobile-app-settings-ca/update-maintenance"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Update & Maintenance
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Collapse>
          )}
          <Popover
            open={
              isCollapsed &&
              submenuPopoverMenuKey === "MobileAppSettCA" &&
              Boolean(submenuPopoverAnchor)
            }
            anchorEl={submenuPopoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 180, p: 1 } }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    location.pathname ===
                    "/mobile-app-settings-ca/publish-settings"
                  }
                  onClick={() => {
                    navigate("/mobile-app-settings-ca/publish-settings");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname ===
                      "/mobile-app-settings-ca/publish-settings"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname ===
                      "/mobile-app-settings-ca/publish-settings"
                        ? 700
                        : 400,
                    background:
                      location.pathname ===
                      "/mobile-app-settings-ca/publish-settings"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname ===
                          "/mobile-app-settings-ca/publish-settings"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname ===
                          "/mobile-app-settings-ca/publish-settings"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Publish Settings
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    location.pathname ===
                    "/mobile-app-settings-ca/update-maintenance"
                  }
                  onClick={() => {
                    navigate("/mobile-app-settings-ca/update-maintenance");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname ===
                      "/mobile-app-settings-ca/update-maintenance"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname ===
                      "/mobile-app-settings-ca/update-maintenance"
                        ? 700
                        : 400,
                    background:
                      location.pathname ===
                      "/mobile-app-settings-ca/update-maintenance"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <UpdateIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname ===
                          "/mobile-app-settings-ca/update-maintenance"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname ===
                          "/mobile-app-settings-ca/update-maintenance"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Update & Maintenance
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>

          {/* Mobile App Sett...(VA) parent menu */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname.startsWith("/mobile-app-settings-va")}
              onClick={
                isCollapsed
                  ? (e) => handleParentMenuClick(e, "MobileAppSettVA")
                  : () =>
                      setOpenMenuKey(
                        openMenuKey === "MobileAppSettVA"
                          ? null
                          : "MobileAppSettVA"
                      )
              }
              sx={{
                color: location.pathname.startsWith("/mobile-app-settings-va")
                  ? "#5F79D9"
                  : "#7B7B93",
                fontWeight: location.pathname.startsWith(
                  "/mobile-app-settings-va"
                )
                  ? 700
                  : 400,
                background: location.pathname.startsWith(
                  "/mobile-app-settings-va"
                )
                  ? "#f0f4ff"
                  : "transparent",
                borderRadius: 2,
                mb: 1,
              }}
            >
              <ListItemIcon sx={{ color: "inherit" }}>
                <PhoneIphone />
              </ListItemIcon>
              <ListItemText primary="Mobile App Sett...(VA)" />
              {openMenuKey === "MobileAppSettVA" ? (
                <ExpandLess />
              ) : (
                <ExpandMore />
              )}
            </ListItemButton>
          </ListItem>
          {/* Mobile App Sett...(VA) submenus (inline if expanded, popover if collapsed) */}
          {!isCollapsed && (
            <Collapse
              in={openMenuKey === "MobileAppSettVA"}
              timeout="auto"
              unmountOnExit
            >
              <Box
                sx={{ ml: 5, borderLeft: "3px solid #e3e8f0", pl: 2, mb: 2 }}
              >
                <List disablePadding>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname ===
                        "/mobile-app-settings-va/publish-settings"
                      }
                      onClick={() =>
                        navigate("/mobile-app-settings-va/publish-settings")
                      }
                      sx={{
                        color:
                          location.pathname ===
                          "/mobile-app-settings-va/publish-settings"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname ===
                          "/mobile-app-settings-va/publish-settings"
                            ? 700
                            : 400,
                        background:
                          location.pathname ===
                          "/mobile-app-settings-va/publish-settings"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <SettingsIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname ===
                              "/mobile-app-settings-va/publish-settings"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname ===
                              "/mobile-app-settings-va/publish-settings"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Publish Settings
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemButton
                      selected={
                        location.pathname ===
                        "/mobile-app-settings-va/update-maintenance"
                      }
                      onClick={() =>
                        navigate("/mobile-app-settings-va/update-maintenance")
                      }
                      sx={{
                        color:
                          location.pathname ===
                          "/mobile-app-settings-va/update-maintenance"
                            ? "#5F79D9"
                            : "#7B7B93",
                        fontWeight:
                          location.pathname ===
                          "/mobile-app-settings-va/update-maintenance"
                            ? 700
                            : 400,
                        background:
                          location.pathname ===
                          "/mobile-app-settings-va/update-maintenance"
                            ? "#f0f4ff"
                            : "transparent",
                        pl: 0,
                        mb: 0.5,
                      }}
                    >
                      <ListItemIcon sx={{ color: "inherit" }}>
                        <UpdateIcon />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            fontWeight={
                              location.pathname ===
                              "/mobile-app-settings-va/update-maintenance"
                                ? 700
                                : 400
                            }
                            color={
                              location.pathname ===
                              "/mobile-app-settings-va/update-maintenance"
                                ? "#5F79D9"
                                : "#7B7B93"
                            }
                          >
                            Update & Maintenance
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </Box>
            </Collapse>
          )}
          <Popover
            open={
              isCollapsed &&
              submenuPopoverMenuKey === "MobileAppSettVA" &&
              Boolean(submenuPopoverAnchor)
            }
            anchorEl={submenuPopoverAnchor}
            onClose={handlePopoverClose}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            PaperProps={{ sx: { minWidth: 180, p: 1 } }}
          >
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    location.pathname ===
                    "/mobile-app-settings-va/publish-settings"
                  }
                  onClick={() => {
                    navigate("/mobile-app-settings-va/publish-settings");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname ===
                      "/mobile-app-settings-va/publish-settings"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname ===
                      "/mobile-app-settings-va/publish-settings"
                        ? 700
                        : 400,
                    background:
                      location.pathname ===
                      "/mobile-app-settings-va/publish-settings"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname ===
                          "/mobile-app-settings-va/publish-settings"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname ===
                          "/mobile-app-settings-va/publish-settings"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Publish Settings
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  selected={
                    location.pathname ===
                    "/mobile-app-settings-va/update-maintenance"
                  }
                  onClick={() => {
                    navigate("/mobile-app-settings-va/update-maintenance");
                    handlePopoverClose();
                  }}
                  sx={{
                    color:
                      location.pathname ===
                      "/mobile-app-settings-va/update-maintenance"
                        ? "#5F79D9"
                        : "#7B7B93",
                    fontWeight:
                      location.pathname ===
                      "/mobile-app-settings-va/update-maintenance"
                        ? 700
                        : 400,
                    background:
                      location.pathname ===
                      "/mobile-app-settings-va/update-maintenance"
                        ? "#f0f4ff"
                        : "transparent",
                    pl: 0,
                    mb: 0.5,
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>
                    <UpdateIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        fontWeight={
                          location.pathname ===
                          "/mobile-app-settings-va/update-maintenance"
                            ? 700
                            : 400
                        }
                        color={
                          location.pathname ===
                          "/mobile-app-settings-va/update-maintenance"
                            ? "#5F79D9"
                            : "#7B7B93"
                        }
                      >
                        Update & Maintenance
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </Popover>

          {/* Other main menu items */}
          {!isCollapsed &&
            currentMenu.mainMenus.map((item: MainMenuItem) => {
              const isSelected = location.pathname.startsWith(item.path);
              return (
                <ListItem disablePadding>
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => navigate(item.path)}
                    sx={{
                      color: isSelected ? "#5F79D9" : "#7B7B93",
                      fontWeight: isSelected ? 700 : 400,
                      background: isSelected ? "#f0f4ff" : "transparent",
                      borderRadius: 2,
                      mb: 0.5,
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          fontWeight={isSelected ? 700 : 400}
                          color={isSelected ? "#5F79D9" : "#7B7B93"}
                        >
                          {item.text}
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
        </List>

        <Box sx={{ mt: "auto" }}>
          <Divider />
          <Box sx={{ p: 1, display: "flex", justifyContent: "center" }}>
            <IconButton
              onClick={() => setIsCollapsed(!isCollapsed)}
              sx={{
                color: "#5F79D9",
                "&:hover": {
                  backgroundColor: "#f3f6fd",
                },
              }}
            >
              {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
