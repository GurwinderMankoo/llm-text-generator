import type { FormFieldStateType, SectionItem, Mode } from "./FormFieldContext";
export type Step = 1 | 2 | 3;

type TextFieldKey = "siteName" | "siteDesc" | "siteNotes" | "siteCategory";

type FieldChangePayload<K extends TextFieldKey = TextFieldKey> = {
    key: K;
    value: string;
};

type AddPayload = {
    type: 'ADD';
};

type RemovePayload = {
    type: 'REMOVE';
    secId: string; // Notice: no '?' here, it is strictly required!
};

type ActionPayload = AddPayload | RemovePayload;

type AddLinkPayload = {
    type: 'ADD',
    secId: string
}

type RemoveLinkPayload = {
    type: 'REMOVE',
    secId: string,
    linkId: string
}

type LinkActionPayload = AddLinkPayload | RemoveLinkPayload

export type FormFieldAction =
    | { type: "SET_STEP"; payload: Step }
    | { type: "SET_MODE"; payload: Mode }
    | { type: "SET_ERROR"; payload: boolean }
    | { type: "GENERATE_AND_SHOW" }
    | { type: "RESET_FORM" }
    | { type: "FIELD_CHANGE"; payload: FieldChangePayload }
    | { type: "HANDLE_SECTION"; payload: { type: "HEADING" | "LINK" | "OPTIONAL_LINK"; secId?: string; linkId?: string; value: string, field?: 'url' | 'label' | 'description' } }
    | { type: "ADD_REMOVE_SECTION"; payload: ActionPayload }
    | { type: "ADD_REMOVE_LINK_SECTION"; payload: LinkActionPayload }
    | { type: "ADD_REMOVE_OPTIONAL_LINK"; payload: { type: "ADD" | "REMOVE"; linkId?: string } }

const onChange = <K extends keyof FormFieldStateType>(
    state: FormFieldStateType,
    payload: { key: K; value: FormFieldStateType[K] }
) => {
    const copiedState = structuredClone(state) as FormFieldStateType;
    copiedState[payload.key] = payload.value;
    return copiedState;
}

const onSectionChange = (
    state: FormFieldStateType,
    payload: { type: "HEADING" | "LINK" | "OPTIONAL_LINK"; secId?: string; linkId?: string; value: string, field?: 'url' | 'label' | 'description' }
) => {
    const copiedState = structuredClone(state) as FormFieldStateType;
    const { sections } = copiedState;
    const { type, secId, linkId, value } = payload;

    if (type === "OPTIONAL_LINK" && linkId) {
        const linkIdx = copiedState.optionalLinks.findIndex((l) => l.id === linkId);
        if (linkIdx === -1) return state;
        const field = payload.field as "url" | "label" | "description";
        copiedState.optionalLinks[linkIdx][field] = value;
    } else {

        const secIdx = sections.findIndex((s) => s.id === secId);
        if (secIdx === -1) return state;

        if (type === "HEADING") {
            sections[secIdx].heading = value;
        } else if (type === "LINK" && linkId) {
            const linkIdx = sections[secIdx].links.findIndex((l) => l.id === linkId);
            if (linkIdx === -1) return state;
            const field = payload.field as "url" | "label" | "description";
            sections[secIdx].links[linkIdx][field] = value;
        }
    }

    return copiedState;
}

const addRemoveSection = (
    state: FormFieldStateType,
    payload: ActionPayload
) => {

    const copiedState = structuredClone(state)
    const copiedSection = structuredClone(copiedState.sections)
    if (payload.type === "ADD") {
        const newId = `sec-${Date.now()}`;
        const newSection: SectionItem = {
            id: newId,
            heading: "",
            links: [{ id: `link-${newId}-0`, url: "", label: "", description: "" }]
        };
        copiedSection.push(newSection)

        return {
            ...copiedState,
            sections: copiedSection
        }
    } else {
        if (!payload.secId) return copiedState;

        const newSection = copiedSection.filter(section => section.id !== payload.secId)

        return {
            ...copiedState,
            sections: newSection
        }
    }
}

const addRemoveLink = (
    state: FormFieldStateType,
    payload: LinkActionPayload
) => {

    let newSection;

    if (payload.type === "REMOVE") {
        newSection = state.sections.map(s => {
            if (s.id === payload.secId) {
                return {
                    ...s,
                    links: s.links.filter(l => l.id !== payload.linkId)
                }
            }
            return s
        })
    } else {
        newSection = state.sections.map(s => {
            if (s.id === payload.secId) {
                return {
                    ...s,
                    links: [
                        ...s.links,
                        { id: `link-${payload.secId}-${Date.now()}`, url: "", label: "", description: "" }
                    ]
                }
            }
            return s
        })
    }

    return {
        ...state,
        sections: newSection
    }
}

const buildOutput = (state: FormFieldStateType): string => {

    const { siteName, siteDesc, siteCategory, siteNotes, sections, optionalLinks } = state;

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
        validLinks.forEach(({ url, label, description }) => {
            let line = label.trim()
                ? `- [${label.trim()}](${url.trim()})`
                : `- ${url.trim()}`;
            if (description && description.trim()) {
                line += `: ${description.trim()}`;
            }
            out += line + "\n";
        });
    });

    const validOpt = optionalLinks.filter((l) => l.url.trim());
    if (validOpt.length > 0) {
        out += `\n## Optional\n\n`;
        validOpt.forEach(({ url, label, description }) => {
            let line = label.trim()
                ? `- [${label.trim()}](${url.trim()})`
                : `- ${url.trim()}`;
            if (description && description.trim()) {
                line += `: ${description.trim()}`;
            }
            out += line + "\n";
        });
    }

    return out;
};

const generateAndShow = (state: FormFieldStateType) => {
    const outputText = buildOutput(state);
    const step = 3;
    window.scrollTo({ top: 0, behavior: "smooth" });

    return {
        ...state,
        outputText,
        step
    }
};

const addRemoveOptionalLink = (
    state: FormFieldStateType,
    payload: { type: "ADD" | "REMOVE"; linkId?: string }
) => {

    let newOptionalLinks;

    if (payload.type === "REMOVE") {
        newOptionalLinks = state.optionalLinks.filter(l => l.id !== payload.linkId)
    } else {
        newOptionalLinks = [
            ...state.optionalLinks,
            { id: `link-${Date.now()}`, url: "", label: "", description: "" }
        ]
    }

    return {
        ...state,
        optionalLinks: newOptionalLinks
    }
}

// Handle panel transition
const resetForm = (state: FormFieldStateType) => {
    const copiedState = structuredClone(state) as FormFieldStateType;

    copiedState.siteName = "";
    copiedState.siteDesc = "";
    copiedState.siteNotes = "";
    copiedState.siteCategory = "";
    copiedState.sections = [
        {
            id: "sec-0",
            heading: "Docs",
            links: [{ id: "link-0-0", url: "", label: "", description: "" }],
        },
        {
            id: "sec-1",
            heading: "Key pages",
            links: [{ id: "link-1-0", url: "", label: "", description: "" }],
        },
    ];
    copiedState.optionalLinks = [];
    copiedState.outputText = "";
    copiedState.siteInfoInput = "";
    copiedState.step = 1;

    window.scrollTo({ top: 0, behavior: "smooth" });
    return copiedState;
};

const stepChange = (state: FormFieldStateType, step: Step) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (state.siteInfoInput && state.siteInfoInput.trim().length > 0) {
        return {
            ...state,
            step: 1,
        }
    }
    return {
        ...state,
        step
    }
}

export function formFieldReducer(state: FormFieldStateType, action: FormFieldAction): FormFieldStateType {
    switch (action.type) {
        case "SET_STEP":
            return stepChange(state, action.payload);
        case "SET_MODE":
            return { ...state, mode: action.payload };
        case "FIELD_CHANGE":
            return onChange(state, action.payload);
        case "SET_ERROR":
            return { ...state, siteNameError: action.payload }
        case "GENERATE_AND_SHOW":
            return generateAndShow(state)
        case "RESET_FORM":
            return resetForm(state);
        case "HANDLE_SECTION":
            return onSectionChange(state, action.payload);
        case "ADD_REMOVE_SECTION":
            return addRemoveSection(state, action.payload)
        case 'ADD_REMOVE_LINK_SECTION':
            return addRemoveLink(state, action.payload)
        case "ADD_REMOVE_OPTIONAL_LINK":
            return addRemoveOptionalLink(state, action.payload)
        default:
            return state;
    }
}
