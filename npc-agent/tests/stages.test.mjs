import test from "node:test";
import assert from "node:assert/strict";

import { getStagePolicy } from "../src/npc/stages.mjs";

test("abnormal_final_post blocks image overlay and death image topics", () => {
  const policy = getStagePolicy("abnormal_final_post");

  assert.equal(policy.stage, "abnormal_final_post");
  assert.ok(policy.allowedTopics.includes("final_post"));
  assert.ok(policy.blockedTopics.includes("three_image_overlay"));
  assert.ok(policy.blockedTopics.includes("death_image"));
  assert.ok(policy.redirectHint.includes("最后留言"));
});

test("remaining_two_images allows discussing the remaining drawings", () => {
  const policy = getStagePolicy("remaining_two_images");

  assert.ok(policy.allowedTopics.includes("remaining_two_images"));
  assert.equal(policy.blockedTopics.includes("remaining_two_images"), false);
});
