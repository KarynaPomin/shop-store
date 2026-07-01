import { Link } from 'react-router-dom';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { products } from '../data/catalog.js';
import { useStore } from '../context/StoreContext.jsx';

export default function Wishlist() {
  const { state } = useStore();
  const likedProducts = products.filter((product) => state.wishlist.includes(product.id));

  return (
    <Page className="content-page">
      <Seo title="Liked Clothes" description="Saved clothing and favorite products from Shop Store." />
      {likedProducts.length ? (
        <ProductGrid
          products={likedProducts}
          title="Liked Clothes"
          subtitle="Your saved favorites are collected here."
        />
      ) : (
        <>
          <h1>Liked Clothes</h1>
          <p>Your saved clothes will appear here when you tap the heart on a product.</p>
          <Link className="button buttonDark" to="/new">Browse new collection</Link>
        </>
      )}
    </Page>
  );
}
