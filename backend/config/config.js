require("dotenv").config();

module.exports = {
  port: process.env.PORT || 80,
  db: {
    host: process.env.DB_HOST || "ballast.proxy.rlwy.net",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "WQcyoLaCBYoNRYOLfDgJmDeYtXDLimvo",
    name: process.env.DB_NAME || "BoomBun",
    port: process.env.DB_PORT || 21655,
  },
  secretKey: process.env.SECRET_KEY || "default_secret",
};
