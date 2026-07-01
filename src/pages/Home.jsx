import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import Hero from '../components/home/Hero.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import CategoryBanner from '../components/home/CategoryBanner.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { products } from '../data/catalog.js';
import styles from './Home.module.css';

export default function Home() {
  return (
    <Page>
      <Seo title="Home" description="Modern clothing shop portfolio homepage with curated collections and hot deals." />
      <Hero />
      <CategoryShowcase />
      <ProductGrid products={products} />
      <CategoryBanner />
      <section id="deals" className={styles.deals}>
        <div>
          <h2>Hot Deals You Can't Miss</h2>
          <p>Explore our new clothes and collections for this season!</p>
          <button aria-label="Play campaign video"><PlayArrowIcon /></button>
        </div>
      </section>
    </Page>
  );
}
