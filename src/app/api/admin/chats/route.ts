import { NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/admin-auth";
import Chat from "@/models/Chat";
import User from "@/models/User";
import connectToDatabase from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Verify admin access
    const authResult = await verifyAdminAccess(req);

    if (!authResult.authorized) {
      return new Response(
        JSON.stringify({
          success: false,
          message: authResult.error,
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse query parameters
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const userId = url.searchParams.get("userId") || "";

    // Date range filters
    const startDate = url.searchParams.get("startDate");
    const endDate = url.searchParams.get("endDate");

    // Build query
    const query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (startDate || endDate) {
      query.createdAt = {};

      if (startDate) {
        try {
          query.createdAt.$gte = new Date(startDate);
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Invalid startDate format",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }

      if (endDate) {
        try {
          query.createdAt.$lte = new Date(endDate);
        } catch (error) {
          return new Response(
            JSON.stringify({
              success: false,
              message: "Invalid endDate format",
            }),
            {
              status: 400,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
      }
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const chats = await Chat.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("userId title aiModel createdAt messages");

    // Add message count to each chat
    const chatsWithMessageCount = chats.map((chat) => ({
      ...chat.toObject(),
      messageCount: chat.messages.length,
    }));

    // Get total count
    const total = await Chat.countDocuments(query);

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          chats: chatsWithMessageCount,
          total,
          page,
          pages: Math.ceil(total / limit),
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Admin chats list error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to fetch chats",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
