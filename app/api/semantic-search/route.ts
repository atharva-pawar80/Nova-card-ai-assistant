

import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { generateEmbedding } from "@/lib/embeddings";
import {
  cosineSimilarity,
  keywordScore,
  hybridScore,
} from "@/lib/semantic-search";

export async function POST(request: Request) {
  try {
    // 1. Read request body
    const body = await request.json();

    const query = body.query;
    const maxPrice = body.maxPrice;
    const inStockOnly = body.inStockOnly;

    // 2. Validate search query
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

    // 3. Validate maximum price
    if (
      maxPrice !== undefined &&
      (typeof maxPrice !== "number" ||
        !Number.isFinite(maxPrice) ||
        maxPrice < 0)
    ) {
      return NextResponse.json(
        { error: "maxPrice must be a non-negative number" },
        { status: 400 }
      );
    }

    // 4. Validate stock filter
    if (
      inStockOnly !== undefined &&
      typeof inStockOnly !== "boolean"
    ) {
      return NextResponse.json(
        { error: "inStockOnly must be a boolean" },
        { status: 400 }
      );
    }

    // 5. Generate query embedding
    const queryEmbedding = await generateEmbedding(
      query.trim(),
      "RETRIEVAL_QUERY"
    );

    // 6. Fetch products with embeddings from Sanity
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

    
    // 7. Apply metadata filters BEFORE ranking
    const filteredProducts = products.filter((product: any) => {
      // Maximum price condition
      if (
        maxPrice !== undefined &&
        (typeof product.price !== "number" ||
          product.price > maxPrice)
      ) {
        return false;
      }

      // Stock availability condition
      if (
        inStockOnly === true &&
        !(typeof product.stock === "number" &&
          product.stock > 0)
      ) {
        return false;
      }

      return true;
    });

    // 8. Calculate semantic, keyword and hybrid scores
    const results = filteredProducts
      .filter(
        (product: any) =>
          Array.isArray(product.embedding) &&
          product.embedding.length === queryEmbedding.length
      )
      .map((product: any) => {
        const semantic = cosineSimilarity(
          queryEmbedding,
          product.embedding
        );

        const keyword = keywordScore(
          query,
          `${product.name} ${product.description ?? ""}`
        );

        const hybrid = hybridScore(semantic, keyword);

        return {
          _id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          discount: product.discount,
          stock: product.stock,
          images: product.images,
          semanticScore: semantic,
          keywordScore: keyword,
          hybridScore: hybrid,
        };
      })
      .sort(
        (a: any, b: any) =>
          b.hybridScore - a.hybridScore
      );

    // 9. Return top 3 results
    return NextResponse.json({
      query,
      totalProducts: products.length,
      matchedProducts: filteredProducts.length,
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

