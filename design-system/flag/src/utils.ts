import { MouseEvent } from 'react';

// Prevent a focus ring if clicked
export const onMouseDownBlur = (e: MouseEvent<HTMLElement>) => {
  const currentTarget = e.currentTarget;
  const focusedDuringMouseDown = currentTarget === document.activeElement;

  requestAnimationFrame(() => {
    if (
      focusedDuringMouseDown &&
      currentTarget !== document.activeElement &&
      document.body.contains(currentTarget)
    ) {
      currentTarget.focus();
      return;
    }

    if (
      !focusedDuringMouseDown &&
      document.activeElement &&
      document.activeElement instanceof HTMLElement
    ) {
      document.activeElement.blur();
    }
  });
};
