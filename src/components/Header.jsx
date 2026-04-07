import { useContext } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { SearchContext } from "../context/SearchContext";
import { Button } from "./ui/button";
import { Skiper4 } from "./Skiper4";
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
          <Button
            variant="outline"
            size="sm"
            className="back-btn rounded-full px-4"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            ← Back
          </Button>
        )}
        <h1 className="app-title">
          <Link
            to="/"
            className="link-button brand brand-pill"
            onClick={() => {
              resetSearch();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Go home and clear search"
          >
            <BookOpen className="brand-icon" />
            <span className="brand-text">Book Finder</span>
          </Link>
        </h1>
      </div>
      <div className="hidden md:block">
        <Skiper4 isDark={dark} onToggle={toggleDark} />
      </div>
    </motion.header>
  );
};

export default Header;
