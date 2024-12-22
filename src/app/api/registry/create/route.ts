import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const body = await req.json();

    const {
      firstName,
      lastName,
      partnerFirstName,
      partnerLastName,
      address,
      city,
      postalCode,
      specialDate,
    } = body;

    if (!firstName || !lastName || !partnerFirstName || !partnerLastName || !address || !city || !postalCode || !specialDate) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    const newRegistry = new Registry({
      firstName,
      lastName,
      partnerFirstName,
      partnerLastName,
      address,
      city,
      postalCode,
      specialDate,
    });

    await newRegistry.save();

    return NextResponse.json({ message: "Registry created successfully!" });
  } catch (error) {
    console.error("Error creating registry:", error);
    return NextResponse.json({ error: "Failed to create registry." }, { status: 500 });
  }
}
