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
        background: "linear-gradient(to bottom right, #111827, #064e3b)",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
        }}
      >
        {/* Encabezado */}
        <Box sx={{ bgcolor: "#064e3b", p: 3, textAlign: "center" }}>
          <Typography variant="h6" sx={{ color: "white", fontWeight: "medium" }}>
            Iniciar Sesión
          </Typography>
          <Typography variant="body2" sx={{ color: "#d1fae5", mt: 0.5 }}>
            Accede con tus credenciales
          </Typography>
        </Box>

        {/* Formulario */}
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
          {error && (
            <Alert
              severity="error"
              icon={<AlertCircleIcon fontSize="small" />}
              sx={{ mb: 2, bgcolor: "#fef2f2", color: "#b91c1c", borderRadius: 1 }}
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#064e3b" },
                "&.Mui-focused fieldset": { borderColor: "#065f46" },
              },
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
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#e5e7eb" },
                "&:hover fieldset": { borderColor: "#064e3b" },
                "&.Mui-focused fieldset": { borderColor: "#065f46" },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            startIcon={loading ? null : <LogInIcon />}
            sx={{
              mt: 2,
              py: 1.2,
              bgcolor: "#065f46",
              "&:hover": { bgcolor: "#047857" },
              textTransform: "none",
              fontWeight: "medium",
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Iniciar sesión"
            )}
          </Button>

          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "#6b7280" }}
          >
            ¿Olvidaste tu contraseña?{" "}
            <Box
              component="span"
              sx={{ color: "#065f46", cursor: "pointer", "&:hover": { textDecoration: "underline" } }}
            >
              Recupérala
            </Box>
          </Typography>
        </Box>
      </Box>

      <Snackbar
        open={showWelcome}
        autoHideDuration={1500}
        onClose={() => setShowWelcome(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ bgcolor: "#d1fae5", color: "#065f46" }}
        >
          ¡Bienvenido/a de nuevo!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;