import { useFormFields } from "@/app/store/FormFieldContext";

type HandleSectionChangePayload = {
    secId?: string;
    value: string;
    type: 'HEADING' | 'LINK' | 'OPTIONAL_LINK';
    linkId?: string;
    field?: 'url' | 'label';
}

export default function ContentLinksStep() {

    const { state, dispatch } = useFormFields()!;

    const { sections, optionalLinks } = state;

    const handleSectionHeadingChange = ({secId, value, type, linkId, field}: HandleSectionChangePayload) => {
      dispatch({
        type: "HANDLE_SECTION",
        payload: { type, secId, value, linkId, field },
      });
    };

  return (
        <div className="animate-[fadeIn_0.3s_ease]">
          {/* Key sections block */}
          <div className="bg-surface border border-border-custom rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2.5 mb-4.5">
              <div className="w-8 h-8 bg-accent-dim border border-[rgba(124,108,252,0.2)] rounded-lg flex items-center justify-center text-[15px]">
                📚
              </div>
              <div>
                <div className="text-[15px] font-semibold text-text-custom">
                  Key sections
                </div>
                <div className="text-[12px] text-muted-custom font-mono">
                  Add H2 sections with links — AI prioritizes these
                </div>
              </div>
            </div>

            {/* Sections builder */}
            <div className="space-y-5 mb-3.5">
              {sections.map((sec) => (
                <div
                  key={sec.id}
                  className="bg-surface2 border border-border-custom rounded-lg p-4"
                >
                  {/* Heading */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[13px] text-muted-custom font-mono">##</span>
                    <input
                      type="text"
                      value={sec.heading}
                      onChange={(e) =>
                        handleSectionHeadingChange({secId: sec.id, value: e.target.value, type: "HEADING"})
                      }
                      placeholder="Section name (e.g. Docs, Blog, Products)"
                      className="flex-1 bg-transparent border-b border-border-custom2 pb-1 text-[13px] font-semibold text-text-custom outline-none focus:border-accent-custom focus:shadow-none rounded-none"
                    />
                    <button
                      onClick={() => dispatch({ type: 'ADD_REMOVE_SECTION', payload: { type :'REMOVE', secId: sec.id} })}
                      title="Remove section"
                      className="w-7 h-7 bg-red-dim border border-[rgba(248,113,113,0.2)] rounded-lg text-red-custom text-[15px] flex items-center justify-center cursor-pointer hover:bg-[rgba(248,113,113,0.2)] transition-colors duration-200"
                    >
                      ×
                    </button>
                  </div>

                  {/* Url list */}
                  <div className="space-y-2.5">
                    {sec.links.map((link) => (
                      <div
                        key={link.id}
                        className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start"
                      >
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) =>
                            handleSectionHeadingChange({secId: sec.id, linkId: link.id, value: e.target.value, type: "LINK", field: "url"})
                          }
                          placeholder="https://example.com/page"
                          className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                        />
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) =>
                            handleSectionHeadingChange({secId: sec.id, linkId: link.id, value: e.target.value, type: "LINK", field: "label"})
                          }
                          placeholder="Page title / description"
                          className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                        />
                        <button
                          onClick={() => dispatch({ type: 'ADD_REMOVE_LINK_SECTION', payload: { type: 'REMOVE', secId: sec.id, linkId: link.id } })}
                          title="Remove link"
                          className="w-9 h-9 sm:w-9 sm:h-9 bg-red-dim border border-[rgba(248,113,113,0.2)] rounded-lg text-red-custom text-[16px] flex items-center justify-center cursor-pointer hover:bg-[rgba(248,113,113,0.2)] transition-colors duration-200 self-center sm:self-auto"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add link button */}
                  <button
                    onClick={() => dispatch({ type: "ADD_REMOVE_LINK_SECTION", payload: { type: 'ADD', secId: sec.id } })}
                    className="flex items-center gap-1.5 bg-transparent border border-dashed border-border-custom2 rounded-lg px-3.5 py-2 text-muted-custom font-mono text-[12px] cursor-pointer hover:border-accent-custom hover:text-accent2-custom hover:bg-accent-dim transition-all duration-200 w-full mt-3"
                  >
                    ＋ Add link
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => dispatch({ type: 'ADD_REMOVE_SECTION', payload: { type: 'ADD' } })}
              className="flex items-center gap-1.5 bg-transparent border border-dashed border-border-custom2 rounded-lg px-3.5 py-2 text-muted-custom font-mono text-[12px] cursor-pointer hover:border-accent-custom hover:text-accent2-custom hover:bg-accent-dim transition-all duration-200 w-full mt-3"
            >
              ＋ Add another section
            </button>
          </div>

          {/* Optional sections block */}
          <div className="bg-surface border border-border-custom rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2.5 mb-4.5">
              <div className="w-8 h-8 bg-accent-dim border border-[rgba(124,108,252,0.2)] rounded-lg flex items-center justify-center text-[15px]">
                🔵
              </div>
              <div>
                <div className="text-[15px] font-semibold text-text-custom">
                  Optional section
                </div>
                <div className="text-[12px] text-muted-custom font-mono">
                  AI may skip these if context window is tight
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              {optionalLinks.map((link) => (
                <div
                  key={link.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 items-start"
                >
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) =>
                      handleSectionHeadingChange({linkId: link.id, value: e.target.value, type: "OPTIONAL_LINK", field: "url"})
                    }
                    placeholder="https://example.com/page"
                    className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                  />
                  <input
                    type="text"
                    value={link.label}
                    onChange={(e) =>
                      handleSectionHeadingChange({linkId: link.id, value: e.target.value, type: "OPTIONAL_LINK", field: "label"})
                    }
                    placeholder="Page title / description"
                    className="w-full bg-surface border border-border-custom2 rounded-lg px-3.5 py-2 font-mono text-[13px] text-text-custom outline-none transition-all focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                  />
                  <button
                    onClick={() => dispatch({ type: 'ADD_REMOVE_OPTIONAL_LINK', payload: { type: 'REMOVE', linkId: link.id } })}
                    title="Remove optional link"
                    className="w-9 h-9 bg-red-dim border border-[rgba(248,113,113,0.2)] rounded-lg text-red-custom text-[16px] flex items-center justify-center cursor-pointer hover:bg-[rgba(248,113,113,0.2)] transition-colors duration-200 self-center sm:self-auto"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => dispatch({ type: "ADD_REMOVE_OPTIONAL_LINK", payload: { type: 'ADD'} })}
              className="flex items-center gap-1.5 bg-transparent border border-dashed border-border-custom2 rounded-lg px-3.5 py-2 text-muted-custom font-mono text-[12px] cursor-pointer hover:border-accent-custom hover:text-accent2-custom hover:bg-accent-dim transition-all duration-200 w-full mt-3"
            >
              ＋ Add optional link
            </button>
          </div>

          {/* Tip Callout */}
          <div className="flex gap-2.5 bg-[rgba(167,139,250,0.06)] border border-[rgba(167,139,250,0.15)] rounded-lg p-3.5 mt-4 font-mono text-[13px] text-muted-custom">
            <span className="text-[15px] shrink-0">💡</span>
            <span>
              Include your most authoritative pages — FAQs, product pages,
              pricing, documentation, About. Avoid pagination, login pages, or
              duplicate content.
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2.5 mt-6">
            <button
              onClick={() => dispatch({ type: 'SET_STEP', payload: 1 })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer border border-border-custom2 text-muted-custom bg-transparent hover:text-text-custom hover:bg-surface2 transition-all duration-200"
            >
              ← Back
            </button>
            <button
              onClick={() => dispatch({ type: 'GENERATE_AND_SHOW' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-accent-custom text-white hover:bg-[#6b5ce7] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,108,252,0.35)]"
            >
              Generate llms.txt →
            </button>
          </div>
        </div>
  )
}
