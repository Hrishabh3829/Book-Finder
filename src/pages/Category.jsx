import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Spinner from "../components/Spinner";
import BrowseDropdownMenu from "../components/BrowseDropdownMenu";
import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import Pagination from "../components/Pagination";

const Category = () => {
  const { name } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  const mapVolume = (item) => {
    const info = item?.volumeInfo || {};
    const year = parseInt(String(info.publishedDate || "").slice(0, 4), 10);
    const thumbnail = info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "";
    return {
      id: item.id,
      key: item.id,
      title: info.title || "Untitled",
      author_name: info.authors || [],
      publishedYear: Number.isNaN(year) ? 0 : year,
      thumbnail: thumbnail.replace("http://", "https://"),
      language: info.language || "",
    };
  };

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      setBooks([]);
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
        if (!apiKey) throw new Error("Missing Google Books API key.");
        const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
          name
        )}&maxResults=40&printType=books&key=${apiKey}&fields=items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/imageLinks,volumeInfo/language)`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const items = Array.isArray(data.items) ? data.items : [];
        const normalized = items.map(mapVolume);
        if (!cancelled) {
          setBooks(normalized);
          setPage(1);
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load category.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [name]);

  const title = name?.charAt(0).toUpperCase() + name?.slice(1);

  const total = books.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentBooks = books.slice(start, start + PAGE_SIZE);

  return (
    <div className="app-container">
      <Header />
        <div className="filters-top" style={{ marginBottom: 8 }}>
          <div className="filters-left" style={{ position: "relative" }}>
            <motion.div
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <BrowseDropdownMenu />
            </motion.div>
          </div>
        </div>
        <motion.h2 
          className="page-title"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Category: {title}
        </motion.h2>
        {loading ? (
          <div className="center"><Spinner /></div>
        ) : error ? (
          <p className="error-text" role="alert">{error}</p>
        ) : books.length === 0 ? (
          <p className="empty-text">No items in this category.</p>
        ) : (
          <>
            <BookList books={currentBooks} />
            {total > PAGE_SIZE && (
              <Pagination
                page={currentPage}
                pageSize={PAGE_SIZE}
                total={total}
                onPageChange={setPage}
              />
            )}
          </>
        )}
    </div>
  );
};

export default Category;
