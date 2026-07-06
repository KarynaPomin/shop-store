import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import StarIcon from '@mui/icons-material/Star';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import ProductGrid from '../components/product/ProductGrid.jsx';
import { reviews } from '../data/catalog.js';
import { useStore } from '../context/StoreContext.jsx';
import { currency } from '../utils/format.js';
import styles from './ProductPage.module.css';
import useFetch from '../hooks/useFetch.js';

export default function ProductPage() {
  const { data, loading, error } = useFetch("products?populate=*");

  const { id } = useParams();
  const product = data.find((item) => item.id === Number(id));
  const [image, setImage] = useState(product.images[0]);
  const [size, setSize] = useState(product.sizes[1] || product.sizes[0]);
  const [color, setColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, toggleWishlist } = useStore();
  const approvedReviews = reviews.filter((review) => review.productId === product.id && review.approved);
  const similar = useMemo(
    () => data.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4),
    [product],
  );

  return (
    <Page className={styles.page}>
      <Seo title={product.name} description={product.description} />
      <div className={styles.breadcrumbs}>Clothes and shoes • {product.type} • {product.brand}</div>
      <section className={styles.detail}>
        <div>
          <div className={styles.imageWrap}>
            <img src={image} alt={product.name} />
          </div>
          <div className={styles.thumbs}>
            {product.images.map((item) => (
              <button key={item} className={image === item ? styles.selected : ''} onClick={() => setImage(item)}>
                <img src={item} alt="" />
              </button>
            ))}
            <button>+4 more</button>
          </div>
        </div>
        <aside className={styles.panel}>
          <div className={styles.brand}>
            <strong>{product.brand}</strong>
            <span>{product.sku}</span>
          </div>
          <h1>{product.name}</h1>
          <div className={styles.rating}>
            {Array.from({ length: 5 }).map((_, index) => <StarIcon key={index} />)}
            <span>{product.reviews} reviews</span>
          </div>
          <p className={styles.price}>{currency(product.salePrice || product.price)}</p>
          <fieldset>
            <legend>Color <span>• {color}</span></legend>
            <div className={styles.swatches}>
              {product.colors.map((item) => (
                <button key={item} className={color === item ? styles.selected : ''} onClick={() => setColor(item)}>
                  {item}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend>Size <span>• EU Men</span></legend>
            <div className={styles.sizes}>
              {product.sizes.map((item) => (
                <button key={item} className={size === item ? styles.selectedSize : ''} onClick={() => setSize(item)}>
                  {item}
                </button>
              ))}
            </div>
            <a>Size guide</a>
          </fieldset>
          <label className={styles.qty}>
            Quantity
            <input type="number" min="1" max={product.stock} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} />
          </label>
          <div className={styles.actions}>
            <button
              className="button buttonDark"
              onClick={() => addToCart(product, size, color, quantity)}
            >
              <ShoppingBagOutlinedIcon /> Add to cart
            </button>
            <button
              aria-label="Add to wishlist"
              onClick={() => toggleWishlist(product.id)}
            >
              <FavoriteBorderIcon />
            </button>
            <button aria-label="Share"><ShareOutlinedIcon /></button>
          </div>
          <p className={styles.delivery}><LocalShippingOutlinedIcon /> Free delivery on orders over $120.0</p>
          <details open>
            <summary>Product description</summary>
            <p>{product.description}</p>
          </details>
          <details>
            <summary>Shipping and returns</summary>
            <p>Standard delivery takes 2-5 business days. Returns are accepted within 30 days in original condition.</p>
          </details>
        </aside>
      </section>
      <section className={styles.reviews}>
        <h2>Reviews</h2>
        {approvedReviews.map((review) => (
          <article key={review.id}>
            <strong>{review.author}</strong>
            <span>{review.rating}/5</span>
            <p>{review.text}</p>
          </article>
        ))}
      </section>
      <ProductGrid products={similar.length ? similar : data.slice(0, 4)} title="Similar products" subtitle="More pieces from the same mood." />
      <Link className={styles.back} to="/cart">View cart</Link>
    </Page>
  );
}
