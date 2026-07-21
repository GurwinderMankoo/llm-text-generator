
interface LogoProps {
  className?: string;
}

export default function Logo({ className = "w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      className={`${className} select-none pointer-events-none transition-all duration-300 hover:scale-105`}
    >
      <title>llmoptimize compact logo</title>
      <desc>Compact square logo: a rounded badge with a simple document icon and an upward arrow, representing AI search optimization</desc>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path
            d="M2 1L8 5L2 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="logo-arrow-head"
          />
        </marker>
      </defs>
      <rect
        x="10"
        y="10"
        width="180"
        height="180"
        rx="36"
        className="logo-bg"
      />
      <path
        d="M70,58 H112 L124,70 V138 Q124,144 118,144 H70 Q64,144 64,138 V64 Q64,58 70,58 Z"
        className="logo-doc"
      />
      <path
        d="M112,58 L124,70 H116 Q112,70 112,64 Z"
        className="logo-doc-fold"
      />
      <rect
        x="74"
        y="86"
        width="34"
        height="6"
        rx="3"
        className="logo-line-1"
      />
      <rect
        x="74"
        y="98"
        width="22"
        height="6"
        rx="3"
        className="logo-line-2"
      />
      <line
        x1="106"
        y1="76"
        x2="140"
        y2="42"
        strokeWidth="6"
        strokeLinecap="round"
        markerEnd="url(#arrow)"
        className="logo-arrow"
      />
    </svg>
  );
}
