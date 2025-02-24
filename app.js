require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoutes = require("./routes/users");
const messageRoutes = require("./routes/messages");

const rootDir = require("./util/path");

const sequelize = require("./util/database");

const User = require("./models/userModel");
const Message = require("./models/messageModel");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "public", "views")));
app.use("/users", userRoutes);
app.use(messageRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

User.hasMany(Message);
Message.belongsTo(User);

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
