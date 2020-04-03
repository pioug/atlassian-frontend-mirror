export type Dimensions = {
  width: number;
  height: number;
};

export const getDimensionsFromBlob = (blob: Blob): Promise<Dimensions> => {
  return new Promise<Dimensions>((resolve, reject) => {
    const imageSrc = URL.createObjectURL(blob);
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const dimensions = { width: img.width, height: img.height };

      URL.revokeObjectURL(imageSrc);
      resolve(dimensions);
    };
    img.onerror = reject;
  });
};
