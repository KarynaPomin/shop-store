import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import CategoryBanner from '../components/home/CategoryBanner.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { categories, products } from '../data/catalog.js';

export default function CategoryPage({ collection }) {
  const { slug } = useParams();
  const category = slug && categories[slug] ? slug : null;
  const filtered = useMemo(() => {
    if (collection === 'sale') return products.filter((product) => product.salePrice);
    if (collection === 'new') return products.slice(0, 6);
    if (category) return products.filter((product) => product.category === category);
    return products;
  }, [collection, category]);

  const title = collection === 'sale' ? 'Sale' : collection === 'new' ? 'New Collection' : categories[category]?.label || 'Collection';

  return (
    <Page>
      <Seo title={title} description={`${title} clothing and accessories from Shop Store.`} />
      {category && <CategoryBanner activeCategory={category} />}
      <ProductGrid
        category={category}
        products={filtered}
        title={title}
        subtitle="Browse refined everyday pieces with mock stock, color and size data ready for a backend."
      />
    </Page>
  );
}
