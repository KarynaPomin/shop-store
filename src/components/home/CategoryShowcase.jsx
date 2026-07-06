import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { categories } from '../../data/catalog.js';
import styles from './CategoryShowcase.module.css';

export default function CategoryShowcase() {
  return (
    <section className={styles.wrap} aria-label="Featured categories">
      {Object.entries(categories).map(([key, category], index) => (
        <motion.div
          key={key}
          className={styles.card}
          style={{ '--tone': category.tone }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ delay: index * 0.08 }}
        >
          <Link 
            to={`/category/${key}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <h2>For<br />{category.label}</h2>
            <img src={category.cardImage} alt={`${category.label} collection`} />
          </Link>
        </motion.div>
      ))}
    </section>
  );
}
