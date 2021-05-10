import { useEffect } from 'react';

/**
 * Assigns an event listener to the passed in element and cleans up after itself.
 * This event will not flow through the React event system,
 * which means it could add lots of event listeners affecting performance.
 * Use with caution.
 *
 * ```
 * useElementEvent(element, 'click', callback, true);
 * ```
 *
 * @param element
 * @param eventName
 * @param callback Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 * @param options Ensure a stable reference else you will have your event bound/unbound unexpectedly.
 */
export default function useElementEvent<
  TEventName extends keyof HTMLElementEventMap
>(
  element: HTMLElement,
  eventName: TEventName,
  callback: (this: Element, ev: HTMLElementEventMap[TEventName]) => void,
  options?: boolean | AddEventListenerOptions,
): void {
  useEffect(() => {
    element.addEventListener(eventName, callback, options);

    return () => {
      element.removeEventListener(eventName, callback, options);
    };
  }, [eventName, callback, element, options]);
}
