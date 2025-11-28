import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/order";
import { jwtVerify } from "jose";

// This is the same secret used in middleware.js
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Helper function to slugify text
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

// Helper function to get user ID from token
async function getUserIdFromToken(request) {
  const tokenCookie = request.cookies.get("token");
  const token = tokenCookie?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload.id;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  await dbConnect();

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const invitations = await Order.find({ createdBy: userId }).sort({
      createdAt: -1,
    });
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await dbConnect();

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("DEBUG: API POST received body:", body);
    console.log("DEBUG: API POST venueMapUrl:", body.venueMapUrl);

    // Validate and sanitize slug
    if (!body.slug) {
      return NextResponse.json(
        { message: "Slug is required" },
        { status: 400 }
      );
    }

    const sanitizedSlug = slugify(body.slug);
    if (!sanitizedSlug) {
      return NextResponse.json(
        { message: "Invalid slug format" },
        { status: 400 }
      );
    }

    // Add createdBy to the invitation data
    const invitationData = { ...body, slug: sanitizedSlug, createdBy: userId };
    const newInvitation = await Order.create(invitationData);
    console.log("DEBUG: Created new invitation:", newInvitation);
    return NextResponse.json(newInvitation, { status: 201 });
  } catch (error) {
    console.error("Error creating invitation:", error);
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { message: "Invitation slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
