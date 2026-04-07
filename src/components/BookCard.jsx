import { Link } from "react-router-dom";
import { useContext } from "react";
import { FavoritesContext } from "../context/FavoritesContext";
import { motion } from "framer-motion"; 

const BookCard = ({ book, onSelect }) => {
  const coverUrl = book.cover_i
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : "https://via.placeholder.com/200x250?text=No+Cover";
  const workId = (book.key || "").split("/").pop();
  const authorIds = book.author_key || [];
  const { isFav, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const fav = isFav?.(book.key);

  return (
    <motion.div
      className="book-card"
      role="button"
      tabIndex={0}
      onClick={() => onSelect?.(book)}
      onKeyDown={(e) => (e.key === "Enter" ? onSelect?.(book) : null)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.img
        src={coverUrl}
        alt={`Cover of ${book.title}${book.author_name ? ` by ${book.author_name[0]}` : ""}`}
        className="book-cover"
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.3 }}
      />
      <h3 className="book-title">
        <Link to={`/book/${workId}`} className="book-link-title">{book.title}</Link>
      </h3>
      <p className="book-author">
        {book.author_name ? (
          book.author_name.map((name, idx) => {
            const id = authorIds[idx];
            return id ? (
              <span key={id}>
                <Link to={`/author/${id}`} className="book-author-link">{name}</Link>
                {idx < book.author_name.length - 1 ? ", " : ""}
              </span>
            ) : (
              <span key={`${name}-${idx}`}>{name}{idx < book.author_name.length - 1 ? ", " : ""}</span>
            );
          })
        ) : (
          "Unknown Author"
        )}
      </p>
      <div className="card-actions">
        <button
          className={`fav-btn${fav ? " active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            if (fav) removeFavorite(book.key);
            else {
              const minimal = {
                key: book.key,
                title: book.title,
                author_name: book.author_name,
                cover_i: book.cover_i,
              };
              addFavorite(minimal);
            }
          }}
          aria-pressed={fav}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
        >
          {fav ? "★" : "☆"}
        </button>
        <Link to={`/book/${workId}`} className="book-link">View details →</Link>
      </div>
    </motion.div>
  );
};

export default BookCard;
