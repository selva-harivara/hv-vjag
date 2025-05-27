import React, { useState, useEffect } from "react";
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
  useMediaQuery,
  useTheme,
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
  Public,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import { useModule } from "../contexts/ModuleContext";

const drawerWidth = 260;
const collapsedDrawerWidth = 65;

type MenuItem = {
  label: string;
  path?: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  disabled?: boolean;
};

// Provided sidebarMenuConfig
const sidebarMenuConfig: Record<string, any> = {
  Organization: [
    {
      "Harivara One": [
        {
          label: "Harivara One",
          icon: <AccountTree />,
          children: [
            {
              label: "Currency",
              path: "/organization/harivaraone/currency",
              icon: <MonetizationOn />,
            },
            {
              label: "Currency Intl",
              path: "/organization/harivaraone/init-currency",
              icon: <MonetizationOn />,
            },
            {
              label: "Country Intl",
              path: "/organization/harivaraone/country-inti",
              icon: <Public />,
            },
          ],
        },
      ],
      "Tax Settings": [
        {
          label: "Tax Settings",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/organization/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
      ],

      "Company Info": [
        {
          label: "Company Info",
          icon: <Info />,
          children: [
            {
              label: "Business Details",
              path: "/organization/company-info/business-details",
              icon: <Business />,
            },
            {
              label: "GST Settings",
              path: "/organization/company-info/gst-settings",
              icon: <AccountBalance />,
            },
            {
              label: "Branches",
              path: "/organization/company-info/branches",
              icon: <Store />,
            },
          ],
        },
      ],
      "App Menus": [
        {
          label: "App Menus",
          icon: <Info />,
          children: [
            {
              label: "Horizontal Menus (CA)",
              path: "/organization/appMenus/horizontalCA",
              icon: <Business />,
            },
            {
              label: "Vertical Menus (CA)",
              path: "/organization/appMenus/verticalCA",
              icon: <AccountBalance />,
            },
            {
              label: "Vertical Menus (VA)",
              path: "/organization/appMenus/verticalVA",
              icon: <Store />,
            },
          ],
        },
      ],
    },
  ],
  harivara: [
    {
      "Harivara settingas": [
        {
          label: "settings",
          icon: <AccountTree />,
          children: [
            {
              label: "Currency",
              path: "/harivara/setting",
              icon: <MonetizationOn />,
            },
          ],
        },
      ],
      "order settings": [
        {
          label: "order price Settings",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/harivara/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
        {
          label: "TDS Settings options",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/harivara/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
      ],
    },
  ],
  "E-Puja": [
    {
      "Harivara settingas": [
        {
          label: "settings",
          icon: <AccountTree />,
          children: [
            {
              label: "Currency",
              path: "/e-puja/setting",
              icon: <MonetizationOn />,
            },
          ],
        },
      ],
      "order settings": [
        {
          label: "order price Settings",
          icon: <Gavel />,
          children: [
            { label: "TDS", path: "/e-puja/tds-settings/tds", icon: <Gavel /> },
          ],
        },
        {
          label: "e-puja Settings options",
          icon: <Gavel />,
          children: [
            { label: "TDS", path: "/e-puja/tds-settings/tds", icon: <Gavel /> },
          ],
        },
      ],
    },
  ],
  "Temple Tour": [
    {
      "Harivara settingas": [
        {
          label: "settings",
          icon: <AccountTree />,
          children: [
            {
              label: "Currency",
              path: "/temple-tour/setting",
              icon: <MonetizationOn />,
            },
          ],
        },
      ],
      "order settings": [
        {
          label: "order price Settings",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/temple-tour/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
        {
          label: "e-puja Settings options",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/temple-tour/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
      ],
    },
  ],
  "Temple Service": [
    {
      "Temple Service settingas": [
        {
          label: "settings",
          icon: <AccountTree />,
          children: [
            {
              label: "Currency",
              path: "/temple-service/setting",
              icon: <MonetizationOn />,
            },
          ],
        },
      ],
      "order settings": [
        {
          label: "order price Settings",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/temple-tour/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
        {
          label: "e-puja Settings options",
          icon: <Gavel />,
          children: [
            {
              label: "TDS",
              path: "/temple-tour/tds-settings/tds",
              icon: <Gavel />,
            },
          ],
        },
      ],
    },
  ],
};

function isMenuActive(menu: MenuItem, pathname: string): boolean {
  if (menu.path && pathname.startsWith(menu.path)) return true;
  if (menu.children)
    return menu.children.some((child: MenuItem) =>
      isMenuActive(child, pathname)
    );
  return false;
}

const normalizedConfig = Object.fromEntries(
  Object.entries(sidebarMenuConfig).map(([k, v]) => [k.toLowerCase(), v])
);

function findOpenMenuKey(menus: MenuItem[], pathname: string): string | null {
  for (const menu of menus) {
    if (
      menu.children &&
      menu.children.some((child) => isMenuActive(child, pathname))
    ) {
      return menu.label;
    }
    if (menu.children) {
      const nested = findOpenMenuKey(menu.children, pathname);
      if (nested) return menu.label;
    }
    if (menu.path === pathname) {
      return null; // It's a leaf, no parent to open
    }
  }
  return null;
}

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selected } = useModule(); // e.g. "Harivara One", "harivara", etc.
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isCollapsed, setIsCollapsed] = React.useState(isMobile);
  const [openMenuKey, setOpenMenuKey] = React.useState<string | null>(null);
  const [submenuPopoverAnchor, setSubmenuPopoverAnchor] =
    React.useState<null | HTMLElement>(null);
  const [submenuPopoverMenuKey, setSubmenuPopoverMenuKey] = React.useState<
    string | null
  >(null);
  const [menuConfig, setMenuConfig] = useState(null);

  useEffect(() => {
    fetch("/api/sidebar-config")
      .then((res) => res.json())
      .then(setMenuConfig);
  }, []);

  useEffect(() => {
    setIsCollapsed(isMobile);
  }, [isMobile]);

  // Get the menu config for the selected org
  const orgMenus = normalizedConfig[selected.toLowerCase()] || [];
  const hasMenus =
    orgMenus.length > 0 && Object.keys(orgMenus[0] || {}).length > 0;

  useEffect(() => {
    // Get all parent menus for the selected org
    const allSections = Object.values(orgMenus[0] || {}) as MenuItem[][];
    const allMenus = allSections.flat();
    const key = findOpenMenuKey(allMenus, location.pathname);
    setOpenMenuKey(key);
    // Optionally, close popover on route change
    setSubmenuPopoverAnchor(null);
    setSubmenuPopoverMenuKey(null);
  }, [location.pathname, selected]);

  // Helper to render menus recursively
  const renderMenus = (menus: MenuItem[]) => {
    return menus.map((menu: MenuItem) => {
      if (menu.children && menu.children.length > 0) {
        // Parent with children: render as collapsible
        return (
          <React.Fragment key={menu.label}>
            <ListItem disablePadding>
              <ListItemButton
                selected={openMenuKey === menu.label}
                onClick={
                  isCollapsed
                    ? (e) => {
                        setSubmenuPopoverAnchor(e.currentTarget);
                        setSubmenuPopoverMenuKey(menu.label);
                      }
                    : () =>
                        setOpenMenuKey(
                          openMenuKey === menu.label ? null : menu.label
                        )
                }
                sx={{
                  color: openMenuKey === menu.label ? "#5F79D9" : "#7B7B93",
                  fontWeight: openMenuKey === menu.label ? 700 : 400,
                  background:
                    openMenuKey === menu.label ? "#f0f4ff" : "transparent",
                  borderRadius: 2,
                  mb: 1,
                }}
              >
                {menu.icon && (
                  <ListItemIcon sx={{ color: "inherit" }}>
                    {menu.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={menu.label} />
                {openMenuKey === menu.label ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
            </ListItem>
            {/* Inline submenus */}
            {!isCollapsed && (
              <Collapse
                in={openMenuKey === menu.label}
                timeout="auto"
                unmountOnExit
              >
                <Box
                  sx={{ ml: 5, borderLeft: "3px solid #e3e8f0", pl: 2, mb: 2 }}
                >
                  {renderMenus(menu.children)}
                </Box>
              </Collapse>
            )}
            {/* Popover submenus for collapsed sidebar */}
            <Popover
              open={
                isCollapsed &&
                submenuPopoverMenuKey === menu.label &&
                Boolean(submenuPopoverAnchor)
              }
              anchorEl={submenuPopoverAnchor}
              onClose={() => {
                setSubmenuPopoverAnchor(null);
                setSubmenuPopoverMenuKey(null);
              }}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ sx: { minWidth: 180, p: 1 } }}
            >
              {renderMenus(menu.children)}
            </Popover>
          </React.Fragment>
        );
      } else if (menu.path) {
        // Leaf node: render as a clickable item
        return (
          <ListItem disablePadding key={menu.label + "-leaf"}>
            <ListItemButton
              selected={location.pathname === menu.path}
              onClick={() => menu.path && navigate(menu.path)}
              disabled={menu.disabled}
              sx={{
                color: location.pathname === menu.path ? "#5F79D9" : "#7B7B93",
                fontWeight: location.pathname === menu.path ? 700 : 400,
                background:
                  location.pathname === menu.path ? "#f0f4ff" : "transparent",
                pl: 0,
                mb: 0.5,
              }}
            >
              {menu.icon && (
                <ListItemIcon sx={{ color: "inherit" }}>
                  {menu.icon}
                </ListItemIcon>
              )}
              <ListItemText
                primary={
                  <Typography
                    fontWeight={location.pathname === menu.path ? 700 : 400}
                    color={
                      location.pathname === menu.path ? "#5F79D9" : "#7B7B93"
                    }
                  >
                    {menu.label}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        );
      }
      return null;
    });
  };

  // Render
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
          height: "calc(100vh - 64px)",
        }}
      >
        <List sx={{ flexGrow: 1 }}>
          {hasMenus ? (
            Object.entries(orgMenus[0] || {}).map(([section, parents]) => (
              <React.Fragment key={section}>
                {/* Optionally render section header here */}
                {renderMenus(parents as MenuItem[])}
              </React.Fragment>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No menu available for this organization." />
            </ListItem>
          )}
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
