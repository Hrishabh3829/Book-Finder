import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion"; 
import { toast } from "sonner";

function normalizeDescription(desc) {
  if (!desc) return "No description available.";
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc.value) return desc.value;
  return "No description available.";
}

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [data, setData] = useState(null);
  const lastToastRef = useRef("");

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      setData(null);
      try {
        const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
        if (!apiKey) throw new Error("Missing Google Books API key.");
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`);
        if (!res.ok) throw new Error("HTTP " + res.status);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (e) {
        if (!cancelled) setError("Failed to load book details.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    if (error && lastToastRef.current !== error) {
      lastToastRef.current = error;
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (!loading && !error && !data && lastToastRef.current !== "nodata") {
      lastToastRef.current = "nodata";
      toast.info("No details available for this book.");
    }
  }, [data, error, loading]);

  if (loading) return <div className="center"><Spinner /></div>;
  if (error) return <p className="error-text" role="alert">{error}</p>;
  if (!data) return <p className="empty-text">Not available.</p>;

  const info = data.volumeInfo || {};
  const title = info.title || "Untitled";
  const description = normalizeDescription(info.description);
  const subjects = info.categories || [];
  const firstPublished = info.publishedDate || "";
  const coverUrl = (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || "").replace(
    "http://",
    "https://"
  );

  return (
    <motion.div 
      className="details-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={`Cover of ${title}`}
            className="h-40 w-28 rounded-xl object-cover shadow-sm"
          />
        ) : null}
        <div>
          <motion.h2 
            className="page-title"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {title}
          </motion.h2>
          {firstPublished ? (
            <motion.p 
              className="details-meta"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Published: {firstPublished}
            </motion.p>
          ) : null}
        </div>
      </div>
      <motion.p 
        className="details-desc"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {description}
      </motion.p>
      {subjects.length ? (
        <motion.div 
          className="details-subjects"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <strong>Subjects:</strong>
          <ul className="mt-2 flex flex-wrap gap-2">
            {subjects.slice(0, 16).map((s, index) => (
              <motion.li 
                key={s}
                initial={{ opacity: 0, scale: 0.9, y: 2 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.02 }}
              >
                <Badge
                  variant="outline"
                  className="bg-primary/5 text-xs font-medium normal-case"
                >
                  {s}
                </Badge>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ) : null}
    </motion.div>
  );
};

export default BookDetails;
