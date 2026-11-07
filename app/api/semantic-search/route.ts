
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { generateEmbedding } from "@/lib/embeddings";
import { cosineSimilarity } from "@/lib/semantic-search";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const query = body.query;

    // Validate user query
    if (typeof query !== "string" || !query.trim()) {
      return NextResponse.json(
        { error: "Please provide a valid search query" },
        { status: 400 }
      );
    }

    if (query.length > 500) {
      return NextResponse.json(
        { error: "Query must be under 500 characters" },
        { status: 400 }
      );
    }

    // Generate embedding for user query
    const queryEmbedding = await generateEmbedding(
      query.trim(),
      "RETRIEVAL_QUERY"
    );

    // Fetch stored product embeddings from Sanity
    const products = await client.fetch(`
      *[_type == "product" && defined(embedding)] {
        _id,
        name,
        description,
        price,
        discount,
        stock,
        images,
        embedding
      }
    `);

    // Calculate similarity for every product
    const results = products
      .filter(
        (product: any) =>
          Array.isArray(product.embedding) &&
          product.embedding.length === queryEmbedding.length
      )
      .map((product: any) => ({
        _id: product._id,
        name: product.name,
        description: product.description,
        price: product.price,
        discount: product.discount,
        stock: product.stock,
        images: product.images,
        similarity: cosineSimilarity(
          queryEmbedding,
          product.embedding
        ),
      }))
      .sort(
        (a: any, b: any) => b.similarity - a.similarity
      );

    // Return top 3 products
    return NextResponse.json({
      query,
      totalProducts: products.length,
      results: results.slice(0, 3),
    });
  } catch (error) {
    console.error("Semantic search failed:", error);

    return NextResponse.json(
      { error: "Semantic search failed" },
      { status: 500 }
    );
  }
}
