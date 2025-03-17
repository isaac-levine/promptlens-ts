import { PromptLensConfig, PromptTemplate } from "../types/index.js";
/**
 * Validates the configuration object
 *
 * @param config The configuration to validate
 * @throws Error if the configuration is invalid
 */
export declare function validateConfig(config: PromptLensConfig): void;
/**
 * Renders a prompt template with the provided variables
 *
 * @param template The prompt template
 * @returns The rendered prompt string
 */
export declare function renderPrompt(template: PromptTemplate): string;
/**
 * Parses an API error response
 *
 * @param error The error to parse
 * @returns A formatted error message
 */
export declare function parseApiError(error: unknown): string;
/**
 * Measures token count in a prompt (rough estimation)
 *
 * @param text The text to measure
 * @returns Estimated token count
 */
export declare function estimateTokenCount(text: string): number;
