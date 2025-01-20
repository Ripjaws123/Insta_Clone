import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId] || null;
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    if (userSocketMap[userId] && userSocketMap[userId] !== socket.id) {
      console.log(
        `User Reconnected UserId: ${userId} OldSocketId: ${userSocketMap[userId]} NewSocketId: ${socket.id}`
      );
    }

    userSocketMap[userId] = socket.id;
    console.log(`User Connected UserId: ${userId} SocketId: ${socket.id}`);

    io.emit("onlineUsers", Object.keys(userSocketMap));
  } else {
    console.error("Connection attempt without userId");
  }

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User Disconnected UserId: ${userId} SocketId: ${socket.id}`);
    }
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

export { io, server, app };
