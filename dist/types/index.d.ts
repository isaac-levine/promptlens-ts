/**
 * Configuration options for the PromptLens client
 */
export interface PromptLensConfig {
    /** API key for authenticating with the PromptLens service */
    apiKey: string;
    /** Base URL for the PromptLens API (optional) */
    baseUrl?: string;
    /** Request timeout in milliseconds (optional) */
    timeout?: number;
    /** Project identifier (optional) */
    projectId?: string;
}
/**
 * Prompt test configuration
 */
export interface PromptTestConfig {
    /** Name of the test */
    name: string;
    /** Description of the test */
    description?: string;
    /** Tags for categorizing the test */
    tags?: string[];
    /** Expected output patterns or validation rules */
    expectations?: PromptExpectation[];
}
/**
 * Prompt expectation for validation
 */
export interface PromptExpectation {
    /** Type of expectation (contains, regex, callback, etc.) */
    type: "contains" | "not_contains" | "regex" | "callback";
    /** Value to check against (for contains, not_contains, and regex) */
    value?: string;
    /** Custom validation function (for callback type) */
    validator?: (response: any) => boolean;
    /** Description of this expectation */
    description?: string;
}
/**
 * Prompt template with variables
 */
export interface PromptTemplate {
    /** Template content with variable placeholders */
    content: string;
    /** Variables to be substituted in the template */
    variables?: Record<string, any>;
    /** Metadata about the prompt */
    metadata?: Record<string, any>;
}
/**
 * Result of a prompt test
 */
export interface PromptTestResult {
    /** Whether the test passed */
    passed: boolean;
    /** Test execution time in milliseconds */
    executionTime: number;
    /** Response from the AI model */
    response: any;
    /** Detailed results of each expectation */
    expectationResults?: ExpectationResult[];
    /** Error message if the test failed */
    error?: string;
}
/**
 * Result of a single expectation
 */
export interface ExpectationResult {
    /** Whether the expectation was met */
    passed: boolean;
    /** Description of the expectation */
    description?: string;
    /** Error message if the expectation failed */
    error?: string;
}
/**
 * A/B test configuration
 */
export interface ABTestConfig {
    /** Name of the A/B test */
    name: string;
    /** Description of the A/B test */
    description?: string;
    /** Variant A configuration */
    variantA: PromptTemplate;
    /** Variant B configuration */
    variantB: PromptTemplate;
    /** Evaluation criteria */
    evaluationCriteria?: EvaluationCriteria[];
}
/**
 * Criteria for evaluating A/B test results
 */
export interface EvaluationCriteria {
    /** Name of the criterion */
    name: string;
    /** Weight of this criterion (for weighted scoring) */
    weight?: number;
    /** Evaluation function */
    evaluator: (responseA: any, responseB: any) => number;
}
