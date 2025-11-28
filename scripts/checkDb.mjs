// scripts/checkDb.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`ESM: ${mongoose.connection.host} / ${mongoose.connection.name}`);
  await mongoose.disconnect();
};
check();
