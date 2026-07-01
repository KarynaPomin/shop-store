import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { motion } from 'framer-motion';
import { useStore } from '../../context/StoreContext.jsx';
import { currency } from '../../utils/format.js';
import styles from './ProductCard.module.css';

export default function ProductCard({ product }) {
  const { state, dispatch } = useStore();
  const wished = state.wishlist.includes(product.id);

  return (
    <motion.article className={styles.card} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link to={`/product/${product.id}`} className={styles.media}>
        <img src={product.images[0]} alt={product.name} loading="lazy" />
      </Link>
      <div className={styles.info}>
        <span>{product.type}</span>
        <button onClick={() => dispatch({ type: 'TOGGLE_WISHLIST', id: product.id })} aria-label="Toggle favorite">
          {wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>
        <Link to={`/product/${product.id}`}>{product.name}</Link>
        <p>
          {product.salePrice && <s>{currency(product.price)}</s>}
          <strong>{currency(product.salePrice || product.price)}</strong>
        </p>
        <div className={styles.rating}>
          {Array.from({ length: 5 }).map((_, index) => <StarBorderIcon key={index} />)}
        </div>
      </div>
    </motion.article>
  );
}
