const capitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1);

export const vendorify = (
  propName: string,
  capitalizeText: boolean = true,
): string => {
  let prefix = '';

  if ((HTMLElement as any).prototype.webkitRequestFullscreen) {
    prefix = 'webkit';
  } else if ((HTMLElement as any).prototype['mozRequestFullScreen']) {
    prefix = 'moz';
  } else if ((HTMLElement as any).prototype['msRequestFullScreen']) {
    prefix = 'ms';
  }

  const capitalizeProp =
    capitalizeText !== undefined ? capitalizeText : !!prefix;

  return `${prefix}${capitalizeProp ? capitalize(propName) : propName}`;
};

export const requestFullscreen = (element: HTMLElement) => {
  const methodName = vendorify('requestFullScreen');

  if (methodName && (element as any)[methodName]) {
    (element as any)[methodName]();
  }
};

export const exitFullscreen = () => {
  const methodName = vendorify('exitFullscreen');

  if (methodName && (document as any)[methodName]) {
    (document as any)[methodName]();
  }
};

export const getFullscreenElement = (): HTMLElement | undefined => {
  const propertyName = vendorify('fullscreenElement');

  return propertyName && (document as any)[propertyName];
};

export const toggleFullscreen = (element?: HTMLElement) => {
  if (getFullscreenElement()) {
    exitFullscreen();
  } else if (element) {
    requestFullscreen(element);
  }
};
