import type { ChangeEvent } from "react";
import { useFormFields } from "@/app/store/FormFieldContext";
import type { Step } from "@/app/store/FormFieldReducer";

type SiteInfoFieldName = "siteName" | "siteDesc" | "siteNotes" | "siteCategory";


export default function SiteInfoStep() {
    const { state, dispatch, siteNameInputRef } = useFormFields()!;

    const { siteName, siteDesc, siteNotes, siteCategory, siteNameError } = state;

    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { value, name } = e.target;
      
      dispatch({ type: "FIELD_CHANGE", payload: { key: name as SiteInfoFieldName, value } });
    };

    const goTo = (step: Step) => {
      if (!siteName.trim()) {
        dispatch({ type: 'SET_ERROR', payload: true })
        siteNameInputRef.current?.focus();
        setTimeout(() => dispatch({ type: 'SET_ERROR', payload: false }), 2000);
        return;
      }

      dispatch({ type: "SET_STEP", payload: step })
    }

  return (
        <div className="animate-[fadeIn_0.3s_ease]">
          {/* Site name */}
          <div className="bg-surface border border-border-custom rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2.5 mb-4.5">
              <div className="w-8 h-8 bg-accent-dim border border-[rgba(124,108,252,0.2)] rounded-lg flex items-center justify-center text-[15px]">
                🏷️
              </div>
              <div>
                <div className="text-[15px] font-semibold text-text-custom">
                  Project / site name
                </div>
                <div className="text-[12px] text-muted-custom font-mono">
                  Becomes the H1 heading in your file
                </div>
              </div>
              <span className="text-[10px] bg-[rgba(124,108,252,0.15)] text-accent2-custom rounded px-1.5 py-0.5 font-mono ml-auto">
                required
              </span>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12px] font-mono text-muted-custom tracking-wider">
                NAME
              </label>
              <input
                ref={siteNameInputRef}
                type="text"
                name="siteName"
                value={siteName}
                onChange={(e) => onChange(e)}
                placeholder="e.g. Acme Corp, My SaaS, Personal Blog"
                className={`w-full bg-surface2 border rounded-lg px-3.5 py-2.5 font-mono text-[13px] text-text-custom outline-none transition-all duration-200 ${
                  siteNameError
                    ? "border-red-custom focus:border-red-custom focus:shadow-[0_0_0_3px_rgba(248,113,113,0.2)]"
                    : "border-border-custom2 focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                }`}
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-surface border border-border-custom rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2.5 mb-4.5">
              <div className="w-8 h-8 bg-accent-dim border border-[rgba(124,108,252,0.2)] rounded-lg flex items-center justify-center text-[15px]">
                💬
              </div>
              <div>
                <div className="text-[15px] font-semibold text-text-custom">
                  One-line description
                </div>
                <div className="text-[12px] text-muted-custom font-mono">
                  Shown as blockquote — key context for AI
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-[12px] font-mono text-muted-custom tracking-wider">
                DESCRIPTION
              </label>
              <textarea
                value={siteDesc}
                name="siteDesc"
                onChange={(e) => onChange(e)}
                rows={3}
                placeholder="e.g. Acme Corp makes cloud-based invoicing software for freelancers and small businesses. Trusted by 50,000+ users since 2019."
                className="w-full bg-surface2 border border-border-custom2 rounded-lg px-3.5 py-2.5 font-mono text-[13px] text-text-custom outline-none resize-y min-h-[80px] transition-all duration-200 focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
              ></textarea>
            </div>
          </div>

          {/* Additional Context */}
          <div className="bg-surface border border-border-custom rounded-2xl p-6 mb-4">
            <div className="flex items-center gap-2.5 mb-4.5">
              <div className="w-8 h-8 bg-accent-dim border border-[rgba(124,108,252,0.2)] rounded-lg flex items-center justify-center text-[15px]">
                📋
              </div>
              <div>
                <div className="text-[15px] font-semibold text-text-custom">
                  Additional context
                </div>
                <div className="text-[12px] text-muted-custom font-mono">
                  Key facts, caveats, or notes AI should know
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[12px] font-mono text-muted-custom tracking-wider">
                  IMPORTANT NOTES (one per line)
                </label>
                <textarea
                  value={siteNotes}
                  onChange={(e) => onChange(e)}
                  name="siteNotes"
                  rows={4}
                  placeholder="e.g.&#10;- Pricing is listed in USD only&#10;- Free plan available, no credit card required&#10;- Not compatible with Internet Explorer&#10;- Documentation is versioned — always check the latest"
                  className="w-full bg-surface2 border border-border-custom2 rounded-lg px-3.5 py-2.5 font-mono text-[13px] text-text-custom outline-none resize-y min-h-[80px] transition-all duration-200 focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)]"
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] font-mono text-muted-custom tracking-wider">
                  SITE CATEGORY
                </label>
                <select
                  value={siteCategory}
                  onChange={(e) => onChange(e)}
                  name="siteCategory"
                  className="w-full bg-surface2 border border-border-custom2 rounded-lg px-3.5 py-2.5 font-mono text-[13px] text-text-custom outline-none transition-all duration-200 focus:border-accent-custom focus:shadow-[0_0_0_3px_var(--color-accent-dim2)] appearance-none cursor-pointer pr-10"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b6b82' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 14px center",
                  }}
                >
                  <option value="">— Select type —</option>
                  <option value="SaaS / software product">SaaS / software product</option>
                  <option value="E-commerce store">E-commerce store</option>
                  <option value="Blog / media publication">Blog / media publication</option>
                  <option value="Documentation / developer docs">Documentation / developer docs</option>
                  <option value="Agency / service business">Agency / service business</option>
                  <option value="Portfolio / personal site">Portfolio / personal site</option>
                  <option value="Community / forum">Community / forum</option>
                  <option value="Non-profit / NGO">Non-profit / NGO</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-end gap-2.5 mt-6">
            <button
              onClick={() => goTo(2)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-200 bg-accent-custom text-white hover:bg-[#6b5ce7] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,108,252,0.35)]"
            >
              Continue → Content Links
            </button>
          </div>
        </div>
  )
}
