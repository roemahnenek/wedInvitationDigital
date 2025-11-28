// scripts/testFetch.mjs
import mongoose from "mongoose";
import dotenv from "dotenv";
import Order from "../src/models/order.js";
import dbConnect from "../src/lib/db.js";

dotenv.config({ path: ".env.local" });

const testFetch = async () => {
  try {
    await dbConnect();
    console.log(
      `Database connected to: ${mongoose.connection.host}/${mongoose.connection.name}`
    );

    const slug = "rizky-aisyah-wedding";
    console.log(`Searching for slug: "${slug}"`);

    const invitation = await Order.findOne({ slug }).lean();

    if (invitation) {
      console.log("FOUND:", invitation.slug);
      console.log("Template:", invitation.templateId);
    } else {
      console.log("NOT FOUND");
      // List all slugs
      const all = await Order.find({}, "slug");
      console.log(
        "All slugs:",
        all.map((o) => o.slug)
      );
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
};

testFetch();
