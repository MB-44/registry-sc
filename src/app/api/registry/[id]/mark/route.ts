import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(req: NextRequest, { params }: any) {
  try {
    await connectToDB();

    const { id } = params;
    const { productId, guestName, quantity } = await req.json();

    if (!id || !productId || !guestName || !quantity) {
      return NextResponse.json({ error: "Invalid data provided." }, { status: 400 });
    }

    const registry = await Registry.findById(id);

    if (!registry) {
      return NextResponse.json({ error: "Registry not found." }, { status: 404 });
    }

    const product = registry.wishlist.find((item: any) => item.id === productId);

    if (!product || product.quantity < quantity) {
      return NextResponse.json({ error: "Invalid product or insufficient quantity." }, { status: 400 });
    }

    product.quantity -= quantity;
    product.remarks = product.remarks || [];
    product.remarks.push({ guestName, quantity });

    await registry.save();

    return NextResponse.json({
      message: "Wishlist item marked successfully.",
      registry,
    });
  } catch (error) {
    console.error("Error marking wishlist item:", error);
    return NextResponse.json({ error: "Failed to mark wishlist item." }, { status: 500 });
  }
}
