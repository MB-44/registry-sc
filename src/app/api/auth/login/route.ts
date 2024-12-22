"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
// import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { generateOtp } from "@/utils/generateOtp";
import { sendOtp } from "@/utils/sendOtp";

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
    const { phoneNumber, password } = await req.json();

    if (!phoneNumber || !password) {
      return NextResponse.json({ error: "Phone number and password are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your DB name
    const usersCollection = db.collection<IUser>("users");

    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid password." }, { status: 401 });
    }

    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    await usersCollection.updateOne(
      { phoneNumber },
      { $set: { otp, otpExpiry } }
    );

    await sendOtp(phoneNumber, otp);

    return NextResponse.json({ message: "OTP sent to your phone number." });
  } catch (error) {
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
