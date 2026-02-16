const express = require("express");
const router = express.Router();

const allRoutes = require("./allRoutes");

router.use("/asa", allRoutes);

module.exports = router;
