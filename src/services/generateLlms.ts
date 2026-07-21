'use server';
import { headers } from "next/headers";
import { ratelimit } from "@/lib/rate-limit";

import { llmGenerator } from "@/app/api/llmGenerator";

export type llmGeneratorResponse =
  | { success: true; markdown: string }
  | { success: false; error: string };

export async function generateLLMs(url: string): Promise<llmGeneratorResponse> {
  const headersList = await headers();
  const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "[IP_ADDRESS]";

  // Rate limit: 5 requests per day per IP
  const { success } = await ratelimit.limit(ip);

  if (!success) {
    return {
      success: false,
      error: "Too many requests. Please try again later (max 5 per day).",
    };
  }

  const res = await llmGenerator(url);

  return res;
}