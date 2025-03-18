import { PrismaClient, Metric } from "@prisma/client";
import { MetricData } from "../types/experiment";

const prisma = new PrismaClient();

export class MetricsService {
  /**
   * Store a batch of metrics in the database
   */
  async storeMetrics(metrics: MetricData[]): Promise<void> {
    await prisma.metric.createMany({
      data: metrics.map((metric) => ({
        experimentId: metric.experiment_id,
        promptHash: metric.prompt_hash,
        model: metric.model,
        latencyMs: metric.latency_ms,
        userId: metric.user_id,
        timestamp: new Date(metric.timestamp),
        customMetrics: metric.custom_metrics,
      })),
    });
  }

  /**
   * Get metrics for a specific experiment
   */
  async getExperimentMetrics(experimentId: string): Promise<Metric[]> {
    return prisma.metric.findMany({
      where: { experimentId },
      orderBy: { timestamp: "desc" },
    });
  }

  /**
   * Get metrics for a specific prompt hash
   */
  async getPromptMetrics(promptHash: string): Promise<Metric[]> {
    return prisma.metric.findMany({
      where: { promptHash },
      orderBy: { timestamp: "desc" },
    });
  }

  /**
   * Get metrics within a time range
   */
  async getMetricsByTimeRange(
    startTime: Date,
    endTime: Date
  ): Promise<Metric[]> {
    return prisma.metric.findMany({
      where: {
        timestamp: {
          gte: startTime,
          lte: endTime,
        },
      },
      orderBy: { timestamp: "desc" },
    });
  }

  /**
   * Get aggregated metrics for an experiment
   */
  async getAggregatedMetrics(experimentId: string) {
    const metrics = await prisma.metric.findMany({
      where: { experimentId },
    });

    const totalRequests = metrics.length;
    const totalLatency = metrics.reduce(
      (sum: number, m: Metric) => sum + m.latencyMs,
      0
    );
    const avgLatency = totalRequests > 0 ? totalLatency / totalRequests : 0;

    const modelStats = metrics.reduce(
      (acc: Record<string, number>, m: Metric) => {
        acc[m.model] = (acc[m.model] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      totalRequests,
      avgLatency,
      modelStats,
      timeRange: {
        start: metrics[0]?.timestamp,
        end: metrics[metrics.length - 1]?.timestamp,
      },
    };
  }
}
