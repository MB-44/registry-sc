"use server";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

interface IUser {
  _id?: ObjectId;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  otp?: string;
  otpExpiry?: number;
}

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber, otp } = await req.json();

    if (!phoneNumber || !otp) {
      return NextResponse.json({ error: "Phone number and OTP are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your DB name
    const usersCollection = db.collection<IUser>("users");

    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (user.otp !== otp || user.otpExpiry! < Date.now()) {
      return NextResponse.json({ error: "Invalid or expired OTP." }, { status: 400 });
    }

    // Clear OTP fields
    await usersCollection.updateOne(
      { phoneNumber },
      { $unset: { otp: "", otpExpiry: "" } }
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, phoneNumber: user.phoneNumber },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json({ message: "OTP verified successfully.", token });
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify OTP." }, { status: 500 });
  }
}
