import { useContext } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FavoritesContext } from "../context/FavoritesContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Card
        className="group flex h-full cursor-pointer flex-col overflow-hidden border bg-card/95 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(book)}
        onKeyDown={(e) => (e.key === "Enter" ? onSelect?.(book) : null)}
      >
        <div className="relative overflow-hidden">
          <motion.img
            src={coverUrl}
            alt={`Cover of ${book.title}${
              book.author_name ? ` by ${book.author_name[0]}` : ""
            }`}
            className="aspect-[3/4] w-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          />
          <Button
            size="icon-sm"
            variant={fav ? "secondary" : "outline"}
            className="absolute right-3 top-3 rounded-full bg-background/80 backdrop-blur border border-border/70 text-lg leading-none"
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
          </Button>
        </div>

        <CardHeader className="space-y-1 px-4 pt-3 pb-1">
          <CardTitle className="line-clamp-2 text-base font-semibold">
            <Link
              to={`/book/${workId}`}
              className="transition-colors hover:text-primary"
            >
              {book.title}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-1 text-xs">
            {book.author_name ? (
              book.author_name.map((name, idx) => {
                const id = authorIds[idx];
                return id ? (
                  <span key={id}>
                    <Link
                      to={`/author/${id}`}
                      className="hover:text-primary underline-offset-4 hover:underline"
                    >
                      {name}
                    </Link>
                    {idx < book.author_name.length - 1 ? ", " : ""}
                  </span>
                ) : (
                  <span key={`${name}-${idx}`}>
                    {name}
                    {idx < book.author_name.length - 1 ? ", " : ""}
                  </span>
                );
              })
            ) : (
              "Unknown author"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto space-y-2 px-4 pb-4 pt-1 text-xs text-muted-foreground">
          {book.first_publish_year && (
            <p>First published: {book.first_publish_year}</p>
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full px-3 text-xs"
              asChild
            >
              <Link to={`/book/${workId}`}>View details</Link>
            </Button>
            <span className="text-[0.68rem] uppercase tracking-wide text-muted-foreground/80">
              Open Library
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BookCard;
