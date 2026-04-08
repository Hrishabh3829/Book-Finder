import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Pagination from "../components/Pagination";
import { motion } from "framer-motion";

const Author = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [works, setWorks] = useState([]);
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
        setName("");
        setWorks([]);
        try {
          const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
          if (!apiKey) throw new Error("Missing Google Books API key.");
          const decodedName = decodeURIComponent(id || "");
          setName(decodedName || id);
          const url = `https://www.googleapis.com/books/v1/volumes?q=inauthor:${encodeURIComponent(
            decodedName
          )}&maxResults=40&printType=books&key=${apiKey}&fields=items(id,volumeInfo/title,volumeInfo/authors,volumeInfo/publishedDate,volumeInfo/imageLinks,volumeInfo/language)`;
          const res = await fetch(url);
          if (!res.ok) throw new Error("author HTTP " + res.status);
          const json = await res.json();
          const items = Array.isArray(json.items) ? json.items : [];
          if (!cancelled) {
            setWorks(items.map(mapVolume));
            setPage(1);
          }
        } catch (e) {
          if (!cancelled) setError("Failed to load author.");
        } finally {
          if (!cancelled) setLoading(false);
        }
    }
    run();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <div className="center"><Spinner /></div>;
  if (error) return <p className="error-text" role="alert">{error}</p>;

  const total = works.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentBooks = works.slice(start, start + PAGE_SIZE);

  return (
    <motion.div 
      className="app-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <motion.h2 
        className="page-title"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {name}
      </motion.h2>
      <motion.p 
        className="details-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Books by {name}
      </motion.p>
      <motion.h3
        className="sub-title"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Top works
      </motion.h3>
      {works.length === 0 ? (
        <p className="empty-text">No works found.</p>
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
    </motion.div>
  );
};

export default Author;
