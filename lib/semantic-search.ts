
export function cosineSimilarity(
  vectorA: number[],
  vectorB: number[]
): number {
  if (vectorA.length !== vectorB.length) {
    throw new Error("Vectors must have the same dimensions");
  }

  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
    magnitudeA += vectorA[i] ** 2;
    magnitudeB += vectorB[i] ** 2;
  }

  const denominator =
    Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB);

  if (denominator === 0) {
    return 0;
  }

  return dotProduct / denominator;
}



export function keywordScore(
  query: string,
  productText: string
): number {
  const stopWords = new Set([
    "the", "for", "with", "and", "a", "an",
    "to", "of", "in", "on", "is", "my"
  ]);

  const queryWords = query
    .toLowerCase()
    .split(/\W+/)
    .filter(
      (word) => word.length > 2 && !stopWords.has(word)
    );

  const productWords = new Set(
    productText.toLowerCase().split(/\W+/)
  );

  if (queryWords.length === 0) return 0;

  const matchedWords = queryWords.filter((word) =>
    productWords.has(word)
  );

  return matchedWords.length / queryWords.length;
}
export function hybridScore(
  semantic: number,
  keyword: number
): number {
  return 0.9 * semantic + 0.1 * keyword;
}
