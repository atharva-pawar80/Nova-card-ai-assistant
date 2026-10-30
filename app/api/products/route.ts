import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";

export async function GET() {
  try {
    const query = `*[_type == "product"] {
      _id,
      name,
      price,
      discount,
      description,
      stock,
      variant,
      status,
      isFeatured
    }`;

    const products = await client.fetch(query);

    return NextResponse.json({
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Product fetching failed:", error);

    return NextResponse.json(
      { error: "Could not fetch products" },
      { status: 500 }
    );
  }
}