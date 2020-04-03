export const updateOverflowShadows = (
  wrapper?: HTMLElement | null,
  table?: HTMLElement | null,
  rightShadow?: HTMLElement | null,
  leftShadow?: HTMLElement | null,
) => {
  // Right shadow
  if (table && wrapper) {
    if (rightShadow) {
      const diff = table.offsetWidth - wrapper.offsetWidth;
      rightShadow.style.display =
        diff > 0 && diff > wrapper.scrollLeft ? 'block' : 'none';
    }
    if (leftShadow) {
      leftShadow.style.display = wrapper.scrollLeft > 0 ? 'block' : 'none';
    }
  }
  return;
};
