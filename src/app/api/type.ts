export type llmGeneratorResponse =
  | { success: true; markdown: string }
  | { success: false; error: string };