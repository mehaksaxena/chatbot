const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { sequelize, User } = require("./models");
const { Server } = require("http");
const cron = require("node-cron");
const { Op } = require("sequelize");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

const http = require("http");

const server = http.createServer(app);

const io = socketIo(server, { cors: { origin: "*" } });

const users = {};

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  console.log("Token received:", token);

  if (!token) {
    console.log("No token provided.");
    return next(new Error("Authentication error"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded;
    console.log("Token decoded successfully:", decoded);
    next();
  } catch (err) {
    console.log("Token verification failed:", err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  const userId = socket.user.id;
  users[socket.id] = userId;
  console.log(`User connected: ${socket.id}, User ID: ${userId}`);

  socket.broadcast.emit("user-joined", { userId });

  socket.on("send", async (data) => {
    const { message } = data;

    console.log(`Message received from client: ${message}`);

    const sender = await User.findByPk(users[socket.id]);
    if (message && sender) {
      console.log(`Broadcasting message: "${message}" from ${sender.name}`);

      socket.broadcast.emit("receive", {
        message,
        name: sender.name,
      });
    } else {
      console.log("Error: Sender not found or message is empty.");
    }
  });

  socket.on("disconnect", async () => {
    const userId = users[socket.id];
    const user = await User.findByPk(userId);
    if (user) {
      socket.broadcast.emit("left", { name: user.name });
    }
    console.log(`User disconnected: ${socket.id}`);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 5001;

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Database connected!");
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Database connection failed:", err));
