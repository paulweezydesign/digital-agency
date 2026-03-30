import connectToDatabase from "@/lib/db/mongodb";
import mongoose from "mongoose";
import { chunkAndEmbed, chunkHtml } from "./embeddings";
import { generateEmbedding, cosineSimilarity } from "./knowledge-base";

// Document store schema for MongoDB
const DocumentStoreSchema = new mongoose.Schema({
  content: { type: String, required: true },
  embedding: { type: [Number], required: true },
  metadata: {
    source: { type: String, default: "" },
    type: { type: String, default: "text" },
    title: { type: String, default: "" },
    chunkIndex: { type: Number, default: 0 },
    totalChunks: { type: Number, default: 1 },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
});

const DocumentStore =
  mongoose.models.DocumentStore || mongoose.model("DocumentStore", DocumentStoreSchema);

/**
 * Ingest a text document into the vector store
 */
export async function ingestText(params: {
  content: string;
  source: string;
  title: string;
  chunkSize?: number;
}): Promise<{ chunksIngested: number }> {
  await connectToDatabase();

  const chunks = await chunkAndEmbed({
    content: params.content,
    source: params.source,
    type: "text",
    title: params.title,
    chunkSize: params.chunkSize,
  });

  const docs = chunks.map((chunk) => ({
    content: chunk.content,
    embedding: chunk.embedding,
    metadata: {
      ...chunk.metadata,
      createdAt: new Date().toISOString(),
    },
  }));

  await DocumentStore.insertMany(docs);
  return { chunksIngested: docs.length };
}

/**
 * Ingest content from a URL
 */
export async function ingestUrl(params: {
  url: string;
  title?: string;
}): Promise<{ chunksIngested: number }> {
  const response = await fetch(params.url);
  const html = await response.text();

  await connectToDatabase();

  const chunks = await chunkHtml({
    html,
    source: params.url,
    title: params.title || params.url,
  });

  const docs = chunks.map((chunk) => ({
    content: chunk.content,
    embedding: chunk.embedding,
    metadata: {
      ...chunk.metadata,
      createdAt: new Date().toISOString(),
    },
  }));

  await DocumentStore.insertMany(docs);
  return { chunksIngested: docs.length };
}

/**
 * Query the vector store for relevant documents
 */
export async function queryDocuments(params: {
  query: string;
  topK?: number;
  minScore?: number;
}): Promise<{ results: { content: string; score: number; metadata: Record<string, unknown> }[] }> {
  await connectToDatabase();

  const queryEmbedding = await generateEmbedding(params.query);
  const topK = params.topK || 5;
  const minScore = params.minScore || 0.7;

  // Try MongoDB Atlas Vector Search first, fall back to in-memory similarity
  try {
    const results = await DocumentStore.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: topK * 10,
          limit: topK,
        },
      },
      {
        $project: {
          content: 1,
          metadata: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    return {
      results: results
        .filter((r: { score: number }) => r.score >= minScore)
        .map((r: { content: string; score: number; metadata: Record<string, unknown> }) => ({
          content: r.content,
          score: r.score,
          metadata: r.metadata,
        })),
    };
  } catch {
    // Fallback: in-memory similarity search (for development without Atlas)
    const allDocs = await DocumentStore.find({}).lean();
    const scored = allDocs
      .map((doc: { content: string; embedding: number[]; metadata: Record<string, unknown> }) => ({
        content: doc.content,
        score: cosineSimilarity(queryEmbedding, doc.embedding),
        metadata: doc.metadata,
      }))
      .filter((d: { score: number }) => d.score >= minScore)
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, topK);

    return { results: scored };
  }
}

/**
 * Delete all documents from a specific source
 */
export async function deleteDocumentsBySource(source: string): Promise<{ deletedCount: number }> {
  await connectToDatabase();
  const result = await DocumentStore.deleteMany({ "metadata.source": source });
  return { deletedCount: result.deletedCount || 0 };
}
