import { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Link,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
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

function RootShell() {
  const navigation = useNavigation();
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const isRouteLoading =
    navigation.state === "loading" || navigation.state === "submitting";
  const showLoader = initialLoading || isRouteLoading;

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <PageLoader isLoading={showLoader} />
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function ErrorPage() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error?.message || "An unexpected error occurred.";

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Something went wrong</CardTitle>
          <CardDescription>
            We couldn&apos;t load this page. Please try again.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground break-words">{message}</p>
          <Link
            to="/"
            className="text-sm font-medium text-primary underline underline-offset-4"
          >
            Go home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: (
      <SearchProvider>
        <FavoritesProvider>
          <RootShell />
        </FavoritesProvider>
      </SearchProvider>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "category/:name",
        element: <Category />,
      },
      {
        path: "book/:id",
        element: <BookDetails />,
      },
      {
        path: "favorites",
        element: <Favorites />,
      },
      {
        path: "author/:id",
        element: <Author />,
      },
      {
        path: "*",
        element: (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-3">
            <h2 className="text-3xl font-bold tracking-tight">404</h2>
            <p className="text-muted-foreground">
              Page not found. Check the URL or go back home.
            </p>
            <Link
              to="/"
              className="text-primary underline underline-offset-4 font-medium"
            >
              Return home
            </Link>
          </div>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;