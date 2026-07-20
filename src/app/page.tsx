import ModeSwitcher from "@/components/ModeSwitcher";
import FormFields from "@/components/FormFields";

import FormFieldContextProvider from "./store/FormFieldContext";

export default function LlmsTxtGenerator() {

  return (
    <div className="w-full max-w-[860px] mx-auto px-6 py-12 relative z-10">
      {/* Theme Toggle Button */}
      <div className="absolute top-6 right-6">
        <ModeSwitcher />
      </div>

      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2.5 bg-accent-dim border border-[rgba(124,108,252,0.3)] rounded-full px-3.5 py-1 text-accent2-custom font-mono text-[12px] tracking-wide mb-5">
          <div className="w-1.5 h-1.5 bg-accent-custom rounded-full animate-pulse-custom"></div>
          AI Search SEO · llms.txt Standard
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] mb-3.5">
          Generate your <br />
          <em className="not-italic text-accent2-custom">llms.txt</em> file
        </h1>
        <p className="font-mono text-muted-custom text-[15px] max-w-[500px] mx-auto">
          {"// help AI systems understand your website — no code required"}
        </p>
      </header>
      <FormFieldContextProvider>
        <FormFields />
      </FormFieldContextProvider>
    </div>
  );
}
