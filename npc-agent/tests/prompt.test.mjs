import test from "node:test";
import assert from "node:assert/strict";

import { buildNpcPrompt } from "../src/npc/prompt.mjs";

test("prompt contains persona, stage, unlocked evidence, blocked topics, and JSON rule", () => {
  const prompt = buildNpcPrompt(
    {
      sessionId: "demo-001",
      message: "我觉得最后那条博客像是在写给死去的妻子。",
      gameState: {
        chapter: "old_womans_prayer",
        currentStage: "abnormal_final_post",
        unlockedEvidence: ["final_post", "blog_profile"],
        discoveredMechanics: [],
        submittedTheories: [],
      },
    },
    {
      allowed: true,
      spoilerRisk: "low",
      blockedTopic: null,
      safeRedirectHint: "追问最后留言中的证据。",
    },
  );

  assert.match(prompt, /名字叫“澄”/);
  assert.match(prompt, /abnormal_final_post/);
  assert.match(prompt, /final_post/);
  assert.match(prompt, /three_image_overlay/);
  assert.match(prompt, /必须只返回合法 JSON/);
  assert.match(prompt, /我觉得最后那条博客/);
});
