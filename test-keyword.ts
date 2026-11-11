import {
  keywordScore,
  hybridScore,
} from "./lib/semantic-search";

const query = "headphones for travelling";

const product = `
  Nova Wireless Headphones.
  Wireless headphones for music and travel.
`;

const keyword = keywordScore(query, product);
const semantic = 0.732;

console.log("Semantic score:", semantic);
console.log("Keyword score:", keyword);
console.log("Hybrid score:", hybridScore(semantic, keyword));