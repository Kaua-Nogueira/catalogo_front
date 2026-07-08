import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set) => {
  // Safe detection on load
  const getInitialTheme = (): Theme => {
    if (typeof window !== "undefined") {
      const persisted = localStorage.getItem("theme") as Theme | null;
      if (persisted === "dark" || persisted === "light") {
        return persisted;
      }
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    return "light";
  };

  return {
    theme: getInitialTheme(),
    setTheme: (theme) => {
      if (typeof window !== "undefined") {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
      set({ theme });
    },
    toggle: () => {
      set((state) => {
        const next = state.theme === "dark" ? "light" : "dark";
        if (typeof window !== "undefined") {
          if (next === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
          } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
          }
        }
        return { theme: next };
      });
    },
  };
});
