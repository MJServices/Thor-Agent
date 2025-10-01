import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client if API key is available
const hf = process.env.HUGGINGFACE_API_KEY
  ? new HfInference(process.env.HUGGINGFACE_API_KEY)
  : null;

let localEmbeddingPipeline: any = null;

// Hugging Face embeddings
export async function generateEmbeddingHF(text: string): Promise<number[]> {
  if (!hf) {
    throw new Error("Hugging Face API key not configured");
  }

  try {
    const response = await hf.featureExtraction({
      model: "sentence-transformers/all-MiniLM-L6-v2",
      inputs: text,
    });

    // Ensure we return a flat array of numbers
    if (Array.isArray(response)) {
      const flattened = response.flat();
      // Ensure all elements are numbers
      if (flattened.every((item) => typeof item === "number")) {
        return flattened as number[];
      }
    }

    throw new Error("Unexpected response format from Hugging Face");
  } catch (error) {
    console.error("Hugging Face embedding error:", error);
    throw error;
  }
}

// Local embeddings using transformers.js
export async function generateEmbeddingLocal(text: string): Promise<number[]> {
  try {
    // Dynamically import the transformers library
    const { pipeline } = await import("@xenova/transformers");

    // Initialize the pipeline if not already done
    if (!localEmbeddingPipeline) {
      localEmbeddingPipeline = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }

    const output = await localEmbeddingPipeline(text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert tensor to array
    return Array.from(output.data);
  } catch (error) {
    console.error("Local embedding error:", error);
    throw error;
  }
}

// Main function to generate embedding with fallback
export async function generateEmbedding(text: string): Promise<number[]> {
  // Normalize text
  const normalizedText = text.toLowerCase().trim().replace(/\s+/g, " ");

  try {
    // Try Hugging Face first
    if (hf) {
      return await generateEmbeddingHF(normalizedText);
    }
  } catch (error) {
    console.warn("Hugging Face embedding failed, trying local model:", error);
  }

  try {
    // Fallback to local model
    return await generateEmbeddingLocal(normalizedText);
  } catch (error) {
    console.error("All embedding methods failed:", error);
    throw new Error("Failed to generate embedding from any provider");
  }
}

// Cosine similarity calculation
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let magnitude1 = 0;
  let magnitude2 = 0;

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    magnitude1 += vec1[i] * vec1[i];
    magnitude2 += vec2[i] * vec2[i];
  }

  magnitude1 = Math.sqrt(magnitude1);
  magnitude2 = Math.sqrt(magnitude2);

  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
}

// Text chunking utility
export function chunkText(text: string, maxChars: number): string[] {
  const chunks: string[] = [];
  let currentChunk = "";

  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length <= maxChars) {
      currentChunk += (currentChunk ? " " : "") + sentence;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk);
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}
