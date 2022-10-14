const express = require("express");
const publicRoutes = require("../routes/publicRoutes");
const privateRoutes = require("../routes/privateRoutes");
const validationToken = require("../middlewares/validationTokenMiddleware");

const Routes = express.Router();

Routes.use("/public", publicRoutes);
Routes.use("/private", validationToken, privateRoutes);

module.exports = Routes;
