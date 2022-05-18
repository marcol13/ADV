const io = require("socket.io");
const http = require("http");

const httpServer = http.createServer();

let users = [];

function User(id, name) {
  this.id = id;
  this.name = name;
}

const socketIo = io(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

socketIo.on("connection", (socket) => {
  socket.on("message", (message) => {
    console.log(message);
    let username = users.filter((el) => el.id == socket.id)[0];
    console.log({ username });
    socketIo.emit("messageReturn", `${username.name}: ${message}`);
  });

  socket.on("login", (username) => {
    console.log(username);
    users.push(new User(socket.id, username));
    let response = users.map((el) => el.name);
    console.log(response);

    socket.emit("loginSucc", response);
    socket.broadcast.emit("newUser", username);
  });

  socket.on("disconnect", () => {
    try {
      let username = users.filter((el) => el.id == socket.id)[0];
      users = users.filter((el) => el.id != socket.id);
      let response = users.map((el) => el.name);
      socket.broadcast.emit("userDisconnect", [username.name, response]);
    } catch {}
  });
});

httpServer.listen(3001);
