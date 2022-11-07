export interface Dimensions {
  width: number;
  height: number;
}

export const getVideoDimensionsFromBlob = async (
  blob: Blob,
): Promise<Dimensions> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);

    const video = document.createElement('video');

    video.preload = 'metadata';
    video.src = url;
    video.muted = true;

    // loadedmetadata, loadeddata, play, playing
    video.addEventListener('loadedmetadata', function timeupdateHandler() {
      video.removeEventListener('loadedmetadata', timeupdateHandler);
      resolve({ width: video.videoWidth, height: video.videoHeight });
      URL.revokeObjectURL(url);
    });

    video.addEventListener('error', () => {
      reject(new Error('failed to load video'));
      URL.revokeObjectURL(url);
    });
  });
};
