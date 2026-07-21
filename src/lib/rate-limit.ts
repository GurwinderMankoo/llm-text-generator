// lib/rate-limit.ts

import { Ratelimit } from "@upstash/ratelimit";
import redis from "./redis";

export const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "1 d"),
    analytics: false,
}); 