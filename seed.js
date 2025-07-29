require("dotenv").config(); // Load environment variables if using .env

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Business = require("./models/Business");

// Use your actual MongoDB URI here or from process.env
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://vinod:123@cluster0.fv4sx.mongodb.net/Business?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
});

async function seed() {
  try {
    const hashed = await bcrypt.hash("test1234", 10);
    const producer = await User.create({
      email: "producer@example.com",
      password: hashed,
      role: "producer",
      verified: true
    });

    await Business.create([
      {
        name: "Organic Mango Farm",
        phone: "1234567890",
        description: "Fresh mangoes directly from the farm.",
        location: { lat: 19.076, lng: 72.877 }
      },
      {
        name: "Local Honey Supplier",
        phone: "9876543210",
        description: "Pure honey from forest bees.",
        location: { lat: 28.7041, lng: 77.1025 }
      }
    ]);

    console.log("🌱 Seed complete.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
