import { largestDimension } from '../../models/rectangle';

describe('largestDimension', () => {
  test('empty array', () => {
    expect(largestDimension([])).toBe(0);
  });

  test('largest dimension is a width', () => {
    expect(largestDimension([{ width: 10, height: 5 }, { width: 20, height: 7}])).toBe(20);
  });

  test('largest dimension is a height', () => {
    expect(largestDimension([{ width: 10, height: 20 }, { width: 10, height: 5 }])).toBe(20);
  });
});
