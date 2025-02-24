const path = require("path");
const express = require("express");

const userControllers = require("../controllers/userControllers");

const router = express();

router.post("/signup", userControllers.signup);

module.exports = router;
