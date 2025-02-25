const path = require("path");

const express = require("express");

const messageControllers = require("../controllers/messageControllers");

const auth = require("../middlewares/auth");

const router = express();

router.post("/send", auth, messageControllers.sendMessage);
router.get("/messages", auth, messageControllers.getMessages);

module.exports = router;
