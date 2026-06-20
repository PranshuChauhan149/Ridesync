import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import User from "./model/user.modal.js";

dotenv.config();

const port = process.env.SOCKET_PORT || 8000;
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
app.use(express.json());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.NEXT_BASE_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.post("/emit", async (req, res) => {
  const { event, userId, data } = req.body;
  try {
    const user = await User.findById(userId);
    if (user.socketId) {
      io.to(user.socketId).emit(event, data);
    }
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false });
  }
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("identity", async (userId) => {
    await User.findByIdAndUpdate(userId, {
      socketId: socket.id,
      isOnline: true,
    });

    console.log(userId);
  });

  socket.on("update-location", async ({ userId, latitude, longitude }) => {
    await User.findByIdAndUpdate(userId, {
      location: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
    });
  });

  socket.on("join-ride", (bookingId) => {
    console.log("join-ride", bookingId);
    socket.join(`ride-${bookingId}`);
  });

  socket.on(
    "driver-location-update",
    ({ bookingId, latitude, longitude, status }) => {
      io.to(`ride-${bookingId}`).emit("driver-location", {
        latitude,
        longitude,
      });
    },
  );

  socket.on("disconnect", async () => {
    await User.findOneAndUpdate(
      { socketId: socket.id },
      {
        socketId: null,
        isOnline: false,
      },
    );

    console.log("User disconnected:", socket.id);
  });
});

server.listen(port, async () => {
  await connectDb();
  console.log(`Server started on port ${port}`);
});
