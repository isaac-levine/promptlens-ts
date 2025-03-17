# PromptLens SDK

A TypeScript SDK for working with PromptLens - the tool for testing, monitoring, and optimizing your AI prompts.

## Installation

```bash
npm install promptlens-sdk
```

## Quick Start

```typescript
import { PromptLens } from "promptlens-sdk";

// Initialize the client
const promptLens = new PromptLens({
  apiKey: "your-api-key",
  projectId: "your-project-id", // Optional
});

// Test a prompt
async function testMyPrompt() {
  const result = await promptLens.testPrompt(
    {
      content: "Summarize the following text in 3 bullet points: {{text}}",
      variables: {
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      },
    },
    {
      name: "Summary Test",
      description: "Tests if the AI can properly summarize text",
      expectations: [
        {
          type: "contains",
          value: "bullet",
          description: "Response should contain bullet points",
        },
      ],
    }
  );

  console.log("Test passed:", result.passed);
  console.log("Response:", result.response);
}

// Run an A/B test
async function runABTest() {
  const result = await promptLens.runABTest({
    name: "Tone Comparison",
    description: "Compare formal vs. casual tone",
    variantA: {
      content: "Please provide information about {{topic}}.",
      metadata: { tone: "formal" },
    },
    variantB: {
      content: "Tell me about {{topic}} in a friendly way!",
      metadata: { tone: "casual" },
    },
  });

  console.log("A/B Test Results:", result);
}

// Log a prompt for monitoring
async function logPromptUsage() {
  await promptLens.logPrompt(
    "What is the capital of France?",
    "The capital of France is Paris.",
    {
      userId: "user-123",
      applicationArea: "geography-quiz",
    }
  );
}
```

## Documentation

### Configuration

The `PromptLens` client accepts the following configuration options:

| Option    | Type   | Required | Description                                                  |
| --------- | ------ | -------- | ------------------------------------------------------------ |
| apiKey    | string | Yes      | Your PromptLens API key                                      |
| baseUrl   | string | No       | Custom API base URL (defaults to https://api.promptlens.dev) |
| timeout   | number | No       | Request timeout in milliseconds (defaults to 30000)          |
| projectId | string | No       | Project identifier for organizing your prompts               |

### Core Features

#### Testing Prompts

Test your prompts against expectations:

```typescript
const result = await promptLens.testPrompt(promptTemplate, testConfig);
```

#### A/B Testing

Compare two prompt variants:

```typescript
const result = await promptLens.runABTest(abTestConfig);
```

#### Monitoring

Log prompts and responses for monitoring:

```typescript
await promptLens.logPrompt(prompt, response, metadata);
```

## License

MIT
