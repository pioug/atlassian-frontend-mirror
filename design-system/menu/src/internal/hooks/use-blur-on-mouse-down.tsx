import { MouseEventHandler, useCallback } from 'react';

export const useBlurOnMouseDown = (
  userLandCallback?: MouseEventHandler<HTMLElement>,
): MouseEventHandler<HTMLElement> => {
  const callback: MouseEventHandler<HTMLElement> = useCallback(
    (e) => {
      const currentTarget = e.currentTarget;
      const focusedDuringMouseDown = currentTarget === document.activeElement;
      userLandCallback && userLandCallback(e);

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
    },
    [userLandCallback],
  );

  return callback;
};
