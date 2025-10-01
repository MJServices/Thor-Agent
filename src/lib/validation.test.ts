import { validateChatRequest, validateImageRequest } from "./validation";

describe("Validation Utilities", () => {
  describe("validateChatRequest", () => {
    it("should validate a correct chat request", () => {
      const data = {
        messages: [
          { role: "user", content: "Hello" },
          { role: "assistant", content: "Hi there!" },
        ],
      };

      expect(() => validateChatRequest(data)).not.toThrow();
    });

    it("should reject empty messages array", () => {
      const data = {
        messages: [],
      };

      expect(() => validateChatRequest(data)).toThrow();
    });

    it("should reject invalid role", () => {
      const data = {
        messages: [{ role: "invalid" as any, content: "Hello" }],
      };

      expect(() => validateChatRequest(data)).toThrow();
    });

    it("should reject empty content", () => {
      const data = {
        messages: [{ role: "user", content: "" }],
      };

      expect(() => validateChatRequest(data)).toThrow();
    });
  });

  describe("validateImageRequest", () => {
    it("should validate a correct image request", () => {
      const data = {
        prompt: "A beautiful landscape",
      };

      expect(() => validateImageRequest(data)).not.toThrow();
    });

    it("should reject short prompt", () => {
      const data = {
        prompt: "A",
      };

      expect(() => validateImageRequest(data)).toThrow();
    });

    it("should reject long prompt", () => {
      const data = {
        prompt: "A".repeat(501),
      };

      expect(() => validateImageRequest(data)).toThrow();
    });

    it("should validate with dimensions", () => {
      const data = {
        prompt: "A beautiful landscape",
        width: 512,
        height: 512,
      };

      expect(() => validateImageRequest(data)).not.toThrow();
    });

    it("should reject invalid dimensions", () => {
      const data = {
        prompt: "A beautiful landscape",
        width: 100,
        height: 2000,
      };

      expect(() => validateImageRequest(data)).toThrow();
    });
  });
});
