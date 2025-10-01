import { z } from "zod";

// Chat request schema
export const chatRequestSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1),
});

// Image request schema
export const imageRequestSchema = z.object({
  prompt: z.string().min(3).max(500),
  width: z.number().min(256).max(1024).optional().default(512),
  height: z.number().min(256).max(1024).optional().default(512),
});

// Validation functions
export function validateChatRequest(data: unknown) {
  return chatRequestSchema.parse(data);
}

export function validateImageRequest(data: unknown) {
  return imageRequestSchema.parse(data);
}

// Input sanitization
export function sanitizeInput(text: string): string {
  // Remove potentially harmful characters
  return text
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
}
