import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlined';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <video autoPlay muted loop playsInline src="/assets/videos/8387364-uhd_4096_2160_25fps.mp4" />
      <div className={styles.overlay} />
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
    </section>
  );
}
