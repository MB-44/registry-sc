"use server";

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { sendOtp } from "@/utils/sendOtp";
import { generateOtp } from "@/utils/generateOtp";

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
    const { firstName, lastName, phoneNumber, password } = await req.json();

    if (!firstName || !lastName || !phoneNumber || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("your_database_name"); // Replace with your DB name
    const usersCollection = db.collection<IUser>("users");

    const existingUser = await usersCollection.findOne({ phoneNumber });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOtp();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    const newUser: IUser = {
      firstName,
      lastName,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpiry,
    };

    await usersCollection.insertOne(newUser);

    await sendOtp(phoneNumber, otp);

    return NextResponse.json({ message: "OTP sent to your phone number." });
  } catch (error) {
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
