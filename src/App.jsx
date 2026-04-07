import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Category from "./pages/Category";
import BookDetails from "./pages/BookDetails";
import Favorites from "./pages/Favorites";
import Author from "./pages/Author";
import { SearchProvider } from "./context/SearchContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import PageLoader from "./components/PageLoader";
import "./style.css";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";

function RouteChangeHandler({ children }) {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      <PageLoader isLoading={isLoading} />
      {children}
    </>
  );
}

function App() {
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <PageLoader isLoading={initialLoading} />
      <BrowserRouter>
        <SearchProvider>
          <FavoritesProvider>
            <RouteChangeHandler>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:name" element={<Category />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/author/:id" element={<Author />} />
              </Routes>
            </RouteChangeHandler>
          </FavoritesProvider>
        </SearchProvider>
      </BrowserRouter>
      <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>
          Track progress and recent activity for your Vite app.
        </CardDescription>
      </CardHeader>
      <CardContent>
        Your design system is ready. Start building your next component.
      </CardContent>
    </Card>
     
    </>
  );
}

export default App;