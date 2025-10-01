import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import Chat from "@/models/Chat";
import connectToDatabase from "@/lib/mongodb";

export async function GET(
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

    // Fetch the specific chat
    const chat = await Chat.findOne({ _id: chatId, userId });

    if (!chat) {
      return new Response(
        JSON.stringify({ success: false, message: "Chat not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Loaded chat:", chat); // Debug log

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: chat._id,
          title: chat.title,
          createdAt: chat.createdAt,
          updatedAt: chat.updatedAt,
          messages: chat.messages,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Load chat API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to load chat",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
