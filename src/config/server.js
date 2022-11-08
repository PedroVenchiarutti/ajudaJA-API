const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const bodyParser = require("body-parser");
const allowCors = require("./cors");
const routes = require("../routes/index");
const app = express();
const apiErrorHandler = require("../error/errorHandler");
const { Server } = require("socket.io");
const server = require("http").createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Swagger
// const swaggerUI = require("swagger-ui-express");
// const swaggerFile = require("./swagger_output.json");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger_output.json");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(allowCors);
app.use(cors());

// funciono local
// app.use(express.static("public"));
app.use(express.static(__dirname));
app.use(express.static("src"));

//EndPoint
app.use("/api", routes);
// Middleware de tratamento de erros
app.use(apiErrorHandler);

const options = {
  customCssUrl: "/public/swagger-ui.css",
  customSiteTitle: "API AjudaJA swagger",
};

// app.use(
//   "/docs",
//   function (req, res, next) {
//     swaggerDocument.host = req.get("host");
//     req.swaggerDoc = swaggerDocument;
//     next();
//   },
//   swaggerUi.serveFiles(swaggerDocument, options),
//   swaggerUi.setup()
// );

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));

// NAO ENVIAR O SWAGGER NA PRODUCAO
// app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerFile));

module.exports = { server, io };
