import Groq from "groq-sdk";
import { HfInference } from "@huggingface/inference";

// Initialize clients if API keys are available
const groq = process.env.GROQ_API_KEY
  ? new Groq({ apiKey: process.env.GROQ_API_KEY })
  : null;
const hf = process.env.HUGGINGFACE_API_KEY
  ? new HfInference(process.env.HUGGINGFACE_API_KEY)
  : null;

let localPipeline: any = null;

// System prompt to establish Thor's identity
const SYSTEM_PROMPT = `You are Thor, an advanced AI assistant created by MJ Services. You are knowledgeable, helpful, and friendly. Your purpose is to assist users with their questions and tasks. You have a deep understanding of various topics and can provide detailed explanations. Always be polite, professional, and concise in your responses. If you don't know the answer to something, admit it honestly rather than making up information. Remember to stay in character as Thor throughout the conversation.`;

// Groq integration
export async function callGroq(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  if (!groq) {
    throw new Error("Groq API key not configured");
  }

  try {
    // Add system prompt if not already present
    const messagesWithSystem =
      messages[0]?.role === "system"
        ? messages
        : [{ role: "system" as const, content: SYSTEM_PROMPT }, ...messages];

    const chatCompletion = await groq.chat.completions.create({
      messages: messagesWithSystem,
      model: "llama-3.1-8b-instant",
    });

    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API error:", error);
    throw error;
  }
}

// Hugging Face integration with timeout
export async function callHuggingFace(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  if (!hf) {
    throw new Error("Hugging Face API key not configured");
  }

  try {
    // Add system prompt to the beginning
    const promptWithSystem =
      messages[0]?.role === "system"
        ? messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
        : `system: ${SYSTEM_PROMPT}\n` +
          messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    // Add timeout to the request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: promptWithSystem,
      parameters: {
        max_new_tokens: 500,
      },
    });

    clearTimeout(timeoutId);
    return response.generated_text || "";
  } catch (error) {
    console.error("Hugging Face API error:", error);
    throw error;
  }
}

// Local model fallback using transformers.js
export async function callLocalModel(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
): Promise<string> {
  try {
    // Add system prompt to the beginning
    const promptWithSystem =
      messages[0]?.role === "system"
        ? messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n")
        : `system: ${SYSTEM_PROMPT}\n` +
          messages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    // Dynamically import the transformers library
    const { pipeline } = await import("@xenova/transformers");

    // Initialize the pipeline if not already done
    if (!localPipeline) {
      localPipeline = await pipeline(
        "text2text-generation",
        "Xenova/LaMini-Flan-T5-783M"
      );
    }

    const response = await localPipeline(promptWithSystem, {
      max_new_tokens: 200,
      temperature: 0.7,
    });

    return response[0]?.generated_text || "";
  } catch (error) {
    console.error("Local model error:", error);
    throw error;
  }
}

// Main function to generate chat response with fallback logic
export async function generateChatResponse(
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>,
  userId?: string
): Promise<{ response: string; model: string }> {
  try {
    // Try Groq first
    if (groq) {
      // Cast messages to the correct type
      const typedMessages = messages as Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>;
      const response = await callGroq(typedMessages);
      return { response, model: "groq" };
    }
  } catch (error) {
    console.warn("Groq failed, trying Hugging Face:", error);
  }

  try {
    // Fallback to Hugging Face
    if (hf) {
      const typedMessages = messages as Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>;
      const response = await callHuggingFace(typedMessages);
      return { response, model: "huggingface" };
    }
  } catch (error) {
    console.warn("Hugging Face failed, trying local model:", error);
  }

  try {
    // Final fallback to local model
    const typedMessages = messages as Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }>;
    const response = await callLocalModel(typedMessages);
    return { response, model: "local" };
  } catch (error) {
    console.error("All providers failed:", error);
    throw new Error("Failed to generate response from any AI provider");
  }
}
