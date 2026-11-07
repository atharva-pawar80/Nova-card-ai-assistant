
import { loadEnvConfig } from "@next/env";
import { cosineSimilarity } from "./lib/semantic-search";

async function main() {
  try {
    loadEnvConfig(process.cwd());

    const { generateEmbedding } = await import("./lib/embeddings");

    const productText =
      "Nova Wireless Headphones with noise cancellation, ideal for travelling and listening to music.";

    console.log("Generating product embedding...");

    const productVector = await generateEmbedding(
      productText,
      "RETRIEVAL_DOCUMENT"
    );

    console.log("Generating relevant query embedding...");

    const relevantQuery = await generateEmbedding(
      "Headphones for a long flight",
      "RETRIEVAL_QUERY"
    );

    console.log("Generating unrelated query embedding...");

    const unrelatedQuery = await generateEmbedding(
      "A mechanical keyboard for programming",
      "RETRIEVAL_QUERY"
    );

    console.log("\n--- Similarity Results ---");

    console.log(
      "Relevant score:",
      cosineSimilarity(relevantQuery, productVector)
    );

    console.log(
      "Unrelated score:",
      cosineSimilarity(unrelatedQuery, productVector)
    );
  } catch (error) {
    console.error("Embedding test failed:", error);
  }
}

main();


