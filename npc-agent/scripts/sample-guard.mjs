import { readFile } from "node:fs/promises";
import { evaluateSpoilerGuard } from "../src/npc/index.mjs";

const samplePath = new URL("../samples/early-spoiler-guess.json", import.meta.url);
const payload = JSON.parse(await readFile(samplePath, "utf8"));

console.log(JSON.stringify(evaluateSpoilerGuard(payload.message, payload.gameState), null, 2));
