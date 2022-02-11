import { appendImageOp, removeImageOp } from '@/models/doc';
import { Image } from '@/models/image';

const imageStub = () => ({
  id: '',
  left: 0,
  pixelHeight: 0,
  pixelWidth: 0,
  top: 0,
  url: '',
  zIndex: 0,
}) as Image;

describe('appendImageOp', () => {
  const image = imageStub();

  describe('when there are no images', () => {
    test('path is zeroith position', () => {
      expect(appendImageOp([], image).p[1]).toBe(0);
    });
  });

  describe('when there are existing images', () => {
    const images = [imageStub()];

    test('path is images array length', () => {
      expect(appendImageOp(images, image).p[1]).toBe(1);
    });

    test('list item is the image', () => {
      expect(appendImageOp(images, image).li).toEqual(image);
    });

    test('path includes images key', () => {
      expect(appendImageOp(images, image).p[0]).toBe('images');
    });
  });
});

describe('removeImageOp', () => {
  const image = imageStub();

  test('is valid remove op', () => {
    const op = removeImageOp(image, 5);

    expect(op.p).toEqual(['images', 5]);
    expect(op.ld).toBe(image);
  })
});
