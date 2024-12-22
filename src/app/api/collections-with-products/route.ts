import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_STOREFRONT_API_URL = process.env.SHOPIFY_STOREFRONT_API_URL;
const STOREFRONT_ACCESS_TOKEN = process.env.STOREFRONT_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  try {
    if (!SHOPIFY_STOREFRONT_API_URL || !STOREFRONT_ACCESS_TOKEN) {
      throw new Error("Missing SHOPIFY_STOREFRONT_API_URL or STOREFRONT_ACCESS_TOKEN environment variables.");
    }

    const { query, variables } = await req.json();

    const response = await fetch(SHOPIFY_STOREFRONT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    const data = await response.json();

    if (response.status >= 400) {
      throw new Error(data.errors?.[0]?.message || "GraphQL query failed.");
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("GraphQL API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
