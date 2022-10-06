const express = require("express");
const publicRoutes = require("../routes/publicRoutes");
const privateRoutes = require("../routes/privateRoutes");

const Routes = express.Router();

Routes.use("/public", publicRoutes);
Routes.use("/private", privateRoutes);

module.exports = Routes;
