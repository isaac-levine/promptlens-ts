"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_js_1 = __importDefault(require("../core/client.js"));
const index_js_1 = require("../utils/index.js");
// Mock fetch for testing
global.fetch = jest.fn();
describe("PromptLens Client", () => {
    beforeEach(() => {
        global.fetch.mockClear();
    });
    test("should initialize with valid config", () => {
        const client = new client_js_1.default({
            apiKey: "test-api-key",
        });
        expect(client).toBeInstanceOf(client_js_1.default);
    });
    test("should throw error with invalid config", () => {
        expect(() => {
            new client_js_1.default({
                apiKey: "",
            });
        }).toThrow("API key is required");
    });
    test("should test a prompt", async () => {
        var _a;
        const mockResponse = {
            ok: true,
            json: jest.fn().mockResolvedValue({
                passed: true,
                aiResponse: "This is a test response",
                expectationResults: [{ passed: true, description: "Test expectation" }],
            }),
        };
        global.fetch.mockResolvedValue(mockResponse);
        const client = new client_js_1.default({
            apiKey: "test-api-key",
        });
        const result = await client.testPrompt({ content: "Test prompt" }, { name: "Test case" });
        expect(result.passed).toBe(true);
        expect(result.response).toBe("This is a test response");
        expect((_a = result.expectationResults) === null || _a === void 0 ? void 0 : _a.length).toBe(1);
        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
    test("should handle API errors", async () => {
        const mockResponse = {
            ok: false,
            status: 401,
            text: jest.fn().mockResolvedValue("Unauthorized"),
        };
        global.fetch.mockResolvedValue(mockResponse);
        const client = new client_js_1.default({
            apiKey: "invalid-api-key",
        });
        const result = await client.testPrompt({ content: "Test prompt" }, { name: "Test case" });
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
        const rendered = (0, index_js_1.renderPrompt)(template);
        expect(rendered).toBe("Hello John, your order #12345 has been shipped.");
    });
});
