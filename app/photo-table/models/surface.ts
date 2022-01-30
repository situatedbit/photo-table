import { width, height, Rectangle } from './rectangle';

export interface Surface {
  height: number;
  width: number;
}

const origin = { x1: 0, y1: 0, x2: 0, y2: 0 };

/*
  Given a collection of rectangles on a logical cartesian plane, will produce a
  bounding box centered on the origin and large enough to fit all of the
  rectangles plus a margin on all four sides.
*/
export function boundingBox(rectangles: Rectangle[], margin: number): Surface {
  const maxScale = (edges: number[]) => edges.reduce((max, edge) => Math.max(Math.abs(edge), max), 0);

  const xCoords = rectangles.reduce((coords, {x1, x2}) => [...coords, x1, x2], [] as number[]);
  const width = 2 * (maxScale(xCoords) + margin);

  const yCoords = rectangles.reduce((coords, {y1, y2}) => [...coords, y1, y2], [] as number[]);
  const height = 2 * (maxScale(yCoords) + margin);

  return { height, width };
}

export function centerOnOrigin(width: number, height: number): Rectangle {
  return centerOnRectangle(width, height, origin);
}

function centerOfRectangle(rectangle: Rectangle): { x: number, y: number } {
  return {
    x: rectangle.x1 - (rectangle.x1 - rectangle.x2) / 2,
    y: rectangle.y1 - (rectangle.y1 - rectangle.y2) / 2,
  };
}

export function centerOnRectangle(width: number, height: number, rectangle: Rectangle): Rectangle {
  const center = centerOfRectangle(rectangle);

  return {
    x1: center.x - width / 2,
    y1: center.y + height / 2,
    x2: center.x + width / 2,
    y2: center.y - height / 2,
  };
}
