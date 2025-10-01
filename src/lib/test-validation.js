const { validateChatRequest, validateImageRequest } = require("./validation");

// Test chat validation
console.log("Testing chat validation...");

try {
  const validChatData = {
    messages: [
      { role: "user", content: "Hello" },
      { role: "assistant", content: "Hi there!" },
    ],
  };

  const result = validateChatRequest(validChatData);
  console.log("Valid chat data:", result);
} catch (error) {
  console.error("Chat validation failed:", error);
}

try {
  const invalidChatData = {
    messages: [],
  };

  validateChatRequest(invalidChatData);
  console.log("Invalid chat data was accepted (unexpected)");
} catch (error) {
  console.log("Correctly rejected invalid chat data:", error);
}

// Test image validation
console.log("\nTesting image validation...");

try {
  const validImageData = {
    prompt: "A beautiful landscape",
  };

  const result = validateImageRequest(validImageData);
  console.log("Valid image data:", result);
} catch (error) {
  console.error("Image validation failed:", error);
}

try {
  const invalidImageData = {
    prompt: "A",
  };

  validateImageRequest(invalidImageData);
  console.log("Invalid image data was accepted (unexpected)");
} catch (error) {
  console.log("Correctly rejected invalid image data:", error);
}

console.log("\nValidation tests completed.");
