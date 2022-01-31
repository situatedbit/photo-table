export interface Rectangle {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
}

interface Point {
  x: number,
  y: number,
}

export function center(r: Rectangle): Point {
  return {
    x: r.x1 - (r.x1 - r.x2) / 2,
    y: r.y1 - (r.y1 - r.y2) / 2,
  };
}

export function height(r: Rectangle): number {
  return Math.abs(r.y2 - r.y1);
}

export function width(r: Rectangle): number {
  return Math.abs(r.x2 - r.x1);
}

export function largestSide(rectangles: Rectangle[]): number {
  return rectangles.reduce((max, r) => Math.max(max, height(r), width(r)), 0);
}

export function translate(rectangle: Rectangle, x, y): Rectangle {
  return {
    x1: rectangle.x1 + x,
    y1: rectangle.y1 + y,
    x2: rectangle.x2 + x,
    y2: rectangle.y2 + y,
  };
}

export function centerOnPoint(r: Rectangle, { x, y } : Point): Rectangle {
  const { x: centerX, y: centerY } = center(r);
  const translateX = x - centerX;
  const translateY = y - centerY;

  return translate(r, translateX, translateY);
}
