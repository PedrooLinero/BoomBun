import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Snackbar,
  InputAdornment,
  Fade,
  Grid,
} from "@mui/material";
import {
  Person as PersonIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Login as LoginIcon,
  ErrorOutline as ErrorOutlineIcon,
} from "@mui/icons-material";

function Register() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    Nombre: "",
    Correo: "",
    Contraseña: "",
    ConfirmarContraseña: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (userData.Contraseña.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    if (userData.Contraseña !== userData.ConfirmarContraseña) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Nombre: userData.Nombre.trim(),
          Correo: userData.Correo.toLowerCase().trim(),
          Contraseña: userData.Contraseña,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error al registrar usuario");
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
        p: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={1000}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 900, // Increased width for a more elongated horizontal form
            bgcolor: "white",
            borderRadius: 4,
            boxShadow: "0 6px 25px rgba(0, 0, 0, 0.15)",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >
          {/* Encabezado */}
          <Box
            sx={{
              bgcolor: "#065f46",
              p: 4,
              textAlign: "center",
              borderBottom: "3px solid #047857",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: "white",
                fontWeight: "bold",
                letterSpacing: 1,
                mb: 1,
              }}
            >
              Cervecería Boom Bun
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: "medium" }}
            >
              Registro de Usuario
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#d1fae5", mt: 1, opacity: 0.9 }}
            >
              Crea una cuenta para comenzar
            </Typography>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            {error && (
              <Alert
                severity="error"
                icon={<ErrorOutlineIcon fontSize="small" />}
                sx={{
                  mb: 3,
                  bgcolor: "#fef2f2",
                  color: "#b91c1c",
                  borderRadius: 2,
                  boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                }}
              >
                {error}
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* Primera fila: Nombre y Correo */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Nombre completo"
                  value={userData.Nombre}
                  onChange={(e) =>
                    setUserData({ ...userData, Nombre: e.target.value })
                  }
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  value={userData.Correo}
                  onChange={(e) =>
                    setUserData({ ...userData, Correo: e.target.value })
                  }
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailIcon sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
              </Grid>

              {/* Segunda fila: Contraseña y ConfirmarContraseña */}
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  type="password"
                  value={userData.Contraseña}
                  onChange={(e) =>
                    setUserData({ ...userData, Contraseña: e.target.value })
                  }
                  margin="normal"
                  required
                  helperText="Mínimo 8 caracteres"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
                    "& .MuiFormHelperText-root": {
                      color: "#6b7280",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Confirmar contraseña"
                  type="password"
                  value={userData.ConfirmarContraseña}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      ConfirmarContraseña: e.target.value,
                    })
                  }
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: "#6b7280" }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
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
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? null : <LoginIcon />}
              sx={{
                mt: 3,
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
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Registrarse"
              )}
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 3, textAlign: "center", color: "#6b7280" }}
            >
              ¿Ya tienes cuenta?{" "}
              <Box
                component="span"
                onClick={() => navigate("/login")}
                sx={{
                  color: "#065f46",
                  cursor: "pointer",
                  fontWeight: "medium",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#047857",
                  },
                  transition: "color 0.3s ease",
                }}
              >
                Iniciar sesión
              </Box>
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Snackbar
        open={success}
        autoHideDuration={2000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{
            bgcolor: "#d1fae5",
            color: "#065f46",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            fontWeight: "medium",
          }}
        >
          ¡Registro exitoso! Redirigiendo al login...
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Register;