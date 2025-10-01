import { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth";
import { validateImageRequest } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rate-limit";
import { generateImage } from "@/lib/image-providers";
import Image from "@/models/Image";
import UsageLog from "@/models/UsageLog";
import connectToDatabase from "@/lib/mongodb";

export async function POST(req: NextRequest) {
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

    // Parse request body
    const body = await req.json();

    // Validate request
    const validatedData = validateImageRequest(body);
    const { prompt, width, height } = validatedData;

    // Check rate limit
    const rateLimitResult = await checkRateLimit(userId, "image");

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

    // Measure latency
    const startTime = Date.now();

    // Generate image
    const result = await generateImage(prompt, userId);

    const latencyMs = Date.now() - startTime;

    // Save image record to database
    await Image.create({
      userId,
      prompt,
      imageBase64: result.imageBase64,
      imageUrl: result.imageUrl,
      provider: result.provider,
      safetyCheckPassed: result.safetyCheckPassed,
      metadata: { width, height },
    });

    // Log usage
    await UsageLog.create({
      userId,
      route: "/api/image",
      method: "POST",
      status: 200,
      latencyMs,
      provider: result.provider,
    });

    // Return response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          imageBase64: result.imageBase64,
          imageUrl: result.imageUrl,
          provider: result.provider,
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Image API error:", error);

    // Log error usage
    try {
      const token = req.cookies.get("token")?.value;
      const decoded = token ? await verifyToken(token) : null;
      const userId =
        decoded && typeof decoded === "object" && "id" in decoded
          ? (decoded.id as string)
          : null;

      await UsageLog.create({
        userId,
        route: "/api/image",
        method: "POST",
        status: 500,
        latencyMs: 0,
        errorMessage: error.message || "Unknown error",
      });
    } catch (logError) {
      console.error("Failed to log error:", logError);
    }

    // Return user-friendly error message
    const errorMessage = error.message || "Failed to generate image";

    // Special handling for content safety violations
    const status = errorMessage.includes("Content safety check failed")
      ? 400
      : 500;

    return new Response(
      JSON.stringify({
        success: false,
        message: errorMessage,
      }),
      {
        status,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
