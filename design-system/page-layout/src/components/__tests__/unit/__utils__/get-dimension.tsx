export const getDimension = (slotName: string): string =>
	getComputedStyle(document.documentElement).getPropertyValue(`--${slotName}`);
