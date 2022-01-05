import styles from './Viewport.module.css';

function Viewport({ children }) {
  return (
    <div className={styles.viewport}>
      <div className={styles.surface}>
        <ul>
          { children }
        </ul>
      </div>
    </div>
  );
}

export default Viewport;
