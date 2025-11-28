import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        message: { type: String},
        isAttending: { type: Boolean, default: true},
        invitationId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Order',  // Changed from 'Invitation' to 'Order'
            required: false  // Made optional to support old data
        },
    },
    {timestamps: true}
);

// Delete the model from cache if it exists to ensure schema updates are applied
if (mongoose.models.Guest) {
    delete mongoose.models.Guest;
}

export default mongoose.model("Guest", guestSchema);