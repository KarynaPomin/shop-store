import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h3>Shop</h3>
        <button type="button">New Arrivals</button>
        <button type="button">Women</button>
        <button type="button">Men</button>
        <button type="button">Sale</button>
      </div>
      <div>
        <h3>Help</h3>
        <button type="button">Contact</button>
        <button type="button">Shipping</button>
        <button type="button">Returns</button>
        <button type="button">FAQ</button>
      </div>
      <div className={styles.social}>
        <h3>Follow Us</h3>
        <span><InstagramIcon /><FacebookIcon /><LinkedInIcon /></span>
      </div>
      <p className={styles.legal}>Privacy Policy • Terms • Cookies</p>
      <strong>© 2026 YourBrand</strong>
    </footer>
  );
}
