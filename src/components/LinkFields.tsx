import React from 'react';

export interface LinkFieldsProps {
  url: string;
  label: string;
  description: string;
  onUrlChange: (value: string) => void;
  onLabelChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onRemove: () => void;
  removeTitle?: string;
}

export default function LinkFields({
  url,
  label,
  description,
  onUrlChange,
  onLabelChange,
  onDescriptionChange,
  onRemove,
  removeTitle = "Remove link"
}: LinkFieldsProps) {
  return (
    <div className="space-y-2 pb-3 border-b border-border-custom2 last:border-0 last:pb-0">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start">
        <input
          type="url"
          value={url}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://example.com/page"
          className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Page title"
          className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
        />
        <button
          onClick={onRemove}
          title={removeTitle}
          className="w-9 h-9 sm:w-9 sm:h-9 bg-red-dim border border-[rgba(248,113,113,0.2)] rounded-lg text-red-custom text-[16px] flex items-center justify-center cursor-pointer hover:bg-[rgba(248,113,113,0.2)] transition-colors duration-200 self-center sm:self-auto"
        >
          ×
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2">
        <input
          type="text"
          value={description || ""}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Brief page description"
          className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
        />
        <div className="hidden sm:block w-9"></div>
      </div>
    </div>
  );
}
