export const takeSnapshot = async (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);

    const video = document.createElement('video');

    video.preload = 'metadata';
    video.src = url;
    video.muted = true;

    video.play().catch(() => {
      return reject(new Error('failed to play video'));
    });

    // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
    video.addEventListener('timeupdate', function timeUpdateHandler() {
      // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
      video.removeEventListener('timeupdate', timeUpdateHandler);
      video.pause();
      URL.revokeObjectURL(url);
      //create canvas to draw our first frame on.

      if (!video.videoWidth && !video.videoHeight) {
        return reject(new Error('error retrieving video dimensions'));
      }

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');

      if (!context) {
        return reject(new Error('error creating canvas context'));
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const dataURL = canvas.toDataURL('image/jpeg', 0.85);
      resolve(dataURL);
    });

    // eslint-disable-next-line @repo/internal/dom-events/no-unsafe-event-listeners
    video.addEventListener('error', () => {
      reject(new Error('failed to load video'));
      URL.revokeObjectURL(url);
    });
  });
};
