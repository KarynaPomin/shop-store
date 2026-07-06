import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { homeHero } from '../../data/catalog.js';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero} style={{ backgroundColor: homeHero.tone }}>
      <motion.div
        className={styles.copy}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
      >
        <span>Clothes from</span>
        <h1>Elegant Look Of Clothes That Shines</h1>
        <p>Premium daily pieces, expressive silhouettes and fresh arrivals curated for the season.</p>
        <div>
          <Link to="/new" className="button buttonLight">Explore now</Link>
          <a href="#deals" className={styles.play}><PlayCircleOutlineIcon /> Hot deals</a>
        </div>
      </motion.div>
      <motion.img
        className={styles.heroImage}
        src={homeHero.image}
        alt="Shop Store home banner"
        initial={{ opacity: 0, x: 44 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.55, delay: 0.1 }}
      />
    </section>
  );
}
