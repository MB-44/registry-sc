// root/src/app/api/registry/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function GET(req: NextRequest, {params}:any) {
  try {
    await connectToDB();
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Registry ID is required." }, { status: 400 });
    }

    const registry = await Registry.findById(id).lean();
    if (!registry) {
      return NextResponse.json({ error: "Registry not found." }, { status: 404 });
    }

    return NextResponse.json({ registry });
  } catch (error) {
    console.error("Error fetching registry:", error);
    return NextResponse.json({ error: "Failed to fetch registry." }, { status: 500 });
  }
}

export async function POST(req: NextRequest, {params}:any) {
  try {
    await connectToDB();
    const { id } = await params;
    const updates = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Registry ID is required." }, { status: 400 });
    }

    const updatedRegistry = await Registry.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedRegistry) {
      return NextResponse.json({ error: "Registry not found." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Registry updated successfully!",
      registry: updatedRegistry,
    });
  } catch (error) {
    console.error("Error updating registry:", error);
    return NextResponse.json({ error: "Failed to update registry." }, { status: 500 });
  }
}
