import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    
    // console.log("Incoming request body:", req);

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
      guests,
      wishlist
    } = await req.json();


    if (
        !firstName || 
        !lastName || 
        !partnerFirstName || 
        !partnerLastName || 
        !address || 
      //  - !address2 ||
        !city || 
        !postalCode || 
        !deliveryDate ||
        !specialDate 
      //  - !guests
    ) {
      return NextResponse.json
      (
        { error: "All Required fileds must be filled." }, 
        { status: 400 }
      );
    }

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
      wishlist: wishlist || [],
      accessCode,
    });

    await newRegistry.save();

    // const invitationLink = `${process.env.BASE_URL}/registry/${newRegistry._id}`;
    const invitationLink = `${process.env.BASE_URL}/mainDashboard/weddingRegistry/createRegistry/inviteRegistry?registryId=${newRegistry._id}`;

    newRegistry.invitationLink = invitationLink;
    newRegistry.accessCode = accessCode;
    await newRegistry.save();

    return NextResponse.json({
      message: "Registry created successfully!",
      registryId: newRegistry._id.toString(),
      invitationLink,
      accessCode,
    });
  } catch (error) {
    return NextResponse.json(
        { error: "Failed to create registry." }, 
        { status: 500 }
    );
  }
}
