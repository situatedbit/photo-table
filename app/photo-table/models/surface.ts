import { Rectangle } from './rectangle';

export interface Surface {
  height: number;
  width: number;
}

/*
  Given a collection of rectangles on a logical cartesian plane, will produce a
  bounding box centered on the origin and large enough to fit all of the
  rectangles plus a margin on all four sides.
*/
export function boundingBox(rectangles: Rectangle[], margin: number): Surface {
  const maxDistance = (edges: number[]) => edges.reduce((max, edge) => Math.max(Math.abs(edge), max), 0);

  const xAxisEdges = rectangles.reduce((edges, {x, width}) => [...edges, x, x + width], [] as number[]);
  const width = 2 * (maxDistance(xAxisEdges) + margin);

  const yAxisEdges = rectangles.reduce((edges, {y, height}) => [...edges, y, y - height], [] as number[]);
  const height = 2 * (maxDistance(yAxisEdges) + margin);

  return { height, width };
}

export function centerOnOrigin(width: number, height: number): Rectangle {
  return centerOnRectangle(width, height, { x: 0, y: 0, width: 0, height: 0 });
}

function centerOfRectangle(rectangle: Rectangle): { x: number, y: number } {
  return {
    x: rectangle.x + rectangle.width / 2,
    y: rectangle.y - rectangle.height / 2,
  };
}

export function centerOnRectangle(width: number, height: number, rectangle: Rectangle): Rectangle {
  const center = centerOfRectangle(rectangle);

  return {
    width,
    height,
    x: center.x - width / 2,
    y: center.y + height / 2,
  };
}
