/**
 * Find a child element inside a ref.
 */
export const getChildElement = (
  ref: React.RefObject<HTMLElement>,
  selector: string,
) =>
  ref.current ? ref.current.querySelector<HTMLElement>(selector) : undefined;

/**
 * Get the available width of the inline card.
 * (Mainly here to make the component unit testable.)
 */
export const getInlineCardAvailableWidth = (
  startEl: HTMLElement,
  endEl: HTMLElement,
) => {
  const start = startEl.getBoundingClientRect().left;
  const end = endEl.getBoundingClientRect().left;

  return end - start;
};

/**
 * Get max and min width of an overlay.
 * (Mainly here to make the component unit testable.)
 */
export const getOverlayWidths = (
  overlayEl: HTMLElement,
  labelEl: HTMLElement,
) => {
  const max = overlayEl.getBoundingClientRect().width;
  const min = max - labelEl.getBoundingClientRect().width;

  return { max, min };
};
