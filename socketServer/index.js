import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

dotenv.config();

const port = process.env.PORT || 6000;
const mongodbUrl = process.env.MONGODB_URL;

const connectDb = async () => {
  try {
    if (!mongodbUrl) {
      throw new Error("MONGODB_URL is not defined in .env");
    }

    await mongoose.connect(mongodbUrl);
    console.log("DB Connected");
  } catch (error) {
    console.log("Database connection error:", error);
  }
};

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("identity",(data)=>{
    console.log(data) ;
    
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, async () => {
  await connectDb();
  console.log(`Server started on port ${port}`);
});