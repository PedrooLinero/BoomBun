import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Fade,
  Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import { apiUrl } from "../pages/config";
import { useNavigate } from "react-router-dom";

const isAuthenticated = () => {
  const authData = localStorage.getItem("auth");
  if (authData) {
    const { isAuthenticated } = JSON.parse(authData);
    return isAuthenticated;
  }
  return false;
};

function Resena() {
  const [reseñas, setReseñas] = useState([]);
  const [filteredReseñas, setFilteredReseñas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newReseña, setNewReseña] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auth, setAuth] = useState(isAuthenticated());
  const navigate = useNavigate();

  useEffect(() => {
    async function getResenas() {
      try {
        setLoading(true);
        const response = await fetch(apiUrl + "/resenas", {
          method: "GET",
          headers: {
            "Accept": "application/json",
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.ok) {
            setReseñas(data.datos || []);
            setFilteredReseñas(data.datos || []);
          } else {
            setError("Error en la respuesta: " + data.mensaje);
          }
        } else {
          setError("Error al obtener las reseñas. Código: " + response.status);
        }
      } catch (err) {
        setError("Error en la solicitud: " + err.message);
      } finally {
        setLoading(false);
      }
    }
    getResenas();
  }, []);

  useEffect(() => {
    const filtered = reseñas.filter((reseña) =>
      reseña.texto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reseña.usuario?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredReseñas(filtered);
  }, [searchTerm, reseñas]);

  const handleSubmitReseña = async () => {
    if (!newReseña.trim()) return;

    try {
      const response = await fetch(apiUrl + "/resenas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ texto: newReseña }),
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ok) {
          setReseñas([...reseñas, data.datos]);
          setNewReseña("");
        } else {
          setError("Error al añadir la reseña: " + data.mensaje);
        }
      } else {
        setError("Error al añadir la reseña. Código: " + response.status);
      }
    } catch (err) {
      setError("Error en la solicitud: " + err.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom right, #F5F5F5, #E0E0E0)",
        py: { xs: 4, sm: 6 },
      }}
    >
      <Fade in timeout={1000}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 6,
              textAlign: "center",
              color: "#1a1a1a",
              fontWeight: 700,
              letterSpacing: "1px",
            }}
          >
            Cervecería Boom Bun - Reseñas de Nuestros Clientes
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 4,
                bgcolor: "#fef2f2",
                color: "#b91c1c",
                borderRadius: 2,
                boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
              }}
            >
              {error}
            </Alert>
          )}

          {/* Buscador */}
          <Box sx={{ mb: 6 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Busca reseñas por usuario o texto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#6b7280" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                "& .MuiInputLabel-root": {
                  color: "#065f46",
                  fontWeight: "bold",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#065f46",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#064e3b" },
                  "&.Mui-focused fieldset": { borderColor: "#065f46" },
                  transition: "all 0.3s ease",
                },
              }}
            />
          </Box>

          {/* Lista de reseñas */}
          {filteredReseñas.length === 0 ? (
            <Typography
              variant="body1"
              color="#666666"
              textAlign="center"
              sx={{ py: 4 }}
            >
              No hay reseñas disponibles.
            </Typography>
          ) : (
            <Grid container spacing={4}>
              {filteredReseñas.map((reseña) => (
                <Grid item xs={12} sm={6} md={4} key={reseña.id}>
                  <Fade in timeout={1000}>
                    <Card
                      sx={{
                        bgcolor: "#ffffff",
                        borderRadius: 2,
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                        transition: "transform 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-3px)",
                          boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <CardContent>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}
                        >
                          {reseña.usuario || "Anónimo"}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "#666666", mb: 2, fontStyle: "italic" }}
                        >
                          {reseña.texto || "Sin comentario"}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{ color: "#90A4AE" }}
                        >
                          {reseña.fecha} - Producto: {reseña.producto || "Desconocido"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Fade>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Formulario para dejar reseña */}
          {auth ? (
            <Box
              sx={{
                mt: 6,
                p: 4,
                bgcolor: "#ffffff",
                borderRadius: "12px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                border: "1px solid #e5e7eb",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "#1a1a1a", mb: 3, fontWeight: 600 }}
              >
                Deja tu reseña
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                placeholder="Escribe tu reseña aquí..."
                value={newReseña}
                onChange={(e) => setNewReseña(e.target.value)}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  "& .MuiInputLabel-root": {
                    color: "#065f46",
                    fontWeight: "bold",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#065f46",
                  },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#e5e7eb" },
                    "&:hover fieldset": { borderColor: "#064e3b" },
                    "&.Mui-focused fieldset": { borderColor: "#065f46" },
                    transition: "all 0.3s ease",
                  },
                  mb: 2,
                }}
              />
              <Button
                variant="contained"
                startIcon={<SendIcon />}
                onClick={handleSubmitReseña}
                sx={{
                  mt: 2,
                  py: 1.5,
                  bgcolor: "#065f46",
                  "&:hover": {
                    bgcolor: "#047857",
                    transform: "scale(1.02)",
                    boxShadow: "0 4px 15px rgba(6, 95, 70, 0.3)",
                  },
                  textTransform: "none",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  transition: "all 0.3s ease",
                  borderRadius: 2,
                }}
              >
                Enviar reseña
              </Button>
            </Box>
          ) : (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Alert
                severity="info"
                sx={{
                  bgcolor: "#e6f3f7",
                  color: "#065f46",
                  borderRadius: 2,
                  boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                }}
              >
                Debes iniciar sesión para dejar una reseña.{" "}
                <Button
                  variant="text"
                  onClick={() => navigate("/login")}
                  sx={{ color: "#065f46", "&:hover": { color: "#047857" } }}
                >
                  Inicia sesión aquí
                </Button>
              </Alert>
            </Box>
          )}
        </Container>
      </Fade>
    </Box>
  );
}

export default Resena;