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
  const maxScale = (edges: number[]) => edges.reduce((max, edge) => Math.max(Math.abs(edge), max), 0);

  const xCoords = rectangles.reduce((coords, {x1, x2}) => [...coords, x1, x2], [] as number[]);
  const width = 2 * (maxScale(xCoords) + margin);

  const yCoords = rectangles.reduce((coords, {y1, y2}) => [...coords, y1, y2], [] as number[]);
  const height = 2 * (maxScale(yCoords) + margin);

  return { height, width };
}
