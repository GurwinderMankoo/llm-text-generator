'use server';

import { GenerateContentParameters, GoogleGenAI } from "@google/genai";
import * as cheerio from "cheerio";

interface ExtendedGenerateContentParameters extends GenerateContentParameters {
  systemInstruction: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export type GenerateLLMResult =
  | { success: true; markdown: string }
  | { success: false; error: string };

export async function generateLLM(url: string): Promise<GenerateLLMResult> {
  try {
    // 1. Validate URL
    const parsedUrl = new URL(url);

    // 2. Fetch HTML with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(parsedUrl.toString(), {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
      next: { revalidate: 0 },
    });

    clearTimeout(timeout);

    if (!response.ok)
      throw new Error(`Failed to fetch: HTTP ${response.status}`);

    const html = await response.text();

    // 3. Parse with Cheerio
    const $ = cheerio.load(html);

    // --- Meta extraction ---
    const siteTitle =
      $("title").text().trim() ||
      $('meta[property="og:title"]').attr("content")?.trim() ||
      parsedUrl.hostname;

    const metaDescription =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      "";

    // --- Body text extraction (critical for SPA/single-page sites) ---
    // Remove noise elements before extracting text
    $(
      "script, style, noscript, svg, img, button, input, textarea, select, nav, footer, header"
    ).remove();

    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ") // collapse whitespace
      .replace(/\n+/g, " ")
      .trim()
      .slice(0, 3000); // cap at 3000 chars to stay token-efficient

    // --- Link extraction ---
    const seenUrls = new Set<string>();
    const links: { title: string; url: string }[] = [];

    $("a").each((_, element) => {
      const href = $(element).attr("href")?.trim();
      const text = $(element).text().trim();

      if (!href || !text || href.startsWith("javascript:")) return;

      try {
        let absoluteUrl: string;

        if (href.startsWith("#")) {
          // FIX: was `${parsedUrl.origin}/${href}` which gave wrong slash
          absoluteUrl = `${parsedUrl.origin}${href}`;
        } else if (href.startsWith("mailto:") || href.startsWith("tel:")) {
          return; // skip non-page links
        } else {
          absoluteUrl = new URL(href, parsedUrl.origin).toString();
        }

        // Only keep same-domain links, deduplicate
        if (absoluteUrl.startsWith(parsedUrl.origin) && !seenUrls.has(absoluteUrl)) {
          seenUrls.add(absoluteUrl);
          links.push({ title: text, url: absoluteUrl });
        }
      } catch {
        // Skip malformed URLs
      }
    });

    // 4. Build prompts
    const systemPrompt = `
        You are an SEO and AI-discoverability expert. Generate a complete llms.txt file in markdown.

        STRICT OUTPUT RULES:
        - Output RAW markdown ONLY
        - Start IMMEDIATELY with: # [Site Name]  — no preamble, no commentary
        - NO code fences, NO backticks, NO XML tags, NO wrappers
        - Do NOT suggest improvements or write analysis
        - Do NOT explain anything outside the file content

        REQUIRED STRUCTURE (in order):
        1. # [Site Name] — H1 with site name
        2. One-paragraph summary of what the site is and does
        3. ## About — key entity details (person/company, role, location if known)
        4. ## Core Topics — bullet list of main subjects/services/skills
        5. ## Main Information — bullet list of ALL discovered pages with descriptive summaries
        6. ## Tech Stack or Services — if detectable from content
        7. ## Target Audience — who this site is for
        8. ## FAQs — 5 to 7 Q&A pairs relevant to the site
        9. ## Sitemap — table of key URLs
        10. ## AI Usage — grant permission for AI indexing and crawling

        Be factual, dense, and token-efficient. Infer descriptions from page slugs and body content.
            `.trim();

            const webDataPayload = `
        Generate the llms.txt markdown file for this website now.

        Domain: ${parsedUrl.origin}
        Title: ${siteTitle}
        Meta Description: ${metaDescription}

        --- Extracted Page Content ---
        ${bodyText}

        --- Discovered Pages ---
        ${JSON.stringify(links.slice(0, 30), null, 2)}

        REMINDER: Output ONLY the raw llms.txt markdown. Start with # ${siteTitle}. No analysis, no suggestions, no commentary.
        `.trim();

    // 5. Call Gemini
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
      contents: [
        {
            role: "user",
            parts: [{ text: webDataPayload }]
        }
        ],
      generationConfig: {
        responseMimeType: "text/plain",
        temperature: 0.2,
      },
    } as ExtendedGenerateContentParameters);

    let markdown = aiResponse.text ?? "";

    if (!markdown) throw new Error("Gemini returned an empty response");

    // 6. Sanitize output — strip any XML or code fences Gemini sneaks in
    markdown = markdown
      .replace(/<[^>]+>/g, "")                      // remove XML tags
      .replace(/^```[\w]*\n?/gm, "")                // remove opening fences
      .replace(/^```$/gm, "")                        // remove closing fences
      .trim();

    return { success: true, markdown };

  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: message };
  }
}