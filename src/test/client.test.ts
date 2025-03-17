import PromptLens from "../core/client.js";
import { renderPrompt } from "../utils/index.js";

// Mock fetch for testing
global.fetch = jest.fn();

describe("PromptLens Client", () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  test("should initialize with valid config", () => {
    const client = new PromptLens({
      apiKey: "test-api-key",
    });

    expect(client).toBeInstanceOf(PromptLens);
  });

  test("should throw error with invalid config", () => {
    expect(() => {
      new PromptLens({
        apiKey: "",
      });
    }).toThrow("API key is required");
  });

  test("should test a prompt", async () => {
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue({
        passed: true,
        aiResponse: "This is a test response",
        expectationResults: [{ passed: true, description: "Test expectation" }],
      }),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const client = new PromptLens({
      apiKey: "test-api-key",
    });

    const result = await client.testPrompt(
      { content: "Test prompt" },
      { name: "Test case" },
    );

    expect(result.passed).toBe(true);
    expect(result.response).toBe("This is a test response");
    expect(result.expectationResults?.length).toBe(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  test("should handle API errors", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      text: jest.fn().mockResolvedValue("Unauthorized"),
    };

    (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

    const client = new PromptLens({
      apiKey: "invalid-api-key",
    });

    const result = await client.testPrompt(
      { content: "Test prompt" },
      { name: "Test case" },
    );

    expect(result.passed).toBe(false);
    expect(result.error).toContain("Unauthorized");
  });
});

describe("Utility Functions", () => {
  test("should render prompt template", () => {
    const template = {
      content: "Hello {{name}}, your order #{{orderId}} has been {{status}}.",
      variables: {
        name: "John",
        orderId: "12345",
        status: "shipped",
      },
    };

    const rendered = renderPrompt(template);
    expect(rendered).toBe("Hello John, your order #12345 has been shipped.");
  });
});
