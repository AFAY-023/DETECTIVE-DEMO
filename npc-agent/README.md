# Detective NPC Agent

Stateful core for the assistant NPC `澄`.

This first implementation is intentionally small:

- The game owns `gameState`.
- The NPC reads the state and returns a structured response.
- Spoiler prevention is handled by explicit stage rules and guard checks.
- Core logic is testable without calling a model.

## Local Checks

Use the bundled or system Node.js:

```bash
node --test tests/*.test.mjs
```

Sample guard output:

```bash
node scripts/sample-guard.mjs
```

Sample prompt:

```bash
node scripts/sample-prompt.mjs
```

Local mock HTTP server:

```bash
node scripts/dev-server.mjs
```

Then POST to:

```text
http://127.0.0.1:8787/agents/npc-assistant/demo-001
```

PowerShell users should read JSON samples as UTF-8:

```powershell
$body = Get-Content -Encoding UTF8 -Raw -Path .\samples\early-spoiler-guess.json
Invoke-WebRequest -Uri "http://127.0.0.1:8787/agents/npc-assistant/demo-001" -Method POST -ContentType "application/json; charset=utf-8" -Body $body
```

## Payload Shape

```json
{
  "sessionId": "demo-001",
  "message": "我觉得最后那条博客像是在写给死去的妻子。",
  "gameState": {
    "chapter": "old_womans_prayer",
    "currentStage": "abnormal_final_post",
    "unlockedEvidence": ["final_post", "blog_profile"],
    "discoveredMechanics": [],
    "submittedTheories": []
  }
}
```

## Flue Entry

The Flue webhook entry lives at:

```text
../.flue/agents/npc-assistant.ts
```

Run it with Flue after installing Flue dependencies for your environment. The root `package.json` contains the Flue scripts and dependencies because Flue discovers `.flue/` from the project root.

```bash
npm install
npm run flue:build
npm run flue:start
```

The Flue server exposes:

```text
POST /agents/npc-assistant/:id
```

The core modules in `src/npc/` can be reused by a web server, Dify bridge, or DingTalk bridge later.
