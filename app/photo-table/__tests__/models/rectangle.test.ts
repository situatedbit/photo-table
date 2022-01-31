import { center, centerOnPoint, largestSide } from '../../models/rectangle';

describe('center', () => {
  describe('rectangle of no size', () => {
    const r = { x1: 10, y1: 10, x2: 10, y2: 10 };

    test('is centered on first coordinates', () => {
      expect(center(r)).toEqual({ x: 10, y: 10});
    });
  });

  describe('rectangle that starts at the upper left', () => {
    const r = { x1: -10, y1: 10, x2: 0, y2: 0 };

    test('is center to the right and below first coordinate', () => {
      expect(center(r)).toEqual({ x: -5, y: 5 });
    });
  });

  describe('rectangle that starts from the bottom right', () => {
    const r = { x1: 10, y1: -10, x2: 0, y2: 0 };

    test('is center to the left and above first coordinate', () => {
      expect(center(r)).toEqual({ x: 5, y: -5 });
    });
  });
});

describe('centerOnPoint', () => {
  describe('rectangle that starts at the upper left', () => {
    const r = { x1: -10, y1: 10, x2: 0, y2: 0 };

    test('is centered, retaining coordinates relative position', () => {
      expect(centerOnPoint(r, { x: 0, y: 0 })).toEqual({ x1: -5, y1: 5, x2: 5, y2: -5 });
    });
  });

  describe('rectangle that starts from the bottom right', () => {
    const r = { x1: 10, y1: -10, x2: 0, y2: 0 };

    test('is center to the left and above first coordinate', () => {
      expect(centerOnPoint(r, { x: 0, y: 0 })).toEqual({ x1: 5, y1: -5, x2: -5, y2: 5 });
    });
  });
});

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
