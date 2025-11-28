// scripts/checkAndCreateAdmin.js
require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");

const checkAndCreateAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected.");

    // Define User Schema inline to avoid import issues
    const UserSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });

    // Use existing model if available, or create new
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    const ADMIN_EMAIL = "admin@roemahnenek.com";
    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL });

    if (existingAdmin) {
      console.log(`Admin user found: ${existingAdmin._id}`);
    } else {
      console.log("Admin user NOT found. Creating...");
      // Note: Password hashing is skipped here for simplicity in this rescue script,
      // but in a real app it should be hashed.
      // Since we are just seeding for dev/dummy, plain text might be "okay" if the auth logic handles it,
      // BUT the app uses bcrypt compare, so we MUST hash it.
      // I'll use a hardcoded hash for 'password123' to avoid importing bcrypt if not needed,
      // or just require bcryptjs.

      const bcrypt = require("bcryptjs");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("password123", salt);

      const newAdmin = await User.create({
        name: "Admin Roemah Nenek",
        email: ADMIN_EMAIL,
        password: hashedPassword,
      });
      console.log(`Admin user created: ${newAdmin._id}`);
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

checkAndCreateAdmin();
