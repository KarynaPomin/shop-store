import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h3>Shop</h3>
        <a>New Arrivals</a>
        <a>Women</a>
        <a>Men</a>
        <a>Sale</a>
      </div>
      <div>
        <h3>Help</h3>
        <a>Contact</a>
        <a>Shipping</a>
        <a>Returns</a>
        <a>FAQ</a>
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
