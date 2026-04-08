import { createContext, useCallback, useEffect, useMemo, useState } from "react";

export const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [query, setQuery] = useState("");
  const defaultFilters = {
    onlyWithCover: false,
    sortByYear: "",
    author: "",
    yearFrom: "",
    yearTo: "",
    language: "",
  };
  const [filters, setFilters] = useState(defaultFilters);

  const [recent, setRecent] = useState(() => {
    try {
      const r = JSON.parse(localStorage.getItem("recentSearches") || "[]");
      return Array.isArray(r) ? r : [];
    } catch {
      return [];
    }
  });
  const addRecent = useCallback((q) => {
    const val = (q || "").trim();
    if (!val) return;
    setRecent((prev) => {
      const next = [val, ...prev.filter((x) => x.toLowerCase() !== val.toLowerCase())].slice(0, 5);
      localStorage.setItem("recentSearches", JSON.stringify(next));
      return next;
    });
  }, []);
  const clearRecent = useCallback(() => {
    setRecent([]);
    localStorage.removeItem("recentSearches");
  }, []);

  const [dark, setDark] = useState(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === null) return true;
    return storedTheme === "dark";
  });
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  const toggleDark = useCallback(() => setDark((d) => !d), []);

  const resetSearch = useCallback(() => {
    setQuery("");
  }, []);

  const resetFilters = useCallback(() => setFilters(defaultFilters), [defaultFilters]);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      filters,
      setFilters,
      resetFilters,
      recent,
      addRecent,
      clearRecent,
      dark,
      toggleDark,
      resetSearch,
    }),
    [query, filters, recent, dark, addRecent, clearRecent, toggleDark, resetSearch, resetFilters]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}
