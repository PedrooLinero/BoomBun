import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Container,
  IconButton,
  Grid,
  Divider,
  Fade,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Link } from "react-router-dom";
import PlaceIcon from "@mui/icons-material/Place";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import StarIcon from "@mui/icons-material/Star";

import foto2 from "../assets/foto2.JPG";
import foto1 from "../assets/foto1.JPG";
import foto3 from "../assets/foto3.JPG";
import foto5 from "../assets/foto5.JPG";
import foto8 from "../assets/foto8.JPG";
import logo from "../assets/logo.jpg";

const photos = [
  {
    id: 1,
    url: foto1,
    alt: "Cerveza artesanal servida en barra",
  },
  {
    id: 2,
    url: foto3,
    alt: "Selección de cervezas artesanales",
  },
  {
    id: 3,
    url: foto5,
    alt: "Hamburguesa gourmet con cerveza",
  },
  {
    id: 4,
    url: foto8,
    alt: "Ambiente del bar por la noche",
  },
];

function HomeContent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [horario, setHorario] = useState(() => {
    // Intentar cargar el horario guardado
    const saved = localStorage.getItem("horarioBar");
    return saved || "Lunes a Domingo: 12:00 - 23:00";
  });
  const [isJefe, setIsJefe] = useState(false);
  const [openHorarioModal, setOpenHorarioModal] = useState(false);
  const [horarioDias, setHorarioDias] = useState(() => {
    // Intentar cargar el horario por días guardado
    const saved = localStorage.getItem("horarioBarDias");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Si hay error, usar valores por defecto
      }
    }
    return {
      Lunes: { abierto: true, inicio: "12:00", fin: "23:00" },
      Martes: { abierto: true, inicio: "12:00", fin: "23:00" },
      Miércoles: { abierto: true, inicio: "12:00", fin: "23:00" },
      Jueves: { abierto: true, inicio: "12:00", fin: "23:00" },
      Viernes: { abierto: true, inicio: "12:00", fin: "23:00" },
      Sábado: { abierto: true, inicio: "12:00", fin: "23:00" },
      Domingo: { abierto: true, inicio: "12:00", fin: "23:00" },
    };
  });

  const horas = [
    "Cerrado",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
    "24:00",
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + photos.length) % photos.length
    );
  };

  // Manejo de apertura y cierre del modal de horario
  const handleOpenHorarioModal = () => setOpenHorarioModal(true);
  const handleCloseHorarioModal = () => setOpenHorarioModal(false);

  // Manejo de cambios en los días del horario
  const handleHorarioDiaChange = (dia, campo, valor) => {
    // Actualizar el estado de los días del horario
    setHorarioDias((prev) => ({
      // ...prev sirve para mantener el estado anterior
      ...prev,
      [dia]: {
        ...prev[dia],
        [campo]: valor,
        abierto:
          campo === "inicio" || campo === "fin"
            ? valor !== "Cerrado"
            : prev[dia].abierto,
      },
    }));
  };

  const handleGuardarHorario = () => {
    // Construir string resumen
    const resumen = Object.entries(horarioDias)
      .map(([dia, datos]) =>
        datos.abierto
          ? `${dia}: ${datos.inicio} - ${datos.fin}`
          : `${dia}: Cerrado`
      )
      .join(" / ");
    setHorario(resumen);
    // Guardar en localStorage
    localStorage.setItem("horarioBar", resumen);
    localStorage.setItem("horarioBarDias", JSON.stringify(horarioDias));
    setOpenHorarioModal(false);
  };

  useEffect(() => {
    const authData = localStorage.getItem("auth");
    if (authData) {
      try {
        const { isAuthenticated, user } = JSON.parse(authData);
        const tipo = user?.tipo || user?.Tipo || "";
        setIsJefe(isAuthenticated && user && tipo.toLowerCase() === "jefe");
      } catch {
        setIsJefe(false);
      }
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Fade in timeout={1000}>
      <Box sx={{ backgroundColor: "#1E272E" }}>
        {/* Hero Section */}
        <Box
          sx={{
            height: { xs: "400px", md: "500px" },
            width: "100%",
            position: "relative",
            backgroundImage: `url(${foto2})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
            },
          }}
        >
          <Container
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              zIndex: 2,
              color: "white",
              textAlign: "center",
              px: { xs: 2, md: 4 },
            }}
          >
            <Typography
              variant="h2"
              component="h1"
              gutterBottom
              sx={{
                fontSize: { xs: "2.5rem", md: "3.75rem" },
                fontWeight: 900,
              }}
            >
              Cervecería Boom Bun
            </Typography>
            <Typography
              variant="h5"
              sx={{
                maxWidth: "md",
                mb: 4,
                fontSize: { xs: "1.25rem", md: "1.5rem" },
                color: "#E0E0E0",
              }}
            >
              Disfruta de una experiencia única con la mejor cerveza, tapas y un
              ambiente acogedor.
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                component={Link}
                to="/carta"
                sx={{
                  backgroundColor: "#065f46",
                  "&:hover": { backgroundColor: "#047857" },
                }}
              >
                Ver Carta
              </Button>
            </Box>
          </Container>
        </Box>

        {/* About Section */}
        <Box sx={{ py: 8, backgroundColor: "white", color: "#E0E0E0" }}>
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              {/* Imagen */}
              <Grid item xs={12} lg={6}>
                <CardMedia
                  component="img"
                  image={logo}
                  alt="Cervecería Boom Bun"
                  sx={{
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                    width: "80%",
                    height: "auto",
                    maxHeight: "300px",
                    objectFit: "contain",
                    margin: "0 auto",
                  }}
                />
              </Grid>
              {/* Texto y datos */}
              <Grid item xs={12} lg={6}>
                <Typography
                  variant="h3"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    mb: 3,
                    color: "black",
                    textAlign: { xs: "center", lg: "left" },
                  }}
                >
                  Sobre Nosotros
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",
                    mb: 3,
                    textAlign: { xs: "center", lg: "left" },
                    fontSize: "1.1rem",
                  }}
                >
                  Cervecería Boom Bun es el destino ideal para los amantes de la
                  buena cerveza Cruzcampo y el tapeo más auténtico. Nuestro bar
                  fusiona la pasión por la mejor cerveza con una selección de
                  tapas irresistibles, creando un ambiente acogedor y moderno
                  donde disfrutar de una experiencia gastronómica única. ¡Ven a
                  saborear la tradición con un toque contemporáneo!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "black",
                    mb: 4,
                    textAlign: { xs: "center", lg: "left" },
                    fontSize: "1.1rem",
                  }}
                >
                  Disfruta del auténtico sabor de los jamones Tartessos,
                  cortados en el momento por Pedro Luis Linero, cortador
                  profesional de jamón y alma del sabor en nuestro bar.
                </Typography>
                <Box sx={{ textAlign: { xs: "center", lg: "left" } }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: { xs: "center", lg: "start" },
                    }}
                  >
                    <PlaceIcon
                      sx={{ color: "#065f46", mr: 1, fontSize: "24px" }}
                    />
                    <Typography variant="body2" sx={{ color: "black" }}>
                      Av. Juan Pablo II, 22P3, 41702 Dos Hermanas, Sevilla
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 2,
                      justifyContent: { xs: "center", lg: "start" },
                    }}
                  >
                    <AccessTimeIcon
                      sx={{ color: "#065f46", mr: 1, fontSize: "24px" }}
                    />
                    <Box>
                      <Typography variant="h6" sx={{ mb: 2, color: "#065f46", fontWeight: "bold" }}>
                        Horario del Bar:
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          mb: 2,
                          color: "#065f46",
                        }}
                      >
                        {horario}
                      </Typography>
                      {isJefe && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={handleOpenHorarioModal}
                          sx={{
                              backgroundColor: "#065f46",
                              "&:hover": { backgroundColor: "#047857" },
                            }}
                        >
                          Editar horario
                        </Button>
                      )}
                      <Dialog
                        open={openHorarioModal}
                        onClose={handleCloseHorarioModal}
                      >
                        <DialogTitle
                          sx={{ textAlign: "center", color: "#065f46" }}
                        >
                          Editar horario del bar
                        </DialogTitle>
                        <DialogContent>
                          {Object.entries(horarioDias).map(([dia, datos]) => (
                            <Box
                              key={dia}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                mb: 2,
                              }}
                            >
                              <Typography sx={{ minWidth: 90 }}>
                                {dia}
                              </Typography>
                              <FormControl
                                size="small"
                                sx={{ minWidth: 90, marginTop: 1 }}
                              >
                                <InputLabel>Inicio</InputLabel>
                                <Select
                                  value={
                                    datos.abierto ? datos.inicio : "Cerrado"
                                  }
                                  label="Inicio"
                                  onChange={(e) =>
                                    handleHorarioDiaChange(
                                      dia,
                                      "inicio",
                                      e.target.value
                                    )
                                  }
                                >
                                  {horas.map((h) => (
                                    <MenuItem key={h} value={h}>
                                      {h}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                              <FormControl size="small" sx={{ minWidth: 90, marginTop: 1 }}>
                                <InputLabel>Fin</InputLabel>
                                <Select
                                  value={datos.abierto ? datos.fin : "Cerrado"}
                                  label="Fin"
                                  onChange={(e) =>
                                    handleHorarioDiaChange(
                                      dia,
                                      "fin",
                                      e.target.value
                                    )
                                  }
                                  disabled={datos.inicio === "Cerrado"}
                                >
                                  {horas
                                    .filter((h) => h !== "Cerrado")
                                    .map((h) => (
                                      <MenuItem key={h} value={h}>
                                        {h}
                                      </MenuItem>
                                    ))}
                                </Select>
                              </FormControl>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={!datos.abierto}
                                    onChange={(e) =>
                                      handleHorarioDiaChange(dia, "inicio", e.target.checked ? "Cerrado" : "12:00")
                                    }
                                    sx={{
                                      color: "#065f46", // color primario MUI
                                      '&.Mui-checked': {
                                        color: "#065f46",
                                      },
                                    }}
                                  />
                                }
                                label="Cerrado"
                              />
                            </Box>
                          ))}
                        </DialogContent>
                        <DialogActions>
                          <Button onClick={handleCloseHorarioModal} sx={{ color: "#065f46" }}>
                            Cancelar
                          </Button>
                          <Button
                            onClick={handleGuardarHorario}
                            variant="contained"
                            sx={{
                              backgroundColor: "#065f46",
                              "&:hover": { backgroundColor: "#047857" },
                            }}
                          >
                            Guardar
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Photo Carousel Section */}
        <Box sx={{ py: 8, backgroundColor: "#1E272E", color: "#E0E0E0" }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: "bold",
                mb: 6,
                textAlign: "center",
                color: "#ffffff",
              }}
            >
              Nuestro Rincón
            </Typography>
            <Box sx={{ position: "relative", maxWidth: "800px", mx: "auto" }}>
              <Box
                sx={{
                  overflow: "hidden",
                  borderRadius: "12px",
                  height: { xs: "300px", md: "400px" },
                  position: "relative",
                }}
              >
                {photos.map((photo, index) => (
                  <Box
                    key={photo.id}
                    sx={{
                      position: "absolute",
                      width: "100%",
                      height: "100%",
                      transition: "opacity 500ms ease-in-out",
                      opacity: index === currentIndex ? 1 : 0,
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={photo.url}
                      alt={photo.alt}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Box>
                ))}
              </Box>
              {/* Botones de navegación */}
              <IconButton
                onClick={prevSlide}
                sx={{
                  position: "absolute",
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={nextSlide}
                sx={{
                  position: "absolute",
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
              {/* Indicadores de carrusel */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: "16px",
                  left: 0,
                  right: 0,
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                {photos.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    sx={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor:
                        index === currentIndex
                          ? "white"
                          : "rgba(255, 255, 255, 0.5)",
                      cursor: "pointer",
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    </Fade>
  );
}

export default HomeContent;
