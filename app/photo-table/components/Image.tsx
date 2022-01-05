import { useState } from 'react';
import styles from './Image.module.css';

function Image({ image, onRemove, onMoveX, onMoveY, onMoveToTop, onMoveToBottom }) {
  const [isMoving, setIsMoving] = useState(false);
  const [startMoveOffset, setStartMoveOffset] = useState({ x : 0, y: 0 });
  const [midMoveOffset, setMidMoveOffset] = useState({ left: 0, top: 0 });
  const increment = 20;

  const imageStyle = {
    left: image.position.left + midMoveOffset.left,
    top: image.position.top + midMoveOffset.top,
    zIndex: image.zIndex,
  }

  const handleMouseDown = (event: Event) => {
    // button 0 is the primary button; ignore right clicks, e.g.
    if(event.button === 0) {
      onMoveToTop(image);

      setStartMoveOffset({ x: event.clientX, y: event.clientY });
      setIsMoving(true);
    }
  };

  const handleMouseMove = (event: Event) => {
    if(!isMoving) {
      // Just ignore, don't prevent event bubble
      return;
    }

    const left = event.clientX - startMoveOffset.x;
    const top = event.clientY - startMoveOffset.y;

    setMidMoveOffset({ left, top });
  };

  const handleMouseUp = (event: Event) => {
    if(event.button === 0) {
      setStartMoveOffset({ x: 0, y: 0 });
      setMidMoveOffset({ left: 0, top: 0 });
      setIsMoving(false);

      if(midMoveOffset.left != 0) {
        onMoveX(image, midMoveOffset.left);
      }

      if(midMoveOffset.top != 0) {
        onMoveY(image, midMoveOffset.top);
      }
    }
  };

  return (
    <div
      className={styles.image}
      style={imageStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img src={image.url} draggable="false" />
      <form
        className={styles.controls}
        onSubmit={(event: Event) => event.preventDefault()}
      >
        <button onClick={() => onMoveToBottom(image)}>⤓</button>
        <button onClick={() => onRemove(image)}>✕</button>
      </form>
    </div>
  );
}

export default Image;
