import { appendImageOp } from '@/models/doc';
import { Image } from '@/models/image';

const imageMock = () => ({
  id: '',
  left: 0,
  pixelHeight: 0,
  pixelWidth: 0,
  top: 0,
  url: '',
  zIndex: 0,
}) as Image;

describe('appendImageOp', () => {
  const image = imageMock();

  describe('when there are no images', () => {
    test('path is zeroith position', () => {
      expect(appendImageOp([], image)[0].p[1]).toBe(0);
    });
  });

  describe('when there are existing images', () => {
    const images = [imageMock()];

    test('path is images array length', () => {
      expect(appendImageOp(images, image)[0].p[1]).toBe(1);
    });

    test('list item is the image', () => {
      expect(appendImageOp(images, image)[0].li).toEqual(image);
    });

    test('path includes images key', () => {
      expect(appendImageOp(images, image)[0].p[0]).toBe('images');
    });
  });
});
