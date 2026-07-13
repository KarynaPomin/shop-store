import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import { Link } from 'react-router-dom';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { currency } from '../utils/format.js';
import styles from './Cart.module.css';

export default function Cart() {
  const {
    state,
    cartTotals,
    updateQuantity,
    removeFromCart,
    setCoupon,
  } = useStore();

  const baseUrl = process.env.REACT_APP_API_UPLOAD_URL;

  return (
    <Page className={styles.page}>
      <Seo title="Cart" description="Review cart items, coupon, shipping and order summary." />
      <h1>Shopping Cart</h1>
      <div className={styles.layout}>
        <section className={styles.items}>
          {state.cart.length === 0 && <p>Your cart is empty. Start with the new collection.</p>}
          {state.cart.map((item, index) => (
            <article key={`${item.id}-${item.size}-${item.color}`}>
              <img src={`${baseUrl}${item.images[0].url}`} alt={item.name} />
              <div>
                <h2>{item.name}</h2>
                <p>{item.color} • {item.size}</p>
                <strong>{currency(item.salePrice || item.price)}</strong>
              </div>
              <input
                aria-label={`Quantity for ${item.name}`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item.cartId, Number(e.target.value))
                }
              />
              <button onClick={() => removeFromCart(item.cartId)} aria-label="Remove item">
                <DeleteOutlineIcon />
              </button>
            </article>
          ))}
        </section>
        <aside className={styles.summary}>
          <h2>Order Summary</h2>
          <label>
            Coupon
            <input
              placeholder="Try STYLE10"
              value={state.coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
          </label>
          <p><span>Subtotal</span><strong>{currency(cartTotals.subtotal)}</strong></p>
          <p><span>Discount</span><strong>-{currency(cartTotals.discount)}</strong></p>
          <p><span>Shipping</span><strong>{cartTotals.shipping
                                            ? currency(cartTotals.shipping)
                                            : 'Free'}
                                            </strong>
          </p>
          <p><span>Estimated delivery</span><strong>2-5 days</strong></p>
          <p className={styles.total}><span>Total</span><strong>{currency(cartTotals.total)}</strong></p>
          <Link to="/checkout" className="button buttonDark">Checkout</Link>
          <Link to="/new" className="button buttonLight">Continue shopping</Link>
        </aside>
      </div>
    </Page>
  );
}
