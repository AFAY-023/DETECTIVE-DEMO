import test from "node:test";
import assert from "node:assert/strict";

import { evaluateSpoilerGuard } from "../src/npc/guards.mjs";

const earlyState = {
  chapter: "old_womans_prayer",
  currentStage: "abnormal_final_post",
  unlockedEvidence: ["final_post", "blog_profile"],
  discoveredMechanics: [],
  submittedTheories: [],
};

test("blocks early guesses about overlay revealing a body", () => {
  const guard = evaluateSpoilerGuard("是不是把三张图叠起来会出现尸体？", earlyState);

  assert.equal(guard.allowed, false);
  assert.equal(guard.spoilerRisk, "high");
  assert.equal(guard.blockedTopic, "three_image_overlay_body");
  assert.ok(guard.safeRedirectHint.includes("最后留言"));
});

test("allows final-post speculation in the first stage", () => {
  const guard = evaluateSpoilerGuard("我觉得最后那条博客像是在写给死去的妻子。", earlyState);

  assert.equal(guard.allowed, true);
  assert.equal(guard.spoilerRisk, "low");
  assert.equal(guard.blockedTopic, null);
});
