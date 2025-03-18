import { Request, Response } from "express";
import { MetricsService } from "../services/metrics";
import { MetricData } from "../types/experiment";

const metricsService = new MetricsService();

export const POST = async (req: Request, res: Response) => {
  try {
    const metrics: MetricData[] = req.body;

    // Validate the request
    if (!Array.isArray(metrics)) {
      res.status(400).json({ error: "Metrics must be an array" });
      return;
    }

    // Store the metrics
    await metricsService.storeMetrics(metrics);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error storing metrics:", error);
    res.status(500).json({ error: "Failed to store metrics" });
  }
};

export const GET = async (req: Request, res: Response) => {
  try {
    const experimentId = req.query.experimentId as string;
    const promptHash = req.query.promptHash as string;
    const startTime = req.query.startTime as string;
    const endTime = req.query.endTime as string;

    let metrics;
    if (experimentId) {
      metrics = await metricsService.getExperimentMetrics(experimentId);
    } else if (promptHash) {
      metrics = await metricsService.getPromptMetrics(promptHash);
    } else if (startTime && endTime) {
      metrics = await metricsService.getMetricsByTimeRange(
        new Date(startTime),
        new Date(endTime)
      );
    } else {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }

    res.status(200).json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
};
