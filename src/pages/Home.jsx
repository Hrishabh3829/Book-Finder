import { useContext, useEffect, useRef, useState } from "react";
import SearchBar from "../components/SearchBar";
import Header from "../components/Header";
import BookList from "../components/BookList";
import Spinner from "../components/Spinner";
import Modal from "../components/Modal";
import BrowseDropdownMenu from "../components/BrowseDropdownMenu";
import HeroSection from "../components/HeroSection";
import Pagination from "../components/Pagination";
import YearDatePicker from "../components/YearDatePicker";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Checkbox } from "../components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "../components/ui/dialog";
import { useBooks } from "../hooks/useBooks";
import { SearchContext } from "../context/SearchContext";
import { motion } from "framer-motion";
import "../filters.css";
import { toast } from "sonner";

const Home = () => {
  const { query, setQuery, filters, setFilters, resetFilters, recent, addRecent, clearRecent } = useContext(SearchContext);

  const { books, loading, error, fetchDetails } = useBooks();

  const lastEmptyQueryRef = useRef("");

  const [details, setDetails] = useState({ open: false, loading: false, data: null });
  const openDetails = async (book) => {
    setDetails({ open: true, loading: true, data: null });
    const d = await fetchDetails(book);
    if (!d) {
      toast.info("No details available for this book.");
    }
    setDetails({ open: true, loading: false, data: d });
  };
  const closeDetails = () => setDetails({ open: false, loading: false, data: null });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  useEffect(() => {
    setPage(1);
  }, [query, filters, pageSize]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!loading && !error && trimmed && books.length === 0) {
      lastEmptyQueryRef.current = trimmed;
    }
  }, [books.length, error, loading, query]);

  const total = books.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const currentBooks = books.slice(start, start + pageSize);

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
          {!loading && !error && total > pageSize && (
            <Pagination
              page={currentPage}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          )}
        </>
      )}

      <Modal open={details.open} title={details.data?.title || "Book details"} onClose={closeDetails}>
        {details.loading ? (
          <div className="center"><Spinner /></div>
        ) : details.data ? (
          <div className="details">
            <div
              className="details-desc"
              dangerouslySetInnerHTML={{ __html: details.data.description }}>
            </div>
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

const FiltersSection = ({ filters, setFilters, resetFilters, resultCount }) => {
  const [open, setOpen] = useState(false);

  const activeChips = [];
  if (filters.onlyWithCover) activeChips.push({ key: "cover", label: "With cover", clear: () => setFilters({ ...filters, onlyWithCover: false }) });
  if (filters.author?.trim()) activeChips.push({ key: "author", label: `Author: ${filters.author.trim()}`, clear: () => setFilters({ ...filters, author: "" }) });
  if (filters.yearFrom?.trim()) activeChips.push({ key: "yfrom", label: `From: ${filters.yearFrom}`, clear: () => setFilters({ ...filters, yearFrom: "" }) });
  if (filters.yearTo?.trim()) activeChips.push({ key: "yto", label: `To: ${filters.yearTo}`, clear: () => setFilters({ ...filters, yearTo: "" }) });
  if (filters.sortByYear) activeChips.push({ key: "sort", label: `Year: ${filters.sortByYear === "asc" ? "Asc" : "Desc"}`, clear: () => setFilters({ ...filters, sortByYear: "" }) });

  return (
    <section aria-label="Filters" className="space-y-3">
      <Dialog open={open} onOpenChange={setOpen}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
              <BrowseDropdownMenu />
            </motion.div>

            <DialogTrigger asChild>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      id="filters-toggle"
                      variant="secondary"
                      size="sm"
                      className="rounded-full px-3"
                      aria-expanded={open}
                      aria-controls="filters-panel"
                    >
                      <span className="mr-1" aria-hidden>
                        ▾
                      </span>
                      Filters
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" sideOffset={6}>
                    Open filters
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            </DialogTrigger>

            <span className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{resultCount}</span> results
            </span>
          </div>

          {activeChips.length > 0 && (
            <motion.div
              className="flex flex-wrap items-center gap-2"
              aria-label="Active filters"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {activeChips.map((chip, index) => (
                <motion.div
                  key={chip.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15, delay: index * 0.03 }}
                >
                  <Button
                    variant="outline"
                    size="xs"
                    className="rounded-full border-dashed px-3 text-[0.7rem]"
                    onClick={chip.clear}
                    aria-label={`Remove ${chip.label}`}
                  >
                    {chip.label} ×
                  </Button>
                </motion.div>
              ))}
              <Button
                variant="ghost"
                size="xs"
                className="rounded-full px-2 text-[0.7rem] text-muted-foreground hover:text-foreground"
                onClick={resetFilters}
              >
                Clear all
              </Button>
            </motion.div>
          )}
        </div>

        <DialogContent
          id="filters-panel"
          className="max-w-2xl space-y-4"
          aria-labelledby="filters-toggle"
        >
          <DialogHeader>
            <DialogTitle>Advanced filters</DialogTitle>
            <DialogDescription>
              Refine by cover availability, author, language and publication year range.
            </DialogDescription>
          </DialogHeader>

          <Card className="border-dashed bg-muted/40">
            <CardContent className="space-y-4 pt-4 text-sm">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <label className="flex items-start gap-2 text-xs">
                    <Checkbox
                      checked={filters.onlyWithCover}
                      onCheckedChange={(checked) =>
                        setFilters({
                          ...filters,
                          onlyWithCover: Boolean(checked),
                        })
                      }
                    />
                    <span>Only show books with cover images</span>
                  </label>

                  <div className="space-y-1">
                    <label
                      htmlFor="authorInput"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Author
                    </label>
                    <input
                      id="authorInput"
                      type="text"
                      value={filters.author}
                      onChange={(event) =>
                        setFilters({ ...filters, author: event.target.value })
                      }
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      placeholder="e.g., Tolkien"
                    />
                  </div>

                  <div className="space-y-1">
                    <label
                      htmlFor="language"
                      className="text-xs font-medium text-muted-foreground"
                    >
                      Language
                    </label>
                    <select
                      id="language"
                      className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      value={filters.language}
                      onChange={(event) =>
                        setFilters({ ...filters, language: event.target.value })
                      }
                    >
                      <option value="">Any</option>
                      <option value="eng">English</option>
                      <option value="hin">Hindi</option>
                      <option value="spa">Spanish</option>
                      <option value="fra">French</option>
                      <option value="deu">German</option>
                      <option value="ita">Italian</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <YearDatePicker
                      className="filters-year"
                      label="Year from"
                      value={filters.yearFrom}
                      onChange={(year) =>
                        setFilters({ ...filters, yearFrom: year })
                      }
                      placeholder="From year"
                    />
                    <YearDatePicker
                      className="filters-year"
                      label="Year to"
                      value={filters.yearTo}
                      onChange={(year) =>
                        setFilters({ ...filters, yearTo: year })
                      }
                      placeholder="To year"
                    />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Sort by publication year
                    </p>
                    <div className="inline-flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="xs"
                        variant={
                          filters.sortByYear === "asc" ? "secondary" : "outline"
                        }
                        className="rounded-full px-3 text-[0.7rem]"
                        onClick={() =>
                          setFilters({ ...filters, sortByYear: "asc" })
                        }
                      >
                        Oldest first
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant={
                          filters.sortByYear === "desc"
                            ? "secondary"
                            : "outline"
                        }
                        className="rounded-full px-3 text-[0.7rem]"
                        onClick={() =>
                          setFilters({ ...filters, sortByYear: "desc" })
                        }
                      >
                        Newest first
                      </Button>
                      <Button
                        type="button"
                        size="xs"
                        variant={!filters.sortByYear ? "secondary" : "ghost"}
                        className="rounded-full px-3 text-[0.7rem]"
                        onClick={() =>
                          setFilters({ ...filters, sortByYear: "" })
                        }
                      >
                        None
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <DialogFooter className="bg-primary/5">
            <DialogClose asChild>
              <Button
                type="button"
                size="sm"
                variant="default"
                className="rounded-full px-4 shadow-none"
              >
                Apply
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
