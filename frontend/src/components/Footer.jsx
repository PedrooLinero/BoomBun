import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place"; // Para el ícono de ubicación
import PhoneIcon from "@mui/icons-material/Phone"; // Para el ícono de teléfono
import EmailIcon from "@mui/icons-material/Email"; // Para el ícono de correo
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap para el grid y estilos

function Footer() {
  return (
    <AppBar
      position="static"
      sx={{
        top: "auto",
        bottom: 0,
        backgroundColor: "#24221e", // Fondo oscuro similar al original
        padding: { xs: 2, md: 4 }, // Padding responsivo
        boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.3)",
      }}
    >
      <Toolbar sx={{ flexDirection: "column" }}>
        {/* Contenedor principal con grid de Bootstrap */}
        <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto" }}>
          <div className="row g-4"> {/* Usamos el grid de Bootstrap */}
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
                  color: "#b0b0b0", // Gris claro para el texto
                  mb: 2,
                }}
              >
                El lugar perfecto para disfrutar de las mejores cervezas artesanales y un ambiente único.
              </Typography>
              <Box sx={{ display: "flex", justifyContent: { xs: "center", md: "start" }, gap: 1 }}>
                <IconButton
                  color="inherit"
                  href="https://www.facebook.com"
                  target="_blank"
                  sx={{ "&:hover": { color: "#4CAF50" } }} // Verde al pasar el mouse
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://www.instagram.com"
                  target="_blank"
                  sx={{ "&:hover": { color: "#4CAF50" } }}
                >
                  <InstagramIcon />
                </IconButton>
                <IconButton
                  color="inherit"
                  href="https://www.twitter.com"
                  target="_blank"
                  sx={{ "&:hover": { color: "#4CAF50" } }}
                >
                  <TwitterIcon />
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
                Contacto
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: { xs: "center", md: "start" } }}>
                <PlaceIcon sx={{ color: "#4CAF50", mr: 1, fontSize: "20px" }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  Calle Principal 123, Ciudad
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: { xs: "center", md: "start" } }}>
                <PhoneIcon sx={{ color: "#4CAF50", mr: 1, fontSize: "20px" }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  +34 123 456 789
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: { xs: "center", md: "start" } }}>
                <EmailIcon sx={{ color: "#4CAF50", mr: 1, fontSize: "20px" }} />
                <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                  info@boombun.com
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
                Lunes - Jueves: 16:00 - 00:00
              </Typography>
              <Typography variant="body2" sx={{ color: "#b0b0b0" }}>
                Viernes - Domingo: 16:00 - 02:00
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
              © {new Date().getFullYear()} Cervecería Boom Bun. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;