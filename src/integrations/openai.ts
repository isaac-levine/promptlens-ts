import { ExperimentConfig, ExperimentResult } from "../types/experiment.js";
import {
  selectPromptVariant,
  getCurrentVariantIndex,
} from "../core/rotation.js";
import { MetricsCollector } from "../core/metrics.js";

/**
 * Decorator for running prompt experiments with OpenAI
 *
 * @param config Configuration for the experiment
 * @returns A decorated method that runs the experiment
 */
export function PromptExperiment(config: ExperimentConfig) {
  const experimentId = config.id || `exp_${Date.now()}`;

  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      // Get the metrics collector instance if available in the instance
      const instance = this as any;
      const metricsCollector = instance.metricsCollector as
        | MetricsCollector
        | undefined;

      let model = config.model || "unknown"; // Allow model from config

      // Attempt to extract model from the execution context
      try {
        // Method 1: Look inside the function implementation
        const fnStr = originalMethod.toString();
        const modelMatch = fnStr.match(/model:\s*["']([^"']+)["']/);
        if (modelMatch && modelMatch[1]) {
          model = modelMatch[1];
        }

        // Method 2: Look for client.defaultModel property
        if (instance.client && instance.client.defaultModel) {
          model = instance.client.defaultModel;
        }

        // Method 3: Try to extract from args
        const extractedModel = extractModelFromArgs(args);
        if (extractedModel) {
          model = extractedModel;
        }
      } catch (e) {
        // Silently continue if model extraction fails
      }

      // Select a prompt variant based on the configuration
      const selectedPrompt = selectPromptVariant(
        experimentId,
        config.promptVariants,
        config.distribution,
        config.weights
      );

      // Get the index of the selected variant
      const variantIndex = getCurrentVariantIndex(experimentId);

      // Replace the prompt in the arguments
      const modifiedArgs = replacePromptInArgs(args, selectedPrompt);

      // Measure performance
      const startTime = Date.now();

      try {
        // Call the original method with the modified arguments
        const response = await originalMethod.apply(this, modifiedArgs);

        // Calculate latency
        const latency = Date.now() - startTime;

        // Log metrics if enabled
        if (config.trackMetrics && metricsCollector) {
          const promptHash = metricsCollector.hashPrompt(selectedPrompt);
          const model = extractModelFromArgs(args) || "unknown";

          metricsCollector
            .logMetric({
              experiment_id: experimentId,
              prompt_hash: promptHash,
              model: model,
              latency_ms: latency,
              timestamp: Date.now(),
            })
            .catch(() => {
              // Silently fail on metric logging errors
            });
        }

        // Wrap the response in an ExperimentResult
        return {
          response,
          experiment: {
            id: experimentId,
            variantIndex,
            promptVariant: selectedPrompt,
            metrics: {
              experiment_id: experimentId,
              latency_ms: latency,
              model: extractModelFromArgs(args) || "unknown",
              prompt_hash: metricsCollector
                ? metricsCollector.hashPrompt(selectedPrompt)
                : "not-calculated",
              timestamp: Date.now(),
            },
          },
        } as ExperimentResult;
      } catch (error) {
        // Re-throw the error
        throw error;
      }
    };

    return descriptor;
  };
}

/**
 * Replace the prompt in OpenAI API arguments
 *
 * @param args Original arguments to the API call
 * @param newPrompt New prompt to use
 * @returns Modified arguments with the new prompt
 */
function replacePromptInArgs(args: any[], newPrompt: string): any[] {
  if (!args || args.length === 0) {
    return args;
  }

  // Clone the arguments to avoid mutation
  const newArgs = [...args];

  // Handle different OpenAI API call patterns

  // Case 1: First argument is the messages array
  if (Array.isArray(newArgs[0])) {
    // Replace the content of the user message
    for (let i = 0; i < newArgs[0].length; i++) {
      if (newArgs[0][i].role === "user") {
        newArgs[0][i] = { ...newArgs[0][i], content: newPrompt };
        break;
      }
    }
  }
  // Case 2: First argument is an object with messages array
  else if (
    newArgs[0] &&
    typeof newArgs[0] === "object" &&
    newArgs[0].messages
  ) {
    // Replace the content of the user message
    for (let i = 0; i < newArgs[0].messages.length; i++) {
      if (newArgs[0].messages[i].role === "user") {
        newArgs[0].messages[i] = {
          ...newArgs[0].messages[i],
          content: newPrompt,
        };
        break;
      }
    }
  }
  // Case 3: First argument has a prompt property (older OpenAI API)
  else if (
    newArgs[0] &&
    typeof newArgs[0] === "object" &&
    "prompt" in newArgs[0]
  ) {
    newArgs[0] = { ...newArgs[0], prompt: newPrompt };
  }

  return newArgs;
}

/**
 * Extract the model name from OpenAI API arguments
 *
 * @param args Original arguments to the API call
 * @returns The model name or undefined if not found
 */
function extractModelFromArgs(args: any[]): string | undefined {
  if (!args || args.length === 0) {
    return undefined;
  }

  // Case 1: First argument is an object with model property
  if (args[0] && typeof args[0] === "object" && args[0].model) {
    return args[0].model;
  }

  // Case 2: Second argument is the model (some API patterns)
  if (args.length > 1 && typeof args[1] === "string") {
    return args[1];
  }

  return undefined;
}

/**
 * Example class showing how to use the PromptExperiment decorator with OpenAI
 *
 * This is an example implementation that can be used as a reference.
 */
export class EnhancedOpenAI {
  private openai: any;
  public metricsCollector: MetricsCollector;

  constructor(openaiClient: any, apiKey: string, metricsUrl: string) {
    this.openai = openaiClient;
    this.metricsCollector = new MetricsCollector(
      apiKey,
      metricsUrl,
      true // enabled by default
    );
  }

  // This is an example method showing how to use the decorator
  // The actual implementation would be provided by the user
  async createChatCompletion(params: any) {
    return this.openai.chat.completions.create(params);
  }
}
