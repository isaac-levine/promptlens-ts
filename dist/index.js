"use strict";
/**
 * PromptLens SDK
 * Optimize and monitor your AI prompts
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERSION = exports.MetricsCollector = exports.selectPromptVariant = exports.weightedPrompt = exports.randomPrompt = exports.rotatePromptForUser = exports.rotatePrompt = exports.PromptExperiment = exports.PromptLens = void 0;
// Export main client
var client_js_1 = require("./core/client.js");
Object.defineProperty(exports, "PromptLens", { enumerable: true, get: function () { return __importDefault(client_js_1).default; } });
// Export OpenAI integration
var openai_js_1 = require("./integrations/openai.js");
Object.defineProperty(exports, "PromptExperiment", { enumerable: true, get: function () { return openai_js_1.PromptExperiment; } });
// Export types
__exportStar(require("./types/index.js"), exports);
__exportStar(require("./types/experiment.js"), exports);
// Export utilities
__exportStar(require("./utils/index.js"), exports);
// Export core functionality
var rotation_js_1 = require("./core/rotation.js");
Object.defineProperty(exports, "rotatePrompt", { enumerable: true, get: function () { return rotation_js_1.rotatePrompt; } });
Object.defineProperty(exports, "rotatePromptForUser", { enumerable: true, get: function () { return rotation_js_1.rotatePromptForUser; } });
Object.defineProperty(exports, "randomPrompt", { enumerable: true, get: function () { return rotation_js_1.randomPrompt; } });
Object.defineProperty(exports, "weightedPrompt", { enumerable: true, get: function () { return rotation_js_1.weightedPrompt; } });
Object.defineProperty(exports, "selectPromptVariant", { enumerable: true, get: function () { return rotation_js_1.selectPromptVariant; } });
var metrics_js_1 = require("./core/metrics.js");
Object.defineProperty(exports, "MetricsCollector", { enumerable: true, get: function () { return metrics_js_1.MetricsCollector; } });
// Version information
exports.VERSION = "0.1.2";
