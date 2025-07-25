import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import employeeRoutes from "./routes/employee.js";
import taskRoutes from "./routes/task.js";
import leaveRoutes from "./routes/leave.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "https://office-management-system-rho.vercel.app", // ✅ frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected successfully");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/leaves", leaveRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("Office Management System Backend is Running");
});

// Export app for Vercel
export default app;
