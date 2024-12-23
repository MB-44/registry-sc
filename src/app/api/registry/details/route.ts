import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Registry from "@/models/Registry";

export async function GET(req: NextRequest) {
  try {
    await connectToDB();
    const registry = await Registry.findOne({}).lean(); 
    if (!registry) {
      return NextResponse.json(
        { error: "Registry not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(registry);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch registry details" },
      { status: 500 }
    );
  }
}