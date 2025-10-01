import { HfInference } from "@huggingface/inference";

// Initialize Hugging Face client if API key is available
let hf: HfInference | null = null;
if (process.env.HUGGINGFACE_API_KEY) {
  try {
    hf = new HfInference(process.env.HUGGINGFACE_API_KEY);
  } catch (error) {
    console.error("Failed to initialize Hugging Face client:", error);
  }
}

// Simple content safety check
const BLOCKED_WORDS = [
  "violence",
  "blood",
  "weapon",
  "gun",
  "knife",
  "nude",
  "naked",
  "sex",
  "sexual",
  "explicit",
  "nsfw",
  "porn",
  "xxx",
  "drugs",
  "alcohol",
  "tobacco",
];

export async function checkContentSafety(
  prompt: string
): Promise<{ safe: boolean; reason?: string }> {
  const lowerPrompt = prompt.toLowerCase();

  for (const word of BLOCKED_WORDS) {
    if (lowerPrompt.includes(word)) {
      return { safe: false, reason: `Content contains blocked word: ${word}` };
    }
  }

  return { safe: true };
}

// Generate image using NocodePakistan API
export async function generateWithNocodePakistan(
  prompt: string
): Promise<{ imageBase64?: string; imageUrl?: string }> {
  if (!process.env.NCP_API) {
    throw new Error("NocodePakistan API key not configured");
  }

  // Try different models in order of preference
  const models = [
    "provider-4/imagen-4",
    "provider-4/imagen-3",
    "provider-4/qwen-image",
  ];

  // Try each model with retry logic
  for (const model of models) {
    // Try each model up to 2 times
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`Attempting NocodePakistan API call with ${model} (attempt ${attempt})`);

        const response = await fetch(
          "http://chat.nocodepakistan.pk/v1/images/generations",
          {
            headers: {
              Authorization: `Bearer ${process.env.NCP_API}`,
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
              prompt: prompt,
              model: model,
            }),
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.warn(`NocodePakistan API error with ${model} (attempt ${attempt}):`, errorText);
          
          // If it's a server error (5xx), wait before retrying
          if (response.status >= 500 && response.status < 600) {
            console.log(`Server error, waiting before retry...`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            continue; // Retry the same model
          }
          
          // For other errors, try the next model
          break;
        }

        const data = await response.json();
        console.log(
          `NocodePakistan API response with ${model}:`,
          JSON.stringify(data, null, 2)
        );

        // Check if the response contains base64 image data directly
        if (data.data && data.data.imageBase64) {
          console.log(
            `Successfully generated image via NocodePakistan API with ${model}`
          );
          return { imageBase64: data.data.imageBase64 };
        }

        // Check for URL structure (which is what the API actually returns)
        if (
          data.data &&
          Array.isArray(data.data) &&
          data.data[0] &&
          data.data[0].url
        ) {
          // Return the URL directly instead of trying to fetch it
          // This avoids issues with temporary URLs expiring
          const imageUrl = data.data[0].url;
          console.log("Returning image URL directly:", imageUrl);
          console.log(
            `Successfully generated image via NocodePakistan API with ${model}`
          );
          return { imageUrl: imageUrl };
        }

        throw new Error("NocodePakistan API returned no recognizable image data");
      } catch (error: any) {
        console.error(`NocodePakistan API error with ${model} (attempt ${attempt}):`, error);
        
        // If it's a network error, wait before retrying
        if (error.message && (error.message.includes("fetch") || error.message.includes("network"))) {
          console.log("Network error, waiting before retry...");
          await new Promise(resolve => setTimeout(resolve, 3000));
          continue; // Retry the same model
        }
        
        // For other errors, try the next model
        break;
      }
    }
  }

  // If we get here, all models failed
  throw new Error("All NocodePakistan models failed");
}

// Generate a simple placeholder image as a fallback
function generatePlaceholderImage(prompt: string): string {
  // Create a simple SVG placeholder image
  const svg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#7c3aed"/>
      <text x="50%" y="40%" font-family="Arial" font-size="24" fill="#ffd700" text-anchor="middle" dominant-baseline="middle">
        Image: ${prompt}
      </text>
      <text x="50%" y="60%" font-family="Arial" font-size="16" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
        (Placeholder due to service unavailability)
      </text>
    </svg>
  `;

  // Convert SVG to base64
  return Buffer.from(svg).toString("base64");
}

// Main function to generate image - now uses Google AI Studio API as primary provider
export async function generateImage(
  prompt: string,
  userId?: string
): Promise<{
  imageBase64?: string;
  imageUrl?: string;
  provider: string;
  safetyCheckPassed: boolean;
}> {
  console.log("Generating image with prompt:", prompt);

  // First run content safety check
  const safetyResult = await checkContentSafety(prompt);
  if (!safetyResult.safe) {
    throw new Error(`Content safety check failed: ${safetyResult.reason}`);
  }

  // Try Google AI Studio API first (as requested)
  try {
    const result = await generateWithGoogleAIStudio(prompt);
    return { ...result, provider: "google-ai-studio", safetyCheckPassed: true };
  } catch (googleAIError: any) {
    console.warn("Google AI Studio API failed:", googleAIError.message);
    
    // Fallback to NocodePakistan API
    try {
      const result = await generateWithNocodePakistan(prompt);
      return { ...result, provider: "nocodepakistan", safetyCheckPassed: true };
    } catch (ncpError: any) {
      console.warn("NocodePakistan API failed:", ncpError.message);
      
      // Fallback to Hugging Face
      try {
        const result = await generateWithHuggingFace(prompt);
        return { ...result, provider: "huggingface", safetyCheckPassed: true };
      } catch (hfError: any) {
        console.warn("Hugging Face API failed:", hfError.message);
        
        // Fallback to Stability AI
        try {
          const result = await generateWithStability(prompt);
          return { ...result, provider: "stability", safetyCheckPassed: true };
        } catch (stabilityError: any) {
          console.warn("Stability AI failed:", stabilityError.message);
          
          // Final fallback to placeholder image
          console.warn("All image providers failed, generating placeholder image");
          const placeholderBase64 = generatePlaceholderImage(prompt);
          return {
            imageBase64: placeholderBase64,
            provider: "placeholder",
            safetyCheckPassed: true,
          };
        }
      }
    }
  }
}

// Direct API call to Hugging Face
export async function generateWithHuggingFaceDirect(
  prompt: string
): Promise<{ imageBase64?: string }> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key not configured");
  }

  try {
    console.log(
      "Attempting direct Hugging Face API call with stable-diffusion-2-1"
    );

    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          inputs: prompt,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Hugging Face API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    // Convert response to base64
    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    console.log("Successfully generated image via direct API call");
    return { imageBase64: base64 };
  } catch (error: any) {
    console.error("Direct Hugging Face API error:", error);
    if (
      error.message &&
      (error.message.includes("fetch") || error.message.includes("network"))
    ) {
      throw new Error(
        "Network error when connecting to Hugging Face. Please check your internet connection."
      );
    }
    throw new Error(
      `Hugging Face direct API error: ${error.message || "Unknown error"}`
    );
  }
}

// Hugging Face image generation with primary model
export async function generateWithHuggingFace(
  prompt: string
): Promise<{ imageBase64?: string }> {
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error("Hugging Face API key not configured");
  }

  try {
    // Try direct API call first (more reliable)
    try {
      console.log("Trying direct API call first");
      const result = await generateWithHuggingFaceDirect(prompt);
      return result;
    } catch (directError: any) {
      console.warn("Direct API call failed, trying SDK:", directError.message);

      // Fallback to SDK approach
      const client = new HfInference(process.env.HUGGINGFACE_API_KEY);

      // Try the primary model first
      try {
        console.log(
          "Attempting Hugging Face generation with stable-diffusion-2-1"
        );
        const blob = await client.textToImage({
          inputs: prompt,
          model: "stabilityai/stable-diffusion-2-1",
        });

        // Convert blob to base64 with better error handling
        try {
          console.log("Converting blob to base64");
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          console.log("Successfully converted to base64");
          return { imageBase64: base64 };
        } catch (conversionError: any) {
          console.error("Error converting blob to base64:", conversionError);
          throw new Error("Failed to process image data from Hugging Face");
        }
      } catch (primaryModelError: any) {
        console.warn(
          "Primary Hugging Face model failed, trying alternative model:",
          primaryModelError.message
        );

        // Fallback to alternative model
        try {
          console.log(
            "Attempting Hugging Face generation with stable-diffusion-v1-5"
          );
          const blob = await client.textToImage({
            inputs: prompt,
            model: "runwayml/stable-diffusion-v1-5",
          });

          // Convert blob to base64
          console.log("Converting fallback blob to base64");
          const arrayBuffer = await blob.arrayBuffer();
          const base64 = Buffer.from(arrayBuffer).toString("base64");
          console.log("Successfully converted fallback to base64");
          return { imageBase64: base64 };
        } catch (alternativeModelError: any) {
          console.warn(
            "Alternative Hugging Face model failed:",
            alternativeModelError.message
          );
          throw alternativeModelError;
        }
      }
    }
  } catch (error: any) {
    console.error("Hugging Face image generation error:", error);
    // Provide more specific error message
    if (
      error.message &&
      (error.message.includes("fetch") ||
        error.message.includes("network") ||
        error.message.includes("blob"))
    ) {
      throw new Error(
        "Network error when connecting to Hugging Face. Please check your internet connection."
      );
    }
    throw new Error(`Hugging Face error: ${error.message || "Unknown error"}`);
  }
}

// Stability AI integration (fallback approach)
export async function generateWithStability(
  prompt: string
): Promise<{ imageBase64?: string; imageUrl?: string }> {
  if (!process.env.STABILITY_API_KEY) {
    throw new Error("Stability AI API key not configured");
  }

  try {
    const response = await fetch(
      "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [{ text: prompt }],
          cfg_scale: 7,
          height: 1024,  // Changed from 512 to 1024 (allowed dimension)
          width: 1024,   // Changed from 512 to 1024 (allowed dimension)
          samples: 1,
          steps: 30,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Stability AI API error: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const imageBase64 = data.artifacts?.[0]?.base64;

    if (!imageBase64) {
      throw new Error("Stability AI returned no image data");
    }

    return { imageBase64 };
  } catch (error: any) {
    console.error("Stability AI error:", error);
    if (
      error.message &&
      (error.message.includes("fetch") || error.message.includes("network"))
    ) {
      throw new Error(
        "Network error when connecting to Stability AI. Please check your internet connection."
      );
    }
    throw new Error(`Stability AI error: ${error.message || "Unknown error"}`);
  }
}

// Generate image using Google AI Studio API with Nano Banana (Gemini's image generation)
export async function generateWithGoogleAIStudio(
  prompt: string
): Promise<{ imageBase64?: string }> {
  if (!process.env.AI_STUDIO) {
    throw new Error("Google AI Studio API key not configured");
  }

  try {
    console.log("Attempting Google AI Studio API call with Nano Banana (Gemini)");
    
    // Use the specific model that supports image output via API as per project memory
    const model = "gemini-2.5-flash-image-preview";
    
    try {
      console.log(`Trying model: ${model}`);
      
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          headers: {
            "x-goog-api-key": process.env.AI_STUDIO,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            contents: [{
              parts: [
                { text: prompt }
              ]
            }]
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(`Google AI Studio API response with model ${model}:`, JSON.stringify(data, null, 2));
        
        // Check if the response contains image data
        if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) {
          for (const part of data.candidates[0].content.parts) {
            // Check for image data in the response
            if (part.inlineData && part.inlineData.data) {
              console.log(`Successfully generated image via Google AI Studio API with model ${model}`);
              return { imageBase64: part.inlineData.data };
            }
          }
        }
        
        throw new Error("Google AI Studio API returned no recognizable image data");
      } else {
        const errorText = await response.text();
        console.error(`Model ${model} failed with status ${response.status}:`, errorText);
        throw new Error(`Google AI Studio API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
    } catch (modelError: any) {
      console.error(`Model ${model} failed with error:`, modelError.message);
      throw modelError;
    }
  } catch (error: any) {
    console.error("Google AI Studio API error:", error);
    if (error.message && (error.message.includes("fetch") || error.message.includes("network"))) {
      throw new Error("Network error when connecting to Google AI Studio. Please check your internet connection.");
    }
    throw new Error(`Google AI Studio API error: ${error.message || "Unknown error"}`);
  }
}
