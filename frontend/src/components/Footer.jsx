import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

function Footer() {
  return (
    <AppBar
      position="static"
      sx={{ top: "auto", bottom: 0, backgroundColor: "#24221e", padding: 1 }}
    >
      <Toolbar>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body1"
            color="inherit"
            sx={{ textAlign: "center", marginTop: 1 }}
          >
            © 2025 Cervecería Boom Bun - Bar de Tapas
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              color="inherit"
              href="https://www.facebook.com"
              target="_blank"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://www.twitter.com"
              target="_blank"
            >
              <TwitterIcon />
            </IconButton>
            <IconButton
              color="inherit"
              href="https://www.instagram.com"
              target="_blank"
            >
              <InstagramIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Footer;