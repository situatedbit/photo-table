import { key } from "@/models/s3";

describe("key", () => {
  const feb17 = 1645122362742; // => 2022-02-17

  test("formats date from time stamp", () => {
    const result = key(['images'], feb17, 0, "file-name.jpg");

    expect(result.startsWith("images/2022-02-17-")).toBe(true);
  });

  test("pads random prefix to six digits", () => {
    const result = key(["images"], feb17, 200, "file.jpg");

    expect(result).toEqual("images/2022-02-17-000200-file.jpg");
  });

  test("clips random prefix at six digits", () => {
    const result = key(["images"], feb17, 123456789, "file.jpg");

    expect(result).toEqual("images/2022-02-17-456789-file.jpg");
  });

  test("replaces non-alpha-numeric/latin characters with hyphen", () => {
    const result = key(["images"], feb17, 123456, "f@le*na me….jpg");

    expect(result).toEqual("images/2022-02-17-123456-f-le-na-me-.jpg");
  });

  test("will omit file name if all characters are non-latin", () => {
    const result = key(["images"], feb17, 123456, "@*…");

    expect(result).toEqual("images/2022-02-17-123456-");
  });

  test("removes double hyphens", () => {
    const result = key(["images"], feb17, 123456, "file     name.jpg");

    expect(result).toEqual("images/2022-02-17-123456-file-name.jpg");
  });

  test("trims hyphens from beginning and end of string", () => {
    const result = key(["images"], feb17, 123456, "   file.jpg   ");

    expect(result).toEqual("images/2022-02-17-123456-file.jpg");
  });

  test("downcases file name", () => {
    const result = key(["images"], feb17, 123456, "FILE.JPG");

    expect(result).toEqual("images/2022-02-17-123456-file.jpg");
  });

  test("joins path elements", () => {
    const result = key(["images", "to", "download"], feb17, 123456, "FILE.JPG");

    expect(result).toEqual("images/to/download/2022-02-17-123456-file.jpg");
  });

  test("handles empty path", () => {
    const result = key([], feb17, 123456, "FILE.JPG");

    expect(result).toEqual("2022-02-17-123456-file.jpg");
  });
});
