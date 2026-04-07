import { useContext, useState, useEffect } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import BookList from "../components/BookList";
import Header from "../components/Header";
import Pagination from "../components/Pagination";
import { motion } from "framer-motion";

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  useEffect(() => {
    setPage(1);
  }, [favorites.length]);

  const total = favorites.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const currentBooks = favorites.slice(start, start + PAGE_SIZE);
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
        ⭐ Favorites
      </motion.h2>
      {favorites.length === 0 ? (
        <p className="empty-text">No favorites yet. Add some books you love.</p>
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

export default Favorites;
