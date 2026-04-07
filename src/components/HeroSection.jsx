import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Button } from "./ui/button";

const HeroSection = ({ searchSlot }) => {
  return (
    <section className="mb-8 mt-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <Card className="relative overflow-hidden border bg-gradient-to-br from-primary/10 via-background to-background py-8 px-6 sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -left-24 -top-24 size-64 rounded-full bg-primary/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 size-40 rounded-full bg-accent/20 blur-3xl" />

          <div className="relative grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-center">
            <div className="space-y-4">
              <CardHeader className="p-0 space-y-3">
                <CardTitle className="text-balance text-3xl sm:text-4xl md:text-5xl font-semibold">
                  Find your next<br className="hidden sm:block" /> favourite book.
                </CardTitle>
                <CardDescription className="max-w-xl text-base sm:text-lg">
                  Search across millions of titles, filter by author, year and
                  language, and save bookmarks to revisit later.
                </CardDescription>
              </CardHeader>

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
              className="hidden md:flex justify-center"
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="grid gap-4">
                <Card className="w-56 rotate-[-3deg] bg-card/90 backdrop-blur">
                  <CardHeader className="pb-3">
                    <CardTitle className="truncate">Curated picks</CardTitle>
                    <CardDescription>Fresh discoveries every search.</CardDescription>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground space-y-1">
                    <p>We surface editions with covers, metadata and subjects.</p>
                  </CardContent>
                </Card>
                <Card className="w-56 rotate-2 bg-card/90 backdrop-blur">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Fast & lightweight</CardTitle>
                  </CardHeader>
                  <CardContent className="text-xs text-muted-foreground">
                    <p>Powered by Open Library APIs and smooth Lottie loaders.</p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </section>
  );
};

export default HeroSection;
