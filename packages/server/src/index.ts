import express from "express";
import cors from "cors";
import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import { OGateRoom } from "./rooms/OGateRoom.js";
import { HomeRoom } from "./rooms/HomeRoom.js";
import { connectMongo } from "./db/mongo.js";
import { connectRedis } from "./db/redis.js";

const PORT = Number(process.env.PORT) || 2567;

async function main(): Promise<void> {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
  });

  const server = new Server({
    transport: new WebSocketTransport({ server: app.listen(PORT) }),
  });

  server.define("ogate", OGateRoom);
  server.define("home", HomeRoom);

  await connectMongo();
  await connectRedis();

  console.log(`[OGate Server] Listening on ws://localhost:${PORT}`);
}

main().catch(console.error);
