import {
  PromptLensConfig,
  PromptTemplate,
  PromptTestConfig,
  PromptTestResult,
  ABTestConfig,
} from "../types/index.js";

import { validateConfig } from "../utils/index.js";

/**
 * Main client for interacting with the PromptLens API
 */
export default class PromptLens {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;
  private projectId?: string;

  /**
   * Create a new PromptLens client
   *
   * @param config Configuration options for the client
   */
  constructor(config: PromptLensConfig) {
    validateConfig(config);

    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || "https://api.promptlens.dev";
    this.timeout = config.timeout || 30000;
    this.projectId = config.projectId;
  }

  /**
   * Test a prompt against expectations
   *
   * @param prompt The prompt to test
   * @param config Test configuration
   * @returns Test results
   */
  public async testPrompt(
    prompt: PromptTemplate,
    config: PromptTestConfig
  ): Promise<PromptTestResult> {
    // Implementation will make API calls to the PromptLens service
    // This is a placeholder implementation
    const startTime = Date.now();

    try {
      const response = await this.makeRequest("POST", "/test", {
        prompt,
        config,
      });

      const executionTime = Date.now() - startTime;

      return {
        passed: response.passed,
        executionTime,
        response: response.aiResponse,
        expectationResults: response.expectationResults,
      };
    } catch (error) {
      const executionTime = Date.now() - startTime;

      return {
        passed: false,
        executionTime,
        response: null,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  /**
   * Run an A/B test with two prompt variants
   *
   * @param config A/B test configuration
   * @returns Test results
   */
  public async runABTest(config: ABTestConfig): Promise<any> {
    // Implementation will make API calls to the PromptLens service
    // This is a placeholder implementation
    return this.makeRequest("POST", "/ab-test", { config });
  }

  /**
   * Log a prompt and its response for monitoring
   *
   * @param prompt The prompt that was used
   * @param response The response received
   * @param metadata Additional metadata
   */
  public async logPrompt(
    prompt: string | PromptTemplate,
    response: any,
    metadata?: Record<string, any>
  ): Promise<void> {
    await this.makeRequest("POST", "/log", {
      prompt: typeof prompt === "string" ? { content: prompt } : prompt,
      response,
      metadata,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Make an API request to the PromptLens service
   *
   * @param method HTTP method
   * @param path API path
   * @param data Request data
   * @returns Response data
   */
  private async makeRequest(
    method: string,
    path: string,
    data?: any
  ): Promise<any> {
    const url = new URL(path, this.baseUrl);

    // Add project ID if available
    if (this.projectId) {
      url.searchParams.append("projectId", this.projectId);
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      "X-SDK-Version": "typescript-0.1.0",
    };

    const requestOptions: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      signal: AbortSignal.timeout(this.timeout),
    };

    const response = await fetch(url.toString(), requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `PromptLens API error (${response.status}): ${errorText}`
      );
    }

    return response.json();
  }
}
