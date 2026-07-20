import { useFormFields } from "@/app/store/FormFieldContext";
import type { Step } from "@/app/store/FormFieldReducer";

export default function Steps() {
    const { state, dispatch, siteNameInputRef } = useFormFields()!;
    const { step, siteName } = state;

    const goTo = (step: Step) => {
        if (!siteName.trim()) {
            dispatch({ type: 'SET_ERROR', payload: true })
            siteNameInputRef.current?.focus();
            setTimeout(() => dispatch({ type: 'SET_ERROR', payload: false }), 2000);
            return;
        }
        if(step === 3) {
            dispatch({ type: "GENERATE_AND_SHOW" })
            return window.scrollTo({ top: 0, behavior: "smooth" });
        }
         dispatch({ type: "SET_STEP", payload: step })
    };
    
  return (
    <div className="flex items-center">
        {/* Step 1 */}
        <div
        className={`flex items-center gap-2 font-mono text-[13px] cursor-pointer`}
        onClick={() => goTo(1)}
        >
        <div
            className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[12px] font-medium border transition-all duration-300 ${
            step === 1
                ? "bg-accent-custom border-accent-custom text-white"
                : step > 1
                ? "bg-green-custom border-green-custom text-[#0a0a0f]"
                : "bg-surface border-border-custom2 text-muted-custom"
            }`}
        >
            1
        </div>
        <span
            className={`hidden sm:inline transition-colors duration-300 ${
            step === 1
                ? "text-text-custom"
                : step > 1
                ? "text-green-custom"
                : "text-muted-custom"
            }`}
        >
            Site info
        </span>
        </div>

        <div className="w-10 h-px bg-border-custom2 mx-2"></div>

        {/* Step 2 */}
        <div
        className={`flex items-center gap-2 font-mono text-[13px] cursor-pointer`}
        onClick={() => goTo(2)}
        >
        <div
            className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[12px] font-medium border transition-all duration-300 ${
            step === 2
                ? "bg-accent-custom border-accent-custom text-white"
                : step > 2
                ? "bg-green-custom border-green-custom text-[#0a0a0f]"
                : "bg-surface border-border-custom2 text-muted-custom"
            }`}
        >
            2
        </div>
        <span
            className={`hidden sm:inline transition-colors duration-300 ${
            step === 2
                ? "text-text-custom"
                : step > 2
                ? "text-green-custom"
                : "text-muted-custom"
            }`}
        >
            Content links
        </span>
        </div>

        <div className="w-10 h-px bg-border-custom2 mx-2"></div>

        {/* Step 3 */}
        <div
        className={`flex items-center gap-2 font-mono text-[13px] cursor-pointer`}
        onClick={() => goTo(3)}
        >
        <div
            className={`w-6.5 h-6.5 rounded-full flex items-center justify-center text-[12px] font-medium border transition-all duration-300 ${
            step === 3
                ? "bg-accent-custom border-accent-custom text-white"
                : "bg-surface border-border-custom2 text-muted-custom"
            }`}
        >
            3
        </div>
        <span
            className={`hidden sm:inline transition-colors duration-300 ${
            step === 3 ? "text-text-custom" : "text-muted-custom"
            }`}
        >
            Export
        </span>
        </div>
    </div>
  )
}
