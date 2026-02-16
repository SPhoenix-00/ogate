import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

let redis: Redis | null = null;

export function getRedis(): Redis | null {
  return redis;
}

export async function connectRedis(): Promise<void> {
  try {
    redis = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1,
      retryStrategy: () => null,
      lazyConnect: true,
    });
    redis.on("error", () => {});
    await redis.connect();
    console.log("[Redis] Connected to", REDIS_URL);
  } catch (err) {
    console.warn("[Redis] Connection failed — running without cache (in-memory only).");
    if (redis) {
      redis.disconnect();
    }
    redis = null;
  }
}

export async function setInstanceState(instanceId: string, state: object): Promise<void> {
  if (!redis) return;
  await redis.set(`instance:${instanceId}`, JSON.stringify(state), "EX", 3600);
}

export async function getInstanceState(instanceId: string): Promise<object | null> {
  if (!redis) return null;
  const raw = await redis.get(`instance:${instanceId}`);
  return raw ? JSON.parse(raw) : null;
}

export async function deleteInstanceState(instanceId: string): Promise<void> {
  if (!redis) return;
  await redis.del(`instance:${instanceId}`);
}
