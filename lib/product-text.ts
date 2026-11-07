type ProductForEmbedding = {
  name: string;
  description?: string | null;
  brand?: string | null;
  categories?: string[] | null;
  variant?: string | null;
};

export function buildProductText(
  product: ProductForEmbedding
): string {
  return [
    `Product: ${product.name}`,
    product.brand ? `Brand: ${product.brand}` : null,
    product.categories?.length
      ? `Categories: ${product.categories.join(", ")}`
      : null,
    product.description
      ? `Description: ${product.description}`
      : null,
    product.variant ? `Type: ${product.variant}` : null,
  ]
    .filter(Boolean)
    .map((part) => part!.replace(/\s+/g, " ").trim().replace(/[.!?]+$/, ""))
    .join(". ");
}