import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import AwardIcon from "@mui/icons-material/EmojiEvents";
import TimerIcon from "@mui/icons-material/Timer";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import ChevronRight from "@mui/icons-material/ChevronRight";

// Imágenes locales
import pedro3 from "../assets/pedro3.jpg";
import tartessos from "../assets/tartessos.png";
import jamon1 from "../assets/jamon1.jpg";
import jamon2 from "../assets/jamon2.jpg";
import jamon4 from "../assets/jamon4.jpg";
import jamon5 from "../assets/jamon5.jpg";
import jamon6 from "../assets/jamon6.jpg";
import jamon7 from "../assets/jamon7.jpg";
import tartessosLogo from "../assets/tartessosLogo.jpeg";
// Vídeo vertical
import video1 from "../assets/video1.mp4";

const jamonImages = [jamon1, jamon2, jamon4, jamon5, jamon6, jamon7];

export default function JamonSection() {
  const [idx, setIdx] = useState(0);

  // autoplay slider
  useEffect(() => {
    const timer = setInterval(() => {
      setIdx((i) => (i + 1) % jamonImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box>
      {/* 1. Hero */}
      <Box
        sx={{
          height: 500,
          backgroundImage: `url(${tartessos})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
          },
        }}
      >
        <Paper
          elevation={4}
          sx={{
            position: "relative",
            zIndex: 1,
            bgcolor: "rgba(255,255,255,0.9)",
            p: 4,
            textAlign: "center",
            maxWidth: 600,
            mx: 2,
          }}
        >
          <Typography variant="h3" gutterBottom>
            El Arte del{" "}
            <Box component="span" color="error.main">
              Jamón
            </Box>
          </Typography>
          <Typography>Maestría, pasión y tradición en cada loncha</Typography>
        </Paper>
      </Box>

      {/* 2. Sobre Pedro reorganizado */}
      <Box sx={{ backgroundColor: "#fafafa", py: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="flex-start">
            {/* Columna izquierda: foto arriba, texto abajo */}
            <Grid item xs={12} md={7}>
              <Box sx={{ mb: 4 }}>
                <Box
                  component="img"
                  src={pedro3}
                  alt="Pedro cortando jamón"
                  sx={{
                    width: "100%",
                    borderRadius: 2,
                    transition: "transform .5s",
                    "&:hover": { transform: "scale(1.03)" },
                  }}
                />
              </Box>
              <Typography variant="h4" gutterBottom>
                Pedro Luis Linero
              </Typography>
              <Typography paragraph>
                Nuestro maestro cortador, con más de <strong>20 años</strong> de
                experiencia y galardonado internacionalmente, hace de cada
                servicio un espectáculo gourmet.
              </Typography>

              {/* Estadísticas */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <AwardIcon color="error" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">10+</Typography>
                    <Typography variant="caption">Premios</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <TimerIcon color="error" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">20 años</Typography>
                    <Typography variant="caption">Experiencia</Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box textAlign="center">
                    <RestaurantMenuIcon color="error" sx={{ fontSize: 40 }} />
                    <Typography variant="h6">50+</Typography>
                    <Typography variant="caption">Técnicas</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Puntos clave */}
              <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                <Typography component="li">
                  Experto en jamón ibérico 100% de bellota.
                </Typography>
                <Typography component="li">
                  Participante habitual en ferias gastronómicas.
                </Typography>
                <Typography component="li">
                  Formación continua en corte y presentación.
                </Typography>
              </Box>
            </Grid>

            {/* Columna derecha: vídeo vertical */}
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "relative",
                  paddingTop: "177%", // aspecto vertical 9:16
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <video
                  src={video1}
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "auto",
                    height: "100%",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. Galería de platos mejorada con cabecera y aspecto uniforme */}
      <Box sx={{ backgroundColor: "#1E272E", color: "#fff", py: 10 }}>
        <Container maxWidth="lg">
          {/* Línea + Encabezado */}
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Box
              sx={{
                width: 60,
                height: 4,
                backgroundColor: "error.main",
                margin: "0 auto 12px auto",
                borderRadius: 2,
              }}
            />
            <Typography variant="h4" fontWeight="bold">
              Galería de platos
            </Typography>
            <Box
              sx={{
                width: 60,
                height: 4,
                backgroundColor: "error.main",
                margin: "12px auto 0 auto",
                borderRadius: 2,
              }}
            />
          </Box>

          {/* Carrusel */}
          <Box sx={{ position: "relative", maxWidth: 800, mx: "auto" }}>
            {/* Aspect Ratio fijo 16:9 */}
            <Box
              sx={{
                position: "relative",
                width: "100%",
                pt: "56.25%",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#000", // fondo negro por si hay márgenes
                boxShadow: 4,
              }}
            >
              <Box
                component="img"
                src={jamonImages[idx]}
                alt={`Plato ${idx + 1}`}
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "opacity .6s ease-in-out",
                  opacity: 0,
                  animation: "fadeIn .6s forwards",
                  "@keyframes fadeIn": {
                    to: { opacity: 1 },
                  },
                }}
              />
            </Box>

            {/* Caption */}
            <Typography
              variant="subtitle2"
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
                bgcolor: "rgba(0,0,0,0.6)",
                px: 2,
                py: 0.5,
                borderRadius: 1,
                fontStyle: "italic",
                fontSize: 14,
              }}
            >
              {`Plato ${idx + 1} de ${jamonImages.length}`}
            </Typography>

            {/* Flechas */}
            <IconButton
              onClick={() =>
                setIdx((i) => (i - 1 + jamonImages.length) % jamonImages.length)
              }
              sx={{
                position: "absolute",
                top: "50%",
                left: 8,
                transform: "translateY(-50%)",
                bgcolor: "error.main",
                boxShadow: 3,
                "&:hover": { bgcolor: "error.dark" },
                color: "#fff",
              }}
            >
              <ChevronLeft />
            </IconButton>
            <IconButton
              onClick={() => setIdx((i) => (i + 1) % jamonImages.length)}
              sx={{
                position: "absolute",
                top: "50%",
                right: 8,
                transform: "translateY(-50%)",
                bgcolor: "error.main",
                boxShadow: 3,
                "&:hover": { bgcolor: "error.dark" },
                color: "#fff",
              }}
            >
              <ChevronRight />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* 4. Tartessos */}
      <Box sx={{ backgroundColor: "#fff5f5", py: 10 }}>
        <Container maxWidth="sm" sx={{ textAlign: "center" }}>
          <Box
            component="img"
            src={tartessosLogo}
            alt="Logo Tartessos"
            sx={{
              width: 140,
              mb: 3,
              mx: "auto",
              borderRadius: 2,
              boxShadow: 3,
            }}
          />

          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            La Excelencia de Tartessos
          </Typography>

          <Box
            sx={{
              width: 60,
              height: 4,
              backgroundColor: "error.main",
              margin: "0 auto 24px auto",
              borderRadius: 2,
            }}
          />

          <Typography variant="body1" sx={{ fontSize: 18, color: "#4a4a4a" }}>
            Con tradición centenaria y curación impecable,
            <br />
            Tartessos ofrece el jamón ibérico más refinado.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
