import { NextRequest } from "next/server";
import { verifyToken } from "./auth";
import User, { IUser } from "@/models/User";

// Check if user is admin
export function isAdminUser(user: IUser): boolean {
  // Check both isAdmin field and email match
  return user.isAdmin === true && user.email === process.env.ADMIN_EMAIL;
}

// Verify admin access
export async function verifyAdminAccess(req: NextRequest): Promise<{
  authorized: boolean;
  user?: IUser;
  error?: string;
}> {
  try {
    // Check if ADMIN_EMAIL is configured
    if (!process.env.ADMIN_EMAIL) {
      return {
        authorized: false,
        error: "Admin email not configured in environment variables",
      };
    }

    // Extract JWT token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return {
        authorized: false,
        error: "Authentication required",
      };
    }

    // Verify token
    const decoded = await verifyToken(token);

    if (!decoded || typeof decoded !== "object" || !("id" in decoded)) {
      return {
        authorized: false,
        error: "Invalid token",
      };
    }

    // Fetch user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return {
        authorized: false,
        error: "User not found",
      };
    }

    // Check if user is admin
    if (!isAdminUser(user)) {
      return {
        authorized: false,
        error: "Admin access required",
      };
    }

    return {
      authorized: true,
      user,
    };
  } catch (error) {
    console.error("Admin auth error:", error);
    return {
      authorized: false,
      error: "Authentication failed",
    };
  }
}

// Higher-order function to wrap API route handlers
export function requireAdmin(handler: Function) {
  return async function (req: NextRequest, ...args: any[]) {
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

    // Pass user object to handler
    return handler(req, authResult.user, ...args);
  };
}

// Validate environment configuration
export function validateAdminConfig() {
  if (!process.env.ADMIN_EMAIL) {
    throw new Error(
      "ADMIN_EMAIL environment variable is required for admin functionality"
    );
  }
}

// Check if admin user exists
export async function checkAdminUserExists() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    if (!adminEmail) return false;

    const adminUser = await User.findOne({
      email: adminEmail,
      isAdmin: true,
    });

    return !!adminUser;
  } catch (error) {
    console.error("Error checking admin user:", error);
    return false;
  }
}
