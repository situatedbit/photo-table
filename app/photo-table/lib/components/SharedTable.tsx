import { useEffect, useRef, useState } from 'react';
import ImageContainer from './ImageContainer';
import Toolbar from './Toolbar';
import Viewport from './Viewport'
import { useSharedTable } from '@/models/doc';
import { center, centerOnPoint, height, largestSide, width, Rectangle } from '@/models/rectangle';
import { boundingBox } from '@/models/surface';
import { centerImageOnPoint, fetchImage, plotImage, imageFromElement, Image } from '@/models/image';
import styles from './SharedTable.module.css';

type Props = {
  tableId: string,
}

const initialViewport = { x1: 0, y1: 0, x2: 0, y2: 0 };
const origin = { x: 0, y: 0 };

const SharedTable = ({ tableId }: Props) => {
  const viewportDiv = useRef<HTMLDivElement>(null);
  const [doc, table] = useSharedTable(tableId);

  // Viewport size will be based on DOM element size. Initialize it to a tiny
  // size, then wait for the Viewport component to synchronize the logical
  // viewport size with the containing dom element.
  const [viewport, setViewport] = useState(initialViewport);

  const resizeViewport = (originalViewport: Rectangle, width: number, height: number): Rectangle => {
    return {
      ...originalViewport,
      x1: 0,
      y1: 0,
      x2: width,
      y2: -height,
    };
  }

  // On every render make sure the viewport width and height match the containing div.
  useEffect(() => {
    const viewportWidth = viewportDiv?.current?.clientWidth ?? 0;
    const viewportHeight = viewportDiv?.current?.clientHeight ?? 0;

    const id = setTimeout(() => {
      const sizedViewport = resizeViewport(viewport, viewportWidth, viewportHeight);

      // Avoid constantly re-rendering by only calling setViewport if size has changed
      if(width(sizedViewport) != width(viewport) || height(sizedViewport) != height(viewport)) {
        // Side effect: during the initial render, when viewport is set to the
        // origin, this will ensure that the first rightly sized viewport is
        // also centered on the origin.
        setViewport(centerOnPoint(sizedViewport, center(viewport)));
      }
    }, 0);

    return () => clearTimeout(id);
  });

  // When the window size changes, make sure viewport retains width and height
  // of containing div
  useEffect(() => {
    const viewportWidth = viewportDiv?.current?.clientWidth ?? 0;
    const viewportHeight = viewportDiv?.current?.clientHeight ?? 0;

    const handleWindowResize = () => {
      const sizedViewport = resizeViewport(viewport, viewportWidth, viewportHeight);

      setViewport(centerOnPoint(sizedViewport, center(viewport)));
    };

    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  });

  const handleAddUrl = async (url: string) => {
    const path = ['images', table.images.length];

    const image = imageFromElement(await fetchImage(url));

    const op = [{ p: path, li: centerImageOnPoint(image, center(viewport)) }];

    doc!.submitOp(op);
  };

  const handleCenterOnOrigin = () => {
    setViewport(centerOnPoint(viewport, origin));
  }

  const handleImageRemove = (image: Image, index: number) => {
    const path = ['images', index];
    const op = [{ p: path, ld: image }];

    doc!.submitOp(op);
  };

  const handleImageMove = (index: number, axis: 'x' | 'y', increment: number) => {
    const prop = axis === 'x' ? 'left' : 'top';
    const path = ['images', index, prop];
    const op = { p: path, na: increment };

    doc!.submitOp(op);
  }

  const handleImageMoveToTop = (image: Image, index: number) => {
    const maxZ = Math.max(...table.images.map(image => image.zIndex));
    const increment = maxZ + 1 - image.zIndex;
    const path = ['images', index, 'zIndex'];
    const op = { p: path, na: increment };

    doc!.submitOp(op);
  }

  const handleImageMoveToBottom = (image: Image, index: number) => {
    const increment = 0 - image.zIndex;
    const path = ['images', index, 'zIndex'];
    const op = { p: path, na: increment };

    doc!.submitOp(op);
  }

  // Surface is large enough to contain any image or the viewport in any
  // of its quadrants. Furthermore, even in the case where the viewport
  // is the largest rectangle on the surface, the margin allows for any image
  // to be dragged to any viewport edge without bumping the edge of the surface.
  const rectangles = [...table.images.map(plotImage), viewport];
  const surfaceMargin = largestSide(rectangles);
  const surface = boundingBox(rectangles, surfaceMargin);

  return (
    <div className={styles['table-wrapper']}>
      <div className={styles.bar}>
        <Toolbar
          onAddUrl={handleAddUrl}
          onCenterOnOrigin={handleCenterOnOrigin}
        />
      </div>
      <div className={styles.viewport} ref={viewportDiv}>
        <Viewport
          surface={surface}
          viewport={viewport}
          onViewportChange={(v) => setViewport(v)}
        >
          { table.images.map((image, index) => {
            return(
              <ImageContainer
                key={image.url + index}
                image={image}
                surfaceWidth={surface.width}
                surfaceHeight={surface.height}
                onRemove={() => handleImageRemove(image, index)}
                onMoveX={(increment) => handleImageMove(index, 'x', increment)}
                onMoveY={(increment) => handleImageMove(index, 'y', increment)}
                onMoveToTop={() => handleImageMoveToTop(image, index)}
                onMoveToBottom={() => handleImageMoveToBottom(image, index)}
              />
            );
          })}
        </Viewport>
      </div>
    </div>
  );
};

export default SharedTable;
