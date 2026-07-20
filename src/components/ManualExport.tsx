import { useFormFields } from "@/app/store/FormFieldContext";
import { useState } from "react";
import SyntaxHighlight from "./SyntaxHighlight";
import ExportStep from "./ExportStep";

export default function ManualExport() {
    const { state, dispatch} = useFormFields()!;

    const { outputText } = state;

  return (
        <div className="animate-[fadeIn_0.3s_ease]">
        
            <ExportStep outputText={outputText} />

          {/* Bottom actions */}
          <div className="flex justify-start gap-2.5 mt-4">
            <button
              onClick={() => dispatch({ type: "SET_STEP", payload: 2 })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-border-custom2 text-muted-custom bg-transparent hover:text-text-custom hover:bg-surface2 transition-all duration-200"
            >
              ← Edit
            </button>
            <button
              onClick={() => dispatch({ type: "RESET_FORM" })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-border-custom2 text-muted-custom bg-transparent hover:text-text-custom hover:bg-surface2 transition-all duration-200"
            >
              Start over
            </button>
          </div>
        </div>
  )
}
