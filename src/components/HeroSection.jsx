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
      id: "zyTCAlFPjgYC",
      title: "The Google Story",
      author: "David A. Vise",
      coverUrl:
        "https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      id: "OEBPSAAAQBAJ",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      coverUrl:
        "https://books.google.com/books/content?id=OEBPSAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      id: "PGR2AwAAQBAJ",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      coverUrl:
        "https://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      id: "1a2XAwAAQBAJ",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      coverUrl:
        "https://books.google.com/books/content?id=1a2XAwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
    },
    {
      id: "m8dPPgAACAAJ",
      title: "1984",
      author: "George Orwell",
      coverUrl:
        "https://books.google.com/books/content?id=m8dPPgAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api",
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
                className="w-full max-w-lg mr-2"
              >
                <CarouselContent className="-ml-3">
                  {featuredBooks.map((book) => (
                    <CarouselItem
                      key={book.id}
                      className="basis-full pl-3"
                    >
                      <Link to={`/book/${book.id}`} className="group block">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-52 overflow-hidden rounded-3xl bg-card/90 ring-1 ring-border/60 shadow-sm transition-transform duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                            <img
                              src={book.coverUrl}
                              alt={`Cover of ${book.title}`}
                              loading="lazy"
                              className="aspect-[3/4] w-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-semibold text-foreground">
                              {book.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
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
