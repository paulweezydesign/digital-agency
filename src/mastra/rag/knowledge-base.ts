// Embedding model configuration
const EMBEDDING_MODEL_NAME = "text-embedding-3-small";
const EMBEDDING_DIMENSIONS = 1536;

export interface VectorDocument {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    source: string;
    type: string;
    title: string;
    chunkIndex: number;
    totalChunks: number;
    createdAt: string;
  };
}

/**
 * Generate an embedding vector for a given text using OpenAI text-embedding-3-small.
 * Uses the OpenAI REST API directly to avoid SDK version mismatches.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL_NAME,
      input: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embedding API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

/**
 * Generate embeddings for multiple texts in batch
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL_NAME,
      input: texts,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI embedding API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.data.map((item: { embedding: number[] }) => item.embedding);
}

/**
 * Calculate cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * MongoDB Atlas Vector Search index configuration.
 * 
 * Create this index in MongoDB Atlas with the following definition:
 * ```json
 * {
 *   "fields": [{
 *     "type": "vector",
 *     "path": "embedding",
 *     "numDimensions": 1536,
 *     "similarity": "cosine"
 *   }]
 * }
 * ```
 */
export const VECTOR_INDEX_CONFIG = {
  indexName: "vector_index",
  dimensions: EMBEDDING_DIMENSIONS,
  similarity: "cosine" as const,
};

export { EMBEDDING_MODEL_NAME, EMBEDDING_DIMENSIONS };
