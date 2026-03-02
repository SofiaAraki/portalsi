"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-8 h-8" />; 

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-lg bg-gray-800 dark:bg-gray-200 hover:scale-110 transition-all text-xl"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}