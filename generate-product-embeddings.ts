
import { loadEnvConfig } from "@next/env";

async function main() {
  try {
    loadEnvConfig(process.cwd());

    const { client, writeClient } = await import("./sanity/lib/client");
    const { buildProductText } = await import("./lib/product-text");
    const { generateEmbedding } = await import("./lib/embeddings");

    const query = `*[_type == "product"] {
      _id,
      name,
      brand,
      categories,
      description,
      variant
    }`;

    const products = await client.fetch(query);

    console.log(`Found ${products.length} products`);

    for (const product of products) {
      console.log(`\nProcessing: ${product.name}`);

      const productText = buildProductText(product);

      const embedding = await generateEmbedding(
        productText,
        "RETRIEVAL_DOCUMENT"
      );

      await writeClient
        .patch(product._id)
        .set({
          embedding,
          embeddingModel: "gemini-embedding-001",
          embeddingUpdatedAt: new Date().toISOString(),
        })
        .commit();

      console.log("Embedding saved successfully!");
      console.log("Dimensions:", embedding.length);
    }

    console.log("\nAll product embeddings saved to Sanity!");
  } catch (error) {
    console.error("Failed to save embeddings:", error);
  }
}

main();
