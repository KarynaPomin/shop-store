import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h3>Shop</h3>
        <a href="#">New Arrivals</a>
        <a href="#">Women</a>
        <a href="#">Men</a>
        <a href="#">Sale</a>
      </div>
      <div>
        <h3>Help</h3>
        <a href="#">Contact</a>
        <a href="#">Shipping</a>
        <a href="#">Returns</a>
        <a href="#">FAQ</a>
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
