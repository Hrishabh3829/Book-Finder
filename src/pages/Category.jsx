import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Spinner from "../components/Spinner";
import BrowseDropdown from "../components/BrowseDropdown";
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

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      setBooks([]);
      try {
        const url = `https://openlibrary.org/subjects/${encodeURIComponent(name)}.json?limit=50`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const works = Array.isArray(data.works) ? data.works : [];
        const normalized = works.map((w) => ({
          key: w.key,
          title: w.title,
          author_name: (w.authors || []).map((a) => a.name),
          author_key: (w.authors || []).map((a) => (a.key || "").split("/").pop()),
          cover_i: w.cover_id,
          first_publish_year: w.first_publish_year,
        }));
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

  const [browseOpen, setBrowseOpen] = useState(false);

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
              <Button
                id="browse-toggle"
                variant="outline"
                size="sm"
                className="browse-toggle rounded-full px-3"
                onClick={() => setBrowseOpen(!browseOpen)}
                aria-expanded={browseOpen}
                aria-controls="sidebar"
              >
                <span className="caret" aria-hidden>
                  ▾
                </span>
                <span>Browse</span>
              </Button>
            </motion.div>

            <BrowseDropdown
              isOpen={browseOpen}
              onClose={() => setBrowseOpen(false)}
            />
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
