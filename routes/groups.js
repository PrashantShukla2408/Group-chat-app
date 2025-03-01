const path = require("path");

const express = require("express");

const groupControllers = require("../controllers/groupControllers");

const auth = require("../middlewares/auth");

const router = express();

router.post("/create", groupControllers.createGroup);
router.get("/userGroups/:userId", groupControllers.getUserGroups);
router.get("/groupUsers/:groupId", groupControllers.getGroupUsers);
router.post("/sendGroupMessage", auth, groupControllers.sendGroupMessage);
router.get("/getGroupMessages/:groupId", groupControllers.getGroupMessages);

module.exports = router;
