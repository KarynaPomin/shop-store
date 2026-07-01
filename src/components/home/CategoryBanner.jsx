import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../data/catalog.js';
import styles from './CategoryBanner.module.css';

export default function CategoryBanner({ activeCategory = 'woman' }) {
  const safeDefault = categories?.woman ? 'woman' : Object.keys(categories)[0];

  const [active, setActive] = useState(
    categories?.[activeCategory] ? activeCategory : safeDefault
  );

  const category = categories?.[active];

  if (!category) return null;

  return (
    <section className={styles.section}>
      <div
        className={styles.banner}
        style={{ backgroundColor: category.tone }}
        key={active}
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <span>Clothes fow</span>
          <h2>{category.label}</h2>
          <Link to={`/category/${active}`} className="button buttonLight">Explore now</Link>
        </div>
        <img src={category.hero} alt={`${category.label} banner`} />
      </div>
    </section>
  );
}
