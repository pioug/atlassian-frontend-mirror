import { useEffect } from 'react';

/**
 * Assigns an event listener to the window and cleans up after itself.
 * This event will not flow through the React event system,
 * which means it could add lots of event listeners affecting performance.
 * Use with caution.
 *
 * ```
 * useWindowEvent('click', callback, true);
 * ```
 *
 * @param eventName
 * @param callback Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 * @param options Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 */
export default function useWindowEvent<TEventName extends keyof WindowEventMap>(
  eventName: TEventName,
  callback: (this: Window, ev: WindowEventMap[TEventName]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    window.addEventListener(eventName, callback, options);

    return () => {
      window.removeEventListener(eventName, callback, options);
    };
  }, [eventName, callback, options]);
}
