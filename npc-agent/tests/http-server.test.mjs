import test from "node:test";
import assert from "node:assert/strict";

import { createNpcHttpServer } from "../src/server.mjs";

test("POST /agents/npc-assistant/:id returns npc response JSON", async () => {
  const server = createNpcHttpServer();
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/agents/npc-assistant/demo-001`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        sessionId: "demo-001",
        message: "是不是把三张图叠起来会出现尸体？",
        gameState: {
          chapter: "old_womans_prayer",
          currentStage: "abnormal_final_post",
          unlockedEvidence: ["final_post", "blog_profile"],
          discoveredMechanics: [],
          submittedTheories: [],
        },
      }),
    });

    const data = await response.json();

    assert.equal(response.status, 200);
    assert.equal(data.npc, "澄");
    assert.equal(data.intent, "refuse_spoiler");
    assert.equal(data.safety.blockedTopic, "three_image_overlay_body");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
