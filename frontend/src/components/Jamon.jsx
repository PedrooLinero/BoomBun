import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Divider,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { ChevronRight, ChevronLeft } from "@mui/icons-material";

const pedroImage1 =
  "https://images.unsplash.com/photo-1571167366136-b57e07761625?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80";

const jamonImages = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    alt: "Jamón cortado finamente",
    caption: "Corte perfecto de jamón ibérico",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1625938145744-533e96b610be?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    alt: "Tabla de chacinas",
    caption: "Selección de embutidos premium",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1632487279342-56f219a88c08?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    alt: "Detalle de lonchas",
    caption: "Arte en cada loncha",
  },
];

function JamonSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const timeoutRef = useRef(null);
  
    const resetTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  
    useEffect(() => {
      resetTimeout();
      timeoutRef.current = setTimeout(() => {
        setActiveIndex((prevIndex) => (prevIndex === jamonImages.length - 1 ? 0 : prevIndex + 1));
      }, 4000);
      return () => resetTimeout();
    }, [activeIndex]);
  
    const handleNext = () => {
      resetTimeout();
      setActiveIndex((prev) => (prev + 1) % jamonImages.length);
    };
  
    const handlePrev = () => {
      resetTimeout();
      setActiveIndex((prev) => (prev === 0 ? jamonImages.length - 1 : prev - 1));
    };
  
    const activeImage = jamonImages[activeIndex];
  
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  
    return (
      <Box>
        {/* Header con fondo blanco y texto negro para variar */}
        <Box sx={{ backgroundColor: "#fff", py: 6 }}>
          <Container maxWidth="lg">
            <Box sx={{ textAlign: "center", mb: 6, position: "relative" }}>
              <Divider
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  right: 0,
                  bgcolor: "transparent",
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: "1px",
                    bgcolor: "grey.400",
                  },
                }}
              />
              <Typography
                variant={isDesktop ? "h1" : "h3"}
                component="h1"
                sx={{
                  display: "inline-block",
                  bgcolor: "#fff",
                  px: 2,
                  position: "relative",
                  zIndex: 1,
                  fontWeight: 900,
                  color: "#1E272E",
                }}
              >
                El Arte del <Box component="span" sx={{ color: "error.main" }}>Jamón</Box>
              </Typography>
            </Box>
            <Typography
              variant={isDesktop ? "h5" : "body1"}
              align="center"
              sx={{ fontStyle: "italic", color: "grey.700", mb: 8 }}
            >
              "La perfección está en el detalle, y cada corte es una expresión de pasión y tradición."
            </Typography>
          </Container>
        </Box>
  
        {/* Sección Maestro Cortador con fondo gris claro */}
        <Box sx={{ backgroundColor: "#f7f7f7", py: 8 }}>
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              <Grid item xs={12} md={6}>
                <Paper elevation={4} sx={{ overflow: "hidden", borderRadius: 3 }}>
                  <Box sx={{ position: "relative" }}>
                    <Box
                      component="img"
                      src={pedroImage1}
                      alt="Pedro cortando jamón"
                      sx={{
                        width: "100%",
                        height: isDesktop ? 450 : 300,
                        objectFit: "cover",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        p: 2,
                        bgcolor: "rgba(0,0,0,0.6)",
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ color: "error.light" }}>
                        Maestro Cortador Certificado
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="h3" sx={{ fontWeight: "bold", mb: 3, color: "#1E272E" }}>
                  Pedro Luis Linero
                </Typography>
                <Typography sx={{ mb: 3, fontSize: isDesktop ? 18 : 14 }}>
                  Maestro cortador de jamón con más de 20 años de experiencia, patrocinado por <Box component="span" sx={{ color: "error.light", fontWeight: "bold" }}>Tartessos</Box>.
                </Typography>
                <Typography sx={{ fontSize: isDesktop ? 16 : 14 }}>
                  La precisión del corte, el grosor perfecto y la presentación inmaculada son el sello de un verdadero artesano.
                </Typography>
              </Grid>
            </Grid>
          </Container>
        </Box>
  
        {/* Carrusel con fondo oscuro para contraste */}
        <Box sx={{ backgroundColor: "#1E272E", color: "#E0E0E0", py: 8 }}>
          <Container maxWidth="md" sx={{ textAlign: "center" }}>
            <Typography variant={isDesktop ? "h4" : "h5"} sx={{ fontWeight: "bold", mb: 2 }}>
              Nuestra Selección <Box component="span" sx={{ color: "error.main" }}>Premium</Box>
            </Typography>
            <Typography sx={{ color: "grey.300", mb: 4, fontSize: isDesktop ? 18 : 14 }}>
              Descubra nuestra selección de jamones y embutidos de la más alta calidad.
            </Typography>
  
            <Box
              component="img"
              src={activeImage.src}
              alt={activeImage.alt}
              sx={{
                width: "100%",
                height: isDesktop ? 450 : 300,
                objectFit: "cover",
                borderRadius: 3,
                boxShadow: 4,
                mb: 2,
                userSelect: "none",
              }}
              draggable={false}
            />
  
            <Typography
              variant="subtitle1"
              sx={{ color: "grey.400", fontStyle: "italic", mb: 4, fontSize: isDesktop ? 16 : 12 }}
            >
              {activeImage.caption}
            </Typography>
  
            <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
              <IconButton
                onClick={handlePrev}
                aria-label="imagen anterior"
                sx={{
                  bgcolor: "error.main",
                  "&:hover": { bgcolor: "error.dark" },
                  color: "white",
                  width: 48,
                  height: 48,
                }}
              >
                <ChevronLeft />
              </IconButton>
              <IconButton
                onClick={handleNext}
                aria-label="imagen siguiente"
                sx={{
                  bgcolor: "error.main",
                  "&:hover": { bgcolor: "error.dark" },
                  color: "white",
                  width: 48,
                  height: 48,
                }}
              >
                <ChevronRight />
              </IconButton>
            </Box>
          </Container>
        </Box>
  
        {/* Sección final con fondo blanco y bordes */}
        <Box sx={{ backgroundColor: "#fff", py: 6 }}>
          <Container maxWidth="lg">
            <Box
              sx={{
                borderRadius: 3,
                p: 4,
                borderLeft: "6px solid",
                borderColor: "success.main",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                alignItems: "center",
                justifyContent: "space-between",
                gap: 3,
              }}
            >
              <Box sx={{ flex: 2 }}>
                <Typography variant={isDesktop ? "h4" : "h5"} fontWeight="bold" color="text.primary" mb={2}>
                  La Excelencia de Tartessos
                </Typography>
                <Typography color="text.secondary" fontSize={isDesktop ? 16 : 14}>
                  Tartessos representa la excelencia en el mundo del jamón ibérico. Con
                  una tradición centenaria en la cría de cerdos ibéricos y un proceso de
                  curación meticuloso, cada pieza es una joya gastronómica que refleja el
                  terroir único de su origen.
                </Typography>
              </Box>
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    width: 128,
                    height: 128,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #064e3b, #047857)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="common.white"
                    sx={{ userSelect: "none" }}
                  >
                    TARTESSOS
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Container>
        </Box>
      </Box>
    );
  }
  
  export default JamonSection;
