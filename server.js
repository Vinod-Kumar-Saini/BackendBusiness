require("dotenv").config(); // Load env variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

// ✅ Import routes (make sure these files exist)
const authRoutes = require("./middleware/auth");
const businessRoutes = require("./models/Business");

const app = express();
const server = http.createServer(app);

// 🔌 Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*", // Replace with frontend domain in production
    methods: ["GET", "POST"]
  }
});

// 🌐 Middleware
app.use(cors());
app.use(express.json());

// 🔗 API Routes
app.use("/api/auth", authRoutes);
app.use("/api/business", businessRoutes);

// 🛢 MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1);
});

// 📡 Socket.IO: Broadcast on business creation
io.on("connection", (socket) => {
  console.log("🟢 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected:", socket.id);
  });
});

// Store io instance globally
app.set("io", io);

// 🧪 Basic health check route
app.get("/", (req, res) => {
  res.send("API is running");
});

// 🚀 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
