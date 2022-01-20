import { useEffect, useRef } from 'react';
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

  return (
    <div className={styles.viewport} ref={viewportDiv}>
      <div className={styles.surface} style={{ ...surfaceStyle }}>
        <ul>
          { children }
        </ul>
      </div>
    </div>
  );
}

export default Viewport;
