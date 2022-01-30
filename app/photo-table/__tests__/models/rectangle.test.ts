import { largestSide } from '../../models/rectangle';

describe('largestSide', () => {
  test('empty array', () => {
    expect(largestSide([])).toBe(0);
  });

  test('largest dimension is a width', () => {
    const rectangles = [
      { x1: 0, x2: 20, y1: 0, y2: 5 },
      { x1: 0, x2: 10, y1: 0, y2: 2.5 },
    ];

    expect(largestSide(rectangles)).toBe(20);
  });

  test('largest dimension is a height', () => {
    const rectangles = [
      { x1: 0, x2: 5, y1: 0, y2: 20 },
      { x1: 0, x2: 10, y1: 0, y2: 7 },
    ];

    expect(largestSide(rectangles)).toBe(20);
  });
});
