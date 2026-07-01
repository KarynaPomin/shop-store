import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import { useStore } from '../context/StoreContext.jsx';
import { currency } from '../utils/format.js';
import styles from './Checkout.module.css';

const schema = z.object({
  name: z.string().min(2, 'Enter your full name'),
  email: z.string().email('Enter a valid email'),
  address: z.string().min(6, 'Enter a delivery address'),
  city: z.string().min(2, 'Enter a city'),
  delivery: z.enum(['standard', 'express', 'pickup']),
  payment: z.enum(['paypal', 'cash']),
});

export default function Checkout() {
  const navigate = useNavigate();
  const { state, total, dispatch } = useStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { delivery: 'standard', payment: 'cash' },
  });

  const onSubmit = () => {
    dispatch({ type: 'CLEAR_CART' });
    navigate('/confirmation');
  };

  return (
    <Page className={styles.page}>
      <Seo title="Checkout" description="Frontend checkout architecture prepared for payment integrations." />
      <h1>Checkout</h1>
      <form className={styles.layout} onSubmit={handleSubmit(onSubmit)}>
        <section className={styles.form}>
          <h2>Shipping address</h2>
          {[
            ['name', 'Full name'],
            ['email', 'Email'],
            ['address', 'Address'],
            ['city', 'City'],
          ].map(([name, label]) => (
            <label key={name}>
              {label}
              <input {...register(name)} />
              {errors[name] && <span>{errors[name].message}</span>}
            </label>
          ))}
          <h2>Delivery method</h2>
          <div className={styles.options}>
            <label><input type="radio" value="standard" {...register('delivery')} /> Standard delivery</label>
            <label><input type="radio" value="express" {...register('delivery')} /> Express delivery</label>
            <label><input type="radio" value="pickup" {...register('delivery')} /> Store pickup</label>
          </div>
          <h2>Payment</h2>
          <div className={styles.options}>
            <label><input type="radio" value="paypal" {...register('payment')} /> PayPal placeholder</label>
            <label><input type="radio" value="cash" {...register('payment')} /> Cash on delivery</label>
          </div>
        </section>
        <aside className={styles.summary}>
          <h2>Order summary</h2>
          {state.cart.map((item) => (
            <p key={`${item.id}-${item.size}`}>
              <span>{item.quantity} x {item.name}</span>
              <strong>{currency((item.salePrice || item.price) * item.quantity)}</strong>
            </p>
          ))}
          <p className={styles.total}><span>Total</span><strong>{currency(total)}</strong></p>
          <button className="button buttonDark" type="submit">Confirm order</button>
        </aside>
      </form>
    </Page>
  );
}
