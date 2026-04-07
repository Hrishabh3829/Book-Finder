import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GooeyInput } from "./ui/gooey-input";

const SearchBar = ({
  value = "",
  onImmediateSearch,
  onDebouncedChange,
  recent = [],
  onPickRecent,
  onClearRecent,
}) => {
  const [query, setQuery] = useState(value);
  useEffect(() => setQuery(value), [value]);

  return (
    <div>
      <motion.div
        className="search-container"
        role="search"
        aria-label="Book search"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <GooeyInput
          placeholder="Search..."
          value={query}
          onValueChange={(next) => {
            setQuery(next);
          }}
          onSearch={(next) => {
            onImmediateSearch?.(next);
          }}
          classNames={{
            trigger:
              "ring-0 ring-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none focus-within:ring-0",
            input:
              "ring-0 ring-transparent outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none",
          }}
            className="gooey-search w-full max-w-xl"
        />
      </motion.div>

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
