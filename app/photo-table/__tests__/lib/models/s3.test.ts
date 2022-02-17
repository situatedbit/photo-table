import { imageKey } from "@/models/s3";

describe("imageKey", () => {
  const feb17 = 1645122362742; // => 2022-02-17

  test("formats date from time stamp", () => {
    const key = imageKey(feb17, 0, "file-name.jpg");

    expect(key.startsWith("2022-02-17-")).toBe(true);
  });

  test("pads random prefix to six digits", () => {
    const key = imageKey(feb17, 200, "file.jpg");

    expect(key).toEqual("2022-02-17-000200-file.jpg");
  });

  test("clips random prefix at six digits", () => {
    const key = imageKey(feb17, 123456789, "file.jpg");

    expect(key).toEqual("2022-02-17-456789-file.jpg");
  });

  test("replaces non-alpha-numeric/latin characters with hyphen", () => {
    const key = imageKey(feb17, 123456, "f@le*na me….jpg");

    expect(key).toEqual("2022-02-17-123456-f-le-na-me-.jpg");
  });

  test("will omit file name if all characters are non-latin", () => {
    const key = imageKey(feb17, 123456, "@*…");

    expect(key).toEqual("2022-02-17-123456-");
  });

  test("removes double hyphens", () => {
    const key = imageKey(feb17, 123456, "file     name.jpg");

    expect(key).toEqual("2022-02-17-123456-file-name.jpg");
  });

  test("trims hyphens from beginning and end of string", () => {
    const key = imageKey(feb17, 123456, "   file.jpg   ");

    expect(key).toEqual("2022-02-17-123456-file.jpg");
  });

  test("downcases file name", () => {
    const key = imageKey(feb17, 123456, "FILE.JPG");

    expect(key).toEqual("2022-02-17-123456-file.jpg");
  });
});
