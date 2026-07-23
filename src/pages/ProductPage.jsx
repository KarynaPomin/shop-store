import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Page from "../components/common/Page.jsx";
import Seo from "../components/common/Seo.jsx";
import ProductGrid from "../components/product/ProductGrid.jsx";

import { useStore } from "../context/StoreContext.jsx";
import useFetch from "../hooks/useFetch.js";
import { currency } from "../utils/format.js";
import styles from "./ProductPage.module.css";
import { ReviewsCard } from "../components/product/ReviewsCard.jsx";
import SizeGuide from "./SizeGuide.jsx";

const handleShare = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard");
  } catch (err) {
    console.error("failed to copy");
  }
};

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

export default function ProductPage() {
  const { id } = useParams();

  const {
    data: products,
    loading,
    error,
  } = useFetch(`products?populate=*&filters[id][$eq]=${id}`);

  const product = products?.[0];

  const baseUrl = process.env.REACT_APP_API_UPLOAD_URL;

  const [image, setImage] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const { state, addToCart, toggleWishlist } = useStore();
  const wished = state.wishlist.includes(product?.id);

  const { data: reviews, refetch: refetchReviews } = useFetch(
    `reviews?populate=*&filters[product][id][$eq]=${id}`,
  );

  const similar = useMemo(() => {
    if (!products || !product) return [];

    return products
      .filter(
        (item) => item.category === product.category && item.id !== product.id,
      )
      .slice(0, 4);
  }, [products, product]);

  useEffect(() => {
    if (!product) return;

    setImage(product.images?.[0] || null);
    setSize(product.sizes?.[0] || null);
    setColor(product.colors?.colors?.[0]?.name || null);

    console.log(product);
  }, [product]);

  if (loading || !product) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <Page className={styles.page}>
      <Seo title={product.name} description={product.description} />

      <div className={styles.breadcrumbs}>
        Clothes and shoes • {product.type} • {product.brand}
      </div>

      <section className={styles.detail}>
        <div>
          <div className={styles.imageWrap}>
            {product.images?.[0] && (
              <img
                src={`${baseUrl}${image?.url || product.images[0].url}`}
                alt={product.name}
              />
            )}
          </div>

          <div className={styles.thumbs}>
            {product?.images?.map((item, index) => (
              <button
                key={item.id || item.url || index}
                className={image?.url === item.url ? styles.selected : ""}
                onClick={() => setImage(item)}
              >
                <img src={`${baseUrl}${item.url}`} alt="" />
              </button>
            ))}
          </div>
        </div>

        <aside className={styles.panel}>
          <div className={styles.brand}>
            <strong>{product.brand}</strong>
            <span>{product.sku}</span>
          </div>

          <h1>{product.name}</h1>

          <div className={styles.rating}>
            {renderStars(product.rating)}
            <span>
              {product.rating} ({product.reviews.length} reviews)
            </span>
          </div>

          <p className={styles.price}>
            {product.salePrice && <s>{currency(product.price)}</s>}
            <strong>{currency(product.salePrice || product.price)}</strong>
          </p>

          <fieldset>
            <legend>
              Color <span>• {color}</span>
            </legend>

            <div className={styles.swatches}>
              {product?.colors?.colors.map((item, index) => (
                <button
                  key={item.name}
                  className={`${styles.swatch} ${color === item.name ? styles.active : ""}`}
                  style={{ backgroundColor: item.hex }}
                  onClick={() => setColor(item.name)}
                />
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>
              Size <span>• {size}</span>
            </legend>

            <div className={styles.sizes}>
              {product?.sizes?.map((item, index) => (
                <button
                  key={item || index}
                  className={size === item ? styles.selectedSize : ""}
                  onClick={() => setSize(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <Link to="/size-guide">Size guide</Link>
          </fieldset>

          <label className={styles.qty}>
            Quantity
            <input
              type="number"
              min="1"
              max={product.stock}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>

          <div className={styles.actions}>
            <button
              className="button buttonDark"
              onClick={() => addToCart(product, size, color, quantity)}
            >
              <ShoppingBagOutlinedIcon /> Add to cart
            </button>

            <button
              className="button"
              onClick={() => toggleWishlist(product.id)}
              aria-label="Toggle favorite"
            >
              {wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </button>

            <button aria-label="Share" className="button" onClick={handleShare}>
              <ShareOutlinedIcon />
            </button>
          </div>

          <p className={styles.delivery}>
            <LocalShippingOutlinedIcon /> Free delivery on orders over $120.0
          </p>

          <details open>
            <summary>Product description</summary>
            <p>{product.description}</p>
          </details>

          <details>
            <summary>Shipping and returns</summary>
            <p>
              Standard delivery takes 2-5 business days. Returns are accepted
              within 30 days in original condition.
            </p>
          </details>
        </aside>
      </section>

      <ReviewsCard
        reviews={reviews}
        renderStars={renderStars}
        product={product}
        refetchReviews={refetchReviews}
      />

      <ProductGrid
        products={similar.length ? similar : products?.slice(0, 4)}
        title="Similar products"
        subtitle="More pieces from the same mood."
      />

      <Link className={styles.back} to="/cart">
        View cart
      </Link>
    </Page>
  );
}
