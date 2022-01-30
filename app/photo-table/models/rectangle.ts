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

export function largestDimension(rectangles: Rectangle[]): number {
  return rectangles.reduce((max, r) => Math.max(max, height(r), width(r)), 0);
}
