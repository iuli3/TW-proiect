const express = require("express");
const router = express.Router();
const { getCities } = require("../controllers/CityController");

router.get("/", getCities);

module.exports = router;
