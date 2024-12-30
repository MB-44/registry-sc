import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();
    const data = await req.json();

    const accessCode = Math.floor(100000 + Math.random() * 900000).toString();

    const newRegistry = new Registry({ ...data, accessCode });
    const savedRegistry = await newRegistry.save();

    savedRegistry.invitationLink = `${process.env.BASE_URL}/mainDashboard/weddingRegistry/createRegistry/inviteRegistry?registryId=${savedRegistry._id}`;
    await savedRegistry.save();

    return NextResponse.json({
      message: "Registry created successfully!",
      registry: savedRegistry,
    });
  } catch (error) {
    console.error("Error creating registry:", error);
    return NextResponse.json({ error: "Failed to create registry." }, { status: 500 });
  }
}
