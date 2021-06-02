const maxEmojiSizeInBytes = 1048576;

export const getNaturalImageSize = (
  dataURL: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    });
    img.addEventListener('error', reject);
    img.src = dataURL;
  });
};

export const parseImage = (dataURL: string): Promise<{ src: string }> => {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => resolve({ src: img.src });
    img.onerror = () => reject();
    img.src = dataURL;
  });
};

export const hasFileExceededSize = (file: File): boolean => {
  return file && file.size > maxEmojiSizeInBytes;
};

// Duplicates https://bitbucket.org/atlassian/atlaskit/src/0e843df6df8bcd33fa7fc16cc63f11a0f6094957/packages/media-core/src/utils/checkWebpSupport.ts?at=master&fileviewer=file-view-default
// Didn't want to depend on the whole of media-core just for this util

/**
 * Checks if Webp support is enabled in the browser.
 * We know that creating a new image in memory and checking its height,
 * later on we cache this value forever.
 */
let isWebpSupported: boolean | undefined;

export const checkWebpSupport = (): Promise<boolean> => {
  if (isWebpSupported !== undefined) {
    return Promise.resolve(isWebpSupported);
  }

  return new Promise((resolve) => {
    const img = new Image();

    const checkSupport = () => {
      isWebpSupported = img.height === 2;
      resolve(isWebpSupported);
    };

    img.addEventListener('load', checkSupport);
    img.addEventListener('error', checkSupport);
    img.src =
      'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
  });
};

export const imageAcceptHeader = (): Promise<string> =>
  checkWebpSupport().then((isWebpSupported) => {
    // q=0.8 stands for 'quality factor' => http://stackoverflow.com/a/10496722
    const noWebpAcceptHeader = 'image/*,*/*;q=0.8';
    const webpAcceptHeader = 'image/webp,image/*,*/*;q=0.8';

    return isWebpSupported ? webpAcceptHeader : noWebpAcceptHeader;
  });
