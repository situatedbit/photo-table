export interface Rectangle {
  x: number,
  y: number,
  height: number,
  width: number,
}

export function largestDimension(rectangles: { height: number, width: number }[]): number {
  return rectangles.reduce((max, {height, width}) => Math.max(max, height, width), 0);
}
