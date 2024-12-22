import { NextResponse } from "next/server";
import clientPromise from "../../../lib/mongodb";

export const runtime = "nodejs";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("weddingRegistry"); 

    const collections = await db.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "Database connected successfully!",
      collections,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: "Database connection failed!",
      error: (error as Error).message,
    });
  }
}
