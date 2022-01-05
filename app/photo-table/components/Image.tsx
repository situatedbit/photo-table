import styles from './Image.module.css';

function Image({ image, onRemove, onMoveX, onMoveY }) {
  const increment = 20;

  return (
    <div className={styles.image} style={{ ...image.position }}>
      <img src={image.url} />
      <form
        className={styles.controls}
        onSubmit={(event: Event) => event.preventDefault()}
      >
        <button onClick={() => onRemove(image)}>✕</button>
        <button onClick={() => onMoveX(image, -increment)}>🠄</button>
        <button onClick={() => onMoveX(image, increment)}>🠆</button>
        <button onClick={() => onMoveY(image, -increment)}>🠅</button>
        <button onClick={() => onMoveY(image, increment)}>🠇</button>
      </form>
    </div>
  );
}

export default Image;
