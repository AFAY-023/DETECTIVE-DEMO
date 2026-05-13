import type { FlueContext } from "@flue/sdk/client";
import * as v from "valibot";

import {
  buildNpcPrompt,
  evaluateSpoilerGuard,
  parseNpcResponse,
} from "../../npc-agent/src/npc/index.mjs";

export const triggers = { webhook: true };

const npcResponseSchema = v.object({
  npc: v.literal("澄"),
  text: v.string(),
  intent: v.picklist([
    "ask_for_evidence",
    "light_hint",
    "challenge_theory",
    "confirm_partial",
    "suggest_next_observation",
    "advance_stage_candidate",
    "refuse_spoiler",
  ]),
  statePatch: v.object({
    lastNpcIntent: v.optional(v.string()),
    suggestedNextStage: v.optional(v.string()),
    reason: v.optional(v.string()),
  }),
  safety: v.object({
    spoilerRisk: v.picklist(["low", "medium", "high"]),
    blockedTopic: v.nullable(v.string()),
  }),
});

export default async function ({ init, payload, env }: FlueContext) {
  validatePayload(payload);

  const guard = evaluateSpoilerGuard(payload.message, payload.gameState);
  const prompt = buildNpcPrompt(payload, guard);

  const harness = await init({ model: env.MODEL || "openai/gpt-5-mini" });
  const session = await harness.session();
  const result = await session.prompt(prompt, {
    result: npcResponseSchema,
  });

  return normalizePromptResult(result, guard);
}

function normalizePromptResult(result: unknown, guard: unknown) {
  if (result && typeof result === "object") {
    const value = result as Record<string, unknown>;
    if (value.data && typeof value.data === "object") {
      return parseNpcResponse(JSON.stringify(value.data), guard);
    }
    if (value.result && typeof value.result === "object") {
      return parseNpcResponse(JSON.stringify(value.result), guard);
    }
    if (typeof value.text === "string") {
      return parseNpcResponse(value.text, guard);
    }
  }

  return parseNpcResponse(JSON.stringify(result), guard);
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
