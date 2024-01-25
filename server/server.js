const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
let lastPrice = Math.random(+100 + 50);
let day = 0;

io.on("connection", (socket) => {
  const interval = setInterval(() => {
    const changePercent = lastPrice * Math.random();
    let changeAmount = (lastPrice * changePercent) / 100;
    changeAmount *= Math.floor(Math.random() * 2) === 1 ? 1 : -1;
    lastPrice += changeAmount;
    socket.emit("stockData", { price: lastPrice, day: ++day });
  }, 2000);
  socket.on("disconnect", () => {
    clearInterval(interval);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
