// scripts/seedSundaInvitation.js
require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");

const seedSunda = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(
      `Database connected to: ${mongoose.connection.host}/${mongoose.connection.name}`
    );

    // Define User Schema (minimal needed for query)
    const UserSchema = new mongoose.Schema({
      email: String,
    });
    const User = mongoose.models.User || mongoose.model("User", UserSchema);

    // Define Order Schema (matching src/models/order.js)
    const eventSchema = new mongoose.Schema({
      title: { type: String, required: true },
      date: { type: String, required: true },
      time: { type: String, required: true },
      venueName: { type: String, required: true },
      venueAddress: { type: String, required: true },
      venueMapUrl: { type: String },
    });

    const galleryImageSchema = new mongoose.Schema({
      url: { type: String, required: true },
      caption: { type: String },
    });

    const storyItemSchema = new mongoose.Schema({
      year: { type: String, required: true },
      title: { type: String, required: true },
      text: { type: String, required: true },
    });

    const bankAccountSchema = new mongoose.Schema({
      bankName: { type: String, required: true },
      accountHolder: { type: String, required: true },
      accountNumber: { type: String, required: true },
    });

    const orderSchema = new mongoose.Schema(
      {
        slug: { type: String, required: true, unique: true, index: true },
        templateId: {
          type: String,
          required: true,
          default: "modern-javanese",
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        groom: {
          name: { type: String, required: true },
          parents: { type: String },
          photoUrl: { type: String },
        },
        bride: {
          name: { type: String, required: true },
          parents: { type: String },
          photoUrl: { type: String },
        },
        weddingDate: { type: Date, required: true },
        events: [eventSchema],
        dressCodeInfo: { type: String },
        heroQuote: { type: String },
        gallery: [galleryImageSchema],
        story: [storyItemSchema],
        audioUrl: { type: String },
        coverImage: { type: String },
        hashtag: { type: String },
        venueMapUrl: { type: String }, // Added field

        // Section Images
        heroImage: { type: String },
        coupleImage: { type: String },
        storyImage: { type: String }, // Added field
        eventImage: { type: String },
        rsvpImage: { type: String },
        giftImage: { type: String },
        footerImage: { type: String },

        showGiftSection: { type: Boolean, default: true },
        giftMessage: { type: String },
        bankAccounts: [bankAccountSchema],
      },
      { timestamps: true }
    );

    const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);

    // Find Admin User
    const adminEmail = "admin@roemahnenek.com";
    console.log(`Searching for admin with email: ${adminEmail}`);

    const userCount = await User.countDocuments();
    console.log(`Total users in DB: ${userCount}`);

    const adminUser = await User.findOne({ email: adminEmail });

    if (!adminUser) {
      console.error("Admin user not found. Please run seedAdmin.js first.");
      // List all users to see what's there
      const allUsers = await User.find({});
      console.log("Existing users:", allUsers);
      return;
    }

    console.log(`Found admin user: ${adminUser._id}`);

    // Dummy Data for Sunda Template
    const dummyData = {
      slug: "rizky-aisyah-wedding",
      templateId: "sunda",
      createdBy: adminUser._id,
      groom: {
        name: "Rizky Pratama",
        parents: "", // Hidden in Sunda
        photoUrl: "", // Hidden in Sunda
      },
      bride: {
        name: "Aisyah Putri",
        parents: "", // Hidden in Sunda
        photoUrl: "", // Hidden in Sunda
      },
      weddingDate: new Date("2025-12-20T09:00:00"),
      coverImage:
        "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764294978/Landing_Page_bmmfzv.png",
      audioUrl:
        "https://res.cloudinary.com/dpi1w0ide/video/upload/v1683606687/audio/wedding-song.mp3", // Example audio

      // Section Images
      heroImage:
        "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764312885/Page_1_cwi3d0.png",
      coupleImage:
        "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764294976/Page_2_ts2nxz.png",
      storyImage:
        "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764311073/Page_3_y1dvp0.png",
      eventImage:
        "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764311073/Page_4_xg01dz.png",
      rsvpImage:
          caption: "Prewedding 1",
        },
        {
          url: "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764294976/Page_2_ts2nxz.png",
          caption: "Prewedding 2",
        },
        {
          url: "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764311073/Page_4_xg01dz.png",
          caption: "Venue",
        },
        {
          url: "https://res.cloudinary.com/dpi1w0ide/image/upload/v1764294978/Page_5_scqxys.png",
          caption: "Moment",
        },
      ],
      story: [],
    };

    // Check if slug exists
    const existingOrder = await Order.findOne({ slug: dummyData.slug });
    if (existingOrder) {
      console.log("Invitation with this slug already exists. Updating...");
      await Order.updateOne({ slug: dummyData.slug }, dummyData);
      console.log("Invitation updated successfully!");
    } else {
      console.log("Creating new invitation...");
      await Order.create(dummyData);
      console.log("Invitation created successfully!");
    }

    console.log(`Slug: ${dummyData.slug}`);
    console.log(`URL: http://localhost:3000/v/${dummyData.slug}`);
  } catch (error) {
    console.error("Error seeding invitation:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Database connection closed.");
  }
};

seedSunda();
