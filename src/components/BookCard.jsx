import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FavoritesContext } from "../context/FavoritesContext";
import { BookmarkIcon } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "./ui/context-menu";

const BookCard = ({ book, onSelect }) => {
  const coverUrl =
    book.thumbnail ||
    book.coverUrl ||
    "https://via.placeholder.com/200x250?text=No+Cover";
  const volumeId = book.id || book.key;
  const authorNames = book.author_name || book.authors || [];

  const { isFav, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const favKey = book.key || volumeId;
  const fav = isFav?.(favKey);
  const navigate = useNavigate();

  const handleToggleFavorite = (event) => {
    event?.stopPropagation?.();
    if (fav) {
      removeFavorite(favKey);
    } else {
      const minimal = {
        key: favKey,
        id: volumeId,
        title: book.title,
        author_name: authorNames,
        thumbnail: coverUrl,
        publishedYear: book.publishedYear || book.first_publish_year,
      };
      addFavorite(minimal);
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card
            className="group flex h-full cursor-pointer flex-col overflow-hidden border bg-card/95 p-0 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(book)}
            onKeyDown={(event) => (event.key === "Enter" ? onSelect?.(book) : null)}
          >
        <div className="relative overflow-hidden border-b">
          <motion.img
            src={coverUrl}
            alt={`Cover of ${book.title}${
              authorNames.length ? ` by ${authorNames[0]}` : ""
            }`}
            className="aspect-[3/4] w-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.3 }}
          />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon-sm"
                variant="outline"
                className={`absolute right-3 top-3 rounded-full border bg-background/80 backdrop-blur ${
                  fav
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/70 text-foreground/70 hover:border-primary/60 hover:bg-primary/10 hover:text-primary"
                }`}
                onClick={handleToggleFavorite}
                aria-pressed={fav}
                aria-label={fav ? "Remove bookmark" : "Add bookmark"}
              >
                <BookmarkIcon className={fav ? "fill-current" : ""} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              {fav ? "Remove bookmark" : "Add bookmark"}
            </TooltipContent>
          </Tooltip>
        </div>

        <CardHeader className="space-y-1 px-4 pt-3 pb-1">
          <CardTitle className="line-clamp-2 text-base font-semibold">
            <Link
              to={`/book/${volumeId}`}
              className="transition-colors hover:text-primary"
            >
              {book.title}
            </Link>
          </CardTitle>
          <CardDescription className="line-clamp-1 text-xs">
            {authorNames.length ? (
              authorNames.map((name, idx) => (
                <span key={`${name}-${idx}`}>
                  <Link
                    to={`/author/${encodeURIComponent(name)}`}
                    className="hover:text-primary underline-offset-4 hover:underline"
                  >
                    {name}
                  </Link>
                  {idx < authorNames.length - 1 ? ", " : ""}
                </span>
              ))
            ) : (
              "Unknown author"
            )}
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-auto space-y-2 px-4 pb-4 pt-1 text-xs text-muted-foreground">
          {(book.publishedYear || book.first_publish_year) && (
            <p>First published: {book.publishedYear || book.first_publish_year}</p>
          )}
          <div className="flex items-center justify-between gap-3 pt-1">
            <Button
              size="sm"
              variant="outline"
              className="rounded-full px-3 text-xs"
              asChild
            >
              <Link to={`/book/${volumeId}`}>View details</Link>
            </Button>
            <span className="text-[0.68rem] uppercase tracking-wide text-muted-foreground/80">
              Google Books
            </span>
          </div>
        </CardContent>
          </Card>
        </motion.div>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem onClick={() => onSelect?.(book)}>
          Quick preview
        </ContextMenuItem>
        <ContextMenuItem onClick={() => navigate(`/book/${volumeId}`)}>
          Open book page
        </ContextMenuItem>
        {authorNames[0] && (
          <ContextMenuItem
            onClick={() => navigate(`/author/${encodeURIComponent(authorNames[0])}`)}
          >
            View first author
          </ContextMenuItem>
        )}
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleToggleFavorite}>
          {fav ? "Remove bookmark" : "Add bookmark"}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default BookCard;
