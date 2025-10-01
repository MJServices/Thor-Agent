import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { validateChatRequest } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateChatResponse } from "@/lib/ai-providers";
import { getVectorDB } from "@/lib/vector-db";
import Chat from "@/models/Chat";
import UsageLog from "@/models/UsageLog";
import Settings from "@/models/Settings";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Extract JWT token from cookies
    const token = req.cookies.get("token")?.value;

    // Debug logging
    console.log("Token from cookies:", token);
    console.log("All cookies:", req.cookies);

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify token
    const decoded = await verifyToken(token);

    // Debug logging
    console.log("Decoded token:", decoded);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = decoded.id as string;

    // Parse request body
    const body = await req.json();

    // Validate request
    const validatedData = validateChatRequest(body);
    const { messages } = validatedData;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(userId, "chat");

    if (!rateLimitResult.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Rate limit exceeded. Please try again later.",
          retryAfter: rateLimitResult.resetAt.toISOString(),
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": Math.ceil(
              (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
            ).toString(),
          },
        }
      );
    }

    // Check if RAG is enabled
    // Check if RAG is enabled (temporary implementation)
    let ragEnabled = false;
    try {
      const setting = await Settings.findOne({ key: "rag_enabled" });
      ragEnabled = setting ? setting.value : false;
    } catch (error) {
      console.warn("Failed to fetch RAG setting:", error);
    }

    let enhancedMessages = [...messages];

    if (ragEnabled) {
      try {
        // Get vector database
        const vectorDB = getVectorDB();

        // Use the last user message as the query
        const lastUserMessage = messages.filter((m) => m.role === "user").pop();

        if (lastUserMessage) {
          // Query similar documents
          const results = await vectorDB.query(lastUserMessage.content, 3);

          if (results.length > 0) {
            // Add context to the messages
            const context = results.map((r) => r.text).join("\n\n");
            enhancedMessages = [
              {
                role: "user",
                content: `Context: ${context}\n\nQuestion: ${lastUserMessage.content}`,
              },
              ...messages,
            ];
          }
        }
      } catch (error) {
        console.warn("RAG query failed:", error);
        // Continue without RAG if it fails
      }
    }

    // Measure latency
    const startTime = Date.now();

    // Generate AI response
    const { response, model } = await generateChatResponse(
      enhancedMessages,
      userId
    );

    const latencyMs = Date.now() - startTime;

    // Save conversation to database
    const title =
      messages[0]?.content?.substring(0, 50) +
      (messages[0]?.content?.length > 50 ? "..." : "");

    const chat = await Chat.create({
      userId,
      messages: [
        ...messages,
        { role: "assistant", content: response, timestamp: new Date() },
      ],
      aiModel: model,
      title,
    });

    // Log usage
    await UsageLog.create({
      userId,
      route: "/api/chat",
      method: "POST",
      status: 200,
      latencyMs,
      provider: model,
    });

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        data: { response, model, chatId: chat._id },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Chat API error:", error);

    // Log error usage
    try {
      const token = req.cookies.get("token")?.value;
      const decoded = token ? await verifyToken(token) : null;
      const userId =
        decoded && typeof decoded === "object" && "id" in decoded
          ? decoded.id
          : null;

      await UsageLog.create({
        userId,
        route: "/api/chat",
        method: "POST",
        status: 500,
        latencyMs: 0,
        errorMessage: error.message || "Unknown error",
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    // Return user-friendly error message
    let errorMessage = "Failed to generate response";
    if (error.message) {
      errorMessage = error.message;
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
