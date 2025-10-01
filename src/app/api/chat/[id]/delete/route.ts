import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import Chat from "@/models/Chat";
import connectToDatabase from "@/lib/mongodb";

export async function DELETE(
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

    // Delete the specific chat
    const result = await Chat.deleteOne({ _id: chatId, userId });

    if (result.deletedCount === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Chat not found or unauthorized" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Chat deleted successfully"
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error: any) {
    console.error("Delete chat API error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to delete chat"
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}