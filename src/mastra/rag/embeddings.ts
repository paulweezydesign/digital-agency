import { MDocument } from "@mastra/rag";
import { generateEmbedding } from "./knowledge-base";

export interface ChunkResult {
  content: string;
  metadata: {
    chunkIndex: number;
    totalChunks: number;
    source: string;
    type: string;
    title: string;
  };
  embedding: number[];
}

/**
 * Chunk a document into smaller pieces and generate embeddings for each chunk.
 * Uses Mastra's MDocument for intelligent chunking.
 */
export async function chunkAndEmbed(params: {
  content: string;
  source: string;
  type: string;
  title: string;
  chunkSize?: number;
  chunkOverlap?: number;
}): Promise<ChunkResult[]> {
  const { content, source, type, title, chunkSize = 1000, chunkOverlap = 200 } = params;

  // Use Mastra's MDocument for chunking
  const doc = MDocument.fromText(content, {
    source,
    type,
    title,
  });

  const chunks = await doc.chunk({
    strategy: "recursive",
    size: chunkSize,
    overlap: chunkOverlap,
  });

  // Generate embeddings for each chunk
  const results: ChunkResult[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const chunkContent = typeof chunk === "string" ? chunk : String((chunk as { text?: string }).text || chunk);
    const embedding = await generateEmbedding(chunkContent);
    results.push({
      content: chunkContent,
      metadata: {
        chunkIndex: i,
        totalChunks: chunks.length,
        source,
        type,
        title,
      },
      embedding,
    });
  }

  return results;
}

/**
 * Chunk a document from HTML content
 */
export async function chunkHtml(params: {
  html: string;
  source: string;
  title: string;
  chunkSize?: number;
}): Promise<ChunkResult[]> {
  // Strip HTML tags for text extraction
  const textContent = params.html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return chunkAndEmbed({
    content: textContent,
    source: params.source,
    type: "html",
    title: params.title,
    chunkSize: params.chunkSize,
  });
}
