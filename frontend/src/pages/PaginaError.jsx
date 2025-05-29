import { Box, Typography, Button, Container } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";

function PaginaError() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#F5F5F5",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          padding: { xs: 3, sm: 4 },
          textAlign: "center",
        }}
      >
        <ErrorIcon
          sx={{ fontSize: 80, color: "#d32f2f", mb: 2 }}
        />
        <Typography
          variant="h4"
          component="h1"
          sx={{
            marginBottom: 2,
            color: "#1a1a1a",
            fontWeight: "bold",
            fontSize: { xs: "1.5rem", sm: "2.5rem" },
          }}
        >
          ¡Oops! Página no encontrada
        </Typography>
        <Typography
          variant="body1"
          color="textSecondary"
          sx={{
            marginBottom: 4,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          La ruta que estás buscando no existe. Puede que haya sido movida,
          eliminada o nunca existió.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          sx={{
            mt: 2,
            bgcolor: "#065f46",
            "&:hover": { bgcolor: "#047857" },
            borderRadius: 2,
            fontWeight: "bold",
            padding: "10px 20px",
            transition: "all 0.3s ease",
          }}
        >
          Ir a la página principal
        </Button>
      </Container>
    </Box>
  );
}

export default PaginaError;