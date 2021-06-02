/**
 * Checks if Webp support is enabled in the browser.
 * We know that creating a new image in memory and checking its height,
 * later on we cache this value forever.
 */
let isSupported: boolean;

export const checkWebpSupport = (): Promise<boolean> => {
  if (isSupported !== undefined) {
    return Promise.resolve(isSupported);
  }

  return new Promise((resolve) => {
    const img = new Image();

    // Following base64 encoded binary content is in webp format. If browser supports this standard,
    // 2px height image will be displayed. If not, standard "not found" image placeholder will be
    // displayed and it will be not 2px height.
    img.src =
      'data:image/webp;base64,UklGRi4AAABXRUJQVlA4TCEAAAAvAUAAEB8wAiMwAgSSNtse/cXjxyCCmrYNWPwmHRH9jwMA';
    img.onload = img.onerror = () => {
      isSupported = img.height === 2;

      resolve(isSupported);
    };
  });
};
