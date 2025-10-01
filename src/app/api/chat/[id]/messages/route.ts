import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import Chat from "@/models/Chat";
import connectToDatabase from "@/lib/mongodb";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Connect to database
    await connectToDatabase();

    // Extract JWT token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Verify token
    const decoded = await verifyToken(token);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = decoded.id as string;
    const chatId = params.id;

    // Parse request body
    const body = await req.json();
    const { message } = body;

    // Validate message
    if (!message || !message.content) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Message content is required",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Saving message to chat:", { chatId, userId, message }); // Debug log

    // Find and update the chat
    const chat = await Chat.findOneAndUpdate(
      { _id: chatId, userId },
      {
        $push: { messages: message },
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!chat) {
      return new Response(
        JSON.stringify({ success: false, message: "Chat not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Chat updated successfully:", chat._id); // Debug log

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chatId: chat._id,
          messages: chat.messages,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Add message to chat API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to add message to chat",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
