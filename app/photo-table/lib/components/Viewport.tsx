import { useEffect, useState, MouseEventHandler } from "react";
import { height, width, translate, Rectangle, Point } from "@/models/rectangle";
import { Surface } from "@/models/surface";
import styles from "./Viewport.module.css";

interface ViewportProps {
  children: React.ReactNode;
  surface: Surface;
  viewport: Rectangle;
  onViewportChange: (r: Rectangle) => void;
}

const origin = { x: 0, y: 0 };
const initialViewport = { x1: 0, y1: 0, x2: 0, y2: 0 };

function Viewport({
  viewport,
  surface,
  children,
  onViewportChange,
}: ViewportProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [startDragViewport, setStartDragViewport] =
    useState<Rectangle>(initialViewport);
  const [startDragPosition, setStartDragPosition] = useState<Point>(origin);

  // Logically, viewport exists within the surface space as a rectangle, but
  // in the DOM it's implemented as a container for the surface element. The
  // surface element is scaled to be large enough to accomodate all images in
  // both surface logical space and in CSS. Position the surface element
  // relative to the viewport element.
  const surfaceStyle = {
    left: -(surface.width / 2 + viewport.x1),
    top: -(surface.height / 2 - viewport.y1),
    width: surface.width,
    height: surface.height,
  };

  const handleMouseDown: MouseEventHandler<HTMLDivElement> = (event) => {
    // button 0 is the primary button; ignore right clicks, e.g.
    if (event.button === 0) {
      setStartDragViewport(viewport);
      setStartDragPosition({ x: event.clientX, y: event.clientY });
      setIsDragging(true);
    }
  };

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    if (isDragging) {
      // Use mouse movements during drag action as relative offset. Until the
      // drag is finished, update the viewport with the coordinates of the
      // viewport before the drag action started, offset by the movement of the
      // mouse during the drag action.
      const translateX = -(event.clientX - startDragPosition.x);
      const translateY = event.clientY - startDragPosition.y;

      onViewportChange(translate(startDragViewport, translateX, translateY));
    }
  };

  const handleMouseUp: MouseEventHandler<HTMLDivElement> = (event) => {
    if (isDragging && event.button === 0) {
      setStartDragViewport(initialViewport);
      setStartDragPosition(origin);
      setIsDragging(false);
    }
  };

  const viewportClassName = isDragging
    ? styles.viewportDragging
    : styles.viewport;

  return (
    <div className={viewportClassName}>
      <div
        className={styles.surface}
        style={{ ...surfaceStyle }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <ul className={styles.list}>{children}</ul>
      </div>
    </div>
  );
}

export default Viewport;
