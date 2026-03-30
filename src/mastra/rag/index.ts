export {
  generateEmbedding,
  generateEmbeddings,
  cosineSimilarity,
  VECTOR_INDEX_CONFIG,
  EMBEDDING_DIMENSIONS,
} from "./knowledge-base";
export type { VectorDocument } from "./knowledge-base";

export { chunkAndEmbed, chunkHtml } from "./embeddings";
export type { ChunkResult } from "./embeddings";

export {
  ingestText,
  ingestUrl,
  queryDocuments,
  deleteDocumentsBySource,
} from "./documents";
