import test from "node:test";
import assert from "node:assert/strict";

import { parseNpcResponse } from "../src/npc/response-schema.mjs";

test("parses a valid npc JSON response", () => {
  const parsed = parseNpcResponse(
    JSON.stringify({
      npc: "澄",
      text: "这个判断有方向。先说证据。",
      intent: "ask_for_evidence",
      statePatch: { lastNpcIntent: "ask_for_evidence" },
      safety: { spoilerRisk: "low", blockedTopic: null },
    }),
  );

  assert.equal(parsed.npc, "澄");
  assert.equal(parsed.intent, "ask_for_evidence");
  assert.equal(parsed.safety.spoilerRisk, "low");
});

test("returns safe fallback for invalid model output", () => {
  const parsed = parseNpcResponse("not json", {
    spoilerRisk: "high",
    blockedTopic: "three_image_overlay_body",
    safeRedirectHint: "先回到最后留言。",
  });

  assert.equal(parsed.npc, "澄");
  assert.equal(parsed.intent, "refuse_spoiler");
  assert.equal(parsed.safety.spoilerRisk, "high");
  assert.equal(parsed.safety.blockedTopic, "three_image_overlay_body");
  assert.ok(parsed.text.includes("先回到最后留言"));
});
