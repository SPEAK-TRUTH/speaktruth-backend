require('dotenv').config();
const io = require("socket.io");

function initializeSocket(server) {
  const socketServer = io(server, { cors: { origin: process.env.FRONT_END_URL, }, });
  socketServer.on("connection", (socket) => {
    console.log("connected");
    socket.on("chat message", (msg) => {
      console.log(msg);
      socket.broadcast.emit("chat message", msg);
    });
  });
}

module.exports = { initializeSocket };
