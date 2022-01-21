import { Rectangle } from './rectangle';
import { boundingBox, centerOnRectangle, Surface } from '../../models/surface';

describe('boundingBox', () => {
  test('any empty box has no width or height beyond margin', () => {
    expect(boundingBox([] as Rectangle[], 10).width).toBe(20);
    expect(boundingBox([] as Rectangle[], 10).height).toBe(20);
  });

  describe('a single rectangle centered on the origin', () => {
    const centeredRectangle = { x: -50, y: 25, width: 100, height: 50 };
    const margin = 10;
    test('the size of box be the size of the rectangle with margin', () => {
      expect(boundingBox([centeredRectangle], margin).width).toBe(centeredRectangle.width + margin * 2);
      expect(boundingBox([centeredRectangle], margin).height).toBe(centeredRectangle.height + margin * 2);
    });
  });

  describe('two exclusive rectangles', () => {
    const a = { x: -100, y: 100, width: 5, height: 5 };
    const b = { x: 200, y: -300, width: 5, height: 5 };
    const margin = 10;

    test('the size of the box accommodates both rectangles plus margin', () => {
      const box = boundingBox([a, b], margin);

      expect(box.width).toBe(2 * (200 + 5 + margin));
      expect(box.height).toBe(2 * (300 + 5 + margin));
    });
  });

  describe('two rectangles, one wholly inside the other', () => {
    describe('two exclusive rectangles', () => {
      const big = { x: -100, y: 100, width: 200, height: 200 };
      const small = { x: -10, y: 10, width: 20, height: 20 };
      const margin = 10;

      test('the size of the box accommodates just the big one', () => {
        const box = boundingBox([big, small], margin);

        expect(box.width).toBe(200 + 2 * margin);
        expect(box.height).toBe(200 + 2 * margin);
      });
    });
  });

  describe('two intersecting rectangles', () => {
    const leftMost = { x: -20, y: 20, width: 20, height: 20 };
    const rightMost = { x: -5, y: 10, width: 20, height: 20 };
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
    expect(centerOnRectangle(10, 20, { x: 0, y: 0, width: 5, height: 5 }).width).toBe(10);
  })

  test('height is passed through', () => {
    expect(centerOnRectangle(10, 20, { x: 0, y: 0, width: 5, height: 5 }).height).toBe(20);
  });

  describe('when reference rectangle centered on origin', () => {
    const rectangle = { x: -10, y: 10, width: 20, height: 20 };

    test('should be centered on origin', () => {
      const result = centerOnRectangle(20, 20, rectangle);

      expect(result.x).toBe(-10);
      expect(result.y).toBe(10);
    });
  });

  describe('when reference rectangle is smaller than width and height', () => {
    const rectangle = { x: 0, y: 0, width: 20, height: 20 };

    test('should be centered in middle of rectangle', () => {
      const result = centerOnRectangle(100, 200, rectangle);

      expect(result.x).toBe(-40);
      expect(result.y).toBe(90);
    });
  });

  describe('when reference rectangle is larger than width and height', () => {
    const rectangle = { x: 0, y: 0, width: 20, height: 20 };

    test('should be centered in middle of rectangle', () => {
      const result = centerOnRectangle(8, 8, rectangle);

      expect(result.x).toBe(6);
      expect(result.y).toBe(-6);
    });
  });

  describe('when width and height are 0', () => {
    const rectangle = { x: 0, y: 0, width: 20, height: 20 };

    test('should include x and y at center of rectangle', () => {
      const result = centerOnRectangle(0, 0, rectangle);

      expect(result.x).toBe(10);
      expect(result.y).toBe(-10);
    });
  });

  describe('when reference rectangle width and height are 0', () => {
    const rectangle = { x: 50, y: 50, width: 0, height: 0 };

    test('should be centered on reference rectangle x and y', () => {
      const result = centerOnRectangle(100, 200, rectangle);

      expect(result.x).toBe(0);
      expect(result.y).toBe(150);
    });
  });
});
