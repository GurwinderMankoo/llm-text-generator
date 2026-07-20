'use client';

import { useAi } from "@/app/store/AiContext";
import { useFormFields } from "@/app/store/FormFieldContext";
import { isValidUrl } from "./Global";
import { generateLLMs } from "@/services/generateLlms";

function getErrorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Failed to generate LLMs";
}

export default function AiUrlFormField() {
    const { dispatch: formDispatch } = useFormFields()!;
    const { state: aiState, dispatch: aiDispatch } = useAi()!;
    const { url, urlError, urlWarning, isGenerating } = aiState;

    const handleUrlChange = (value: string) => {
        aiDispatch({ type: "SET_URL", payload: value });
    };

    const handleGenerate = async () => {
        const isValid = isValidUrl(url);
        if (!isValid) {
            const error = "Please enter a valid URL (e.g. https://example.com)";
            aiDispatch({ type: "SET_URL_VALIDATION", payload: { error, warning: "" } });
            return;
        }

        try {
            const res = await generateLLMs(url);

            if (res.success) {
                aiDispatch({ type: "SET_OUTPUT_TEXT", payload: res.markdown });
            } else {
                aiDispatch({ type: "SET_URL_VALIDATION", payload: { error: res.error || "Failed to generate LLMs", warning: "" } });
            }
        } catch (error: unknown) {
            aiDispatch({ type: "SET_URL_VALIDATION", payload: { error: getErrorMessage(error), warning: "" } });
        }

    };

    const switchToManual = () => {
        formDispatch({ type: "SET_MODE", payload: "manual" });
    };

    return (
        <div className="animate-[fadeIn_0.3s_ease]">
            <div className="bg-surface border border-border-custom rounded-2xl p-8 text-center">
                {/* AI icon */}
                <div className="w-16 h-16 bg-accent-dim border-2 border-[rgba(124,108,252,0.25)] rounded-full flex items-center justify-center text-[32px] mb-5 mx-auto animate-pulse-custom">
                    🤖
                </div>

                <h2 className="text-xl font-bold text-text-custom mb-2">
                    AI-powered generation
                </h2>
                <p className="font-mono text-muted-custom text-[13px] max-w-[480px] mx-auto mb-7 leading-relaxed">
                    Enter your website URL and let AI analyze your site to automatically
                    generate a comprehensive <code className="text-accent2-custom">llms.txt</code> file.
                </p>

                {/* URL Input */}
                <div className="max-w-[520px] mx-auto mb-6">
                    <div
                        className={`flex items-center gap-2 bg-surface2 border rounded-lg px-4 py-2.5 transition-all duration-200 ${urlError
                            ? "border-red-custom focus-within:border-red-custom focus-within:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]"
                            : urlWarning
                                ? "border-yellow-500 focus-within:border-yellow-400 focus-within:shadow-[0_0_0_3px_rgba(234,179,8,0.2)]"
                                : "border-border-custom2 focus-within:border-accent-custom focus-within:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                            }`}
                    >
                        <span className="text-muted-custom text-[15px] shrink-0">🔗</span>
                        <input
                            type="url"
                            value={url}
                            onChange={(e) => handleUrlChange(e.target.value)}
                            placeholder="https://yoursite.com"
                            className="flex-1 bg-transparent border-none outline-none font-mono text-[13px] text-text-custom placeholder:text-muted-custom"
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                        />
                    </div>
                    {urlError && (
                        <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-red-custom font-mono text-left">
                            <span>⚠️</span>
                            {urlError}
                        </p>
                    )}
                    {urlWarning && !urlError && (
                        <p className="flex items-center gap-1.5 mt-1.5 text-[12px] text-yellow-400 font-mono text-left">
                            <span>💡</span>
                            {urlWarning}
                        </p>
                    )}
                </div>

                {/* Generate button */}
                <button
                    onClick={handleGenerate}
                    disabled={!url.trim() || !!urlError || isGenerating}
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 ${!url.trim() || !!urlError || isGenerating
                        ? "bg-surface2 text-muted-custom border border-border-custom2 cursor-not-allowed"
                        : urlWarning
                            ? "bg-amber-500 text-white hover:bg-amber-600 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(234,179,8,0.35)]"
                            : "bg-accent-custom text-white hover:bg-[#6b5ce7] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,108,252,0.35)]"
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Analyzing site…
                        </>
                    ) : (
                        <>
                            <span>✨</span>
                            Generate with AI
                        </>
                    )}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 my-7 max-w-[400px] mx-auto">
                    <div className="flex-1 h-px bg-border-custom2"></div>
                    <span className="text-[11px] font-mono text-muted-custom uppercase tracking-widest">Or</span>
                    <div className="flex-1 h-px bg-border-custom2"></div>
                </div>

                {/* Switch to manual */}
                <div>
                    <p className="font-mono text-[13px] text-muted-custom mb-3">
                        Prefer to fill in everything yourself?
                    </p>
                    <button
                        onClick={switchToManual}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-border-custom2 text-muted-custom bg-transparent hover:text-text-custom hover:bg-surface2 transition-all duration-200"
                    >
                        ✍️ Switch to manual mode
                    </button>
                </div>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
                <div className="bg-surface border border-border-custom rounded-xl p-4">
                    <div className="text-[20px] mb-2">🔍</div>
                    <div className="text-[13px] font-semibold text-text-custom mb-1">Crawl & analyze</div>
                    <div className="font-mono text-[12px] text-muted-custom leading-relaxed">
                        AI visits your site, discovers pages, and understands structure
                    </div>
                </div>
                <div className="bg-surface border border-border-custom rounded-xl p-4">
                    <div className="text-[20px] mb-2">🧠</div>
                    <div className="text-[13px] font-semibold text-text-custom mb-1">Smart organization</div>
                    <div className="font-mono text-[12px] text-muted-custom leading-relaxed">
                        Automatically groups related pages into meaningful sections
                    </div>
                </div>
                <div className="bg-surface border border-border-custom rounded-xl p-4">
                    <div className="text-[20px] mb-2">📄</div>
                    <div className="text-[13px] font-semibold text-text-custom mb-1">Instant export</div>
                    <div className="font-mono text-[12px] text-muted-custom leading-relaxed">
                        Get your llms.txt file ready in seconds, not minutes
                    </div>
                </div>
            </div>
        </div>
    );
}
