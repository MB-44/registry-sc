import { NextRequest, NextResponse } from "next/server";
import connectToDB from "@/lib/db";
import Registry from "@/models/Registry";

export async function POST(
  req: NextRequest, 
  {params} : any
) {
  try {
    await connectToDB();
    const { id } = params;
    const { guestName, productId, quantity } = await req.json();

    if (!id || !guestName || !productId || !quantity) {
      return NextResponse.json(
        { error: "Guest name, product ID, and quantity are required." },
        { status: 400 }
      );
    }

    const registry = await Registry.findById(id);
    if (!registry) {
      return NextResponse.json({ error: "Registry not found." }, { status: 404 });
    }

    const product = registry.wishlist.find((item: any) => item.id === productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found in wishlist." }, { status: 404 });
    }

    if (quantity > product.quantity) {
      return NextResponse.json({ error: "Requested quantity exceeds available stock." }, { status: 400 });
    }

    product.quantity -= quantity;

    product.remarks.push({ guestName, productId, quantity });

    await registry.save();

    return NextResponse.json({
      message: "Wishlist item marked successfully!",
      registry,
    });
  } catch (error) {
    console.error("Error marking wishlist item:", error);
    return NextResponse.json({ error: "Failed to mark wishlist item." }, { status: 500 });
  }
}
