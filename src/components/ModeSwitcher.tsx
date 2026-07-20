'use client'

import { useState } from "react";

type Theme = "dark" | "light";

const getCurrentTheme = (): Theme => {
  if (typeof document === "undefined") {
    return "dark";
  }

  return document.documentElement.classList.contains("light") ? "light" : "dark";
};

export default function ModeSwitcher() {
     const [theme, setTheme] = useState<Theme>(getCurrentTheme);

    const toggleTheme = () => {
        const nextTheme = theme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        localStorage.setItem("theme", nextTheme);
        document.documentElement.classList.toggle("light", nextTheme === "light");
        document.documentElement.style.colorScheme = nextTheme;
    };

  return (
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-border-custom2 bg-surface hover:bg-surface2 text-text-custom flex items-center justify-center cursor-pointer shadow-sm transition-all duration-300 hover:scale-105 active:scale-95"
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          suppressHydrationWarning
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
  )
}
