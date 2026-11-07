
import { cosineSimilarity } from "./lib/semantic-search";

const queryVector = [0.9, 0.8, 0.7];

const headphonesVector = [0.88, 0.82, 0.68];
const speakerVector = [0.85, 0.75, 0.72];
const keyboardVector = [0.1, 0.2, 0.9];

console.log(
  "Headphones:",
  cosineSimilarity(queryVector, headphonesVector)
);

console.log(
  "Speaker:",
  cosineSimilarity(queryVector, speakerVector)
);

console.log(
  "Keyboard:",
  cosineSimilarity(queryVector, keyboardVector)
);
