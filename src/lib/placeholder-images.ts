import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

export const placeholderImages: ImagePlaceholder[] = data.placeholderImages;

const imageMap = new Map<string, ImagePlaceholder>(
  placeholderImages.map((img) => [img.id, img])
);

export function getImageById(id: string): ImagePlaceholder | undefined {
  return imageMap.get(id);
}
