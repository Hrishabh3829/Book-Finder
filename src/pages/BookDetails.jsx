import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import { Badge } from "../components/ui/badge";
import { motion } from "framer-motion"; 

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

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      setData(null);
      try {
        const res = await fetch(`https://openlibrary.org/works/${id}.json`);
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

  if (loading) return <div className="center"><Spinner /></div>;
  if (error) return <p className="error-text" role="alert">{error}</p>;
  if (!data) return <p className="empty-text">Not available.</p>;

  const title = data.title;
  const description = normalizeDescription(data.description);
  const subjects = data.subjects || [];
  const firstPublished = data.first_publish_date || data.first_publish_year;

  return (
    <motion.div 
      className="details-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Header />
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
          First published: {firstPublished}
        </motion.p>
      ) : null}
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
