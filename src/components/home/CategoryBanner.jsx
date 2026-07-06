import { useState } from 'react';
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
          <span>Clothes for</span>
          <h2>{category.label}</h2>
          <a href={`#section-${active}`} className="button buttonLight">Explore now</a>
        </div>
        <img src={category.hero} alt={`${category.label} banner`} />
      </div>
    </section>
  );
}
