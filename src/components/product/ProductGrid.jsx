import styles_app from '../../App.module.css';
import useFetch from '../../hooks/useFetch.js';
import ProductCard from './ProductCard.jsx';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ products, category, subCategory, collection, title = 'New Arrivals', subtitle = 'Explore our new clothes and collections for this season!' }) {
  
  let endpoint = "products?populate=*";

  if (collection === "new") {
    endpoint += `&filters[isNew][$eq]=true`;
  }
  else if (collection === "sale") {
    endpoint += "&filters[salePrice][$notNull]=true";
  }
  else if (category && subCategory) {
    endpoint += `&filters[categories][label][$eq]=${category}`;
    endpoint += `&filters[sub_categories][title][$eq]=${subCategory}`;
  } else if (category) {
    endpoint += `&filters[categories][label][$eq]=${category}`;
  } else if (subCategory) {
    endpoint += `&filters[sub_categories][title][$eq]=${subCategory}`;
  }

  const { data: productData, loading, error } = useFetch(endpoint);

  const data = products ?? productData;
  const isLoading = products ? false : loading;
  const hasError = products ? null : error;

  return (
    <section className={styles.section}  id={`section-${category}`}>
      <header>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      
      {hasError ? (
        <div className={`${styles_app.state} ${styles_app.error}`}>
          Something went wrong.
        </div>
      ) : isLoading ? (
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
