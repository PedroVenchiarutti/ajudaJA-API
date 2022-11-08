const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/config/swagger_output.json";
const endpointsFiles = ["./src/routes/index.js"];

const doc = {
  info: {
    title: "AjudaJA API",
    version: "1.0.0",
    description: "API do projeto AjudaJA",
    contact: {
      name: "Pedro Lucas",
      email: "pedro.lucas.clear@gmail.com",
    },
  },
  host: "ajuda-ja-api.vercel.app/api",
  schemes: ["https"],
  consumes: ["application/json"],
  securytiDefinitions: {
    bearerAuth: { 
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
};

swaggerAutogen(outputFile, endpointsFiles, doc);
