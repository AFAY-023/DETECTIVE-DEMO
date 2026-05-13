import http from "node:http";

import { createRuleBasedNpcResponse } from "./npc/index.mjs";

export function createNpcHttpServer() {
  return http.createServer(async (request, response) => {
    try {
      if (request.method !== "POST" || !request.url?.startsWith("/agents/npc-assistant/")) {
        sendJson(response, 404, { error: "not_found" });
        return;
      }

      const payload = await readJson(request);
      const result = createRuleBasedNpcResponse(payload);
      sendJson(response, 200, result);
    } catch (error) {
      sendJson(response, 400, {
        error: "bad_request",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, {
    "content-type": "application/json; charset=utf-8",
  });
  response.end(JSON.stringify(body));
}
