import { appendImageOp, appendImagesOps, removeImageOp } from "@/models/doc";
import { Image } from "@/models/image";

const imageStub = () =>
  ({
    id: "",
    left: 0,
    pixelHeight: 0,
    pixelWidth: 0,
    top: 0,
    zIndex: 0,
  } as Image);

describe("appendImageOp", () => {
  const image = imageStub();

  describe("when there are no images", () => {
    test("path is zeroith position", () => {
      expect(appendImageOp(0, image).p[1]).toBe(0);
    });
  });

  describe("when there are existing images", () => {
    test("path is images array length", () => {
      expect(appendImageOp(1, image).p[1]).toBe(1);
    });

    test("list item is the image", () => {
      expect(appendImageOp(1, image).li).toEqual(image);
    });

    test("path includes images key", () => {
      expect(appendImageOp(1, image).p[0]).toBe("images");
    });
  });
});

describe("appendImagesOps", () => {
  test("list of size 0", () => {
    const images = [imageStub(), imageStub()];

    const ops = appendImagesOps(0, images);

    expect(ops.length).toBe(2);
    expect(ops[0].p[1]).toBe(0);
    expect(ops[1].p[1]).toBe(1);
  });

  test("append 0 images", () => {
    const ops = appendImagesOps(0, []);

    expect(ops.length).toBe(0);
  });

  test("append multiple images", () => {
    const images = [imageStub(), imageStub()];

    const ops = appendImagesOps(10, images);

    expect(ops[0].p[1]).toBe(10);
    expect(ops[1].p[1]).toBe(11);
  });
});

describe("removeImageOp", () => {
  const image = imageStub();

  test("is valid remove op", () => {
    const op = removeImageOp(image, 5);

    expect(op.p).toEqual(["images", 5]);
    expect(op.ld).toBe(image);
  });
});
