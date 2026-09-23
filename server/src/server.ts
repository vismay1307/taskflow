import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";

import { connectDB } from "./config/db.js";
import { initializeSocket } from "./config/socket.js";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import boardRoutes from "./routes/board.routes.js";
import taskRoutes from "./routes/task.routes.js";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// HTTP server
const httpServer = createServer(app);

// Initialize Socket.io
initializeSocket(httpServer);

// Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/boards", boardRoutes);
app.use("/api/tasks", taskRoutes);
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "TaskFlow API is running",
  });
});

// Start HTTP + Socket.io server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});