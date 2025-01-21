import http from "http";
import SocketIO from "socket.io";
import express from "express";
import { v4 as uuidv4 } from "uuid";

const app = express();

// const docs_namespace = io.of("/ws/document");

const meta_db = {};
const history_db = {};

console.log("Init");
app.get("/", (req, res) => res.send("home"));
app.post("/document", (req, res) => {
  const uuid = uuidv4();
  meta_db[uuid] = {
    title: "Untitled",
    author: "Anonymous",
    created_at: Date.now(),
  };
  res.send({
    document_id: uuid,
  });
});
app.get("/document", (req, res) => {
  document_id = req.query.id;
  // 1. get document meta data by id from db
  // 2. get document history data by id from db
  // 3. gen. initial content based on 2
  // 4. get socket server ip
  meta = meta_db[document_id];
  history = history_db[document_id];
  content = "";
  socket = "http://127.0.0.1:9000/ws/document";
  res.send({
    id: document_id,
    meta,
    history,
    content,
    socket,
  });
});

const PORT = process.env.PORT || 9001;
const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);
const server = http.createServer(app);
const io = SocketIO(server);
io.on("connection", (socket) => {
  socket.on("enter_room", (roomName, cb) => {
    socket.join(roomName);
    console.log(socket.rooms);
    cb();

    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnect", (a) => console.log(a));
});

server.listen(PORT, handleListen);
