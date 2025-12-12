import mongoose from "mongoose";

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
    // Admin and URL info
    slug: { type: String, required: true, unique: true, index: true },
    templateId: { type: String, required: true, default: "modern-javanese" },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    
    // Meta information for social sharing
    metaDescription: { type: String }, // Custom description for link preview

    // Couple Info
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

    // Wedding Details
    weddingDate: { type: Date, required: true },
    events: [eventSchema],
    dressCodeInfo: { type: String },

    // Content
    heroQuote: { type: String },
    gallery: [galleryImageSchema],
    story: [storyItemSchema],
    audioUrl: { type: String },
    coverImage: { type: String },
    hashtag: { type: String },
    venueMapUrl: { type: String },

    // Section Images (for static image templates like Sunda)
    heroImage: { type: String },
    coupleImage: { type: String },
    storyImage: { type: String },
    eventImage: { type: String },
    rsvpImage: { type: String },
    giftImage: { type: String },
    footerImage: { type: String },
    desktopImage: { type: String }, // Desktop left side static image (different from coverImage)

    // Gift Info
    showGiftSection: { type: Boolean, default: true },
    giftMessage: { type: String },
    bankAccounts: [bankAccountSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
