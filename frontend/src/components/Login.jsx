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
} from "@mui/material";
import {
  Mail as MailIcon,
  Lock as LockIcon,
  Login as LogInIcon,
  ErrorOutline as AlertCircleIcon,
} from "@mui/icons-material";

function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    Correo: "",
    Contraseña: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showWelcome, setShowWelcome] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Correo: credentials.Correo.toLowerCase().trim(),
          Contraseña: credentials.Contraseña,
        }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error de autenticación");
      }

      localStorage.setItem(
        "auth",
        JSON.stringify({
          isAuthenticated: true,
          user: data.datos,
        })
      );

      window.dispatchEvent(new Event("storage"));

      setShowWelcome(true);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setCredentials((prev) => ({ ...prev, Contraseña: "" }));
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
        background: "linear-gradient(to bottom right, #F5F5F5, #E0E0E0)", // Fondo claro con degradado sutil
        p: { xs: 2, sm: 4 },
      }}
    >
      <Fade in timeout={1000}>
        <Box
          sx={{
            width: "100%",
            maxWidth: 450,
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
              Iniciar Sesión
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#d1fae5", mt: 1, opacity: 0.9 }}
            >
              Accede para gestionar tu carta
            </Typography>
          </Box>

          {/* Formulario */}
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
            {error && (
              <Alert
                severity="error"
                icon={<AlertCircleIcon fontSize="small" />}
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

            <TextField
              fullWidth
              label="Correo electrónico"
              value={credentials.Correo}
              onChange={(e) =>
                setCredentials({ ...credentials, Correo: e.target.value })
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
                mb: 2,
              }}
            />

            <TextField
              fullWidth
              label="Contraseña"
              type="password"
              value={credentials.Contraseña}
              onChange={(e) =>
                setCredentials({ ...credentials, Contraseña: e.target.value })
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
                mb: 3,
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              startIcon={loading ? null : <LogInIcon />}
              sx={{
                mt: 1,
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
                "Iniciar Sesión"
              )}
            </Button>

            <Typography
              variant="body2"
              sx={{ mt: 3, textAlign: "center", color: "#6b7280" }}
            >
              ¿Olvidaste tu contraseña?{" "}
              <Box
                component="span"
                onClick={() => alert("Funcionalidad de recuperación en desarrollo")}
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
                Recupérala
              </Box>
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Snackbar
        open={showWelcome}
        autoHideDuration={1500}
        onClose={() => setShowWelcome(false)}
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
          ¡Bienvenido/a de nuevo a Cervecería Boom Bun!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;