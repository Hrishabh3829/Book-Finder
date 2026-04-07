import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SearchContext } from "../context/SearchContext";

const MAX_RESULTS = 50; 

function normalizeDescription(desc) {
  if (!desc) return "No description available.";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc.value) return desc.value;
  return "No description available.";
}

export function useBooks() {
  const { query, filters } = useContext(SearchContext);
  const [rawBooks, setRawBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const abortRef = useRef();

  const fetchBooks = useCallback(async (q) => {
    if (!q || !q.trim()) {
      setRawBooks([]);
      return;
    }

    abortRef.current?.abort?.();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(q)}`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const docs = Array.isArray(data.docs) ? data.docs : [];
      // For no results, don't set error; the UI will show a friendly empty state
      setError("");
      setRawBooks(docs.slice(0, MAX_RESULTS));
    } catch (e) {
      if (e.name === "AbortError") return; // ignore aborted
      setError(
        e.message?.includes("NetworkError")
          ? "Network error — please check your connection."
          : "Something went wrong. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // When query changes, reset page and fetch first page
  useEffect(() => {
    fetchBooks(query);
  }, [query, fetchBooks]);

  // Derived list with filters and sorting
  const books = useMemo(() => {
    let list = [...rawBooks];

    const getYear = (b) => b.first_publish_year || (b.publish_year?.[0] ?? 0);

    if (filters.onlyWithCover) {
      list = list.filter((b) => Boolean(b.cover_i));
    }

    if (filters.author && filters.author.trim()) {
      const s = filters.author.trim().toLowerCase();
      list = list.filter((b) =>
        (b.author_name || []).some((a) => a.toLowerCase().includes(s))
      );
    }

    const from = parseInt(filters.yearFrom, 10);
    const to = parseInt(filters.yearTo, 10);
    if (!Number.isNaN(from)) {
      list = list.filter((b) => getYear(b) >= from);
    }
    if (!Number.isNaN(to)) {
      list = list.filter((b) => getYear(b) <= to);
    }

    if (filters.language && filters.language.trim()) {
      const lang = filters.language.trim().toLowerCase();
      list = list.filter((b) => (b.language || []).some((l) => (l || "").toLowerCase() === lang));
    }

    if (filters.sortByYear) {
      list.sort((a, b) => {
        const ay = getYear(a);
        const by = getYear(b);
        return filters.sortByYear === "asc" ? ay - by : by - ay;
      });
    }

    return list;
  }, [rawBooks, filters]);

  // Fetch details for a selected book (works endpoint)
  const fetchDetails = useCallback(async (book) => {
    try {
      const key = book?.key || ""; // e.g., /works/OL12345W
      if (!key.includes("/works/")) return null;
      const url = `https://openlibrary.org${key}.json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load book details");
      const data = await res.json();
      return {
        title: data.title,
        description: normalizeDescription(data.description),
        first_publish_year: data.first_publish_date || data.first_publish_year,
        subjects: data.subjects || [],
      };
    } catch {
      return null;
    }
  }, []);

  return {
    // state
    books,
    loading,
    error,
    // actions
    fetchDetails,
  };
}
