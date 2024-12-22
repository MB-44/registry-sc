"use server";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendOtp } from "@/utils/sendOtp";
import { generateOtp } from "@/utils/generateOtp";
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

export async function POST(req: NextRequest) {
  try {
    const { phoneNumber } = await req.json();

    if (!phoneNumber) {
      return NextResponse.json({ error: "Phone number is required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your DB name
    const usersCollection = db.collection<IUser>("users");

    const user = await usersCollection.findOne({ phoneNumber });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
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
    return NextResponse.json({ error: "Failed to send OTP." }, { status: 500 });
  }
}
