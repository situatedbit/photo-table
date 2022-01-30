export interface Rectangle {
  x1: number,
  y1: number,
  x2: number,
  y2: number,
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
