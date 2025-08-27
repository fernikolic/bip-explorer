import { Switch, Route, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { usePrefetchBips } from "./hooks/use-prefetch";
import NotFound from "./pages/not-found";
import Home from "./pages/home";
import BipDetail from "./pages/bip-detail";
import AuthorProfile from "./pages/author-profile";
import Search from "./pages/search";
import Authors from "./pages/authors";
import About from "./pages/about";
import CategoriesPage from "./pages/categories";
import CategoryPage from "./pages/category";
import LayerPage from "./pages/layer";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  // Prefetch BIPs data on app startup
  usePrefetchBips();
  
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/search" component={Search} />
        <Route path="/authors" component={Authors} />
        <Route path="/about" component={About} />
        <Route path="/categories" component={CategoriesPage} />
        <Route path="/category/:category" component={CategoryPage} />
        <Route path="/layer/:layer" component={LayerPage} />
        <Route path="/bip/:number" component={BipDetail} />
        <Route path="/author/:author" component={AuthorProfile} />
        <Route component={NotFound} />
      </Switch>
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="light" 
        enableSystem={false}
        disableTransitionOnChange={false}
      >
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Router />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
