import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import Header from "../components/Header";
import BookList from "../components/BookList";
import { motion } from "framer-motion";

function normalizeDescription(desc) {
  if (!desc) return null;
  if (typeof desc === "string") return desc;
  if (typeof desc === "object" && desc.value) return desc.value;
  return null;
}

const Author = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bio, setBio] = useState(null);
  const [name, setName] = useState("");
  const [works, setWorks] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setLoading(true);
      setError("");
      setBio(null);
      setName("");
      setWorks([]);
      try {
        const [aRes, wRes] = await Promise.all([
          fetch(`https://openlibrary.org/authors/${id}.json`),
          fetch(`https://openlibrary.org/authors/${id}/works.json?limit=20`),
        ]);
        if (!aRes.ok) throw new Error("author HTTP " + aRes.status);
        if (!wRes.ok) throw new Error("works HTTP " + wRes.status);
        const aJson = await aRes.json();
        const wJson = await wRes.json();
        if (!cancelled) {
          setName(aJson.name || id);
          setBio(normalizeDescription(aJson.bio));
          const list = (wJson.entries || []).map((w) => ({
            key: w.key,
            title: w.title,
            first_publish_year: w.first_publish_date || w.first_publish_year,
            cover_i: w.covers?.[0],
          }));
          setWorks(list);
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
      {bio ? (
        <motion.p 
          className="details-desc"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {bio}
        </motion.p>
      ) : (
        <p className="empty-text">Biography not available.</p>
      )}
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
        <BookList books={works} />
      )}
    </motion.div>
  );
};

export default Author;
