import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const redisclient = createClient({
  url: process.env.REDIS_URL as string, 
});

redisclient.on("connect", () => {
  console.log("✅ Connected to Upstash Redis");
});

redisclient.on("error", (err) => {
  console.error("❌ Redis Client Error:", err);
});
