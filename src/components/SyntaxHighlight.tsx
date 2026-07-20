
type SyntaxHighlightProps = {
  text: string;
};


export default function SyntaxHighlight({ text }: SyntaxHighlightProps) {
  if (!text) return null;
  
  console.log("SyntaxHighlight", text);
  
  return text.split("\n").map((line, idx) => {
      if (line.startsWith("# ")) {
        return (
          <div key={idx} className="text-[#c084fc] font-medium">
            {line}
          </div>
        );
      }
      if (line.startsWith("## ")) {
        return (
          <div key={idx} className="text-[#a78bfa] font-medium">
            {line}
          </div>
        );
      }
      if (line.startsWith("> ")) {
        return (
          <div key={idx} className="text-[#34d399] italic">
            {line}
          </div>
        );
      }
      if (line.match(/^- \[/)) {
        const match = line.match(/^(- )(\[.+?\])(\(.+?\))(.*)$/);
        if (match) {
          const [, dash, label, url, rest] = match;
          return (
            <div key={idx} className="break-all">
              <span className="text-[#6b6b82]">{dash}</span>
              <span className="text-[#60a5fa]">
                {label}
                {url}
              </span>
              <span className="text-text-custom">{rest}</span>
            </div>
          );
        }
      }
      return (
        <div key={idx} className="min-h-[1.5rem] break-all">
          {line}
        </div>
      );
  });
}
