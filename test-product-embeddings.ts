
import { loadEnvConfig } from "@next/env";

async function main() {
  try {
    // Load environment variables from .env.local
    loadEnvConfig(process.cwd());

    // Import project modules after loading environment variables
    const { client } = await import("./sanity/lib/client");
    const { buildProductText } = await import("./lib/product-text");
    const { generateEmbedding } = await import("./lib/embeddings");

    // Fetch products from Sanity
    const query = `*[_type == "product"] {
      _id,
      name,
      brand,
      categories,
      description,
      variant,
      price,
      stock
    }`;

    const products = await client.fetch(query);

    console.log("Total products:", products.length);
    console.log("\nGenerating product embeddings...\n");

    for (const product of products) {
      const productText = buildProductText(product);

      const embedding = await generateEmbedding(
        productText,
        "RETRIEVAL_DOCUMENT"
      );

      console.log("Product:", product.name);
      console.log("Text:", productText);
      console.log("Embedding dimensions:", embedding.length);
      console.log("-----------------------------");
    }

    console.log("\nAll product embeddings generated successfully!");
  } catch (error) {
    console.error("Embedding generation failed:", error);
  }
}

main();
