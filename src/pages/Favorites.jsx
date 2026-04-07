import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import BookList from "../components/BookList";
import Header from "../components/Header";
import { motion } from "framer-motion"; 

const Favorites = () => {
  const { favorites } = useContext(FavoritesContext);
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
        <BookList books={favorites} />
      )}
    </motion.div>
  );
};

export default Favorites;
