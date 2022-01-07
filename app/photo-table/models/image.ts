import Rectangle from './rectangle';

export interface Image extends Rectangle {
  id: string,
  url: string,
  zIndex: number,
}

export async function fetchImage(url: string): HTMLImageElement {
  const response = await fetch(url);
  const blob = await response.blob();
  const image = new Image();
  image.src = URL.createObjectURL(blob);

  return image;
}
