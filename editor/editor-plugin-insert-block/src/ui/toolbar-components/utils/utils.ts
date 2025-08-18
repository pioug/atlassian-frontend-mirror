/**
 * Checks if an element is detached (i.e. not in the current document)
 */
export const isDetachedElement = (el: HTMLElement) => !document.body.contains(el);
