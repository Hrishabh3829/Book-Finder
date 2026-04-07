import BookCard from "./BookCard";
import { motion } from "framer-motion"; 

const BookList = ({ books, onSelect }) => {
  if (!books.length) return null;

  return (
    <motion.div 
      className="book-grid"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {books.map((book, index) => (
        <motion.div
          key={book.key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.4, 
            delay: index * 0.05,
            ease: "easeOut"
          }}
        >
          <BookCard book={book} onSelect={onSelect} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default BookList;
