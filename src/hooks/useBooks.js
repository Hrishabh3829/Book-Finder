import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { SearchContext } from "../context/SearchContext";

const MAX_RESULTS = 40;
const GOOGLE_BOOKS_BASE = "https://www.googleapis.com/books/v1/volumes";

function getPublishedYear(dateString) {
  if (!dateString) return 0;
  const year = parseInt(String(dateString).slice(0, 4), 10);
  return Number.isNaN(year) ? 0 : year;
}

function toHttps(url) {
  if (!url) return "";
  return url.startsWith("http://") ? url.replace("http://", "https://") : url;
}

function mapVolume(item) {
  const info = item?.volumeInfo || {};
  const thumbnail =
    info.imageLinks?.thumbnail ||
    info.imageLinks?.smallThumbnail ||
    "";

  return {
    id: item.id,
    key: item.id,
    title: info.title || "Untitled",
    author_name: info.authors || [],
    publishedDate: info.publishedDate || "",
    publishedYear: getPublishedYear(info.publishedDate),
    description: normalizeDescription(info.description),
    categories: info.categories || [],
    language: info.language || "",
    pageCount: info.pageCount || null,
    thumbnail: toHttps(thumbnail),
  };
}

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
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      const keyParam = apiKey ? `&key=${apiKey}` : "";
      const url = `${GOOGLE_BOOKS_BASE}?q=${encodeURIComponent(
        q
      )}&maxResults=${MAX_RESULTS}&printType=books${keyParam}&fields=items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/description,volumeInfo/categories,volumeInfo/imageLinks,volumeInfo/language,volumeInfo/pageCount)`;
      const res = await fetch(url, { signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const items = Array.isArray(data.items) ? data.items : [];
      // For no results, don't set error; the UI will show a friendly empty state
      setError("");
      setRawBooks(items.map(mapVolume));
    } catch (e) {
      if (e.name === "AbortError") return; // ignore aborted
      setError(
        e.message?.includes("Google Books API key")
          ? "Missing Google Books API key. Add VITE_GOOGLE_BOOKS_API_KEY to .env."
          : e.message?.includes("NetworkError")
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

    const getYear = (b) => b.publishedYear || 0;

    if (filters.onlyWithCover) {
      list = list.filter((b) => Boolean(b.thumbnail));
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
      list = list.filter((b) => (b.language || "").toLowerCase() === lang);
    }

    if (!filters.onlyWithCover) {
      list.sort((a, b) => {
        const aHas = Boolean(a.thumbnail);
        const bHas = Boolean(b.thumbnail);
        if (aHas === bHas) return 0;
        return aHas ? -1 : 1;
      });
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

  // Fetch details for a selected book (Google Books volume)
  const fetchDetails = useCallback(async (book) => {
    try {
      const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
      if (!apiKey) throw new Error("Missing Google Books API key.");
      const volumeId = book?.id || book?.key;
      if (!volumeId) return null;
      const url = `${GOOGLE_BOOKS_BASE}/${volumeId}?key=${apiKey}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load book details");
      const data = await res.json();
      const info = data?.volumeInfo || {};
      return {
        title: info.title,
        description: normalizeDescription(info.description),
        first_publish_year: info.publishedDate,
        subjects: info.categories || [],
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
