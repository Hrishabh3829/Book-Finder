import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
} from "./ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";
import { Button } from "./ui/button";
import { CanvasTextDemo } from "./ui/canvas-test";

const HeroSection = ({ searchSlot }) => {
  const featuredBooks = [
    {
      id: "OL45883W",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      coverId: 8231996,
    },
    {
      id: "OL82563W",
      title: "Marvel and a Wonder",
      author: "Joe Meno",
      coverId: 8350251,
    },
    {
      id: "OL20600W",
      title: "Beautiful Ones",
      author: "Emily Hoyse",
      coverId: 10523323,
    },
    {
      id: "OL276560W",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverId: 10521211,
    },
    {
      id: "OL93553W",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      coverId: 10519526,
    },
  ];

  return (
    <section className="mb-6 mt-1">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="relative overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-background py-6 px-5 sm:px-8 sm:py-8">
          <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 size-40 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
            <div className="space-y-4">
              <CanvasTextDemo />

              <CardContent className="p-0 space-y-4">
                {searchSlot}

                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span>✨ Smart filters for covers, years and languages</span>
                  <span className="hidden sm:inline">•</span>
                  <span>🔖 Keep a personal shelf of bookmarks</span>
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
                  <Button
                    size="lg"
                    className="rounded-full px-5"
                    asChild
                  >
                    <Link to="/favorites">View bookmarks</Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-dashed"
                    asChild
                  >
                    <Link to="/category/fiction">Browse popular shelves</Link>
                  </Button>
                </div>
              </CardContent>
            </div>

            <motion.div
              className="hidden md:flex justify-end pt-6"
              initial={{ opacity: 0, scale: 0.95, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Carousel
                opts={{ align: "start" }}
                className="w-full max-w-md mr-2"
              >
                <CarouselContent className="-ml-3">
                  {featuredBooks.map((book) => (
                    <CarouselItem
                      key={book.id}
                      className="basis-full pl-3"
                    >
                      <Link to={`/book/${book.id}`} className="group block">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-40 overflow-hidden rounded-2xl bg-card/90 ring-1 ring-border/60 shadow-sm transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                            <img
                              src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                              alt={`Cover of ${book.title}`}
                              loading="lazy"
                              className="aspect-[3/4] w-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs font-semibold text-foreground">
                              {book.title}
                            </p>
                            <p className="text-[0.65rem] text-muted-foreground">
                              {book.author}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-5" />
                <CarouselNext className="-right-5" />
              </Carousel>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default HeroSection;
