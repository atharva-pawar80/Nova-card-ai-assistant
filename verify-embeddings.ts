import { loadEnvConfig } from "@next/env";

async function main() {
  loadEnvConfig(process.cwd());

  const { client } = await import("./sanity/lib/client");

  const products = await client.fetch(`
    *[_type == "product"] {
      name,
      "dimensions": count(embedding),
      embeddingModel
    }
  `);

  console.table(products);

  console.log(
    "Products with embeddings:",
    products.filter((p: any) => p.dimensions === 3072).length
  );
}

main();