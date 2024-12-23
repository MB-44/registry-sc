import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Registry from "@/models/Registry";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDB();
    const { wishlist } = await req.json();

    // Find existing registry by ID
    const registry = await Registry.findById(params.id);
    if (!registry) {
      return NextResponse.json(
        { error: "Registry not found" },
        { status: 404 }
      );
    }

    // Update wishlist
    registry.wishlist = wishlist;
    await registry.save();

    return NextResponse.json({
      message: "Wishlist updated successfully!"
    });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json(
      { error: "Failed to update wishlist." },
      { status: 500 }
    );
  }
}
