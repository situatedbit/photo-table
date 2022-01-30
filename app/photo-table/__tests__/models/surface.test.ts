import { height, width, Rectangle } from '../../models/rectangle';
import { boundingBox, centerOnRectangle, Surface } from '../../models/surface';

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

describe('centerOnRectangle', () => {
  test('width is passed through', () => {
    expect(width(centerOnRectangle(10, 20, { x1: 0, y1: 0, x2: 5, y2: -5 }))).toBe(10);
  })

  test('height is passed through', () => {
    expect(height(centerOnRectangle(10, 20, { x1: 0, y1: 0, x2: 5, y2: -5 }))).toBe(20);
  });

  describe('when reference rectangle centered on origin', () => {
    const rectangle = { x1: -5, y1: 5, x2: 5, y2: -5 };

    test('should be centered on origin', () => {
      const result = centerOnRectangle(20, 20, rectangle);

      expect(result.x1).toBe(-10);
      expect(result.y1).toBe(10);
    });
  });

  describe('when reference rectangle is smaller than width and height', () => {
    const rectangle = { x1: 0, y1: 0, x2: 20, y2: -20 };

    test('should be centered in middle of rectangle', () => {
      const result = centerOnRectangle(100, 200, rectangle);

      expect(result.x1).toBe(-40);
      expect(result.y1).toBe(90);
    });
  });

  describe('when reference rectangle is larger than width and height', () => {
    const rectangle = { x1: 0, y1: 0, x2: 20, y2: -20 };

    test('should be centered in middle of rectangle', () => {
      const result = centerOnRectangle(8, 8, rectangle);

      expect(result.x1).toBe(6);
      expect(result.y1).toBe(-6);
    });
  });

  describe('when width and height are 0', () => {
    const rectangle = { x1: 0, y1: 0, x2: 20, y2: -20 };

    test('should include x and y at center of rectangle', () => {
      const result = centerOnRectangle(0, 0, rectangle);

      expect(result.x1).toBe(10);
      expect(result.y2).toBe(-10);
      expect(result.x2).toBe(10);
      expect(result.y2).toBe(-10);
    });
  });

  describe('when reference rectangle width and height are 0', () => {
    const rectangle = { x1: 50, y1: 50, x2: 50, y2: 50 };

    test('should be centered on reference rectangle x and y', () => {
      const result = centerOnRectangle(100, 200, rectangle);

      expect(result.x1).toBe(0);
      expect(result.y1).toBe(150);
    });
  });
});
