const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Business = require("./models/Business");

mongoose.connect("mongodb+srv://vinod:123@cluster0.fv4sx.mongodb.net/Business");

async function seed() {
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

  console.log("Seed complete.");
  process.exit();
}

seed();
