import { useState } from 'react';
import styles from './ImageContainer.module.css';

function ImageContainer({ image, onRemove, onMoveX, onMoveY, onMoveToTop, onMoveToBottom, surfaceWidth, surfaceHeight }) {
  const [isMoving, setIsMoving] = useState(false);
  // Move offset values operate in surface logical space, not as CSS coordinates
  const [startMoveOffset, setStartMoveOffset] = useState({ x : 0, y: 0 });
  const [midMoveOffset, setMidMoveOffset] = useState({ x: 0, y: 0 });

  // Convert surface logical coordinates into CSS coordinates on surface
  const imageStyle = {
    left: surfaceWidth / 2 + image.x + midMoveOffset.x,
    top: surfaceHeight / 2 - image.y - midMoveOffset.y,
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

    const x = event.clientX - startMoveOffset.x;
    const y = startMoveOffset.y - event.clientY;

    setMidMoveOffset({ x, y });
  };

  const handleMouseUp = (event: Event) => {
    if(event.button === 0) {
      setStartMoveOffset({ x: 0, y: 0 });
      setMidMoveOffset({ x: 0, y: 0 });
      setIsMoving(false);

      if(midMoveOffset.x != 0) {
        onMoveX(image, midMoveOffset.x);
      }

      if(midMoveOffset.y != 0) {
        onMoveY(image, midMoveOffset.y);
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

export default ImageContainer;
