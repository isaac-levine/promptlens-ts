## Using the PromptExperiment Decorator

PromptLens provides a powerful decorator for running A/B tests on your prompts. This allows you to automatically test different prompt variants without modifying your existing code.

### Setup

To use the experimental decorators in TypeScript, make sure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Basic Usage

Here's how to use the `@PromptExperiment` decorator with OpenAI:

```typescript
import { PromptExperiment, MetricsCollector } from "promptlens";
import OpenAI from "openai";

class MyOpenAIService {
  private openai: OpenAI;
  public metricsCollector: MetricsCollector;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
    this.metricsCollector = new MetricsCollector(
      "your-promptlens-api-key",
      "https://api.promptlens.dev"
    );
  }

  @PromptExperiment({
    id: "my-experiment",
    promptVariants: [
      "Explain like I'm 5: {{topic}}",
      "Technical explanation: {{topic}}",
      "Real-world examples of {{topic}}",
    ],
    distribution: "round-robin",
    trackMetrics: true,
  })
  async createChatCompletion(params: OpenAI.Chat.ChatCompletionCreateParams) {
    return this.openai.chat.completions.create(params);
  }
}

// Usage
const service = new MyOpenAIService("your-openai-api-key");
const result = await service.createChatCompletion({
  model: "gpt-4",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    { role: "user", content: "Explain recursion" },
  ],
});

console.log("Response:", result.response.choices[0].message.content);
console.log("Experiment details:", result.experiment);
```

### Alternative: Apply Decorator Manually

If you're experiencing issues with the decorator syntax, you can also apply it manually:

```typescript
// Define the method normally
async function createChatCompletion(params) {
  return this.openai.chat.completions.create(params);
}

// Apply the decorator to the prototype
PromptExperiment({
  promptVariants: ["Variant A", "Variant B"],
})(
  MyOpenAIService.prototype,
  "createChatCompletion",
  Object.getOwnPropertyDescriptor(
    MyOpenAIService.prototype,
    "createChatCompletion"
  )
);
```

### Configuration Options

The `PromptExperiment` decorator accepts the following options:

| Option           | Type     | Description                                                        |
| ---------------- | -------- | ------------------------------------------------------------------ |
| `id`             | string   | Unique identifier for the experiment (optional)                    |
| `promptVariants` | string[] | Array of prompt variants to test                                   |
| `distribution`   | string   | How to distribute variants: 'round-robin', 'random', or 'weighted' |
| `weights`        | number[] | Weights for variants when using 'weighted' distribution            |
| `trackMetrics`   | boolean  | Whether to track metrics for this experiment                       |

### Experiment Results

The decorated method returns an `ExperimentResult` object with:

```typescript
{
  response: OriginalResponse,
  experiment: {
    id: string,
    variantIndex: number,
    promptVariant: string,
    metrics: {
      latency_ms: number,
      // ...other metrics
    }
  }
}
```
