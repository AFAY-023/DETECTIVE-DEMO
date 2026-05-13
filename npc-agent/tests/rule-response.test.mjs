import test from "node:test";
import assert from "node:assert/strict";

import { createRuleBasedNpcResponse } from "../src/npc/rule-response.mjs";

const baseState = {
  chapter: "old_womans_prayer",
  currentStage: "abnormal_final_post",
  unlockedEvidence: ["final_post", "blog_profile"],
  discoveredMechanics: [],
  submittedTheories: [],
};

test("rule response refuses early spoiler guesses", () => {
  const response = createRuleBasedNpcResponse({
    sessionId: "demo-001",
    message: "是不是把三张图叠起来会出现尸体？",
    gameState: baseState,
  });

  assert.equal(response.intent, "refuse_spoiler");
  assert.equal(response.safety.spoilerRisk, "high");
  assert.equal(response.safety.blockedTopic, "three_image_overlay_body");
});

test("rule response asks for evidence on regular final-post speculation", () => {
  const response = createRuleBasedNpcResponse({
    sessionId: "demo-001",
    message: "我觉得最后那条博客像是在写给死去的妻子。",
    gameState: baseState,
  });

  assert.equal(response.intent, "ask_for_evidence");
  assert.equal(response.safety.spoilerRisk, "low");
  assert.match(response.text, /证据|词|依据/);
});
