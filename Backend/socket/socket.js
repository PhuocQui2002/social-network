import { Server } from "socket.io";
import express from "express";
import http from "http";
//import { useId } from "react";

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.URL,
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; // userId -> socketId

export const getReceiverSocketId = (receiverId) => userSocketMap[receiverId];


io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
    console.log("Socket connected: User =", userId);
    console.log("Socket connected: Socket =", socket.id);
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  //console.log("List user connected: ListUser =", userSocketMap);

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      //console.log("Socket Disconnected: User =", userId, "Socket =", socket.id)
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, server, io };
