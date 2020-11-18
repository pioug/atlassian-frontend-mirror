const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

const browserPrefixes = ['', 'moz', 'webkit', 'ms'];
export const findVendorSpecificProp = (
  object: any,
  propNames: string | string[],
): any => {
  if (!Array.isArray(propNames)) {
    propNames = [propNames];
  }
  for (let i = 0; i < propNames.length; i++) {
    for (let j = 0; j < browserPrefixes.length; j++) {
      const propName = browserPrefixes[j] + propNames[i];
      if (object[propName]) {
        return propName;
      }
      const capPropName = browserPrefixes[j] + capitalize(propNames[i]);
      if (object[capPropName]) {
        return capPropName;
      }
    }
  }
};

export const requestFullscreen = (element: HTMLElement) => {
  const requestFullscreenProp = findVendorSpecificProp(element, [
    'requestFullScreen',
    'requestFullscreen',
  ]);

  if ((element as any)[requestFullscreenProp]) {
    (element as any)[requestFullscreenProp]();
  }
};

export const exitFullscreen = () => {
  const exitFullScreenProp = findVendorSpecificProp(document, [
    'exitFullScreen',
    'exitFullscreen',
  ]);

  if ((document as any)[exitFullScreenProp]) {
    (document as any)[exitFullScreenProp]();
  }
};

export const getFullscreenElement = (): HTMLElement | undefined => {
  return findVendorSpecificProp(document, [
    'fullScreenElement',
    'fullscreenElement',
  ]);
};

export const toggleFullscreen = (element?: HTMLElement) => {
  if (getFullscreenElement()) {
    exitFullscreen();
  } else if (element) {
    requestFullscreen(element);
  }
};
