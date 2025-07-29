const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const auth = require("./middleware/auth");
const User = require("./models/User");
const Business = require("./models/Business");

const app = express();
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

mongoose.connect("mongodb+srv://vinod:123@cluster0.fv4sx.mongodb.net/Business");

app.use(cors());
app.use(express.json());

// Simulated email verification and password reset
const sendEmail = (email, content) => {
  console.log(`Simulated email to ${email}:`);
  console.log(content);
};

app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed, verified: false });

  const token = jwt.sign({ id: user._id }, "verifysecret", { expiresIn: "1d" });
  sendEmail(email, `Verify account: http://localhost:5000/api/auth/verify/${token}`);

  res.send("Registration successful. Please verify your email.");
});

app.get("/api/auth/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, "verifysecret");
    await User.findByIdAndUpdate(decoded.id, { verified: true });
    res.send("Email verified successfully!");
  } catch {
    res.status(400).send("Invalid or expired token.");
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found.");

  const token = jwt.sign({ id: user._id }, "resetsecret", { expiresIn: "15m" });
  sendEmail(email, `Reset password: http://localhost:5000/api/auth/reset/${token}`);
  res.send("Password reset link sent.");
});

app.post("/api/auth/reset/:token", async (req, res) => {
  try {
    const { id } = jwt.verify(req.params.token, "resetsecret");
    const hashed = await bcrypt.hash(req.body.password, 10);
    await User.findByIdAndUpdate(id, { password: hashed });
    res.send("Password reset successful.");
  } catch {
    res.status(400).send("Invalid or expired token.");
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");
  if (!user.verified) return res.status(403).send("Email not verified");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  const token = jwt.sign({ id: user._id }, "secretkey");
  res.send({ token });
});

app.post("/api/business", auth, async (req, res) => {
  const business = await Business.create(req.body);
  io.emit("new-business", business);
  res.send(business);
});

app.get("/api/business", async (req, res) => {
  const data = await Business.find();
  res.send(data);
});

server.listen(5000, () => console.log("Server on port 5000"));
