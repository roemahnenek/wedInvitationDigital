import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req) {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json(
            { success: false, error: "Please provide email and password" },
            { status: 400 }
        );
    }

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        
        const response = NextResponse.json({ 
            success: true, 
            user: { id: user._id, name: user.name, email: user.email } 
        });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 60 * 60 * 24, // 1 day
            path: "/",
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { success: false, error: "Server Error" },
            { status: 500 }
        );
    }
}
