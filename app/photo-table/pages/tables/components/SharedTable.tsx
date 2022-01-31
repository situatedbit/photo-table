import { useEffect, useState } from 'react';
import ImageContainer from './ImageContainer';
import Toolbar from './Toolbar';
import Viewport from './Viewport'
import { center, centerOnPoint, height, largestSide, width, Rectangle } from '../../../models/rectangle';
import { boundingBox, centerOnOrigin, centerOnRectangle } from '../../../models/surface';
import { getSharedDoc } from '../../../models/client/sharedb';
import styles from './SharedTable.module.css';
import { centerImageOnPoint, fetchImage, plotImage, imageFromElement, Image } from '../../../models/image';

type Props = {
  tableId: string,
}

const emptyTable = {
  images: [],
};
const initialViewport = { x1: 0, y1: 0, x2: 0, y2: 0 };
const origin = { x: 0, y: 0 };

const SharedTable = ({ tableId }: Props) => {
  const [doc, setDoc] = useState(null)
  const [table, setTable] = useState(emptyTable);
  // Viewport size will be based on DOM element size. Initialize it to a tiny
  // size, then wait for the Viewport component to synchronize the logical
  // viewport size with the containing dom element.
  const [viewport, setViewport] = useState(initialViewport);

  useEffect(() => {
    const newDoc = getSharedDoc('tables', tableId);

    newDoc.subscribe((error) => {
      if (error) return console.error(error);
    });

    const handleLoad = () => {
      setTable({ ...newDoc.data });
// DEBUG
      console.log('loaded', { ...newDoc.data });
    };
    newDoc.on('load', handleLoad);

    const handleOp = () => {
      setTable({ ...newDoc.data });
// DEBUG
      console.log('op', { ...newDoc.data });
    };
    newDoc.on('op', handleOp);

    setDoc(newDoc)

    return () => {
      newDoc.unsubscribe();
      newDoc.off('load', handleLoad);
      newDoc.off('op', handleOp);
    };
  }, [tableId]);

  const handleAddUrl = async (url: string) => {
    const path = ['images', table.images.length];

    const image = imageFromElement(await fetchImage(url));

    const op = [{ p: path, li: centerImageOnPoint(image, center(viewport)) }];

    doc.submitOp(op);
  };

  const handleCenterOnOrigin = () => {
    setViewport(centerOnPoint(viewport, origin));
  }

  const handleImageRemove = (image, index: number) => {
    const path = ['images', index];
    const op = [{ p: path, ld: image }];

    doc.submitOp(op);
  };

  const handleImageMove = (image, index: number, axis: 'x' | 'y', increment: number) => {
    const prop = axis === 'x' ? 'left' : 'top';
    const path = ['images', index, prop];
    const op = { p: path, na: increment };

    doc.submitOp(op);
  }

  const handleImageMoveToTop = (image, index: number) => {
    const maxZ = Math.max(...table.images.map(image => image.zIndex));
    const increment = maxZ + 1 - image.zIndex;
    const path = ['images', index, 'zIndex'];
    const op = { p: path, na: increment };

    doc.submitOp(op);
  }

  const handleImageMoveToBottom = (image, index: number) => {
    const increment = 0 - image.zIndex;
    const path = ['images', index, 'zIndex'];
    const op = { p: path, na: increment };

    doc.submitOp(op);
  }

  const handleViewportChange = (viewport: Rectangle) => {
    // If this is the first update to viewport, center it on the origin with
    // its new width and height.
    setViewport((previousViewport) => {
      if (previousViewport === initialViewport) {
        return centerOnPoint(viewport, origin);
      } else {
        return viewport;
      }
    });
  };

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
      <div className={styles.viewport}>
        <Viewport
          surface={surface}
          viewport={viewport}
          onViewportChange={handleViewportChange}
        >
          { table.images.map((image, index) => {
            return(
              <ImageContainer
                key={image.url + index}
                image={image}
                surfaceWidth={surface.width}
                surfaceHeight={surface.height}
                onRemove={() => handleImageRemove(image, index)}
                onMoveX={(image, increment) => handleImageMove(image, index, 'x', increment)}
                onMoveY={(image, increment) => handleImageMove(image, index, 'y', increment)}
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
