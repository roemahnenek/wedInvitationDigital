import dbConnect from "@/lib/db";
import Guest from "@/models/guest";

export async function createGuestService(payload) {
  await dbConnect();

  const { name, message, isAttending, invitationId } = payload;

  if (!name) {
    const error = new Error("Name is required");
    error.statusCode = 400;
    throw error;
  }

  const guestData = {
    name: name.trim(),
    message: message || "",
    isAttending: isAttending ?? true,
  };

  // Only add invitationId if it's provided
  if (invitationId) {
    guestData.invitationId = invitationId;
  }

  return await Guest.create(guestData);
}

export async function getGuestService() {
  await dbConnect();
  return await Guest.find()
    .populate("invitationId", "slug groom bride")
    .sort({ createdAt: -1 })
    .lean();
}

export async function getGuestsByInvitationIdService(invitationId) {
  await dbConnect();
  return await Guest.find({ invitationId }).sort({ createdAt: -1 }).lean();
}

export async function deleteGuestService(id) {
  await dbConnect();

  const guest = await Guest.findByIdAndDelete(id);

  if (!guest) {
    const error = new Error("Guest not found");
    error.statusCode = 404;
    throw error;
  }

  return guest;
}
