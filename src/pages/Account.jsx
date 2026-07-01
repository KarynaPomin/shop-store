import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import { products } from '../data/catalog.js';
import { useStore } from '../context/StoreContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import styles from './Dashboard.module.css';

export default function Account() {
  const { state } = useStore();
  const { theme, setTheme } = useTheme();
  const wishlist = products.filter((product) => state.wishlist.includes(product.id));

  return (
    <Page className={styles.page}>
      <Seo title="Account" description="Account architecture prepared for authentication and Google Login." />
      <header className={styles.profile}>
        <div className={styles.avatar}>KS</div>
        <div>
          <h1>Karin Studio</h1>
          <p>@shopstore-owner</p>
        </div>
        <select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label="Theme selector">
          <option value="light">Light theme</option>
          <option value="dark">Dark theme</option>
        </select>
      </header>
      <section className={styles.grid}>
        <article>
          <h2>Google Login</h2>
          <p>Authentication shell is ready for OAuth configuration.</p>
        </article>
        <article>
          <h2>Orders</h2>
          <p>Preparing: 1</p>
          <p>Delivered: 4</p>
        </article>
        <article>
          <h2>Wishlist</h2>
          <p>{wishlist.length ? wishlist.map((item) => item.name).join(', ') : 'No saved products yet.'}</p>
        </article>
        <article>
          <h2>Addresses</h2>
          <p>Home delivery and store pickup locations can be managed here.</p>
        </article>
        <article>
          <h2>Account settings</h2>
          <p>Name, username, password and notifications.</p>
        </article>
      </section>
    </Page>
  );
}
