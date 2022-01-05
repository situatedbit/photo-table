import styles from './Image.module.css';

function Image({ image, onRemove }) {
  return (
    <div className={styles['image']} style={{ ...image.position }}>
      <img src={image.url} />
      <button onClick={() => onRemove(image)}>Remove</button>
    </div>
  );
}

export default Image;
