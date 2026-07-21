'use server';

import { GoogleGenAI } from '@google/genai';

import { extractWebsiteMetadata } from './extractWebsiteMetadata';
import { llmGeneratorResponse } from './type';

export async function llmGenerator(url: string): Promise<llmGeneratorResponse> {
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

        if (!url) {
            throw new Error('URL is required');
        }

        // 1. Fetch and extract website structure
        const { mainTitle, mainDescription, pages } = await extractWebsiteMetadata(url);

        // 2. System and User Prompts
        const systemInstruction = `You are an expert technical writer and AI-search optimization engine. Your goal is to process crawled or raw website data and output a strictly compliant, premium-quality "llms.txt" file. This file must be optimized so that AI engines (like OpenAI, Claude, Gemini, and Perplexity) can parse, comprehend, and cite the brand accurately during real-time web searches.

            CRITICAL RULES:
            1. FORMAT: Output valid Markdowsn syntax only. Use LF (Unix-style) line endings. The total output should be dense, highly concise, and ideally under 50KB to prevent LLM truncation.
            2. TONE: Use strictly factual, objective, and neutral language. Completely strip out marketing hype, fluff, slogans, unverifiable claims, and corporate buzzwords (e.g., do NOT use "world-class", "revolutionary", "best"). 
            3. DATA SANITIZATION: Exclude repetitive header/footer text, social share buttons, internal navigation trees, placeholder images, and HTML boilerplate.
            4. EXCLUSIONS: Do not write specific numeric pricing or sensitive internal procedures. Link to pages for dynamic details.

            Follow this exact structural layout based on the nature of the web data provided:

            # [Canonical Business or Project Name]
            > [A 1-to-2 sentence highly objective summary of what this website or entity does, who it serves, and its primary purpose. This is the absolute core context for the AI.]

            [Optional: Add 1-2 plain text bullet points here for high-level context, such as core geographic location, primary target audience, or industry vertical. No headers here.]

            ## [Section Heading 1 - e.g., Products, Services, Documentation, or Portfolio]
            Create a clean markdown list of the most high-value URLs. Do not just drop links; you must provide clear context.
            Format exactly as:
            - [Page Title](https://absolute-url.com/path): A brief, one-sentence description of exactly what information is found on this page and when an AI should reference it.

            ## [Section Heading 2 - e.g., Guides, Resources, Policies, or Projects]
            - [Page Title](https://absolute-url.com/path): One-sentence summary explaining this specific resource or documentation page.

            ## Contact & Help
            - [Contact Page](https://absolute-url.com/contact): Description of contact methods.
            - Provide canonical email addresses or official physical support details if publicly listed.

            ---
            [Dynamic Adaptation Instructions Based on Site Type]:
            - IF E-COMMERCE / SAAS: Focus sections on ## Products, ## Core Features, and ## Policies (Returns/Terms). Link to pricing rather than writing exact dollar figures.
            - IF DEVELOPER DOCS: Focus sections on ## Quickstart, ## API Reference, and ## SDKs. Ensure links point directly to the raw documentation or markdown hubs.
            - IF PORTFOLIO / CV: Focus sections on ## Professional Experience, ## Core Technical Skills, and ## Featured Projects.
            - IF CORPORATE / LOCAL BUSINESS: Focus sections on ## Core Services, ## Industry Focus, and ## Areas Served.`;

        const userPrompt = `
        Generate an llms.txt file based on this website data. 
        Ensure all URLs remain absolute. Do not guess links not provided in the data.
        
        Website Meta Data:
        Title: ${mainTitle}
        Description: ${mainDescription}
        
        Extracted Pages:
        ${JSON.stringify(pages, null, 2)}
        `;

        // 3. Call gemini-2.0-flash
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.2,
            },
        });

        return { success: true, markdown: response.text ?? '' };

    } catch (error: unknown) {
        const message = 'Something went wrong. Please try later'
        return { success: false, error: message };
    }


}