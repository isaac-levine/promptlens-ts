import { PromptLensConfig, PromptTemplate, PromptTestConfig, PromptTestResult, ABTestConfig } from "../types/index.js";
/**
 * Main client for interacting with the PromptLens API
 */
export default class PromptLens {
    private apiKey;
    private baseUrl;
    private timeout;
    private projectId?;
    /**
     * Create a new PromptLens client
     *
     * @param config Configuration options for the client
     */
    constructor(config: PromptLensConfig);
    /**
     * Test a prompt against expectations
     *
     * @param prompt The prompt to test
     * @param config Test configuration
     * @returns Test results
     */
    testPrompt(prompt: PromptTemplate, config: PromptTestConfig): Promise<PromptTestResult>;
    /**
     * Run an A/B test with two prompt variants
     *
     * @param config A/B test configuration
     * @returns Test results
     */
    runABTest(config: ABTestConfig): Promise<any>;
    /**
     * Log a prompt and its response for monitoring
     *
     * @param prompt The prompt that was used
     * @param response The response received
     * @param metadata Additional metadata
     */
    logPrompt(prompt: string | PromptTemplate, response: any, metadata?: Record<string, any>): Promise<void>;
    /**
     * Make an API request to the PromptLens service
     *
     * @param method HTTP method
     * @param path API path
     * @param data Request data
     * @returns Response data
     */
    private makeRequest;
}
