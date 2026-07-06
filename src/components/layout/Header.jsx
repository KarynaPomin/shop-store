import CloseIcon from '@mui/icons-material/Close';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../../context/StoreContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { asset } from '../../data/catalog.js';
import useFetch from '../../hooks/useFetch.js';
import styles from './Header.module.css';

const menuIcons = {
  'Show full catalog': asset('icons/categorise.png'),
  'Coats and parkas': asset('icons/jacket.png'),
  Jackets: asset('icons/jacket-woman.png'),
  Dresses: asset('icons/dress.png'),
  Bluzy: asset('icons/hoodie.png'),
  Jeans: asset('icons/jeans.png'),
  Sweatpants: asset('icons/soccer-jersey.png'),
};

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function MegaMenu({ category }) {
  if (!category) return null;

  return (
    <motion.div
      className={styles.mega}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <h3>{capitalizeFirstLetter(category.label)}</h3>
      {category?.sub_categories.map((item) => (
        <Link key={item.id} to={`/category/${category.label}/${item.title}`}>
          {menuIcons[item.title] && <img src={menuIcons[item]} alt="" />}
          <span>{capitalizeFirstLetter(item.title)}</span>
        </Link>
      ))}
    </motion.div>
  );
}

export default function Header() {
  const [openMenu, setOpenMenu] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { state } = useStore();
  const { theme, toggleTheme } = useTheme();
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const likedCount = state.wishlist.length;

  const { data, loading, error } = useFetch("categories?populate=*");

  const nav = (
    <>
      <NavLink to="/new">New</NavLink>
      {data?.map((category) => (
        <div
          key={category.id}
          className={styles.navItem}
          onMouseEnter={() => setOpenMenu(category.id)}
          onMouseLeave={() => setOpenMenu(null)}
        >
          <NavLink to={`/category/${category.label}`}>
            {capitalizeFirstLetter(category.label)}
          </NavLink>

          <AnimatePresence>
            {openMenu === category.id && (
              <MegaMenu category={category} />
            )}
          </AnimatePresence>
        </div>
      ))}
      <NavLink to="/sale">Sale</NavLink>
      <NavLink to="/about">About</NavLink>
    </>
  );

  return (
    <header className={styles.header}>
      <Link className={styles.logo} to="/">SHOP STORE</Link>
      <nav className={styles.desktopNav}>{nav}</nav>
      <div className={styles.actions}>
        <Link to="/account" aria-label="Account"><PersonOutlineIcon /></Link>
        <button aria-label="Search"><SearchIcon /></button>
        <Link className={styles.badgedIcon} to="/wishlist" aria-label="Liked clothes">
          <FavoriteBorderIcon />
          {likedCount > 0 && <span>{likedCount}</span>}
        </Link>
        <Link className={styles.cart} to="/cart" aria-label="Cart">
          <ShoppingCartOutlinedIcon />
          {count > 0 && <span>{count}</span>}
        </Link>
        <button onClick={toggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? <LightModeOutlinedIcon /> : <DarkModeOutlinedIcon />}
        </button>
        <button className={styles.mobileToggle} onClick={() => setMobileOpen((value) => !value)} aria-label="Menu">
          {mobileOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            className={styles.mobileNav}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            {nav}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
