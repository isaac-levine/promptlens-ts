/**
 * PromptLens SDK
 * Optimize and monitor your AI prompts
 */

// Export main client
export { default as PromptLens } from "./core/client.js";

// Export OpenAI integration
export { PromptExperiment } from "./integrations/openai.js";

// Export types
export * from "./types/index.js";
export * from "./types/experiment.js";

// Export utilities
export * from "./utils/index.js";

// Export core functionality
export {
  rotatePrompt,
  rotatePromptForUser,
  randomPrompt,
  weightedPrompt,
  selectPromptVariant,
} from "./core/rotation.js";

export { MetricsCollector } from "./core/metrics.js";

// Version information
export const VERSION = "0.1.2";
