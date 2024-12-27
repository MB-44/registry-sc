import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectToDB();
    const registry = await Registry.findById(params.id).lean();
    if (!registry) {
      return NextResponse.json(
        { error: "Registry not found" }, 
        { status: 404 }
        );
    }
    return NextResponse.json(registry);
  } catch (error) {
    // console.error("Error fetching registry:", error);
    return NextResponse.json(
        { error: "Failed to fetch registry." }, 
        { status: 500 }
    );
  }
}