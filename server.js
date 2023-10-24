require("dotenv").config();

const express = require("express");
const { createServer } = require("node:http");

const { Server } = require("socket.io");

const db = require("./models");
const { getUsers } = require("./controller/user.controller");
const { sendEmailNotification } = require("./controller/email.controller");
const path = require("node:path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const port = 3000;

app.get("/getUsers", getUsers);
app.get("/sendEmail", sendEmailNotification);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.use(express.static("public"));

let connectedUsers = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  console.log(socket);

  socket.on("new user", () => {
    const newUser = `user-${(Math.random() * 1000000).toFixed(0)}`;

    connectedUsers = [
      ...connectedUsers,
      { username: newUser, socketId: socket.id },
    ];

    io.emit("new user connected", connectedUsers);
  });

  socket.on("new message", (data) => {
    io.emit("new message", {
      message: data,
      sender: socket.id,
      time: new Date(),
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    const index = connectedUsers.findIndex((i) => i.socketId === socket.id);

    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
  });
});

server.listen(port, async () => {
  try {
    await db.sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.log("Unable to connect to database:", error);
  }
});
