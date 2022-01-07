import styles from './Viewport.module.css';

function Viewport({ children }) {
  // Images's left, top properties are CSS properties, not logical
  // values. Surface's left
  const surfaceStyle = {
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  };

  return (
    <div className={styles.viewport}>
      <div className={styles.surface} style={{ ...surfaceStyle }}>
        <ul>
          { children }
        </ul>
      </div>
    </div>
  );
}

export default Viewport;
