import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// CREATE EXPRESS APP
const app = express();
const server = http.createServer(app);

// SOCKET.IO SERVER
export const io = new Server(server, {
  cors: { origin: "*" },
});

// STORE ONLINE USERS
export const userSocketMap = {};

// SOCKET.IO CONNECTION HANDLER
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected : ", userId);
  if(userId) userSocketMap[userId] = socket.id
//   EMIT ONLINE USERS TO ALL CONNECTED CLIENTS
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
    socket.on("disconnect", ()=>{
        console.log("User Disconnected", userId)
        delete userSocketMap[userId]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
});

// MIDDLEWARE
app.use(express.json({ limit: "4mb" }));
app.use(cors());

// USER ROUTES
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// CONNECT TO MONGODB
await connectDB();

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
