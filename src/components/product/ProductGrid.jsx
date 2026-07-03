import { useEffect, useState } from 'react';
import ProductCard from './ProductCard.jsx';
import styles from './ProductGrid.module.css';
import styles_app from '../../App.module.css';
import axios from 'axios';
import useFetch from '../../hooks/useFetch.js';

export default function ProductGrid({ category, type, title = 'New Arrivals', subtitle = 'Explore our new clothes and collections for this season!' }) {
  let endpoint = "products?populate=*";

  if (category && type) {
    endpoint += `&filters[categories][label][$eq]=${category}&filters[type][$eq]=${type}`;
  } else if (category) {
    endpoint += `&filters[categories][label][$eq]=${category}`;
  } else if (type) {
    endpoint += `&filters[type][$eq]=${type}`;
  }

  const { data, loading, error } = useFetch(endpoint);
  
  const [isEmpty, setIsEmpty] = useState(false);
  useEffect(() => {
    setIsEmpty(Array.isArray(data) && data.length === 0);
    console.log(data);
  }, [data]);

  return (
    <section className={styles.section}  id={`section-${category}`}>
      <header>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      
      {error ? (
        <div className={`${styles_app.state} ${styles_app.error}`}>
          Something went wrong.
        </div>
      ) : loading ? (
        <div className={`${styles_app.state} ${styles_app.loading}`}>
          Loading products...
        </div>
      ) : data?.length === 0 ? (
        <div className={`${styles_app.state} ${styles_app.empty}`}>
          No products found.
        </div>
      ) : (
        <div className={styles.grid}>
          {data?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
