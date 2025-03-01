require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");
const groupRoutes = require("./routes/groups");

const rootDir = require("./util/path");

const sequelize = require("./util/database");

const User = require("./models/userModel");
const Message = require("./models/messageModel");
const Group = require("./models/groupModel");
const GroupUser = require("./models/groupUserModel");
const GroupMessage = require("./models/groupMessageModel");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "views")));
app.use("/users", userRoutes);
app.use(messageRoutes);
app.use("/groups", groupRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

User.hasMany(Message, { foreignKey: "UserId", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "receiverId", as: "ReceivedMessages" });
Message.belongsTo(User, { as: "sender", foreignKey: "UserId" });
Message.belongsTo(User, { as: "receiver", foreignKey: "receiverId" });

User.belongsToMany(Group, { through: GroupUser, foreignKey: "userId" });
Group.belongsToMany(User, { through: GroupUser, foreignKey: "groupId" });

User.hasMany(GroupMessage, { foreignKey: "senderId" });
GroupMessage.belongsTo(User, { as: "sender", foreignKey: "senderId" });

Group.hasMany(GroupMessage, { foreignKey: "groupId" });
GroupMessage.belongsTo(Group, { as: "Group", foreignKey: "groupId" });

sequelize
  .sync()
  .then((result) => {
    console.log(result);
    app.listen(process.env.PORT || 3000, () => {
      console.log("Server is running successfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });
