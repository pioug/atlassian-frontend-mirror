import React, { useEffect } from 'react';

/**
 * Custom hook to detect when user action is outside given container ref
 * @param ref ref object to an html element
 * @param callback event callback when detected a click outside the ref object
 * @param type (Optional) type of event to listen to. @default click
 * @param useCapture (Optional) use capture phase of event. @default false
 * @param enabled (Optional) enable/disable the outside click handler. @default true
 */
export function useClickAway(
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  type: 'click' | 'mousedown' | 'touchstart' = 'click',
  useCapture: boolean = false,
  enabled: boolean = true,
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: any) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target) &&
        enabled
      ) {
        callback();
      }
    }
    // Bind the event listener
    document.addEventListener(type, handleClickOutside, useCapture);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener(type, handleClickOutside, useCapture);
    };
  }, [ref, callback, type, useCapture, enabled]);
}
