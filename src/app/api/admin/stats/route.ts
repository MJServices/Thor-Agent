import { NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/admin-auth";
import User from "@/models/User";
import Chat from "@/models/Chat";
import Image from "@/models/Image";
import UsageLog from "@/models/UsageLog";
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

    // Calculate date ranges
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User stats
    const totalUsers = await User.countDocuments();
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: startOfMonth },
    });
    const adminUsers = await User.countDocuments({ isAdmin: true });

    // Chat stats
    const totalChats = await Chat.countDocuments();
    const chatsToday = await Chat.countDocuments({
      createdAt: { $gte: startOfDay },
    });

    // Average messages per chat
    const avgMessagesPerChatResult = await Chat.aggregate([
      { $project: { messageCount: { $size: "$messages" } } },
      { $group: { _id: null, avgMessages: { $avg: "$messageCount" } } },
    ]);

    const avgMessagesPerChat =
      avgMessagesPerChatResult.length > 0
        ? Math.round(avgMessagesPerChatResult[0].avgMessages * 100) / 100
        : 0;

    // Image stats
    const totalImages = await Image.countDocuments();
    const imagesToday = await Image.countDocuments({
      createdAt: { $gte: startOfDay },
    });
    const safetyRejections = await Image.countDocuments({
      safetyCheckPassed: false,
    });

    // API usage stats
    const totalApiCalls = await UsageLog.countDocuments();

    // Average latency
    const avgLatencyResult = await UsageLog.aggregate([
      { $group: { _id: null, avgLatency: { $avg: "$latencyMs" } } },
    ]);

    const avgLatency =
      avgLatencyResult.length > 0
        ? Math.round(avgLatencyResult[0].avgLatency)
        : 0;

    // Error rate
    const errorCalls = await UsageLog.countDocuments({
      status: { $gte: 400 },
    });

    const errorRate =
      totalApiCalls > 0
        ? Math.round((errorCalls / totalApiCalls) * 10000) / 100
        : 0;

    // Requests by endpoint
    const byEndpointResult = await UsageLog.aggregate([
      { $group: { _id: "$route", count: { $sum: 1 } } },
    ]);

    const byEndpoint = byEndpointResult.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Provider usage
    const providerUsageResult = await UsageLog.aggregate([
      { $match: { provider: { $exists: true, $ne: null } } },
      { $group: { _id: "$provider", count: { $sum: 1 } } },
    ]);

    const providers = providerUsageResult.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    // Return stats
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: {
            total: totalUsers,
            newThisMonth: newUsersThisMonth,
            admins: adminUsers,
          },
          chats: {
            total: totalChats,
            today: chatsToday,
            avgMessagesPerChat,
          },
          images: {
            total: totalImages,
            today: imagesToday,
            safetyRejections,
          },
          apiUsage: {
            totalCalls: totalApiCalls,
            avgLatency,
            errorRate,
            byEndpoint,
          },
          providers,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Admin stats error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to fetch stats",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
