import { useEffect, useRef, useState } from 'react';
import { Rectangle } from '../../../models/rectangle';
import { Surface } from '../../../models/surface';
import styles from './Viewport.module.css';

interface ViewportProps {
  children: React.ReactNode;
  surface: Surface;
  viewport: Rectangle;
  onViewportChange: (Rectangle) => void;
}

function Viewport({ viewport, surface, children, onViewportChange }: ViewportProps) {
  const viewportDiv = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startDragViewport, setStartDragViewport] = useState(null);
  const [startDragPosition, setStartDragPosition] = useState(null);

  // Logically, viewport exists within the surface space as a rectangle, but
  // in the DOM it's implemented as a container for the surface element. The
  // surface element is scaled to be large enough to accomodate all images in
  // both surface logical space and in CSS. Position the surface element
  // relative to the viewport element.
  const surfaceStyle = {
    left: -(surface.width / 2 + viewport.x),
    top: -(surface.height / 2 - viewport.y),
    width: surface.width,
    height: surface.height,
  };

  // Synchronize the logical viewport size to the width and height of the
  // viewport <div> element. Does not change viewport logical position.
  const syncViewportToDomSize = (previousViewport: Rectangle, {clientWidth, clientHeight}) => {
    if (previousViewport.width != clientWidth || previousViewport.height != clientHeight) {
      onViewportChange({
        ...previousViewport,
        height: clientHeight,
        width: clientWidth,
      });
    }
  };

  // On initial render, make sure to measure the DOM to set an initial viewport
  // width and height
  useEffect(() => {
    const id = setTimeout(syncViewportToDomSize(viewport, viewportDiv.current), 0);

    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const handleWindowResize = () => syncViewportToDomSize(viewport, viewportDiv.current);

    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  })

  const handleMouseDown = (event: Event) => {
    // button 0 is the primary button; ignore right clicks, e.g.
    if(event.button === 0) {
      setStartDragViewport(viewport);
      setStartDragPosition({ x: event.clientX, y: event.clientY });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (event: Event) => {
    if(isDragging) {
      // Use mouse movements during drag action as relative offset. Until the
      // drag is finished, update the viewport with the coordinates of the
      // viewport before the drag action started, offset by the movement of the
      // mouse during the drag action.
      onViewportChange({
        ...viewport,
        x: startDragViewport.x - (event.clientX - startDragPosition.x),
        y: startDragViewport.y + (event.clientY - startDragPosition.y),
      });
    }
  };

  const handleMouseUp = (event: Event) => {
    if(event.button === 0) {
      setStartDragViewport(null);
      setStartDragPosition(null);
      setIsDragging(false);
    }
  };

  const viewportClassName = isDragging ? styles.viewportDragging : styles.viewport;

  return (
    <div className={viewportClassName} ref={viewportDiv}>
      <div
        className={styles.surface}
        style={{ ...surfaceStyle }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <ul className={styles.list}>
          { children }
        </ul>
      </div>
    </div>
  );
}

export default Viewport;
