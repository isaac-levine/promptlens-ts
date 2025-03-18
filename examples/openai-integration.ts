// Import from local paths during development
import { PromptExperiment } from "../src/integrations/openai.js";
import { MetricsCollector } from "../src/core/metrics.js";
import { ExperimentResult } from "../src/types/experiment.js";
import { ChatCompletion } from "openai/resources/chat/completions";
import "dotenv/config";

// You'll need to install OpenAI as a dev dependency
// npm install --save-dev openai
import OpenAI from "openai";

// Create an OpenAI client
const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create a class with the enhanced OpenAI client
class MyOpenAIService {
  private openai: OpenAI;
  public metricsCollector: MetricsCollector;

  constructor() {
    this.openai = openaiClient;

    // Initialize the metrics collector with URL from environment variable
    this.metricsCollector = new MetricsCollector(true);
  }

  // Define the method that will use the OpenAI API
  // The decorator will wrap the return value in an ExperimentResult
  async getExplanation(params: any): Promise<ExperimentResult<ChatCompletion>> {
    const response = await this.openai.chat.completions.create(params);
    return {
      response,
      experiment: {
        id: "explanation-styles",
        variantIndex: 0,
        promptVariant: "",
        metrics: {
          experiment_id: "explanation-styles",
          prompt_hash: "",
          model: params.model || "unknown",
          latency_ms: 0,
          timestamp: Date.now(),
        },
      },
    };
  }
}

// Apply the decorator to the prototype
PromptExperiment({
  id: "explanation-styles",
  promptVariants: [
    "Explain the concept of recursion like I'm 5 years old",
    "Explain the concept of recursion with a technical definition",
    "Explain the concept of recursion using a story",
  ],
  distribution: "round-robin",
  trackMetrics: true,
})(
  MyOpenAIService.prototype,
  "getExplanation",
  Object.getOwnPropertyDescriptor(
    MyOpenAIService.prototype,
    "getExplanation"
  ) || {}
);

// Usage example
async function main() {
  const service = new MyOpenAIService();

  // Create a basic chat completion request
  const params = {
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: "Explain the concept of recursion" },
    ],
  };

  // The decorator will automatically replace the user message content with one of the variants
  const result = await service.getExplanation(params);

  console.log("Response:", result.response.choices[0].message.content);
  console.log("Experiment:", result.experiment);

  // Run a few more times to see different variants
  for (let i = 0; i < 3; i++) {
    const result = await service.getExplanation(params);
    console.log(`Run ${i + 2} - Variant: ${result.experiment.variantIndex}`);
  }

  // Make sure to flush any pending metrics before the program exits
  await service.metricsCollector.flush();
}

main().catch(console.error);
