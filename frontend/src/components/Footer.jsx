import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Divider,
  Link as MuiLink,
} from "@mui/material";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import RoomServiceIcon from "@mui/icons-material/RoomService";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom"; // For internal navigation links

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
        <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
          <div className="row g-4">
            {/* Sección 1: Información de Boom Bun */}
            <div className="col-12 col-md-4 text-center text-md-start">
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
            </div>

            {/* Sección 2: Contacto */}
            <div className="col-12 col-md-4 text-center text-md-start">
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
            </div>

            {/* Sección 3: Horario */}
            <div className="col-12 col-md-4 text-center text-md-start">
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "#ffffff",
                  mb: 2,
                }}
              >
                Horario
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
                Lunes: Cerrado
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
                Martes: 12:00–17:30
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0", mb: 1 }}>
                Miércoles - Domingo: 12:00–24:00
              </Typography>
            </div>
          </div>

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
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;