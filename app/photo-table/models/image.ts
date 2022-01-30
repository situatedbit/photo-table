import Rectangle from './rectangle';

export interface Image {
  id: string,
  left: number,
  pixelHeight: number,
  pixelWidth: number,
  top: number,
  url: string,
  zIndex: number,
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

export async function fetchImage(url: string): HTMLImageElement {
  const response = await fetch(url);
  const blob = await response.blob();
  const image = new Image();
  image.src = URL.createObjectURL(blob);

  return new Promise((resolve) => {
    const handleImageLoad = () => {
      image.removeEventListener('load', handleImageLoad);
      resolve(image);
    };

    image.addEventListener('load', handleImageLoad);
  });
}
