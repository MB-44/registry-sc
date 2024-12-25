import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";

export async function GET(req: NextRequest){
  try {
    await connectToDB();
    return NextResponse.json({ message: "Mongo db connected successfully!" });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to connect to MongoDB." },
      { status: 500 }
    );
  }
}