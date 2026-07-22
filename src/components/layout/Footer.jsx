import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div>
        <h3>Shop</h3>
        <Link to={"/new"}>New Arrivals</Link>
        <Link to={"/category/woman"}>Woman</Link>
        <Link to={"/category/kids"}>Kids</Link>
        <Link to={"/category/man"}>Man</Link>
        <Link to={"/sale"}>Sale</Link>
      </div>
      <div>
        <h3>Help</h3>
        <Link to={"/about"}>About</Link>
        <Link to={"/contact"}>Contact</Link>
      </div>
      <div className={styles.social}>
        <h3>Follow Us</h3>
        <span>
          <InstagramIcon />
          <FacebookIcon />
          <LinkedInIcon />
        </span>
      </div>
      <p className={styles.legal}>Privacy Policy • Terms • Cookies</p>
      <strong>© 2026 YourBrand</strong>
    </footer>
  );
}
