import styles from './Loader.module.css';

export default function Loader({ label = 'Loading' }) {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <span />
      <p>{label}</p>
    </div>
  );
}
