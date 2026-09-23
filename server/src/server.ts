import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app = express();

const PORT = 5000;
console.log("Mongo URI exists:", !!process.env.MONGODB_URI);
connectDB();

app.get("/", (req, res) => {
  res.json({
    message: "TaskFlow API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});