import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AppLayout from './layouts/AppLayout.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import Loader from './components/common/Loader.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const CategoryPage = lazy(() => import('./pages/CategoryPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const Cart = lazy(() => import('./pages/Cart.jsx'));
const Checkout = lazy(() => import('./pages/Checkout.jsx'));
const Confirmation = lazy(() => import('./pages/Confirmation.jsx'));
const Account = lazy(() => import('./pages/Account.jsx'));
const Admin = lazy(() => import('./pages/Admin.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location}>
      <Route element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/new" element={<CategoryPage collection="new" />} />
        <Route path="/sale" element={<CategoryPage collection="sale" />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<Admin />} />
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
