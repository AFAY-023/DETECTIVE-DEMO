import { readFile } from "node:fs/promises";
import { buildNpcPrompt, evaluateSpoilerGuard } from "../src/npc/index.mjs";

const samplePath = new URL("../samples/early-final-post.json", import.meta.url);
const payload = JSON.parse(await readFile(samplePath, "utf8"));
const guard = evaluateSpoilerGuard(payload.message, payload.gameState);

console.log(buildNpcPrompt(payload, guard));
