import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import Chat, { IChatMessage } from "@/models/Chat";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
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

    // Get query parameters for pagination
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Fetch chat history for the user
    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("title createdAt updatedAt messages");

    // Get total count for pagination
    const totalChats = await Chat.countDocuments({ userId });

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chats: chats.map((chat) => ({
            id: chat._id,
            title: chat.title,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            messageCount: chat.messages.length,
            // Get the last few messages for preview (instead of first few)
            preview: chat.messages.slice(-2).map((msg: IChatMessage) => ({
              role: msg.role,
              content:
                msg.content.substring(0, 100) +
                (msg.content.length > 100 ? "..." : ""),
            })),
          })),
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(totalChats / limit),
            totalChats,
            hasNextPage: page < Math.ceil(totalChats / limit),
            hasPrevPage: page > 1,
          },
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Chat history API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to fetch chat history",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
