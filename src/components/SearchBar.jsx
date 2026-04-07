import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

const SearchBar = ({
  value = "",
  onImmediateSearch,
  onDebouncedChange,
  recent = [],
  onPickRecent,
  onClearRecent,
}) => {
  const [query, setQuery] = useState(value);
  const lastEmitted = useRef("");

  useEffect(() => setQuery(value), [value]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (query.trim() !== lastEmitted.current.trim()) {
        lastEmitted.current = query;
        onDebouncedChange?.(query);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [query, onDebouncedChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    lastEmitted.current = query;
    onImmediateSearch?.(query);
  };

  return (
    <div>
      <motion.form 
        onSubmit={handleSubmit} 
        className="search-container" 
        role="search" 
        aria-label="Book search"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <motion.input
          type="text"
          placeholder="Search for books..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
          aria-label="Search books by title"
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        />
        <motion.div 
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            type="submit"
            size="lg"
            className="search-btn h-auto px-7 py-3 text-base font-semibold"
          >
            Search
          </Button>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {recent?.length ? (
          <motion.div 
            className="recent-bar" 
            aria-label="Recent searches"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {recent.map((r, index) => (
              <motion.button
                key={r}
                className="chip"
                onClick={() => onPickRecent?.(r)}
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                {r}
              </motion.button>
            ))}
            <motion.button
              className="chip chip-clear"
              onClick={onClearRecent}
              type="button"
              aria-label="Clear recent searches"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Clear
            </motion.button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
