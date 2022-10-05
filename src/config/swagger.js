const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/config/swagger_output.json";
const endpointsFiles = ["./src/config/server.js"];

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
  host: "localhost:3333/api",
  schemes: ["http"],
  securytiDefinitions: {},
};

swaggerAutogen(outputFile, endpointsFiles, doc);
