import { useMemo, useState } from 'react';
import Page from '../components/common/Page.jsx';
import Seo from '../components/common/Seo.jsx';
import { orders, products } from '../data/catalog.js';
import { useStore } from '../context/StoreContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import styles from './Dashboard.module.css';

const defaultAccount = {
  firstName: 'Karin',
  surname: 'Studio',
  username: 'shopstore-owner',
  email: 'karin@example.com',
  phone: '',
  photo: '',
  address: 'Warsaw, Poland',
  pickupStore: 'Central Store',
  newsletter: true,
  orderUpdates: true,
};

function loadAccount() {
  try {
    return { ...defaultAccount, ...JSON.parse(localStorage.getItem('shop-account')) };
  } catch {
    return defaultAccount;
  }
}

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem('shop-session')) || { loggedIn: false, email: '' };
  } catch {
    return { loggedIn: false, email: '' };
  }
}

export default function Account() {
  const { state } = useStore();
  const { theme, setTheme } = useTheme();
  const [account, setAccount] = useState(loadAccount);
  const [session, setSession] = useState(loadSession);
  const [loginEmail, setLoginEmail] = useState(() => loadSession().email || loadAccount().email);
  const [authMessage, setAuthMessage] = useState('');
  const [saved, setSaved] = useState('');
  const wishlist = products.filter((product) => state.wishlist.includes(product.id));
  const initials = useMemo(
    () => `${account.firstName.charAt(0)}${account.surname.charAt(0)}`.toUpperCase(),
    [account.firstName, account.surname],
  );

  const updateAccount = (field, value) => {
    setAccount((current) => ({ ...current, [field]: value }));
    setSaved('');
  };

  const saveAccount = () => {
    localStorage.setItem('shop-account', JSON.stringify(account));
    setSaved('Saved');
  };

  const uploadPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => updateAccount('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const login = (event) => {
    event.preventDefault();
    const email = loginEmail.trim();

    if (!email || !email.includes('@')) {
      setAuthMessage('Enter a valid email address.');
      return;
    }

    const nextSession = { loggedIn: true, email };
    const nextAccount = { ...account, email };
    localStorage.setItem('shop-session', JSON.stringify(nextSession));
    localStorage.setItem('shop-account', JSON.stringify(nextAccount));
    setSession(nextSession);
    setAccount(nextAccount);
    setAuthMessage('Logged in');
  };

  const logout = () => {
    localStorage.removeItem('shop-session');
    setSession({ loggedIn: false, email: '' });
    setAuthMessage('Logged out');
  };

  return (
    <Page className={styles.page}>
      <Seo title="Account" description="Manage profile, photo, addresses, preferences, orders and wishlist." />
      <header className={styles.profile}>
        <div className={styles.avatar}>
          {account.photo ? <img src={account.photo} alt={`${account.firstName} ${account.surname}`} /> : initials}
        </div>
        <div>
          <h1>{account.firstName} {account.surname}</h1>
          <p>{session.loggedIn ? `Logged in as ${session.email}` : `@${account.username}`}</p>
        </div>
        <div className={styles.profileActions}>
          <label className={styles.uploadButton}>
            Add photo
            <input type="file" accept="image/*" onChange={uploadPhoto} />
          </label>
          <button onClick={saveAccount}>{saved || 'Save changes'}</button>
        </div>
      </header>

      <section className={styles.grid}>
        <article className={styles.formCard}>
          <h2>Profile</h2>
          <div className={styles.formGrid}>
            <label>
              Name
              <input value={account.firstName} onChange={(event) => updateAccount('firstName', event.target.value)} />
            </label>
            <label>
              Surname
              <input value={account.surname} onChange={(event) => updateAccount('surname', event.target.value)} />
            </label>
            <label>
              Username
              <input value={account.username} onChange={(event) => updateAccount('username', event.target.value)} />
            </label>
            <label>
              Email
              <input type="email" value={account.email} onChange={(event) => updateAccount('email', event.target.value)} />
            </label>
            <label>
              Phone
              <input value={account.phone} onChange={(event) => updateAccount('phone', event.target.value)} />
            </label>
            <label>
              Theme
              <select value={theme} onChange={(event) => setTheme(event.target.value)} aria-label="Theme selector">
                <option value="light">Light theme</option>
                <option value="dark">Dark theme</option>
              </select>
            </label>
          </div>
        </article>

        <article className={styles.formCard}>
          <h2>Addresses</h2>
          <label>
            Delivery address
            <textarea rows="4" value={account.address} onChange={(event) => updateAccount('address', event.target.value)} />
          </label>
          <label>
            Store pickup
            <select value={account.pickupStore} onChange={(event) => updateAccount('pickupStore', event.target.value)}>
              <option>Central Store</option>
              <option>North Gallery Pickup</option>
              <option>South Point Pickup</option>
            </select>
          </label>
        </article>

        <article className={styles.formCard}>
          <h2>Preferences</h2>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={account.newsletter}
              onChange={(event) => updateAccount('newsletter', event.target.checked)}
            />
            New collection emails
          </label>
          <label className={styles.switchRow}>
            <input
              type="checkbox"
              checked={account.orderUpdates}
              onChange={(event) => updateAccount('orderUpdates', event.target.checked)}
            />
            Order status updates
          </label>
          <p>Google Login placeholder is ready for OAuth connection.</p>
        </article>

        <article className={styles.statCard}>
          <h2>Orders</h2>
          {orders.map((order) => (
            <p key={order.id}>
              <strong>{order.id}</strong>
              <span>{order.status}</span>
            </p>
          ))}
        </article>

        <article className={styles.statCard}>
          <h2>Wishlist</h2>
          <p>{wishlist.length ? wishlist.map((item) => item.name).join(', ') : 'No saved products yet.'}</p>
        </article>

        <article className={styles.statCard}>
          <h2>Security</h2>
          {session.loggedIn ? (
            <>
              <p>
                <strong>Email login</strong>
                <span>{session.email}</span>
              </p>
              <button className={styles.secondaryButton} onClick={logout}>Log out</button>
            </>
          ) : (
            <form className={styles.authForm} onSubmit={login}>
              <label>
                Email
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <button type="submit">Log in</button>
            </form>
          )}
          {authMessage && <p>{authMessage}</p>}
          <p>Google Login and two-step verification are ready for backend connection.</p>
        </article>
      </section>
    </Page>
  );
}