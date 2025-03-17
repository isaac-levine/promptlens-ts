/**
 * Configuration for a prompt experiment
 */
export interface ExperimentConfig {
  /** Unique identifier for the experiment */
  id?: string;

  /** Array of prompt variants to test */
  promptVariants: string[];

  /** How to distribute the variants */
  distribution?: "round-robin" | "random" | "weighted";

  /** Weights for variants (when using weighted distribution) */
  weights?: number[];

  /** Whether to track metrics for this experiment */
  trackMetrics?: boolean;
}

/**
 * Metric data collected during experiment
 */
export interface MetricData {
  /** Experiment identifier */
  experiment_id: string;

  /** Hash of the prompt used */
  prompt_hash: string;

  /** The model that was used (e.g., gpt-4) */
  model: string;

  /** Request latency in milliseconds */
  latency_ms: number;

  /** Hashed user identifier (if available) */
  user_id?: string;

  /** Timestamp of the request */
  timestamp: number;

  /** Additional custom metrics */
  custom_metrics?: Record<string, any>;
}

/**
 * Result of a prompt experiment
 */
export interface ExperimentResult<T = any> {
  /** Original response from the API */
  response: T;

  /** Experiment data */
  experiment: {
    /** Experiment ID */
    id: string;

    /** Which variant was used (index) */
    variantIndex: number;

    /** The prompt variant that was used */
    promptVariant: string;

    /** Metrics collected during the experiment */
    metrics?: MetricData;
  };
}
