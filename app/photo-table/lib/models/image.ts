import { centerOnPoint, Point, Rectangle } from "./rectangle";

export interface Image {
  id: string;
  left: number;
  pixelHeight: number;
  pixelWidth: number;
  top: number;
  url: string;
  zIndex: number;
}

function defaultImage(): Image {
  return {
    id: "",
    left: 0,
    pixelHeight: 0,
    pixelWidth: 0,
    top: 0,
    url: "",
    zIndex: 0,
  };
}

export function plotImage(image: Image): Rectangle {
  const { left, pixelHeight, pixelWidth, top } = image;

  return {
    x1: left,
    x2: left + pixelWidth,
    y1: top,
    y2: top - pixelHeight,
  };
}

export function centerImageOnPoint(image: Image, point: Point): Image {
  const { x1: left, y1: top } = centerOnPoint(plotImage(image), point);

  return { ...image, left, top };
}

export async function fetchImage(url: string): Promise<Image> {
  const response = await fetch(url);
  const blob = await response.blob();
  const imageEl = new Image();
  imageEl.src = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    const handleImageLoad = () => {
      imageEl.removeEventListener("load", handleImageLoad);

      resolve({
        ...defaultImage(),
        url,
        pixelHeight: imageEl.naturalHeight,
        pixelWidth: imageEl.naturalWidth,
      });
    };

    imageEl.addEventListener("load", handleImageLoad);
  });
}
