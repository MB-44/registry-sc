import { NextResponse } from "next/server";

export async function POST() {
  // If using JWTs, client-side should handle token removal.
  return NextResponse.json({ message: "Logged out successfully." });
}
