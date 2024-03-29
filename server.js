const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);

const { Server } = require("socket.io");
const ACTIONS = require("./src/Actions");

const io = new Server(server);

app.use(express.static("build"));
app.use((req, res, next) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

const userSocketMap = {};

function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
}

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);

  socket.on(ACTIONS.JOIN, (data) => {
    // checking if no. of clients is withing the limit

    const noOfClients = Array.from(
      io.sockets.adapter.rooms.get(data.roomId) || []
    ).length;
    // console.log(data.username, ":", noOfClients);
    //*********************************************

    userSocketMap[socket.id] = data.username;
    socket.join(data.roomId);
    const clients = getAllConnectedClients(data.roomId); // get all connected client on a particular room id
    // console.log(clients);

    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username: data.username,
        socketId: socket.id,
      });
    });
  });

  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
    // io.to(roomId).emit(ACTIONS.CODE_CHANGE, { code }); // send the code to everyone in the room including the sender
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code }); // send the code to everyone in the room except the sender
  });

  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code }); // send the code to everyone in the room including the sender
    // socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code }); // send the code to everyone in the room except the sender
  });

  // This function runs when the socket is about to disconnect. If we want to operate after the disconnecting of socket, then we should use event 'disconnected'
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms]; // socket.rooms returns the roomId of all the room the user or the socket is joined.
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });
    delete userSocketMap[socket.id];
    socket.leave(); // leave from all the joined rooms.
  }); // if the client wants to disconnect or the page gets reloaded.
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
