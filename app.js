require("dotenv").config();
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/users");

const rootDir = require("./util/path");

const sequelize = require("./util/database");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "views", "index.html"));
});

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
