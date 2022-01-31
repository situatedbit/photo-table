import { height, width, Rectangle } from '@/models/rectangle';
import { boundingBox, Surface } from '@/models/surface';

describe('boundingBox', () => {
  test('any empty box has no width or height beyond margin', () => {
    expect(boundingBox([] as Rectangle[], 10).width).toBe(20);
    expect(boundingBox([] as Rectangle[], 10).height).toBe(20);
  });

  describe('a single rectangle centered on the origin', () => {
    const centeredRectangle = { x1: -50, y1: 25, x2: 50, y2: -25 };
    const margin = 10;
    test('the size of box be the size of the rectangle with margin', () => {
      expect(boundingBox([centeredRectangle], margin).width).toBe(width(centeredRectangle) + margin * 2);
      expect(boundingBox([centeredRectangle], margin).height).toBe(height(centeredRectangle) + margin * 2);
    });
  });

  describe('two exclusive rectangles', () => {
    const a = { x1: -100, y1: 100, x2: -95, y2: 95 };
    const b = { x1: 200, y1: -300, x2: 205, y2: -305 };
    const margin = 10;

    test('the size of the box accommodates both rectangles plus margin', () => {
      const box = boundingBox([a, b], margin);

      expect(box.width).toBe(2 * (200 + 5 + margin));
      expect(box.height).toBe(2 * (300 + 5 + margin));
    });
  });

  describe('two rectangles, one wholly inside the other', () => {
    describe('two exclusive rectangles', () => {
      const big = { x1: -100, y1: 100, x2: 100, y2: -100 };
      const small = { x1: -10, y1: 10, x2: 10, y2: -10 };
      const margin = 10;

      test('the size of the box accommodates just the big one', () => {
        const box = boundingBox([big, small], margin);

        expect(box.width).toBe(200 + 2 * margin);
        expect(box.height).toBe(200 + 2 * margin);
      });
    });
  });

  describe('two intersecting rectangles', () => {
    const leftMost = { x1: -20, y1: 20, x2: 0, y2: 0 };
    const rightMost = { x1: -5, y1: 10, x2: 15, y2: -10 };
    const margin = 10;

    test('the size of the box fits both', () => {
      const box = boundingBox([leftMost, rightMost], margin);

      expect(box.width).toBe((20 + 10) * 2);
      expect(box.height).toBe((20 + 10) * 2);
    })
  });
});
