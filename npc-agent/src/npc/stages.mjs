const STAGE_POLICIES = {
  abnormal_final_post: {
    stage: "abnormal_final_post",
    allowedTopics: ["final_post", "blog_profile", "stopped_blog", "message_tone"],
    blockedTopics: ["three_image_overlay", "death_image", "remaining_two_images"],
    redirectHint: "先回到最后留言，解释它为什么异常，以及它像是在写给谁。",
  },
  timeline_reconstruction: {
    stage: "timeline_reconstruction",
    allowedTopics: ["timeline", "death_announcement", "missing_years", "birth_risk"],
    blockedTopics: ["three_image_overlay_solution", "remaining_two_images"],
    redirectHint: "先把时间线里的断裂和异常生产安排说清楚。",
  },
  image_order_confusion: {
    stage: "image_order_confusion",
    allowedTopics: ["drawing_numbers", "age_order_conflict", "number_position", "scale_guess"],
    blockedTopics: ["three_image_overlay_solution", "death_image", "remaining_two_images"],
    redirectHint: "先比较编号、年龄顺序和数字位置是否能互相解释。",
  },
  three_image_discovery: {
    stage: "three_image_discovery",
    allowedTopics: ["layers", "number_alignment", "three_image_overlay", "death_inference"],
    blockedTopics: ["remaining_two_images_reversal"],
    redirectHint: "先把前三张图的机制、留言和时间线连成证据链。",
  },
  remaining_two_images: {
    stage: "remaining_two_images",
    allowedTopics: ["remaining_two_images", "final_report", "open_questions", "emotional_reversal"],
    blockedTopics: [],
    redirectHint: "检查剩余两张图是否也能形成另一层信息。",
  },
};

export function getStagePolicy(stage) {
  const policy = STAGE_POLICIES[stage];
  if (!policy) {
    throw new Error(`Unknown investigation stage: ${stage}`);
  }
  return {
    ...policy,
    allowedTopics: [...policy.allowedTopics],
    blockedTopics: [...policy.blockedTopics],
  };
}

export function listStagePolicies() {
  return Object.values(STAGE_POLICIES).map((policy) => getStagePolicy(policy.stage));
}
