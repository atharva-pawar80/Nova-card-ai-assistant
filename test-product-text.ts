
import { buildProductText } from "./lib/product-text";

const product = {
  name: "Nova Wireless Headphones",
  description:
    "Wireless headphones with clear audio and comfortable ear cushions.",
  brand: null,
  categories: null,
  variant: "gadget",
};

const result = buildProductText(product);

console.log("Product text for embedding:");
console.log(result);
