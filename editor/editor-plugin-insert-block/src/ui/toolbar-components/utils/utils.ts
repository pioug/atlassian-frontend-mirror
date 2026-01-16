/**
 * Checks if an element is detached (i.e. not in the current document)
 */
export const isDetachedElement = (el: HTMLElement): boolean => !document.body.contains(el);
