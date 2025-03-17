/**
 * Handles prompt rotation across different experiment variants
 */

// Store the current indices for round-robin rotation
const experimentIndices = new Map<string, number>();

// Store session-specific indices for user-based rotation
const sessionIndices = new Map<string, Map<string, number>>();

/**
 * Rotate through prompt variants in round-robin fashion
 *
 * @param experimentId Unique identifier for the experiment
 * @param prompts Array of prompt variants
 * @returns The next prompt in the rotation
 */
export function rotatePrompt(experimentId: string, prompts: string[]): string {
  if (!prompts || prompts.length === 0) {
    throw new Error("No prompt variants provided for rotation");
  }

  let currentIndex = experimentIndices.get(experimentId) ?? -1;
  currentIndex = (currentIndex + 1) % prompts.length;

  experimentIndices.set(experimentId, currentIndex);
  return prompts[currentIndex]!;
}

/**
 * Get the current variant index for an experiment
 *
 * @param experimentId Unique identifier for the experiment
 * @returns The current variant index or -1 if not yet rotated
 */
export function getCurrentVariantIndex(experimentId: string): number {
  return experimentIndices.get(experimentId) ?? -1;
}

/**
 * Rotate through prompt variants for a specific user session
 *
 * @param experimentId Unique identifier for the experiment
 * @param userId Unique identifier for the user
 * @param prompts Array of prompt variants
 * @returns The next prompt in the rotation for this user
 */
export function rotatePromptForUser(
  experimentId: string,
  userId: string,
  prompts: string[]
): string {
  if (!prompts || prompts.length === 0) {
    throw new Error("No prompt variants provided for rotation");
  }

  if (!sessionIndices.has(experimentId)) {
    sessionIndices.set(experimentId, new Map<string, number>());
  }

  const userIndices = sessionIndices.get(experimentId)!;
  let currentIndex = userIndices.get(userId) ?? -1;
  currentIndex = (currentIndex + 1) % prompts.length;

  userIndices.set(userId, currentIndex);
  return prompts[currentIndex]!;
}

/**
 * Perform random selection of prompt variants
 *
 * @param prompts Array of prompt variants
 * @returns A randomly selected prompt
 */
export function randomPrompt(prompts: string[]): string {
  if (!prompts || prompts.length === 0) {
    throw new Error("No prompt variants provided for random selection");
  }

  const randomIndex = Math.floor(Math.random() * prompts.length);
  return prompts[randomIndex]!;
}

/**
 * Perform weighted selection of prompt variants
 *
 * @param prompts Array of prompt variants
 * @param weights Array of weights corresponding to each prompt
 * @returns A prompt selected based on the provided weights
 */
export function weightedPrompt(prompts: string[], weights: number[]): string {
  if (!prompts || prompts.length === 0) {
    throw new Error("No prompt variants provided for weighted selection");
  }

  if (!weights || weights.length !== prompts.length) {
    throw new Error("Weights must match the number of prompt variants");
  }

  // Calculate total weight
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

  // Generate a random value between 0 and totalWeight
  const random = Math.random() * totalWeight;

  // Find the prompt corresponding to the random value
  let cumulativeWeight = 0;
  for (let i = 0; i < prompts.length; i++) {
    cumulativeWeight += weights[i]!;
    if (random < cumulativeWeight) {
      return prompts[i]!;
    }
  }

  // Fallback (should never reach here if weights sum > 0)
  return prompts[prompts.length - 1]!;
}

/**
 * Select a prompt variant based on the specified distribution
 *
 * @param experimentId Unique identifier for the experiment
 * @param prompts Array of prompt variants
 * @param distribution Distribution method to use
 * @param weights Optional weights for weighted distribution
 * @param userId Optional user ID for session-based distribution
 * @returns The selected prompt variant
 */
export function selectPromptVariant(
  experimentId: string,
  prompts: string[],
  distribution: "round-robin" | "random" | "weighted" = "round-robin",
  weights?: number[],
  userId?: string
): string {
  switch (distribution) {
    case "random":
      return randomPrompt(prompts);
    case "weighted":
      if (!weights) {
        throw new Error("Weights must be provided for weighted distribution");
      }
      return weightedPrompt(prompts, weights);
    case "round-robin":
    default:
      return userId
        ? rotatePromptForUser(experimentId, userId, prompts)
        : rotatePrompt(experimentId, prompts);
  }
}
