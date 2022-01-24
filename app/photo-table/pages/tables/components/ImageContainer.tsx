import { useState } from 'react';
import styles from './ImageContainer.module.css';

function ImageContainer({ image, onRemove, onMoveX, onMoveY, onMoveToTop, onMoveToBottom, surfaceWidth, surfaceHeight }) {
  const [isMoving, setIsMoving] = useState(false);
  // Move offset values operate in surface logical space, not as CSS coordinates
  const [startMoveOffset, setStartMoveOffset] = useState({ x : 0, y: 0 });
  const [midMoveOffset, setMidMoveOffset] = useState({ x: 0, y: 0 });

  // Convert surface logical coordinates into CSS coordinates on surface
  const imageContainerStyle = {
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

    // Do not initiate dragging behavior on parent elements
    event.stopPropagation();
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
    if(isMoving && event.button === 0) {
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

  const imgClassName = isMoving ? styles.imageDragging : styles.image;

  return (
    <div
      className={styles.imageContainer}
      style={imageContainerStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <img
        className={imgClassName}
        draggable="false"
        height={image.height}
        src={image.url}
        width={image.width}
      />
      <form
        className={styles.controls}
        onSubmit={(event: Event) => event.preventDefault()}
      >
        <button
          className="p-1"
          onClick={() => onMoveToBottom(image)}
        >⤓</button>
        <button
          className="p-1"
          onClick={() => onRemove(image)}
        >✕</button>
      </form>
    </div>
  );
}

export default ImageContainer;
