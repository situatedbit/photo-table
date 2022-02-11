/* eslint @next/next/no-img-element: 0 */
import { useState, MouseEvent, FormEvent } from "react";
import { Image } from "@/models/image";
import styles from "./ImageContainer.module.css";

interface ImageContainerProps {
  image: Image;
  onRemove: () => void;
  onMoveX: (increment: number) => void;
  onMoveY: (increment: number) => void;
  onMoveToTop: () => void;
  onMoveToBottom: () => void;
  surfaceWidth: number;
  surfaceHeight: number;
}

function ImageContainer({
  image,
  onRemove,
  onMoveX,
  onMoveY,
  onMoveToTop,
  onMoveToBottom,
  surfaceWidth,
  surfaceHeight,
}: ImageContainerProps) {
  const [isDragging, setIsDragging] = useState(false);
  // Drag offset values operate in surface logical space, not as CSS coordinates
  const [startDragOffset, setStartDragOffset] = useState({ x: 0, y: 0 });
  const [midDragOffset, setMidDragOffset] = useState({ x: 0, y: 0 });

  // Convert surface logical coordinates into CSS coordinates on surface element.
  // By default these position properties will be applied to the entire
  // component. When the user drags the image, the component temporarily
  // stretches to fill the surface to prevent the mouse from falling off of this
  // component while the tree re-renders. During that time, these position
  // properties are applied to the inner container.
  const positionWithinSurface = {
    left: surfaceWidth / 2 + image.left + midDragOffset.x,
    top: surfaceHeight / 2 - image.top - midDragOffset.y,
  };

  const imageContainerStyle = {
    ...(isDragging ? positionWithinSurface : {}),
  };

  const draggableContainerStyle = {
    zIndex: image.zIndex,
    ...(isDragging ? {} : positionWithinSurface),
  };

  const handleMouseDown = (event: MouseEvent<HTMLElement>) => {
    // button 0 is the primary button; ignore right clicks, e.g.
    if (event.button === 0) {
      onMoveToTop();

      setStartDragOffset({ x: event.clientX, y: event.clientY });
      setIsDragging(true);
    }

    // Do not initiate dragging behavior on parent elements
    event.stopPropagation();
  };

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    if (!isDragging) {
      // Just ignore, don't prevent event bubble
      return;
    }

    const x = event.clientX - startDragOffset.x;
    const y = startDragOffset.y - event.clientY;

    setMidDragOffset({ x, y });
  };

  const handleMouseUp = (event: MouseEvent<HTMLElement>) => {
    if (isDragging && event.button === 0) {
      setStartDragOffset({ x: 0, y: 0 });
      setMidDragOffset({ x: 0, y: 0 });
      setIsDragging(false);

      if (midDragOffset.x != 0) {
        onMoveX(midDragOffset.x);
      }

      if (midDragOffset.y != 0) {
        onMoveY(midDragOffset.y);
      }
    }
  };

  const draggableContainerClassName = isDragging
    ? styles.draggableContainerDragging
    : styles.draggableContainer;
  const imgClassName = isDragging ? styles.imageDragging : styles.image;

  return (
    <div
      className={draggableContainerClassName}
      style={draggableContainerStyle}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className={styles.imageContainer} style={imageContainerStyle}>
        <img
          alt=""
          className={imgClassName}
          draggable="false"
          height={image.pixelHeight}
          src={image.url}
          width={image.pixelWidth}
        />
        <form
          className={styles.controls}
          onSubmit={(event: FormEvent<HTMLFormElement>) =>
            event.preventDefault()
          }
        >
          <button className="p-1" onClick={onMoveToBottom}>
            ⤓
          </button>
          <button className="p-1" onClick={onRemove}>
            ✕
          </button>
        </form>
      </div>
    </div>
  );
}

export default ImageContainer;
