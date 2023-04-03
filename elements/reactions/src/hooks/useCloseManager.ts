import React, { useEffect } from 'react';

type callbackType = 'CLICK_OUTSIDE' | 'ESCAPE';

/**
 * Custom hook to detect when user action is outside given container ref or press escape key
 * @param ref ref object to an html element
 * @param callback event callback when detected a click outside the ref object or escape key is pressed
 * @param useCapture (Optional) use capture phase of event. @default false
 * @param enabled (Optional) enable/disable the outside click or escape key press handler. @default true
 */
export function useCloseManager(
  ref: React.RefObject<HTMLElement>,
  callback: (type: callbackType) => void,
  useCapture: boolean = false,
  enabled: boolean = true,
) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        callback('CLICK_OUTSIDE');
      }
    }

    function handleKeydown(event: KeyboardEvent | React.KeyboardEvent) {
      const { key } = event;
      if (key === 'Escape' || key === 'Esc') {
        callback('ESCAPE');
      }
    }

    // Bind the event listener
    document.addEventListener('click', handleClickOutside, useCapture);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('click', handleClickOutside, useCapture);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, [ref, callback, useCapture, enabled]);
}
