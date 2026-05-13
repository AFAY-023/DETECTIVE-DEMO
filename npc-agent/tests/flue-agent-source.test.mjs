import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("Flue webhook agent uses Valibot structured output", async () => {
  const source = await readFile(new URL("../../.flue/agents/npc-assistant.ts", import.meta.url), "utf8");

  assert.match(source, /import \* as v from "valibot"/);
  assert.match(source, /const npcResponseSchema = v\.object/);
  assert.match(source, /session\.prompt\(prompt, \{\s*result: npcResponseSchema/s);
  assert.match(source, /normalizePromptResult/);
});
