export type InsertedImageProperties = {
  src?: string;
  alt?: string;
  title?: string;
};

export type ImageUploadProvider = (
  e: Event | undefined,
  insertImageFn: (props: InsertedImageProperties) => void,
) => void;
