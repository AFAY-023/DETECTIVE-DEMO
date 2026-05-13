import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("root package config includes Flue runtime dependencies and scripts", async () => {
  const pkg = JSON.parse(await readFile(new URL("../../package.json", import.meta.url), "utf8"));

  assert.equal(pkg.type, "module");
  assert.equal(pkg.dependencies["@flue/sdk"], "latest");
  assert.equal(pkg.dependencies.valibot, "latest");
  assert.equal(pkg.devDependencies["@flue/cli"], "latest");
  assert.equal(pkg.scripts["flue:build"], "flue build --target node");
  assert.equal(pkg.scripts["flue:start"], "node dist/server.mjs");
});

test("root env example and gitignore protect local secrets and artifacts", async () => {
  const envExample = await readFile(new URL("../../.env.example", import.meta.url), "utf8");
  const gitignore = await readFile(new URL("../../.gitignore", import.meta.url), "utf8");

  assert.match(envExample, /OPENAI_API_KEY=/);
  assert.match(envExample, /MODEL=openai\/gpt-5-mini/);
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^node_modules\/$/m);
  assert.match(gitignore, /^\.superpowers\/$/m);
  assert.match(gitignore, /^Strange Pictures \*/m);
});
