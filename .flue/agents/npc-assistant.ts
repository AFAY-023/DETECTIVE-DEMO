import type { FlueContext } from "@flue/sdk/client";

import {
  buildNpcPrompt,
  evaluateSpoilerGuard,
  parseNpcResponse,
} from "../../npc-agent/src/npc/index.mjs";

export const triggers = { webhook: true };

export default async function ({ init, payload, env }: FlueContext) {
  validatePayload(payload);

  const guard = evaluateSpoilerGuard(payload.message, payload.gameState);
  const prompt = buildNpcPrompt(payload, guard);

  const harness = await init({ model: env.MODEL || "openai/gpt-5-mini" });
  const session = await harness.session();
  const result = await session.prompt(prompt);

  return parseNpcResponse(extractText(result), guard);
}

function extractText(result: unknown): string {
  if (typeof result === "string") {
    return result;
  }

  if (result && typeof result === "object") {
    const value = result as Record<string, unknown>;
    if (typeof value.text === "string") {
      return value.text;
    }
    if (typeof value.output === "string") {
      return value.output;
    }
  }

  return JSON.stringify(result);
}

function validatePayload(payload: unknown): asserts payload is {
  sessionId: string;
  message: string;
  gameState: {
    chapter: string;
    currentStage: string;
    unlockedEvidence: string[];
    discoveredMechanics: string[];
    submittedTheories: string[];
  };
} {
  if (!payload || typeof payload !== "object") {
    throw new Error("payload must be an object");
  }

  const value = payload as Record<string, unknown>;
  if (typeof value.message !== "string") {
    throw new Error("payload.message must be a string");
  }
  if (!value.gameState || typeof value.gameState !== "object") {
    throw new Error("payload.gameState must be an object");
  }
}
