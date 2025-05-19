import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Container,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  AccountCircle,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

function AppMenu() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [authState, setAuthState] = useState(() => {
    const authData = localStorage.getItem("auth");
    return authData
      ? JSON.parse(authData)
      : { isAuthenticated: false, user: null };
  });

  const menuItems = ["Inicio", "Carta", "Jamón", "Reseñas"];

  useEffect(() => {
    const syncAuthState = () => {
      const prevAuth = authState.isAuthenticated;
      const authData = localStorage.getItem("auth");
      const newAuthState = authData
        ? JSON.parse(authData)
        : { isAuthenticated: false, user: null };

      setAuthState(newAuthState);

      if (!prevAuth && newAuthState.isAuthenticated) {
        setWelcomeMessage(`¡Bienvenido/a ${newAuthState.user?.nombre}!`);
      }
    };

    window.addEventListener("storage", syncAuthState);
    return () => window.removeEventListener("storage", syncAuthState);
  }, [authState.isAuthenticated]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("auth");
      document.cookie =
        "token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      window.dispatchEvent(new Event("storage"));
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
    } finally {
      handleMenuClose();
    }
  };

  const handleCloseWelcome = () => {
    setWelcomeMessage("");
  };

  const menuRoutes = {
    Inicio: "/",
    Carta: "/carta",
    Jamón: "/jamon",
    Reseñas: "/resena",
    Contacto: "/contacto",
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" sx={{ bgcolor: "white", borderBottom: "2px solid black" }}>
        <Container maxWidth="lg">
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link
                to="/"
                style={{
                  color: "white",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src={logo}
                  alt="Logo Boom Bun"
                  style={{ height: "40px", marginRight: "8px" }}
                />
                <Typography variant="h6" style={{ color: "black" }}>
                  Boom Bun
                </Typography>
              </Link>
            </Box>

            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                justifyContent: "center",
                flexGrow: 1,
                gap: 2,
              }}
            >
              {menuItems.map((item) => (
                <Link
                  key={item}
                  to={menuRoutes[item]}
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <Typography
                    sx={{
                      mx: 1,
                      fontSize: "1rem",
                      "&:hover": { color: "#065f46" },
                    }}
                  >
                    {item}
                  </Typography>
                </Link>
              ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="large"
                onClick={handleMenuOpen}
                color="inherit"
                aria-label="menu-usuario"
                style={{ color: "black" }}
              >
                {authState.isAuthenticated ? (
                  <>
                    <Typography
                      variant="body1"
                      sx={{ mr: 1, display: { xs: "none", md: "block" } }}
                    >
                      {authState.user?.nombre}
                    </Typography>
                    <AccountCircle fontSize="large" />
                  </>
                ) : (
                  <AccountCircle fontSize="large" />
                )}
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                PaperProps={{
                  sx: {
                    bgcolor: "#1E272E",
                    color: "white",
                    "& .MuiMenuItem-root:hover": { backgroundColor: "#065f46" },
                  },
                }}
              >
                {authState.isAuthenticated
                  ? [
                      <MenuItem
                        key="profile"
                        onClick={() => {
                          handleMenuClose();
                          navigate("/perfil");
                        }}
                      >
                        Mi Perfil
                      </MenuItem>,
                      <MenuItem key="logout" onClick={handleLogout}>
                        Cerrar Sesión
                      </MenuItem>,
                    ]
                  : [
                      <MenuItem
                        key="login"
                        onClick={() => {
                          handleMenuClose();
                          navigate("/login");
                        }}
                      >
                        Iniciar Sesión
                      </MenuItem>,
                      <MenuItem
                        key="register"
                        onClick={() => {
                          handleMenuClose();
                          navigate("/register");
                        }}
                      >
                        Registrarse
                      </MenuItem>,
                    ]}
              </Menu>

              <IconButton
                sx={{ display: { xs: "flex", md: "none" }, color: "black" }}
                onClick={() => setIsDrawerOpen(true)}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      >
        <Box
          sx={{
            width: 250,
            bgcolor: "#1E272E",
            height: "100%",
            color: "white",
          }}
          role="presentation"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              p: 1,
            }}
          >
            <IconButton sx={{ color: "white" }} onClick={() => setIsDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item}
                component={Link}
                to={menuRoutes[item]}
                onClick={() => setIsDrawerOpen(false)}
                sx={{ "&:hover": { backgroundColor: "#065f46" } }}
              >
                <ListItemText sx={{ color: "white" }} primary={item} />
              </ListItem>
            ))}
            {authState.isAuthenticated
              ? [
                  <ListItem
                    button
                    key="profile"
                    component={Link}
                    to="/perfil"
                    onClick={() => setIsDrawerOpen(false)}
                    sx={{ "&:hover": { backgroundColor: "#065f46" } }}
                  >
                    <ListItemText sx={{ color: "white" }} primary="Mi Perfil" />
                  </ListItem>,
                  <ListItem
                    button
                    key="logout"
                    onClick={handleLogout}
                    sx={{ "&:hover": { backgroundColor: "#065f46" } }}
                  >
                    <ListItemText sx={{ color: "white" }} primary="Cerrar Sesión" />
                  </ListItem>,
                ]
              : [
                  <ListItem
                    button
                    key="login"
                    component={Link}
                    to="/login"
                    onClick={() => setIsDrawerOpen(false)}
                    sx={{ "&:hover": { backgroundColor: "#065f46" } }}
                  >
                    <ListItemText sx={{ color: "white" }} primary="Iniciar Sesión" />
                  </ListItem>,
                  <ListItem
                    button
                    key="register"
                    component={Link}
                    to="/register"
                    onClick={() => setIsDrawerOpen(false)}
                    sx={{ "&:hover": { backgroundColor: "#065f46" } }}
                  >
                    <ListItemText sx={{ color: "white" }} primary="Registrarse" />
                  </ListItem>,
                ]}
          </List>
        </Box>
      </Drawer>

      <Snackbar
        open={!!welcomeMessage}
        autoHideDuration={3000}
        onClose={handleCloseWelcome}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseWelcome}
          severity="success"
          sx={{ width: "100%", bgcolor: "#065f46", color: "white" }}
        >
          {welcomeMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default AppMenu;