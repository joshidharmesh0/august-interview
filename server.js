require("dotenv").config();

const express = require("express");

const db = require("./models");
const { getUsers } = require("./controller/user.controller");
const { sendEmailNotification } = require("./controller/email.controller");
const app = express();
const port = 3000;

app.get("/getUsers", getUsers);
app.get("/sendEmail", sendEmailNotification);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to database:", error);
  }
});
