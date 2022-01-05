import styles from './Image.module.css';

function Image({ image, onRemove, onMoveX, onMoveY, onMoveToTop, onMoveToBottom }) {
  const increment = 20;

  const imageStyle = {
    ...image.position,
    zIndex: image.zIndex,
  }

  return (
    <div className={styles.image} style={imageStyle}>
      <img src={image.url} onClick={() => onMoveToTop(image)}/>
      <form
        className={styles.controls}
        onSubmit={(event: Event) => event.preventDefault()}
      >
        <button onClick={() => onRemove(image)}>✕</button>
        <button onClick={() => onMoveX(image, -increment)}>🠄</button>
        <button onClick={() => onMoveX(image, increment)}>🠆</button>
        <button onClick={() => onMoveY(image, -increment)}>🠅</button>
        <button onClick={() => onMoveY(image, increment)}>🠇</button>
        <button onClick={() => onMoveToBottom(image)}>❐</button>
      </form>
    </div>
  );
}

export default Image;
