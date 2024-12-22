// src/app/api/collections/route.ts

import { NextRequest, NextResponse } from "next/server";

const SHOPIFY_API_URL = process.env.API_URL;
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

interface CollectionImage {
  src: string;
}

interface Collection {
  id: number;
  title: string;
  image: CollectionImage | null;
  collectionType: 'custom' | 'smart';
}

interface ProductImage {
  src: string;
}

interface Product {
  id: number;
  title: string;
  images: ProductImage[];
}

interface CollectionWithProducts extends Collection {
  products: Product[];
}

export async function GET(req: NextRequest) {
  try {
    if (!SHOPIFY_API_URL || !ACCESS_TOKEN) {
      throw new Error("Missing SHOPIFY_API_URL or ACCESS_TOKEN environment variables.");
    }

    const customCollectionsEndpoint = "/custom_collections.json";
    const smartCollectionsEndpoint = "/smart_collections.json";

    const customCollectionsResponse = await fetch(`${SHOPIFY_API_URL}${customCollectionsEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ACCESS_TOKEN,
      },
    });

    if (!customCollectionsResponse.ok) {
      throw new Error(`Failed to fetch custom collections. Status: ${customCollectionsResponse.status}`);
    }

    const customCollectionsData = await customCollectionsResponse.json();
    const customCollections = (customCollectionsData.custom_collections || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      image: c.image ? { src: c.image.src } : null,
      collectionType: 'custom' as const,
    }));

    const smartCollectionsResponse = await fetch(`${SHOPIFY_API_URL}${smartCollectionsEndpoint}`, {
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": ACCESS_TOKEN,
      },
    });

    if (!smartCollectionsResponse.ok) {
      throw new Error(`Failed to fetch smart collections. Status: ${smartCollectionsResponse.status}`);
    }

    const smartCollectionsData = await smartCollectionsResponse.json();
    const smartCollections = (smartCollectionsData.smart_collections || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      image: c.image ? { src: c.image.src } : null,
      collectionType: 'smart' as const,
    }));

    const allCollections = [...customCollections, ...smartCollections];

    const fetchProductsForCollection = async (collection: Collection): Promise<Product[]> => {
      const endpoint = collection.collectionType === 'custom'
        ? `/custom_collections/${collection.id}/products.json`
        : `/smart_collections/${collection.id}/products.json`;

      const response = await fetch(`${SHOPIFY_API_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Access-Token": ACCESS_TOKEN,
        },
      });

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      return (data.products || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        images: (p.images || []).map((img: any) => ({ src: img.src })),
      }));
    };

    const collectionsWithProducts = await Promise.all(
      allCollections.map(async (col) => {
        const products = await fetchProductsForCollection(col);
        return { ...col, products };
      })
    );

    return NextResponse.json({ collections: collectionsWithProducts });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
