import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import CategoryBanner from '../components/home/CategoryBanner.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import useFetch from '../hooks/useFetch.js';

export default function CategoryPage({ collection }) {
  const { category, sub } = useParams();
  
  const title = 
    collection === 'sale' 
    ? 'Sale' 
    : collection === 'new' 
    ? 'New Collection' 
    : category
      ? category.charAt(0).toUpperCase() + category.slice(1)
      : "Collection";

  return (
    <Page>
      <Seo title={title} description={`${title} clothing and accessories from Shop Store.`} />
      {category && <CategoryBanner activeCategory={category} />}
      <ProductGrid
        category={category}
        subCategory={sub}
        collection={collection}
        title={title}
        subtitle="Browse refined everyday pieces with mock stock, color and size data ready for a backend."
      />
    </Page>
  );
}
