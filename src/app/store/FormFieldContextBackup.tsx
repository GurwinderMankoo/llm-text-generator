'use client';

import React, { useContext, createContext, useState, useRef, useMemo, Dispatch, SetStateAction } from 'react';


interface LinkItem {
  id: string;
  url: string;
  label: string;
}

interface SectionItem {
  id: string;
  heading: string;
  links: LinkItem[];
}

type FormFieldContextValue = {
  step: 1 | 2 | 3;
  siteName: string;
  setSiteName: Dispatch<SetStateAction<string>>;
  siteDesc: string;
  setSiteDesc: Dispatch<SetStateAction<string>>;
  siteNotes: string;
  setSiteNotes: Dispatch<SetStateAction<string>>;
  siteCategory: string;
  setSiteCategory: Dispatch<SetStateAction<string>>;
  siteNameError: boolean;
  siteNameInputRef: React.RefObject<HTMLInputElement | null>;
  sections: SectionItem[];
  setSections: Dispatch<SetStateAction<SectionItem[]>>;
  optionalLinks: LinkItem[];
  setOptionalLinks: Dispatch<SetStateAction<LinkItem[]>>;
  outputText: string;
  setOutputText: Dispatch<SetStateAction<string>>;
  resetForm: () => void;
  generateAndShow: () => void;
  goTo: (step: 1 | 2 | 3) => void;
  buildOutput: () => string;
};

export type FormFieldStateType = {
  step: number;
  siteName: string;
  siteDesc: string;
  siteNotes: string;
  siteCategory: string;
  siteNameError: boolean;
  siteNameInputRef: React.RefObject<HTMLInputElement | null>;
  sections: SectionItem[];
  optionalLinks: LinkItem[];
  outputText: string;
}

export const formFieldState = {
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

const FormFieldContext = createContext<FormFieldContextValue | null>(null);

export const useFormFields = () => useContext(FormFieldContext);

export default function FormFieldContextProvider({ children }: { children: React.ReactNode }) {

    const [step, setStep] = useState<1 | 2 | 3>(1);
    
    // Form State
    const [siteName, setSiteName] = useState("");
    const [siteDesc, setSiteDesc] = useState("");
    const [siteNotes, setSiteNotes] = useState("");
    const [siteCategory, setSiteCategory] = useState("");
    const [siteNameError, setSiteNameError] = useState(false);

    // Key sections list
    const [sections, setSections] = useState<SectionItem[]>([
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
    ]);

    // Optional links list
    const [optionalLinks, setOptionalLinks] = useState<LinkItem[]>([]);

    // Generated text state
    const [outputText, setOutputText] = useState("");

    const siteNameInputRef = useRef<HTMLInputElement>(null);


    // Handle panel transition

    const resetForm = () => {
        setSiteName("");
        setSiteDesc("");
        setSiteNotes("");
        setSiteCategory("");
        setSections([
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
        ]);
        setOptionalLinks([]);
        setOutputText("");
        setStep(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

      // Build markdown output
  const buildOutput = (): string => {
    let out = `# ${siteName.trim() || "My Site"}\n`;

    if (siteDesc.trim()) {
      const lines = siteDesc
        .trim()
        .split("\n")
        .map((l) => `> ${l}`)
        .join("\n");
      out += `\n${lines}\n`;
    }

    if (siteCategory) {
      out += `\nSite type: ${siteCategory}\n`;
    }

    if (siteNotes.trim()) {
      out += `\n`;
      const noteLines = siteNotes
        .trim()
        .split("\n")
        .filter((l) => l.trim());
      noteLines.forEach((line) => {
        const trimmed = line.trim();
        out += (trimmed.startsWith("-") ? trimmed : `- ${trimmed}`) + "\n";
      });
    }

    sections.forEach((sec) => {
      const heading = sec.heading.trim();
      if (!heading) return;
      const validLinks = sec.links.filter((l) => l.url.trim());
      if (validLinks.length === 0) return;

      out += `\n## ${heading}\n\n`;
      validLinks.forEach(({ url, label }) => {
        out += label.trim()
          ? `- [${label.trim()}](${url.trim()})\n`
          : `- ${url.trim()}\n`;
      });
    });

    const validOpt = optionalLinks.filter((l) => l.url.trim());
    if (validOpt.length > 0) {
      out += `\n## Optional\n\n`;
      validOpt.forEach(({ url, label }) => {
        out += label.trim()
          ? `- [${label.trim()}](${url.trim()})\n`
          : `- ${url.trim()}\n`;
      });
    }

    return out;
  };

  // Generate output and transition to step 3
  const generateAndShow = () => {
    const text = buildOutput();
    setOutputText(text);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

// Handle panel transition
  const goTo = (n: 1 | 2 | 3) => {
    if (n === 1) {
      setStep(1);
    } else if (n === 2) {
      if (!siteName.trim()) {
        setSiteNameError(true);
        siteNameInputRef.current?.focus();
        setTimeout(() => setSiteNameError(false), 2000);
        return;
      }
      setStep(2);
    } else if (n === 3) {
      generateAndShow();
    }
  };

  const value = useMemo(() => ({
    step,
    siteName,
    setSiteName,
    siteDesc,
    setSiteDesc,
    siteNotes,
    setSiteNotes,
    siteCategory,
    setSiteCategory,
    siteNameError,
    siteNameInputRef,
    sections,
    setSections,
    optionalLinks,
    setOptionalLinks,
    outputText,
    setOutputText,
    resetForm,
    goTo,
    generateAndShow,
    buildOutput
  }), [step, siteName, siteDesc, siteNotes, siteCategory, siteNameError, sections, optionalLinks, outputText]);

  return (
    <FormFieldContext.Provider value={value}>
      {children}
    </FormFieldContext.Provider>
  )
}
