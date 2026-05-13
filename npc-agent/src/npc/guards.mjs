import { getStagePolicy } from "./stages.mjs";

const TOPIC_PATTERNS = [
  {
    topic: "three_image_overlay_body",
    patterns: [/叠/i, /重叠/i, /尸体/i, /尸/i, /遗体/i],
    blockedStages: ["abnormal_final_post", "timeline_reconstruction", "image_order_confusion"],
    risk: "high",
  },
  {
    topic: "three_image_overlay",
    patterns: [/三张图/i, /前三张/i, /叠/i, /重叠/i, /组合/i],
    blockedStages: ["abnormal_final_post", "timeline_reconstruction"],
    risk: "medium",
  },
  {
    topic: "remaining_two_images",
    patterns: [/剩下两张/i, /另外两张/i, /4\/5/i, /四五/i],
    blockedStages: ["abnormal_final_post", "timeline_reconstruction", "image_order_confusion", "three_image_discovery"],
    risk: "medium",
  },
  {
    topic: "death_image",
    patterns: [/死亡图/i, /死法/i, /剖腹/i, /手术台/i],
    blockedStages: ["abnormal_final_post", "timeline_reconstruction", "image_order_confusion"],
    risk: "high",
  },
];

export function evaluateSpoilerGuard(message, gameState) {
  const policy = getStagePolicy(gameState.currentStage);
  const matched = findBlockedTopic(message, gameState.currentStage);

  if (!matched) {
    return {
      allowed: true,
      spoilerRisk: "low",
      blockedTopic: null,
      safeRedirectHint: policy.redirectHint,
    };
  }

  return {
    allowed: false,
    spoilerRisk: matched.risk,
    blockedTopic: matched.topic,
    safeRedirectHint: policy.redirectHint,
  };
}

function findBlockedTopic(message, currentStage) {
  const normalized = String(message ?? "");

  for (const candidate of TOPIC_PATTERNS) {
    if (!candidate.blockedStages.includes(currentStage)) {
      continue;
    }

    const hitCount = candidate.patterns.filter((pattern) => pattern.test(normalized)).length;
    if (candidate.topic === "three_image_overlay_body" && hitCount >= 2) {
      return candidate;
    }

    if (candidate.topic !== "three_image_overlay_body" && hitCount >= 1) {
      return candidate;
    }
  }

  return null;
}
