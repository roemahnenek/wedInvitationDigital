import {
  createGuestService,
  getGuestService,
  getGuestsByInvitationIdService,
} from "@/services/guestService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const guest = await createGuestService(body);
    return NextResponse.json(guest, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: error.statusCode || 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const invitationId = searchParams.get("invitationId");

    let guests;
    if (invitationId) {
      guests = await getGuestsByInvitationIdService(invitationId);
    } else {
      guests = await getGuestService();
    }

    return NextResponse.json(guests, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: error.statusCode || 500 }
    );
  }
}
