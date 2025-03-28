"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateConfig = validateConfig;
exports.renderPrompt = renderPrompt;
exports.parseApiError = parseApiError;
exports.estimateTokenCount = estimateTokenCount;
/**
 * Validates the configuration object
 *
 * @param config The configuration to validate
 * @throws Error if the configuration is invalid
 */
function validateConfig(config) {
    if (!config) {
        throw new Error("Configuration is required");
    }
    if (!config.apiKey) {
        throw new Error("API key is required");
    }
    if (typeof config.apiKey !== "string" || config.apiKey.trim() === "") {
        throw new Error("API key must be a non-empty string");
    }
    if (config.baseUrl && typeof config.baseUrl !== "string") {
        throw new Error("Base URL must be a string");
    }
    if (config.timeout &&
        (typeof config.timeout !== "number" || config.timeout <= 0)) {
        throw new Error("Timeout must be a positive number");
    }
}
/**
 * Renders a prompt template with the provided variables
 *
 * @param template The prompt template
 * @returns The rendered prompt string
 */
function renderPrompt(template) {
    if (!template.variables) {
        return template.content;
    }
    let renderedContent = template.content;
    for (const [key, value] of Object.entries(template.variables)) {
        const placeholder = `{{${key}}}`;
        renderedContent = renderedContent.replace(new RegExp(placeholder, "g"), String(value));
    }
    return renderedContent;
}
/**
 * Parses an API error response
 *
 * @param error The error to parse
 * @returns A formatted error message
 */
function parseApiError(error) {
    if (error instanceof Error) {
        return error.message;
    }
    if (typeof error === "string") {
        return error;
    }
    return "Unknown error occurred";
}
/**
 * Measures token count in a prompt (rough estimation)
 *
 * @param text The text to measure
 * @returns Estimated token count
 */
function estimateTokenCount(text) {
    // This is a very rough estimation
    // In a real SDK, you'd use a proper tokenizer
    const words = text.trim().split(/\s+/);
    return Math.ceil(words.length * 1.3);
}
