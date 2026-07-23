import { AnimatePresence } from "framer-motion";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import Loader from "./components/common/Loader.jsx";
import AppLayout from "./layouts/AppLayout.jsx";

const Home = lazy(() => import("./pages/Home.jsx"));
const CategoryPage = lazy(() => import("./pages/CategoryPage.jsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.jsx"));
const SizeGuide = lazy(() => import("./pages/SizeGuide.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Confirmation = lazy(() => import("./pages/Confirmation.jsx"));
const Account = lazy(() => import("./pages/Account.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/category/:category/:sub?" element={<CategoryPage />} />
        <Route path="/new" element={<CategoryPage collection="new" />} />
        <Route path="/sale" element={<CategoryPage collection="sale" />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/account" element={<Account />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Suspense fallback={<Loader label="Preparing the collection" />}>
          <AppRoutes />
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
}
