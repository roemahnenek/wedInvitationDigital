import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Order from "@/models/order";
import { jwtVerify } from "jose";

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

export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const invitation = await Order.findOne({ _id: id, createdBy: userId });
    if (!invitation) {
      return NextResponse.json(
        { message: "Invitation not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(invitation);
  } catch (error) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  await dbConnect();
  const { id } = params;

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    console.log("DEBUG: API PUT received body:", body);
    console.log("DEBUG: API PUT venueMapUrl:", body.venueMapUrl);

    // Validate and sanitize slug if provided
    if (body.slug) {
      const sanitizedSlug = slugify(body.slug);
      if (!sanitizedSlug) {
        return NextResponse.json(
          { message: "Invalid slug format" },
          { status: 400 }
        );
      }
      body.slug = sanitizedSlug;
    }

    const updatedInvitation = await Order.findOneAndUpdate(
      { _id: id, createdBy: userId },
      body,
      { new: true, runValidators: true }
    );
    console.log("DEBUG: Updated invitation result:", updatedInvitation);
    if (!updatedInvitation) {
      return NextResponse.json(
        { message: "Invitation not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json(updatedInvitation);
  } catch (error) {
    console.error("Error updating invitation:", error);
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

export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;

  const userId = await getUserIdFromToken(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const deletedInvitation = await Order.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    if (!deletedInvitation) {
      return NextResponse.json(
        { message: "Invitation not found or unauthorized" },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "Invitation deleted successfully" });
  } catch (error) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
