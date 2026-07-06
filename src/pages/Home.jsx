import { motion } from 'framer-motion';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import CategoryShowcase from '../components/home/CategoryShowcase.jsx';
import Hero from '../components/home/Hero.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import styles from './Home.module.css';

export default function Home() {
  return (
    <Page>
      <Seo title="Home" description="Modern clothing shop portfolio homepage with curated collections and hot deals." />
      <Hero />
      <CategoryShowcase />
      <ProductGrid collection="new" />
      <section id="deals" className={styles.deals}>
        <video
          autoPlay
          muted
          loop
          playsInline
          className={styles.video}
          src="/assets/videos/8387364-uhd_4096_2160_25fps.mp4"
        />

        <div className={styles.overlay} />

        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2>Hot Deals You Can't Miss</h2>
          <p>Explore our new clothes and collections for this season!</p>

        </motion.div>
      </section>
    </Page>
  );
}
