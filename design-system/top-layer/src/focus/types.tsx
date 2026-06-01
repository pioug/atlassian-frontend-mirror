/**
 * An optional callback to restrict which focusable elements are included.
 * Return `true` to include the element, `false` to skip it.
 */
export type TFocusableFilter = (element: HTMLElement, container: HTMLElement) => boolean;
