// scripts/checkDb.js
require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");

const check = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log(`CJS: ${mongoose.connection.host} / ${mongoose.connection.name}`);
  await mongoose.disconnect();
};
check();
