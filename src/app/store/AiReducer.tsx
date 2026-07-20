export type AiStateType = {
  url: string;
  urlError: string;
  urlWarning: string;
  isGenerating: boolean;
  outputText: string;
};

export type AiAction =
  | { type: "SET_URL"; payload: string }
  | { type: "SET_URL_VALIDATION"; payload: { error: string; warning: string } }
  | { type: "SET_OUTPUT_TEXT"; payload: string }
  | { type: "RESET_FORM" };

export const initialAiState: AiStateType = {
  url: "",
  urlError: "",
  urlWarning: "",
  isGenerating: false,
  outputText: "",
};

function onChange<K extends keyof AiStateType>(state: AiStateType, payload: { key: K; value: AiStateType[K] }) {
  const copiedState = { ...state };
  copiedState[payload.key] = payload.value;
  if (copiedState.urlError || copiedState.urlWarning) {
    console.log(copiedState);
    copiedState.urlError = "";
    copiedState.urlWarning = "";
  }
  return copiedState;
}

export function validateUrl(value: string): { error: string; warning: string } {
  const trimmed = value.trim();
  if (!trimmed) return { error: "", warning: "" };

  try {
    const parsed = new URL(trimmed);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return { error: "URL must start with http:// or https://", warning: "" };
    }
    if (parsed.protocol === "http:") {
      return {
        error: "Switch to https:// for a secure connection",
        warning: "",
      };
    }
    if (!parsed.hostname.includes(".")) {
      return {
        error: "Please enter a valid domain (e.g. https://example.com)",
        warning: "",
      };
    }
    return { error: "", warning: "" };
  } catch {
    return { error: "Please enter a valid URL (e.g. https://example.com)", warning: "" };
  }
}

export function aiReducer(state: AiStateType, action: AiAction): AiStateType {
  switch (action.type) {
    case "SET_URL":
      return onChange(state, { key: "url", value: action.payload });
    case "SET_URL_VALIDATION":
      return { ...state, urlError: action.payload.error, urlWarning: action.payload.warning };
    case "SET_OUTPUT_TEXT":
      return { ...state, outputText: action.payload };
    case "RESET_FORM":
      return initialAiState;
    default:
      return state;
  }
}
