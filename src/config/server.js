const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const allowCors = require("./cors");
const routes = require("../routes/index");
const server = express();

// Swagger
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("./swagger_output.json");

server.use(bodyParser.json());
server.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
server.use(allowCors);
server.use(cors());

//EndPoint
server.use("/api", routes);

// NAO ENVIAR O SWAGGER NA PRODUCAO
server.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

module.exports = server;
