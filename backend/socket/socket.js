const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const app = express()

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    // credentials: true, // Allow cookies to be sent along with requests
    methods: ["GET", "POST"],
  },
})
//add users that listen on the server
const userSocketMap = {}

//if reciver user is online then send message with socket
const getReciverSocketId = (reciverId) => {
  return userSocketMap[reciverId]
}

//socket listen
io.on("connection", (socket) => {
  console.log("a user connected")
  //get userId that comes in query from frontend
  const userId = socket.handshake.query.userId
  if (userId != "undefined") userSocketMap[userId] = socket.id
  io.emit("getOnlineUsers", Object.keys(userSocketMap))
  console.log(userSocketMap)
  // if user close connection (becomes offline user to other users)
  socket.on("disconnect", () => {
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    console.log("user disconnected")
  })
})
module.exports = { app, server, io, getReciverSocketId }
