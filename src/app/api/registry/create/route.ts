import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    //debug
    console.log("Incoming request body:", req);

    const body = await req.json();

    // log the parsed body
    console.log("Parsed Body: ", body);

    const {
      firstName,
      lastName,
      partnerFirstName,
      partnerLastName,
      address,
      address2,
      city,
      postalCode,
      deliveryDate,
      specialDate,
      guests
    } = body;

    if (
        !firstName || 
        !lastName || 
        !partnerFirstName || 
        !partnerLastName || 
        !address || 
        !address2 ||
        !city || 
        !postalCode || 
        !deliveryDate ||
        !specialDate ||
        !guests
    ) {
      return NextResponse.json
      (
        { error: "All fields are required." }, 
        { status: 400 }
      );
    }

    // 6 digit unique code for the registry
    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newRegistry = new Registry({
      firstName,
      lastName,
      partnerFirstName,
      partnerLastName,
      address,
      address2,
      city,
      postalCode,
      deliveryDate,
      specialDate,
      guests,
    });

    await newRegistry.save();

    // this gonna generate the invitation link using the registry id
    const invitationLink = `${process.env.BASE_URL}/registry/${newRegistry._id}`;

    // this will update the registry with the inviation ink and the access code
    newRegistry.invitationLink = invitationLink;
    newRegistry.accessCode = accessCode;
    await newRegistry.save();

    return NextResponse.json({ 
        message: "Registry created successfully!" 
    });
  } catch (error) {
    console.error("Error creating registry:", error);
    return NextResponse.json(
        { error: "Failed to create registry." }, 
        { status: 500 }
    );
  }
}
