const express = require("express");
const cors = require("cors");
const logger = require('./functions/logger.js');
const path = require("path");
require("dotenv").config();

//rotas
const typeRoutes = require('./routes/typeRoutes.js')
const genreRoutes = require("./routes/genreRoutes.js");
// Variaveis
const port = process.env.PORT;
const server = express();

// Middlewares
server.use(cors());
server.use(express.json());
server.use(logger);

// Rotas
server.use("/", typeRoutes);
server.use("/", genreRoutes);

server.get("/", (req, res) => {
  return res.send("<h1>Servidor rodando ...<h1>");
});

server.listen(port, () => {
  console.log(`Servidor rodando na porta ${port} ...`);
});
