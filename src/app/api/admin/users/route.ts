import { NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/admin-auth";
import User from "@/models/User";
import Chat from "@/models/Chat";
import Image from "@/models/Image";
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
    const search = url.searchParams.get("search") || "";

    // Build query
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await User.countDocuments(query);

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users,
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
    console.error("Admin users list error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to fetch users",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function PATCH(req: NextRequest) {
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

    const adminUser = authResult.user!;

    // Parse request body
    const body = await req.json();
    const { userId, isAdmin } = body;

    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prevent admin from demoting themselves
    if (userId === (adminUser._id as any).toString() && !isAdmin) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You cannot demote yourself",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prevent demoting the ADMIN_EMAIL user
    const adminEmailUser = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (
      adminEmailUser &&
      userId === adminEmailUser._id.toString() &&
      !isAdmin
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cannot demote the primary admin user",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Return updated user
    return new Response(
      JSON.stringify({
        success: true,
        data: updatedUser,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Admin user update error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to update user",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function DELETE(req: NextRequest) {
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

    const adminUser = authResult.user!;

    // Parse query parameters
    const url = new URL(req.url);
    let userId = url.searchParams.get("userId");

    // If not in query params, check body
    if (!userId) {
      const body = await req.json();
      userId = body.userId;
    }

    // Validate input
    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User ID is required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prevent admin from deleting themselves
    if (userId === (adminUser._id as any).toString()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "You cannot delete yourself",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Prevent deletion of ADMIN_EMAIL user
    const adminEmailUser = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (adminEmailUser && userId === adminEmailUser._id.toString()) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Cannot delete the primary admin user",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "User not found",
        }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Cascade delete: remove user's chats and images
    await Chat.deleteMany({ userId });
    await Image.deleteMany({ userId });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "User deleted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Admin user delete error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to delete user",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
