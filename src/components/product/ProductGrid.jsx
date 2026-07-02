import ProductCard from './ProductCard.jsx';
import styles from './ProductGrid.module.css';

export default function ProductGrid({ current, products, title = 'New Arrivals', subtitle = 'Explore our new clothes and collections for this season!' }) {
  return (
    <section className={styles.section}  id={`section-${current}`}>
      <header>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </header>
      <div className={styles.grid}>
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </section>
  );
}
