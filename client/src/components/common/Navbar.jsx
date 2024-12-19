import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import logo from "../../assets/logo.svg";
import styles from "./styles/Navbar.module.css";

const settings = ["Profile", "Cart", "Wishlist", "My Books", "Logout"];

export default function Navbar() {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const navigateToPage = (setting) => {
    switch (setting) {
      case "Profile":
        navigate("/profile");
        break;
      case "Cart":
        navigate("/cart");
        break;
      case "Wishlist":
        navigate("/wishlist");
        break;
      case "My Books":
        navigate("/my-books");
        break;
      case "Logout":
        console.log("Logging out...");
        handleLogout();
        break;
      default:
        console.error(`Unknown setting: ${setting}`);
    }
  };

  useEffect(() => {
    const queryParams = searchParams.get("query");
    if (queryParams) {
      setSearchTerm(decodeURIComponent(queryParams));
    }
  }, [searchParams]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearching(true);
      try {
        navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
      } catch (error) {
        console.error("Error navigating:", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className={styles.navbar}>
        <Toolbar>
          {/* Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Box
              component="img"
              src={logo}
              alt="logo"
              sx={{ height: 40, width: "auto", mr: 1, borderRadius: "50%" }}
            />
            <Typography variant="h6" component="div">
              FlipIt
            </Typography>
          </Box>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{ flexGrow: 1 }}>
            <div className={styles.searchContainer}>
              <div className={styles.searchIconWrapper}>
                <SearchIcon />
              </div>
              <InputBase
                className={styles.searchInput}
                placeholder="Search by title or author..."
                inputProps={{ "aria-label": "search" }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={isSearching}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSearching || !searchTerm.trim()}
                sx={{ ml: 2 }}
              >
                {isSearching ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </form>

          {/* User Avatar and Menu */}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt="User Avatar" src="/path/to/avatar.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu(); // Close the menu
                  navigateToPage(setting); // Navigate to the selected page
                }}
              >
                <Typography>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
