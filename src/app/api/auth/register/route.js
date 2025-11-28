import dbConnect from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return NextResponse.json(
            { success: false, error: "Please provide all required fields" },
            { status: 400 }
        );
    }

    try {
        const user = await User.create({
            name,
            email,
            password,
        });

        // In a real app, you'd generate a token and send it back
        return NextResponse.json(
            { success: true, data: { name: user.name, email: user.email } },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        if (error.code === 11000) {
            return NextResponse.json(
                { success: false, error: "Email already exists" },
                { status: 400 }
            );
        }
        return NextResponse.json(
            { success: false, error: "Server Error" },
            { status: 500 }
        );
    }
}
