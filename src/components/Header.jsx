import { useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { motion } from "framer-motion"; 

const Header = () => {
  const { dark, toggleDark, resetSearch } = useContext(SearchContext);
  const location = useLocation();
  const navigate = useNavigate();
  const showBack = location.pathname !== "/";

  return (
    <motion.header 
      className="app-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="header-left">
        {showBack && (
          <button
            className="back-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Back
          </button>
        )}
        <h1 className="app-title">
          <Link
            to="/"
            className="link-button brand"
            onClick={() => {
              resetSearch();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Go home and clear search"
          >
            📚 Book Finder
          </Link>
        </h1>
      </div>
      <motion.button 
        className="theme-toggle" 
        onClick={toggleDark} 
        aria-pressed={dark} 
        aria-label="Toggle dark mode"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {dark ? "🌞 Light" : "🌙 Dark"}
      </motion.button>
    </motion.header>
  );
};

export default Header;
