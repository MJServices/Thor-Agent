// Dynamic import for ChromaDB to avoid build issues
let ChromaClient: any;
let Collection: any;
import { generateEmbedding } from "./embeddings";

// VectorDB interface
export interface VectorDB {
  addDocuments(
    documents: Array<{ id: string; text: string; metadata?: object }>
  ): Promise<void>;
  query(
    text: string,
    topK: number
  ): Promise<Array<{ id: string; text: string; score: number }>>;
  deleteCollection(name: string): Promise<void>;
}

// ChromaDB implementation
class ChromaDB implements VectorDB {
  private client: any;
  private collectionName: string;
  private collectionPromise: Promise<any> | null = null;

  constructor(collectionName: string = "documents") {
    this.collectionName = collectionName;
    // Client will be initialized when needed
  }

  private async initClient() {
    if (!this.client) {
      try {
        // Dynamic import to avoid build issues
        const chromadb = await import("chromadb");
        ChromaClient = chromadb.ChromaClient;
        Collection = chromadb.Collection;
        this.client = new ChromaClient({
          path: process.env.CHROMA_DB_PATH || "http://localhost:8000",
        });
      } catch (error) {
        console.error("Failed to initialize ChromaDB client:", error);
        throw new Error("Vector database not available");
      }
    }
  }

  private async getCollection(): Promise<any> {
    await this.initClient();
    if (!this.collectionPromise) {
      this.collectionPromise = this.client.getOrCreateCollection({
        name: this.collectionName,
      });
    }
    return this.collectionPromise;
  }

  async addDocuments(
    documents: Array<{ id: string; text: string; metadata?: object }>
  ): Promise<void> {
    const collection = await this.getCollection();

    // Generate embeddings for all documents
    const embeddings = await Promise.all(
      documents.map((doc) => generateEmbedding(doc.text))
    );

    // Extract texts and ids
    const ids = documents.map((doc) => doc.id);
    const texts = documents.map((doc) => doc.text);
    const metadatas = documents.map((doc) => doc.metadata || {});

    await collection.add({
      ids,
      embeddings,
      documents: texts,
      metadatas,
    });
  }

  async query(
    text: string,
    topK: number
  ): Promise<Array<{ id: string; text: string; score: number }>> {
    const collection = await this.getCollection();

    // Generate embedding for the query text
    const queryEmbedding = await generateEmbedding(text);

    // Perform the search
    const results = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK,
    });

    // Process results
    if (!results.ids || !results.distances || !results.documents) {
      return [];
    }

    return results.ids[0].map((id: string, index: number) => ({
      id,
      text: results.documents?.[0][index] || "",
      score: 1 - (results.distances?.[0][index] || 0), // Convert distance to similarity score
    }));
  }

  async deleteCollection(name: string): Promise<void> {
    await this.initClient();
    await this.client.deleteCollection({ name });
  }
}

// Factory function to get the appropriate VectorDB implementation
export function getVectorDB(collectionName: string = "documents"): VectorDB {
  // Check for specific provider configuration
  if (process.env.PINECONE_API_KEY && process.env.PINECONE_ENV) {
    // Pinecone implementation would go here
    console.warn(
      "Pinecone implementation not yet available, falling back to ChromaDB"
    );
  }

  if (process.env.QDRANT_URL && process.env.QDRANT_API_KEY) {
    // Qdrant implementation would go here
    console.warn(
      "Qdrant implementation not yet available, falling back to ChromaDB"
    );
  }

  // Default to ChromaDB
  return new ChromaDB(collectionName);
}
