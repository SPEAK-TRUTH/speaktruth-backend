const io = require("socket.io");

function initializeSocket(server) {
  const socketServer = io(server, { cors: { origin: 'http://127.0.0.1:5173', }, });
  socketServer.on("connection", (socket) => {
    console.log("connected");
    socket.on("chat message", (msg) => {
      console.log(msg);
      socket.broadcast.emit("chat message", msg);
    });
  });
}

module.exports = { initializeSocket };
