import { createNpcHttpServer } from "../src/server.mjs";

const port = Number(process.env.PORT || 8787);
const host = process.env.HOST || "127.0.0.1";
const server = createNpcHttpServer();

server.listen(port, host, () => {
  console.log(`NPC mock server listening on http://${host}:${port}`);
  console.log(`POST http://${host}:${port}/agents/npc-assistant/demo-001`);
});
