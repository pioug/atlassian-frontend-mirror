export type Dimensions = {
  width: number;
  height: number;
};

export const getImageDimensionsFromBlob = (url: string): Promise<Dimensions> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve({ width: img.width, height: img.height });
    img.onerror = reject;
  });
