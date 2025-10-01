import { NextRequest } from "next/server";
import { verifyAdminAccess } from "@/lib/admin-auth";
import Settings from "@/models/Settings";
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

    // Fetch all settings from database
    const dbSettings = await Settings.find({});

    // Convert to key-value object
    const settings: Record<string, any> = {};
    dbSettings.forEach((setting) => {
      settings[setting.key] = setting.value;
    });

    // Check API key presence (not actual values)
    const apiKeys = {
      groq: !!process.env.GROQ_API_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      stability: !!process.env.STABILITY_API_KEY,
      pinecone: !!(process.env.PINECONE_API_KEY && process.env.PINECONE_ENV),
    };

    // Return settings
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          settings,
          apiKeys,
          environment: process.env.NODE_ENV || "development",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Admin settings error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to fetch settings",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(req: NextRequest) {
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

    // Supported settings
    const supportedSettings = [
      "rag_enabled",
      "vector_db_provider",
      "default_chat_model",
      "max_chat_history",
    ];

    // Validate and update settings
    for (const [key, value] of Object.entries(body)) {
      // Check if setting is supported
      if (!supportedSettings.includes(key)) {
        return new Response(
          JSON.stringify({
            success: false,
            message: `Unsupported setting: ${key}`,
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Validate specific settings
      if (
        key === "vector_db_provider" &&
        value !== "chromadb" &&
        value !== "pinecone" &&
        value !== "qdrant"
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            message:
              "Invalid vector_db_provider. Must be chromadb, pinecone, or qdrant",
          }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Update setting in database
      await Settings.findOneAndUpdate(
        { key },
        {
          key,
          value,
          updatedBy: adminUser._id,
        },
        { upsert: true, new: true }
      );
    }

    // Fetch updated settings
    const dbSettings = await Settings.find({});
    const settings: Record<string, any> = {};
    dbSettings.forEach((setting) => {
      settings[setting.key] = setting.value;
    });

    // Check API key presence
    const apiKeys = {
      groq: !!process.env.GROQ_API_KEY,
      huggingface: !!process.env.HUGGINGFACE_API_KEY,
      stability: !!process.env.STABILITY_API_KEY,
      pinecone: !!(process.env.PINECONE_API_KEY && process.env.PINECONE_ENV),
    };

    // Return updated settings
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          settings,
          apiKeys,
          environment: process.env.NODE_ENV || "development",
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error: any) {
    console.error("Admin settings update error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "Failed to update settings",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
