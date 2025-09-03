import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
  Link as MuiLink,
  Grid,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // For internal navigation links
import cruzcampo from "../assets/cruzcampo.png"; // Adjust the path as needed

function Footer() {
  return (
    <AppBar
      position="static"
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: "#24221e",
        padding: { xs: 2, md: 4 },
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar sx={{ flexDirection: "column" }}>
          <Grid container spacing={0} alignItems="flex-start" justifyContent="space-between" wrap="nowrap">
            {/* Sección 1: Información de Boom Bun */}
            <Grid item xs={12} md={4} sx={{ textAlign: { xs: "center", md: "left" }, pl: { md: 4 } }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  mb: 2,
                }}
              >
                BOOM BUN
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#b0b0b0",
                  mb: 2,
                }}
              >
                Disfruta de una experiencia única con la mejor cerveza, tapas y
                un ambiente acogedor.
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: { xs: "center", md: "start" },
                  gap: 1,
                }}
              >
                <IconButton
                  color="inherit"
                  href="https://www.instagram.com/newboom_bun/"
                  target="_blank"
                  sx={{ "&:hover": { color: "#4CAF50" } }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Grid>

            {/* Sección 2: Contacto */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  mb: 2,
                }}
              >
                Localización
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",

                  mb: 1,
                  justifyContent: { xs: "center", md: "start" },
                }}
              >
                <PlaceIcon sx={{ color: "#4CAF50", mr: 1, fontSize: "20px" }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  Av. Juan Pablo II, 22P3, 41702 Dos Hermanas, Sevilla
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  justifyContent: { xs: "center", md: "start" },
                }}
              >
                <RoomServiceIcon
                  sx={{ color: "#4CAF50", mr: 1, fontSize: "20px" }}
                />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  Opciones de servicio: Tiene terraza · Sirve cenas
                </Typography>
              </Box>
            </Grid>

            {/* Sección 3: Cruzcampo */}
            <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  ml: 2
                }}
              >
                Cruzcampo
              </Typography>
              <img src={cruzcampo} alt="Cruzcampo" style={{ maxWidth: "30%", height: "auto", marginTop: -1, marginLeft: 20 }} />
            </Grid>
          </Grid>
          </Toolbar>

          {/* Separador y derechos reservados */}
          <Divider sx={{ borderColor: "#424242", my: 4 }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography
              variant="body2"
              sx={{ color: "#757575", fontSize: "0.875rem" }}
            >
              © {new Date().getFullYear()} Cervecería Boom Bun. Todos los
              derechos reservados.
            </Typography>
          </Box>
        </AppBar>
  );
}

export default Footer;