"use client";

import React, { useContext, createContext, useReducer } from "react";
import { aiReducer, type AiStateType, type AiAction, initialAiState } from "./AiReducer";

type AiContextValue = {
  state: AiStateType;
  dispatch: React.Dispatch<AiAction>;
};

const AiContext = createContext<AiContextValue | undefined>(undefined);

export const useAi = () => useContext(AiContext);

export default function AiContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(aiReducer, initialAiState);

  return <AiContext.Provider value={{ state, dispatch }}>{children}</AiContext.Provider>;
}
