import React, { useState, useEffect } from "react";
import jwt from "jsonwebtoken";
import {
  Box,
  Drawer,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SpaceDashboardIcon from "@mui/icons-material/SpaceDashboard";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Overview from "../components/dashboard/overview";
import Client from "../components/dashboard/client";
import Inventory from "../components/dashboard/inventory";

const DASHBOARD_SECTIONS = {
  OVERVIEW: { label: `Overview`, requiresAdmin: false },
  CLIENT: { label: `Client`, requiresAdmin: true },
  INVENTORY: { label: `Inventory`, requiresAdmin: false },
  PRODUCT: { label: `Product`, requiresAdmin: false },
};

function Dashboard(props) {
  const [username, setUsername] = useState("");
  const [open, setOpen] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accessLevel, setAccessLevel] = useState(0);
  const drawerWidth = 240;
  const { window } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwt.decode(token);
        setUsername(decodedToken.username);
        setAccessLevel(decodedToken.accessLevel);
      } catch (error) {
        console.error(error);
        localStorage.removeItem("token");
        document.location.href = "/login";
      }
    } else {
      document.location.href = "/login";
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("token");
    if (typeof document !== "undefined") {
      document.location.href = "/login";
    }
  }

  const container =
    window !== undefined ? () => window().document.body : undefined;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const sectionIcon = (section) => {
    switch (section) {
      case DASHBOARD_SECTIONS.OVERVIEW.label:
        return <SpaceDashboardIcon />;
      case DASHBOARD_SECTIONS.CLIENT.label:
        return <AccountBoxIcon />;
      case DASHBOARD_SECTIONS.INVENTORY.label:
        return <InventoryIcon />;
      case DASHBOARD_SECTIONS.PRODUCT.label:
        return <ShoppingCartCheckoutIcon />;
    }
  };

  const loadSection = (section) => {
    switch (section) {
      case DASHBOARD_SECTIONS.OVERVIEW.label:
        return <Overview />;
      case DASHBOARD_SECTIONS.CLIENT.label:
        return <Client />;
      case DASHBOARD_SECTIONS.INVENTORY.label:
        return <Inventory />;
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <List>
        {Object.keys(DASHBOARD_SECTIONS).map((key) => {
          const section = DASHBOARD_SECTIONS[key];
          if (
            (section.requiresAdmin && accessLevel == 1) ||
            !section.requiresAdmin
          )
            return (
              <ListItem key={section.label} disablePadding>
                <ListItemButton onClick={() => setOpen(section.label)}>
                  <ListItemIcon>{sectionIcon(section.label)}</ListItemIcon>
                  <ListItemText primary={section.label} />
                </ListItemButton>
              </ListItem>
            );
        })}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            background: `linear-gradient(60deg, #3383FF, #176EF6)`,
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {open}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="subtitle2" noWrap component="div">
              {username}
            </Typography>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => handleLogout()}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: `100vh`,
        }}
      >
        <Toolbar />
        {loadSection(open)}
      </Box>
    </Box>
  );
}

export default Dashboard;
