"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("../utils/index.js");
/**
 * Main client for interacting with the PromptLens API
 */
class PromptLens {
    /**
     * Create a new PromptLens client
     *
     * @param config Configuration options for the client
     */
    constructor(config) {
        (0, index_js_1.validateConfig)(config);
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
    async testPrompt(prompt, config) {
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
        }
        catch (error) {
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
    async runABTest(config) {
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
    async logPrompt(prompt, response, metadata) {
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
    async makeRequest(method, path, data) {
        const url = new URL(path, this.baseUrl);
        // Add project ID if available
        if (this.projectId) {
            url.searchParams.append("projectId", this.projectId);
        }
        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
            "X-SDK-Version": "typescript-0.1.0",
        };
        const requestOptions = {
            method,
            headers,
            body: data ? JSON.stringify(data) : undefined,
            signal: AbortSignal.timeout(this.timeout),
        };
        const response = await fetch(url.toString(), requestOptions);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PromptLens API error (${response.status}): ${errorText}`);
        }
        return response.json();
    }
}
exports.default = PromptLens;
