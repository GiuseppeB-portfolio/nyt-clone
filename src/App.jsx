import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Home from "./pages/Home.jsx";
import Section from "./pages/Section.jsx";
import ArticleDetail from "./pages/ArticleDetail.jsx";
import Search from "./pages/Search.jsx";
import NotFound from "./pages/NotFound.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ScrollToTop />
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/section/:section" element={<Section />} />
        <Route path="/search" element={<Search />} />
        <Route path="/article/:feed/:id" element={<ArticleDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
