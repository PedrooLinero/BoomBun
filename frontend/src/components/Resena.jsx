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
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import { apiUrl } from "../pages/config";

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
    <Box sx={{ backgroundColor: "#1E272E", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          sx={{
            mb: 4,
            textAlign: "center",
            color: "#E0E0E0",
            fontWeight: 900,
            letterSpacing: "1px",
          }}
        >
          Reseñas de Nuestros Clientes
        </Typography>

        {/* Buscador */}
        <Box sx={{ mb: 4 }}>
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#4CAF50" },
                "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
              },
            }}
          />
        </Box>

        {/* Lista de reseñas */}
        {filteredReseñas.length === 0 ? (
          <Typography variant="body1" color="#B0BEC5" textAlign="center" sx={{ py: 4 }}>
            No hay reseñas disponibles.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {filteredReseñas.map((reseña) => (
              <Grid item xs={12} key={reseña.id}>
                <Fade in timeout={1000}>
                  <Card sx={{ bgcolor: "#ffffff", boxShadow: "0 3px 15px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: "#1a1a1a" }}>
                        {reseña.usuario || "Anónimo"}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666666", mb: 2, fontStyle: "italic" }}
                      >
                        {reseña.texto || "Sin comentario"}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#90A4AE" }}>
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
        {auth && (
          <Box
            sx={{
              mt: 6,
              p: 3,
              bgcolor: "#2D3436",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
            }}
          >
            <Typography variant="h6" sx={{ color: "#E0E0E0", mb: 2 }}>
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
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#e5e7eb" },
                  "&:hover fieldset": { borderColor: "#4CAF50" },
                  "&.Mui-focused fieldset": { borderColor: "#4CAF50" },
                },
              }}
            />
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmitReseña}
              sx={{
                mt: 2,
                bgcolor: "#4CAF50",
                "&:hover": { bgcolor: "#388E3C" },
              }}
            >
              Enviar reseña
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Resena;
