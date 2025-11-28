import { deleteGuestService } from "@/services/guestService";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const { id } = params;
        await deleteGuestService(id);
        return NextResponse.json({ message: "Guest deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || "Server error" },
            { status: error.statusCode || 500 }
        );
    }
}
