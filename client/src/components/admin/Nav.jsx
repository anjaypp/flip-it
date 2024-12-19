import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import './style/nav.css';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import "./style/Navbar.css";

const SidebarMenu = () => {
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Media query to check if the screen is large
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const navLinks = [
    { to: "/ebook-management", text: "Ebook Management" },
    { to: "/order-monitoring", text: "Order Monitoring" },
    { to: "/user-management", text: "User Management" },
    { to: "/logout", text: "Logout" },
  ];

  const isActive = (path) => location.pathname === path;

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <div>
      {/* Menu Button for Mobile View */}
      {!isLargeScreen && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer}
          className="menu-button"
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar Drawer */}
      <Drawer
        anchor="left"
        open={isLargeScreen || isDrawerOpen} // Always open on large screens
        onClose={toggleDrawer}
        variant={isLargeScreen ? "permanent" : "temporary"} // Permanent on large screens
        classes={{ paper: "drawer-paper" }}
      >
        <Box className="drawer-header">
          <Typography variant="h6" className="drawer-title">
            flipit
          </Typography>
          {!isLargeScreen && (
            <IconButton onClick={toggleDrawer}>
              <CloseIcon />
            </IconButton>
          )}
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem
              button
              key={link.to}
              className={`list-item ${isActive(link.to) ? "active-item" : ""}`}
              onClick={!isLargeScreen ? toggleDrawer : undefined}
            >
              <Link to={link.to} className="nav-link">
                <ListItemText primary={link.text} />
              </Link>
            </ListItem>
          ))}
        </List>
      </Drawer>
    </div>
  );
};

export default SidebarMenu;