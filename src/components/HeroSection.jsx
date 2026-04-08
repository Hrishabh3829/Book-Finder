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
      id: "1a2XAwAAQBAJ",
      title: "Captain America",
      author: "Stefan Petrucha",
      coverUrl:
        "https://books.google.com/books/publisher/content?id=3u3eDAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE701cw44cMUc9GlLRPZF3bZDeXm7lTEPd3kCAXFjVZOJdbcifqIgj3kDDOpJv_wtPSs_7lFeiNgvZN0KhdDdEmc2NvKni8IfACjQYQ84bN398fpMSAP8PD9HhnjlRATX6C2O4ehy&source=gbs_api",
    },
    {
      id: "LimgEAAAQBAJ",
      title: "Doglapan",
      author: "Ashneer Grover",
      coverUrl:
        "https://books.google.com/books/publisher/content?id=LimgEAAAQBAJ&printsec=frontcover&img=1&zoom=4&edge=curl&imgtk=AFLRE71XrpptLux0Ht4u5Bq1W7tbDqjAKTiYBHTlqH9MQC4P7cP2im4eIwwVWgeTVMLpv9HI7_NG3XCfFWMSnI5NcqiSxbI4YF-0Nw0nDdDR7zMUUkVyLBEEeb-NARd-HJ-NrzakYxiB&source=gbs_api",
    },
    {
      id: "E2swDQAAQBAJ",
      title: "Harry Potter and the Philosopher's Stone",
      author: "J. K. Rowling",
      coverUrl:
        "https://books.google.com/books/publisher/content?id=E2swDQAAQBAJ&printsec=frontcover&img=1&zoom=4&imgtk=AFLRE70ppRfdB5n924-7nOg3nQUuII_jnEPojp61eqajaki8aOIGU5Fsxiuk0U6Ijm6MQRlBWK6NXa74uBt7e2EGU064QhSq4Jk-vCc7VH2mChUkPEarSg6j0jfeRbmdg01aVkNCSjlc&source=gbs_api",
    },
    {
      id: "inNrNS_c6ToC",
      title: "Pokemon",
      author: "Maria S. Barbo",
      coverUrl:
        "https://books.google.com/books/content?id=inNrNS_c6ToC&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71zchmWr0yuwTKdikSf5l5U27JGXtDKu4BKdT5oYezlE05S0oNyP7Tr-XUDcUFdK1ny_f-QAfa-gFxp0mF7Q9q2CUO0c32SPnPslfp3TnPHJbGzDc2pA2E2toyq3e-gUoJTlGL9&source=gbs_api",
    },
    
    {
      id: "VUvDzgEACAAJ",
      title: "Do Epic Shit",
      author: "Ankur Warikoo",
      coverUrl:
        "https://books.google.com/books/content?id=VUvDzgEACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE71hcp7DmE-pjA2fbBlnJ5Py1z1yQcogJu46alVEAH70xSBTQMNAP8_XfiVToJZlGG1Bp39Fxq4wfX0r4h9hNyeuTuWVUPD8OFC4LCNSi_TvD9U_B9NHaidTEWy6Lti0H-xWfd6J&source=gbs_api",
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
