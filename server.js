
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

let waitingUser = null;
const partners = new Map();

app.get("/", (req, res) => {
  res.send("Random Video Chat Server is Running!");
});

function removeUser(socket) {
  if (waitingUser === socket.id) {
    waitingUser = null;
  }

  const partnerId = partners.get(socket.id);

  if (partnerId) {
    io.to(partnerId).emit("partner-left");
    partners.delete(partnerId);
    partners.delete(socket.id);
  }
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("find-partner", () => {
    removeUser(socket);

    if (waitingUser && waitingUser !== socket.id) {
      const partnerId = waitingUser;
      waitingUser = null;

      partners.set(socket.id, partnerId);
      partners.set(partnerId, socket.id);

      socket.emit("matched", { initiator: true });
      io.to(partnerId).emit("matched", {
        initiator: false
      });
    } else {
      waitingUser = socket.id;
      socket.emit("waiting");
    }
  });

  socket.on("signal", (data) => {
    const partnerId = partners.get(socket.id);

    if (partnerId) {
      io.to(partnerId).emit("signal", data);
    }
  });

  socket.on("skip", () => {
    removeUser(socket);
    socket.emit("skipped");
  });

  socket.on("disconnect", () => {
    removeUser(socket);
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
