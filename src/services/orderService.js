import dbConnect from "@/lib/db";
import Order from "@/models/order";

export async function createOrderService(payload) {
    await dbConnect();
    const {groom, bride, weddingDate, weddingVenue} = payload;

    if(!groom || !bride || !weddingDate || !weddingVenue) {
        const error = new Error("All fields are required");
        error.statusCode = 400;
        throw error;
    }

    return await Order.create({
        groom: groom.trim(),
        bride: bride.trim(),
        weddingDate: new Date(weddingDate),
        weddingVenue: weddingVenue.trim(),
    })
}