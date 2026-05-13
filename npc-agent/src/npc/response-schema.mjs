const INTENTS = new Set([
  "ask_for_evidence",
  "light_hint",
  "challenge_theory",
  "confirm_partial",
  "suggest_next_observation",
  "advance_stage_candidate",
  "refuse_spoiler",
]);

const RISKS = new Set(["low", "medium", "high"]);

export function parseNpcResponse(rawText, guard = {}) {
  try {
    const parsed = JSON.parse(extractJson(rawText));
    validateNpcResponse(parsed);
    return parsed;
  } catch {
    return createFallbackResponse(guard);
  }
}

function extractJson(rawText) {
  const text = String(rawText ?? "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) {
    return fenced[1];
  }
  return text;
}

function validateNpcResponse(value) {
  if (!value || typeof value !== "object") {
    throw new Error("NPC response must be an object");
  }
  if (value.npc !== "澄") {
    throw new Error("NPC name must be 澄");
  }
  if (typeof value.text !== "string" || value.text.length === 0) {
    throw new Error("NPC text is required");
  }
  if (!INTENTS.has(value.intent)) {
    throw new Error("Invalid NPC intent");
  }
  if (!value.statePatch || typeof value.statePatch !== "object" || Array.isArray(value.statePatch)) {
    throw new Error("statePatch must be an object");
  }
  if (!value.safety || typeof value.safety !== "object") {
    throw new Error("safety is required");
  }
  if (!RISKS.has(value.safety.spoilerRisk)) {
    throw new Error("Invalid spoiler risk");
  }
  if (value.safety.blockedTopic !== null && typeof value.safety.blockedTopic !== "string") {
    throw new Error("blockedTopic must be string or null");
  }
}

function createFallbackResponse(guard) {
  const spoilerRisk = guard.spoilerRisk ?? "medium";
  const blockedTopic = guard.blockedTopic ?? null;
  const hint = guard.safeRedirectHint ?? "先回到你已经看到的证据，说清楚你的依据。";

  return {
    npc: "澄",
    text: `${hint} 我先不替你下结论。`,
    intent: blockedTopic ? "refuse_spoiler" : "ask_for_evidence",
    statePatch: {
      lastNpcIntent: blockedTopic ? "refuse_spoiler" : "ask_for_evidence",
    },
    safety: {
      spoilerRisk,
      blockedTopic,
    },
  };
}
