'use client';

import { useFormFields } from "@/app/store/FormFieldContext";
import type { Mode } from "@/app/store/FormFieldContext";

export default function VersionTabs() {
    const { state, dispatch } = useFormFields()!;
    const { mode } = state;

    const setMode = (nextMode: Mode) => {
        dispatch({ type: "SET_MODE", payload: nextMode });
    };

    return (
        <div className="flex items-center justify-center mb-8">
            <div className="inline-flex items-center bg-surface border border-border-custom rounded-xl p-1 gap-1">
                {/* Manual tab */}
                <button
                    onClick={() => setMode("manual")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-all duration-200 ${
                        mode === "manual"
                            ? "bg-accent-custom text-white shadow-sm"
                            : "text-muted-custom hover:text-text-custom hover:bg-surface2"
                    }`}
                >
                    <span className="text-[15px]">✍️</span>
                    Manual version
                </button>

                {/* AI tab */}
                <button
                    onClick={() => setMode("ai")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[13px] font-medium cursor-pointer transition-all duration-200 ${
                        mode === "ai"
                            ? "bg-accent-custom text-white shadow-sm"
                            : "text-muted-custom hover:text-text-custom hover:bg-surface2"
                    }`}
                >
                    <span className="text-[15px]">🤖</span>
                    AI version
                </button>
            </div>
        </div>
    );
}
