'use client';

import React, { useContext, createContext, useRef, useReducer } from 'react';
import { formFieldReducer, type FormFieldAction } from './FormFieldReducer';


interface LinkItem {
  id: string;
  url: string;
  label: string;
}

export interface SectionItem {
  id: string;
  heading: string;
  links: LinkItem[];
}


export type Mode = "ai" | "manual";

export type FormFieldStateType = {
  mode: Mode;
  step: number;
  siteName: string;
  siteDesc: string;
  siteNotes: string;
  siteCategory: string;
  siteNameError: boolean;
  sections: SectionItem[];
  optionalLinks: LinkItem[];
  outputText: string;
}

export const sections = [
  
]

export const formFieldState = {
  mode: "manual" as Mode,
  step: 1,
  siteName: "",
  siteDesc: "",
  siteNotes: "",
  siteCategory: "",
  siteNameError: false,
  sections: [
    {
      id: "sec-0",
      heading: "Docs",
      links: [{ id: "link-0-0", url: "", label: "" }],
    },
    {
      id: "sec-1",
      heading: "Key pages",
      links: [{ id: "link-1-0", url: "", label: "" }],
    },
  ],
  optionalLinks: [],
  outputText: "",
}

type ContextValue = {
  state: FormFieldStateType;
  dispatch: React.Dispatch<FormFieldAction>;
  siteNameInputRef: React.RefObject<HTMLInputElement | null>;
}

const FormFieldContext = createContext<ContextValue | undefined>(undefined);

export const useFormFields = () => useContext(FormFieldContext);

export default function FormFieldContextProvider({ children }: { children: React.ReactNode }) {

    const [state, dispatch] = useReducer(formFieldReducer, formFieldState);

    const siteNameInputRef = useRef<HTMLInputElement>(null);


  return (
    <FormFieldContext.Provider value={{ state, dispatch, siteNameInputRef }}>
      {children}
    </FormFieldContext.Provider>
  )
}
