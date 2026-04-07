import { useContext, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import BrowseDropdown from "../components/BrowseDropdown";
import HeroSection from "../components/HeroSection";
import Pagination from "../components/Pagination";
import { useBooks } from "../hooks/useBooks";
import { SearchContext } from "../context/SearchContext";
import { motion, AnimatePresence } from "framer-motion";

const Home = () => {
  const { query, setQuery, filters, setFilters, resetFilters, recent, addRecent, clearRecent } = useContext(SearchContext);

  const { books, loading, error, fetchDetails } = useBooks();

  const [details, setDetails] = useState({ open: false, loading: false, data: null });
  const openDetails = async (book) => {
    setDetails({ open: true, loading: true, data: null });
    const d = await fetchDetails(book);
    setDetails({ open: true, loading: false, data: d });
  };
  const closeDetails = () => setDetails({ open: false, loading: false, data: null });

  const [browseOpen, setBrowseOpen] = useState(false);

  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    setPage(1);
  }, [query, filters]);

  const total = books.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentBooks = books.slice(start, start + PAGE_SIZE);

  return (
    <div className="app-container space-y-6">
      <Header />

      <HeroSection
        searchSlot={
          <SearchBar
            value={query}
            onImmediateSearch={(q) => {
              setQuery(q);
              addRecent(q);
            }}
            onDebouncedChange={(q) => setQuery(q)}
            recent={recent}
            onPickRecent={(q) => {
              setQuery(q);
              addRecent(q);
            }}
            onClearRecent={clearRecent}
          />
        }
      />

      <FiltersSection
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
        resultCount={books.length}
        browseOpen={browseOpen}
        setBrowseOpen={setBrowseOpen}
      />

      {loading ? (
        <motion.div 
          className="center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Spinner />
        </motion.div>
      ) : error ? (
        <motion.p 
          className="error-text" 
          role="alert"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      ) : query.trim() && books.length === 0 ? (
        <motion.p 
          className="empty-text" 
          role="status"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          No results for '{query}'. Try another title or adjust filters.
        </motion.p>
      ) : (
        <>
          <BookList books={currentBooks} onSelect={openDetails} />
          {!loading && !error && total > PAGE_SIZE && (
            <Pagination
              page={currentPage}
              pageSize={PAGE_SIZE}
              total={total}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Modal open={details.open} title={details.data?.title || "Book details"} onClose={closeDetails}>
        {details.loading ? (
          <div className="center"><Spinner /></div>
        ) : details.data ? (
          <div className="details">
            <p className="details-desc">{details.data.description}</p>
            {details.data.first_publish_year && (
              <p className="details-meta">First published: {details.data.first_publish_year}</p>
            )}
            {details.data.subjects?.length ? (
              <div className="details-subjects">
                <strong>Subjects:</strong>
                <ul>
                  {details.data.subjects.slice(0, 12).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : (
          <p>Details not available.</p>
        )}
      </Modal>
    </div>
  );
};

export default Home;

const FiltersSection = ({ filters, setFilters, resetFilters, resultCount, browseOpen, setBrowseOpen }) => {
  const [open, setOpen] = useState(false);

  const activeChips = [];
  if (filters.onlyWithCover) activeChips.push({ key: "cover", label: "With cover", clear: () => setFilters({ ...filters, onlyWithCover: false }) });
  if (filters.author?.trim()) activeChips.push({ key: "author", label: `Author: ${filters.author.trim()}`, clear: () => setFilters({ ...filters, author: "" }) });
  if (filters.yearFrom?.trim()) activeChips.push({ key: "yfrom", label: `From: ${filters.yearFrom}`, clear: () => setFilters({ ...filters, yearFrom: "" }) });
  if (filters.yearTo?.trim()) activeChips.push({ key: "yto", label: `To: ${filters.yearTo}`, clear: () => setFilters({ ...filters, yearTo: "" }) });
  if (filters.sortByYear) activeChips.push({ key: "sort", label: `Year: ${filters.sortByYear === "asc" ? "Asc" : "Desc"}`, clear: () => setFilters({ ...filters, sortByYear: "" }) });

  return (
    <section className="filters-wrap" aria-label="Filters">
      <div className="filters-top">
        <div className="filters-left" style={{ position: 'relative' }}>
          <motion.button
            id="browse-toggle"
            className="filters-toggle browse-toggle"
            onClick={() => setBrowseOpen(!browseOpen)}
            aria-expanded={browseOpen}
            aria-controls="sidebar"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="caret" aria-hidden>▾</span>
            <span>📚 Browse</span>
          </motion.button>
          
          <BrowseDropdown isOpen={browseOpen} onClose={() => setBrowseOpen(false)} />
          <motion.button
            id="filters-toggle"
            className="filters-toggle"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="filters-panel"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="caret" aria-hidden>▾</span>
            <span className="filters-toggle-text">Filters</span>
          </motion.button>
          <span className="results-count"><strong>{resultCount}</strong> results</span>
        </div>
        <div className="filters-right">
          {activeChips.length > 0 && (
            <motion.div 
              className="active-chips" 
              aria-label="Active filters"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {activeChips.map((c, index) => (
                <motion.button 
                  key={c.key} 
                  className="chip chip-remove" 
                  onClick={c.clear} 
                  aria-label={`Remove ${c.label}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                >
                  {c.label} ×
                </motion.button>
              ))}
              <motion.button 
                className="chip chip-clearall" 
                onClick={resetFilters}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear all
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div 
            id="filters-panel" 
            className="filters-panel" 
            role="region" 
            aria-labelledby="filters-toggle"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="filters-grid">
              <div className="filters-col">
                <label className="filter-inline">
                  <input
                    type="checkbox"
                    checked={filters.onlyWithCover}
                    onChange={(e) => setFilters({ ...filters, onlyWithCover: e.target.checked })}
                  />
                  <span>Only show books with cover images</span>
                </label>

                <label className="filter-item" htmlFor="authorInput">
                  Author
                  <input
                    id="authorInput"
                    type="text"
                    value={filters.author}
                    onChange={(e) => setFilters({ ...filters, author: e.target.value })}
                    className="filter-input"
                    placeholder="e.g., Tolkien"
                  />
                </label>

                <label className="filter-item" htmlFor="language">
                  Language
                  <select
                    id="language"
                    className="filter-select"
                    value={filters.language}
                    onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  >
                    <option value="">Any</option>
                    <option value="eng">English</option>
                    <option value="hin">Hindi</option>
                    <option value="spa">Spanish</option>
                    <option value="fra">French</option>
                    <option value="deu">German</option>
                    <option value="ita">Italian</option>
                  </select>
                </label>
              </div>

              <div className="filters-col">
                <div className="filter-row">
                  <label className="filter-item" htmlFor="yearFrom">
                    Year from
                    <input
                      id="yearFrom"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={filters.yearFrom}
                      onChange={(e) => setFilters({ ...filters, yearFrom: e.target.value })}
                      className="filter-input"
                      placeholder="e.g., 1990"
                    />
                  </label>
                  <label className="filter-item" htmlFor="yearTo">
                    Year to
                    <input
                      id="yearTo"
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={filters.yearTo}
                      onChange={(e) => setFilters({ ...filters, yearTo: e.target.value })}
                      className="filter-input"
                      placeholder="e.g., 2020"
                    />
                  </label>
                </div>

                <label className="filter-item" htmlFor="sortYear">
                  Sort by publication year
                  <select
                    id="sortYear"
                    value={filters.sortByYear}
                    onChange={(e) => setFilters({ ...filters, sortByYear: e.target.value })}
                    className="filter-select"
                  >
                    <option value="">None</option>
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
