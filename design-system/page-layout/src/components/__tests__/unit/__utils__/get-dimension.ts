export const getDimension = (slotName: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${slotName}`);
