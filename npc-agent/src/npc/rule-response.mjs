import { evaluateSpoilerGuard } from "./guards.mjs";

export function createRuleBasedNpcResponse(payload) {
  const guard = evaluateSpoilerGuard(payload.message, payload.gameState);

  if (!guard.allowed) {
    return {
      npc: "澄",
      text: `${guard.safeRedirectHint} 这个猜想现在先不要当成结论。你能先说明手头证据支持到哪一步吗？`,
      intent: "refuse_spoiler",
      statePatch: {
        lastNpcIntent: "refuse_spoiler",
      },
      safety: {
        spoilerRisk: guard.spoilerRisk,
        blockedTopic: guard.blockedTopic,
      },
    };
  }

  return {
    npc: "澄",
    text: "这个判断有方向。先别急着定论，你能指出是哪几个词、时间点或语气让你这么想吗？",
    intent: "ask_for_evidence",
    statePatch: {
      lastNpcIntent: "ask_for_evidence",
    },
    safety: {
      spoilerRisk: "low",
      blockedTopic: null,
    },
  };
}
