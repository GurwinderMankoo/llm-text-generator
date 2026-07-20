import { useFormFields } from "@/app/store/FormFieldContext";
import { useCallback, useState } from "react";
import SyntaxHighlight from "./SyntaxHighlight";

export default function ExportStep({ outputText }: { outputText: string }) {
    
    const [copySuccess, setCopySuccess] = useState(false);

    const getByteSize = useCallback((text: string) => {
        return new Blob([text]).size;
    },[]);

  // Copy text to clipboard
  const copyOutput = () => {
    navigator.clipboard.writeText(outputText).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  // Download output as llms.txt file
  const downloadOutput = () => {
    const blob = new Blob([outputText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "llms.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
        <div className="animate-[fadeIn_0.3s_ease]">
          {/* Success card */}
          <div className="flex flex-col items-center p-8 bg-surface border border-border-custom rounded-2xl text-center mb-4">
            <div className="w-16 h-16 bg-green-dim border-2 border-green-custom text-green-custom rounded-full flex items-center justify-center text-[28px] mb-4 animate-pop-in">
              ✓
            </div>
            <h2 className="text-xl font-bold text-text-custom mb-1.5">
              Your llms.txt is ready
            </h2>
            <p className="font-mono text-muted-custom text-[13px] max-w-[400px] mb-6">
              Deploy this file to your website root so AI tools can find it at{" "}
              <code className="text-accent2-custom bg-accent-dim rounded px-1.5 py-0.5">
                yoursite.com/llms.txt
              </code>
            </p>

            {/* Deploy steps */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 w-full text-left">
              <div className="bg-surface2 border border-border-custom rounded-lg p-3.5">
                <div className="font-mono text-[11px] text-accent2-custom mb-1.5">
                  STEP 01
                </div>
                <p className="font-mono text-[12px] text-muted-custom leading-relaxed">
                  Download the file below and rename it <code>llms.txt</code>
                </p>
              </div>

              <div className="bg-surface2 border border-border-custom rounded-lg p-3.5">
                <div className="font-mono text-[11px] text-accent2-custom mb-1.5">
                  STEP 02
                </div>
                <p className="font-mono text-[12px] text-muted-custom leading-relaxed">
                  Upload to your website&apos;s <code>root</code> folder (same level
                  as index.html)
                </p>
              </div>

              <div className="bg-surface2 border border-border-custom rounded-lg p-3.5">
                <div className="font-mono text-[11px] text-accent2-custom mb-1.5">
                  STEP 03
                </div>
                <p className="font-mono text-[12px] text-muted-custom leading-relaxed">
                  Verify by visiting <code>yoursite.com/llms.txt</code> in browser
                </p>
              </div>
            </div>
          </div>

          {/* Export editor display block */}
          <div className="bg-surface border border-border-custom rounded-2xl overflow-hidden mb-4">
            <div className="flex items-center justify-between px-4.5 py-3.5 border-b border-border-custom bg-surface2">
              <div className="flex items-center gap-2 font-mono text-[13px]">
                <span>📄</span>
                <span className="text-accent2-custom font-semibold">llms.txt</span>
                <span className="text-muted-custom text-[11px]">
                  {getByteSize(outputText)} bytes
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyOutput}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[12px] border cursor-pointer transition-all duration-200 ${
                    copySuccess
                      ? "bg-green-dim text-green-custom border-[rgba(52,211,153,0.3)]"
                      : "bg-accent-dim text-accent2-custom border-[rgba(124,108,252,0.2)] hover:bg-accent-dim2"
                  }`}
                >
                  {copySuccess ? "✓ Copied!" : "⎘ Copy"}
                </button>
                <button
                  onClick={downloadOutput}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[12px] border bg-green-dim text-green-custom border-[rgba(52,211,153,0.2)] cursor-pointer hover:bg-[rgba(52,211,153,0.18)] transition-all duration-200"
                >
                  ↓ Download
                </button>
              </div>
            </div>
            {/* Highlights code content */}
            <div className="p-5 font-mono text-[13px] leading-relaxed text-text-custom max-h-[480px] overflow-y-auto whitespace-pre-wrap select-text scrollbar-custom bg-surface2 border-t border-border-custom">
              <SyntaxHighlight text={outputText} />
            </div>
          </div>
        </div>
  )
}
