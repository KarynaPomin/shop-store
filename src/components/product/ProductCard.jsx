import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { currency } from '../../utils/format.js';
import styles from './ProductCard.module.css';

const renderStars = (rating) => {
  return Array.from({ length: 5 }, (_, i) => {
    const value = i + 1;

    if (rating >= value) {
      return <StarIcon key={i} />;
    }

    if (rating >= value - 0.5) {
      return <StarIcon key={i} style={{ opacity: 0.5 }} />;
    }

    return <StarIcon key={i} style={{ opacity: 0.2 }} />;
  });
};

export default function ProductCard({ product }) {
  const { state, toggleWishlist } = useStore();
  const wished = state.wishlist.includes(product.id);
  const baseUrl = process.env.REACT_APP_API_UPLOAD_URL;

  return (
    <motion.article className={styles.card} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link to={`/product/${product.id}`} className={styles.media}>
        {product.images ? (
          <img
            src={`${baseUrl}${product.images[0].url}`}
            alt={product.title}
            loading="lazy"
          />
        ) : (
          <img
            src="https://placehold.net/default.png"
            alt="Unavailable"
            loading="lazy"
          />
        )}
      </Link>
      <div className={styles.info}>
        <span>{product.name}</span>
        <button onClick={() => toggleWishlist(product.id)} aria-label="Toggle favorite">
          {wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </button>
        <Link to={`/product/${product.id}`}>{product.title}</Link>
        <p>
          {product.salePrice && <s>{currency(product.price)}</s>}
          <strong>{currency(product.salePrice || product.price)}</strong>
        </p>
        <div className={styles.rating}>
          {renderStars(product.rating)}
          <span>{product.rating} ({product.reviews} reviews)</span>
        </div>
      </div>
    </motion.article>
  );
}
