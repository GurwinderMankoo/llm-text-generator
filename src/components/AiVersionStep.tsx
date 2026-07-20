
import { useAi } from "@/app/store/AiContext";
import AiUrlFormField from "./AiUrlFormField";
import ExportStep from "./ExportStep";

export default function AiVersionStep() {

    const { state, dispatch } = useAi()!;

    const { outputText } = state;

    if(!!outputText) {
        return (
            <div className="animate-[fadeIn_0.3s_ease]">
                <ExportStep outputText={outputText} />

                <div className="flex justify-start gap-2.5 mt-4">
                    <button
                        onClick={() => dispatch({ type: "RESET_FORM" })}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-border-custom2 text-muted-custom bg-transparent hover:text-text-custom hover:bg-surface2 transition-all duration-200"
                    >
                        ← Start over
                    </button>
                </div>
            </div>
        )
    }

    return <AiUrlFormField />

}
