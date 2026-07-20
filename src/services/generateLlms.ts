'use server';

import { llmGenerator } from "@/app/api/llmGenerator";

export type llmGeneratorResponse =
  | { success: true; markdown: string }
  | { success: false; error: string };

export async function generateLLMs(url: string): Promise<llmGeneratorResponse> {

  const res = await llmGenerator(url);

  return res;
}