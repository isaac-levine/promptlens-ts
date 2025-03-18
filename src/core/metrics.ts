import { MetricData } from "../types/experiment";
import crypto from "crypto";

/**
 * Service for collecting and reporting metrics
 */
export class MetricsCollector {
  private enabled: boolean;
  private queue: MetricData[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 5000; // 5 seconds
  private intervalId?: NodeJS.Timeout;
  private baseUrl: string;

  /**
   * Create a new metrics collector
   *
   * @param baseUrl Base URL for the metrics API (defaults to PROMPTLENS_API_URL env var or http://localhost:3000)
   * @param enabled Whether metrics collection is enabled
   */
  constructor(enabled: boolean = true) {
    this.baseUrl = process.env.PROMPTLENS_API_URL || "http://localhost:3000";
    this.enabled = enabled;

    if (this.enabled) {
      this.startAutoFlush();
    }
  }

  /**
   * Start the automatic flush interval
   */
  private startAutoFlush(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }

    this.intervalId = setInterval(() => {
      this.flush().catch(() => {
        // Silently fail on auto-flush errors
      });
    }, this.flushInterval);
  }

  /**
   * Stop the automatic flush interval
   */
  public stopAutoFlush(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  /**
   * Generate a hash for a prompt
   *
   * @param prompt The prompt to hash
   * @returns SHA-256 hash of the prompt
   */
  public hashPrompt(prompt: string): string {
    return crypto.createHash("sha256").update(prompt).digest("hex");
  }

  /**
   * Hash a user identifier for privacy
   *
   * @param userId The user ID to hash
   * @returns SHA-256 hash of the user ID
   */
  public hashUserId(userId: string): string {
    return crypto.createHash("sha256").update(userId).digest("hex");
  }

  /**
   * Log a metric data point
   *
   * @param metric The metric data to log
   * @returns Promise that resolves when the metric is queued
   */
  public async logMetric(metric: MetricData): Promise<void> {
    if (!this.enabled) {
      return;
    }

    this.queue.push(metric);

    // Auto-flush if we've reached the batch size
    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  /**
   * Flush the metrics queue to the server
   *
   * @returns Promise that resolves when the metrics are sent
   */
  public async flush(): Promise<void> {
    if (!this.enabled || this.queue.length === 0) {
      return;
    }

    const batchToSend = [...this.queue];
    this.queue = [];

    try {
      const response = await fetch(`${this.baseUrl}/metrics`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(batchToSend),
      });

      if (!response.ok) {
        // If the server rejected the metrics, put them back in the queue
        this.queue = [...batchToSend, ...this.queue];
        throw new Error(`Failed to send metrics: ${response.status}`);
      }
    } catch (error) {
      // If there was a network error, put the metrics back in the queue
      this.queue = [...batchToSend, ...this.queue];
      throw error;
    }
  }

  /**
   * Set whether metrics collection is enabled
   *
   * @param enabled Whether metrics collection is enabled
   */
  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;

    if (this.enabled && !this.intervalId) {
      this.startAutoFlush();
    } else if (!this.enabled && this.intervalId) {
      this.stopAutoFlush();
    }
  }
}
