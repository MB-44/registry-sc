import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_API_URL = process.env.API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  try {
    if (!SHOPIFY_API_URL || !ACCESS_TOKEN) {
      throw new Error("Missing SHOPIFY_API_URL or ACCESS_TOKEN environment variables.");
    }

    const url = new URL(req.url);
    const collectionId = url.searchParams.get("collectionId");

    if (collectionId) {
      const productsResponse = await fetch(`${SHOPIFY_API_URL}/products.json?collection_id=${collectionId}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ACCESS_TOKEN,
        },
      });

      if (!productsResponse.ok) {
        throw new Error(`Failed to fetch products for collection ${collectionId}. Status: ${productsResponse.status}`);
      }

      const productsData = await productsResponse.json();
      return NextResponse.json({ products: productsData.products || [] });
    }

    const collectionsResponse = await fetch(`${SHOPIFY_API_URL}/custom_collections.json`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ACCESS_TOKEN,
      },
    });

    if (!collectionsResponse.ok) {
      throw new Error(`Failed to fetch collections. Status: ${collectionsResponse.status}`);
    }

    const collectionsData = await collectionsResponse.json();
    const collections = collectionsData.custom_collections || [];

    const categories: Record<string, any[]> = {};
    collections.forEach((collection: any) => {
      const category = collection.body_html || "Uncategorized";
      if (!categories[category]) {
        categories[category] = [];
      }
      categories[category].push({
        id: collection.id,
        title: collection.title,
        image: collection.image?.src || null,
      });
    });

    return NextResponse.json({ categories });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}