import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../data/catalog.js';
import styles from './CategoryBanner.module.css';

export default function CategoryBanner() {
  const [active, setActive] = useState('woman');
  const category = categories[active];

  return (
    <section className={styles.section}>
      <div className={styles.tabs}>
        {Object.entries(categories).map(([key, item]) => (
          <button
            key={key}
            className={active === key ? styles.active : ''}
            onClick={() => setActive(key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <motion.div
        className={styles.banner}
        style={{ backgroundColor: category.tone }}
        key={active}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <span>Clothes from</span>
          <h2>Elegant Look Of Clothes That Shines</h2>
          <Link to={`/category/${active}`} className="button buttonLight">Explore now</Link>
        </div>
        <img src={category.hero} alt={`${category.label} banner`} />
      </motion.div>
    </section>
  );
}
