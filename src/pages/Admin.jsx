import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import { orders, reviews } from '../data/catalog.js';
import useFetch from '../hooks/useFetch.js';
import styles from './Dashboard.module.css';

export default function Admin() {
  const { data, loading, error } = useFetch("products?populate=*");

  const cards = [
    ['Products', data.length, 'Create, edit and delete mock products.'],
    ['Reviews waiting', reviews.filter((review) => !review.approved).length, 'Approve or delete customer reviews.'],
    ['Orders', orders.length, 'Manage order states and fulfillment.'],
    ['Banners', 4, 'Manage category and campaign banners.'],
  ];

  return (
    <Page className={styles.page}>
      <Seo title="Admin" description="Mock admin panel for products, orders, reviews, categories and banners." />
      <h1>Admin Panel</h1>
      <section className={styles.grid}>
        {cards.map(([title, value, text]) => (
          <article key={title}>
            <span>{value}</span>
            <h2>{title}</h2>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className={styles.table}>
        <h2>Product manager</h2>
        {data.slice(0, 5).map((product) => (
          <div key={product.id}>
            <strong>{product.name}</strong>
            <span>{product.stock} in stock</span>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        ))}
      </section>
    </Page>
  );
}
