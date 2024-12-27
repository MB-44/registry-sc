import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();

    const { wishlist } = await req.json();
    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Registry ID is required." },
        { status: 400 }
      );
    }

    if (!Array.isArray(wishlist)) {
      return NextResponse.json(
        { error: "Wishlist must be an array." },
        { status: 400 }
      );
    }

    const updatedRegistry = await Registry.findByIdAndUpdate(
      id,
      { $set: { wishlist } },
      { new: true }
    );

    if (!updatedRegistry) {
      return NextResponse.json(
        { error: "Registry not found." },
        { status: 404 }
      );
    }

    // Debugging
    // console.log("Updated registry:", updatedRegistry);

    return NextResponse.json({
      message: "Wishlist updated successfully!",
      registry: updatedRegistry,
    });
  } catch (error) {
    // console.error("Error updating registry:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist." },
      { status: 500 }
    );
  }
}

// Optionally, add a GET handler for fetching registry details
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    await connectToDB();

    const { id } = context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Registry ID is required." },
        { status: 400 }
      );
    }

    const registry = await Registry.findById(id).lean();

    if (!registry) {
      return NextResponse.json(
        { error: "Registry not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Registry fetched successfully!",
      registry,
    });
  } catch (error) {
    // console.error("Error fetching registry:", error);
    return NextResponse.json(
      { error: "Failed to fetch registry." },
      { status: 500 }
    );
  }
}